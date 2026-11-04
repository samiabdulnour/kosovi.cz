# kosovi.cz

New website for **Daniela a Martin Kosovi**, a porcelain studio in Prague. It replaces the 2020 WordPress/WooCommerce site at kosovi.cz (hosted on Wedos). Online sales are very low. The redesign has one job above all: present the two of them as a creator duo and make their work easy to understand and order.

The owner of this repo is Sami (architect, iOS developer). He makes the design and content decisions. Ask him whenever a fact, price or decision is missing.

**Talk to Sami in Czech.**

## The core idea

Two trained artists, one studio. Martin Kos is the craftsman of the two (potter, ceramics school in Bechyně), Daniela Kosová studied at UMPRUM. **They founded the brand in 1995 with the blue-and-white porcelain**, which is what people know them for: it has its own clientele and still sells. For several years Martin threw the pieces and Daniela painted them. **In recent years Martin makes all of it himself**, and Daniela works on her own art. Martin is also turning more to his own art. (Source: Sami, October 2026.)

- The site presents mainly the blue-and-white porcelain, then the art of both of them.
- The homepage leads with the two of them and the blue-and-white porcelain, not with a product grid.
- Daniela's art (decors, design, paintings, tiles, sculpture) is poorly presented on the old site; give it a proper gallery-level presentation. Martin's own work (tea sets, teapots, vases, mugs with relief decoration) the same way, with "cena na dotaz" where a price is not set.
- Every product says who made it: the line, the artist pages and the data (`makers`). The product page itself shows no maker credit (Sami, November 2026).
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
| `/kolekce/`, `/kolekce/<line>/`, `/kolekce/<line>/<entry>/`, `…/<n>/` | E-shop. "E-shop" in the menu opens the first tab (Hrnky) of the blue-and-white line. Its menu is tabs with a size chart (`docs/design/kosovi_eshop_2.pdf`); Martin's and Daniela's lines keep the category menu in four columns. Menus are mapped onto the old shop data in `src/config/lines.ts`; 26 products a page. Line slugs: `modrobily-porcelan`, `martin-kos`, `daniela-kosova` |
| `/produkt/<slug>/` | Product page (same URL as the old site) |
| `/martin-kos/`, `/daniela-kosova/` | Artist pages: two fields, "Volné" (`…/volna-tvorba/`, their own art) and "Užité" (their part of the e-shop). Old URLs |
| `/o-nas/` | The couple, the blue-and-white porcelain, the porcelain's technical qualities, both biographies with a CV. (Replaces the former `/jak-vznika/` page.) |
| `/kurzy/` | Courses on request, gift voucher |
| `/kontakt/` | Contact, workshop visits if Sami confirms they are possible |
| `/kosik/` | Cart and order form (old URL) |
| `/objednavka-odeslana/` | Confirmation |
| `/obchodni-podminky/`, `/ochrana-osobnich-udaju/`, `/reklamace-a-odstoupeni/` | Legal. Sami supplies or approves the text |

English at `/en/...` for home, e-shop listings, artist pages, about, contact. Product pages in English can come later.

**Product page must show:** price or "cena na dotaz", size and volume, technique, care (dishwasher, microwave), a note that every piece is handmade and varies slightly, 4 to 6 large zoomable images including a scale shot and a detail of the painting, related pieces from the same set.

**Product page layout:** `docs/design/kosovi_eshop_produkt.pdf` (Sami, November 2026), `src/views/ProductPage.astro`. Under the header the e-shop's tabs (`ShopTabs.astro`), then three columns: the kinds of the open tab (the product's kind underlined), the photos (531 × 501, whole photo, each links to a large version; where the photo's format leaves the box's sides empty, they carry the photo's own edge colours sampled at build time and the photo's edges fade into them, `src/lib/edges.ts`, until Sami extends the backdrops), and from 70.5 % across: name and price on one line, a short text in Clarendon, broken after its first sentence (`src/config/descriptions.ts` per kind; Sami's mug text, the others drafts from the source facts; Martin's and Daniela's pieces keep their old descriptions), no maker credit (Sami, November 2026), quantity and "Vložit do košíku" on light blue (`--color-shop-header`; asking by email where the price is on request or the piece is sold out), the kind's drawing turned like the photo on its floor with dotted 10 cm lines, the note on sizes, height (rounded like the chart, or the menu's own size), diameter and volume, a rule, the catalogue number. Under them five tiles (Sami, November 2026): "Ze stejné sady" is the same kind with a similar decor, a motif in common ("s andělem na kole" goes with "s bicykly", "s jízdním kolem" and "s andělem"); "Se stejným dekorem" is the same decor on other kinds, at least two tiles when there are, and no heading when the decor is on one piece only. Ostatní (bábovky, podšálky, panáky) and Martin's and Daniela's lines fill the rest with the tab's other pieces ("Ze sekce …"). Motifs: `decorMotifs` in `src/lib/names.ts` (synonyms such as kolo, bicykl, jízdní kolo). Until the order flow, the button stores `[{ slug, qty, options }]` in `localStorage` (`kosovi-cart`) and the header's badge shows the sum of pieces.

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
  - Header (`docs/design/eshop.pdf`, on every page): "Porcelán Kosovi" on the left, "Daniela a Martin Kosovi" on the label line (30.2 % across, `--label-start`), the menu on the right: E-shop, O nás, Kurzy, Kontakt, Košík with a count badge (as tall as the capitals, standing on the baseline). Light blue (`--color-shop-header`) in the e-shop (listings, products, cart), no rule under it. The page title sits under the header on the label line.
  - Everything in one size, bold, capitals (CSS `text-transform`, the source text stays in sentence case). Typeface: Inter ExtraBold (800), capitals with 0.04em tracking, self-hosted via `@fontsource/inter`. About 12.5 px on a 1512 px wide screen (`--step-0`).
  - Text in small letters in the e-shop (the decor under a photo, "vyprodáno", the note on sizes) is Clarendon Text Pro Regular (`kosovi_eshop_2.pdf`, `--font-serif`). Capitals stay Inter. Until Sami sends the font file (TTF, he will), Besley (`@fontsource/besley`, OFL, a Clarendon revival) stands in.
  - Photographs sit on flat colour fields (`--field-*` in `src/styles/tokens.css`). Product tiles fill with the edited portrait photos and show older ones whole (`object-fit: contain`).
  - Homepage strip: `docs/design/pas.pdf`, rebuilt in HTML from the PDF's own positions (`src/config/band.ts`, photos in `src/assets/band/`). It loops at a steady pace and keeps moving under the pointer; only its button stops it (needed for accessibility), and it stands still for `prefers-reduced-motion`.
  - E-shop menu of the blue-and-white line (`docs/design/kosovi_eshop_2.pdf`, Sami, November 2026): no page title, the tabs Hrnky, Talíře misky a mísy, Konvice, Cukřenky a mlíčenky, Ostatní, and under the open tab its kinds as line drawings to scale on a floor, with a ruler every 10 cm and the name and size under each (`src/components/ShopMenu.astro`). Drawings in `src/assets/silhouettes/` (viewBox in cm), made by `scripts/silhouettes/`: the mugs straight from the PDF (handle openings see-through, the espresso cup turned handle-left like the rest), the rest drawn in the same clean style with body profile, handle, spout, lid and rattan measured from the photos (rembg masks), sizes in cm from the product data. Each drawing and its label sit on the body's axis (`data-axis`); the chosen kind is filled `--color-select` (#3026b9) instead of underlined, and so is a kind under the pointer, while its inside (the opening of a cup, the top of a saucer, the espresso saucer; class `i`) turns `--color-select-inside` (#f1fde1). The size under a drawing is the height in the product data (the diameter where there is none), rounded to whole centimetres (Sami, November 2026); the espresso cup has no data and keeps the PDF's 6 cm; the shot glass shows "4–6 cm" and no diameter (Sami, November 2026; `size` in `src/config/lines.ts` overrides the data). Kinds go from the largest down. A tab without drawings (Talíře, misky a mísy, being reworked) lists its kinds as text. The chart keeps the PDF's scale where the row fits and shrinks where it would not (teapots); on phones it scrolls sideways.
  - E-shop (`docs/design/eshop.pdf`): line name on the label line (Martin's and Daniela's lines), the category menu, then five products a row on 260 × 302 tiles, 26 a page with one large illustration (2 × 2, `src/config/shop.ts`), the page numbers (no yellow bar, Sami, November 2026). Captions in Inter Medium, grey `#4c4c4c`: the type in capitals with the price beside it, the decor (motif, colour) in small letters on the second line, without "Porcelánový" (`src/lib/names.ts`, the data keeps the old titles). Captions are a size smaller than the body (`--step-caption`), the name close to the photo's left edge, the price close to its right edge.
  - Grid alignment: every product card is two grid rows (photo, caption) shared through `subgrid`, so photos in a row end on one line and captions start on one line; the illustration spans three rows of photo and is cropped to fit (`src/components/ProductGrid.astro`).
  - Footer: four columns on the e-shop menu's lines (address, contacts with the Instagram link `porcelan.kosovi`, legal links, rights with the language switch), 2 px smaller than the body (`--step-footer`).
  - Product photos are aligned optically within one type (old category and subcategory), `scripts/align-photos/`, run it again on new photos. Mugs (`--by height`): the same height, top and bottom line, the body on one vertical axis. Bowls, plates, teapots, sugar bowls and jugs (`--by width`, since lids and rattan handles make the height unreliable): the same width, the foot on one line; teapots are then shrunk per type so the rattan handle stays inside the listing tile (`--fit-top`). Shot glasses (`--by height --no-shape-cap --axis box`): all the same height, sets of three included, centred on the whole outline. Left as delivered: bábovky and types with fewer than three pieces.
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

- Order mode: request or binding?
- Shipping methods, prices, pickup location. Do they use Zásilkovna?
- Which 12 to 20 pieces are the signature pieces?
- Will Daniela and Martin add products themselves? If yes, add a git-based CMS (Decap or Pages CMS) after launch.
- Can customers visit the workshop?
- Courses: format, length, price, gift voucher.
- Newsletter provider.
- Who holds access to the Wedos hosting, the domain and the WordPress admin?
