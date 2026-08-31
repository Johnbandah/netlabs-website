const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { emailTemplates, sendEmail } = require('../config/email');

// Create a new inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const inquiry = new Inquiry({ name, email, subject, message });
    await inquiry.save();

    console.log(`📧 New inquiry from ${name} (${email})`);

    // Send email notification to admin
    const adminEmail = process.env.EMAIL_USER || 'info.netlabsplus@gmail.com';
    const adminTemplate = emailTemplates.adminInquiry({ name, email, subject, message });
    await sendEmail(adminEmail, adminTemplate.subject, adminTemplate.html);

    // Send auto-reply to user
    const userTemplate = emailTemplates.userInquiryReply({ name, email, subject, message });
    await sendEmail(email, userTemplate.subject, userTemplate.html);

    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully! We\'ve sent a confirmation to your email.',
      data: inquiry 
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting inquiry',
      error: error.message 
    });
  }
});

// Get all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get inquiry by ID
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;