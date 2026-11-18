// Homepage after docs/design/kosovi_homepage.pdf (Sami, November 2026): the
// photo strip (src/config/band.ts), the blue-and-white porcelain on a green
// band, then rows of photographs across the whole width. Swap slugs and photos
// freely, the page reads them at build time.
import type { ImageMetadata } from 'astro';
import babovka from '../assets/home/modrobily-babovka.jpg';
import fishPlates from '../assets/home/modrobily-talire-s-rybami.jpg';
import platesWithCockerel from '../assets/home/daniela-talire-s-kohoutem.jpg';
import cupAndSaucer from '../assets/home/daniela-salek-a-podsalek.jpg';
import platesWithCake from '../assets/home/daniela-talire-s-kolacem.jpg';
import bowlWithBoats from '../assets/home/daniela-miska-s-lodkami.jpg';
import bowlWithApple from '../assets/home/martin-misa-s-jablkem.jpg';
import teapot from '../assets/home/martin-konvice-s-dekorem.jpg';
import teaSet from '../assets/home/martin-cajova-souprava.jpg';
import cupsFromAbove from '../assets/home/martin-salky-shora.jpg';
import breakfast from '../assets/home/snidane.jpg';

/** Colour fields from tokens.css, used behind the photographs. */
export type Field =
  | 'sky'
  | 'blue'
  | 'mist'
  | 'pink'
  | 'blush'
  | 'olive'
  | 'orange'
  | 'peach'
  | 'salmon'
  | 'lavender'
  | 'sand'
  | 'honey';

/** A photograph on a colour field: a product's first photo or a portrait. */
export interface Block {
  product?: string;
  portrait?: 'martin' | 'daniela';
  field: Field;
}

// "Modrobílý porcelán" on the green band: five pieces, each opens in the
// e-shop (Sami's choice in kosovi_homepage.pdf, November 2026). Products
// marked `featured: true` win over this list.
export const blueWhiteSelection = [
  'porcelanovy-hrnek-velky-s-konem',
  'porcelanovy-hrnek-pitny-rezim-s-rybkami-2',
  'porcelanovy-hrnek-velky-s-konskou-hlavou',
  'porcelanovy-hrnek-pitny-rezim-s-prouzky',
  'porcelanovy-hrnek-velky-s-hvezdami',
];

/** Whose work a photograph shows: its name appears on hover and it opens their part of the site. */
export type Author = 'daniela' | 'martin' | 'modrobily';

export interface MosaicItem {
  /** Left edge and width in points on the PDF's frame, 1512 wide. */
  x: number;
  w: number;
  /** A flat colour field, or a photograph. */
  color?: string;
  photo?: { src: ImageMetadata; alt: string };
  by?: Author;
  /** The name in white, on a dark photograph. */
  light?: boolean;
}

export interface MosaicRow {
  /** Height in points on the 1512 wide frame. */
  h: number;
  /** An anchor, e.g. for the header's "Daniela a Martin Kosovi". */
  id?: string;
  /** Fields first, photographs after (later ones lie on top). */
  items: MosaicItem[];
}

export const mosaicWidth = 1512;

// Positions are the PDF's own (kosovi_homepage.pdf), rounded to the point.
export const mosaic: MosaicRow[] = [
  {
    h: 398,
    id: 'daniela-a-martin',
    items: [
      { x: 0, w: 756, by: 'daniela', light: true, photo: { src: platesWithCockerel, alt: 'Dva talíře s modře malovaným kohoutem na tmavě modrém pozadí' } },
      { x: 755, w: 757, by: 'martin', photo: { src: bowlWithApple, alt: 'Bílá mísa s prořezávaným okrajem a jablkem na fialovém pozadí' } },
    ],
  },
  {
    h: 890,
    items: [
      { x: 0, w: 756, color: '#fff8dc' },
      { x: 0, w: 757, by: 'modrobily', photo: { src: babovka, alt: 'Bílá forma na bábovku, upečená bábovka a talířek s kouskem bábovky na dřevěném stole' } },
      { x: 755, w: 757, by: 'daniela', light: true, photo: { src: cupAndSaucer, alt: 'Šálek a podšálek s barevnými plochami na oranžovém pozadí' } },
    ],
  },
  {
    h: 586,
    items: [
      { x: 0, w: 505, by: 'martin', photo: { src: teapot, alt: 'Konvice s dekorem, vedle sítko a víčko, na žlutém pozadí' } },
      { x: 503, w: 506, by: 'daniela', light: true, photo: { src: platesWithCake, alt: 'Talíře s modrou malbou a ovocný koláč na bílém ubrusu' } },
      { x: 1008, w: 504, by: 'martin', photo: { src: teaSet, alt: 'Čajová souprava: nízká konvice a tři misky s modrou malbou' } },
    ],
  },
  {
    h: 560,
    items: [
      { x: 730, w: 315, color: '#c3eecd' },
      { x: 1347, w: 165, color: '#4cbbec' },
      { x: 0, w: 730, by: 'modrobily', photo: { src: fishPlates, alt: 'Modrobílé talíře s rybkami, položené na sobě' } },
      { x: 909, w: 439, by: 'martin', photo: { src: cupsFromAbove, alt: 'Bílé šálky a podšálky na dřevěném prkénku, pohled shora' } },
    ],
  },
  {
    h: 560,
    items: [
      { x: 357, w: 689, color: '#d6cf93' },
      // no name in the PDF, so it opens nothing (Sami, November 2026)
      { x: 0, w: 448, photo: { src: breakfast, alt: 'Snídaně na dřevěném stole: talířek s chlebem a šálky kávy na podnose' } },
      { x: 985, w: 527, by: 'daniela', photo: { src: bowlWithBoats, alt: 'Miska s malovanými loďkami na světle modrém pozadí' } },
    ],
  },
];
