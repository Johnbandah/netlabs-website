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

// Simple email templates (no links, plain text)
const emailTemplates = {
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
  })
};

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
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false };
  }
};

module.exports = { transporter, emailTemplates, sendEmail };