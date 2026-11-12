import { getCollection, type CollectionEntry } from 'astro:content';
import { getLine, matches, placeOf, type LineKey, type Makers, type MenuItem } from '../config/lines';
import { decorMotifs } from './names';

export type Product = CollectionEntry<'products'>['data'];

function byFeaturedThenTitle(a: Product, b: Product): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.title.localeCompare(b.title, 'cs');
}

export async function getProducts(filter?: (p: Product) => boolean): Promise<Product[]> {
  const entries = await getCollection('products');
  const products = entries.map((e) => e.data);
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

export async function getLineProducts(line: LineKey, category?: string): Promise<Product[]> {
  return inMenuOrder(line, await getProducts((p) => p.line === line && (!category || p.category === category)));
}

/** Products under one e-shop menu entry (a column heading or an item). */
export async function getEntryProducts(line: LineKey, entry: MenuItem): Promise<Product[]> {
  return inMenuOrder(line, await getProducts((p) => p.line === line && matches(entry, p)));
}

export async function getProductsBySlug(slugs: string[]): Promise<Product[]> {
  const products = await getProducts();
  return slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));
}

export function getFeaturedProducts(): Promise<Product[]> {
  return getProducts((p) => p.featured);
}

/** The product's own credit, or the default of its line. */
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
