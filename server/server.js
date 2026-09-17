const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const analyticsRoutes = require('./routes/analytics');

// ===== ADD THIS LINE =====
const Log = require('./models/Log');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ADD THIS AUTOMATIC LOGGING MIDDLEWARE =====
// Logs all API requests
app.use((req, res, next) => {
  // Skip logging for test route and static files
  if (req.originalUrl === '/api/test' || req.originalUrl.startsWith('/static')) {
    return next();
  }

  const start = Date.now();
  
  // Only log API requests
  if (req.originalUrl.startsWith('/api')) {
    // Store original end method
    const originalEnd = res.end;
    res.end = function(...args) {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? 'error' : res.statusCode >= 300 ? 'warning' : 'success';
      
      // Determine category based on route
      let category = 'system';
      if (req.originalUrl.includes('/auth')) category = 'auth';
      else if (req.originalUrl.includes('/payment')) category = 'payment';
      else if (req.originalUrl.includes('/users') || req.originalUrl.includes('/profile')) category = 'user';
      else if (req.originalUrl.includes('/orders')) category = 'payment';
      else if (req.originalUrl.includes('/products')) category = 'system';
      else if (req.originalUrl.includes('/blog')) category = 'system';
      
      // Create log entry (only if not a GET request or if it's an error)
      if (req.method !== 'GET' || res.statusCode >= 400) {
        const log = new Log({
          level: level,
          message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
          source: 'API',
          category: category,
          ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
          userAgent: req.headers['user-agent'] || 'NetLabs+ System',
          userId: req.user?._id || null,
          details: {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: duration,
            query: req.query,
            body: req.method !== 'GET' && req.method !== 'DELETE' ? req.body : undefined
          }
        });
        
        // Save log asynchronously (don't block response)
        log.save().catch(err => console.error('Error saving log:', err));
      }
      
      originalEnd.apply(res, args);
    };
  }
  next();
});

// Import routes
const inquiryRoutes = require('./routes/inquiries');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const quoteRoutes = require('./routes/quoteRequests');
const downloadRoutes = require('./routes/downloads');
const couponRoutes = require('./routes/coupons');

// ===== ADD THIS LINE =====
const logRoutes = require('./routes/logs');

// Routes
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/quote-requests', quoteRoutes);
app.use('/api/downloads', downloadRoutes);

// ===== ADD THIS LINE (after other routes) =====
app.use('/api/logs', logRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'NetLabs+ API is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // ===== ADD THIS ERROR LOGGING =====
  const log = new Log({
    level: 'error',
    message: `Error: ${err.message}`,
    source: 'System',
    category: 'system',
    ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'NetLabs+ System',
    userId: req.user?._id || null,
    details: {
      url: req.originalUrl,
      method: req.method,
      stack: err.stack
    }
  });
  log.save().catch(err => console.error('Error saving error log:', err));
  
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}`);
  console.log(`🗄️  Database: MongoDB (netlabs)`);
  console.log(`📝 Blog API: /api/blog`);
  console.log(`💳 Payment API: /api/payment`);
  console.log(`👥 Users API: /api/users`);
  console.log(`📦 Orders API: /api/orders`);
  console.log(`❤️ Wishlist API: /api/wishlist`);
  console.log(`📋 Quote Requests API: /api/quote-requests`);
  console.log(`📥 Downloads API: /api/downloads`);
  // ===== ADD THIS LINE =====
  console.log(`📊 Logs API: /api/logs`);
});