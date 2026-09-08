const express = require('express');
const router = express.Router();
const QuoteRequest = require('../models/QuoteRequest');
const { sendEmail } = require('../config/email');

// Submit quote request
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    // Save to database - removed userId
    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone: phone || '',
      company: company || '',
      message,
      serviceType: 'General',
      industry: 'Other'
    });
    await quoteRequest.save();

    console.log(`📋 New quote request from ${name} (${email})`);

    // Send email notification to admin
    const adminEmail = process.env.EMAIL_USER || 'info.netlabsplus@gmail.com';
    
    try {
      await sendEmail(
        adminEmail,
        `📋 New Quote Request from ${name}`,
        `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/quote-requests">View in Admin</a></p>
        `
      );
    } catch (emailError) {
      console.error('Email error (admin):', emailError.message);
    }

    // Send auto-reply to user
    try {
      await sendEmail(
        email,
        'Quote Request Received - NetLabs+',
        `
          <h2>Thank You ${name}!</h2>
          <p>We've received your quote request and will get back to you within 24 hours.</p>
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p>NetLabs+ Network Security & Innovation Hub</p>
          <p>📧 info.netlabsplus@gmail.com</p>
          <p>📞 +263 86772 11857</p>
        `
      );
    } catch (emailError) {
      console.error('Email error (user):', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully!',
      data: quoteRequest
    });
  } catch (error) {
    console.error('Error submitting quote request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting quote request'
    });
  }
});

// Get all quote requests
router.get('/', async (req, res) => {
  try {
    const requests = await QuoteRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single quote request
router.get('/:id', async (req, res) => {
  try {
    const request = await QuoteRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Quote request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update quote request status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const request = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, message: 'Quote request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete quote request
router.delete('/:id', async (req, res) => {
  try {
    await QuoteRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quote request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;