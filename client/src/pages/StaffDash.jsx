
import React, { useState, useEffect } from 'react';

function AttendancePanel({ dutyBus }) {
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [markedToday, setMarkedToday] = useState(dutyBus.attendantAssignedDate === new Date().toISOString().slice(0, 10));
  const today = new Date().toISOString().slice(0, 10);

  const handleMarkAttendance = async () => {
    setLoading(true);
    setAttendanceStatus('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:471/api/bus/attendance/${dutyBus.busNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setAttendanceStatus('Attendance marked for today!');
        if (dutyBus) {
          dutyBus.attendantAssignedDate = today;
          setMarkedToday(true);
        }
      } else {
        const err = await res.json();
        setAttendanceStatus(err.error || 'Failed to mark attendance');
      }
    } catch {
      setAttendanceStatus('Failed to mark attendance');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mb-2 text-lg text-gray-800">Attendance Date: <span className="font-semibold">{markedToday ? today : (dutyBus.attendantAssignedDate || 'Not marked')}</span></div>
      {!markedToday && (
        <button
          className="bg-gray-900 text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-gray-900 transition w-full mt-4"
          onClick={handleMarkAttendance}
          disabled={loading}
        >
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      )}
      {attendanceStatus && (
        <div className="mt-4 text-green-600 font-bold">{attendanceStatus}</div>
      )}
    </>
  );
}



const StaffDash = () => {

  const [fuelUse, setFuelUse] = useState(null);

  const MAX_FUEL = 120;
  const [fuelRemaining, setFuelRemaining] = useState(50);
  const [showFuelPrompt, setShowFuelPrompt] = useState(false);
  const [fuelToAdd, setFuelToAdd] = useState("");
  const [fuelError, setFuelError] = useState("");
  const [activePanel, setActivePanel] = useState('welcome');

  const [reportText, setReportText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);


  const [dutyBus, setDutyBus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(1);
  useEffect(() => {
    const fetchDutyAndBookings = async () => {
      try {

        const busRes = await fetch('http://localhost:471/api/bus');
        if (busRes.ok) {
          const buses = await busRes.json();
          const userName = localStorage.getItem('userName');
          const assignedBus = buses.find(bus => bus.attendant === userName);
          setDutyBus(assignedBus || null);

          if (assignedBus) {
            const today = new Date().toISOString().slice(0, 10);
            const token = localStorage.getItem('token');
            const bookingsRes = await fetch(`http://localhost:471/api/bookings?busNumber=${assignedBus.busNumber}&date=${today}&trip=${selectedTrip}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (bookingsRes.ok) {
              const bookingsData = await bookingsRes.json();
              console.log('Fetched bookings for trip', selectedTrip, bookingsData);
              setBookings(bookingsData);
            } else {
              setBookings([]);
            }
          } else {
            setBookings([]);
          }
        } else {
          setDutyBus(null);
          setBookings([]);
        }
      } catch {
        setDutyBus(null);
        setBookings([]);
      }
    };
    fetchDutyAndBookings();


    const fetchFuelUse = async () => {
      const token = localStorage.getItem('token');
      if (!dutyBus?.busNumber) return;
      try {
        const res = await fetch(`http://localhost:471/api/fuel_use/bus/${dutyBus.busNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const busFuelUse = await res.json();
          setFuelUse(busFuelUse || null);
        } else {
          setFuelUse(null);
        }
      } catch {
        setFuelUse(null);
      }
    };
    fetchFuelUse();
  }, [dutyBus?.busNumber, selectedTrip]);



  return (
    <div className="min-h-[70vh] flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Welcome, {localStorage.getItem('userName') || 'User'}!</h1>
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        <div className="w-1/3 bg-gray-100 p-6 flex flex-col gap-4 border-r">
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2 ${activePanel === 'duty' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('duty')}
          >
            Duty
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2 ${activePanel === 'attendance' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('attendance')}
          >
            Attendance
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition ${activePanel === 'fuel' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('fuel')}
          >
            Fuel
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mt-2 ${activePanel === 'report' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('report')}
          >
            Report
          </button>
        </div>

        <div className="w-2/3 p-8 flex flex-col items-center justify-start">
          {activePanel === 'report' && (
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md text-center shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Report Bus Issue</h2>
              <textarea
                className="border rounded px-4 py-2 mb-4 w-full min-h-[80px]"
                placeholder="Describe any issue with the bus..."
                value={reportText}
                onChange={e => {
                  setReportText(e.target.value);
                  setReportSubmitted(false);
                }}
              />
              <button
                className="bg-gray-900 text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-gray-900 transition w-full"
                disabled={!reportText.trim() || reportSubmitted}
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  const busNumber = dutyBus?.busNumber;
                  const notes = reportText.trim();
                  try {
                    const res = await fetch('http://localhost:471/api/maintenance', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ busNumber, notes })
                    });
                    if (res.ok) {
                      setReportSubmitted(true);
                      setReportText("");
                    } else {
                      setReportSubmitted(false);
                    }
                  } catch {
                    setReportSubmitted(false);
                  }
                }}
              >
                Submit Report
              </button>
              {reportSubmitted && (
                <div className="mt-4 text-green-600 font-bold">Report submitted! This will be used in the next maintenance.</div>
              )}
            </div>
          )}
          {activePanel === 'duty' && (
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-2xl text-center shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Duty Information</h2>
              {dutyBus ? (
                <>
                  <div className="mb-2 text-lg text-gray-800">Bus Number: <span className="font-semibold">{dutyBus.busNumber}</span></div>
                  <div className="mb-2 text-lg text-gray-800">Driver: <span className="font-semibold">{dutyBus.driver}</span></div>
                  <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">Today's Bookings</h3>
                  <div className="mb-4">
                    <label className="font-semibold mr-2">Select Trip:</label>
                    <select
                      className="border rounded px-4 py-2"
                      value={selectedTrip}
                      onChange={e => setSelectedTrip(Number(e.target.value))}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded shadow">
                      <thead>
                        <tr className="bg-black text-yellow-400">
                          <th className="px-2 py-2 border">Token</th>
                          <th className="px-2 py-2 border">Seat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr><td colSpan={2} className="text-center py-2 text-gray-500">No bookings for this trip.</td></tr>
                        ) : (
                          bookings.map((booking, i) => (
                            <tr key={booking._id || i} className="text-center">
                              <td className="border px-2 py-1 font-semibold">{booking.tokenNumber}</td>
                              <td className="border px-2 py-1">{booking.seatNumber}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="mb-2 text-lg text-red-600">No duty assigned.</div>
              )}
            </div>
          )}
          {activePanel === 'fuel' && (
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md text-center shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Fuel Log</h2>
              {fuelUse ? (
                <>
                  <div className="mb-2 text-lg text-gray-800">Fuel Remaining: <span className="font-semibold">{fuelUse.fuel_status}L</span></div>
                  <div className="mb-2 text-lg text-gray-800">Miles Driven: <span className="font-semibold">{fuelUse.miles_driven}</span></div>
                </>
              ) : (
                <div className="mb-2 text-lg text-gray-800">No fuel usage data available for this bus.</div>
              )}
              {!showFuelPrompt && (
                <button
                  className="bg-black text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-black transition w-full border border-yellow-400 shadow"
                  onClick={() => setShowFuelPrompt(true)}
                  disabled={fuelRemaining >= MAX_FUEL}
                >
                  Add Fuel
                </button>
              )}
              {fuelError && (
                <div className="mt-2 text-red-600 font-semibold">{fuelError}</div>
              )}
              {showFuelPrompt && (
                <div className="mt-4 flex flex-col items-center">
                  <input
                    type="number"
                    min="1"
                    max={fuelUse ? MAX_FUEL - fuelUse.fuel_status : MAX_FUEL}
                    className="border rounded px-4 py-2 mb-2 w-full"
                    placeholder={`Max: ${fuelUse ? MAX_FUEL - fuelUse.fuel_status : MAX_FUEL}L`}
                    value={fuelToAdd}
                    onChange={e => {
                      const val = e.target.value;
                      const maxAdd = fuelUse ? MAX_FUEL - fuelUse.fuel_status : MAX_FUEL;
                      setFuelToAdd(val);
                      if (Number(val) > maxAdd) {
                        setFuelError(`Max capacity reached. You can add up to ${maxAdd}L.`);
                      } else {
                        setFuelError("");
                      }
                    }}
                  />
                  <button
                    className="bg-black text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-black transition w-full border border-yellow-400 shadow"
                    disabled={!fuelToAdd || isNaN(fuelToAdd) || Number(fuelToAdd) <= 0 || Number(fuelToAdd) > (fuelUse ? MAX_FUEL - fuelUse.fuel_status : MAX_FUEL) || fuelError}
                    onClick={async () => {
                      const amount = Number(fuelToAdd);
                      const busNumber = dutyBus?.busNumber;
                      const token = localStorage.getItem('token');
                      try {

                        const res = await fetch('http://localhost:471/api/fuels', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ busNumber, amount })
                        });

                        const newFuelRemaining = (fuelUse ? fuelUse.fuel_status : fuelRemaining) + amount;
                        const fuelUseRes = await fetch('http://localhost:471/api/fuel_use', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ busNumber, fuel_status: newFuelRemaining, miles_driven: 0 })
                        });
                        if (res.ok && fuelUseRes.ok) {
                          setFuelRemaining(newFuelRemaining);
                          setFuelToAdd("");
                          setShowFuelPrompt(false);
                          setFuelError("");

                          try {
                            const refreshRes = await fetch(`http://localhost:471/api/fuel_use/bus/${busNumber}`, {
                              method: 'GET',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              }
                            });
                            if (refreshRes.ok) {
                              const updatedFuelUse = await refreshRes.json();

                              setFuelUse({ ...updatedFuelUse, miles_driven: 0 });
                            }
                          } catch {}
                        } else {
                          setFuelError('Failed to log fuel.');
                        }
                      } catch {
                        setFuelError('Failed to log fuel.');
                      }
                    }}
                  >
                    Confirm Add
                  </button>
                </div>
              )}
            </div>
          )}
          {activePanel === 'attendance' && (
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md text-center shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Mark Attendance</h2>
              {dutyBus ? (
                <AttendancePanel dutyBus={dutyBus} />
              ) : (
                <div className="mb-2 text-lg text-red-600">No duty assigned.</div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default StaffDash;
