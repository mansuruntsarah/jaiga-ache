const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: Number, required: true, unique: true },
  driver: { type: String, required: true },
  attendant: { type: String, default: '' },
  attendantAssignedDate: { type: String, default: '' }
});

module.exports = mongoose.model('Bus', busSchema, 'bus');
