import { getCollection, type CollectionEntry } from 'astro:content';
import { getLine, type LineKey, type Makers } from '../config/lines';

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

export function getLineProducts(line: LineKey, category?: string): Promise<Product[]> {
  return getProducts((p) => p.line === line && (!category || p.category === category));
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
