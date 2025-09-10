const mongoose = require('mongoose');

const fuelUseSchema = new mongoose.Schema({
  busNumber: { type: Number, required: true },
  fuel_status: { type: Number, required: true }, // liters remaining
  miles_driven: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FuelUse', fuelUseSchema);
