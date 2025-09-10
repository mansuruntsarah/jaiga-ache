const express = require('express');
const Maintenance = require('../models/Maintenance');
const router = express.Router();

const { auth, authorize } = require('../middleware/auth');


router.get('/', auth, authorize('admin'), async (req, res) => {
  const maintenanceLogs = await Maintenance.find();
  res.json(maintenanceLogs);
});



router.post('/', auth, authorize('staff'), async (req, res) => {
  try {
    const { busNumber, notes } = req.body;
    if (!busNumber || !notes) {
      return res.status(400).json({ error: 'busNumber and notes are required' });
    }
    const maintenance = new Maintenance({
      busNumber,
      date: new Date(),
      performedBy: req.user._id,
      notes
    });
    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add maintenance report' });
  }
});

module.exports = router;
