const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Settings.findOne({ key });
    
    if (setting) {
      setting.value = value;
      setting.updatedAt = Date.now();
    } else {
      setting = new Settings({ key, value });
    }
    
    await setting.save();
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
