const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    default: 'General'
  },
  industry: {
    type: String,
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);