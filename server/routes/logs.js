const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect, adminOnly } = require('../middleware/auth');

// Get logs with filters (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { level, category, search, startDate, endDate, limit, page } = req.query;
    
    const limitNum = parseInt(limit) || 100;
    const skip = (parseInt(page) || 1) * limitNum - limitNum;
    
    // Build query
    const query = {};
    if (level) query.level = level;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    // Search in message field
    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .populate('userId', 'name email');
    
    const total = await Log.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        logs,
        total,
        page: parseInt(page) || 1,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
});

// Get log statistics (Admin only)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          errors: { $sum: { $cond: [{ $eq: ['$level', 'error'] }, 1, 0] } },
          warnings: { $sum: { $cond: [{ $eq: ['$level', 'warning'] }, 1, 0] } },
          success: { $sum: { $cond: [{ $eq: ['$level', 'success'] }, 1, 0] } },
          info: { $sum: { $cond: [{ $eq: ['$level', 'info'] }, 1, 0] } }
        }
      }
    ]);

    // Get logs by category
    const categoryStats = await Log.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent errors (last 24 hours)
    const recentErrors = await Log.countDocuments({
      level: 'error',
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        total: stats[0]?.total || 0,
        errors: stats[0]?.errors || 0,
        warnings: stats[0]?.warnings || 0,
        success: stats[0]?.success || 0,
        info: stats[0]?.info || 0,
        categories: categoryStats,
        recentErrors
      }
    });
  } catch (error) {
    console.error('Error getting log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log statistics',
      error: error.message
    });
  }
});

// Get system status (Public)
router.get('/status', async (req, res) => {
  try {
    // Check system health
    const recentErrors = await Log.countDocuments({
      level: 'error',
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    let status = 'online';
    if (recentErrors > 10) status = 'degraded';
    if (recentErrors > 50) status = 'offline';
    
    res.json({
      success: true,
      data: {
        status,
        uptime: process.uptime(),
        lastChecked: new Date().toISOString(),
        recentErrors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking system status',
      error: error.message
    });
  }
});

// Create a log entry (for frontend logging)
router.post('/', async (req, res) => {
  try {
    const log = new Log({
      level: req.body.level || 'info',
      message: req.body.message,
      source: req.body.source || 'System',
      category: req.body.category || 'system',
      ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'NetLabs+ System',
      userId: req.user?._id || null,
      details: req.body.details || {}
    });
    await log.save();
    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating log',
      error: error.message
    });
  }
});

// Clear all logs (Admin only - dangerous)
router.delete('/clear', protect, adminOnly, async (req, res) => {
  try {
    const result = await Log.deleteMany({});
    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} logs`
    });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing logs',
      error: error.message
    });
  }
});

// Delete specific log
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }
    res.json({
      success: true,
      message: 'Log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting log',
      error: error.message
    });
  }
});

module.exports = router;