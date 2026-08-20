const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const sampleProperties = [
  {
    title: 'Sunrise Student Living PG & Hostel',
    category: 'PG',
    location: 'Bangalore',
    area: 'Koramangala 5th Block',
    address: ' #42, 8th Main, Near Christ University Gate, Koramangala 5th Block, Bangalore',
    price: 8500,
    deposit: 10000,
    roomType: 'Double Sharing',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    totalReviews: 34,
    amenities: ['High-speed Wi-Fi', 'Daily 3-Time Food', 'AC Room', 'Daily Housekeeping', 'CCTV 24x7', 'Washing Machine', 'RO Filter Water'],
    description: 'Premium student PG situated just 5 minutes walk from Christ University. Features spacious double and single sharing rooms with attached bathrooms, study tables, high-speed 300 Mbps Wi-Fi, and delicious hygienic North & South Indian meals included.',
    contactPerson: 'Mr. Ramesh (Property Owner)',
    whatsappNumber: '919876543210',
    isAvailable: true
  },
  {
    title: 'Green View 2BHK Furnished Flat for Students',
    category: 'Flat',
    location: 'Delhi',
    area: 'North Campus, GTB Nagar',
    address: 'House No. 118, Hudson Lane, Near Kingsway Camp, GTB Nagar, Delhi',
    price: 18000,
    deposit: 20000,
    roomType: '2 BHK',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.6,
    totalReviews: 22,
    amenities: ['Fully Furnished Beds & Closets', 'Modular Kitchen with Gas & Fridge', 'Air Conditioner', 'Balcony View', 'Geyser', 'Washing Machine'],
    description: 'Fully furnished 2 BHK apartment ideal for 3-4 university students sharing. Located in prime student zone Hudson Lane, Delhi University North Campus. Metro station is only 400 meters away.',
    contactPerson: 'Mrs. Sunita Sharma',
    whatsappNumber: '919123456789',
    isAvailable: true
  },
  {
    title: 'Annapurna Pure Veg & Non-Veg Student Mess',
    category: 'Mess',
    location: 'Kota',
    area: 'Rajeev Gandhi Nagar',
    address: 'Plot 15, Near Allen Supath Building, Rajeev Gandhi Nagar, Kota, Rajasthan',
    price: 3200,
    deposit: 500,
    roomType: 'Full Mess Service',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    totalReviews: 89,
    amenities: ['Unlimited Breakfast, Lunch & Dinner', 'Sunday Special Sweets/Chicken', 'Clean Dining Hall', 'Special Diet Menu on Request', 'Filtered Cold Water'],
    description: 'Most rated student mess service in Kota! Hygienic, home-style cooked food with minimal oil and spices. Daily rotating menu with unlimited rotis, rice, dal, and green veggies.',
    contactPerson: 'Chef Anand Prasad',
    whatsappNumber: '919988776655',
    isAvailable: true
  },
  {
    title: 'Scholar Residency Luxury Boys PG',
    category: 'PG',
    location: 'Pune',
    area: 'Viman Nagar',
    address: 'Lane No. 3, Near Symbiosis Campus, Viman Nagar, Pune',
    price: 9500,
    deposit: 12000,
    roomType: 'Single Room',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    totalReviews: 19,
    amenities: ['Individual Study Desk & Ergonomic Chair', 'Personal Locker Bed', 'Gaming Room', 'Biometric Entry', 'Daily Hot Water'],
    description: 'Modern executive PG for college students and interns. Located right behind Symbiosis Centre for Management Studies. High-speed broadband, quiet environment for studies, and 24/7 security.',
    contactPerson: 'Vikram Joshi',
    whatsappNumber: '919765432109',
    isAvailable: true
  },
  {
    title: 'Cozy 1BHK Semi-Furnished Flat',
    category: 'Flat',
    location: 'Bangalore',
    area: 'HSR Layout Sector 1',
    address: '2nd Floor, 14th Cross, Near NIFT College, HSR Layout, Bangalore',
    price: 13500,
    deposit: 25000,
    roomType: '1 BHK',
    furnishedStatus: 'Semi-Furnished',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.4,
    totalReviews: 14,
    amenities: ['Wardrobe Built-in', 'Kitchen Cabinet & Sink', 'Geyser', 'Covered Two-Wheeler Parking', '24 Hours Water Supply'],
    description: 'Spacious independent 1 BHK unit with balcony. Great ventilation and quiet surroundings, walking distance to NIFT Bangalore and local markets.',
    contactPerson: 'Suresh Kumar',
    whatsappNumber: '919845012345',
    isAvailable: true
  },
  {
    title: 'Royal Girls PG & Food Facility',
    category: 'PG',
    location: 'Delhi',
    area: 'Laxmi Nagar',
    address: 'D-45, Main Vikas Marg, Opposite Metro Pillar 38, Laxmi Nagar, Delhi',
    price: 7000,
    deposit: 7000,
    roomType: 'Triple Sharing',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    totalReviews: 41,
    amenities: ['Safe & Secure Guard', 'Bio-metric Female Warden', 'Tea & Breakfast Included', 'Wi-Fi Unlimited', 'Power Backup'],
    description: 'Top-rated safe PG accommodation for female students and CA aspirants. Clean rooms, wholesome homemade food, and round-the-clock female warden support.',
    contactPerson: 'Mrs. Rekha Gupta',
    whatsappNumber: '919811223344',
    isAvailable: true
  }
];

// POST /api/seed - Re-seed database with default properties and sample booking
router.post('/', async (req, res) => {
  try {
    await Property.deleteMany({});
    await Booking.deleteMany({});

    const createdProperties = await Property.insertMany(sampleProperties);

    // Create a sample booking for testing
    const sampleBooking = await Booking.create({
      propertyId: createdProperties[0]._id,
      propertyTitle: createdProperties[0].title,
      studentName: 'Aarav Patel',
      studentPhone: '919876543210',
      studentEmail: 'aarav.patel@student.edu',
      moveInDate: '2026-09-01',
      durationMonths: 6,
      status: 'Pending',
      notes: 'Looking for a quiet room on the upper floor.'
    });

    res.json({
      success: true,
      message: 'Database seeded successfully with sample properties and booking!',
      propertiesCount: createdProperties.length,
      sampleBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
