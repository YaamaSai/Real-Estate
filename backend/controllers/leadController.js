const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).populate('property', 'title');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.status = req.body.status;
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
