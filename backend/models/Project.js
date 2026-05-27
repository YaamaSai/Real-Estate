const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Ongoing', 'Completed', 'Launching Soon'], 
    default: 'Ongoing' 
  },
  image: { type: String },
  images: [{ type: String }],
  brochure: { type: String },
  builder: { type: String },
  price: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
