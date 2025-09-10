const Booking = require('../models/Booking');
const User = require('../models/User');
const Route = require('../models/Route');
const Payment = require('../models/Payment');

exports.createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user || !user.isClient) {
      return res.status(403).json({ error: 'Only clients can make bookings.' });
    }
    const route = await Route.findById(req.body.route);
    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }
    const booking = new Booking({
      user: user._id,
      route: route._id,
      busNumber: route.id,
      seatNumber: req.body.seatNumber,
      bookingDate: new Date(),
      status: 'pending'
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user || !user.isClient) {
      return res.status(403).json({ error: 'Only clients can make payments.' });
    }
    const booking = await Booking.findById(req.body.booking);
    if (!booking || String(booking.user) !== String(user._id)) {
      return res.status(403).json({ error: 'Payment must be for your own booking.' });
    }
    const payment = new Payment({
      booking: booking._id,
      user: user._id,
      amount: req.body.amount,
      method: 'cash',
      status: 'pending',
      tokenNumber: req.body.tokenNumber,
      paymentDate: new Date()
    });
    await payment.save();
    booking.payment = payment._id;
    await booking.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
