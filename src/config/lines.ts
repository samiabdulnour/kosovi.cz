import type { MakerKey } from './site';

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
  categories: Category[];
}

// TODO(fakta): nobody has confirmed that the blue-and-white line is joint work
// (his forms, her painting). Until Sami confirms, change it only here.
export const JOINT_LINE_CONFIRMED = false;

// Order matters: the joint line comes first everywhere.
// Category slugs are provisional; phase 2 aligns them with the old shop.
export const lines: Line[] = [
  {
    key: 'spolecna',
    slug: { cs: 'modrobily-porcelan', en: 'blue-and-white' },
    name: { cs: 'Modrobílý porcelán', en: 'Blue and white porcelain' },
    makers: ['martin', 'daniela'],
    categories: [
      { slug: 'hrnky', name: 'Hrnky' },
      { slug: 'podsalky', name: 'Podšálky' },
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
