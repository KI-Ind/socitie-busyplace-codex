import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/api/regions';

export async function GET() {
  const { regions } = await getHomeData();

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>SocieteBusyplace - Annuaire des entreprises françaises</title>
  <link>https://societe.busyplace.fr</link>
  <description>Trouvez des informations détaillées sur les entreprises françaises, leurs dirigeants et suivez leurs actualités.</description>
  <language>fr-FR</language>
  <atom:link href="https://societe.busyplace.fr/feed.xml" rel="self" type="application/rss+xml"/>
  ${regions.map(region => `
    <item>
      <title>Entreprises en ${region.name}</title>
      <link>https://societe.busyplace.fr/annuaires-entreprises/${region.slug}</link>
      <guid>https://societe.busyplace.fr/annuaires-entreprises/${region.slug}</guid>
      <description>Découvrez les entreprises de la région ${region.name}. ${region.companiesCount || 0} entreprises répertoriées.</description>
    </item>
  `).join('')}
</channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
