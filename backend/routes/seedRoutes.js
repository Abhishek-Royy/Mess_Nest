const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const kolkataAndWBSampleProperties = [
  {
    title: 'Salt Lake Sector V IT & Student PG',
    category: 'PG',
    location: 'Kolkata',
    area: 'Salt Lake Sector V',
    address: 'Block EP & GP, Near Webel Bhawan & Techno India, Sector V, Salt Lake, Kolkata, West Bengal 700091',
    price: 6500,
    deposit: 8000,
    roomType: 'Double Sharing',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    totalReviews: 46,
    amenities: [
      'High-speed 200 Mbps Wi-Fi',
      'Daily 3-Time Food (Bengali & North Indian)',
      'AC Rooms Available',
      'Daily Housekeeping',
      'CCTV 24x7 & Guard',
      'Washing Machine & Geyser',
      'RO Filtered Water'
    ],
    description: 'Located right in the IT & educational hub of Sector V Kolkata, within 5 mins walking distance of Techno India University, IEM College, and Sector V Metro Station. Includes 3 freshly prepared meals daily (Fish/Chicken/Paneer, Rice, Dal, Sabzi), study desk, power backup, and high-speed broadband.',
    contactPerson: 'Mr. Debashis Mukherjee (Property Manager)',
    whatsappNumber: '919830123456',
    isAvailable: true
  },
  {
    title: 'Jadavpur Scholars PG & Mess Facility',
    category: 'PG',
    location: 'Kolkata',
    area: 'Jadavpur (Near 8B Bus Stand)',
    address: '32/1 Central Road, Near Jadavpur University Gate No. 4, Jadavpur, Kolkata, West Bengal 700032',
    price: 5200,
    deposit: 6000,
    roomType: 'Single Room',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    totalReviews: 58,
    amenities: [
      'Personal Study Table & Book Rack',
      'Attached Washroom with Geyser',
      'Wi-Fi 100 Mbps',
      'Daily Home-Cooked Lunch & Dinner',
      'Purified Water Machine',
      '24/7 Security Entry'
    ],
    description: 'Specially created for students of Jadavpur University, KPC Medical College, and South Kolkata institutes. Just 2 minutes walk from 8B Bus Stand and Jadavpur Railway Station. Quiet environment for exam preparation, attached balcony, and clean hygienic fooding.',
    contactPerson: 'Subhasish Roy (Owner)',
    whatsappNumber: '919831987654',
    isAvailable: true
  },
  {
    title: 'New Town Smart 2BHK Furnished Student Flat',
    category: 'Flat',
    location: 'Kolkata',
    area: 'New Town Action Area 1',
    address: 'Street No. 165, Near Axis Mall & Biswa Bangla Gate, Action Area 1, New Town, Kolkata, West Bengal 700156',
    price: 15500,
    deposit: 20000,
    roomType: '2 BHK',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    totalReviews: 31,
    amenities: [
      'Fully Furnished Beds & Closets',
      'Modular Kitchen with Gas & Fridge',
      'Air Conditioner in Both Bedrooms',
      'Balcony with Scenic View',
      'Gated Society with Lift & Power Backup',
      'Dedicated Two-Wheeler Parking'
    ],
    description: 'Fully furnished, modern 2 BHK apartment ideal for 3-4 university students sharing. Conveniently located near St. Xavier\'s University, Amity University, and Aliah University. Modern society with gym, 24/7 security, and fast bus connectivity.',
    contactPerson: 'Mrs. Ananya Banerjee',
    whatsappNumber: '919874561230',
    isAvailable: true
  },
  {
    title: 'College Street Boi-Para Heritage Student Mess',
    category: 'Mess',
    location: 'Kolkata',
    area: 'College Street (Boi Para)',
    address: '14/A Bankim Chatterjee Street, Near Indian Coffee House, College Street, Kolkata, West Bengal 700073',
    price: 3600,
    deposit: 1000,
    roomType: 'Full Mess Service',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    totalReviews: 104,
    amenities: [
      'Unlimited Rice, Dal, Sabzi & Roti',
      'Fresh Fish Curry (4 Days/Week)',
      'Chicken & Special Mutton on Sundays',
      'Clean & Hygienic Dining Hall',
      'Tiffin Box Delivery to Hostels Available',
      'Filtered Cold Water'
    ],
    description: 'Legendary student mess in the heart of Kolkata\'s Boi-Para. Walking distance to Presidency University, Calcutta University, Sanskrit College, and Calcutta Medical College. Serves authentic, wholesome Bengali home-style meals with fresh seasonal ingredients.',
    contactPerson: 'Gouranga Babu (Mess Manager)',
    whatsappNumber: '919433112233',
    isAvailable: true
  },
  {
    title: 'Gariahat South Kolkata Deluxe Girls PG',
    category: 'PG',
    location: 'Kolkata',
    area: 'Gariahat / Ballygunge',
    address: '78 Hindusthan Park, Near Gariahat Pantaloons & South City College, Kolkata, West Bengal 700029',
    price: 7500,
    deposit: 10000,
    roomType: 'Double Sharing',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    totalReviews: 39,
    amenities: [
      '24/7 Female Resident Warden',
      'Biometric Door Access & CCTV',
      'Daily 3 Times Hygienic Meals',
      'AC with Individual Power Meters',
      'Wi-Fi & Laundry Service',
      'Attached Modern Bathrooms'
    ],
    description: 'Extremely safe and comfortable girls PG located in premier South Kolkata neighborhood. 5 minutes from South City College, Deshapriya Park, and Ballygunge Station. Homely atmosphere, nutritious food, study tables, and round-the-clock security.',
    contactPerson: 'Mrs. Sharmila Sen',
    whatsappNumber: '919830554433',
    isAvailable: true
  },
  {
    title: 'Shibpur 3BHK Student Sharing Flat (Near IIEST)',
    category: 'Flat',
    location: 'Howrah',
    area: 'Shibpur (Near IIEST Campus)',
    address: 'Botanical Garden Road, Near IIEST Shibpur Main Gate, Howrah, West Bengal 711103',
    price: 14000,
    deposit: 18000,
    roomType: '3 BHK',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.6,
    totalReviews: 27,
    amenities: [
      'Independent Study Corners for Each Student',
      'Washing Machine & Refrigerator',
      'Piped Gas with Stove',
      '24-Hour Sweet Water Supply',
      'Covered Bike Parking',
      'Balcony with Green Garden View'
    ],
    description: 'Spacious, well-ventilated 3BHK flat located less than 500 meters from IIEST Shibpur campus. Ideal for 5-6 engineering students. Quiet, green neighborhood with nearby food joints, grocery stores, and bus stands.',
    contactPerson: 'Pradip Chandra Dutta',
    whatsappNumber: '919836778899',
    isAvailable: true
  },
  {
    title: 'Heritage & Ruby EM Bypass Student PG',
    category: 'PG',
    location: 'Kolkata',
    area: 'EM Bypass / Kasba',
    address: 'Anandapur Main Road, Near Heritage Institute of Technology & Ruby Hospital, Kolkata, West Bengal 700107',
    price: 5800,
    deposit: 7000,
    roomType: 'Triple Sharing',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    totalReviews: 52,
    amenities: [
      'High-speed Wi-Fi',
      '2 Meals Daily (Breakfast & Dinner)',
      'Attached Bathroom',
      'Geyser & Water Purifier',
      'Free Bicycle/Scooter Parking',
      'CCTV on All Floors'
    ],
    description: 'Affordable, clean student residence built specifically for students of Heritage Institute of Technology, Meghnad Saha College, and Ruby Hospital trainees. Fast connectivity to EM Bypass, Ruby More, and Garia.',
    contactPerson: 'Sanjay Chakraborty',
    whatsappNumber: '919830221144',
    isAvailable: true
  },
  {
    title: 'Maa Tara Student Mess & Fooding Facility',
    category: 'Mess',
    location: 'Kolkata',
    area: 'Dum Dum Cantonment',
    address: 'Subhas Nagar, Near Dum Dum Cantonment Railway Station & Metro, Kolkata, West Bengal 700065',
    price: 3200,
    deposit: 500,
    roomType: 'Full Mess Service',
    furnishedStatus: 'Furnished',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    totalReviews: 64,
    amenities: [
      '3 Wholesome Meals Daily',
      'Choice of Veg and Non-Veg Menu',
      'Daily Special Chutney & Papad',
      'Monthly Discount Packages for Students',
      'Clean Stainless Steel Utensils',
      'Tiffin Carrier Delivery Service'
    ],
    description: 'Pocket-friendly student mess located close to Dum Dum Metro and Railway Station. Perfect for students commuting to North Kolkata colleges. Wholesome home-style cooking with minimum oil, fresh fish, egg curries, and paneer dishes.',
    contactPerson: 'Tapan Ghosh',
    whatsappNumber: '919831445566',
    isAvailable: true
  }
];

// Helper to seed/ensure default properties in MongoDB Atlas
async function seedDefaultPropertiesIfNeeded() {
  try {
    const count = await Property.countDocuments();
    // If no properties or only old dummy properties, seed Kolkata properties
    const hasKolkata = await Property.findOne({ location: 'Kolkata' });
    if (count === 0 || !hasKolkata) {
      console.log('🌱 Seeding West Bengal / Kolkata properties into MongoDB database...');
      await Property.deleteMany({});
      await Property.insertMany(kolkataAndWBSampleProperties);
      console.log(`✅ Successfully seeded ${kolkataAndWBSampleProperties.length} Kolkata & West Bengal properties!`);
    }
  } catch (err) {
    console.error('Error auto-seeding properties:', err.message);
  }
}

// Auto-seed check on route initialization
seedDefaultPropertiesIfNeeded();

// GET /api/seed - Trigger database re-seed with Kolkata/WB properties
router.get('/', async (req, res) => {
  try {
    await Property.deleteMany({});
    const createdProperties = await Property.insertMany(kolkataAndWBSampleProperties);

    res.json({
      success: true,
      message: `Database re-seeded with ${createdProperties.length} Kolkata & West Bengal properties!`,
      count: createdProperties.length,
      data: createdProperties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/seed - Trigger database re-seed with Kolkata/WB properties
router.post('/', async (req, res) => {
  try {
    await Property.deleteMany({});
    const createdProperties = await Property.insertMany(kolkataAndWBSampleProperties);

    res.json({
      success: true,
      message: `Database seeded successfully with ${createdProperties.length} West Bengal & Kolkata properties!`,
      propertiesCount: createdProperties.length,
      data: createdProperties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
