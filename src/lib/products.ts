import { getCollection, type CollectionEntry } from 'astro:content';
import { getLine, matches, type LineKey, type Makers, type MenuItem } from '../config/lines';

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
