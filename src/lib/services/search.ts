
interface INSEEResult {
  etablissements: Array<{
    siret: string;
    etablissementSiege: string;
    uniteLegale: {
      denominationUniteLegale: string | null;
      prenom1UniteLegale?: string;
      nomUniteLegale?: string;
    };
    adresseEtablissement: {
      codePostalEtablissement: string;
    };
  }>;
}

interface INPIResult {
  result: {
    hits: {
      hits: Array<{
        _source: {
          representants: {
            nom_prenoms: string;
            date_naiss: number;
          } | null;
        };
        highlight?: {
          'representants.nom_prenoms.folding_special_char_token'?: string[];
        };
      }>;
    };
  };
}

// Make sure function is properly exported
export async function searchCompanies(keyword: string): Promise<any[]> {
  
  

  const results: any[] = [];
  
  try {
    // Get INSEE token using consumer key and secret key
    const consumerKey = process.env.INSEE_CONSUMER_KEY;
    const secretKey = process.env.INSEE_SECRET_KEY;

    if (!consumerKey || !secretKey) {
      console.error('INSEE credentials not found:', { 
        hasConsumerKey: !!consumerKey,
        hasSecretKey: !!secretKey
      });
      return results;
    }

    // Create base64 encoded credentials
    const credentials = Buffer.from(`${consumerKey}:${secretKey}`).toString('base64');

    const tokenResponse = await fetch('https://api.insee.fr/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      });
      return results;
    }

    const tokenData = await tokenResponse.json();

    try {
      // Search INSEE data
      if (!keyword) {
        throw new Error('Keyword is required');
      }

      const cleanKeyword = keyword.trim();
      const numericKeyword = cleanKeyword.replace(/\s/g, '');
      let searchUrl = 'https://api.insee.fr/entreprises/sirene/V3.11/siret';
      let requestOptions: RequestInit = {
        method: 'GET', // Default to GET
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        }
      };

      // Check if input is SIREN/SIRET (numeric)
      const isSirenSiret = /^\d+$/.test(keyword);
      
      let searchQuery: string;
      if (isSirenSiret) {
        // Use siret: for 14 digits, siren: for 9 digits
        if (keyword.length === 14) {
          searchQuery = `siret%3A${keyword}`;
        } else {
          searchQuery = `siren%3A${keyword}`;
        }
      } else {
        // Split the search term into words
        const words = keyword.trim().split(/\s+/);
        const raisonSociale = Array(3).fill('').map((_, i) => words[i] || '');
        
        // Construct the query in the same format as PHP
        searchQuery = `raisonSociale:"${raisonSociale[0]}" AND raisonSociale:"${raisonSociale[1]}" AND raisonSociale:"${raisonSociale[2]}"`;
        // URL encode the query
        searchQuery = encodeURIComponent(searchQuery);
      }

      const url = `${searchUrl}?q=${searchQuery}&nombre=1000`;
      requestOptions.method = 'GET';
      requestOptions.headers = {
        'Authorization': `Bearer ${tokenData.access_token}`
      };

      
      const inseeResponse = await fetch(url, requestOptions);

      // Handle 404 as a valid "no results" response
      if (inseeResponse.status === 404) {
        return { etablissements: [] };
      }

      if (!inseeResponse.ok) {
        const errorText = await inseeResponse.text();
        throw new Error(`INSEE API request failed: ${inseeResponse.status} ${inseeResponse.statusText}`);
      }

      const inseeData: INSEEResult = await inseeResponse.json();
      
      // Process INSEE results
      const results = inseeData.etablissements
        .filter(etablissement => etablissement.etablissementSiege)
        .map(etablissement => {
          let name = etablissement.uniteLegale.denominationUniteLegale;
          if (!name) {
            name = `${etablissement.uniteLegale.prenom1UniteLegale || ''} ${etablissement.uniteLegale.nomUniteLegale || ''}`.trim();
          }

          // For company name search, we want to include the address in the label
          if (!isSirenSiret) {
            const address = etablissement.adresseEtablissement;
            const addressParts = [
              address.numeroVoieEtablissement,
              address.typeVoieEtablissement,
              address.libelleVoieEtablissement,
              address.codePostalEtablissement,
              address.libelleCommuneEtablissement
            ].filter(Boolean).join(' ');
            
            name = `${name} - ${addressParts}`;
          }

          return {
            codepostal: etablissement.adresseEtablissement.codePostalEtablissement,
            age_naiss: '',
            siren: etablissement.siret,
            label: name,
            category: "Sociétés"
          };
        });

      return results;
    } catch (error) {
      return { etablissements: [] };
    }
  } catch (error) {
    console.error('ERROR in searchCompanies:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  return results;
}

function calculateAge(dateOfBirth: Date): string {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age.toString();
}
