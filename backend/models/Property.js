const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property name/title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['PG', 'Flat', 'Mess'],
      default: 'PG'
    },
    location: {
      type: String,
      required: [true, 'City/Location is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Specific area/neighborhood is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Full address is required']
    },
    price: {
      type: Number,
      required: [true, 'Rent price per month is required']
    },
    deposit: {
      type: Number,
      default: 0
    },
    roomType: {
      type: String,
      enum: ['Single Room', 'Double Sharing', 'Triple Sharing', '1 BHK', '2 BHK', '3 BHK', 'Full Mess Service'],
      default: 'Single Room'
    },
    furnishedStatus: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Furnished'
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
      default: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 12
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Power Backup', '24/7 Security', 'RO Water', 'Cleaning Service']
    },
    description: {
      type: String,
      default: 'Ideal student accommodation close to colleges, coaching hubs, and public transport.'
    },
    contactPerson: {
      type: String,
      default: 'Owner / Caretaker'
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp contact number is required'],
      default: '919876543210'
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Property', propertySchema);
