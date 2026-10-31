// The photo strip on the homepage, after docs/design/pas.pdf (Sami, October 2026).
// Positions are the PDF's own, in points on a 5760 × 630 frame, so the strip
// keeps the design's composition at any height. To swap a photo, replace the
// file in src/assets/band/ and keep its frame, or edit the numbers below.
import type { ImageMetadata } from 'astro';
import p01 from '../assets/band/01.jpg';
import p02 from '../assets/band/02.jpg';
import p03 from '../assets/band/03.jpg';
import p04 from '../assets/band/04.jpg';
import p05 from '../assets/band/05.jpg';
import p06 from '../assets/band/06.jpg';
import p07 from '../assets/band/07.jpg';
import p08 from '../assets/band/08.jpg';
import p09 from '../assets/band/09.jpg';
import p10 from '../assets/band/10.jpg';
import p11 from '../assets/band/11.jpg';
import p12 from '../assets/band/12.jpg';

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const bandSize = { w: 5760, h: 630 };

/** Colour fields, in the PDF's drawing order (later ones lie on top). */
export const bandFields: (Frame & { color: string })[] = [
  { x: 4748.1, y: 0, w: 739.4, h: 584.5, color: '#ffd900' },
  { x: 3732, y: 0, w: 742, h: 617, color: '#a2dcf5' },
  { x: 3700, y: 481, w: 1512, h: 149, color: '#312783' },
  { x: 720, y: 0, w: 498.3, h: 630, color: '#d6cf93' },
  { x: 1077, y: 0, w: 1723, h: 630, color: '#d6cf93' },
  { x: 5193, y: 0, w: 294.5, h: 630, color: '#d6cf93' },
  { x: 2800, y: 0, w: 204, h: 630, color: '#a2dcf5' },
  { x: 1835, y: 307.2, w: 806, h: 322.8, color: '#a2dcf5' },
  { x: 221.5, y: 0, w: 498.5, h: 498, color: '#ffd9ff' },
  { x: 4474.5, y: 0, w: 498.5, h: 481, color: '#ffd9ff' },
  { x: 5193, y: 241, w: 294.5, h: 389, color: '#ffd9ff' },
  { x: 0, y: 0, w: 221.5, h: 630, color: '#c6e9f9' },
  { x: 192, y: 480, w: 1509, h: 150, color: '#ffd900' },
  { x: 2994.6, y: 0, w: 739.4, h: 630, color: '#ffd900' },
  { x: 774, y: 109, w: 656.2, h: 471, color: '#c6e9f9' },
  { x: 1488, y: 0, w: 426, h: 498, color: '#312783' },
  { x: 5487.5, y: 0, w: 272.5, h: 630, color: '#c6e9f9' },
];

/** Photographs, left to right, on top of the fields. */
export const bandPhotos: (Frame & { src: ImageMetadata; alt: string })[] = [
  { src: p01, x: 110.75, y: 47.87, w: 556, h: 371.21, alt: 'Bílá porcelánová plastika, miska na podstavci z kroužků' },
  { src: p02, x: 772.9, y: 107.84, w: 658.37, h: 473.32, alt: 'Dvě černé kulaté konvice s bílými uchy a výlevkami na oranžovém pozadí' },
  { src: p03, x: 1565.93, y: 64.42, w: 270.14, h: 362.23, alt: 'Modrobílá polévková mísa s víkem, tulipány a domácí nudle v kuchyni' },
  { src: p04, x: 1950.06, y: 359.31, w: 263.06, h: 241.39, alt: 'Modrobílá mísa plná ovoce na dřevěném stole' },
  { src: p05, x: 2263.42, y: 1.96, w: 383.23, h: 629.15, alt: 'Ruka maluje obličej na bílý talíř, vedle talíř s ženskou tváří' },
  { src: p06, x: 2744.94, y: 48.07, w: 204.07, h: 207.1, alt: 'Obraz modré býčí hlavy na plátně' },
  { src: p07, x: 2835.18, y: 366.35, w: 318.75, h: 212.5, alt: 'Bílý talíř s prořezávaným okrajem a jablkem na fialovém pozadí' },
  { src: p08, x: 3276.44, y: 22.96, w: 397.56, h: 530.07, alt: 'Bílá forma na bábovku, upečená bábovka a talířek s kouskem bábovky' },
  { src: p09, x: 3850.96, y: 91.94, w: 495.56, h: 487.91, alt: 'Bílé mísy a misky naskládané v dílně' },
  { src: p10, x: 4553.75, y: 77.77, w: 339.98, h: 349.72, alt: 'Ovocný dort a talíře s malovanými obličeji na bílém ubrusu' },
  { src: p11, x: 5054.89, y: 328.96, w: 240.63, h: 256.6, alt: 'Snídaně na modrobílém nádobí: míchaná vejce, rajčata a čaj' },
  { src: p12, x: 5361.27, y: 32.35, w: 365.91, h: 487.88, alt: 'Pivoňky v černé váze se zlatým okrajem' },
];
