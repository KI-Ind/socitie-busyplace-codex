// @ts-nocheck
import { NextResponse } from 'next/server';
import { getRegistreToken } from '@/utils/registre-token';

export async function GET(
  request: Request,
  { params }: { params: { siren: string } }
) {
  try {
    const token = await getRegistreToken();
    const siren = params.siren;

    // Fetch attachments data
    const response = await fetch(
      `https://registre-national-entreprises.inpi.fr/api/companies/${siren}/attachments`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch attachments');
    }

    const registreData = await response.json();

    // Generate tables HTML
    const viewtbl1 = generateActesTable(registreData);
    const viewtbl2 = generateBilansTable(registreData);
    const viewgraph = generateGraphView();

    // Process financial data
    const yearwiseData: Record<string, { revenue_affaires: string; net_income: string }> = {};
    const dataRevenue: number[] = [];
    const dataIncome: number[] = [];
    const myYears: string[] = [];

    if (registreData.bilansSaisis) {
      for (const bilan of registreData.bilansSaisis) {
        const year = new Date(bilan.dateCloture).getFullYear().toString();
        
        for (const page of bilan.bilanSaisi.bilan.detail.pages) {
          for (const liasse of page.liasses) {
            if (['FJ', '218', '232'].includes(liasse.code)) {
              const value = liasse.m3 || liasse.m1;
              yearwiseData[year] = {
                ...yearwiseData[year],
                revenue_affaires: value
              };
            }

            if (['HN', 'DI', '310'].includes(liasse.code)) {
              yearwiseData[year] = {
                ...yearwiseData[year],
                net_income: liasse.m1
              };
            }
          }
        }
      }

      // Convert data to arrays
      Object.entries(yearwiseData).forEach(([year, data]) => {
        myYears.push(year);
        dataIncome.push(parseInt(data.net_income.replace(/^0+/, '') || '0'));
        dataRevenue.push(parseInt(data.revenue_affaires.replace(/^0+/, '') || '0'));
      });
    }

    return NextResponse.json({
      my_years: myYears.reverse(),
      data_income: dataIncome.reverse(),
      data_revenue: dataRevenue.reverse(),
      viewtbl1,
      viewtbl2,
      viewgraph,
    });
  } catch (error) {
    console.error('Error in registre-attachments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registre attachments' },
      { status: 500 }
    );
  }
}

function generateActesTable(data: any) {
  if (!data.actes?.length) {
    return '<div class="text-center p-4">Aucun acte disponible</div>';
  }

  const rows = data.actes.map((acte: any) => {
    const date = new Date(acte.dateDepot).toLocaleDateString('fr-FR');
    const types = acte.typeRdd?.map((type: any) => type.typeActe || '').filter(Boolean).join('<br>') || '';
    const decisions = acte.typeRdd?.map((type: any) => type.decision || '').filter(Boolean).join('<br>') || '';
    
    return `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 border-b border-gray-200">${types}</td>
        <td class="px-4 py-3 border-b border-gray-200">${date}</td>
        <td class="px-4 py-3 border-b border-gray-200">${decisions}</td>
        <td class="px-4 py-3 border-b border-gray-200 text-center">
          <a href="/api/download/file/ACTE/${acte.id}" 
             class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
             target="_blank">
            <i class="fas fa-download mr-2"></i>
            Télécharger
          </a>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Décision
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function generateBilansTable(data: any) {
  if (!data.bilansSaisis?.length) {
    return '<div class="text-center p-4">Aucun bilan disponible</div>';
  }

  const rows = data.bilansSaisis.map((bilan: any) => {
    const dateDepot = bilan.dateDepot ? new Date(bilan.dateDepot).toLocaleDateString('fr-FR') : '';
    const dateCloture = new Date(bilan.dateCloture);
    const year = dateCloture.getFullYear();
    const compte = `Compte annuel ${year}`;
    const etat = bilan.etat || '';
    
    return `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 border-b border-gray-200">${compte}</td>
        <td class="px-4 py-3 border-b border-gray-200">${dateDepot}</td>
        <td class="px-4 py-3 border-b border-gray-200">${etat}</td>
        <td class="px-4 py-3 border-b border-gray-200 text-center">
          <div class="flex justify-center space-x-4">
            <a href="/api/download/file/COMPTESANNUELS/${bilan.id}" 
               class="text-3xl text-red-600 hover:text-red-500 transition-colors duration-150"
               target="_blank">
              <i class="far fa-file-pdf"></i>
            </a>
            <a href="/api/download/excel/${data.siren}/${year}"
               class="text-3xl text-green-600 hover:text-green-500 transition-colors duration-150"
               target="_blank">
              <i class="far fa-file-excel"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Compte
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              État
            </th>
            <th class="px-4 py-3 border-b-2 border-gray-200 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Téléchargements
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function generateGraphView() {
  return `
    <div id="chartContainer" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
  `;
}
