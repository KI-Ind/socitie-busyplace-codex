import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), 'tmp', 'insee_token.txt');
const TOKEN_EXPIRY = 1700; // seconds

interface TokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

function generateAuthKey(): string {
  const consumerKey = process.env.INSEE_CONSUMER_KEY;
  const secretKey = process.env.INSEE_SECRET_KEY;
  
  if (!consumerKey || !secretKey) {
    throw new Error('INSEE credentials not found in environment variables');
  }

  return Buffer.from(`${consumerKey}:${secretKey}`).toString('base64');
}

export async function getInseeToken(): Promise<string> {
  try {
    // Create tmp directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Check if token file exists and is not expired
    if (fs.existsSync(TOKEN_FILE)) {
      const stats = fs.statSync(TOKEN_FILE);
      const now = Math.floor(Date.now() / 1000);
      const fileTime = Math.floor(stats.mtimeMs / 1000);

      if (now - fileTime < TOKEN_EXPIRY) {
        return fs.readFileSync(TOKEN_FILE, 'utf-8');
      }
    }

    // Generate auth key from consumer key and secret
    const authKey = generateAuthKey();

    // Get new token
    const response = await fetch('https://api.insee.fr/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get INSEE token: ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();
    
    // Save token to file
    fs.writeFileSync(TOKEN_FILE, data.access_token);
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting INSEE token:', error);
    throw error;
  }
}
