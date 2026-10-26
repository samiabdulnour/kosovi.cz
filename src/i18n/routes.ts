import type { Lang } from './ui';

// Every page that exists in both languages, or only in Czech for now.
// Czech paths keep the old WordPress URLs where the page still exists.
export const routes = {
  home: { cs: '/', en: '/en/' },
  collections: { cs: '/kolekce/', en: '/en/collections/' },
  martin: { cs: '/martin-kos/', en: '/en/martin-kos/' },
  daniela: { cs: '/daniela-kosova/', en: '/en/daniela-kosova/' },
  process: { cs: '/jak-vznika/', en: '/en/how-its-made/' },
  about: { cs: '/o-nas/', en: '/en/about/' },
  courses: { cs: '/kurzy/' },
  contact: { cs: '/kontakt/', en: '/en/contact/' },
  cart: { cs: '/kosik/' },
  orderSent: { cs: '/objednavka-odeslana/' },
  terms: { cs: '/obchodni-podminky/' },
  privacy: { cs: '/ochrana-osobnich-udaju/' },
  returns: { cs: '/reklamace-a-odstoupeni/' },
  structure: { cs: '/struktura/' },
} as const satisfies Record<string, { cs: string; en?: string }>;

export type RouteKey = keyof typeof routes;

/** Paths of one page in each language, without the base path. */
export type Alternates = Partial<Record<Lang, string>>;

export function alternatesOf(key: RouteKey): Alternates {
  return routes[key];
}

/** Path of a page in the given language, falling back to Czech. */
export function pathOf(key: RouteKey, lang: Lang): string {
  const route: Alternates = routes[key];
  return route[lang] ?? route.cs ?? '/';
}

export function collectionPath(lineSlug: string, lang: Lang, category?: string): string {
  const root = pathOf('collections', lang);
  return category ? `${root}${lineSlug}/${category}/` : `${root}${lineSlug}/`;
}

export function productPath(slug: string): string {
  return `/produkt/${slug}/`;
}
