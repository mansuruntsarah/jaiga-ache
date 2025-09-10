import React, { useState, useEffect } from 'react';

const AdminDash = () => {
  const selectedDate = new Date().toISOString().slice(0, 10);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const busRoutes = Array.from({ length: 11 }, (_, i) => i + 1);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('http://localhost:471/api/payments');
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch {
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  function getPaymentsForDate(date) {
    const filtered = payments.filter(p => {
      let payDate = '';
      if (p.dateTime) {
        if (typeof p.dateTime === 'string') {
          payDate = new Date(p.dateTime).toISOString().slice(0, 10);
        } else if (p.dateTime.$date) {
          payDate = new Date(p.dateTime.$date).toISOString().slice(0, 10);
        }
      }
      return payDate === date;
    });
    
    return busRoutes.map(route => {
      const firstTrip = filtered.filter(p => Number(p.busNumber) === route && Number(p.trip) === 1).reduce((sum, p) => sum + Number(p.amount), 0);
      const secondTrip = filtered.filter(p => Number(p.busNumber) === route && Number(p.trip) === 2).reduce((sum, p) => sum + Number(p.amount), 0);
      const firstOutbound = filtered.filter(p => Number(p.busNumber) === route && Number(p.trip) === 3).reduce((sum, p) => sum + Number(p.amount), 0);
      const secondOutbound = filtered.filter(p => Number(p.busNumber) === route && Number(p.trip) === 4).reduce((sum, p) => sum + Number(p.amount), 0);
      return {
        route,
        firstTrip,
        secondTrip,
        firstOutbound,
        secondOutbound
      };
    });
  }
  const dailyPayments = getPaymentsForDate(selectedDate);
  const totalByRoute = dailyPayments.map(row => row.firstTrip + row.secondTrip + row.firstOutbound + row.secondOutbound);
  const grandTotal = totalByRoute.reduce((a, b) => a + b, 0);
  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:471/api/maintenance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMaintenanceLogs(data);
        } else {
          setMaintenanceLogs([]);
        }
      } catch {
        setMaintenanceLogs([]);
      }
    };
    fetchLogs();
  }, []);
  
  const [staffLog, setStaffLog] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRows, setEditRows] = useState([]);
  useEffect(() => {
    const fetchStaffLog = async () => {
      try {
        const res = await fetch('http://localhost:471/api/bus');
        if (res.ok) {
          const data = await res.json();
          setStaffLog(data);
          setEditRows(data.map(row => ({ driver: row.driver, attendant: row.attendant })));
        } else {
          setStaffLog([]);
          setEditRows([]);
        }
      } catch {
        setStaffLog([]);
        setEditRows([]);
      }
    };
    fetchStaffLog();
  }, []);
  
  
  const [fuelLogs, setFuelLogs] = useState([]);
  useEffect(() => {
    const fetchFuelLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:471/api/fuels', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFuelLogs(data);
        } else {
          setFuelLogs([]);
        }
      } catch {
        setFuelLogs([]);
      }
    };
    fetchFuelLogs();
  }, []);
  
  const [activePanel, setActivePanel] = useState('welcome');

  return (
    <div className="min-h-[70vh] flex flex-col items-center">
  <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Welcome, {localStorage.getItem('userName') || 'Admin'}!</h1>
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="w-1/3 bg-gray-100 p-6 flex flex-col gap-4 border-r">
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2 ${activePanel === 'cash' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('cash')}
          >
            Cash Log
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2 ${activePanel === 'staff' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('staff')}
          >
            Staff Log
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2 ${activePanel === 'fuel' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('fuel')}
          >
            Fuel Logs
          </button>
          <button
            className={`w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition ${activePanel === 'maintenance' ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActivePanel('maintenance')}
          >
            Maintenance Log
          </button>
        </div>
        
        <div className="w-2/3 p-8 flex flex-col items-center justify-start">
          {activePanel === 'welcome' && (
            <div className="text-gray-400 text-xl">Select an option from the left panel.</div>
          )}
          {activePanel === 'cash' && (
            <div className="w-full">
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-black text-yellow-400">
                      <th className="px-2 py-2 border">Bus Route</th>
                      <th className="px-2 py-2 border">1st Trip</th>
                      <th className="px-2 py-2 border">2nd Trip</th>
                      <th className="px-2 py-2 border">1st Outbound</th>
                      <th className="px-2 py-2 border">2nd Outbound</th>
                      <th className="px-2 py-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyPayments.map((row, idx) => (
                      <tr key={row.route} className="text-center">
                        <td className="border px-2 py-1 font-semibold">{row.route}</td>
                        <td className="border px-2 py-1">{row.firstTrip}</td>
                        <td className="border px-2 py-1">{row.secondTrip}</td>
                        <td className="border px-2 py-1">{row.firstOutbound}</td>
                        <td className="border px-2 py-1">{row.secondOutbound}</td>
                        <td className="border px-2 py-1 font-bold">{totalByRoute[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-black text-yellow-400 font-bold">
                      <td className="border px-2 py-2 text-right" colSpan={5}>Grand Total</td>
                      <td className="border px-2 py-2">{grandTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          {activePanel === 'staff' && (
            <div className="w-full">
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-black text-yellow-400">
                      <th className="px-2 py-2 border">Bus Number</th>
                      <th className="px-2 py-2 border">Driver</th>
                      <th className="px-2 py-2 border">Attendant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffLog.map((row, idx) => (
                      <tr key={row.busNumber || idx} className="text-center">
                        <td className="border px-2 py-1 font-semibold">{row.busNumber}</td>
                        <td className="border px-2 py-1">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editRows[idx]?.driver || ''}
                              onChange={e => {
                                const updated = [...editRows];
                                updated[idx].driver = e.target.value;
                                setEditRows(updated);
                              }}
                              className="border px-1 py-1 w-24"
                            />
                          ) : row.driver}
                        </td>
                        <td className="border px-2 py-1">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editRows[idx]?.attendant || ''}
                              onChange={e => {
                                const updated = [...editRows];
                                updated[idx].attendant = e.target.value;
                                setEditRows(updated);
                              }}
                              className="border px-1 py-1 w-24"
                            />
                          ) : row.attendant}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                {!isEditing ? (
                  <button
                    className={`w-32 bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2`}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className={`w-32 bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition mb-2`}
                    onClick={async () => {
                      for (let idx = 0; idx < staffLog.length; idx++) {
                        const busNumber = staffLog[idx].busNumber;
                        const { driver, attendant } = editRows[idx];
                        await fetch(`http://localhost:471/api/bus/${busNumber}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ driver, attendant })
                        });
                      }
                      setIsEditing(false);
                      
                      const res = await fetch('http://localhost:471/api/bus');
                      const data = await res.json();
                      setStaffLog(data);
                      setEditRows(data.map(row => ({ driver: row.driver, attendant: row.attendant })));
                    }}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          )}
          {activePanel === 'fuel' && (
            <div className="w-full">
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-black text-yellow-400">
                      <th className="px-2 py-2 border">Bus Route</th>
                      <th className="px-2 py-2 border">Refill Date</th>
                      <th className="px-2 py-2 border">Liters Added</th>
                      <th className="px-2 py-2 border">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelLogs.map((row, idx) => {
                      
                      const getDateString = (dateObj) => {
                        if (!dateObj) return '';
                        if (typeof dateObj === 'string') return new Date(dateObj).toISOString().slice(0, 10);
                        if (dateObj.$date) return new Date(dateObj.$date).toISOString().slice(0, 10);
                        return '';
                      };
                      return (
                        <tr key={row._id || idx} className="text-center">
                          <td className="border px-2 py-1 font-semibold">{row.busNumber}</td>
                          <td className="border px-2 py-1">{getDateString(row.date)}</td>
                          <td className="border px-2 py-1">{row.amount}</td>
                          <td className="border px-2 py-1">{row.cost}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activePanel === 'maintenance' && (
            <div className="w-full">
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-black text-yellow-400">
                      <th className="px-2 py-2 border">Bus/Route</th>
                      <th className="px-2 py-2 border">Last Maintenance Date</th>
                      <th className="px-2 py-2 border">Next Maintenance Date</th>
                      <th className="px-2 py-2 border">Issue Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceLogs.map((row, idx) => {
                      
                      const getDateString = (dateObj) => {
                        if (!dateObj) return '';
                        if (typeof dateObj === 'string') return new Date(dateObj).toISOString().slice(0, 10);
                        if (dateObj.$date) return new Date(dateObj.$date).toISOString().slice(0, 10);
                        return '';
                      };
                      const lastDate = getDateString(row.date);
                      const nextDate = lastDate
                        ? (() => {
                            const d = new Date(lastDate);
                            d.setMonth(d.getMonth() + 4);
                            return d.toISOString().slice(0, 10);
                          })()
                        : '';
                      return (
                        <tr key={row._id || idx} className="text-center">
                          <td className="border px-2 py-1 font-semibold">{row.busNumber}</td>
                          <td className="border px-2 py-1">{lastDate}</td>
                          <td className="border px-2 py-1">{nextDate}</td>
                          <td className="border px-2 py-1">{row.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
