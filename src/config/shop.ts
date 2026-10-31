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
}

export const shopIllustrations: Partial<Record<LineKey, Illustration[]>> = {
  spolecna: [
    {
      src: babovka,
      alt: 'Bílá forma na bábovku, upečená bábovka a talířek s kouskem bábovky na dřevěném stole',
      caption: 'Forma na bábovku',
      entry: 'babovky',
    },
  ],
};

/** Products per page: five rows of five, or 26 plus the illustration (6 rows). */
export function pageSizeFor(line: LineKey): number {
  return shopIllustrations[line]?.length ? 26 : 25;
}

/** The illustration shows only on pages with enough pieces around it. */
export const ILLUSTRATION_MIN_PRODUCTS = 8;
