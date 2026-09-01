const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Helper to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Get all blogs (admin) - includes drafts
router.get('/admin', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      status: 'published' 
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    // Increment views
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get blog by ID (admin)
router.get('/id/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create blog (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featuredImage, author, status, scheduledFor } = req.body;
    
    const slug = generateSlug(title);
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ 
        success: false, 
        message: 'A blog with this title already exists' 
      });
    }

    const blogData = {
      title,
      slug,
      excerpt,
      content,
      category: category || 'Technology',
      tags: tags || [],
      featuredImage: featuredImage || '',
      author: author || 'NetLabs+ Team',
      status: status || 'draft'
    };

    // Handle scheduling
    if (status === 'scheduled' && scheduledFor) {
      blogData.scheduledFor = new Date(scheduledFor);
    }

    if (status === 'published') {
      blogData.publishedAt = new Date();
    }

    const blog = new Blog(blogData);
    await blog.save();
    
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update blog (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featuredImage, author, status, scheduledFor } = req.body;
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const updateData = {
      title: title || blog.title,
      excerpt: excerpt || blog.excerpt,
      content: content || blog.content,
      category: category || blog.category,
      tags: tags || blog.tags,
      featuredImage: featuredImage || blog.featuredImage,
      author: author || blog.author,
      status: status || blog.status,
      updatedAt: new Date()
    };

    // Update slug if title changed
    if (title && title !== blog.title) {
      updateData.slug = generateSlug(title);
    }

    // Handle scheduling
    if (status === 'scheduled' && scheduledFor) {
      updateData.scheduledFor = new Date(scheduledFor);
    } else if (status === 'scheduled') {
      updateData.scheduledFor = blog.scheduledFor;
    }

    if (status === 'published' && blog.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ success: true, data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete blog (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get blog stats (admin only)
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Blog.countDocuments();
    const published = await Blog.countDocuments({ status: 'published' });
    const drafts = await Blog.countDocuments({ status: 'draft' });
    const scheduled = await Blog.countDocuments({ status: 'scheduled' });
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        published,
        drafts,
        scheduled,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;