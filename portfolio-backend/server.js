require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Contact = require('./models/Contact');
const envConfig = require('./config/envConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Set NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// MongoDB connection
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('\x1b[31m❌ Error connecting to MongoDB:\x1b[0m', error);
    process.exit(1);
  }
}

// Initialize the database connection
connectToDatabase().then(() => {
  console.log('\x1b[36m%s\x1b[0m', '\n🔄  MongoDB connected successfully!');
}).catch(err => {
  console.error('\x1b[31m%s\x1b[0m', '❌  MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: envConfig.getFrontendUrl(),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// Contact controller functions
const contactController = {
  async create(contactData) {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
  },
  
  async findAll() {
    return await Contact.find().sort({ createdAt: -1 });
  },
  
  async findById(id) {
    return await Contact.findById(id);
  }
};

// Import the email utility
const { sendMail } = require('./utils/gmailMailer');

// Contact form submission endpoint
app.post('/api/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    // Save to database
    const contact = await contactController.create(req.body);
    console.log('\n📩 New contact form submission received!');
console.log('   👤 Name:', contact.name);
console.log('   📧 Email:', contact.email);
if (contact.subject) console.log('   📝 Subject:', contact.subject);
console.log('   🕒 Submitted:', new Date(contact.createdAt).toLocaleString());
    
    // Send email to admin (you)
    const adminEmail = process.env.GMAIL_USER_EMAIL;
    const userEmail = req.body.email;
    const userName = req.body.name;
    const userMessage = req.body.message;
    
    // 1. Email to admin (you)
    try {
      const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f8ff;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          <!-- Header with subtle gradient -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.3px;">New Message from ${userName}</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px;">${new Date().toLocaleString()}</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 32px;">
            <!-- Sender Card -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;
                          background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${userName}</p>
                  <p style="margin: 0; font-size: 14px; color: #64748b;">${userEmail}</p>
                </div>
              </div>
              
              <div style="margin-top: 16px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; font-weight: 500;">Subject: <span style="color: #334155;">${req.body.subject || 'No Subject'}</span></p>
              </div>
            </div>
            
            <!-- Message -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px; 
                        border: 1px solid #e2e8f0; position: relative;">
              <div style="position: absolute; top: -10px; left: 24px; background: white; padding: 0 8px; 
                          color: #64748b; font-size: 12px; font-weight: 500;">
                MESSAGE
              </div>
              <div style="color: #334155; line-height: 1.7; font-size: 15px; white-space: pre-line;">
                ${userMessage.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;">
              <a href="mailto:${userEmail}?subject=Re: ${encodeURIComponent(req.body.subject || 'Your Message')}" 
                 style="display: block; text-align: center; background: #4f46e5; color: white; 
                        text-decoration: none; padding: 14px; border-radius: 8px; font-weight: 500; 
                        font-size: 14px; transition: all 0.2s;">
                <span style="display: block; margin-bottom: 4px;">✉️</span>
                <span>Reply</span>
              </a>
              <a href="mailto:${userEmail}?subject=Re: ${encodeURIComponent(req.body.subject || 'Your Message')}&body=Hi%20${encodeURIComponent(userName.split(' ')[0])}%2C%0A%0AThank%20you%20for%20your%20message.%20I'll%20get%20back%20to%20you%20soon.%0A%0ABest%20regards%2C%0A[Your%20Name]" 
                 style="display: block; text-align: center; background: white; color: #4f46e5; 
                        text-decoration: none; padding: 14px; border-radius: 8px; font-weight: 500; 
                        border: 1px solid #e2e8f0; font-size: 14px; transition: all 0.2s;">
                <span style="display: block; margin-bottom: 4px;">✏️</span>
                <span>Quick Reply</span>
              </a>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                This message was sent via your portfolio contact form
              </p>
              <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                Message ID: ${contact._id} • ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;

      // Send only to admin (no CC to avoid duplicates)
      await sendMail(
        adminEmail,
        `New Message from ${userName} - ${req.body.subject || 'No Subject'}`,
        adminHtml,
        { 
          replyTo: userEmail
        }
      );
      console.log('📨 Admin notification email sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin notification email:', emailError);
      // Don't fail the request if email sending fails
    }
    
    // 2. Confirmation email to the user
    try {
      const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Me</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">Thank You, ${userName}!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 16px;">I've received your message and will get back to you soon.</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; color: #64748b; font-size: 14px;"><strong>Subject:</strong> <span style="color: #334155;">${req.body.subject || 'No Subject'}</span></p>
              <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Received:</strong> <span style="color: #334155;">${new Date().toLocaleString()}</span></p>
            </div>
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #6366f1;">
              <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>Your Message:</strong></p>
              <div style="color: #4b5563; line-height: 1.6;">
                ${userMessage.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 16px; margin: 24px 0; border: 1px solid #bbf7d0;">
              <p style="margin: 0; color: #166534; display: flex; align-items: center;">
                <svg style="margin-right: 8px; flex-shrink: 0;" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#166534"/>
                </svg>
                <span>Your message has been received. I'll get back to you within 24-48 hours.</span>
              </p>
            </div>
            
            <div style="text-align: center; margin: 32px 0;
                        ">
              <p style="margin: 0 0 16px 0; color: #4b5563;">Need to add something?</p>
              <a href="mailto:${adminEmail}?subject=${encodeURIComponent('Regarding my previous message: ' + (req.body.subject || ''))}" 
                 style="display: inline-block; background: #6366f1; color: white; text-decoration: none; 
                        padding: 12px 24px; border-radius: 6px; font-weight: 500; transition: background-color 0.2s;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                Send Another Message
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; text-align: center; color: #64748b; font-size: 14px;">
              <p style="margin: 0 0 8px 0;">This is an automated message. Please do not reply to this email.</p>
              <p style="margin: 0;">If you have any questions, feel free to contact me at <a href="mailto:${adminEmail}" style="color: #6366f1; text-decoration: none;">${adminEmail}</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;

      // Send only to user (no CC to avoid duplicates)
      await sendMail(
        userEmail,
        `Thank you for reaching out, ${userName}!`,
        userHtml,
        { 
          replyTo: adminEmail
        }
      );
      console.log('✉️  User confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send user confirmation email:', emailError);
      // Don't fail the request if email sending fails
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Message received successfully! We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    console.error('\x1b[31m❌ Error processing contact form:\x1b[0m', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process your message. Please try again later.' 
    });
  }
});

// Get all contacts (for admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await contactController.findAll();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('\x1b[31m❌ Error fetching contacts:\x1b[0m', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch contacts' 
    });
  }
});

// Get single contact (for admin)
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await contactController.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact not found' 
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('\x1b[31m❌ Error fetching contact:\x1b[0m', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch contact' 
    });
  }
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Portfolio API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      contact: {
        submit: 'POST /api/contact',
        list: 'GET /api/contacts',
        get: 'GET /api/contacts/:id'
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.clear();
  console.log('\x1b[32m%s\x1b[0m', '🚀 Server is up and running!');
  console.log('\x1b[36m%s\x1b[0m', `   → Port: ${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', `   → Environment: ${process.env.NODE_ENV}`);
  console.log('\x1b[36m%s\x1b[0m', '   → Timestamp:', new Date().toLocaleString());
  console.log('\n🔗 Available endpoints:');
  console.log('   \x1b[35m%s\x1b[0m', '→ POST /api/contact', '\t\tSubmit contact form');
  console.log('   \x1b[35m%s\x1b[0m', '→ GET  /api/contacts', '\t\tGet all contacts (admin)');
  console.log('   \x1b[35m%s\x1b[0m', '→ GET  /', '\t\t\tAPI status\n');
  console.log('\x1b[2m%s\x1b[0m', '📡 Waiting for requests...\n');
});
