import { getCollection, type CollectionEntry } from 'astro:content';
import type { LineKey } from '../config/lines';

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
