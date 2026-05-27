const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const https = require('https');
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const agentRoutes = require('./routes/agentRoutes');

dotenv.config();

const app = express();

let serverPublicIp = '122.177.247.170';

// Dynamic server public IP lookup
https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.ip) {
        serverPublicIp = parsed.ip;
        console.log('Fetched server public IP:', serverPublicIp);
      }
    } catch (e) {}
  });
}).on('error', () => {
  console.log('Could not fetch server public IP dynamically, using fallback:', serverPublicIp);
});

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection function
const connectToDb = () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    // Already connected or in the process of connecting
    return;
  }

  console.log('Attempting to connect to MongoDB Atlas...');
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360', {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    tlsAllowInvalidCertificates: true, // Bypass certificate validation for local environments
  })
    .then(() => console.log('Successfully Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('CRITICAL: Could not connect to MongoDB Atlas:', err.message);
      console.log('The server will remain active to report status to the frontend. Whitelist IP:', serverPublicIp);
    });
};

// Initial connection attempt at boot
connectToDb();

// Database connection & health status endpoint
app.get('/api/db-status', async (req, res) => {
  // If not connected, trigger an asynchronous reconnection attempt in the background
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    connectToDb();
  }

  // If in the middle of connecting, wait a brief moment to see if it succeeds
  if (mongoose.connection.readyState === 2) {
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      if (mongoose.connection.readyState === 1) break;
    }
  }

  res.json({
    connected: mongoose.connection.readyState === 1,
    ip: serverPublicIp,
  });
});

// Database status middleware
app.use((req, res, next) => {
  // If database is not connected, prevent buffering hang and return 503 Service Unavailable
  if (mongoose.connection.readyState !== 1) {
    // Attempt to self-heal/reconnect in the background
    connectToDb();

    return res.status(503).json({
      error: 'Database Connection Error',
      message: 'The server is running but could not connect to MongoDB Atlas. Whitelist required for IP.',
      ip: serverPublicIp,
    });
  }
  next();
});

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/agents', agentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

