// Rows of photographs on colour fields, placed as in Sami's PDFs on a frame
// 1512 points wide and scaled with the page (src/components/Mosaic.astro):
// the homepage (src/config/home.ts) and Martin's page (src/config/artists.ts).
import type { ImageMetadata } from 'astro';
import type { LineKey } from './lines';
import type { Lang } from '../i18n/ui';

/** Whose work a photograph shows: its name appears on hover and it opens their part of the site. */
export type Author = 'daniela' | 'martin' | 'modrobily';

export interface MosaicItem {
  /** Left edge and width in points on the PDF's frame, 1512 wide. */
  x: number;
  w: number;
  /** A flat colour field, a photograph, or a silent looping video. */
  color?: string;
  photo?: { src: ImageMetadata; alt: string };
  /** MP4 (H.264) for every browser, WebM (VP9) for those without H.264. */
  video?: { src: string; webm?: string; poster: ImageMetadata; label: string };
  /** Opens the author's part of the site, the author's name on hover. */
  by?: Author;
  /** A caption of its own on hover, in place of the author's name. */
  caption?: Record<Lang, string>;
  /** Opens this product's page. */
  product?: string;
  /** Opens this part of a line's e-shop (a menu entry, or the whole line). */
  shop?: { line: LineKey; entry?: string };
  /** The name in white, on a dark photograph. */
  light?: boolean;
}

export interface MosaicRow {
  /** Height in points on the 1512 wide frame. */
  h: number;
  /** Fields first, photographs after (later ones lie on top). */
  items: MosaicItem[];
}

export const mosaicWidth = 1512;
