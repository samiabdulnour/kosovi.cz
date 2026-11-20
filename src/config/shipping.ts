export interface ShippingMethod {
  id: string;
  name: string;
  /** CZK. */
  price: number;
  /** A condition written after the price. */
  note?: string;
}

// Zásilkovna for 200 Kč, or personal pickup for nothing in the workshop in
// Dejvice, only after arranging it first (Sami, November 2026).
export const shippingMethods: ShippingMethod[] = [
  { id: 'zasilkovna', name: 'Zásilkovna', price: 200 },
  { id: 'osobni-odber', name: 'Osobní odběr v dílně v Dejvicích', price: 0, note: 'pouze po předchozí domluvě' },
];
