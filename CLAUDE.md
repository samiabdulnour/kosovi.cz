# kosovi.cz

New website for **Daniela a Martin Kosovi**, a porcelain studio in Prague. It replaces the 2020 WordPress/WooCommerce site at kosovi.cz (hosted on Wedos). Online sales are very low. The redesign has one job above all: present the two of them as a creator duo and make their work easy to understand and order.

The owner of this repo is Sami (architect, iOS developer). He makes the design and content decisions. Ask him whenever a fact, price or decision is missing.

**Talk to Sami in Czech.**

## The core idea

Two trained artists, one studio. Martin Kos is the craftsman of the two (potter, ceramics school in Bechyně), Daniela Kosová studied at UMPRUM. **They founded the brand in 1995 with the blue-and-white porcelain**, which is what people know them for: it has its own clientele and still sells. For several years Martin threw the pieces and Daniela painted them. **In recent years Martin makes all of it himself**, and Daniela works on her own art. Martin is also turning more to his own art. (Source: Sami, October 2026.)

- The site presents mainly the blue-and-white porcelain, then the art of both of them.
- The homepage leads with the two of them and the blue-and-white porcelain, not with a product grid.
- Daniela's art (decors, design, paintings, tiles, sculpture) is poorly presented on the old site; give it a proper gallery-level presentation. Martin's own work (tea sets, teapots, vases, mugs with relief decoration) the same way, with "cena na dotaz" where a price is not set.
- Every product says who made it.
- Lead with 12 to 20 signature pieces. The full catalogue (about 416 items) sits behind them.

## Stack

- **Astro** (current stable, pinned), static output, TypeScript strict. Node 24 LTS (`.node-version`).
- Content collections in `src/content/` with zod schemas.
- `astro:assets` `<Image>` for all imagery. Never ship raw originals.
- Plain CSS with custom properties. No CSS framework, no UI framework unless a feature truly needs one. The cart is a small vanilla TS island.
- **Hosting: Cloudflare Pages**, a preview URL per branch. One Pages Function for orders. If Cloudflare now recommends Workers static assets over Pages for Astro, say so and propose the switch before doing it. (It does, as of 2026. Proposed to Sami, not switched. `wrangler.toml` is ready but not connected.)
- **Previews until Cloudflare is connected: GitHub Pages.** `main` deploys to `https://samiabdulnour.github.io/kosovi.cz/`, every pull request to `.../pr-preview/pr-<n>/` with the link in a PR comment (`.github/workflows/preview-*.yml`, branch `gh-pages`). The build reads `SITE_URL`, `BASE_PATH` and `PUBLIC_PREVIEW_LABEL`, so every internal link goes through `withBase()` from `src/i18n/utils.ts`. Previews get `noindex`.
- **Email: Resend**, called from the function.
- **Analytics: Cloudflare Web Analytics** (cookieless). No third-party trackers, so no cookie banner.
- Spam protection on forms: honeypot field plus Cloudflare Turnstile.

## Target layout

```
src/
  content/
    products/          # one file per product
    pages/             # long-form page copy (cs + en)
  assets/products/     # imported images, one folder per product slug
  components/
    wire/              # preview-only placeholders and notes, removed before launch
  layouts/
  pages/               # routes, see "Pages" below (thin, they render views)
  views/               # page bodies shared by cs and en routes
  lib/                 # products helpers, Czech typography (cz, formatCzk)
  config/              # shipping.ts, order.ts, site.ts, lines.ts, facts.ts
  i18n/                # UI strings cs/en, route map cs/en
functions/api/order.ts # order endpoint
scripts/import-wp.ts   # one-off migration from the old site
scripts/data/          # raw JSON dump from the old site (committed)
public/_redirects
TODO.md                # open questions and missing facts
```

## Commands

```
npm run dev            # Astro dev server
npm run build          # must pass before every commit
npx astro check        # type check (also npm run check)
npm run import         # runs scripts/import-wp.ts offline from scripts/data
npm run import -- --fetch  # downloads fresh JSON and images from the old site first
npx wrangler pages dev # local run with the order function
```

## Phases

Work one phase at a time, on its own branch. Stop at the end of each phase and summarise what was done and what is missing.

1. **Scaffold.** Astro project, Cloudflare config, base layout, CSS tokens placeholder, i18n setup (cs default at `/`, en at `/en/`).
2. **Import the old content** (details below).
3. **Design plan.** Done by Sami: `docs/design/kosovi_navrh_01.pdf` (see "Design direction"), applied to the preview in October 2026.
4. **Pages and product templates.**
5. **Cart and order flow.**
6. **English version** of the core pages.
7. **Redirects, SEO, launch checklist.**

## Phase 2: import from the old site

The old site is read-only for us. Never log in, never write to it.

- Products via the public WooCommerce Store API: `https://kosovi.cz/wp-json/wc/store/v1/products?per_page=100&page=N` (names, prices, categories, images, stock, permalinks).
- Pages via `https://kosovi.cz/wp-json/wp/v2/pages` (O nás, legal pages).
- If the Store API is disabled, report back before falling back to HTML scraping.
- Save the raw responses to `scripts/data/` so the import is reproducible offline.
- Download original-size images into `src/assets/products/<slug>/`.
- Write one content file per product. Store the old permalink in `oldUrl`.
- Import text as-is. Do not rewrite, translate or "improve" anything during import.
- Finish with a report: product counts per line and category, products missing images, products with no description (expected: almost all), anything odd.

Old shop counts for sanity checks: 294 modrobílý porcelán, 37 Martin, 85 Daniela.

**Done (phase 2).** The Store API works; the import matched all counts. Report in `scripts/data/import-report.md`. Images are the largest size WordPress serves; 48 of them WordPress had scaled to 2560 px on upload, the camera originals (about 150 MB) were not downloaded. Each product owns `src/assets/products/<slug>/01.jpg…`, even where the old shop reused a photo, so swapping a photo touches one product only. Re-running the import overwrites `src/content/products/`, so after hand edits start (featured, makers, fixes) stop re-running it or teach it to keep them.

## Product schema

```
title: string
slug: string                 # keep the old slug
line: "spolecna" | "martin" | "daniela"
category?: string            # see categories below; 2 old products have none
subcategory?: string         # old shop subcategory slug (size, shape)
makers: { thrownBy?: "martin", paintedBy?: "daniela" }  # per-product override; empty = line default in src/config/lines.ts
price: number | null         # CZK; null = "cena na dotaz"
stock: number | null         # null = in stock, quantity not tracked by the old shop
featured: boolean            # signature pieces, Sami picks them
catalogNo?: string
dimensions?: { heightCm?: number, diameterCm?: number, volumeMl?: number }
technique?: string
care?: { dishwasher?: boolean, microwave?: boolean }
images: { src: image, alt: string }[]
options?: { name: string, values: string[] }[]  # customer choices, e.g. eye colour
description?: string
oldUrl?: string
```

Unknown values stay empty. Never guess dimensions, volumes, techniques or makers. List the gaps in `TODO.md`.

Old categories. Modrobílý porcelán: hrnky, podšálky, talíře, misky, mísy, konvice rovné, konvice kulaté, cukřenky, mlíčenky, bábovky, panáky. Martin: čajové soupravy, konve solitéry, vázy, hrnky s plastickým dekorem. Daniela: dekory, design, obrázky, obklady.

## Pages (Czech first)

Keep old URLs wherever the page still exists, so fewer redirects are needed.

| Route | Content |
|---|---|
| `/` | Looping photo strip, the claim, four blue-and-white pieces (open in the e-shop), Daniela and Martin (open their pages) |
| `/kolekce/`, `/kolekce/<line>/`, `/kolekce/<line>/<entry>/`, `…/<n>/` | E-shop. "E-shop" in the menu opens the blue-and-white line. Category menu in four columns from the design, mapped onto the old shop data in `src/config/lines.ts`; twelve products a page. Line slugs: `modrobily-porcelan`, `martin-kos`, `daniela-kosova` |
| `/produkt/<slug>/` | Product page (same URL as the old site) |
| `/martin-kos/`, `/daniela-kosova/` | Artist pages: two fields, "Volné" (`…/volna-tvorba/`, their own art) and "Užité" (their part of the e-shop). Old URLs |
| `/o-nas/` | The couple, the blue-and-white porcelain, the porcelain's technical qualities, both biographies with a CV. (Replaces the former `/jak-vznika/` page.) |
| `/kurzy/` | Courses on request, gift voucher |
| `/kontakt/` | Contact, workshop visits if Sami confirms they are possible |
| `/kosik/` | Cart and order form (old URL) |
| `/objednavka-odeslana/` | Confirmation |
| `/obchodni-podminky/`, `/ochrana-osobnich-udaju/`, `/reklamace-a-odstoupeni/` | Legal. Sami supplies or approves the text |

English at `/en/...` for home, e-shop listings, artist pages, about, contact. Product pages in English can come later.

**Product page must show:** who made it ("Točil Martin, malovala Daniela"), price or "cena na dotaz", size and volume, technique, care (dishwasher, microwave), a note that every piece is handmade and varies slightly, 4 to 6 large zoomable images including a scale shot and a detail of the painting, related pieces from the same set.

## Order flow (no online payment)

The studio has no card payments. Customers send an order, the studio confirms it, the customer pays by bank transfer (or on delivery if offered).

- Cart in `localStorage`. Order form: name, email, phone, address, shipping method, note, agreement to the terms.
- `POST /api/order`:
  - validate input, check Turnstile and honeypot
  - recompute every price server-side from product data generated at build time; never trust prices from the browser
  - create a numeric order number usable as variabilní symbol (counter in a KV namespace `ORDERS`), and store the order in KV as a backup
  - email the studio (`ORDER_TO_EMAIL`) and the customer
- `config/order.ts` has `ORDER_MODE: "request" | "binding"`. **Sami has not decided yet.**
  - `request`: button "Odeslat nezávaznou objednávku". Customer email says the studio will confirm availability and send payment details.
  - `binding`: the button must clearly state the obligation to pay (Czech consumer law). Customer email includes bank details, VS, and a QR Platba code (SPAYD format) as a PNG attachment, since Gmail does not render SVG. Check that the QR library works in the Workers runtime.
- Shipping methods and prices in `config/shipping.ts`: osobní odběr, Česká pošta, Zásilkovna (Packeta widget). All values are TODO until Sami confirms.
- Secrets only as environment variables: `RESEND_API_KEY`, `ORDER_TO_EMAIL`, `BANK_IBAN`, Turnstile keys. Never commit them. Resend needs DNS records on kosovi.cz, which waits for DNS access.

## Copy rules (Czech)

If `.claude/skills/propagace/` exists, follow it for every piece of public copy. In short:

- Describe, don't praise. Facts persuade: technique, material, temperature, who made it.
- Banned: "unikátní", "jedinečný", "100% originál", "nejkvalitnější", "špičkový", any superlative or sales cliché.
- No em dashes. Commas and full stops. No exclamation marks. No emoji.
- Vykání when addressing customers.
- **Homepage claim (Sami's decision):** abstract, not technical, measured praise is allowed there. It carries three things: the blue-and-white porcelain, the art of both, and handmade work with decades of experience behind it. The banned-words list still applies.
- **Never invent facts.** Use only the source facts below. Where something is missing, write `TODO(fakta): what is needed` and add it to `TODO.md`.
- Czech typography: „uvozovky“, a non-breaking space after one-letter words (k, s, v, z, o, u, a, i) and between number and unit (`4 000 Kč`, `1 380 °C`), a non-breaking space as thousands separator, an en dash for ranges.
- UI microcopy: plain verbs, sentence case, buttons say exactly what happens.

## Source facts

From the current O nás page. These are the only facts copy may use.

**Porcelain:** thrown on the potter's wheel, which is unusual for porcelain. Fired up to 1380 °C. Blue-and-white pieces decorated with cobalt, under the glaze or in the glaze, fired together with the porcelain, so the decoration does not wear off. Dishwasher and microwave safe.

**Martin Kos:** born 1959 in Hradec Králové. Both parents were ceramicists. Apprenticed as a potter in Týniště nad Orlicí. Graduated from the ceramics school in Bechyně, as did his parents and his grandfather. Worked at ÚVD Keramo Praha, independent since 1987. Learned to throw porcelain and has worked only in porcelain for over 25 years.

**Daniela Kosová:** born in Bratislava. Studied ceramics at SUPŠ in Bratislava, then at UMPRUM in Prague. Trained in Andrej Rudavský's studio and in the porcelain factories in Dubí and Duchcov. Decorates underglaze (fired at 1390 °C), in-glaze (1250 °C) and overglaze including gilding (800 °C). Work in the collections of UPM Praha, Alšova jihočeská galerie, Slovenské centrum dizajnu in Bratislava, the museum in Darney (France), Porvoo (Finland), and private collections.

**Brand:** founded in 1995 with the blue-and-white porcelain. For several years Martin threw and Daniela painted; in recent years Martin makes it all. Both have worked in the visual arts for decades.

**Studio:** Na Vlčovce 6, 160 00 Praha 6. +420 607 635 393, +420 728 717 232, danielakosova@gmail.com. Courses in ceramics and porcelain on request.

**Third-party, confirm before use:** Galerie Svatoš describes Martin as a third-generation potter and mentions his thin-walled porcelain perforated with small holes, giving the translucent cups a lace pattern.

## Design direction

- **The design is `docs/design/kosovi_navrh_01.pdf`** (Sami, October 2026; the comments in it say where each block links). It overrides the earlier "avoid" list where they disagree.
  - Header (`docs/design/eshop.pdf`, on every page): "Porcelán Kosovi" on the left, "Daniela a Martin Kosovi" on the label line (30.2 % across, `--label-start`), the menu on the right: E-shop, O nás, Kurzy, Kontakt, Košík with a count badge. Light blue (`--color-shop-header`) with a rule under it in the e-shop (listings, products, cart). The page title sits under the header on the label line; the language switch is in the footer.
  - Everything in one size, bold, capitals (CSS `text-transform`, the source text stays in sentence case). Typeface: Inter ExtraBold (800), capitals with 0.04em tracking, self-hosted via `@fontsource/inter`.
  - Photographs sit on flat colour fields (`--field-*` in `src/styles/tokens.css`). Product tiles show the whole photo (`object-fit: contain`).
  - Homepage strip: `docs/design/pas.pdf`, rebuilt in HTML from the PDF's own positions (`src/config/band.ts`, photos in `src/assets/band/`). It loops at a steady pace and keeps moving under the pointer; only its button stops it (needed for accessibility), and it stands still for `prefers-reduced-motion`.
  - E-shop (`docs/design/eshop.pdf`): line name on the label line, the category menu, a rule across the page, then five products a row on 260 × 302 tiles, 26 a page with one large illustration (2 × 2, `src/config/shop.ts`), the yellow page bar. Captions in Inter Medium, grey `#4c4c4c`: the type in capitals with the price beside it, the decor in small letters, without "Porcelánový" (`src/lib/names.ts`, the data keeps the old titles).
- Subject: hand-thrown porcelain, cobalt on white, two makers. Photography carries the site.
- Avoid: cream background with terracotta accent, rounded SaaS cards with soft shadows, fade-up animation on every section.
- Product images large, zoomable, with a simple lightbox. **Never disable pinch zoom.** The old site did, which is especially bad for detailed painting.
- Quality floor: responsive down to 360 px, visible keyboard focus, `prefers-reduced-motion` respected, Czech alt text on every image, strong Lighthouse scores.
- Current photos are from 2020 and a new shoot is planned. Make swapping images trivial.

## Redirects and SEO

- `public/_redirects`, generated from the import data: `/kategorie-produktu/...` to the new collection URLs, `/daniela-a-martin-kosovi/` and `/modrobily-porcelan/` to `/kolekce/...`, `/kosik/` stays.
- `@astrojs/sitemap`, `hreflang` cs/en, a unique title and meta description per page (no "Archivy" suffix like the old site), OG images.
- JSON-LD: `Product` with `Offer` in CZK, `Person` for both makers, `Organization` for the studio.

## Working rules

- One branch per phase, small commits with clear messages. Ask before merging to `main`.
- `npm run build` and `npx astro check` must pass before committing.
- Pin dependency versions. Add a dependency only with a reason.
- Missing fact, price or decision: stop and ask, or leave a `TODO` and list it in `TODO.md`. Never fill gaps with plausible guesses.
- Keep this file current when a decision changes.

## Open questions (mirror in TODO.md)

- Blue-and-white product credit: Martin makes it all now, older pieces were painted by Daniela. Which credit should a product page show (src/config/lines.ts, default "Točil Martin, malovala Daniela")?
- Order mode: request or binding?
- Shipping methods, prices, pickup location. Do they use Zásilkovna?
- Which 12 to 20 pieces are the signature pieces?
- Will Daniela and Martin add products themselves? If yes, add a git-based CMS (Decap or Pages CMS) after launch.
- Can customers visit the workshop?
- Courses: format, length, price, gift voucher.
- Newsletter provider.
- Who holds access to the Wedos hosting, the domain and the WordPress admin?
