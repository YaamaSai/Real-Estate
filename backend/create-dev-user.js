const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createDevUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const devEmail = 'dev@bridl360.com';
    const devPassword = 'DevCheck360!';
    const devName = 'Developer Admin';

    // Delete existing dev user if any
    await User.deleteOne({ email: devEmail });

    const hashedPassword = await bcrypt.hash(devPassword, 10);
    
    await User.create({
      name: devName,
      email: devEmail,
      password: hashedPassword,
      role: 'admin' // Giving admin access for checking dashboard too
    });

    console.log('-----------------------------------');
    console.log('Developer Account Created Successfully');
    console.log('Email:', devEmail);
    console.log('Password:', devPassword);
    console.log('Role: admin');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error creating dev user:', error);
    process.exit(1);
  }
};

createDevUser();
