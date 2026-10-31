const NBSP = ' ';

/**
 * Czech typography for text that comes from data: a non-breaking space after
 * one-letter words, between a number and its unit, and inside digit groups
 * ("1 380 °C", "4 000 Kč", "+420 607 635 393").
 */
export function cz(text: string): string {
  return text
    .replace(/(?<=^|[\s („])([kszvouai])\s+/giu, `$1${NBSP}`)
    .replace(/(\d)\s+(°C|Kč|ml|cm|mm|kg|g|l|%)(?=$|[\s.,;:)])/gu, `$1${NBSP}$2`)
    .replace(/(\d) (?=\d{3}(?!\d))/gu, `$1${NBSP}`);
}

/** Czech rules for Czech text, English text stays as it is. */
export function typeset(text: string, lang: 'cs' | 'en'): string {
  return lang === 'cs' ? cz(text) : text;
}

const czk = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 1 });

/** "5,5" with a decimal comma and non-breaking digit groups. */
export function formatNumber(value: number): string {
  return decimal.format(value).replace(/\s/gu, NBSP);
}

/** "4 000 Kč" with non-breaking spaces. */
export function formatCzk(value: number): string {
  return `${czk.format(value).replace(/\s/gu, NBSP)}${NBSP}Kč`;
}

/** "+420 607 635 393" becomes "tel:+420607635393". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/gu, '')}`;
}
