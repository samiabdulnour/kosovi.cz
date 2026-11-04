// The size shown for a kind of piece: in the e-shop's size chart and on the
// product page (kosovi_eshop_2.pdf, kosovi_eshop_produkt.pdf).
import type { LineKey, MenuItem } from '../config/lines';
import { getEntryProducts } from './products';

/** The most common value, or undefined. */
function mostCommon(values: number[]): number | undefined {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
}

/**
 * The menu's own size where it has one ("4–6 cm"), else "16 cm" from the
 * height in the product data or "⌀ 11 cm" from its diameter, rounded to whole
 * centimetres (Sami, November 2026).
 */
export async function kindSize(line: LineKey, item: MenuItem): Promise<string | undefined> {
  if (item.size) return item.size;
  const products = await getEntryProducts(line, item);
  const height = mostCommon(products.flatMap((p) => (p.dimensions?.heightCm ? [p.dimensions.heightCm] : [])));
  if (height !== undefined) return `${Math.round(height)} cm`;
  const diameter = mostCommon(products.flatMap((p) => (p.dimensions?.diameterCm ? [p.dimensions.diameterCm] : [])));
  if (diameter !== undefined) return `⌀ ${Math.round(diameter)} cm`;
  return undefined;
}
