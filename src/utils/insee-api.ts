// @ts-nocheck
let inseeToken: string | null = null;
let tokenExpiry: Date | null = null;

export async function getInseeToken(): Promise<string> {
  // Check if we have a valid token
  if (inseeToken && tokenExpiry && tokenExpiry > new Date()) {
    return inseeToken;
  }

  const consumerKey = process.env.INSEE_CONSUMER_KEY;
  const consumerSecret = process.env.INSEE_SECRET_KEY;

  if (!consumerKey || !consumerSecret) {
    throw new Error('INSEE API credentials not configured');
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await fetch('https://api.insee.fr/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to obtain INSEE token');
    }

    const data = await response.json();
    inseeToken = data.access_token;
    tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));

    return inseeToken!;
  } catch (error) {
    console.error('Error getting INSEE token:', error);
    throw error;
  }
}

export async function getCompanyData(siren: string) {
  try {
    const token = await getInseeToken();
    
    const response = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3/siret?q=siren:${siren}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch company data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
}
