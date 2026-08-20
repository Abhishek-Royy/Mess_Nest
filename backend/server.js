const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS SRV lookup issues on Windows / local ISPs for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // fallback to system DNS if setServers fails
}

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedRoutes = require('./routes/seedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API operational',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'Connected to MongoDB Atlas' : 'Disconnected',
    mongoUriConfigured: Boolean(process.env.MONGO_URI)
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  if (!MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in .env file!');
    process.exit(1);
  }

  try {
    const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB Atlas: ${maskedUri}`);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
