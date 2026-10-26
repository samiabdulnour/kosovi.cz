// Studio facts. Source: the O nás page of the old site (see CLAUDE.md).
export const studio = {
  name: 'Daniela a Martin Kosovi',
  address: {
    street: 'Na Vlčovce 6',
    postalCode: '160 00',
    city: 'Praha 6',
  },
  phones: ['+420 607 635 393', '+420 728 717 232'],
  email: 'danielakosova@gmail.com',
} as const;

export type MakerKey = 'martin' | 'daniela';

export const makers = {
  martin: {
    name: 'Martin Kos',
    role: {
      cs: 'Točí porcelán na hrnčířském kruhu.',
      en: 'Throws porcelain on the potter’s wheel.',
    },
  },
  daniela: {
    name: 'Daniela Kosová',
    role: {
      cs: 'Maluje porcelán kobaltem pod glazuru a tvoří vlastní výtvarná díla.',
      en: 'Paints porcelain with cobalt under the glaze and makes her own artwork.',
    },
  },
} as const satisfies Record<MakerKey, unknown>;
