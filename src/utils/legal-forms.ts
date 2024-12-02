interface LegalForm {
  c: number;
  n: string;
}

const legalForms: LegalForm[] = [
  { c: 1000, n: 'Entrepreneur individuel' },
  { c: 5499, n: 'SARL Société à responsabilité limitée' },
  { c: 5599, n: '(s.a.i.) SA à conseil d\'administration' },
  { c: 5710, n: 'SAS, société par actions simplifiée' },
  { c: 5720, n: 'SASU' },
  { c: 5485, n: '(SERL) Société d\'exercice libéral à responsabilité limitée' },
  { c: 6521, n: '(SCPI) Société civile de placement collectif immobilier' },
  { c: 6540, n: '(SCI) Société civile immobilière' },
  { c: 9220, n: 'Association déclarée' },
  { c: 0, n: 'Organisme de placement collectif en valeurs mobilières sans personnalité morale' },
  { c: 2110, n: 'Indivision entre personnes physiques' },
  { c: 2120, n: 'Indivision avec personne morale' },
  { c: 2210, n: 'Société créée de fait entre personnes physiques' },
  { c: 2220, n: 'Société créée de fait avec personne morale' },
  { c: 2310, n: 'Société en participation entre personnes physiques' },
  { c: 2320, n: 'Société en participation avec personne morale' },
  { c: 2385, n: 'Société en participation de professions libérales' },
  { c: 2400, n: 'Fiducie' },
  { c: 2700, n: 'Paroisse hors zone concordataire' },
  { c: 2900, n: 'Autre groupement de droit privé non doté de la personnalité morale' },
  { c: 3110, n: 'Représentation ou agence commerciale d\'état ou organisme public étranger immatriculé au RCS' },
  { c: 3120, n: 'Société commerciale étrangère immatriculée au RCS' },
  { c: 3205, n: 'Organisation internationale' },
  { c: 3210, n: 'État, collectivité ou établissement public étranger' },
  { c: 3220, n: 'Société étrangère non immatriculée au RCS' },
  { c: 3290, n: 'Autre personne morale de droit étranger' },
  { c: 5498, n: 'SARL unipersonnelle' },
  { c: 6588, n: 'Société civile laitière' },
  // ... add all other forms as needed
];

export function getLegalFormLabel(code: string | number): string {
  const numericCode = typeof code === 'string' ? parseInt(code, 10) : code;
  const form = legalForms.find(form => form.c === numericCode);
  return form?.n || 'Forme juridique non répertoriée';
}
