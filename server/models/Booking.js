const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  trip: { type: Number, required: true },
  busNumber: { type: Number, required: true },
  seatNumber: { type: String, required: true },
  tokenNumber: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
