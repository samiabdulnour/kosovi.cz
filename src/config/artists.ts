// The makers' pages. Martin's after docs/design/kosovi_martin.pdf (Sami,
// November 2026): five rows of photographs on colour fields across the whole
// width, as on the homepage (src/components/Mosaic.astro), each with its
// caption on hover and opening its category in his part of the e-shop (vases,
// teapots and tea sets, stamped mugs); a photo in none of them opens nothing
// for now (Sami, November 2026). The photos are the PDF's own
// (src/assets/artists/martin/).
//
// Daniela's after docs/design/kosovi_daniela_martin.pdf (Sami, November
// 2026): under the label a composition of colour fields and two photographs
// across the whole width, then her pieces five a row as in the e-shop, each
// opening its product page. Positions are the PDF's own, in points on a frame
// 1512 wide whose top is the top of the fields, so the composition keeps its
// proportions at any width. Her tiles use the PDF's own photos, as does the
// composition (src/assets/artists/daniela/).
import type { ImageMetadata } from 'astro';
import type { MakerKey } from './site';

import type { MosaicRow } from './mosaic';

import mVazy from '../assets/artists/martin/vazy.jpg';
import mKonve from '../assets/artists/martin/konve.jpg';
import mCajoveSoupravy from '../assets/artists/martin/cajove-soupravy.jpg';
import mVazySVazkami from '../assets/artists/martin/vazy-s-vazkami.jpg';
import mVazaTulipany from '../assets/artists/martin/vaza-tulipany.jpg';
import mHrnekRazitko1 from '../assets/artists/martin/hrnek-razitko-1.jpg';
import mTenkostenneHrnky from '../assets/artists/martin/tenkostenne-hrnky.jpg';
import mHrnekRazitko2 from '../assets/artists/martin/hrnek-razitko-2.jpg';
import mVazaRuze from '../assets/artists/martin/vaza-ruze.jpg';
import mCajovaSouprava from '../assets/artists/martin/cajova-souprava.jpg';
import mVazaModra from '../assets/artists/martin/vaza-modra.jpg';
import mZlateKonvicky from '../assets/artists/martin/zlate-konvicky.jpg';
import mVazaKvetiny from '../assets/artists/martin/vaza-kvetiny.jpg';

import dHeroMisa from '../assets/artists/daniela/hero-misa.jpg';
import dHeroMiska from '../assets/artists/daniela/hero-miska.jpg';
import d01 from '../assets/artists/daniela/01-salek-a-podsalek-3.jpg';
import d02 from '../assets/artists/daniela/02-salek-a-podsalek-1-podsalek.jpg';
import d03 from '../assets/artists/daniela/03-salek-a-podsalek-4.jpg';
import d04 from '../assets/artists/daniela/04-salek-a-podsalek-2.jpg';
import d05 from '../assets/artists/daniela/05-salek-a-podsalek-4-podsalek.jpg';
import d06 from '../assets/artists/daniela/06-salek-a-podsalek-1.jpg';
import d07 from '../assets/artists/daniela/07-salek-a-podsalek-3-podsalek.jpg';
import d08 from '../assets/artists/daniela/08-salek-a-podsalek-1-salek.jpg';
import d09 from '../assets/artists/daniela/09-salek-a-podsalek-5.jpg';
import d10 from '../assets/artists/daniela/10-salek-a-podsalek-1-salek-2.jpg';

/** A rectangle in points on the PDF's frame. */
export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Composition {
  /** Frame height in points (the width is 1512). */
  h: number;
  /** Extra space above the fields, in points (the PDF's Daniela page sits lower). */
  above: number;
  /** Colour fields, in the PDF's drawing order (later ones lie on top). */
  fields: (Frame & { color: string })[];
  photos: (Frame & { src: ImageMetadata; alt: string })[];
}

export interface Work {
  /** The product it opens, by slug; its name and price make the caption. */
  product: string;
  /** Which of the product's photos to show (0 = the first), unless `src` is given. */
  image?: number;
  /** A photo of its own instead of the product's. */
  src?: ImageMetadata;
  alt: string;
  /** Two columns wide, one row high. */
  wide?: boolean;
}

export type ArtistPageDesign =
  /** Rows of photographs, as on the homepage. */
  | { mosaic: MosaicRow[] }
  /** A composition, then the pieces five a row. */
  | { composition: Composition; works: Work[] };

export const compositionWidth = 1512;

export const artistPages: Record<MakerKey, ArtistPageDesign> = {
  // Positions are the PDF's own (kosovi_martin.pdf), rounded to a tenth of a
  // point. The labels are the PDF's, "vážkami" for its "váškami".
  martin: {
    mosaic: [
      {
        h: 605.5,
        items: [
          {
            x: 0,
            w: 437.4,
            caption: { cs: 'Vázy', en: 'Vases' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazy, alt: 'Bílá váza s plastickým povrchem a rozevřeným hrdlem' },
          },
          {
            x: 437.4,
            w: 551.3,
            caption: { cs: 'Konve', en: 'Teapots' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mKonve, alt: 'Zelená konvice s plastickým dekorem a ratanovým uchem na žlutém pozadí' },
          },
          {
            x: 988.7,
            w: 523.3,
            caption: { cs: 'Čajové soupravy', en: 'Tea sets' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mCajoveSoupravy, alt: 'Světle modrá čajová souprava: konvice s rýhovaným tělem a tři misky' },
          },
        ],
      },
      {
        h: 674.4,
        items: [
          { x: 0, w: 1512, color: '#a2dcf5' },
          {
            x: 54.6,
            w: 848.2,
            caption: { cs: 'Vázy s vážkami', en: 'Vases with dragonflies' },
            shop: { line: 'martin', entry: 'vazy' },
            light: true,
            photo: { src: mVazySVazkami, alt: 'Dvě kulaté vázy a vysoká váza s malovanými vážkami na modrém pozadí' },
          },
          {
            x: 938.3,
            w: 522.7,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaTulipany, alt: 'Bílá váza s plastickými tečkami, v ní žluté tulipány a fialové kosatce, za ní obraz' },
          },
        ],
      },
      {
        h: 525.9,
        items: [
          { x: 366.5, w: 739.4, color: '#fff8dc' },
          {
            x: 0,
            w: 390,
            caption: { cs: 'Hrnek razítko', en: 'Stamped mug' },
            shop: { line: 'martin', entry: 'hrnky-s-razitkem' },
            photo: { src: mHrnekRazitko1, alt: 'Šedý hrnek s razítkem čtverců' },
          },
          // in none of the three categories, so it opens nothing for now (Sami, November 2026)
          {
            x: 444.4,
            w: 523.7,
            caption: { cs: 'Tenkostěnné hrnky', en: 'Thin-walled cups' },
            photo: { src: mTenkostenneHrnky, alt: 'Bílé šálky a podšálky na dřevěném prkénku, pohled shora' },
          },
          {
            x: 1021.4,
            w: 490.6,
            caption: { cs: 'Hrnek razítko', en: 'Stamped mug' },
            shop: { line: 'martin', entry: 'hrnky-s-razitkem' },
            photo: { src: mHrnekRazitko2, alt: 'Zelený hrnek s razítkem důlků' },
          },
        ],
      },
      {
        h: 718.5,
        items: [
          { x: 156.8, w: 739.4, color: '#c6e2d0' },
          {
            x: 0,
            w: 502,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaRuze, alt: 'Tmavě modrá váza se zlatým okrajem, v ní růže' },
          },
          {
            x: 555.1,
            w: 538.9,
            caption: { cs: 'Čajová souprava', en: 'Tea set' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mCajovaSouprava, alt: 'Čajová souprava: konvice s ratanovým uchem a tři misky s modrou malbou na žlutém pozadí' },
          },
          {
            x: 1094,
            w: 418,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaModra, alt: 'Vysoká váza s modrým vlnitým dekorem' },
          },
        ],
      },
      {
        h: 678.5,
        items: [
          { x: 0, w: 1294.5, color: '#a2dcf5' },
          {
            x: 272.1,
            w: 508.8,
            caption: { cs: 'Zlaté konvičky', en: 'Gilded pots' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            light: true,
            photo: { src: mZlateKonvicky, alt: 'Dva šálky zlacené uvnitř na zeleném pozadí' },
          },
          {
            x: 995.8,
            w: 516.2,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaKvetiny, alt: 'Světle zelená váza s důlky, v ní bílé a růžové květiny, na dřevěném stole' },
          },
        ],
      },
    ],
  },
  daniela: {
    composition: {
      h: 596,
      above: 36,
      fields: [
        { x: 480.6, y: 0, w: 1031.4, h: 596, color: '#d6cf93' },
        { x: 0, y: 0, w: 480.6, h: 596, color: '#ff5828' },
      ],
      photos: [
        {
          x: 133.99,
          y: 62.83,
          w: 488.03,
          h: 492.29,
          src: dHeroMisa,
          alt: 'Mísa s víkem malovaná modře, vedle tulipány ve váze',
        },
        {
          x: 915.61,
          y: 23.61,
          w: 372.84,
          h: 497.12,
          src: dHeroMiska,
          alt: 'Miska s modře malovaným okrajem plná červeného ovoce na dřevěném stole',
        },
      ],
    },
    works: [
      { product: 'salek-a-podsalek-3', src: d01, alt: 'Šálek a podšálek s hustým modrým dekorem' },
      { product: 'salek-a-podsalek-1', src: d02, alt: 'Podšálek s barevnými trojúhelníky a čarami, pohled shora' },
      { product: 'salek-a-podsalek-4', src: d03, alt: 'Šálek a podšálek s modrými trojúhelníky' },
      { product: 'salek-a-podsalek-2', src: d04, alt: 'Šálek a podšálek s barevnými plochami' },
      { product: 'salek-a-podsalek-4', src: d05, alt: 'Podšálek s modrými trojúhelníky, pohled shora' },
      { product: 'salek-a-podsalek-1', src: d06, alt: 'Šálek a podšálek s barevnými čarami' },
      { product: 'salek-a-podsalek-3', src: d07, alt: 'Podšálek s hustým modrým dekorem, pohled shora' },
      { product: 'salek-a-podsalek-1', src: d08, alt: 'Šálek s barevnými čarami' },
      { product: 'salek-a-podsalek-5', src: d09, alt: 'Šálek a podšálek s modrými obrázky lodi a ryby' },
      { product: 'salek-a-podsalek-1', src: d10, alt: 'Šálek s barevnými čarami, ucho vlevo' },
    ],
  },
};
