// @ts-nocheck
import { NextResponse } from 'next/server';
import { getRegistreToken } from '@/utils/registre-token';
import ExcelJS from 'exceljs';

export async function GET(
  request: Request,
  { params }: { params: { siren: string; year: string } }
) {
  try {
    const token = await getRegistreToken();
    const { siren, year } = params;

    // Fetch company data for the specific year
    const response = await fetch(
      `https://registre-national-entreprises.inpi.fr/api/companies/${siren}/attachments`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Data');

    // Add headers
    worksheet.addRow(['Date', "Chiffre d'affaires", 'Résultat net']);

    // Process and add data
    if (data.bilansSaisis) {
      for (const bilan of data.bilansSaisis) {
        const bilanYear = new Date(bilan.dateCloture).getFullYear().toString();
        if (bilanYear === year) {
          let revenue = '';
          let income = '';

          for (const page of bilan.bilanSaisi.bilan.detail.pages) {
            for (const liasse of page.liasses) {
              if (['FJ', '218', '232'].includes(liasse.code)) {
                revenue = liasse.m3 || liasse.m1;
              }
              if (['HN', 'DI', '310'].includes(liasse.code)) {
                income = liasse.m1;
              }
            }
          }

          worksheet.addRow([
            new Date(bilan.dateCloture).toLocaleDateString('fr-FR'),
            parseInt(revenue || '0'),
            parseInt(income || '0')
          ]);
        }
      }
    }

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=financial_data_${siren}_${year}.xlsx`,
      },
    });

  } catch (error) {
    console.error('Error generating Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
