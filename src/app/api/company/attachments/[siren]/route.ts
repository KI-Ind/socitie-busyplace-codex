import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { siren: string } }
) {
  try {
    // TODO: Replace with actual data fetching from your backend
    const mockData = {
      viewtbl1: "<table>...</table>",
      viewtbl2: "<table>...</table>",
      btn: "<button>Download</button>",
      my_years: ["2019", "2020", "2021", "2022"],
      data_revenue: [100000, 150000, 200000, 250000],
      data_income: [10000, 15000, 20000, 25000],
      viewgraph: "<div id='chartContainer'></div>"
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching attachments data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
