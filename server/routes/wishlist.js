const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get user's wishlist
router.get('/user/:userId', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = new Wishlist({ userId: req.params.userId, products: [] });
      await wishlist.save();
    }
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if product already in wishlist
    const existing = wishlist.products.find(p => p.productId.toString() === productId);
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already in wishlist' 
      });
    }

    wishlist.products.push({ productId });
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove product from wishlist
router.delete('/remove/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      p => p.productId.toString() !== productId
    );
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear wishlist
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = [];
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({ success: true, message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if product is in wishlist
router.get('/check/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.json({ success: true, inWishlist: false });
    }

    const inWishlist = wishlist.products.some(
      p => p.productId.toString() === productId
    );

    res.json({ success: true, inWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;