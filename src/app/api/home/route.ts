// @ts-nocheck
import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/api/regions';

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
