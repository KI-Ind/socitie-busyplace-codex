// @ts-nocheck
import { NextResponse } from 'next/server';

async function fetchBodaccData(siren: string) {
  try {
    const response = await fetch(
      `https://bodacc-datadila.opendatasoft.com/api/records/1.0/search/?dataset=annonces-commerciales&q=${siren}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch BODACC data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BODACC data:', error);
    throw error;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { siren: string } }
) {
  try {
    const { siren } = params;
    const cleanSiren = siren.replace(/\s/g, '');
    
    const bodaccData = await fetchBodaccData(cleanSiren);
    
    // Sort records by date in descending order
    if (bodaccData.records) {
      bodaccData.records.sort((a: any, b: any) => {
        const dateA = new Date(a.fields.dateparution);
        const dateB = new Date(b.fields.dateparution);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return NextResponse.json(bodaccData);
  } catch (error) {
    console.error('Error in BODACC API route:', error);
    return NextResponse.json({ error: 'Failed to fetch BODACC data' }, { status: 500 });
  }
}
