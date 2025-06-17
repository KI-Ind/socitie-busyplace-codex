// @ts-nocheck
export interface CompanyAddress {
  numeroVoieEtablissement: string;
  typeVoieEtablissement: string;
  libelleVoieEtablissement: string;
  codePostalEtablissement: string;
  libelleCommuneEtablissement: string;
}

export interface CompanyLegalUnit {
  denominationUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  activitePrincipaleUniteLegale: string;
  trancheEffectifsUniteLegale: string;
  dateCreationUniteLegale: string;
  sigleUniteLegale: string | null;
  nomUniteLegale?: string;
  prenom1UniteLegale?: string;
}

export interface CompanyEstablishment {
  siren: string;
  nic: string;
  siret: string;
  dateCreationEtablissement: string;
  etablissementSiege: boolean;
  uniteLegale: CompanyLegalUnit;
  adresseEtablissement: CompanyAddress;
}

export interface CompanyData {
  header: {
    statut: number;
    message: string;
    total: number;
  };
  etablissements: CompanyEstablishment[];
}
