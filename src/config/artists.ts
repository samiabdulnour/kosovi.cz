// The makers' pages after docs/design/kosovi_daniela_martin.pdf (Sami,
// November 2026): under the label a composition of colour fields and two
// photographs across the whole width, then their pieces five a row as in the
// e-shop, each opening its product page.
//
// Positions are the PDF's own, in points on a frame 1512 wide whose top is the
// top of the fields, so the composition keeps its proportions at any width.
// A piece shows one of its product's photos (Martin's, Sami's new edits from
// November 2026), so swapping a product photo changes this page too; Daniela's
// tiles still use the PDF's own photos, as do the compositions
// (src/assets/artists/).
import type { ImageMetadata } from 'astro';
import type { MakerKey } from './site';
import type { Frame } from './band';

import mHeroKonvice from '../assets/artists/martin/hero-konvice.jpg';
import mHeroVazy from '../assets/artists/martin/hero-vazy.jpg';

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

export interface ArtistPageDesign {
  composition: Composition;
  works: Work[];
}

export const compositionWidth = 1512;

export const artistPages: Record<MakerKey, ArtistPageDesign> = {
  martin: {
    composition: {
      h: 632,
      above: 0,
      fields: [
        { x: 650.2, y: 0, w: 861.8, h: 632, color: '#11611f' },
        { x: 0, y: 0, w: 688.4, h: 632, color: '#0000ff' },
        { x: 480.6, y: 481.8, w: 1031.4, h: 150.2, color: '#d6cf93' },
        { x: 0, y: 481.8, w: 480.6, h: 150.2, color: '#ff5828' },
      ],
      photos: [
        {
          x: 134.11,
          y: 98.56,
          w: 420.17,
          h: 443.21,
          src: mHeroKonvice,
          alt: 'Detail zelené konvice s plastickým dekorem a ratanovým uchem',
        },
        {
          x: 777.06,
          y: 59.61,
          w: 649.94,
          h: 520.97,
          src: mHeroVazy,
          alt: 'Dvě kulaté vázy a vysoká váza s malovanými vážkami na modrém pozadí',
        },
      ],
    },
    works: [
      { product: 'cajova-souprava-4', alt: 'Čajová souprava 4: konvice s rýhovaným tělem a dvě misky' },
      { product: 'konvice-modra', alt: 'Modrá konvice s promáčklým bokem' },
      { product: 'cajova-souprava-3', alt: 'Čajová souprava 3: nízká konvice a tři misky s modrou malbou' },
      { product: 'konvice-s-dekorem', image: 1, alt: 'Konvice s dekorem, vedle sítko a víčko' },
      { product: 'konvice-bila', alt: 'Bílá konvice s ratanovým uchem' },
      { product: 'konvicka-pozlacena', alt: 'Dva šálky zlacené uvnitř na zeleném pozadí', wide: true },
      { product: 'konvice-zelena-s-plastickym-dekorem', alt: 'Zelená konvice s plastickým dekorem a ratanovým uchem' },
      { product: 'konvice-modra-s-plastickym-dekorem', image: 1, alt: 'Detail modré konvice s plastickým dekorem, sítko a ratanové ucho' },
      { product: 'cajova-souprava-5', alt: 'Čajová souprava 5: konvice s ratanovým uchem a tři misky s modrou malbou' },
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
