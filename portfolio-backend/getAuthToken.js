const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// If modifying these scopes, delete token.json if it exists.
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    const oAuth2Client = new OAuth2Client();
    oAuth2Client.setCredentials(credentials);
    return oAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file.
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const key = credentials.web || credentials.installed;
  
  const payload = JSON.stringify({
    ...client.credentials,
    client_id: key.client_id,
    client_secret: key.client_secret
  });
  
  await fs.writeFile(TOKEN_PATH, payload);
  console.log('Token stored to', TOKEN_PATH);
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  // Load client secrets from a local file
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const key = credentials.web || credentials.installed;

  if (!key) {
    throw new Error('No valid credentials found in credentials.json');
  }

  // Create an OAuth2 client with the credentials
  const redirectUri = 'http://localhost:3000/oauth2callback';
  console.log('Using redirect URI:', redirectUri);
  console.log('\nMake sure this redirect URI is whitelisted in Google Cloud Console:');
  console.log('Authorized redirect URI:', redirectUri);
  
  const oAuth2Client = new OAuth2Client(
    key.client_id,
    key.client_secret,
    redirectUri
  );
  
  // Generate the authorization URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    include_granted_scopes: true
  });
  
  console.log('\nAuthorize this app by visiting this URL:');
  console.log(authUrl);
  
  // Start a simple HTTP server to handle the OAuth callback
  const server = require('http').createServer(async (req, res) => {
    if (req.url.startsWith('/oauth2callback')) {
      const qs = new URL(req.url, 'http://localhost:3000').searchParams;
      const code = qs.get('code');
      
      if (code) {
        res.end('Authentication successful! You can close this window and return to the terminal.');
        server.close();
        try {
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          await saveCredentials(oAuth2Client);
          console.log('\n✅ Authentication successful!');
          console.log('Refresh token:', tokens.refresh_token);
          process.exit(0);
        } catch (error) {
          console.error('\n❌ Error getting token:', error);
          process.exit(1);
        }
      } else {
        res.end('No authorization code found in the URL.');
        server.close();
        console.error('\n❌ No authorization code found in the callback URL');
        process.exit(1);
      }
    }
  });
  
  // Start the server
  server.listen(3000, 'localhost', () => {
    console.log('\nOAuth callback server running on http://localhost:3000');
    console.log('\nEnter the code from the authorization page here:');
  });
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const code = await new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        resolve(code);
      });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    // Store the token to disk for later program executions
    await saveCredentials(oAuth2Client);
    console.log('Refresh token:', tokens.refresh_token);
    
    return oAuth2Client;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

// Run the authorization flow
authorize().catch(console.error);