const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single coupon
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validate coupon by code
router.get('/validate/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const coupon = await Coupon.findOne({ code });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid coupon code' 
      });
    }

    // Check if active
    if (coupon.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon is not active' 
      });
    }

    // Check expiry
    if (coupon.endDate && new Date() > new Date(coupon.endDate)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon has expired' 
      });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon usage limit reached' 
      });
    }

    res.json({ 
      success: true, 
      data: coupon 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create coupon
router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, ...otherFields } = req.body;
    
    // Generate code if not provided
    const couponCode = code || generateCouponCode();
    
    const coupon = new Coupon({
      code: couponCode.toUpperCase(),
      discountType,
      discountValue,
      ...otherFields
    });
    
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update coupon
router.put('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply coupon to order (calculate discount)
router.post('/apply', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid coupon code' 
      });
    }

    // Validate coupon
    if (coupon.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon is not active' 
      });
    }

    if (coupon.endDate && new Date() > new Date(coupon.endDate)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon has expired' 
      });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon usage limit reached' 
      });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount is ${coupon.minOrderAmount}` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount > 0) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    res.json({
      success: true,
      data: {
        coupon,
        discount,
        newTotal: subtotal - discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate coupon code
function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;