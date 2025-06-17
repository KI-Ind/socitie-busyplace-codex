// @ts-nocheck
import fs from 'fs';
import path from 'path';

const TOKEN_DIR = path.join(process.cwd(), 'tmp');
const TOKEN_FILE = path.join(TOKEN_DIR, 'regentreprises.txt');

export async function getRegistreToken() {
  try {
    try {
      fs.mkdirSync(TOKEN_DIR, { recursive: true });
    } catch (err) {
      console.error('Error ensuring token directory exists:', err);
      throw err;
    }

    // Check if token file exists and is not expired (30 minutes)
    if (fs.existsSync(TOKEN_FILE)) {
      const stats = fs.statSync(TOKEN_FILE);
      if (Date.now() - stats.mtimeMs < 1700000) { // 1700 seconds in milliseconds
        return fs.readFileSync(TOKEN_FILE, 'utf8');
      }
    }

    // Get new token
    const response = await fetch('https://registre-national-entreprises.inpi.fr/api/sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.regent_login,
        password: process.env.regent_password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get token');
    }

    const data = await response.json();
    fs.writeFileSync(TOKEN_FILE, data.token);
    return data.token;
  } catch (error) {
    console.error('Error getting registre token:', error);
    throw error;
  }
}
