const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  // Store multiple emergency contacts in one array
  emergencyContacts: [
    {
      name: String,
      phone: String
    }
  ],
  // Store custom keywords in one array
  keywords: {
    type: [String],
    default: ['help', 'danger', 'emergency']
  }
}, { timestamps: true });

module.exports = mongoose.model('Users', UserSchema);