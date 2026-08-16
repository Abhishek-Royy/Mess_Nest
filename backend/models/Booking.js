const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    propertyTitle: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    studentPhone: {
      type: String,
      required: [true, 'Student phone number is required'],
      trim: true
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true
    },
    moveInDate: {
      type: String,
      required: [true, 'Move-in date is required']
    },
    durationMonths: {
      type: Number,
      default: 6
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rejected'],
      default: 'Pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
