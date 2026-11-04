/**
 * One-off migration from the old WordPress/WooCommerce site (phase 2).
 *
 *   npm run import              convert scripts/data into src/content (offline)
 *   npm run import -- --fetch   download fresh JSON and images first
 *
 * The old site is read-only for us: only public GET requests, never a login.
 * Text is imported as-is. Unknown values stay empty, nothing is guessed.
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

const OLD_SITE = 'https://kosovi.cz';
const ROOT = new URL('..', import.meta.url).pathname;
const DATA = join(ROOT, 'scripts/data');
const PRODUCTS_DIR = join(ROOT, 'src/content/products');
const PAGES_DIR = join(ROOT, 'src/content/pages');
const PRODUCT_IMAGES = join(ROOT, 'src/assets/products');
const PAGE_IMAGES = join(ROOT, 'src/assets/pages');

// Old top-level shop categories become the three lines.
const LINES: Record<string, 'spolecna' | 'martin' | 'daniela'> = {
  'modrobily-porcelan': 'spolecna',
  martin: 'martin',
  daniela: 'daniela',
};

// Old category slugs that differ from the new ones in src/config/lines.ts.
const CATEGORY_SLUGS: Record<string, string> = {
  cukrenka: 'cukrenky',
  mlicenka: 'mlicenky',
};

// Pages with content. Shop system pages and the WordPress sample page are skipped.
const CONTENT_PAGES = ['modrobily-porcelan', 'o-nas', 'martin-kos', 'daniela-kosova', 'ochrana-osobnich-udaju'];

const OLD_COUNTS = { spolecna: 294, martin: 37, daniela: 85 };

// --- WooCommerce Store API types (only the fields we use) ---

interface WcImage {
  id: number;
  src: string;
  alt: string;
}

interface WcCategoryRef {
  id: number;
  slug: string;
}

interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  prices: { price: string; currency_minor_unit: number };
  images: WcImage[];
  categories: WcCategoryRef[];
  attributes: { name: string; terms?: { name: string }[] }[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  add_to_cart: { maximum: number };
}

interface WcCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
}

interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
}

// Old image URL to the local files that hold it (a photo can serve several products).
type ImageManifest = Record<string, string[]>;

// --- helpers ---

function log(message: string): void {
  console.log(message);
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8')) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function getJson(url: string): Promise<{ data: unknown; totalPages: number }> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { data: await res.json(), totalPages: Number(res.headers.get('x-wp-totalpages') ?? 1) };
}

async function download(url: string, file: string): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      // new URL() percent-encodes Czech characters in file names.
      const res = await fetch(new URL(url).href);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (error) {
      if (attempt >= 3) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function inBatches<T>(items: T[], size: number, fn: (item: T) => Promise<void>): Promise<void> {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn));
  }
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** WooCommerce HTML to plain text, keeping line and paragraph breaks. */
function htmlToText(html: string): string {
  // Raw newlines in HTML are just whitespace; <br> and <p> carry the breaks.
  const text = html
    .replace(/\s*\r?\n\s*/g, ' ')
    .replace(/\s*<br\s*\/?>\s*/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/?(p|div)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return decodeEntities(text)
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Page builder HTML (Tatsu) to Markdown: headings, paragraphs, lists, links, images. */
function htmlToMarkdown(html: string, imageFor: (url: string) => string | undefined): string {
  let s = html
    .replace(/\s*\r?\n\s*/g, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /(?:data-src|src)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (!src || src.startsWith('data:')) return '';
    const local = imageFor(src);
    return local ? `\n\n![](${local})\n\n` : '';
  });
  s = s
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, inner: string) => `\n\n${'#'.repeat(Number(level))} ${inner}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner: string) => `\n- ${inner.trim()}`)
    .replace(/<\/?(ul|ol)[^>]*>/gi, '\n\n')
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t: string, inner: string) => (inner.trim() ? `**${inner.trim()}**` : ''))
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t: string, inner: string) => (inner.trim() ? `*${inner.trim()}*` : ''))
    .replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, inner: string) => {
      const label = inner.replace(/<[^>]+>/g, '').trim();
      // Lightbox links around images keep just the image.
      if (!label || label.startsWith('![')) return inner;
      // A heading inside a link becomes a heading with a link.
      const heading = /^(#{1,6})\s+([\s\S]*)$/.exec(label);
      if (heading?.[1] && heading[2]) return `\n\n${heading[1]} [${heading[2].trim()}](${href})\n\n`;
      return `[${label}](${href})`;
    })
    .replace(/\s*<br\s*\/?>\s*/gi, '  \n')
    .replace(/<hr\b[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '');
  return decodeEntities(s)
    .split('\n')
    .map((line) => line.replace(/[ \t ]+$/u, (m) => (m === '  ' ? m : '')).replace(/^[ \t]+/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** YAML for frontmatter: JSON-style double-quoted strings are valid YAML. */
function yamlValue(value: unknown, indent: string): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const entries = Object.entries(item).filter(([, v]) => v !== undefined);
          return entries
            .map(([k, v], i) => `${i === 0 ? `\n${indent}- ` : `${indent}  `}${k}:${pad(yamlValue(v, `${indent}    `))}`)
            .join('\n');
        }
        return `\n${indent}- ${yamlValue(item, `${indent}  `)}`;
      })
      .join('');
  }
  const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '{}';
  return entries.map(([k, v]) => `\n${indent}${k}:${pad(yamlValue(v, `${indent}  `))}`).join('');
}

/** Space after the colon, except before a nested block. */
function pad(value: string): string {
  return value.startsWith('\n') ? value : ` ${value}`;
}

function frontmatter(data: Record<string, unknown>, block?: { key: string; text: string }): string {
  const lines = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}:${pad(yamlValue(v, '  '))}`);
  if (block?.text) {
    // Literal block keeps the old line breaks and stays easy to edit by hand.
    lines.push(`${block.key}: |-\n${block.text.split('\n').map((l) => (l ? `  ${l}` : '')).join('\n')}`);
  }
  return `---\n${lines.join('\n')}\n---\n`;
}

function parseNumber(raw: string): number {
  return Number(raw.replace(',', '.'));
}

/**
 * Dimensions only from lines that state exactly one value ("Výška cca 9cm").
 * Ranges, multi-piece sets and "Rozměr 20 x 30 cm" stay in the description only.
 */
function parseDimensions(text: string): { heightCm?: number; diameterCm?: number; volumeMl?: number } | undefined {
  const found: Record<string, number[]> = { heightCm: [], diameterCm: [], volumeMl: [] };
  for (const raw of text.split('\n')) {
    const line = raw.trim().toLowerCase();
    let m = /^výška\s+(?:cca\s+)?(\d+(?:[.,]\d+)?)\s*cm\.?$/u.exec(line);
    if (m?.[1]) found.heightCm?.push(parseNumber(m[1]));
    m = /^průměr\s+(?:cca\s+)?(\d+(?:[.,]\d+)?)\s*cm\.?$/u.exec(line);
    if (m?.[1]) found.diameterCm?.push(parseNumber(m[1]));
    m = /^obsah\s+(?:cca\s+)?(\d+(?:[.,]\d+)?)\s*(ml|l)\.?$/u.exec(line);
    if (m?.[1]) found.volumeMl?.push(Math.round(parseNumber(m[1]) * (m[2] === 'l' ? 1000 : 1)));
  }
  const dims: Record<string, number> = {};
  for (const [key, values] of Object.entries(found)) {
    if (values.length === 1 && values[0] !== undefined) dims[key] = values[0];
  }
  return Object.keys(dims).length ? dims : undefined;
}

// --- fetch ---

async function fetchAll(): Promise<void> {
  log('Stahuji produkty…');
  const first = await getJson(`${OLD_SITE}/wp-json/wc/store/v1/products?per_page=100&page=1`);
  await writeJson(join(DATA, 'products-1.json'), first.data);
  for (let page = 2; page <= first.totalPages; page++) {
    const { data } = await getJson(`${OLD_SITE}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    await writeJson(join(DATA, `products-${page}.json`), data);
  }

  log('Stahuji kategorie a stránky…');
  const categories = await getJson(`${OLD_SITE}/wp-json/wc/store/v1/products/categories?per_page=100`);
  await writeJson(join(DATA, 'categories.json'), categories.data);
  const pages = await getJson(`${OLD_SITE}/wp-json/wp/v2/pages?per_page=100`);
  await writeJson(join(DATA, 'pages.json'), pages.data);

  const manifest: ImageManifest = existsSync(join(DATA, 'images.json'))
    ? await readJson<ImageManifest>(join(DATA, 'images.json'))
    : {};
  const jobs: { url: string; file: string }[] = [];

  for (const product of await loadProducts()) {
    product.images.forEach((image, i) => {
      jobs.push({ url: image.src, file: productImagePath(product.slug, i, image.src) });
    });
  }
  for (const page of await loadPages()) {
    pageImageUrls(page).forEach((url, i) => {
      jobs.push({ url, file: pageImagePath(page.slug, i, url) });
    });
  }

  log(`Stahuji obrázky (${jobs.length})…`);
  let done = 0;
  await inBatches(jobs, 6, async ({ url, file }) => {
    if (!existsSync(file)) await download(url, file);
    const local = file.slice(ROOT.length);
    manifest[url] = [...new Set([...(manifest[url] ?? []), local])].sort();
    done++;
    if (done % 100 === 0) log(`  ${done}/${jobs.length}`);
  });
  await writeJson(join(DATA, 'images.json'), Object.fromEntries(Object.entries(manifest).sort()));
}

/** Each product owns its folder, even when the old shop reused a photo. */
function productImagePath(slug: string, index: number, url: string): string {
  return join(PRODUCT_IMAGES, slug, `${String(index + 1).padStart(2, '0')}${imageExt(url)}`);
}

function pageImagePath(slug: string, index: number, url: string): string {
  return join(PAGE_IMAGES, slug, `${String(index + 1).padStart(2, '0')}${imageExt(url)}`);
}

function imageExt(url: string): string {
  const ext = extname(new URL(url).pathname).toLowerCase();
  return ext === '.jpeg' ? '.jpg' : ext || '.jpg';
}

/** Full-size images on content pages: lightbox links first, then <img> sources. */
function pageImageUrls(page: WpPage): string[] {
  const html = page.content.rendered.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  const urls: string[] = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = /(?:data-src|src)\s*=\s*["']([^"']+)["']/i.exec(m[0])?.[1];
    if (src && src.startsWith(`${OLD_SITE}/wp-content/uploads/`) && !urls.includes(src)) urls.push(src);
  }
  return urls;
}

// --- convert ---

async function loadProducts(): Promise<WcProduct[]> {
  const files = (await readdir(DATA)).filter((f) => /^products-\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(9)) - parseInt(b.slice(9)));
  const products: WcProduct[] = [];
  for (const file of files) products.push(...(await readJson<WcProduct[]>(join(DATA, file))));
  return products;
}

async function loadPages(): Promise<WpPage[]> {
  const pages = await readJson<WpPage[]>(join(DATA, 'pages.json'));
  return pages.filter((p) => CONTENT_PAGES.includes(p.slug));
}

async function clean(dir: string, keep: (name: string) => boolean): Promise<void> {
  await mkdir(dir, { recursive: true });
  for (const name of await readdir(dir)) {
    if (!keep(name)) await rm(join(dir, name), { recursive: true, force: true });
  }
}

interface Report {
  perLine: Record<string, number>;
  perCategory: Record<string, number>;
  noImages: string[];
  noDescription: string[];
  uncategorized: string[];
  priceOnRequest: string[];
  withOptions: string[];
  outOfStock: number;
  backorder: string[];
  stockTracked: number;
  stockUntracked: number;
  placeholderText: string[];
  oneImage: number;
  dimensions: { height: number; diameter: number; volume: number };
  firing1400: number;
  missingImageFiles: string[];
  scaledImages: number;
  pages: string[];
}

async function convert(): Promise<Report> {
  const products = await loadProducts();
  const categories = await readJson<WcCategory[]>(join(DATA, 'categories.json'));
  const byId = new Map(categories.map((c) => [c.id, c]));

  const depth = (id: number): number => {
    let n = 0;
    let c = byId.get(id);
    while (c && c.parent) {
      c = byId.get(c.parent);
      n++;
    }
    return n;
  };
  const ancestorAt = (id: number, level: number): WcCategory | undefined => {
    let c = byId.get(id);
    while (c && depth(c.id) > level) c = byId.get(c.parent);
    return c && depth(c.id) === level ? c : undefined;
  };

  const report: Report = {
    perLine: {},
    perCategory: {},
    noImages: [],
    noDescription: [],
    uncategorized: [],
    priceOnRequest: [],
    withOptions: [],
    outOfStock: 0,
    backorder: [],
    stockTracked: 0,
    stockUntracked: 0,
    placeholderText: [],
    oneImage: 0,
    dimensions: { height: 0, diameter: 0, volume: 0 },
    firing1400: 0,
    missingImageFiles: [],
    scaledImages: 0,
    pages: [],
  };

  await clean(PRODUCTS_DIR, (name) => name === '.gitkeep');

  for (const p of products) {
    const ids = p.categories.map((c) => c.id);
    const topSlug = ids.map((id) => ancestorAt(id, 0)?.slug).find((s): s is string => Boolean(s && LINES[s]));
    if (!topSlug) throw new Error(`No line for ${p.slug}`);
    const line = LINES[topSlug];
    if (!line) throw new Error(`Unknown line ${topSlug}`);
    const level1 = ids.map((id) => ancestorAt(id, 1)).find(Boolean);
    const level2 = ids.map((id) => byId.get(id)).find((c) => c && depth(c.id) === 2);
    const category = level1 ? (CATEGORY_SLUGS[level1.slug] ?? level1.slug) : undefined;

    const price = Number(p.prices.price) / 10 ** p.prices.currency_minor_unit;
    const priceOrNull = price === 0 && !p.is_purchasable ? null : price;

    // Store API exposes the quantity only when stock is managed (maximum < 9999).
    let stock: number | null;
    if (!p.is_in_stock) stock = 0;
    else if (p.add_to_cart.maximum < 9999) stock = p.add_to_cart.maximum;
    else stock = null;

    const short = htmlToText(p.short_description);
    const long = htmlToText(p.description);
    const description = [short, long].filter(Boolean).join('\n\n');
    const title = decodeEntities(p.name).trim();

    const images: { src: string; alt: string }[] = [];
    p.images.forEach((image, i) => {
      const file = productImagePath(p.slug, i, image.src);
      if (!existsSync(file)) {
        report.missingImageFiles.push(image.src);
        return;
      }
      const local = file.slice(ROOT.length);
      if (image.src.includes('-scaled.')) report.scaledImages++;
      // Old alt texts are all empty, so the product title stands in.
      const alt = decodeEntities(image.alt).trim() || (i === 0 ? title : `${title}, foto ${i + 1}`);
      images.push({ src: `../../${local.replace(/^src\//, '')}`, alt });
    });

    const options = p.attributes
      .filter((a) => a.terms && a.terms.length > 0)
      .map((a) => ({ name: decodeEntities(a.name), values: (a.terms ?? []).map((t) => decodeEntities(t.name)) }));

    const dimensions = parseDimensions(short);

    const data: Record<string, unknown> = {
      title,
      slug: p.slug,
      line,
      category,
      subcategory: level2?.slug,
      // Who made it: per-product override. Empty means the line default applies
      // (src/config/lines.ts). Never guess.
      makers: {},
      price: priceOrNull,
      stock,
      featured: false,
      catalogNo: p.sku || undefined,
      dimensions,
      images,
      options: options.length ? options : undefined,
      oldUrl: p.permalink,
    };
    await writeFile(join(PRODUCTS_DIR, `${p.slug}.md`), frontmatter(data, { key: 'description', text: description }));

    // report
    report.perLine[line] = (report.perLine[line] ?? 0) + 1;
    const catKey = `${line}/${category ?? '(bez kategorie)'}`;
    report.perCategory[catKey] = (report.perCategory[catKey] ?? 0) + 1;
    if (images.length === 0) report.noImages.push(p.slug);
    if (images.length === 1) report.oneImage++;
    if (!description) report.noDescription.push(p.slug);
    if (!category) report.uncategorized.push(p.slug);
    if (priceOrNull === null) report.priceOnRequest.push(p.slug);
    if (options.length) report.withOptions.push(p.slug);
    if (stock === 0) report.outOfStock++;
    if (p.is_on_backorder) report.backorder.push(p.slug);
    if (stock === null) report.stockUntracked++;
    else report.stockTracked++;
    if (/Zde krátký popis|Detailní popis výrobku/.test(description)) report.placeholderText.push(p.slug);
    if (dimensions?.heightCm !== undefined) report.dimensions.height++;
    if (dimensions?.diameterCm !== undefined) report.dimensions.diameter++;
    if (dimensions?.volumeMl !== undefined) report.dimensions.volume++;
    if (/1400\s*°C/.test(description)) report.firing1400++;
  }

  await clean(PAGES_DIR, (name) => name === '.gitkeep');
  for (const page of await loadPages()) {
    const title = decodeEntities(page.title.rendered).trim();
    const urls = pageImageUrls(page);
    const body = htmlToMarkdown(page.content.rendered, (url) => {
      const index = urls.indexOf(url);
      const file = index >= 0 ? pageImagePath(page.slug, index, url) : undefined;
      return file && existsSync(file) ? `../../${file.slice(ROOT.length).replace(/^src\//, '')}` : undefined;
    });
    const fm = frontmatter({ title, lang: 'cs', oldUrl: page.link });
    await writeFile(join(PAGES_DIR, `${page.slug}.cs.md`), `${fm}\n${body}\n`);
    report.pages.push(page.slug);
  }

  return report;
}

function renderReport(r: Report, total: number): string {
  const list = (items: string[]) => (items.length ? items.map((s) => `\`${s}\``).join(', ') : 'žádné');
  const lineNames: Record<string, string> = { spolecna: 'Modrobílý porcelán', martin: 'Martin', daniela: 'Daniela' };
  const lines = Object.entries(OLD_COUNTS)
    .map(([key, old]) => `| ${lineNames[key]} | ${r.perLine[key] ?? 0} | ${old} |`)
    .join('\n');
  const cats = Object.entries(r.perCategory)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, n]) => `| ${key} | ${n} |`)
    .join('\n');
  return `# Import ze starého webu

Vygenerováno skriptem \`scripts/import-wp.ts\`. Zdroj: veřejné Store API WooCommerce a WordPress REST API na kosovi.cz.

## Počty

Celkem ${total} produktů.

| Řada | Import | Starý e-shop |
|---|---|---|
${lines}

| Řada / kategorie | Produktů |
|---|---|
${cats}

## Mezery v datech

- Bez fotografie (${r.noImages.length}): ${list(r.noImages)}
- Jen jedna fotografie: ${r.oneImage} produktů. Stránka produktu počítá se 4–6 záběry, takže je potřeba nové focení.
- Bez popisu (${r.noDescription.length}): ${list(r.noDescription)}
- Bez kategorie (${r.uncategorized.length}): ${list(r.uncategorized)}
- Rozměry převzaté z popisu (jen řádky s jednou hodnotou, např. „Výška cca 9cm“): výška ${r.dimensions.height}, průměr ${r.dimensions.diameter}, objem ${r.dimensions.volume}. Rozsahy, sady a „Rozměr 20 x 30 cm“ zůstaly jen v textu popisu.
- Technika a péče (myčka, mikrovlnka) nejsou u produktů uvedené, pole zůstala prázdná.
- Kdo kus vyrobil: v datech prázdné, platí výchozí autoři řady v \`src/config/lines.ts\`.

## Neobvyklé

- Zástupný text z WordPressu v popisu (${r.placeholderText.length}): ${list(r.placeholderText)} („Zde krátký popis produktu“, „Detailní popis výrobku“). Importováno beze změny.
- Cena 0 Kč a nejde koupit, importováno jako „cena na dotaz“ (${r.priceOnRequest.length}): ${list(r.priceOnRequest)}
- Produkty s volbou varianty, např. barva očí (${r.withOptions.length}): ${list(r.withOptions)}. Uloženo v poli \`options\`, košík s tím musí počítat (fáze 5).
- Sklad: ${r.stockTracked} produktů má evidované množství (z toho ${r.outOfStock} vyprodaných), ${r.stockUntracked} je skladem bez evidence množství (\`stock: null\`). Na objednávku (backorder): ${list(r.backorder)}
- ${r.firing1400} popisů uvádí výpal „2x při 1400°C“, stránka O nás uvádí „až 1380 °C“. Které číslo platí?
- Kategorie „PODŠÁLKY A ODKÁDÁTKA“ má v názvu překlep, na novém webu „Podšálky a odkládátka“.
- ${r.scaledImages} fotografií WordPress při nahrání zmenšil na 2560 px (soubory „-scaled“). Importovaná je tato verze, pro web stačí. Originály (asi 150 MB) se dají stáhnout dodatečně.
- Stránky: importováno ${r.pages.length} (${list(r.pages)}). Systémové stránky e-shopu a ukázková stránka WordPressu vynechány. Samostatná stránka s obchodními podmínkami na starém webu není, „Zásady ochrany osobních údajů“ obsahují i podmínky prodeje.
- Text stránky O nás obsahuje výrazy, které nová pravidla pro texty zakazují („unikátní“, „100% originál“, „nejkvalitnější“). Je importovaný beze změny jako podklad, finální text vznikne ve fázi 4.
${r.missingImageFiles.length ? `- Chybějící soubory obrázků (${r.missingImageFiles.length}), spusťte import s --fetch.\n` : ''}`;
}

const shouldFetch = process.argv.includes('--fetch');
if (shouldFetch || !existsSync(join(DATA, 'products-1.json'))) await fetchAll();
const report = await convert();
const total = Object.values(report.perLine).reduce((a, b) => a + b, 0);
const markdown = renderReport(report, total);
await writeFile(join(DATA, 'import-report.md'), markdown);
log(markdown);
