const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Reference to Property model
  type: { type: String, enum: ['Inquiry', 'Site Visit'], default: 'Inquiry' },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
