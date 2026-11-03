import type { MakerKey } from './site';

/** Who made a piece: Martin throws, Daniela paints. */
export interface Makers {
  thrownBy?: 'martin';
  paintedBy?: 'daniela';
}

export type LineKey = 'spolecna' | 'martin' | 'daniela';

/** Old shop category (and optionally subcategory or products) a menu entry shows. */
export interface Match {
  category: string;
  subcategory?: string;
  /** Product slugs, where the old shop has no subcategory to tell them apart. */
  slugs?: string[];
}

export interface MenuItem {
  slug: string;
  name: string;
  match: Match[];
  /** Line drawing in the size chart (src/assets/silhouettes/<name>.svg). */
  silhouette?: string;
  /** Size under the drawing where the product data has none ("6 cm"). The
   *  chart otherwise takes the height (or diameter) from the data, rounded. */
  size?: string;
}

/** A tab of the e-shop menu (a column in lines without a size chart) and its items. */
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
      // Tabs and size chart after kosovi_eshop_2.pdf (Sami, November 2026).
      // Sizes come from the product data, rounded to whole centimetres (Sami,
      // November 2026); the espresso cup has none and keeps the PDF's 6 cm.
      // Kinds go from the largest down, as the mugs do in the PDF.
      {
        slug: 'hrnky',
        name: 'Hrnky',
        match: all('hrnky'),
        items: [
          { slug: 'pitny-rezim', name: 'Pitný režim', silhouette: 'pitny-rezim', match: [{ category: 'hrnky', subcategory: 'pitny-rezim' }] },
          { slug: 'hrnek-velky', name: 'Hrnek velký', silhouette: 'hrnek-velky', match: [{ category: 'hrnky', subcategory: 'velky' }] },
          { slug: 'hrnek-stredni', name: 'Hrnek střední', silhouette: 'hrnek-stredni', match: [{ category: 'hrnky', subcategory: 'stredni' }] },
          { slug: 'hrnek-uzky', name: 'Hrnek úzký', silhouette: 'hrnek-uzky', match: [{ category: 'hrnky', subcategory: 'uzky' }] },
          { slug: 'hrnek-siroky', name: 'Hrnek široký', silhouette: 'hrnek-siroky', match: [{ category: 'hrnky', subcategory: 'siroky' }] },
          { slug: 'hrnek-mini', name: 'Hrnek mini', silhouette: 'hrnek-mini', match: [{ category: 'hrnky', subcategory: 'mini' }] },
          { slug: 'hrnek-espresso', name: 'Hrnek espresso', size: '6 cm', silhouette: 'hrnek-espresso', match: [{ category: 'hrnky', subcategory: 'hrhen-na-presso-s-podsalkem' }] },
        ],
      },
      {
        // TODO(rozhodnutí): Sami is reworking this tab; it keeps the old text menu.
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
        slug: 'konvice',
        name: 'Konvice',
        match: all('konvice-rovne', 'konvice-kulate'),
        items: [
          { slug: 'konev-rovna-velka', name: 'Konev rovná velká', silhouette: 'konev-rovna-velka', match: [{ category: 'konvice-rovne', subcategory: 'velka' }] },
          { slug: 'konev-rovna-stredni', name: 'Konev rovná střední', silhouette: 'konev-rovna-stredni', match: [{ category: 'konvice-rovne', subcategory: 'stredni-konvice-rovne' }] },
          { slug: 'konev-rovna-mala', name: 'Konev rovná malá', silhouette: 'konev-rovna-mala', match: [{ category: 'konvice-rovne', subcategory: 'mala-konvice-rovne' }] },
          { slug: 'konev-kulata-velka', name: 'Konev kulatá velká', silhouette: 'konev-kulata-velka', match: [{ category: 'konvice-kulate', subcategory: 'velka-konvice-kulate' }] },
          { slug: 'konev-kulata-stredni', name: 'Konev kulatá střední', silhouette: 'konev-kulata-stredni', match: [{ category: 'konvice-kulate', subcategory: 'stredi' }] },
          { slug: 'konev-kulata-mala', name: 'Konev kulatá malá', silhouette: 'konev-kulata-mala', match: [{ category: 'konvice-kulate', subcategory: 'mala-konvice-kulate' }] },
        ],
      },
      {
        slug: 'cukrenky-a-mlicenky',
        name: 'Cukřenky a mlíčenky',
        match: all('cukrenky', 'mlicenky'),
        items: [
          // TODO(fakta): the data says 17,5 cm high, the photo suggests about 7,5 cm.
          { slug: 'cukrenka-velka', name: 'Cukřenka velká', silhouette: 'cukrenka-velka', match: [{ category: 'cukrenky', subcategory: 'velka-cukrenka' }] },
          { slug: 'cukrenka-mala', name: 'Cukřenka malá', silhouette: 'cukrenka-mala', match: [{ category: 'cukrenky', subcategory: 'mala-cukrenka' }] },
          { slug: 'mlicenka-velka', name: 'Mlíčenka velká', silhouette: 'mlicenka-velka', match: [{ category: 'mlicenky', subcategory: 'velka-mlicenka' }] },
          { slug: 'mlicenka-mala', name: 'Mlíčenka malá', silhouette: 'mlicenka-mala', match: [{ category: 'mlicenky', subcategory: 'mala-mlicenka' }] },
        ],
      },
      {
        slug: 'ostatni',
        name: 'Ostatní',
        match: all('podsalky', 'babovky', 'panaky'),
        items: [
          { slug: 'babovka-velka', name: 'Bábovka velká', silhouette: 'babovka-velka', match: [{ category: 'babovky', slugs: ['babovka-velka-bila', 'babovka-velka-modra'] }] },
          { slug: 'babovka-mala', name: 'Bábovka malá', silhouette: 'babovka-mala', match: [{ category: 'babovky', slugs: ['babovka-mala'] }] },
          { slug: 'podsalek-velky', name: 'Podšálek velký', silhouette: 'podsalek-velky', match: [{ category: 'podsalky', subcategory: 'velky-podsalky' }] },
          { slug: 'podsalek-maly', name: 'Podšálek malý', silhouette: 'podsalek-maly', match: [{ category: 'podsalky', subcategory: 'maly' }] },
          // TODO(fakta): the data gives only a diameter of 6 cm; the drawing assumes a height of 6 cm.
          { slug: 'panaky', name: 'Panák', silhouette: 'panak', match: all('panaky') },
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

export function matches(entry: MenuItem, product: { category?: string; subcategory?: string; slug?: string }): boolean {
  return entry.match.some(
    (m) =>
      m.category === product.category &&
      (!m.subcategory || m.subcategory === product.subcategory) &&
      (!m.slugs || (product.slug !== undefined && m.slugs.includes(product.slug))),
  );
}

/** A line whose menu is tabs with a size chart (kosovi_eshop_2.pdf). */
export function hasSizeChart(line: Line): boolean {
  return line.menu.some((group) => group.items.some((item) => item.silhouette));
}

/** The menu column and item a product belongs to, for breadcrumbs. */
export function placeOf(line: Line, product: { category?: string; subcategory?: string; slug?: string }) {
  const group = line.menu.find((g) => matches(g, product));
  const item = group?.items.find((i) => matches(i, product));
  return { group, item };
}
