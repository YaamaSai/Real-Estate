const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const Project = require('./models/Project');
const Agent = require('./models/Agent');
const { optimizeBase64Image } = require('./utils/imageOptimizer');

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Cleanup Properties
    const properties = await Property.find();
    console.log(`Checking ${properties.length} properties...`);
    for (const p of properties) {
      if (p.image && p.image.length > 500000) { // If > 500KB
        console.log(`Optimizing Property: ${p.title} (${(p.image.length / 1024 / 1024).toFixed(2)} MB)`);
        p.image = await optimizeBase64Image(p.image);
        await p.save();
      }
      if (p.images && p.images.length > 0) {
        let changed = false;
        for (let i = 0; i < p.images.length; i++) {
          if (p.images[i].length > 500000) {
            console.log(`Optimizing Property Image ${i}: ${p.title}`);
            p.images[i] = await optimizeBase64Image(p.images[i]);
            changed = true;
          }
        }
        if (changed) await p.save();
      }
    }

    // Cleanup Projects
    const projects = await Project.find();
    console.log(`Checking ${projects.length} projects...`);
    for (const p of projects) {
      if (p.image && p.image.length > 500000) {
        console.log(`Optimizing Project: ${p.title} (${(p.image.length / 1024 / 1024).toFixed(2)} MB)`);
        p.image = await optimizeBase64Image(p.image);
        await p.save();
      }
    }

    console.log('Cleanup Complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
