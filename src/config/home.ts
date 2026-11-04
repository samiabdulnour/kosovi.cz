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

// "Modrobílý porcelán" on the homepage: four pieces, each opens in the e-shop.
// TODO(rozhodnutí): Sami picks them. Products marked `featured: true` win over this list.
export const blueWhiteSelection = [
  'porcelanovy-hrnek-pitny-rezim-s-capy',
  'hrnek-na-presso-s-kotvou',
  'porcelanovy-hrnek-siroky-s-rybkami',
  'talir-praktik-s-tulipany',
];

// The two makers' blocks on the homepage, and "Volné / Užité" on their pages.
// A block without a photo shows just its colour field.
export const artistBlocks: Record<'martin' | 'daniela', { home: Block; free: Block; applied: Block }> = {
  daniela: {
    home: { portrait: 'daniela', field: 'peach' },
    free: { portrait: 'daniela', field: 'sky' },
    applied: { product: 'talir-jidelni-3', field: 'salmon' },
  },
  martin: {
    home: { portrait: 'martin', field: 'olive' },
    // TODO(fakta): photographs of Martin's own work.
    free: { field: 'lavender' },
    applied: { product: 'cajova-souprava-1', field: 'sand' },
  },
};
