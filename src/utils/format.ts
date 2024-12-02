export function currencyFormat(locale: string, value: number): string {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
}
