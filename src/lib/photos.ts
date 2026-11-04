import type { ImageMetadata } from 'astro';
import type { Block } from '../config/home';
import { makers } from '../config/site';
import { getProductsBySlug } from './products';

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

/** The photograph a block points at, or undefined when it has none. */
export async function photoOf(block: Block): Promise<Photo | undefined> {
  if (block.portrait) return makers[block.portrait].portrait;
  if (!block.product) return undefined;
  const [product] = await getProductsBySlug([block.product]);
  const image = product?.images[0];
  return image ? { src: image.src, alt: image.alt } : undefined;
}
