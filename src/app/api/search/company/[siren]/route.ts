// @ts-nocheck
import { NextResponse } from 'next/server';

async function getInseeToken() {
  try {
    console.log('Getting INSEE token...');
    const consumer_key = process.env.INSEE_CONSUMER_KEY;
    const consumer_secret = process.env.INSEE_SECRET_KEY;

    if (!consumer_key || !consumer_secret) {
      throw new Error('Missing INSEE credentials');
    }

    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    
    const response = await fetch('https://api.insee.fr/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('INSEE token response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`INSEE token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully obtained INSEE token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting INSEE token:', error);
    throw error;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { siren: string } }
) {
  try {
    console.log('Company API Route - Starting with params:', params);
    const { siren } = params;
    
    // Clean the SIREN number (remove spaces and take first 9 digits)
    const cleanSiren = siren.replace(/\s/g, '').substring(0, 9);
    console.log('Cleaned SIREN:', cleanSiren);

    const token = await getInseeToken();
    console.log('Token obtained, making request to INSEE API...');
    
    const response = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3.11/siret?q=siren:${cleanSiren}&nombre=1000`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('INSEE API response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`INSEE API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully received INSEE API response');

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in company API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}
