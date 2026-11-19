import { getCollection, type CollectionEntry } from 'astro:content';
import { getLine, matches, placeOf, type LineKey, type Makers, type MenuItem } from '../config/lines';
import { decorMotifs } from './names';

export type Product = CollectionEntry<'products'>['data'];

function byFeaturedThenTitle(a: Product, b: Product): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.title.localeCompare(b.title, 'cs');
}

// A product without a photo stays off the site until it has one (Sami,
// November 2026: the shot glass with two hearts, which the old shop had no
// photo of either). Its old URL needs a redirect meanwhile (phase 7).
export async function getProducts(filter?: (p: Product) => boolean): Promise<Product[]> {
  const entries = await getCollection('products');
  const products = entries.map((e) => e.data).filter((p) => p.images.length > 0);
  return (filter ? products.filter(filter) : products).sort(byFeaturedThenTitle);
}

/** Featured pieces first, then in the order of the e-shop menu (mugs before bowls).
 * The sort is stable, so titles stay alphabetical within an entry. */
function inMenuOrder(line: LineKey, products: Product[]): Product[] {
  // Items in menu order, each column heading last as the catch-all for its column.
  const entries = getLine(line).menu.flatMap((group) => [...group.items, group]);
  const rank = (p: Product) => {
    const i = entries.findIndex((e) => matches(e, p));
    return i === -1 ? entries.length : i;
  };
  return [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || rank(a) - rank(b));
}

/** Featured pieces first, then one piece of each kind in turn, in the menu's
 * order, so a line's first page shows its range and not one kind (Sami,
 * November 2026: it opened on the Pitný režim mugs only). */
function mixed(line: LineKey, products: Product[]): Product[] {
  const entries = getLine(line).menu.flatMap((group) => [...group.items, group]);
  const kinds = new Map<number, Product[]>();
  for (const p of products) {
    const i = entries.findIndex((e) => matches(e, p));
    const key = i === -1 ? entries.length : i;
    kinds.set(key, [...(kinds.get(key) ?? []), p]);
  }
  const order = [...kinds.keys()].sort((a, b) => a - b);
  const out: Product[] = [];
  for (let round = 0; out.length < products.length; round++) {
    for (const key of order) {
      const piece = kinds.get(key)![round];
      if (piece) out.push(piece);
    }
  }
  return [...out.filter((p) => p.featured), ...out.filter((p) => !p.featured)];
}

/** A whole line, for its first listing (no tab chosen): a mix of its kinds. */
export async function getLineProducts(line: LineKey, category?: string): Promise<Product[]> {
  return mixed(line, await getProducts((p) => p.line === line && (!category || p.category === category)));
}

/** Products under one e-shop menu entry (a column heading or an item), in
 * the order its slugs list them where it lists them (Daniela's categories). */
export async function getEntryProducts(line: LineKey, entry: MenuItem): Promise<Product[]> {
  const products = inMenuOrder(line, await getProducts((p) => p.line === line && matches(entry, p)));
  const listed = entry.match.flatMap((m) => m.slugs ?? []);
  if (listed.length === 0) return products;
  const rank = (p: Product) => (listed.includes(p.slug) ? listed.indexOf(p.slug) : listed.length);
  return [...products].sort((a, b) => rank(a) - rank(b));
}

export async function getProductsBySlug(slugs: string[]): Promise<Product[]> {
  const products = await getProducts();
  return slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));
}

export function getFeaturedProducts(): Promise<Product[]> {
  return getProducts((p) => p.featured);
}

/** The product's own credit, or the default of its line. */
/** Asked about by e-mail rather than put in the cart: Martin's pieces, except
 *  the stamped mugs, and Daniela's (Sami, November 2026). */
export function askOnly(product: Product): boolean {
  if (product.line === 'daniela') return true;
  return product.line === 'martin' && product.category !== 'hrnky-s-plastickym-dekorem';
}

/** Whether the price, or "cena na dotaz", is written: not for Martin's pieces
 *  asked about by e-mail that have no price (his new vases, Sami, November 2026). */
export function showsPrice(product: Product): boolean {
  return product.price !== null || !(product.line === 'martin' && askOnly(product));
}

export function makersOf(product: Product): Makers {
  const own = product.makers;
  return own.thrownBy || own.paintedBy ? own : getLine(product.line).defaultMakers;
}

/** The kind (menu item, else tab) a product sits under. */
export function kindOf(product: Product): MenuItem | undefined {
  const { group, item } = placeOf(getLine(product.line), product);
  return item ?? group;
}

/** Pieces in an entry, starting after this one (so neighbours differ from page to page). */
async function around(product: Product, entry: MenuItem): Promise<Product[]> {
  const all = await getEntryProducts(product.line, entry);
  const at = all.findIndex((p) => p.slug === product.slug);
  return [...all.slice(at + 1), ...all.slice(0, Math.max(at, 0))].filter((p) => p.slug !== product.slug);
}

/** "Ze stejné sady": pieces of the same kind whose decor shares a motif with this one. */
export async function getSameSet(product: Product): Promise<Product[]> {
  const kind = kindOf(product);
  const motifs = decorMotifs(product.title);
  if (!kind || motifs.length === 0) return [];
  return (await around(product, kind)).filter((p) => decorMotifs(p.title).some((m) => motifs.includes(m)));
}

/** "Se stejným dekorem": the same decor on other kinds of piece. */
export async function getSameDecor(product: Product): Promise<Product[]> {
  const motifs = decorMotifs(product.title).join(' ');
  if (!motifs) return [];
  const kind = kindOf(product);
  return (await getLineProducts(product.line)).filter(
    (p) => p.slug !== product.slug && !(kind && matches(kind, p)) && decorMotifs(p.title).join(' ') === motifs,
  );
}

/** Other pieces of the same tab, for tabs without a decor to match (Ostatní). */
export async function getSameTab(product: Product): Promise<Product[]> {
  const { group } = placeOf(getLine(product.line), product);
  return group ? around(product, group) : [];
}
