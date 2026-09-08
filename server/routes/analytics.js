const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');

// Get sales analytics
router.get('/sales', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch(period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get orders
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now },
      status: { $in: ['completed', 'delivered', 'paid'] }
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get daily sales data for charts
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          status: { $in: ['completed', 'delivered', 'paid'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'delivered', 'paid'] }
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.title',
          totalSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          orderCount: totalOrders
        },
        dailySales,
        topProducts,
        period
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user analytics
router.get('/users', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // User growth by month
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeUsers,
          newUsers,
          userGrowth
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get product analytics
router.get('/products', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();

    // Get category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get low stock products (if stock tracking exists)
    const lowStock = products.filter(p => p.stock && p.stock < 10);

    res.json({
      success: true,
      data: {
        summary: {
          totalProducts,
          categories: categoryDistribution,
          lowStock: lowStock.length
        },
        categoryDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate = new Date();
    
    switch(period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now },
      status: { $in: ['completed', 'delivered', 'paid'] }
    });

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'delivered', 'paid'] }
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.category',
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Revenue trends (daily)
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          status: { $in: ['completed', 'delivered', 'paid'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        },
        revenueByCategory,
        revenueTrend,
        period
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get analytics dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    // Get all data in parallel
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      pendingOrders,
      newUsers
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['completed', 'delivered', 'paid'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'delivered', 'paid'] } } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.category',
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalUsers,
          totalProducts,
          pendingOrders,
          newUsers
        },
        recentOrders,
        revenueByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;