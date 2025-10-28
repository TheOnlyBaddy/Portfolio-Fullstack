require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create contacts table if it doesn't exist
async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Initialize the database
initializeDatabase();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Contact model functions
const Contact = {
  async create(contactData) {
    const [result] = await pool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [contactData.name, contactData.email, contactData.subject, contactData.message]
    );
    return { id: result.insertId, ...contactData };
  },
  
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  },
  
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0];
  }
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error with email configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API' });
});

// Contact form submission
app.post('/api/contact',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      // Save to database
      await Contact.create({ name, email, subject, message });

      // Send thank you email to user
      const userMailOptions = {
        from: `"${process.env.EMAIL_FROM || 'Portfolio Contact'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Thank You for Contacting Me!',
        text: `Hi ${name},\n\nThank you for reaching out through my portfolio! I've received your message and will get back to you as soon as possible.\n\nHere's a quick summary of your submission:\nName: ${name}\nSubject: ${subject}\n\nYour Message:\n${message}\n\nI appreciate you taking the time to write to me.\n\nWarm regards,\n${process.env.EMAIL_SIGNATURE || 'Your Name'}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748;">
            <div style="background-color: #4f46e5; padding: 2rem; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 1.875rem; font-weight: 600;">Thank You for Reaching Out!</h1>
            </div>
            <div style="padding: 2rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
              <p style="font-size: 1.125rem; margin-bottom: 1.5rem;">Hi ${name},</p>
              <p style="margin-bottom: 1.5rem;">Thank you for contacting me through my portfolio. I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 1rem; margin: 1.5rem 0; border-radius: 0.25rem;">
                <p style="margin: 0.5rem 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0.5rem 0 0 0;"><strong>Your Message:</strong></p>
                <p style="margin: 0.5rem 0 0 0; white-space: pre-line; background-color: white; padding: 0.75rem; border-radius: 0.25rem; border: 1px solid #e2e8f0;">${message}</p>
              </div>
              
              <p style="margin-bottom: 1.5rem;">If you have any additional information to add, feel free to reply to this email.</p>
              
              <p style="margin-bottom: 0.5rem;">Best regards,</p>
              <p style="margin: 0; font-weight: 600;">${process.env.EMAIL_SIGNATURE || 'Shubh Barnwal'}</p>
              
              <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 0.875rem;">
                <p style="margin: 0.5rem 0;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        `
      };

      // Send notification to admin
      const adminMailOptions = {
        from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `📧 New Contact: ${subject.length > 30 ? subject.substring(0, 30) + '...' : subject}`,
        text: `🔔 New Contact Form Submission 🔔

You've received a new message from your portfolio website.

📝 Contact Details:
• Name: ${name}
• Email: ${email}
• Subject: ${subject}
• Received: ${new Date().toLocaleString()}

📩 Message:
${message}

📤 You can reply directly to this email to respond to ${name}.`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748;">
            <div style="background-color: #4f46e5; padding: 1.5rem; text-align: center; color: white; border-radius: 0.5rem 0.5rem 0 0;">
              <h1 style="margin: 0; font-size: 1.5rem; font-weight: 600;">✨ New Portfolio Contact ✨</h1>
              <p style="margin: 0.5rem 0 0; opacity: 0.9; font-size: 0.9rem;">${new Date().toLocaleString()}</p>
            </div>
            
            <div style="padding: 2rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
              <div style="background-color: #f0f9ff; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <h2 style="margin: 0 0 1rem 0; color: #0369a1; font-size: 1.25rem;">👤 Contact Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #e0f2fe; width: 100px; font-weight: 600;">Name:</td>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #e0f2fe;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #e0f2fe; font-weight: 600;">Email:</td>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #e0f2fe;">
                      <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0.5rem 0; font-weight: 600;">Subject:</td>
                    <td style="padding: 0.5rem 0;">${subject}</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 0.75rem 0; color: #1e40af; font-size: 1.1rem;">📩 Message</h3>
                <div style="background-color: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; white-space: pre-line;">
                  ${message}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
                <a href="mailto:${email}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; transition: background-color 0.2s;">
                  ✉️ Reply to ${name.split(' ')[0]}
                </a>
                <p style="margin: 1rem 0 0; color: #64748b; font-size: 0.875rem;">
                  This message was sent from your portfolio contact form
                </p>
              </div>
            </div>
          </div>
        `
      };

      // Send emails in parallel
      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message! I will get back to you soon.' 
      });

    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your request. Please try again later.' 
      });
    }
  }
);

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
