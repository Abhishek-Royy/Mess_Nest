const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Helper function to seed/ensure abhishek admin into MongoDB database
async function seedDefaultAdminIfNeeded() {
  try {
    let admin = await Admin.findOne({ username: 'abhishek' });
    if (!admin) {
      console.log('🌱 Seeding Admin user (abhishek) into MongoDB database...');
      await Admin.create({
        username: 'abhishek',
        email: 'abhishek@messnest.in',
        password: 'abhishek123',
        name: 'Abhishek (Admin)',
        role: 'Super Admin'
      });
      console.log('✅ Admin account created in MongoDB! Username: abhishek | Password: abhishek123');
    } else {
      // Ensure password matches abhishek123
      if (admin.password !== 'abhishek123') {
        admin.password = 'abhishek123';
        await admin.save();
        console.log('✅ Admin password updated to abhishek123');
      }
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
}

// Call seed check on route initialization
seedDefaultAdminIfNeeded();

// @route   POST /api/admin/login
// @desc    Authenticate admin user against MongoDB database
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username / Email and Password are required.'
      });
    }

    // Ensure database contains at least one admin
    await seedDefaultAdminIfNeeded();

    const normalizedIdentifier = username.trim().toLowerCase();

    // Query MongoDB Atlas for matching admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier }
      ]
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Admin username or email.'
      });
    }

    // Verify password
    if (admin.password !== password.trim()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    // Return success response with token & admin details
    return res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token: `messnest_admin_token_${admin._id}`,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin login: ' + error.message
    });
  }
});

// @route   GET /api/admin/seed
// @desc    Force seed / reset default admin in database
// @access  Public
router.get('/seed', async (req, res) => {
  try {
    let admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      admin = await Admin.create({
        username: 'admin',
        email: 'admin@messnest.in',
        password: 'admin123',
        name: 'Mess&Nest Admin',
        role: 'Super Admin'
      });
    }
    return res.json({
      success: true,
      message: 'Admin account verified in MongoDB database',
      admin: {
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
