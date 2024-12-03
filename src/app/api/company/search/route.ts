import { NextResponse } from 'next/server';

async function getAccessToken() {
  const consumerKey = process.env.INSEE_CONSUMER_KEY;
  const consumerSecret = process.env.INSEE_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('INSEE credentials not found in environment variables');
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch('https://api.insee.fr/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get INSEE access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const searchResponse = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:"${encodeURIComponent(query)}*" OR siret:${encodeURIComponent(query)}*&nombre=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('INSEE API search failed');
    }

    const searchData = await searchResponse.json();
    
    // Transform the INSEE response into our desired format
    const results = searchData.etablissements?.map((etab: any) => ({
      label: etab.uniteLegale.denominationUniteLegale || etab.uniteLegale.denominationUsuelle1,
      siren: etab.siren,
      category: etab.uniteLegale.categorieJuridiqueUniteLegale,
      codepostal: etab.adresseEtablissement.codePostalEtablissement,
    })) || [];

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
