const express = require('express');
const Fuel = require('../models/Fuel');
const router = express.Router();

const { auth, authorize } = require('../middleware/auth');


router.get('/', auth, authorize('admin'), async (req, res) => {
  const fuelLogs = await Fuel.find().populate('addedBy');
  res.json(fuelLogs);
});



router.post('/', auth, authorize('staff'), async (req, res) => {
  try {
    const { busNumber, amount } = req.body;
    if (!busNumber || !amount) {
      return res.status(400).json({ error: 'busNumber and amount are required' });
    }
    const cost = Number(amount) * 100;
    const fuelLog = new Fuel({
      busNumber,
      amount,
      cost,
      date: new Date(),
      addedBy: req.user._id
    });
    await fuelLog.save();
    res.status(201).json(fuelLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add fuel log' });
  }
});

module.exports = router;
