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
      // Sami, November 2026: the bábovka stays on the line's first view and
      // in Ostatní; the other tabs show a piece of their own large.
      on: ['ostatni'],
    },
  ],
};

/**
 * What fills the large tile of a listing: an illustration on the line's own
 * listing and on the entries it names, else the listing's ninth piece shown
 * large (Sami, November 2026). Lines without illustrations have no large tile.
 */
export function largeTileFor(line: LineKey, entry?: string): 'illustration' | 'product' | undefined {
  const pool = shopIllustrations[line] ?? [];
  if (pool.length === 0) return undefined;
  return !entry || pool.some((i) => i.on.includes(entry)) ? 'illustration' : 'product';
}

/** The illustrations a listing takes turns with. */
export function illustrationsFor(line: LineKey, entry?: string): Illustration[] {
  return (shopIllustrations[line] ?? []).filter((i) => !entry || i.on.includes(entry));
}

/**
 * Products per page, six rows of five: 25 small tiles, plus 26 around an
 * illustration, or 27 when one of them is the large tile.
 */
export function pageSizeFor(line: LineKey, entry?: string): number {
  const large = largeTileFor(line, entry);
  return large === 'illustration' ? 26 : large === 'product' ? 27 : 25;
}

/** The illustration shows only on pages with enough pieces around it. */
export const ILLUSTRATION_MIN_PRODUCTS = 8;
