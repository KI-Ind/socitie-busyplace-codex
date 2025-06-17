// @ts-nocheck
interface NafCode {
  [key: string]: string;
}

const nafCodes: NafCode = {
  "01.01": "Cultures non permanentes",
  "01.11": "Culture de céréales (à l'exception du riz), de légumineuses et de graines oléagineuses",
  "01.11Z": "Culture de céréales (à l'exception du riz), de légumineuses et de graines oléagineuses",
  "01.12": "Culture du riz",
  "01.12Z": "Culture du riz",
  
  // Financial sector codes
  "64": "Activités des services financiers, hors assurance et caisses de retraite",
  "64.1": "Intermédiation monétaire",
  "64.11": "Activités de banque centrale",
  "64.11Z": "Activités de banque centrale",
  "64.19": "Autres intermédiations monétaires",
  "64.19Z": "Autres intermédiations monétaires",
  "64.2": "Activités des sociétés holding",
  "64.20": "Activités des sociétés holding",
  "64.20Z": "Activités des sociétés holding",
  "64.3": "Fonds de placement et entités financières similaires",
  "64.30": "Fonds de placement et entités financières similaires",
  "64.30Z": "Fonds de placement et entités financières similaires",
  "64.9": "Autres activités des services financiers, hors assurance et caisses de retraite",
  "64.91": "Crédit-bail",
  "64.91Z": "Crédit-bail",
  "64.92": "Autre distribution de crédit",
  "64.92Z": "Autre distribution de crédit",
  "64.99": "Autres activités des services financiers, hors assurance et caisses de retraite, n.c.a.",
  "64.99Z": "Autres activités des services financiers, hors assurance et caisses de retraite, n.c.a.",
  
  // Insurance sector codes
  "65": "Assurance",
  "65.1": "Assurance",
  "65.11": "Assurance vie",
  "65.11Z": "Assurance vie",
  "65.12": "Autres assurances",
  "65.12Z": "Autres assurances",
  "65.2": "Réassurance",
  "65.20": "Réassurance",
  "65.20Z": "Réassurance",
  "65.3": "Caisses de retraite",
  "65.30": "Caisses de retraite",
  "65.30Z": "Caisses de retraite",

  // Financial auxiliary services
  "66": "Activités auxiliaires de services financiers et d'assurance",
  "66.1": "Activités auxiliaires de services financiers, hors assurance et caisses de retraite",
  "66.11": "Administration de marchés financiers",
  "66.11Z": "Administration de marchés financiers",
  "66.12": "Courtage de valeurs mobilières et de marchandises",
  "66.12Z": "Courtage de valeurs mobilières et de marchandises",
  "66.19": "Autres activités auxiliaires de services financiers, hors assurance et caisses de retraite",
  "66.19Z": "Autres activités auxiliaires de services financiers, hors assurance et caisses de retraite",
  "66.2": "Activités auxiliaires d'assurance et de caisses de retraite",
  "66.21": "Évaluation des risques et dommages",
  "66.21Z": "Évaluation des risques et dommages",
  "66.22": "Activités des agents et courtiers d'assurances",
  "66.22Z": "Activités des agents et courtiers d'assurances",
  "66.29": "Autres activités auxiliaires d'assurance et de caisses de retraite",
  "66.29Z": "Autres activités auxiliaires d'assurance et de caisses de retraite",
  "66.3": "Gestion de fonds",
  "66.30": "Gestion de fonds",
  "66.30Z": "Gestion de fonds",
  // Add more codes as needed
};

export function getNafActivityLabel(code: string): string {
  // Remove spaces and convert to uppercase for consistent lookup
  const cleanCode = code.trim().toUpperCase();
  
  // First try exact match
  if (nafCodes[cleanCode]) {
    return nafCodes[cleanCode];
  }
  
  // If no exact match, try without the Z suffix
  if (cleanCode.endsWith('Z')) {
    const withoutZ = cleanCode.slice(0, -1);
    if (nafCodes[withoutZ]) {
      return nafCodes[withoutZ];
    }
  }
  
  // If still no match, try to find a parent category
  const parts = cleanCode.split('.');
  if (parts.length === 2) {
    const mainCategory = parts[0];
    const subCategory = parts[1].slice(0, 2); // Get first two digits of subcategory
    
    // Try parent category with subcategory
    const parentCode = `${mainCategory}.${subCategory}`;
    if (nafCodes[parentCode]) {
      return nafCodes[parentCode];
    }
    
    // Try main category only
    if (nafCodes[mainCategory]) {
      return nafCodes[mainCategory];
    }
  }
  
  return "Activité non répertoriée";
}
