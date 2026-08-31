const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add these with other routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));

// Routes - Make sure these are correct
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/products', require('./routes/products'));

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'NetLabs+ API is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}`);
  console.log(`🗄️  Database: MongoDB (netlabs)`);
});