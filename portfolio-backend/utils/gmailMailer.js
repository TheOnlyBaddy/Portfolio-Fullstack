const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Required OAuth2 scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Path to token.json
const TOKEN_PATH = path.join(__dirname, '../token.json');

// Load credentials from environment variables
const CREDENTIALS = {
  client_id: process.env.GMAIL_CLIENT_ID,
  client_secret: process.env.GMAIL_CLIENT_SECRET,
  redirect_uri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/auth/google/callback',
  user_email: process.env.GMAIL_USER_EMAIL
};

if (!CREDENTIALS.client_id || !CREDENTIALS.client_secret || !CREDENTIALS.user_email) {
  throw new Error('Missing required environment variables: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_USER_EMAIL');
}

// Initialize OAuth2 client
const oAuth2Client = new OAuth2Client(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

/**
 * Loads saved tokens from token.json
 */
async function loadSavedTokens() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    const tokens = JSON.parse(content);
    return tokens;
  } catch (err) {
    console.error('Error loading saved tokens:', err.message);
    return null;
  }
}

/**
 * Ensures the OAuth2 client is authenticated
 */
async function ensureAuthenticated() {
  try {
    // Try to load saved tokens
    const tokens = await loadSavedTokens();
    
    if (tokens) {
      // Always ensure refresh_token is present on credentials
      oAuth2Client.setCredentials({
        ...tokens,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN || tokens.refresh_token,
      });
      
      // Check if token is expired
      if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
        console.log('Token expired, refreshing...');
        // Request a fresh access token using the stored refresh token
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const access_token = typeof accessTokenResponse === 'string' 
          ? accessTokenResponse 
          : accessTokenResponse?.token;
        if (!access_token) throw new Error('Failed to obtain access token');

        const newCreds = {
          ...tokens,
          access_token,
          token_type: 'Bearer',
          scope: tokens.scope || SCOPES.join(' '),
          refresh_token: process.env.GMAIL_REFRESH_TOKEN || tokens.refresh_token,
          expiry_date: Date.now() + 3500 * 1000, // ~58 minutes
        };
        oAuth2Client.setCredentials(newCreds);
        await saveTokens(newCreds);
      }
      // If there is no access_token present for any reason, fetch one now
      if (!oAuth2Client.credentials?.access_token) {
        console.log('No access token present. Fetching one...');
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const access_token = typeof accessTokenResponse === 'string' 
          ? accessTokenResponse 
          : accessTokenResponse?.token;
        if (!access_token) throw new Error('Failed to obtain access token');
        const current = oAuth2Client.credentials || {};
        const patched = {
          ...current,
          access_token,
          token_type: 'Bearer',
          scope: current.scope || SCOPES.join(' '),
          expiry_date: Date.now() + 3500 * 1000,
        };
        oAuth2Client.setCredentials(patched);
        await saveTokens(patched);
      }
      return;
    }
    
    // If no saved tokens, get a new one
    await getNewToken();
  } catch (error) {
    console.error('Error ensuring authentication:', error.message);
    throw error;
  }
}

/**
 * Saves tokens to token.json
 */
async function saveTokens(tokens) {
  try {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error('Error saving tokens:', err.message);
    throw err;
  }
}

/**
 * Gets a new access token using the refresh token
 */
async function getNewToken() {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    
    // In a real app, you would open the URL in a browser and get the code
    // For now, we'll use the refresh token from environment variables
    if (!process.env.GMAIL_REFRESH_TOKEN) {
      throw new Error('No refresh token available. Please provide GMAIL_REFRESH_TOKEN in .env');
    }
    
    // Set refresh token on client and fetch an access token
    oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const access_token = typeof accessTokenResponse === 'string' 
      ? accessTokenResponse 
      : accessTokenResponse?.token;
    if (!access_token) throw new Error('Failed to obtain access token using refresh token');

    const newCreds = {
      access_token,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      scope: SCOPES.join(' '),
      token_type: 'Bearer',
      expiry_date: Date.now() + 3500 * 1000,
    };
    oAuth2Client.setCredentials(newCreds);
    await saveTokens(newCreds);
    return newCreds;
  } catch (error) {
    console.error('Error getting new token:', error.message);
    throw error;
  }
}

// Initialize authentication
ensureAuthenticated().catch(console.error);

/**
 * Sends an email using Gmail API
 * @param {string} to - Recipient email address or comma-separated list of addresses
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {Object} [options] - Additional email options
 * @param {string} [options.cc] - CC email addresses (comma-separated)
 * @param {string} [options.bcc] - BCC email addresses (comma-separated)
 * @param {string} [options.replyTo] - Reply-To email address
 * @returns {Promise<Object>} - Response from Gmail API
 */
async function sendMail(to, subject, html, options = {}) {
  try {
    // Ensure we're authenticated first
    await ensureAuthenticated();
    // Ensure we have an access token ready
    if (!oAuth2Client.credentials?.access_token || (oAuth2Client.credentials.expiry_date && oAuth2Client.credentials.expiry_date < Date.now())) {
      console.log('Ensuring fresh access token before send...');
      const accessTokenResponse = await oAuth2Client.getAccessToken();
      const access_token = typeof accessTokenResponse === 'string' 
        ? accessTokenResponse 
        : accessTokenResponse?.token;
      if (!access_token) throw new Error('Failed to obtain access token before send');
      const current = oAuth2Client.credentials || {};
      const patched = {
        ...current,
        access_token,
        token_type: 'Bearer',
        expiry_date: Date.now() + 3500 * 1000,
      };
      oAuth2Client.setCredentials(patched);
      await saveTokens(patched);
    }
    
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // Build email headers
    const headers = [
      `From: "Shubh Barnwal" <${CREDENTIALS.user_email.split('@')[0]}@${CREDENTIALS.user_email.split('@')[1]}>`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      'Date: ' + new Date().toUTCString()
    ];

    // Add optional headers
    if (options.cc) headers.push(`Cc: ${options.cc}`);
    if (options.bcc) headers.push(`Bcc: ${options.bcc}`);
    if (options.replyTo) headers.push(`Reply-To: ${options.replyTo}`);

    // Create email message
    const message = [
      ...headers,
      '', // Empty line between headers and body
      html
    ].join('\n');

    // Encode the message
    const encodedMessage = Buffer
      .from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send the email with retry logic
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        // Get auth headers explicitly to ensure Authorization is attached
        const authHeaders = await oAuth2Client.getRequestHeaders();
        if (!authHeaders || !authHeaders.Authorization) {
          console.log('Debug: Missing Authorization header from OAuth2 client. Credentials:', oAuth2Client.credentials);
          throw Object.assign(new Error('Missing Authorization header after authentication'), { code: 401 });
        }
        const response = await gmail.users.messages.send(
          {
            userId: 'me',
            requestBody: {
              raw: encodedMessage,
            },
          },
          { headers: authHeaders }
        );
        
        console.log(`✅ Email sent to ${to}`);
        return response.data;
      } catch (error) {
        if (error.code === 401 && retries < maxRetries) {
          // Unauthorized: try to refresh access token using refresh token
          console.log('401 Unauthorized. Attempting to refresh access token...');
          const accessTokenResponse = await oAuth2Client.getAccessToken();
          const access_token = typeof accessTokenResponse === 'string' 
            ? accessTokenResponse 
            : accessTokenResponse?.token;
          if (access_token) {
            const current = oAuth2Client.credentials || {};
            const refreshed = {
              ...current,
              access_token,
              token_type: 'Bearer',
              expiry_date: Date.now() + 3500 * 1000,
            };
            oAuth2Client.setCredentials(refreshed);
            await saveTokens(refreshed);
            retries++;
            continue;
          }
        }
        throw error; // Re-throw if not a retryable error or max retries reached
      }
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

module.exports = {
  sendMail,
  ensureAuthenticated
};
