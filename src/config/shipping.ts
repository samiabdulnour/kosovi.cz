export interface ShippingMethod {
  id: string;
  name: string;
  // CZK. null until Sami confirms the price.
  price: number | null;
}

// TODO(fakta): methods, prices and the pickup location. Do they use Zásilkovna?
export const shippingMethods: ShippingMethod[] = [
  { id: 'osobni-odber', name: 'Osobní odběr', price: null },
  { id: 'ceska-posta', name: 'Česká pošta', price: null },
  { id: 'zasilkovna', name: 'Zásilkovna', price: null },
];
