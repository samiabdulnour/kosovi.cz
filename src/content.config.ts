import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per product, written by scripts/import-wp.ts (phase 2).
// Unknown values stay empty. Never guess dimensions, techniques or makers.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Keep the old WooCommerce slug, /produkt/<slug>/ stays the same.
      slug: z.string(),
      line: z.enum(['spolecna', 'martin', 'daniela']),
      category: z.string(),
      makers: z.object({
        thrownBy: z.literal('martin').optional(),
        paintedBy: z.literal('daniela').optional(),
      }),
      // CZK. null means "cena na dotaz".
      price: z.number().nullable(),
      stock: z.number().int(),
      // Signature pieces, Sami picks them.
      featured: z.boolean().default(false),
      catalogNo: z.string().optional(),
      dimensions: z
        .object({
          heightCm: z.number().optional(),
          diameterCm: z.number().optional(),
          volumeMl: z.number().optional(),
        })
        .optional(),
      technique: z.string().optional(),
      care: z
        .object({
          dishwasher: z.boolean().optional(),
          microwave: z.boolean().optional(),
        })
        .optional(),
      images: z.array(z.object({ src: image(), alt: z.string() })),
      description: z.string().optional(),
      oldUrl: z.url().optional(),
    }),
});

// Long-form page copy, one file per page and language.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(['cs', 'en']),
  }),
});

export const collections = { products, pages };
