// @ts-nocheck
import { Metadata, type PageProps } from 'next';
import { CompanyData } from '@/types/company';
import CompanyDetailsClient from '@/components/CompanyDetailsClient';

interface CompanyDetailsProps extends PageProps {
  params: {
    siren: string;
    companyName: string;
  };
}

async function getCompanyData(siren: string) {
  try {
    console.log('Starting getCompanyData with siren:', siren);
    
    const cleanSiren = siren.replace(/\s/g, '').substring(0, 9);
    console.log('Cleaned SIREN:', cleanSiren);
    
    // Get INSEE token
    const consumer_key = process.env.INSEE_CONSUMER_KEY;
    const consumer_secret = process.env.INSEE_SECRET_KEY;

    if (!consumer_key || !consumer_secret) {
      throw new Error('Missing INSEE credentials');
    }

    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    
    const tokenResponse = await fetch('https://api.insee.fr/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get INSEE token');
    }

    const tokenData = await tokenResponse.json();
    
    // Fetch company data from INSEE API
    const response = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3.11/siret?q=siren:${cleanSiren}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch company data');
    }

    return response.json() as Promise<CompanyData>;
  } catch (error) {
    console.error('Error in getCompanyData:', error);
    throw error;
  }
}

export async function generateMetadata({ params }: CompanyDetailsProps): Promise<Metadata> {
  const { siren } = params;
  
  try {
    const data = await getCompanyData(siren);
    const headquarters = data.etablissements?.find(e => e.etablissementSiege);

    if (headquarters) {
      const companyName = headquarters.uniteLegale.denominationUniteLegale;
      const city = headquarters.adresseEtablissement.libelleCommuneEtablissement;
      const zipCode = headquarters.adresseEtablissement.codePostalEtablissement;

      return {
        title: `${companyName} (${city}) Chiffre d'affaires, résultat, bilans, statuts, Kbis, SIRET - (${siren})`,
        description: `${companyName} à ${city} (${zipCode}) Bilans, statuts, chiffre d'affaires, dirigeants, actionnaires, levées de fonds, annonces légales, APE, NAF, TVA INTRACOMMUNAUTAIRE, RCS, SIREN, SIRET`
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Company Details',
    description: 'View detailed company information'
  };
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsProps) {
  const { siren } = params;
  const data = await getCompanyData(siren);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-32 md:pt-36 px-8 md:px-16 lg:px-24 xl:px-32 pb-12">
        <CompanyDetailsClient data={data} siren={siren} />
      </div>
    </div>
  );
}
