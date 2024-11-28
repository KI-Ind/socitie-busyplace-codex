import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://societebusyplace.fr';

  // Main routes
  const routes = [
    '',
    '/annuaires-entreprises',
    '/contact',
    '/mentions-legales',
    '/politique-confidentialite',
    '/conditions-generales',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Region routes (example)
  const regions = [
    'ile-de-france',
    'auvergne-rhone-alpes',
    'provence-alpes-cote-d-azur',
    'occitanie',
    'nouvelle-aquitaine',
    'hauts-de-france',
  ].map((region) => ({
    url: `${baseUrl}/annuaires-entreprises/${region}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...regions];
}
