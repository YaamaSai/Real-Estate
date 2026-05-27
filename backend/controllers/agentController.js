const Agent = require('../models/Agent');
const User = require('../models/User');
const { optimizeBase64Image } = require('../utils/imageOptimizer');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = async (req, res) => {
  try {
    const { name, email, phone, designation, status, avatar } = req.body;

    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res.status(400).json({ message: 'Agent already exists with this email' });
    }

    const agent = await Agent.create({
      name,
      email,
      phone,
      designation,
      status: status || 'Active',
      avatar: await optimizeBase64Image(avatar || '')
    });

    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
exports.updateAgent = async (req, res) => {
  try {
    if (req.body.avatar) {
      req.body.avatar = await optimizeBase64Image(req.body.avatar);
    }
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const email = agent.email;

    // Delete agent record
    await Agent.findByIdAndDelete(req.params.id);

    // Delete corresponding user login credentials if email exists
    if (email) {
      await User.deleteOne({ email });
    }

    res.json({ message: 'Agent and their login credentials removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
