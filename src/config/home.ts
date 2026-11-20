// Homepage after the second docs/design/kosovi_homepage.pdf (Sami, November
// 2026): a row of two pictures on colour fields, then rows of photographs
// across the whole width, the first of them the blue-and-white porcelain on a
// green band. Swap photos freely, the page reads them at build time.
import type { MosaicRow } from './mosaic';
import blackTeapots from '../assets/home/konvice-cerne.jpg';
import paintingPoster from '../assets/home/malovani-talire-nahled.jpg';
import paintingVideo from '../assets/home/malovani-talire.mp4?url';
import paintingVideoWebm from '../assets/home/malovani-talire.webm?url';
import babovka from '../assets/home/modrobily-babovka.jpg';
import dinnerSet from '../assets/home/modrobily-jidelni-souprava.jpg';
import fishTeapot from '../assets/home/modrobily-konvice.jpg';
import fishMug from '../assets/home/modrobily-hrnek-s-rybami.jpg';
import platesWithFruit from '../assets/home/modrobily-talire-s-ovocem.jpg';
import platesWithCockerel from '../assets/home/daniela-talire-s-kohoutem.jpg';
import cupAndSaucer from '../assets/home/daniela-salek-a-podsalek.jpg';
import platesWithCake from '../assets/home/daniela-talire-s-kolacem.jpg';
import bowlWithBoats from '../assets/home/daniela-miska-s-lodkami.jpg';
import colourfulBowl from '../assets/home/daniela-miska-barevna.jpg';
import bowlWithApple from '../assets/home/martin-misa-s-jablkem.jpg';
import teapot from '../assets/home/martin-konvice-s-dekorem.jpg';
import teaSet from '../assets/home/martin-cajova-souprava.jpg';
import teaSetStacked from '../assets/home/martin-cajova-souprava-2.jpg';
import cupsFromAbove from '../assets/home/martin-salky-shora.jpg';

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


// The top row, under the header, in place of the former moving photo strip
// (Sami, November 2026). The video opens Daniela's page, the black teapots
// Martin's (Sami, November 2026). The hand painting plates is Sami's video (IMG_1295.MOV, November 2026),
// encoded silent at 576 × 960 as H.264 MP4 and VP9 WebM; its first frame is
// the poster.
export const topRow: MosaicRow = {
  h: 631,
  items: [
    { x: 0, w: 165, color: '#c6e9f9' },
    { x: 530, w: 689, color: '#00154c' },
    {
      x: 164,
      w: 383,
      video: {
        src: paintingVideo,
        webm: paintingVideoWebm,
        poster: paintingPoster,
        label: 'Ruka maluje štětcem obličej na bílý talíř, vedle talíř s ženskou tváří, na růžovém pozadí',
      },
      by: 'daniela',
    },
    { x: 634, w: 878, by: 'martin', photo: { src: blackTeapots, alt: 'Dvě černé kulaté konvice s bílými uchy a výlevkami na oranžovém pozadí' } },
  ],
};

// Positions are the PDF's own (kosovi_homepage.pdf), rounded to the point.
export const mosaic: MosaicRow[] = [
  {
    h: 557.5,
    items: [
      { x: 0, w: 1512, color: '#84c6a1' },
      {
        x: 85,
        w: 730,
        by: 'modrobily',
        photo: { src: dinnerSet, alt: 'Jídelní souprava: tři modré talíře s bílými rybkami a plachetnicemi, položené na sobě' },
      },
      { x: 975, w: 485, by: 'modrobily', photo: { src: fishTeapot, alt: 'Modrá konvice s bílými rybkami a ratanovým uchem' } },
    ],
  },
  {
    h: 474,
    items: [
      { x: 0, w: 756, by: 'daniela', light: true, photo: { src: platesWithCockerel, alt: 'Dva talíře s modře malovaným kohoutem na tmavě modrém pozadí' } },
      // on phones the fourth photograph (Sami, November 2026)
      { x: 755, w: 757, by: 'martin', phone: 4, photo: { src: bowlWithApple, alt: 'Bílá mísa s prořezávaným okrajem a jablkem na fialovém pozadí' } },
    ],
  },
  {
    h: 585.5,
    items: [
      { x: 0, w: 506, by: 'martin', photo: { src: teapot, alt: 'Konvice s dekorem, vedle sítko a víčko, na žlutém pozadí' } },
      { x: 503, w: 506, by: 'daniela', light: true, photo: { src: platesWithCake, alt: 'Talíře s modrou malbou a ovocný koláč na bílém ubrusu' } },
      { x: 1007, w: 505, by: 'modrobily', photo: { src: fishMug, alt: 'Modrý hrnek pitný režim se dvěma bílými rybami' } },
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
    h: 585.5,
    items: [
      { x: 364, w: 689, color: '#c3eecd' },
      { x: 0, w: 517, by: 'daniela', photo: { src: bowlWithBoats, alt: 'Miska s malovanými loďkami na světle modrém pozadí' } },
      { x: 530, w: 451, by: 'martin', photo: { src: cupsFromAbove, alt: 'Bílé šálky a podšálky na dřevěném prkénku, pohled shora' } },
      { x: 998, w: 514, by: 'martin', photo: { src: teaSet, alt: 'Světle modrá čajová souprava: konvice s horním uchem a tři misky' } },
    ],
  },
  {
    h: 530,
    items: [
      { x: 0, w: 1512, color: '#acd4fd' },
      // on phones the colourful bowl before the stacked tea set (Sami, November 2026)
      { x: 0, w: 470, by: 'martin', phone: 16, photo: { src: teaSetStacked, alt: 'Světle modrá konvice s horním uchem a misky naskládané na sobě' } },
      { x: 449, w: 422, by: 'daniela', phone: 15, photo: { src: colourfulBowl, alt: 'Miska s barevnými trojúhelníky a čarami na oranžovém pozadí' } },
      {
        x: 868,
        w: 644,
        by: 'modrobily',
        light: true,
        photo: { src: platesWithFruit, alt: 'Modrobílé talíře a misky s rybami, v nich pomeranč, granátové jablko a citron, pohled shora' },
      },
    ],
  },
];
