import danielaPortrait from '../assets/pages/o-nas/02.jpg';
import martinPortrait from '../assets/pages/o-nas/01.jpg';

// Studio facts. Source: the O nás page of the old site (see CLAUDE.md).
export const studio = {
  // Brand in the header (design kosovi_navrh_01.pdf).
  brand: 'Porcelán Kosovi',
  name: 'Daniela a Martin Kosovi',
  address: {
    street: 'Na Vlčovce 6',
    postalCode: '160 00',
    city: 'Praha 6',
  },
  phones: ['+420 607 635 393', '+420 728 717 232'],
  email: 'danielakosova@gmail.com',
  // TODO(fakta): the design links Instagram; the account name is missing.
  instagram: null as string | null,
} as const;

export type MakerKey = 'martin' | 'daniela';

export const makers = {
  martin: {
    name: 'Martin Kos',
    role: {
      cs: 'Točí porcelán na hrnčířském kruhu.',
      en: 'Throws porcelain on the potter’s wheel.',
    },
    // Photo from the old O nás page (2020). Swap the file after the new shoot.
    portrait: { src: martinPortrait, alt: 'Martin Kos v dílně se štětcem nad řadou bílých hrnků' },
  },
  daniela: {
    name: 'Daniela Kosová',
    role: {
      cs: 'Maluje porcelán kobaltem pod glazuru a tvoří vlastní výtvarná díla.',
      en: 'Paints porcelain with cobalt under the glaze and makes her own artwork.',
    },
    portrait: { src: danielaPortrait, alt: 'Daniela Kosová v ateliéru mezi dvěma porcelánovými sochami' },
  },
} as const satisfies Record<MakerKey, unknown>;
