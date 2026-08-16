const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// POST new booking (Student action) directly in MongoDB
router.post('/', async (req, res) => {
  try {
    const { propertyId, propertyTitle, studentName, studentPhone, studentEmail, moveInDate, durationMonths, notes } = req.body;

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
      studentName,
      studentPhone,
      studentEmail,
      moveInDate,
      durationMonths: durationMonths ? Number(durationMonths) : 6,
      notes: notes || '',
      status: 'Pending'
    });

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
    return res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
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
