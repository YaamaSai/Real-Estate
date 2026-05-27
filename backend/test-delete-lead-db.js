const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/Lead');

dotenv.config();

const testDelete = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360');
    console.log('Successfully connected to MongoDB.');

    // 1. Fetch current leads
    const allLeads = await Lead.find();
    console.log(`Current leads in database: ${allLeads.length}`);
    if (allLeads.length > 0) {
      console.log('First lead detail:', JSON.stringify(allLeads[0], null, 2));
      
      // Test findByIdAndDelete with the first lead ID (without actually deleting it, or let's create a temp one to delete!)
      console.log('Creating a temporary lead to test deletion...');
      const tempLead = await Lead.create({
        name: 'Temp Test Lead',
        email: 'temp@test.com',
        phone: '1234567890',
        message: 'This is a temporary lead for testing delete logic.',
        type: 'Inquiry',
        status: 'New'
      });
      console.log('Created temp lead:', JSON.stringify(tempLead, null, 2));

      console.log(`Attempting to delete temp lead with ID: ${tempLead._id}...`);
      const deleted = await Lead.findByIdAndDelete(tempLead._id);
      console.log('Deleted successfully. Result:', JSON.stringify(deleted, null, 2));
    } else {
      console.log('No leads found in database.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Database Operation Error:', err);
    process.exit(1);
  }
};

testDelete();
