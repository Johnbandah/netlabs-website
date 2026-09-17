require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');

(async () => {
  await connectDB();

  const email = 'admin@netlabs.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: 'Administrator',
    email,
    password: 'admin123',
    role: 'admin'
  });

  console.log('Admin created:');
  console.log('   Email: admin@netlabs.com');
  console.log('   Password: admin123');
  process.exit(0);
})();
