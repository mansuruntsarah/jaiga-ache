const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  trip: { type: Number, required: true },
  busNumber: { type: Number, required: true },
  dateTime: { type: Date, default: Date.now },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
