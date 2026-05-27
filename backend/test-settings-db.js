const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

const testSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360');
    console.log('Successfully connected to MongoDB.');

    // 1. Fetch current settings documents
    const allSettings = await Settings.find();
    console.log('Current settings in database:', JSON.stringify(allSettings, null, 2));

    // 2. Test saving a test hero document
    console.log('Attempting to save test hero setting...');
    const key = 'hero';
    const value = { title: 'Test Dream Home Title', subtitle: 'Test Dream Subtitle' };

    let setting = await Settings.findOne({ key });
    if (setting) {
      console.log('Found existing setting for key "hero". Updating...');
      setting.value = value;
      setting.updatedAt = Date.now();
    } else {
      console.log('Creating new setting for key "hero"...');
      setting = new Settings({ key, value });
    }

    const saved = await setting.save();
    console.log('Saved setting successfully:', JSON.stringify(saved, null, 2));

    // 3. Retrieve it back
    const retrieved = await Settings.findOne({ key });
    console.log('Retrieved setting back:', JSON.stringify(retrieved, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Database Operation Error:', err);
    process.exit(1);
  }
};

testSettings();
