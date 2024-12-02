export function formatSIREN(siren: string): string {
  return `${siren.substring(0, 3)} ${siren.substring(3, 6)} ${siren.substring(6, 9)}`;
}

export function formatSIRET(siret: string): string {
  return `${formatSIREN(siret.substring(0, 9))} ${siret.substring(9, 14)}`;
}

export function calculateTVA(siren: string): string {
  const cleanSiren = siren.replace(/\s/g, '');
  const checksum = ((Number(cleanSiren) % 97) * 3 + 12) % 97;
  return `FR${checksum.toString().padStart(2, '0')}${cleanSiren}`;
}

export function getEffectifLabel(tranche: string): string {
  const effectifMap: { [key: string]: string } = {
    "00": "0 salarié",
    "01": "1 ou 2 salariés",
    "02": "3 à 5 salariés",
    "03": "6 à 9 salariés",
    "11": "10 à 19 salariés",
    "12": "20 à 49 salariés",
    "21": "50 à 99 salariés",
    "22": "100 à 199 salariés",
    "31": "200 à 249 salariés",
    "32": "250 à 499 salariés",
    "41": "500 à 999 salariés",
    "42": "1 000 à 1 999 salariés",
    "51": "2 000 à 4 999 salariés",
    "52": "5 000 à 9 999 salariés",
    "53": "10 000 salariés et plus",
  };
  
  return effectifMap[tranche] || "Non renseigné";
}
