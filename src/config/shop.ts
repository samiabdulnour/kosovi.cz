// E-shop listing settings (design eshop.pdf).
import type { ImageMetadata } from 'astro';
import babovka from '../assets/shop/babovka.jpg';
import type { LineKey } from './lines';

/** A large photo in the product grid, two columns by two rows, so the
 *  listing does not look too rigid. It opens a menu entry of the line. */
export interface Illustration {
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** Menu entry slug from src/config/lines.ts. */
  entry: string;
  /** Listings it shows on besides the line's own: menu entry slugs. */
  on: string[];
}

export const shopIllustrations: Partial<Record<LineKey, Illustration[]>> = {
  spolecna: [
    {
      src: babovka,
      alt: 'Bílá forma na bábovku, upečená bábovka a talířek s kouskem bábovky na dřevěném stole',
      caption: 'Forma na bábovku',
      // TODO(rozhodnutí): both sizes of bábovka are separate entries now.
      entry: 'babovka-velka',
      // Sami, November 2026: the bábovka stays on the line's first view and in
      // Ostatní; the other tabs keep one plain grid until their pieces are
      // photographed, then they get large photos of their own here.
      on: ['ostatni'],
    },
  ],
};

/**
 * Whether a listing has the large tile: an illustration on the line's own
 * listing and on the entries it names; every other listing is one plain grid
 * (Sami, November 2026).
 */
export function hasIllustration(line: LineKey, entry?: string): boolean {
  const pool = shopIllustrations[line] ?? [];
  return pool.length > 0 && (!entry || pool.some((i) => i.on.includes(entry)));
}

/** The illustrations a listing takes turns with. */
export function illustrationsFor(line: LineKey, entry?: string): Illustration[] {
  return (shopIllustrations[line] ?? []).filter((i) => !entry || i.on.includes(entry));
}

/** Products per page: five rows of five, or 26 around an illustration (six rows). */
export function pageSizeFor(line: LineKey, entry?: string): number {
  // Daniela's Obtisky on one page, the heart bowls as its sixth row (Sami,
  // November 2026)
  if (line === 'daniela' && entry === 'obtisky') return 30;
  return hasIllustration(line, entry) ? 26 : 25;
}

/** The illustration shows only on pages with enough pieces around it. */
export const ILLUSTRATION_MIN_PRODUCTS = 8;
