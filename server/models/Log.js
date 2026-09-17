const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'debug'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'System'
  },
  category: {
    type: String,
    enum: ['system', 'security', 'user', 'network', 'database', 'auth', 'payment'],
    default: 'system'
  },
  ip: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: 'NetLabs+ System'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });
logSchema.index({ category: 1 });

module.exports = mongoose.model('Log', logSchema);