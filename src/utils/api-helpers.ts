// @ts-nocheck
export async function fetchRegistreData(siren: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://registre.api.gouv.fr/api/v1';
  
  try {
    const response = await fetch(`${API_URL}/companies/${siren}/attachments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch registre data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching registre data:', error);
    throw error;
  }
}
