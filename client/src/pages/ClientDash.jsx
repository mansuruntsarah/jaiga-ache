import React, { useState, useEffect } from 'react';

const ClientDash = () => {
  const [bookingMode, setBookingMode] = useState(false);
  const [trip, setTrip] = useState('');
  const [route, setRoute] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [mobile, setMobile] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientBookings, setClientBookings] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId');
  const [dashboardTimestamp, setDashboardTimestamp] = useState(() => {
    const ts = localStorage.getItem('dashboardTimestamp');
    return ts ? parseInt(ts) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userId || !token) return;
    fetch(`http://localhost:471/api/bookings/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched bookings:', data);
        if (Array.isArray(data)) {
          setClientBookings(data);
        }
      });
    
    fetch(`http://localhost:471/api/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      });
    fetch(`http://localhost:471/api/payments/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPaymentInfo(data[data.length-1]);
        }
      });
  }, [userId, dashboardTimestamp]);
  useEffect(() => {
    if (!dashboardTimestamp) return;
    const now = Date.now();
    const expiresIn = dashboardTimestamp + 12 * 60 * 60 * 1000 - now;
    if (expiresIn <= 0) {
      setPaymentInfo(null);
      localStorage.removeItem('dashboardTimestamp');
      setDashboardTimestamp(null);
      return;
    }
    const timer = setTimeout(() => {
      setPaymentInfo(null);
      localStorage.removeItem('dashboardTimestamp');
      setDashboardTimestamp(null);
    }, expiresIn);
    return () => clearTimeout(timer);
  }, [dashboardTimestamp]);


    const topRow1 = ["X1", "X2", null, null, "D"];
    const topRow2 = ["X3", "X4", "X5", "X6", "X7"];
    const seatRows = [
      ["A1", "A2", null, "A3", "A4"],
      ["B1", "B2", null, "B3", "B4"],
      ["C1", "C2", null, "C3", "C4"],
      ["D1", "D2", null, "D3", "D4"],
      ["E1", "E2", null, "E3", "E4"],
      ["F1", "F2", null, "F3", "F4"],
      ["G1", "G2", null, "G3", "G4"],
      ["H1", "H2", "H3", "H4", "H5"]
    ];

  const handleSeatClick = (seat) => {
    if (seat === "D") return;
    if (selectedSeat === seat) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Welcome, {localStorage.getItem('userName') || 'User'}!</h1>
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="w-1/3 bg-gray-100 p-6 flex flex-col gap-4 border-r">
          <button
            className="w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
            onClick={() => setBookingMode(true)}
          >
            Book Seat
          </button>
        </div>
        
        <div className="w-2/3 p-8 flex flex-col items-center justify-start">
          {bookingMode ? (
            <>
              
              <div className="flex gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-semibold">Trip</label>
                  <select
                    className="border rounded px-4 py-2"
                    value={trip}
                    onChange={e => setTrip(e.target.value)}
                  >
                    <option value="">Select Trip</option>
                    <option value="1st Trip">1st Trip</option>
                    <option value="2nd Trip">2nd Trip</option>
                    <option value="1st Outbound">1st Outbound</option>
                    <option value="2nd Outbound">2nd Outbound</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Route</label>
                  <select
                    className="border rounded px-4 py-2"
                    value={route}
                    onChange={e => setRoute(e.target.value)}
                  >
                    <option value="">Select Route</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {trip && route && (
                <div className="flex flex-col items-center">
                  
                  {(() => {
                    const tripMap = {
                      "1st Trip": 1,
                      "2nd Trip": 2,
                      "1st Outbound": 3,
                      "2nd Outbound": 4
                    };
                    const tripNumber = tripMap[trip] || 0;
                    
                    const bookedSeats = bookings
                      .filter(b => b.trip === tripNumber && String(b.busNumber) === String(route))
                      .map(b => b.seatNumber);
                    return (
                      <>
                        
                        <div className="flex gap-2 mb-2">
                          {topRow1.map((seat, idx) => seat === null ? (
                            <div key={idx} className="w-10 h-10" />
                          ) : seat === "D" ? (
                            <div key={seat} className="bg-red-600 text-white font-bold flex items-center justify-center h-10 w-10 rounded cursor-not-allowed border border-gray-300" style={{ minWidth: 40 }}>
                              Driver
                            </div>
                          ) : bookedSeats.includes(seat) ? (
                            <div key={seat} className="bg-red-600 text-white font-bold flex items-center justify-center h-10 w-10 rounded cursor-not-allowed border border-gray-300" style={{ minWidth: 40 }}>
                              {seat}
                            </div>
                          ) : (
                            <div
                              key={seat}
                              onClick={() => handleSeatClick(seat)}
                              onDoubleClick={() => handleSeatClick(seat)}
                              className={`flex items-center justify-center h-10 w-10 rounded border border-gray-300 cursor-pointer font-semibold ${selectedSeat === seat ? "bg-yellow-400 text-gray-900" : "bg-gray-200 text-gray-700 hover:bg-yellow-200"}`}
                              style={{ minWidth: 40 }}
                            >
                              {seat}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          {topRow2.map((seat, idx) => bookedSeats.includes(seat) ? (
                            <div key={seat} className="bg-red-600 text-white font-bold flex items-center justify-center h-10 w-10 rounded cursor-not-allowed border border-gray-300" style={{ minWidth: 40 }}>
                              {seat}
                            </div>
                          ) : (
                            <div
                              key={seat}
                              onClick={() => handleSeatClick(seat)}
                              onDoubleClick={() => handleSeatClick(seat)}
                              className={`flex items-center justify-center h-10 w-10 rounded border border-gray-300 cursor-pointer font-semibold ${selectedSeat === seat ? "bg-yellow-400 text-gray-900" : "bg-gray-200 text-gray-700 hover:bg-yellow-200"}`}
                              style={{ minWidth: 40 }}
                            >
                              {seat}
                            </div>
                          ))}
                        </div>
                        
                        {seatRows.map((row, rIdx) => (
                          <div key={rIdx} className="flex gap-2 mb-2">
                            {row.map((seat, idx) => seat === null ? (
                              <div key={idx} className="w-10 h-10" />
                            ) : bookedSeats.includes(seat) ? (
                              <div key={seat} className="bg-red-600 text-white font-bold flex items-center justify-center h-10 w-10 rounded cursor-not-allowed border border-gray-300" style={{ minWidth: 40 }}>
                                {seat}
                              </div>
                            ) : (
                              <div
                                key={seat}
                                onClick={() => handleSeatClick(seat)}
                                onDoubleClick={() => handleSeatClick(seat)}
                                className={`flex items-center justify-center h-10 w-10 rounded border border-gray-300 cursor-pointer font-semibold ${selectedSeat === seat ? "bg-yellow-400 text-gray-900" : "bg-gray-200 text-gray-700 hover:bg-yellow-200"}`}
                                style={{ minWidth: 40 }}
                              >
                                {seat}
                              </div>
                            ))}
                          </div>
                        ))}
                      </>
                    );
                  })()}
                  
                  {selectedSeat && (
                    <div className="mb-4 text-lg font-semibold text-gray-800">
                      {selectedSeat} has been selected.
                    </div>
                  )}
                  
                  {selectedSeat && !showPayment && (
                    <button
                      className="bg-gray-900 text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
                      onClick={() => setShowPayment(true)}
                    >
                      Continue to Payment
                    </button>
                  )}
                  
                  {showPayment && !paymentSuccess && (
                    <div className="flex flex-col items-center mt-4 w-full max-w-xs">
                      <div className="mb-2 text-lg font-semibold text-gray-800">
                        Amount: {route === "10" ? "150 tk" : route === "11" ? "50 tk" : "100 tk"}
                      </div>
                      <input
                        type="text"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
                      />
                      <button
                        className="w-full bg-gray-900 text-yellow-400 font-bold py-2 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
                        onClick={() => setPaymentSuccess(true)}
                        disabled={!mobile.match(/^01[0-9]{9}$/)}
                      >
                        Pay
                      </button>
                      <div className="text-xs text-gray-500 mt-1">Mobile number must be 11 digits, start with 01</div>
                    </div>
                  )}
                  {paymentSuccess && (
                    <>
                      <div className="mt-4 text-green-600 font-bold">Payment successful!</div>
                      <button
                        className="mt-4 bg-gray-900 text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-gray-900 transition"
                        onClick={async () => {
                          const tripMap = {
                            "1st Trip": 1,
                            "2nd Trip": 2,
                            "1st Outbound": 3,
                            "2nd Outbound": 4
                          };
                          const tripNumber = tripMap[trip] || 0;
                          const paymentData = {
                            busNumber: route,
                            seatNumber: selectedSeat,
                            trip: tripNumber,
                            amount: route === "10" ? 150 : route === "11" ? 50 : 100,
                            date: new Date().toISOString()
                          };
                          const authToken = localStorage.getItem('token');
                          console.log('Sending payment POST:', paymentData);
                          try {
                            const response = await fetch('http://localhost:471/api/payments', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                              },
                              body: JSON.stringify(paymentData)
                            });
                            const result = await response.json();
                            console.log('Payment POST result:', result);
                            if (!response.ok) {
                              alert('Payment failed: ' + (result.error || 'Unknown error'));
                            }
                          } catch (err) {
                            console.error('Payment POST error:', err);
                            alert('Payment request failed: ' + err.message);
                          }
                          const ts = Date.now();
                          localStorage.setItem('dashboardTimestamp', ts.toString());
                          setDashboardTimestamp(ts);
                          setBookingMode(false);
                          setTrip("");
                          setRoute("");
                          setSelectedSeat(null);
                          setShowPayment(false);
                          setMobile("");
                          setPaymentSuccess(false);
                        }}
                      >
                        Back to Dashboard
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {clientBookings.length === 0 && (
                <div className="text-gray-500 text-lg mt-8">No bookings found for your account.</div>
              )}
              {clientBookings.length > 0 && (
                <div className="bg-gray-100 rounded-lg p-6 w-full max-w-2xl text-center shadow">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Your Bookings</h2>
                  <table className="w-full text-left border rounded shadow">
                    <thead>
                      <tr className="bg-black text-yellow-400 text-lg">
                        <th className="px-4 py-2 border font-bold">Trip</th>
                        <th className="px-4 py-2 border font-bold">Bus Number</th>
                        <th className="px-4 py-2 border font-bold">Seat</th>
                        <th className="px-4 py-2 border font-bold">Token</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientBookings.map((b, idx) => (
                        <tr key={b._id || idx} className="border-t">
                          <td className="px-2 py-1">{b.trip}</td>
                          <td className="px-2 py-1">{b.busNumber}</td>
                          <td className="px-2 py-1">{b.seatNumber}</td>
                          <td className="px-2 py-1">{b.tokenNumber || (b.payment && b.payment.tokenNumber)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {paymentInfo && (
                <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md text-center shadow mt-4">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Your Payment</h2>
                  <div className="mb-2 text-lg text-gray-800">Amount: <span className="font-semibold">{paymentInfo.amount}</span></div>
                  <div className="mb-2 text-lg text-gray-800">Token: <span className="font-semibold text-green-700">{paymentInfo.token}</span></div>
                  <div className="mb-2 text-lg text-gray-800">Date: <span className="font-semibold">{paymentInfo.paymentDate}</span></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDash;
