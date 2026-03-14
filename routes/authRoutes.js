const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user (and their keywords/contacts)
router.post('/register', async (req, res) => {
  const { name, phone, password, emergencyContacts, keywords } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      phone,
      password, // Note: In a real app, hash this with bcrypt
      emergencyContacts,
      keywords
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get data
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;