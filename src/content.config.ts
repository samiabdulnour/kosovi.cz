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
      // Category slug from src/config/lines.ts. A few old products have none.
      category: z.string().optional(),
      // Old shop subcategory slug (size or shape, e.g. "velky", "mini").
      subcategory: z.string().optional(),
      // Per-product override. Empty means the line default from lines.ts.
      makers: z
        .object({
          thrownBy: z.literal('martin').optional(),
          paintedBy: z.literal('daniela').optional(),
        })
        .default({}),
      // CZK. null means "cena na dotaz".
      price: z.number().nullable(),
      // null: in stock, but the old shop did not track the quantity.
      stock: z.number().int().nullable(),
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
      // Choices the customer makes, e.g. eye colour on Daniela's hangers.
      options: z.array(z.object({ name: z.string(), values: z.array(z.string()) })).optional(),
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
    oldUrl: z.url().optional(),
  }),
});

export const collections = { products, pages };
