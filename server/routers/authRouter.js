const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, ID, isAdmin, isClient, isStaff } = req.body;
    if (!name || !email || !password || !ID) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hash,
      ID,
      isAdmin: !!isAdmin,
      isClient: !!isClient,
      isStaff: !!isStaff
    });
    await user.save();
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, isClient: user.isClient, isStaff: user.isStaff }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, bracuId, password } = req.body;
    // Debug logging
    console.log('Login attempt:', { email, bracuId });
    let user = null;
    // Debug: print all user IDs
    const allUsers = await User.find({});
    console.log('All user IDs:', allUsers.map(u => u.ID));
    if (email) {
      user = await User.findOne({ email });
      console.log('User found by email:', user);
    } else if (bracuId) {
      // Use case-insensitive regex for ID lookup
      user = await User.findOne({ ID: { $regex: `^${bracuId}$`, $options: 'i' } });
      console.log('User found by ID:', user);
    }
    if (!user) {
      console.log('No user found for credentials');
      return res.status(400).json({ error: 'Invalid credentials: user not found' });
    }
    // Check if password is hashed
    if (typeof user.password !== 'string' || !user.password.startsWith('$2')) {
      console.log('User password is not hashed:', user.password);
      return res.status(400).json({ error: 'Password not hashed in database' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch for user:', user.ID);
      return res.status(400).json({ error: 'Invalid credentials: password mismatch' });
    }
    // Fix: use user.isAdmin, isClient, isStaff instead of user.role
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, isClient: user.isClient, isStaff: user.isStaff }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Debug endpoint to list all users
router.get('/debug-users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = router;
