const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('client'), async (req, res) => {
  try {
    const { route, busNumber, seatNumber, trip, date, amount } = req.body;
    const existing = await require('../models/Booking').findOne({ busNumber, seatNumber, trip, date });
    if (existing) {
      return res.status(409).json({ error: 'Seat already booked for this trip.' });
    }
    const tokenNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
    const Booking = require('../models/Booking');
    const booking = await Booking.create({
      client: req.user._id,
      route,
      busNumber,
      seatNumber,
      trip,
      date,
      tokenNumber
    });
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      busNumber,
      trip,
      amount,
      tokenNumber
    });
    booking.payment = payment._id;
    await booking.save();
    res.status(201).json({ booking, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  const payments = await Payment.find({}, { trip: 1, busNumber: 1, dateTime: 1, amount: 1, _id: 1 });
  res.json(payments);
});


router.get('/user/:userId', auth, async (req, res) => {
  if (req.user.role === 'admin' || req.user.role === 'staff' || req.user._id.toString() === req.params.userId) {
    const payments = await Payment.find({ user: req.params.userId }).populate('booking');
    res.json(payments);
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

module.exports = router;
