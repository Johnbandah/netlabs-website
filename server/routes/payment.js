const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { products, userId } = req.body;

    const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Convert to cents (MWK doesn't have cents, but Stripe requires integer)
    const amount = Math.round(totalAmount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd', // Use 'usd' for test, or 'mwk' if supported
      metadata: {
        userId: userId || 'guest',
        products: JSON.stringify(products.map(p => ({ id: p._id, title: p.title, quantity: p.quantity })))
      }
    });

    // Create order
    const order = new Order({
      userId: userId || 'guest',
      products: products.map(p => ({
        productId: p._id,
        title: p.title,
        price: p.price,
        quantity: p.quantity
      })),
      totalAmount: amount,
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

      // If user is logged in, add to purchases
      if (order.userId && order.userId !== 'guest') {
        const user = await User.findById(order.userId);
        if (user) {
          order.products.forEach(product => {
            user.purchases.push({
              productId: product.productId,
              purchaseDate: new Date(),
              amount: product.price
            });
          });
          await user.save();
        }
      }

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