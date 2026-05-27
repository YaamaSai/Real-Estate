const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String },
  images: [{ type: String }],
  amenities: [{ type: String }],
  area: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, default: 'Available' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
