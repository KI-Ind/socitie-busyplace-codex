// @ts-nocheck
export const siteConfig = {
  name: 'SocieteBusyPlace',
  description: 'Accédez gratuitement aux informations sur les entreprises françaises',
  url: 'https://societebusyplace.fr',
  ogImage: 'https://societebusyplace.fr/og.jpg',
  links: {
    twitter: 'https://twitter.com/societebusyplace',
    github: 'https://github.com/societebusyplace',
  },
};

export const navLinks = [
  {
    title: 'Annuaire',
    href: '/annuaires-entreprises',
  },
  {
    title: 'Dirigeants',
    href: '/dirigeants',
  },
  {
    title: 'Surveillance',
    href: '/surveillance',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

export const footerLinks = {
  about: [
    { title: 'À propos', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Carrières', href: '/careers' },
  ],
  services: [
    { title: 'Surveillance', href: '/surveillance' },
    { title: 'API', href: '/api' },
    { title: 'Tarifs', href: '/pricing' },
  ],
  legal: [
    { title: 'Mentions légales', href: '/mentions-legales' },
    { title: 'Conditions d\'utilisation', href: '/conditions-utilisation' },
    { title: 'Politique de confidentialité', href: '/politique-confidentialite' },
  ],
};

export const features = [
  {
    title: 'Recherche simple',
    description: 'Trouvez rapidement les informations sur n\'importe quelle entreprise française.',
    icon: 'search',
  },
  {
    title: 'Données fiables',
    description: 'Accédez à des informations mises à jour quotidiennement depuis les sources officielles.',
    icon: 'shield',
  },
  {
    title: 'Surveillance gratuite',
    description: 'Suivez gratuitement les changements importants des entreprises qui vous intéressent.',
    icon: 'bell',
  },
];
