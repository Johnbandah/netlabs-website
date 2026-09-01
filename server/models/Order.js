const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userEmail: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  products: [{
    productId: String,
    title: String,
    price: Number,
    quantity: Number,
    category: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'mobile_money'],
    default: 'stripe'
  },
  paymentId: {
    type: String,
    default: ''
  },
  shippingAddress: {
    address: String,
    city: String,
    country: String,
    phone: String
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Order', orderSchema);