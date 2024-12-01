import { NextResponse } from 'next/server';
import { searchCompanies } from '@/lib/services/search';
import fs from 'fs';

// Simple log
fs.writeFileSync('api-test.log', 'API Route loaded\n');
fs.appendFileSync('api-test.log', `Environment check: INSEE_CONSUMER_KEY=${!!process.env.INSEE_CONSUMER_KEY}, INSEE_SECRET_KEY=${!!process.env.INSEE_SECRET_KEY}\n`);

export async function GET(request: Request) {
  try {
    fs.appendFileSync('api-test.log', `API called at ${new Date().toISOString()}\n`);
    fs.appendFileSync('api-test.log', `Runtime env check: INSEE_CONSUMER_KEY=${!!process.env.INSEE_CONSUMER_KEY}, INSEE_SECRET_KEY=${!!process.env.INSEE_SECRET_KEY}\n`);
    
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    fs.appendFileSync('api-test.log', `Keyword: ${keyword}\n`);

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' });
    }

    if (!process.env.INSEE_CONSUMER_KEY || !process.env.INSEE_SECRET_KEY) {
      fs.appendFileSync('api-test.log', 'ERROR: Missing INSEE credentials in environment\n');
      return NextResponse.json({ error: 'INSEE credentials not configured' });
    }

    fs.appendFileSync('api-test.log', 'About to call searchCompanies\n');
    const results = await searchCompanies(keyword);
    fs.appendFileSync('api-test.log', `Results: ${JSON.stringify(results)}\n`);

    return NextResponse.json(results);
  } catch (error) {
    fs.appendFileSync('api-test.log', `Error: ${String(error)}\n`);
    return NextResponse.json({ error: String(error) });
  }
}
