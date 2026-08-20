const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendWhatsAppNotification, generateWhatsAppUrl, buildWhatsAppMessage } = require('../utils/whatsappService');

// POST new booking (Student action) directly in MongoDB
router.post('/', async (req, res) => {
  try {
    const { propertyId, propertyTitle, studentName, studentPhone, studentEmail, moveInDate, durationMonths, notes, userId } = req.body;

    // Strict Authentication check: User must be registered/logged in to book
    let authenticatedUser = null;
    if (userId) {
      authenticatedUser = await User.findById(userId);
    }
    if (!authenticatedUser && studentEmail) {
      authenticatedUser = await User.findOne({ email: studentEmail.trim().toLowerCase() });
    }

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        requireAuth: true,
        message: 'Authentication required. Please sign in or register to book this property.'
      });
    }

    if (!propertyId || !studentName || !studentPhone || !studentEmail || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields: propertyId, studentName, studentPhone, studentEmail, moveInDate'
      });
    }

    let resolvedTitle = propertyTitle || 'Student Accommodation';
    try {
      const property = await Property.findById(propertyId);
      if (property) resolvedTitle = property.title;
    } catch (e) {
      // Ignore if propertyId is custom string
    }

    const booking = await Booking.create({
      propertyId,
      propertyTitle: resolvedTitle,
      userId: userId || null,
      studentName,
      studentPhone,
      studentEmail: studentEmail.trim().toLowerCase(),
      moveInDate,
      durationMonths: durationMonths ? Number(durationMonths) : 6,
      notes: notes || '',
      status: 'Pending'
    });

    // Create automatic initial notification for user
    try {
      await Notification.create({
        userId: userId || null,
        userEmail: studentEmail.trim().toLowerCase(),
        bookingId: booking._id,
        propertyTitle: resolvedTitle,
        title: '📋 Booking Request Submitted',
        message: `Your booking request for "${resolvedTitle}" (ID: #${booking._id.toString().slice(-6)}) was sent to the property admin. We will notify you once approved.`,
        status: 'Pending'
      });
    } catch (notifErr) {
      console.warn('Could not create initial notification:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Admin will contact you soon.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all bookings (Admin view) directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status && status !== 'All') filter.status = status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update booking status (Admin action / Postman) directly in MongoDB
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Pending', 'Confirmed', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of 'Pending', 'Confirmed', or 'Rejected'"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Generate real-time in-app notification for the user
    try {
      let notifTitle = '';
      let notifMessage = '';

      if (status === 'Confirmed') {
        notifTitle = '🎉 Booking Accepted & Confirmed!';
        notifMessage = `Great news! Your booking request for "${booking.propertyTitle}" (Ref ID: #${booking._id.toString().slice(-6)}) has been APPROVED by the property manager. Move-in date: ${booking.moveInDate}.`;
      } else if (status === 'Rejected') {
        notifTitle = '❌ Booking Request Declined';
        notifMessage = `Your booking request for "${booking.propertyTitle}" (Ref ID: #${booking._id.toString().slice(-6)}) was not accepted by the manager due to room availability.`;
      } else {
        notifTitle = '⏳ Booking Status Updated';
        notifMessage = `Your booking request for "${booking.propertyTitle}" (Ref ID: #${booking._id.toString().slice(-6)}) status was changed to ${status}.`;
      }

      await Notification.create({
        userId: booking.userId || null,
        userEmail: (booking.studentEmail || '').toLowerCase(),
        bookingId: booking._id,
        propertyTitle: booking.propertyTitle,
        title: notifTitle,
        message: notifMessage,
        status: status
      });
    } catch (notifErr) {
      console.warn('Could not create status update notification:', notifErr.message);
    }

    // Generate WhatsApp notification data for admin 1-click dispatch
    let whatsappData = null;
    try {
      if (booking.studentPhone && (status === 'Confirmed' || status === 'Rejected')) {
        const result = await sendWhatsAppNotification({
          phone: booking.studentPhone,
          status,
          studentName: booking.studentName,
          propertyTitle: booking.propertyTitle,
          bookingId: booking._id,
          moveInDate: booking.moveInDate,
          durationMonths: booking.durationMonths
        });
        whatsappData = result;
      }
    } catch (waErr) {
      console.warn('Could not build WhatsApp notification:', waErr.message);
    }

    return res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
      whatsappData: whatsappData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE booking (Admin action / Postman) directly in MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    await Booking.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Booking request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
