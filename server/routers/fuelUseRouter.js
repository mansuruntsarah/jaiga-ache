const express = require('express');
const FuelUse = require('../models/FuelUse');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');



router.get('/', auth, authorize('admin'), async (req, res) => {
  const fuelUses = await FuelUse.find();
  res.json(fuelUses);
});


router.get('/bus/:busNumber', auth, authorize('staff'), async (req, res) => {
  const busNumber = Number(req.params.busNumber);
  if (!busNumber) return res.status(400).json({ error: 'busNumber required' });
  const fuelUse = await FuelUse.findOne({ busNumber });
  if (!fuelUse) return res.status(404).json({ error: 'No fuel use found for this bus' });
  res.json(fuelUse);
});


router.post('/', auth, authorize('staff'), async (req, res) => {
  try {
    console.log('POST /api/fuel_use body:', req.body);
    const { busNumber, fuel_status, miles_driven } = req.body;
    if (busNumber == null || fuel_status == null || miles_driven == null) {
      console.error('Missing required fields:', { busNumber, fuel_status, miles_driven });
      return res.status(400).json({ error: 'busNumber, fuel_status, and miles_driven are required' });
    }
    let fuelUse = await FuelUse.findOne({ busNumber });
    if (fuelUse) {
      fuelUse.fuel_status = fuel_status;
      fuelUse.miles_driven = miles_driven;
      fuelUse.updatedAt = new Date();
      await fuelUse.save();
      console.log('Updated fuelUse:', fuelUse);
    } else {
      fuelUse = new FuelUse({ busNumber, fuel_status, miles_driven });
      await fuelUse.save();
      console.log('Created new fuelUse:', fuelUse);
    }
    res.status(201).json(fuelUse);
  } catch (err) {
    console.error('Error in POST /api/fuel_use:', err);
    res.status(500).json({ error: 'Failed to update fuel use' });
  }
});

module.exports = router;
