// @ts-nocheck
import { NextResponse } from 'next/server';
import { getRegistreToken } from '@/utils/registre-token';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const token = await getRegistreToken();

    // Fetch the file from the registre API
    const response = await fetch(
      `https://registre-national-entreprises.inpi.fr/api/companies/attachments/${id}/download`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer();

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
