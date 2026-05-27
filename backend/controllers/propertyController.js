const Property = require('../models/Property');
const { optimizeBase64Image } = require('../utils/imageOptimizer');

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }).populate('agent', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    // Optimize images before saving
    if (req.body.image) {
      req.body.image = await optimizeBase64Image(req.body.image);
    }
    if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images = await Promise.all(req.body.images.map(img => optimizeBase64Image(img)));
    }

    const property = new Property({
      ...req.body,
      agent: req.user._id
    });
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Optimize images if they are being updated
    if (req.body.image) {
      req.body.image = await optimizeBase64Image(req.body.image);
    }
    if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images = await Promise.all(req.body.images.map(img => optimizeBase64Image(img)));
    }

    Object.assign(property, req.body);
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
