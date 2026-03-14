const express = require('express');
const router = express.Router();
const User = require('../models/User');
const twilio = require('twilio');

// Initialize Twilio using your .env credentials
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// @route   POST /api/alert/trigger-sos
// @desc    Send SMS alerts to emergency contacts with live location
router.post('/trigger-sos', async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // 1. Find the user in the 'Secure-her' DB to get their contacts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Prepare the alert message
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const messageBody = `🚨 EMERGENCY ALERT from ${user.name}! 🚨\nI am in danger. My live location: ${googleMapsUrl}`;

    // 3. Send SMS to all registered emergency contacts
    const smsPromises = user.emergencyContacts.map(contact => 
      client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact.phone // Ensure numbers are saved with +91 in your DB
      })
    );

    await Promise.all(smsPromises);

    res.status(200).json({ 
      success: true, 
      message: `Alerts sent to ${user.emergencyContacts.length} contacts.` 
    });
    
  } catch (error) {
    console.error('SOS Trigger Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send alerts', error: error.message });
  }
});

module.exports = router;