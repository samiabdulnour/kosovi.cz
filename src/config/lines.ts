import type { MakerKey } from './site';

/** Who made a piece: Martin throws, Daniela paints. */
export interface Makers {
  thrownBy?: 'martin';
  paintedBy?: 'daniela';
}

export type LineKey = 'spolecna' | 'martin' | 'daniela';

export interface Category {
  slug: string;
  name: string;
}

export interface Line {
  key: LineKey;
  slug: { cs: string; en: string };
  name: { cs: string; en: string };
  makers: MakerKey[];
  /** Credit shown on a product unless its own data says otherwise. */
  defaultMakers: Makers;
  categories: Category[];
}

// TODO(fakta): nobody has confirmed that the blue-and-white line is joint work
// (his forms, her painting). Until Sami confirms, change it only here.
export const JOINT_LINE_CONFIRMED = false;

// Order matters: the joint line comes first everywhere.
// Category slugs follow the old shop (scripts/import-wp.ts maps the two that differ).
export const lines: Line[] = [
  {
    key: 'spolecna',
    slug: { cs: 'modrobily-porcelan', en: 'blue-and-white' },
    name: { cs: 'Modrobílý porcelán', en: 'Blue and white porcelain' },
    makers: ['martin', 'daniela'],
    // TODO(fakta): unconfirmed, see JOINT_LINE_CONFIRMED.
    defaultMakers: { thrownBy: 'martin', paintedBy: 'daniela' },
    categories: [
      { slug: 'hrnky', name: 'Hrnky' },
      { slug: 'podsalky', name: 'Podšálky a odkládátka' },
      { slug: 'talire', name: 'Talíře' },
      { slug: 'misky', name: 'Misky' },
      { slug: 'misy', name: 'Mísy' },
      { slug: 'konvice-rovne', name: 'Konvice rovné' },
      { slug: 'konvice-kulate', name: 'Konvice kulaté' },
      { slug: 'cukrenky', name: 'Cukřenky' },
      { slug: 'mlicenky', name: 'Mlíčenky' },
      { slug: 'babovky', name: 'Bábovky' },
      { slug: 'panaky', name: 'Panáky' },
    ],
  },
  {
    key: 'martin',
    slug: { cs: 'martin-kos', en: 'martin-kos' },
    name: { cs: 'Martin Kos', en: 'Martin Kos' },
    makers: ['martin'],
    defaultMakers: { thrownBy: 'martin' },
    categories: [
      { slug: 'cajove-soupravy', name: 'Čajové soupravy' },
      { slug: 'konve-solitery', name: 'Konve solitéry' },
      { slug: 'vazy', name: 'Vázy' },
      { slug: 'hrnky-s-plastickym-dekorem', name: 'Hrnky s\u00a0plastickým dekorem' },
    ],
  },
  {
    key: 'daniela',
    slug: { cs: 'daniela-kosova', en: 'daniela-kosova' },
    name: { cs: 'Daniela Kosová', en: 'Daniela Kosová' },
    makers: ['daniela'],
    // TODO(fakta): right for decors, pictures and tiles. Is it right for the
    // hangers and knobs in "Design"?
    defaultMakers: { paintedBy: 'daniela' },
    categories: [
      { slug: 'dekory', name: 'Dekory' },
      { slug: 'design', name: 'Design' },
      { slug: 'obrazky', name: 'Obrázky' },
      { slug: 'obklady', name: 'Obklady' },
    ],
  },
];

export function getLine(key: LineKey): Line {
  const line = lines.find((l) => l.key === key);
  if (!line) throw new Error(`Unknown line: ${key}`);
  return line;
}
