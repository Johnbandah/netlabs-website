const dotenv = require('dotenv');
dotenv.config();
const { sendEmail } = require('./config/email');

async function testEmail() {
  console.log('📧 Testing email configuration...');
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
  console.log('📧 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not found in .env');
    return;
  }

  console.log('📤 Sending test email to:', process.env.EMAIL_USER);
  console.log('⏳ Please wait... (this may take 5-10 seconds)');
  
  try {
    // Set a timeout for the email send
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timed out after 15 seconds')), 15000);
    });

    const sendPromise = sendEmail(
      process.env.EMAIL_USER,
      'Test Email from NetLabs+',
      '<h1>✅ Test Email</h1><p>If you see this, email is working!</p><p>Sent from NetLabs+ server.</p><p>Time: ' + new Date().toLocaleString() + '</p>'
    );

    const result = await Promise.race([sendPromise, timeoutPromise]);

    if (result.success) {
      console.log('✅ Test email sent successfully! Check your inbox.');
    } else {
      console.error('❌ Test email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('timed out')) {
      console.log('💡 Tip: Check your internet connection and Gmail settings.');
      console.log('💡 Make sure 2-Step Verification is enabled and App Password is correct.');
    }
  }
}

testEmail();