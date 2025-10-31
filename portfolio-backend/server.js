require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Initialize the database connection
connectToDatabase();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
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

// Nodemailer transporter with simple authentication
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test email configuration with better error handling
async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('Server is ready to send emails');
    return true;
  } catch (error) {
    console.error('Error with email configuration:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    return false;
  }
}

// Test the email configuration on server start
testEmailConfig();

// Root route with contact data table
app.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    
    // Create HTML table
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Portfolio API - Contact Submissions</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1 { color: #4f46e5; }
        .status-container {
          display: flex;
          gap: 20px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .status-item {
          padding: 10px 15px;
          border-radius: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot.connected { background-color: #10b981; }
        .status-dot.disconnected { background-color: #ef4444; }
        .connected { background-color: #ecfdf5; color: #065f46; }
        .disconnected { background-color: #fef2f2; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f5ff; }
        .message { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>Portfolio API - Contact Submissions</h1>
      <div class="status-container">
        <div class="status-item ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}">
          <span class="status-dot ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}"></span>
          Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
        </div>
        <div class="status-item connected" id="frontend-status">
          <span class="status-dot connected"></span>
          Frontend: Checking...
        </div>
      </div>
      <p>Total submissions: ${contacts.length}</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    contacts.forEach(contact => {
      html += `
        <tr>
          <td>${contact.name || ''}</td>
          <td>${contact.email || ''}</td>
          <td>${contact.subject || ''}</td>
          <td class="message">${contact.message || ''}</td>
          <td>${new Date(contact.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <p><a href="/api/contacts">View raw JSON data</a></p>
      <script>
        // Check frontend connection by making an API call
        fetch('/api/contacts')
          .then(response => response.json())
          .then(data => {
            const statusEl = document.getElementById('frontend-status');
            statusEl.innerHTML = '<span class="status-dot connected"></span>Frontend: Connected';
          })
          .catch(error => {
            const statusEl = document.getElementById('frontend-status');
            statusEl.className = 'status-item disconnected';
            statusEl.innerHTML = '<span class="status-dot disconnected"></span>Frontend: Connection Error';
          });
      </script>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Error loading contact data');
  }
});

// Contact form submission
app.post('/api/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Save to MongoDB first
    const contact = await contactController.create(req.body);
    
    // Send email to admin
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Admin email
      subject: `📬 New Contact: ${req.body.subject}`,
      text: `You have a new contact form submission:

Name: ${req.body.name}
Email: ${req.body.email}
Subject: ${req.body.subject}

Message:
${req.body.message}

---
📧 Reply to: ${req.body.email}
🌐 Received via Portfolio Contact Form`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7ff; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
                  <p style="opacity: 0.9; margin: 8px 0 0; font-size: 14px;">${new Date().toLocaleString()}</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px 24px;">
                  <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                      <div style="display: flex; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                          <div style="width: 48px; height: 48px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; color: #4f46e5; font-size: 20px; font-weight: bold;">
                              ${req.body.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                              <h3 style="margin: 0 0 4px 0; font-size: 18px; color: #1e293b;">${req.body.name}</h3>
                              <p style="margin: 0; color: #64748b; font-size: 14px;">${req.body.email}</p>
                          </div>
                      </div>
                      
                      <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #334155;">${req.body.subject}</h4>
                      <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-line;">${req.body.message}</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 32px;">
                      <a href="mailto:${req.body.email}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; transition: background 0.2s;">
                          ✉️ Reply to ${req.body.name.split(' ')[0]}
                      </a>
                      <p style="margin: 16px 0 0; font-size: 13px; color: #94a3b8;">
                          This message was sent via your portfolio contact form
                      </p>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                  <p style="margin: 0;">© ${new Date().getFullYear()} ${process.env.ADMIN_NAME || 'Your Portfolio'}. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `
    };

    try {
      // Send admin notification email
      await transporter.sendMail(mailOptions);
      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending admin notification email:', {
        error: emailError.message,
        code: emailError.code,
        stack: emailError.stack
      });
      // Continue with the response even if email fails
    }

    // Send confirmation email to user
    const userMailOptions = {
      from: `"${process.env.ADMIN_NAME || 'Portfolio Admin'}" <${process.env.SMTP_USER}>`,
      to: req.body.email,
      subject: `✅ Message Received - ${req.body.subject}`,
      text: `Hi ${req.body.name},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

--- Message Details ---
Subject: ${req.body.subject}
Date: ${new Date().toLocaleString()}

Your Message:
${req.body.message}

---

I typically respond within 24-48 hours. If you need immediate assistance, please don't hesitate to reach out again.

Warm regards,
${process.env.ADMIN_NAME || 'Portfolio Admin'}

--
This is an automated message. Please do not reply to this email.`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Contacting Me</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7ff; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 24px; text-align: center; color: white;">
                  <div style="margin-bottom: 16px;">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
                          <path d="M22 10.5V17C22 20 20 22 17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2H14.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 9L12 13L18 9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M21 7V2H16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 2L21 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Message Received!</h1>
                  <p style="opacity: 0.9; margin: 8px 0 0; font-size: 15px; font-weight: 400;">Thank you for reaching out, ${req.body.name.split(' ')[0]}!</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px 24px;">
                  <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                      <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Your Message</h3>
                      <div style="background: white; border-radius: 6px; padding: 16px; border: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 8px; font-weight: 500; color: #334155;">${req.body.subject}</p>
                          <div style="height: 1px; background: #e2e8f0; margin: 12px 0;"></div>
                          <p style="margin: 0; color: #475569; line-height: 1.6; white-space: pre-line;">${req.body.message}</p>
                      </div>
                      <p style="margin: 16px 0 0; font-size: 14px; color: #64748b;">
                          <span style="display: inline-flex; align-items: center; margin-right: 16px;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  <path d="M12 8V13" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  <path d="M11.9941 16H12.0031" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              ${new Date().toLocaleString()}
                          </span>
                      </p>
                  </div>
                  
                  <div style="text-align: center; margin: 32px 0 24px;">
                      <p style="margin: 0 0 16px; font-size: 15px; color: #475569; line-height: 1.6;">
                          I've received your message and will get back to you as soon as possible. 
                          <span style="display: block; margin-top: 8px; font-weight: 500; color: #4f46e5;">
                              Typical response time: 24-48 hours
                          </span>
                      </p>
                      
                      <div style="margin: 24px 0; display: flex; justify-content: center;">
                          <div style="width: 60px; height: 4px; background: #e2e8f0; border-radius: 2px;"></div>
                      </div>
                      
                      <p style="margin: 0; font-size: 15px; color: #64748b;">
                          In the meantime, feel free to explore my portfolio:
                      </p>
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; margin-top: 12px; color: #4f46e5; font-weight: 500; text-decoration: none;">
                          Visit My Portfolio →
                      </a>
                  </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 16px; font-size: 14px; color: #94a3b8;">
                      This is an automated message. Please do not reply to this email.
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
                      © ${new Date().getFullYear()} ${process.env.ADMIN_NAME || 'Portfolio'}. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `
    };

    try {
      // Send user confirmation email
      await transporter.sendMail(userMailOptions);
      console.log('User confirmation email sent successfully');
    } catch (userEmailError) {
      console.error('Error sending user confirmation email:', {
        error: userEmailError.message,
        code: userEmailError.code,
        stack: userEmailError.stack
      });
      // Continue with the response even if email fails
    }

    res.status(201).json({ 
      success: true,
      message: 'Message sent successfully!',
      contact 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Get all contacts (for admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await contactController.findAll();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact (for admin)
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await contactController.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
