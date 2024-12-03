interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}

export function generateBreadcrumbsFromPath(path: string, title: string) {
  const parts = path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [
    {
      name: 'Accueil',
      item: 'https://societe.busyplace.fr'
    }
  ];

  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    if (index === parts.length - 1) {
      items.push({
        name: title,
        item: `https://societe.busyplace.fr${currentPath}`
      });
    } else {
      items.push({
        name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        item: `https://societe.busyplace.fr${currentPath}`
      });
    }
  });

  return generateBreadcrumbData(items);
}
