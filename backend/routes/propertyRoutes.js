const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties with filtering options directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const { category, location, area, furnishedStatus, maxPrice, search } = req.query;

    let query = {};
    if (category && category !== 'All') query.category = category;
    if (furnishedStatus && furnishedStatus !== 'All') query.furnishedStatus = furnishedStatus;
    if (maxPrice && !isNaN(maxPrice)) query.price = { $lte: Number(maxPrice) };
    if (location && location.trim() !== '') query.location = { $regex: location.trim(), $options: 'i' };
    if (area && area.trim() !== '') query.area = { $regex: area.trim(), $options: 'i' };
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { area: searchRegex },
        { description: searchRegex },
        { roomType: searchRegex }
      ];
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single property by ID directly from MongoDB
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    return res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new property directly in MongoDB
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      area,
      address,
      price,
      deposit,
      roomType,
      furnishedStatus,
      images,
      rating,
      amenities,
      description,
      contactPerson,
      whatsappNumber,
      isAvailable
    } = req.body;

    if (!title || !category || !location || !area || !address || !price || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, location, area, address, price, whatsappNumber'
      });
    }

    let formattedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      formattedImages = images;
    } else if (typeof images === 'string' && images.trim() !== '') {
      formattedImages = images.split(',').map((img) => img.trim());
    } else {
      formattedImages = ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'];
    }

    let formattedAmenities = ['High-speed Wi-Fi', '24/7 Security', 'RO Water'];
    if (Array.isArray(amenities) && amenities.length > 0) {
      formattedAmenities = amenities;
    } else if (typeof amenities === 'string' && amenities.trim() !== '') {
      formattedAmenities = amenities.split(',').map((item) => item.trim());
    }

    const newProperty = await Property.create({
      title,
      category,
      location,
      area,
      address,
      price: Number(price),
      deposit: deposit ? Number(deposit) : 0,
      roomType: roomType || 'Single Room',
      furnishedStatus: furnishedStatus || 'Furnished',
      images: formattedImages,
      rating: rating ? Number(rating) : 4.5,
      totalReviews: 1,
      amenities: formattedAmenities,
      description: description || 'Ideal student accommodation close to colleges.',
      contactPerson: contactPerson || 'Property Manager',
      whatsappNumber,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    return res.status(201).json({ success: true, message: 'Property created successfully!', data: newProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update property directly in MongoDB
router.put('/:id', async (req, res) => {
  try {
    if (req.body.images && typeof req.body.images === 'string') {
      req.body.images = req.body.images.split(',').map((img) => img.trim());
    }
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities.split(',').map((item) => item.trim());
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedProperty) return res.status(404).json({ success: false, message: 'Property not found' });
    return res.json({ success: true, message: 'Property updated successfully!', data: updatedProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE property directly in MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    await Property.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Property deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
