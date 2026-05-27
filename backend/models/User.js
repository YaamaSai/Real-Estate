const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  designation: { type: String },
  phone: { type: String },
  avatar: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
