const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    title: 'Packet Tracer Labs Bundle',
    category: 'Labs',
    description: 'Complete collection of Packet Tracer labs for students and professionals. Includes network design, configuration, and troubleshooting exercises.',
    price: 29.99,
    features: ['Beginner to Advanced', 'Network Design', 'Configuration Labs', 'Troubleshooting']
  },
  {
    title: 'Networking Documentation Suite',
    category: 'Documentation',
    description: 'Professional documentation templates and guides for network audits, compliance, and project handovers.',
    price: 19.99,
    features: ['Audit Templates', 'Compliance Guides', 'Project Documentation', 'Handover Kits']
  },
  {
    title: 'Network Security Tutorials',
    category: 'Tutorials',
    description: 'Video tutorials covering network security fundamentals, AAA, firewall configuration, and IoT security.',
    price: 24.99,
    features: ['Security Fundamentals', 'AAA Configuration', 'Firewall Rules', 'IoT Security']
  },
  {
    title: 'Troubleshooting Guides',
    category: 'Guides',
    description: 'Step-by-step guides for troubleshooting common network issues, VLAN problems, routing errors, and more.',
    price: 14.99,
    features: ['VLAN Troubleshooting', 'Routing Issues', 'Security Problems', 'Wireless Issues']
  },
  {
    title: 'Enterprise Network Design',
    category: 'Labs',
    description: 'Advanced Packet Tracer labs for enterprise network design including VLAN segmentation, routing, and security.',
    price: 34.99,
    features: ['Enterprise Design', 'VLAN Segmentation', 'Routing', 'Security Implementation']
  },
  {
    title: 'Network Security Documentation',
    category: 'Documentation',
    description: 'Comprehensive security documentation including policies, procedures, and audit checklists.',
    price: 24.99,
    features: ['Security Policies', 'Procedures', 'Audit Checklists', 'Compliance']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/netlabs');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);
    
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();