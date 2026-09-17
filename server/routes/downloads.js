const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Download = require('../models/Download');
const { protect, adminOnly } = require('../middleware/auth');

// ============================================
// MULTER SETUP - File Upload
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// ============================================
// ADMIN ROUTES - Upload & Manage
// ============================================

// Upload new download file (ADMIN)
router.post('/admin/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const download = await Download.create({
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'General',
      price: Number(req.body.price) || 0,
      fileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: download });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all downloads (ADMIN)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const downloads = await Download.find().sort({ createdAt: -1 });
    res.json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a download (ADMIN)
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) {
      return res.status(404).json({ success: false, message: 'Download not found' });
    }

    if (fs.existsSync(download.filePath)) {
      fs.unlinkSync(download.filePath);
    }

    await download.deleteOne();
    res.json({ success: true, message: 'Download deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle active status (ADMIN)
router.put('/admin/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) return res.status(404).json({ success: false });

    download.isActive = !download.isActive;
    await download.save();

    res.json({ success: true, data: download });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// USER ROUTES - Browse & Download
// ============================================

// Get all available downloads (USER)
router.get('/available', async (req, res) => {
  try {
    const downloads = await Download.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// REAL FILE DOWNLOAD (USER)
router.get('/file/:id', async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download || !download.isActive) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (!fs.existsSync(download.filePath)) {
      return res.status(404).json({ success: false, message: 'File missing on server' });
    }

    download.downloadCount += 1;
    await download.save();

    res.download(download.filePath, download.fileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// USER'S PURCHASED DOWNLOADS
// ============================================
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      userId: userId,
      status: { $in: ['completed', 'delivered', 'processing', 'paid'] }
    });

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

    if (purchases.length === 0) {
      const freeDownloads = await Download.find({ isActive: true, price: 0 });
      const formatted = freeDownloads.map(d => ({
        productId: d._id,
        title: d.title,
        category: d.category,
        purchaseDate: d.createdAt,
        amount: 0,
        downloadUrl: `/api/downloads/file/${d._id}`,
        fileName: d.fileName
      }));
      return res.json({ success: true, data: formatted });
    }

    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get download statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    const totalPurchases = orders.reduce((sum, order) => sum + order.products.length, 0);

    res.json({
      success: true,
      data: {
        totalDownloads: 0,
        totalPurchases: totalPurchases || 0,
        totalOrders: orders.length || 0
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: { totalDownloads: 0, totalPurchases: 0, totalOrders: 0 }
    });
  }
});

module.exports = router;