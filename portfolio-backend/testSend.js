require('dotenv').config();
const { sendMail, ensureAuthenticated } = require('./utils/gmailMailer');

async function testEmail() {
  try {
    console.log('🔐 Ensuring authentication...');
    await ensureAuthenticated();
    
    console.log('\n📧 Sending test email...');
    const result = await sendMail(
      '9922008169@klu.ac.in',
      'Test from Gmail API 🚀',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">Hello Shubh! 👋</h2>
        <p>This is a test email sent using the Gmail API.</p>
        <p>If you're seeing this, your Gmail integration is working correctly! 🎉</p>
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="margin: 0; color: #5f6368; font-size: 14px;">
            <strong>Test Details:</strong><br>
            • Sent at: ${new Date().toLocaleString()}<br>
            • From: ${process.env.GMAIL_USER_EMAIL}
          </p>
        </div>
      </div>
      `,
      {
        cc: '',  // Add CC emails if needed
        bcc: '', // Add BCC emails if needed
        replyTo: process.env.GMAIL_USER_EMAIL
      }
    );
    
    console.log('\n✅ Test email sent successfully!');
    console.log('📨 Message ID:', result.id);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to send test email:');
    console.error(error.message);
    
    if (error.response?.data) {
      console.error('\nError details:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env are correct');
    console.log('2. Verify that the GMAIL_REFRESH_TOKEN is valid and not expired');
    console.log('3. Check that the Gmail API is enabled in Google Cloud Console');
    console.log('4. Ensure the GMAIL_USER_EMAIL has granted necessary permissions');
    
    process.exit(1);
  }
}

// Set a timeout to prevent hanging
const timeout = setTimeout(() => {
  console.error('\n⏰ Error: Request timed out. Check your internet connection and try again.');
  process.exit(1);
}, 30000); // 30 seconds timeout

// Run the test
testEmail().finally(() => {
  clearTimeout(timeout);
});
