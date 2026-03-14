const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number
  },
  videoUrl: { type: String }, // You'll store the link to the recorded clip here
  status: { type: String, default: 'Alert Sent' }
});

module.exports = mongoose.model('Incident', IncidentSchema);