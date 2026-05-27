const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360')
  .then(async () => {
    const agents = await Agent.find().sort({ createdAt: -1 });
    console.log(`Found ${agents.length} agents:`);
    console.log(JSON.stringify(agents, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
