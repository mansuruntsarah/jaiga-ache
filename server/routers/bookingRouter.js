const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

const { auth, authorize } = require('../middleware/auth');

// Get all bookings (admin only)

// GET /api/bookings?busNumber=1&date=2025-09-10&trip=1
router.get('/', auth, async (req, res) => {
  try {
    const query = {};
  if (req.query.busNumber) query.busNumber = Number(req.query.busNumber);
  if (req.query.trip) query.trip = Number(req.query.trip);
    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings for a user (client only, or admin/staff)
router.get('/user/:userId', auth, async (req, res) => {
  if (req.user.role === 'admin' || req.user.role === 'staff' || req.user._id.toString() === req.params.userId) {
    try {
      console.log('Booking query for client:', req.params.userId);
      const mongoose = require('mongoose');
      const clientId = new mongoose.Types.ObjectId(req.params.userId);
  const bookings = await Booking.find({ client: clientId });
      console.log('Bookings found:', bookings);
      res.json(bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

// Get booked seats for a bus/trip/date
router.get('/seats', async (req, res) => {
  const { busNumber, trip, date } = req.query;
  const bookings = await Booking.find({ busNumber, trip, date });
  res.json(bookings.map(b => b.seatNumber));
});

// Bookings are created only after payment (see paymentRouter)

module.exports = router;
