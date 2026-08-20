const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @route   POST /api/users/register
// @desc    Register a new student/user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone number, and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login instead.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: password.trim()
    });

    // Create a welcome notification
    await Notification.create({
      userId: user._id,
      userEmail: user.email,
      title: 'Welcome to Mess&Nest! 🏠',
      message: `Hi ${user.name}, your student account has been created. Start exploring and booking verified PGs, flats, and mess accommodations!`,
      status: 'Info'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: `messnest_user_token_${user._id}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('User Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message
    });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please register first.'
      });
    }

    if (user.password !== password.trim()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token: `messnest_user_token_${user._id}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('User Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
});

// @route   GET /api/users/my-bookings
// @desc    Get all bookings for a user by email or userId
// @access  Public
router.get('/my-bookings', async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID or Email is required to fetch bookings.'
      });
    }

    const filter = { $or: [] };
    if (userId) {
      filter.$or.push({ userId });
    }
    if (email) {
      filter.$or.push({ studentEmail: email.trim().toLowerCase() });
    }

    const bookings = await Booking.find(filter)
      .populate('propertyId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get User Bookings Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching bookings: ' + error.message
    });
  }
});

// @route   GET /api/users/notifications
// @desc    Get all notifications for a user by userId or email
// @access  Public
router.get('/notifications', async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID or Email is required to fetch notifications.'
      });
    }

    const filter = { $or: [] };
    if (userId) {
      filter.$or.push({ userId });
    }
    if (email) {
      filter.$or.push({ userEmail: email.trim().toLowerCase() });
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching notifications: ' + error.message
    });
  }
});

// @route   PATCH /api/users/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Public
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/users/notifications/mark-all-read
// @desc    Mark all notifications as read for a user
// @access  Public
router.patch('/notifications/mark-all-read', async (req, res) => {
  try {
    const { userId, email } = req.body;
    const filter = { $or: [] };
    if (userId) filter.$or.push({ userId });
    if (email) filter.$or.push({ userEmail: email.trim().toLowerCase() });

    if (filter.$or.length === 0) {
      return res.status(400).json({ success: false, message: 'User ID or Email required' });
    }

    await Notification.updateMany(filter, { isRead: true });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
