import { getCollection, type CollectionEntry } from 'astro:content';
import { getLine, matches, placeOf, type LineKey, type Makers, type MenuItem } from '../config/lines';
import { motifKey } from './names';

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

/** Pieces from the same category, the same subcategory (size, shape) first. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.category) return [];
  const candidates = (await getLineProducts(product.line, product.category)).filter((p) => p.slug !== product.slug);
  const same = candidates.filter((p) => product.subcategory && p.subcategory === product.subcategory);
  const rest = candidates.filter((p) => !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

/** The kind (menu item, else tab) a product sits under. */
export function kindOf(product: Product): MenuItem | undefined {
  const { group, item } = placeOf(getLine(product.line), product);
  return item ?? group;
}

/** Other pieces of the same kind ("ze stejné sady"), starting after this one. */
export async function getSameSet(product: Product, limit: number): Promise<Product[]> {
  const kind = kindOf(product);
  if (!kind) return [];
  const all = await getEntryProducts(product.line, kind);
  const at = all.findIndex((p) => p.slug === product.slug);
  const rotated = [...all.slice(at + 1), ...all.slice(0, Math.max(at, 0))];
  return rotated.filter((p) => p.slug !== product.slug).slice(0, limit);
}

/** Pieces of other kinds with the same motif ("se stejným dekorem"). */
export async function getSameDecor(product: Product, limit: number): Promise<Product[]> {
  const key = motifKey(product.title);
  if (!key) return [];
  const kind = kindOf(product);
  const all = await getLineProducts(product.line);
  return all
    .filter((p) => p.slug !== product.slug && motifKey(p.title) === key && !(kind && matches(kind, p)))
    .slice(0, limit);
}
