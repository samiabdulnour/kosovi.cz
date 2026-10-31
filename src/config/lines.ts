import type { MakerKey } from './site';

/** Who made a piece: Martin throws, Daniela paints. */
export interface Makers {
  thrownBy?: 'martin';
  paintedBy?: 'daniela';
}

export type LineKey = 'spolecna' | 'martin' | 'daniela';

/** Old shop category (and optionally subcategory) a menu entry shows. */
export interface Match {
  category: string;
  subcategory?: string;
}

export interface MenuItem {
  slug: string;
  name: string;
  match: Match[];
}

/** A column of the e-shop menu: a heading and the items under it. */
export interface MenuGroup extends MenuItem {
  items: MenuItem[];
}

export interface Line {
  key: LineKey;
  slug: { cs: string; en: string };
  name: { cs: string; en: string };
  makers: MakerKey[];
  /** Credit shown on a product unless its own data says otherwise. */
  defaultMakers: Makers;
  menu: MenuGroup[];
}

const all = (...categories: string[]): Match[] => categories.map((category) => ({ category }));

// The order of lines and menu columns follows the design (kosovi_navrh_01.pdf).
// Menu names come from the design; `match` maps them onto the imported data.
// An empty `match` is a design category with no products in the old shop yet.
export const lines: Line[] = [
  {
    key: 'spolecna',
    slug: { cs: 'modrobily-porcelan', en: 'blue-and-white' },
    name: { cs: 'Modrobílý porcelán', en: 'Blue and white porcelain' },
    makers: ['martin', 'daniela'],
    // TODO(rozhodnutí): Martin makes all of it now, older pieces were painted
    // by Daniela. Which credit should a product show?
    defaultMakers: { thrownBy: 'martin', paintedBy: 'daniela' },
    menu: [
      {
        slug: 'hrnky',
        name: 'Hrnky',
        match: all('hrnky'),
        items: [
          { slug: 'pitny-rezim', name: 'Pitný režim', match: [{ category: 'hrnky', subcategory: 'pitny-rezim' }] },
          { slug: 'hrnek-velky', name: 'Hrnek velký', match: [{ category: 'hrnky', subcategory: 'velky' }] },
          { slug: 'hrnek-stredni', name: 'Hrnek střední', match: [{ category: 'hrnky', subcategory: 'stredni' }] },
          // TODO(fakta): the old shop calls these "Mini". Same thing?
          { slug: 'hrnek-maly', name: 'Hrnek malý', match: [{ category: 'hrnky', subcategory: 'mini' }] },
          { slug: 'hrnek-uzky', name: 'Hrnek úzký', match: [{ category: 'hrnky', subcategory: 'uzky' }] },
          { slug: 'hrnek-siroky', name: 'Hrnek široký', match: [{ category: 'hrnky', subcategory: 'siroky' }] },
          { slug: 'hrnek-stefan', name: 'Hrnek Štefan', match: [] },
        ],
      },
      {
        slug: 'talire-misky-misy',
        name: 'Talíře, misky a mísy',
        match: all('talire', 'misky', 'misy'),
        items: [
          { slug: 'talir-jidelni', name: 'Talíř jídelní', match: [] },
          { slug: 'talir-maly', name: 'Talíř malý', match: [] },
          { slug: 'talir-polevkovy', name: 'Talíř polévkový', match: [] },
          { slug: 'talir-zavesny', name: 'Talíř závěsný', match: [{ category: 'talire', subcategory: 'talire-zavesne-talire' }] },
          { slug: 'talir-praktik', name: 'Talíř Praktik', match: [{ category: 'talire', subcategory: 'talir-praktik' }] },
          { slug: 'miska-mala', name: 'Miska malá', match: [{ category: 'misky', subcategory: 'mala' }] },
          // TODO(fakta): the old shop has "Polévka/Snídaně" bowls. Are these the large ones?
          { slug: 'miska-velka', name: 'Miska velká', match: [{ category: 'misky', subcategory: 'polevkova-snidanova' }] },
          { slug: 'misa-salatova', name: 'Mísa salátová', match: [{ category: 'misky', subcategory: 'salatova' }] },
        ],
      },
      {
        slug: 'konvice-cukrenky-mlicenky',
        name: 'Konvice, cukřenky, mlíčenky',
        match: all('konvice-rovne', 'konvice-kulate', 'cukrenky', 'mlicenky'),
        items: [
          {
            slug: 'konev-velka',
            name: 'Konev velká',
            match: [
              { category: 'konvice-rovne', subcategory: 'velka' },
              { category: 'konvice-kulate', subcategory: 'velka-konvice-kulate' },
            ],
          },
          {
            slug: 'konev-stredni',
            name: 'Konev střední',
            match: [
              { category: 'konvice-rovne', subcategory: 'stredni-konvice-rovne' },
              { category: 'konvice-kulate', subcategory: 'stredi' },
            ],
          },
          {
            slug: 'konev-mala',
            name: 'Konev malá',
            match: [
              { category: 'konvice-rovne', subcategory: 'mala-konvice-rovne' },
              { category: 'konvice-kulate', subcategory: 'mala-konvice-kulate' },
            ],
          },
          { slug: 'cukrenka-velka', name: 'Cukřenka velká', match: [{ category: 'cukrenky', subcategory: 'velka-cukrenka' }] },
          { slug: 'cukrenka-mala', name: 'Cukřenka malá', match: [{ category: 'cukrenky', subcategory: 'mala-cukrenka' }] },
          { slug: 'mlicenka-velka', name: 'Mlíčenka velká', match: [{ category: 'mlicenky', subcategory: 'velka-mlicenka' }] },
          { slug: 'mlicenka-mala', name: 'Mlíčenka malá', match: [{ category: 'mlicenky', subcategory: 'mala-mlicenka' }] },
        ],
      },
      {
        slug: 'ostatni',
        name: 'Ostatní',
        match: all('podsalky', 'babovky', 'panaky'),
        items: [
          { slug: 'podsalky', name: 'Podšálky', match: all('podsalky') },
          // TODO(fakta): the old shop keeps these together with saucers.
          { slug: 'odkladatka', name: 'Odkládátka', match: [] },
          { slug: 'babovky', name: 'Bábovky', match: all('babovky') },
          { slug: 'panaky', name: 'Panáky', match: all('panaky') },
        ],
      },
    ],
  },
  {
    key: 'martin',
    slug: { cs: 'martin-kos', en: 'martin-kos' },
    name: { cs: 'Martin Kos', en: 'Martin Kos' },
    makers: ['martin'],
    defaultMakers: { thrownBy: 'martin' },
    menu: [
      { slug: 'cajove-soupravy', name: 'Čajové soupravy', match: all('cajove-soupravy'), items: [] },
      { slug: 'konve-solitery', name: 'Konve solitéry', match: all('konve-solitery'), items: [] },
      { slug: 'vazy', name: 'Vázy', match: all('vazy'), items: [] },
      {
        slug: 'hrnky-s-plastickym-dekorem',
        name: 'Hrnky s plastickým dekorem',
        match: all('hrnky-s-plastickym-dekorem'),
        items: [
          { slug: 'hrnek-maly', name: 'Hrnek malý', match: [{ category: 'hrnky-s-plastickym-dekorem', subcategory: 'maly-hrnky-s-razitkem' }] },
          { slug: 'hrnek-stredni', name: 'Hrnek střední', match: [{ category: 'hrnky-s-plastickym-dekorem', subcategory: 'stredni-hrnky-s-razitkem' }] },
          { slug: 'hrnek-velky', name: 'Hrnek velký', match: [{ category: 'hrnky-s-plastickym-dekorem', subcategory: 'velky-hrnky-s-razitkem' }] },
        ],
      },
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
    menu: [
      {
        slug: 'dekory',
        name: 'Dekory',
        match: all('dekory'),
        items: [
          { slug: 'talire', name: 'Talíře', match: [{ category: 'dekory', subcategory: 'talire-dekory' }] },
          { slug: 'misky-kulate', name: 'Misky kulaté', match: [{ category: 'dekory', subcategory: 'misky-kulate' }] },
          { slug: 'misky-hranate', name: 'Misky hranaté', match: [{ category: 'dekory', subcategory: 'misky-hranate' }] },
          { slug: 'tacy', name: 'Tácy', match: [{ category: 'dekory', subcategory: 'tacy' }] },
          { slug: 'salky-a-podsalky', name: 'Šálky a podšálky', match: [{ category: 'dekory', subcategory: 'salky-a-podsalky' }] },
          { slug: 'hrnky', name: 'Hrnky', match: [{ category: 'dekory', subcategory: 'hrnky-dekory' }] },
          { slug: 'jidelni-soupravy', name: 'Jídelní soupravy na zakázku', match: [{ category: 'dekory', subcategory: 'jidelni-soupravy-na-zakazku' }] },
        ],
      },
      {
        slug: 'design',
        name: 'Design',
        match: all('design'),
        items: [
          { slug: 'vesacky', name: 'Věšáčky', match: [{ category: 'design', subcategory: 'vesacky' }] },
          { slug: 'uchytky', name: 'Úchytky', match: [{ category: 'design', subcategory: 'uchytky' }] },
          { slug: 'misky-srdcove', name: 'Misky srdcové', match: [{ category: 'design', subcategory: 'misky-srdcove' }] },
        ],
      },
      { slug: 'obrazky', name: 'Obrázky', match: all('obrazky'), items: [] },
      { slug: 'obklady', name: 'Obklady', match: all('obklady'), items: [] },
    ],
  },
];

export function getLine(key: LineKey): Line {
  const line = lines.find((l) => l.key === key);
  if (!line) throw new Error(`Unknown line: ${key}`);
  return line;
}

/** Every menu entry of a line: the column headings and the items under them. */
export function menuEntries(line: Line): MenuItem[] {
  return line.menu.flatMap((group) => [group, ...group.items]);
}

export function matches(entry: MenuItem, product: { category?: string; subcategory?: string }): boolean {
  return entry.match.some(
    (m) => m.category === product.category && (!m.subcategory || m.subcategory === product.subcategory),
  );
}

/** The menu column and item a product belongs to, for breadcrumbs. */
export function placeOf(line: Line, product: { category?: string; subcategory?: string }) {
  const group = line.menu.find((g) => matches(g, product));
  const item = group?.items.find((i) => matches(i, product));
  return { group, item };
}
