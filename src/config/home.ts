// Homepage picks (design kosovi_navrh_01.pdf). Swap slugs freely, the pages
// read them at build time. The photo strip has its own file, src/config/band.ts.

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

// "Modrobílý porcelán" on the homepage: five pieces in a row of the e-shop's
// grid, each opens in the e-shop.
// TODO(rozhodnutí): Sami picks them. Products marked `featured: true` win over this list.
export const blueWhiteSelection = [
  'porcelanovy-hrnek-pitny-rezim-s-capy',
  'hrnek-na-presso-s-kotvou',
  'porcelanovy-hrnek-siroky-s-rybkami',
  'talir-praktik-s-tulipany',
  // the fifth (Sami, November 2026: a row like the e-shop's); swap freely
  'porcelanova-konev-kulata-stredni-se-srdci',
];

// The two makers' blocks on the homepage. A block without a photo shows just
// its colour field. Their own pages are laid out in src/config/artists.ts.
export const artistBlocks: Record<'martin' | 'daniela', { home: Block }> = {
  daniela: {
    home: { portrait: 'daniela', field: 'peach' },
  },
  martin: {
    home: { portrait: 'martin', field: 'olive' },
  },
};
