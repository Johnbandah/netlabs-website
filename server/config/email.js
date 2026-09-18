// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email transporter ready to send emails');
  }
});

// ============================================
// EMAIL TEMPLATES
// ============================================
const emailTemplates = {
  // ✅ Welcome email on registration (NEW)
  welcome: (data) => ({
    subject: '🎉 Welcome to NetLabs+!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px;">
        <h1 style="color: #00D4FF; text-align: center;">NetLabs+</h1>
        <p style="font-size: 16px;">Hi <strong>${data.name}</strong>,</p>
        <p>Welcome to NetLabs+ — the Office of Network Security!</p>
        <p>We're excited to have you on board. You can now:</p>
        <ul>
          <li>Browse our store for networking resources</li>
          <li>Download Packet Tracer labs and documentation</li>
          <li>Request custom network design quotes</li>
          <li>Access exclusive tutorials and templates</li>
        </ul>
        <p style="margin-top: 30px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
             style="background: linear-gradient(90deg, #00D4FF, #0066FF); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Get Started
          </a>
        </p>
        <p style="color: #B0C4DE; font-size: 12px; margin-top: 40px;">
          NetLabs+ — Network Security & Innovation Hub Technologies (Pvt) Ltd<br>
          Victoria Falls, Zimbabwe<br>
          <a href="mailto:info.netlabsplus@gmail.com" style="color: #00D4FF;">info.netlabsplus@gmail.com</a>
        </p>
      </div>
    `
  }),

  // Admin inquiry notification (existing)
  adminInquiry: (data) => ({
    subject: `📧 New Inquiry: ${data.subject}`,
    html: `
      <h2>New Inquiry Received</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong> ${data.message}</p>
      <hr>
      <p>NetLabs+ Network Security</p>
    `
  }),

  // User inquiry reply (existing)
  userInquiryReply: (data) => ({
    subject: `Thank you for contacting NetLabs+`,
    html: `
      <h2>Thank You ${data.name}!</h2>
      <p>We've received your inquiry and will get back to you within 24 hours.</p>
      <p><strong>Your Message:</strong></p>
      <p>"${data.message}"</p>
      <hr>
      <p>NetLabs+ Network Security</p>
      <p>Email: info.netlabsplus@gmail.com</p>
    `
  }),

  // Order confirmation (for future use)
  orderConfirmation: (data) => ({
    subject: `✅ Order Confirmed - #${data.orderId}`,
    html: `
      <h2>Order Confirmed</h2>
      <p>Hi <strong>${data.name}</strong>,</p>
      <p>Thank you for your purchase! Your order has been confirmed.</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Total:</strong> $${data.total}</p>
      <p>You can access your downloads from your dashboard.</p>
      <hr>
      <p>NetLabs+ Network Security</p>
    `
  }),

  // Quote request (for future use)
  quoteRequest: (data) => ({
    subject: `💼 New Quote Request from ${data.name}`,
    html: `
      <h2>Quote Request Received</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Details:</strong> ${data.details}</p>
      <hr>
      <p>NetLabs+ Network Security</p>
    `
  })
};

// ============================================
// SEND EMAIL FUNCTION
// ============================================
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Email credentials not configured');
      return { success: false };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    console.log(`📤 Attempting to send email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { transporter, emailTemplates, sendEmail };