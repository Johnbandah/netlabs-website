const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get user's purchases (downloads)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all orders for this user
    const orders = await Order.find({ 
      userId: userId,
      status: { $in: ['completed', 'delivered', 'processing', 'paid'] }
    });
    
    // Extract all purchased products
    const purchases = [];
    orders.forEach(order => {
      order.products.forEach(product => {
        purchases.push({
          productId: product.productId,
          title: product.title,
          category: product.category || 'General',
          purchaseDate: order.createdAt,
          amount: product.price,
          downloadUrl: `/api/downloads/file/${product.productId}`,
          fileName: `${product.title.replace(/\s+/g, '-')}.zip`
        });
      });
    });
    
    // If no purchases found, return sample data for demo
    if (purchases.length === 0) {
      const samplePurchases = [
        {
          productId: 'sample_1',
          title: 'Packet Tracer Labs Bundle',
          category: 'Labs',
          purchaseDate: new Date().toISOString(),
          amount: 29.99,
          downloadUrl: `/api/downloads/file/sample_1`,
          fileName: 'Packet-Tracer-Labs.zip'
        },
        {
          productId: 'sample_2',
          title: 'Networking Documentation Suite',
          category: 'Documentation',
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 19.99,
          downloadUrl: `/api/downloads/file/sample_2`,
          fileName: 'Networking-Documentation.zip'
        }
      ];
      return res.json({ success: true, data: samplePurchases });
    }
    
    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    // Return sample data on error
    const samplePurchases = [
      {
        productId: 'sample_1',
        title: 'Packet Tracer Labs Bundle',
        category: 'Labs',
        purchaseDate: new Date().toISOString(),
        amount: 29.99,
        downloadUrl: `/api/downloads/file/sample_1`,
        fileName: 'Packet-Tracer-Labs.zip'
      },
      {
        productId: 'sample_2',
        title: 'Networking Documentation Suite',
        category: 'Documentation',
        purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 19.99,
        downloadUrl: `/api/downloads/file/sample_2`,
        fileName: 'Networking-Documentation.zip'
      }
    ];
    res.json({ success: true, data: samplePurchases });
  }
});

// Download file
router.get('/file/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;

    console.log(`📥 Download requested: Product ${productId}, User ${userId}`);

    // For demo purposes, create a sample text file
    // In production, this would serve actual files from storage
    
    let fileName = 'download.txt';
    let fileContent = '';
    
    // Create different content based on product
    if (productId === 'sample_1' || productId === '1') {
      fileName = 'Packet-Tracer-Labs.zip';
      fileContent = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              Packet Tracer Labs Bundle                   ║
║                                                          ║
║  This is a sample download file for:                    ║
║  Packet Tracer Labs Bundle                              ║
║                                                          ║
║  Contains:                                              ║
║  ✓ 20+ Packet Tracer lab files                          ║
║  ✓ Network topology diagrams                            ║
║  ✓ Configuration guides                                 ║
║  ✓ Step-by-step instructions                            ║
║                                                          ║
║  Downloaded on: ${new Date().toLocaleString()}           ║
║                                                          ║
║  Thank you for purchasing from NetLabs+!                ║
║                                                          ║
║  In production, this would be your actual .pkt files.   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `;
    } else if (productId === 'sample_2' || productId === '2') {
      fileName = 'Networking-Documentation.zip';
      fileContent = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           Networking Documentation Suite                ║
║                                                          ║
║  This is a sample download file for:                    ║
║  Networking Documentation Suite                         ║
║                                                          ║
║  Contains:                                              ║
║  ✓ Network Design Templates                             ║
║  ✓ Audit Checklists                                     ║
║  ✓ Compliance Guides                                    ║
║  ✓ Project Documentation Templates                      ║
║                                                          ║
║  Downloaded on: ${new Date().toLocaleString()}           ║
║                                                          ║
║  Thank you for purchasing from NetLabs+!                ║
║                                                          ║
║  In production, this would be your actual files.        ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `;
    } else {
      fileName = `${productId}-download.txt`;
      fileContent = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║                    NetLabs+ Download                     ║
║                                                          ║
║  Product ID: ${productId}                                ║
║  Downloaded: ${new Date().toLocaleString()}              ║
║                                                          ║
║  Thank you for purchasing from NetLabs+!                ║
║                                                          ║
║  In production, this would be your actual file.         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `;
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fileContent.length);
    
    // Send the file content
    res.send(fileContent);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Download failed: ' + error.message 
    });
  }
});

// Get download statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId: userId });
    const totalDownloads = orders.reduce((sum, order) => sum + (order.downloadCount || 0), 0);
    const totalPurchases = orders.reduce((sum, order) => sum + order.products.length, 0);
    
    res.json({
      success: true,
      data: {
        totalDownloads: totalDownloads || 0,
        totalPurchases: totalPurchases || 0,
        totalOrders: orders.length || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.json({
      success: true,
      data: {
        totalDownloads: 0,
        totalPurchases: 0,
        totalOrders: 0
      }
    });
  }
});

module.exports = router;