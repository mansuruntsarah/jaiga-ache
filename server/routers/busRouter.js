const express = require('express');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all buses with route info
router.get('/routes', auth, authorize('admin'), async (req, res) => {
  try {
    const buses = await Bus.find();
    const routes = await Route.find();
    const users = await User.find({ isStaff: true });
    // Always show all buses, display driver/attendant names if matched, else show as-is
    const combined = buses.map(bus => {
      const route = routes.find(r => r.id === bus.busNumber);
      const driverUser = users.find(u => u.name === bus.driver);
      const attendantUser = bus.attendant ? users.find(u => u.name === bus.attendant) : null;
      return {
        busNumber: bus.busNumber,
        driver: driverUser ? driverUser.name : bus.driver,
        attendant: attendantUser ? attendantUser.name : '',
        attendantAssignedDate: bus.attendantAssignedDate,
        route: route ? route.routeName : ''
      };
    });
    console.log('Joined bus/route/user data:', JSON.stringify(combined, null, 2));
    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join bus, route, and user data' });
  }
});
// ...existing code...

// Get all buses
router.get('/', async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// Update driver, attendant, or attendantAssignedDate for a bus
router.put('/:busNumber', async (req, res) => {
  const { driver, attendant, attendantAssignedDate } = req.body;
  const update = {};
  if (driver !== undefined) update.driver = driver;
  if (attendant !== undefined) update.attendant = attendant;
  if (attendantAssignedDate !== undefined) update.attendantAssignedDate = attendantAssignedDate;
  const bus = await Bus.findOneAndUpdate(
    { busNumber: req.params.busNumber },
    { $set: update },
    { new: true }
  );
  res.json(bus);
});


// Staff marks attendance for today
router.post('/attendance/:busNumber', auth, authorize('staff'), async (req, res) => {
  const busNumber = req.params.busNumber;
  const userName = req.user.name;
  const today = new Date().toISOString().slice(0, 10);
  const bus = await Bus.findOne({ busNumber });
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  if (bus.attendant !== userName) return res.status(403).json({ error: 'You are not assigned to this bus' });
  if (bus.attendantAssignedDate === today) {
    return res.status(400).json({ error: 'Attendance already marked for today' });
  }
  bus.attendantAssignedDate = today;
  await bus.save();
  res.json({ success: true, attendantAssignedDate: today });
});

module.exports = router;
