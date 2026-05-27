const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360')
  .then(async () => {
    const admins = await User.find({ role: 'admin' });
    console.log(`Found ${admins.length} admins:`);
    console.log(JSON.stringify(admins, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
