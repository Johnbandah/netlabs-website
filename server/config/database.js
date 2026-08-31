const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/netlabs');
    console.log('✅ MongoDB Connected Successfully to netlabs database');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit process, just log the error
    console.log('⚠️  Continuing without database...');
  }
};

module.exports = connectDB;