const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const Project = require('./models/Project');
const Agent = require('./models/Agent');

dotenv.config();

const checkSizes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const properties = await Property.find();
    console.log(`Found ${properties.length} properties`);
    properties.forEach(p => {
      const size = JSON.stringify(p).length;
      console.log(`Property: ${p.title} - Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
    });

    const projects = await Project.find();
    console.log(`Found ${projects.length} projects`);
    projects.forEach(p => {
      const size = JSON.stringify(p).length;
      console.log(`Project: ${p.title} - Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkSizes();
