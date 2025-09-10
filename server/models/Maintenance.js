const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  busNumber: { type: Number, required: true },
  date: { type: Date, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
