import { NextResponse } from 'next/server';
import { searchCompanies } from '@/lib/services/search';

export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' });
    }

    if (!process.env.INSEE_CONSUMER_KEY || !process.env.INSEE_SECRET_KEY) {
      return NextResponse.json({ error: 'INSEE credentials not configured' });
    }

    const results = await searchCompanies(keyword);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
