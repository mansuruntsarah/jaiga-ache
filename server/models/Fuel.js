const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  busNumber: { type: Number, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // liters or gallons
  cost: { type: Number, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Fuel', fuelSchema);
