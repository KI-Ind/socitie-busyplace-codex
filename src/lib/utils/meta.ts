export function generateCompanyMetaDescription(company: any) {
  if (!company) return '';
  
  const headquarters = company.etablissements?.find((e: any) => e.etablissementSiege);
  const name = headquarters?.uniteLegale.denominationUniteLegale;
  const city = headquarters?.adresseEtablissement.libelleCommuneEtablissement;
  const activity = headquarters?.uniteLegale.activitePrincipaleUniteLegale;
  
  return `Découvrez ${name || 'l\'entreprise'} ${city ? `à ${city}` : ''} ${
    activity ? `spécialisée dans ${activity}` : ''
  }. Accédez aux informations légales, bilans financiers et actualités.`;
}

export function generateRegionMetaDescription(region: any) {
  if (!region) return '';
  
  return `Annuaire des entreprises en ${region.name}. ${
    region.companiesCount ? `${region.companiesCount.toLocaleString('fr-FR')} entreprises répertoriées` : ''
  }. Consultez les informations légales et financières des sociétés de la région.`;
}

export function generateDepartmentMetaDescription(department: any) {
  if (!department) return '';
  
  return `Annuaire des entreprises dans le département ${department.name} (${department.code}). ${
    department.companiesCount ? `${department.companiesCount.toLocaleString('fr-FR')} entreprises répertoriées` : ''
  }. Consultez les informations légales et financières des sociétés du département.`;
}

export function generateCanonicalUrl(path: string, page?: number) {
  const baseUrl = 'https://societe.busyplace.fr';
  const cleanPath = path.replace(/\/page\/\d+/, '');
  
  if (!page || page === 1) {
    return `${baseUrl}${cleanPath}`;
  }
  
  return `${baseUrl}${cleanPath}/page/${page}`;
}
