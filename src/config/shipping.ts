export interface ShippingMethod {
  id: string;
  name: string;
  /** CZK. */
  price: number;
  /** A condition written after the price. */
  note?: string;
}

// Zásilkovna for 200 Kč, or personal pickup for nothing, only after
// arranging it first (Sami, November 2026).
// TODO(fakta): where the pickup is (the studio?).
export const shippingMethods: ShippingMethod[] = [
  { id: 'zasilkovna', name: 'Zásilkovna', price: 200 },
  { id: 'osobni-odber', name: 'Osobní odběr', price: 0, note: 'pouze po předchozí domluvě' },
];
