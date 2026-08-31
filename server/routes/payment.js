const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_...');
const Order = require('../models/Order');
const User = require('../models/User');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { products, userId } = req.body;

    const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId,
        products: JSON.stringify(products.map(p => p.id))
      }
    });

    // Create order
    const order = new Order({
      userId,
      products: products.map(p => ({
        productId: p.id,
        title: p.title,
        price: p.price
      })),
      totalAmount,
      stripePaymentId: paymentIntent.id,
      status: 'pending'
    });
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findById(orderId);
      order.status = 'paid';
      order.paidAt = new Date();
      await order.save();

      // Add to user's purchases
      const user = await User.findById(order.userId);
      order.products.forEach(product => {
        user.purchases.push({
          productId: product.productId,
          purchaseDate: new Date(),
          amount: product.price
        });
      });
      await user.save();

      res.json({ 
        success: true, 
        message: 'Payment successful!',
        orderId: order._id
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not successful' 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;