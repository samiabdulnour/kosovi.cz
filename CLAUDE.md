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

**Done (phase 2).** The Store API works; the import matched all counts. Report in `scripts/data/import-report.md`. Images are the largest size WordPress serves; 48 of them WordPress had scaled to 2560 px on upload, the camera originals (about 150 MB) were not downloaded. Each product owns `src/assets/products/<slug>/01.jpg…`, even where the old shop reused a photo, so swapping a photo touches one product only. Re-running the import overwrites `src/content/products/`, so after hand edits start (featured, makers, fixes) stop re-running it or teach it to keep them. Removed on Sami's request (November 2026): the mini mugs bike forever, ski forever and wing foil forever; their old URLs need redirects in phase 7. A product without a photo stays off the site until it has one (`getProducts`, Sami, November 2026: the shot glass with two hearts); its old URL needs a redirect meanwhile.

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
| `/` | After `docs/design/kosovi_homepage.pdf` (Sami, November 2026): a row of two pictures on colour fields, in place of the former moving strip (removed, Sami, November 2026; `topRow`): Sami's video of a hand painting a face on a plate (silent, in a loop, H.264 MP4 and VP9 WebM at 576 × 960, its first frame the poster; it does not start for `prefers-reduced-motion`, and a button over it, shown on hover, stops and restarts it) and the PDF's black teapots; the blue-and-white porcelain on a green band (#84c6a1) across the whole width, five mugs on 3:4 tiles with the e-shop's captions, name and price (`blueWhiteSelection` in `src/config/home.ts`, each opens its product); then five rows of photographs across the whole width, placed as in the PDF (`mosaic` in `src/config/home.ts`, `src/components/Mosaic.astro`), each opening its author's part of the site (Daniela's page, Martin's page, or the blue-and-white e-shop) and showing the author's name in its top corner only on hover (always on touch screens). The first row (`#daniela-a-martin`, the header's link) is Daniela's cockerel plates and Martin's bowl with an apple. The breakfast photo has no name and opens nothing. No claim: the PDF has none (the text is in git history) |
| `/kolekce/`, `/kolekce/<line>/`, `/kolekce/<line>/<entry>/`, `…/<n>/` | E-shop. "E-shop" in the menu opens the first tab (Hrnky) of the blue-and-white line. Its menu is tabs with a size chart (`docs/design/kosovi_eshop_2.pdf`); Martin's and Daniela's lines keep the category menu in four columns. Menus are mapped onto the old shop data in `src/config/lines.ts`; 26 products a page. Line slugs: `modrobily-porcelan`, `martin-kos`, `daniela-kosova` |
| `/produkt/<slug>/` | Product page (same URL as the old site) |
| `/martin-kos/`, `/daniela-kosova/` | Artist pages after `docs/design/kosovi_daniela_martin.pdf` (Sami, November 2026): the name on the label line, a composition of colour fields and two photographs across the whole width, then their pieces five a row on the e-shop's tiles with the product's caption, each opening its product page (`src/views/ArtistPage.astro`, layout and photos in `src/config/artists.ts`). Old URLs. The older "Volné" pages (`…/volna-tvorba/`) stay but nothing links to them |
| `/o-nas/` | After `docs/design/kosovi_o_nas.pdf` (Sami, November 2026; the header in it is the old one), no page title under the header (Sami, November 2026): "Manželé Kosovi" on an olive field (#d6cf93) over the left half, the couple's photograph filling the right half to the screen's edge (Sami's screen, November 2026; without the sentence "Modelování, texty nebo malba."), "Modrobílý porcelán" on white, then both biographies side by side on a blue (#a6d3ff) and an orange (#ff8a00) field meeting in the middle, each across the whole width; section names in capitals at 17 px, the text in Claristik at 24 px on 28, tracked 2 % (`src/views/AboutPage.astro`). The text is Sami's from the PDF, the biographies Daniela's and Martin's own, with typing errors and punctuation corrected and the praise toned down (no superlatives, Sami, November 2026). (Replaces the former `/jak-vznika/` page.) |
| `/kurzy/` | Courses on request, gift voucher |
| `/kontakt/` | Contact without the street address; workshop visits only by arrangement on the phone (Sami, November 2026). In the type of O nás (`.essay` in `src/styles/base.css`): no page title under the header, the studio's name as a section name, phones, e-mail and the note on visits in Claristik; no line on courses (Sami, November 2026). The footer keeps the address (Sami, November 2026) |
| `/kosik/` | Cart and order form (old URL). Until phase 5 it shows how many pieces the browser holds and a button to empty the cart |
| `/objednavka-odeslana/` | Confirmation |
| `/obchodni-podminky/`, `/ochrana-osobnich-udaju/`, `/reklamace-a-odstoupeni/` | Legal. Sami supplies or approves the text |

English at `/en/...` for home, e-shop listings, artist pages, about, contact. Product pages in English can come later.

**Product page must show:** price or "cena na dotaz", size and volume, technique, care (dishwasher, microwave), a note that every piece is handmade and varies slightly, 4 to 6 large zoomable images including a scale shot and a detail of the painting, related pieces from the same set.

**Product page layout:** `docs/design/kosovi_detail_produktu.pdf` (Sami, November 2026; it replaces `kosovi_eshop_produkt.pdf`), `src/views/ProductPage.astro`. Under the header the e-shop's tabs (`ShopTabs.astro`), then the photo (666 × 501 at 1512, two and a half listing columns from the second column, whole photo, each links to a large version; where the photo's format leaves the box's sides empty, they carry the photo's own edge colours sampled at build time and the photo's edges fade into them, `src/lib/edges.ts`, until Sami extends the backdrops; further photos under it) and from 70.5 % across: at the top the name, the price under it, quantity and "Vložit do košíku" on ochre (`--color-ochre`, #cba647; asking by email where the price is on request or the piece is sold out; the dinner set says "Jídelní soupravy jsou na objednávku" in the price's place and its button "Chci objednat" opens an e-mail, Sami, November 2026); at the photo's foot a short text in Claristik 14 px, broken after its first sentence (`src/config/descriptions.ts` per kind; Sami's mug text from the PDF, the others drafts from the source facts; Martin's and Daniela's pieces keep their old descriptions), Výška, Průměr (the PDF's "Šířka", Sami, November 2026), Objem and Katalogové číslo, "100% porcelán" (every piece except the teapots and tea sets with rattan handles, Sami, November 2026), a rule, the note on sizes. No maker credit, no drawing (Sami, November 2026). The kinds of the open tab sit on an ochre panel in white from the screen's edge to 10 points short of the photo, as tall as the photo, the product's kind underlined (the dinner set's three plates as one entry, "Jídelní souprava", Sami, November 2026; `listEntries` in `src/config/lines.ts`); it stays hidden and slides out from the side when the pointer comes over its place or a link in it takes the focus (Sami, November 2026); without hover (touch) it stays out, and on phones it is a band over the photo. Under all that, on a green band (#96c19d) across the whole width, five tiles (Sami, November 2026): "Ze stejné sady" is the same kind with a similar decor, a motif in common ("s andělem na kole" goes with "s bicykly", "s jízdním kolem" and "s andělem"); "Se stejným dekorem" is the same decor on other kinds, at least two tiles when there are, and no heading when the decor is on one piece only. The tab's other pieces fill whatever is left of the five under "Další", after the other two, on every product (Sami, November 2026: the plates had no strip); Martin's and Daniela's pieces show their related pieces under "Další" alone, with no "Ze stejné sady" (Sami, November 2026). Motifs: `decorMotifs` in `src/lib/names.ts` (synonyms such as kolo, bicykl, jízdní kolo). Until the order flow, the button stores `[{ slug, qty, options }]` in `localStorage` (`kosovi-cart`) and the header's badge shows the sum of pieces.

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

**Porcelain, from Sami's O nás text (November 2026):** technical porcelain, the material once used for electrical insulators. Two firings: the first in an electric kiln; then the piece is painted by hand with wax, dipped in cobalt and then in a clear glaze; the second firing, at 1380 °C in a gas kiln, fuses the layers. Can be used as an oven dish, in the dishwasher and in the microwave.

**Martin Kos:** born 1959 in Hradec Králové. Both parents were ceramicists. Apprenticed as a potter in Týniště nad Orlicí. Graduated from the ceramics school in Bechyně, as did his parents and his grandfather. Worked at ÚVD Keramo Praha, independent since 1987. Learned to throw porcelain and has worked only in porcelain for over 25 years.

**Daniela Kosová:** born in Bratislava. Studied ceramics at SUPŠ in Bratislava, then at UMPRUM in Prague. Trained in Andrej Rudavský's studio and in the porcelain factories in Dubí and Duchcov. Decorates underglaze (fired at 1390 °C), in-glaze (1250 °C) and overglaze including gilding (800 °C). Work in the collections of UPM Praha, Alšova jihočeská galerie, Slovenské centrum dizajnu in Bratislava, the museum in Darney (France), Porvoo (Finland), and private collections.

**Brand:** founded in 1995 with the blue-and-white porcelain. For several years Martin threw and Daniela painted; in recent years Martin makes it all. Both have worked in the visual arts for decades.

**Studio:** Na Vlčovce 6, 160 00 Praha 6. +420 607 635 393, +420 728 717 232, danielakosova@gmail.com. Courses in ceramics and porcelain on request. Workshop visits only after arranging them on the phone, and the contact page leaves out the address (Sami, November 2026).

**Third-party, confirm before use:** Galerie Svatoš describes Martin as a third-generation potter and mentions his thin-walled porcelain perforated with small holes, giving the translucent cups a lace pattern.

## Design direction

- **The design is `docs/design/kosovi_navrh_01.pdf`** (Sami, October 2026; the comments in it say where each block links). It overrides the earlier "avoid" list where they disagree.
  - Header (`docs/design/kosovi_homepage.pdf`, Sami, November 2026, on every page): "Porcelán Kosovi" on the left, "Daniela a Martin Kosovi" on the label line, the same size as the rest (Sami, November 2026; the PDF had 16 px) (`--label-start`, lined up with the e-shop band's tabs, Sami, November 2026), opening the homepage's row of Daniela and Martin (`/#daniela-a-martin`), the menu on the right about 59 points apart: E-shop, O nás, Kurzy, Kontakt, and the language switch "EN" (on English pages "CZ", to the same page in the other language). Košík with its count badge joins the menu only while something is in the cart (the badge as tall as the capitals, Moment's 0.67 em, standing on the baseline; the figure centred with `text-box` trimming where the browser has it). White on every page, the e-shop included, no rule under it (Sami, November 2026). The page title sits under the header on the label line, except on O nás and Kontakt, which have none (Sami, November 2026).
  - Everything in one size, bold, capitals (CSS `text-transform`, the source text stays in sentence case). Typeface: Moment, Sami's own variable font (November 2026; weight axis 100 Regular to 200 Bold), all of it at weight 125, the e-shop captions' (`--weight`, `--weight-medium`), capitals tracked 0.085em, measured from Sami's sample (`--tracking`), self-hosted (`src/assets/fonts/`, `src/styles/fonts.css`). About 14.5 px on a 1512 px wide screen (`--step-0`: eshop.pdf's 12.5 px plus 2 px for Moment, Sami, November 2026); the product captions are the same size, the name, the price and the large photo's caption alike (`--step-caption`, Sami, November 2026).
  - Text in small letters in the e-shop (the decor under a photo, "vyprodáno", the note on sizes) is Claristik clarendon, Sami's own Clarendon (November 2026, `--font-serif`, `src/assets/fonts/`). Capitals stay Moment.
  - Photographs sit on flat colour fields (`--field-*` in `src/styles/tokens.css`). Product tiles fill with the edited portrait photos and show older ones whole (`object-fit: contain`).
  - E-shop menu of the blue-and-white line (`docs/design/kosovi_eshop_vektory.pdf`, Sami, November 2026, after `kosovi_eshop_2.pdf` and Sami's screens): an ochre band (#cba647, the photos' backdrop; Sami keeps it for now) across the whole width under a white header, in white, laid out as in the PDF at 1512 and scaled with the page, ending 88 points under the floor (Sami's screen): the line's name at the left, its capitals from the 30 cm tick down, and the note on sizes ("Všechny míry jsou pouze orientační…") at the right on the same line (Sami, November 2026); the tabs as a list at the left from the ruler's 20 cm tick (Hrnky, Talíře, Misky a mísy, Konve, Cukřenky / a mlíčenky on two lines, Ostatní a line apart, the open tab underlined; plates and bowls are two tabs; "Konve" for the teapots, Sami, November 2026); from the ruler (197 points right of the page's margin) to the screen's edge the open tab's kinds (pointing at or tabbing to another tab shows its kinds instead until the pointer leaves the band, Sami, November 2026) as Sami's white line drawings to scale (1 cm is 8.88 px at 1512), each where the PDF puts it, standing on a white floor line, with short 10, 20 and 30 cm ticks at the left and their figures under them; the name under each drawing and its size wherever the data has one (Sami, November 2026; the PDF gives the teapots' only); the plates of the dinner set share a line and the name "Jídelní soupravy" over their own (`sets`), and each opens the dinner set, made to order (Sami, November 2026); plates and saucers are drawn from above; the 30 cm tick at its true height, a little above the PDF's (Sami, November 2026) (`src/components/ShopMenu.astro`). Drawings in `src/assets/silhouettes/` (viewBox in cm, `data-axis`, `data-floor`, `data-x`), cut out of the PDF by `scripts/silhouettes/pdf_vectors.py`. The drawings are filled with the band's colour, and the chosen kind with `--color-select` (#00154c), and so is a kind under the pointer, while its inside (the opening of a cup or a jug, a bowl's rim, the top ellipse of a bábovka, the espresso saucer; class `i`) keeps the band's colour; plates and saucers fill whole (Sami, November 2026). The espresso cup keeps its drawing from `kosovi_eshop_2.pdf` (Sami, November 2026). The tabs sit a little further from the header (Sami, November 2026), on listings and product pages alike. The size under a drawing is the height in the product data (the diameter where there is none), rounded to whole centimetres (Sami, November 2026); the espresso cup has no data and keeps 6 cm; the shot glass shows "4–6 cm" (`size` in `src/config/lines.ts` overrides the data). Kinds go in the PDF's order. A tab without drawings lists its kinds as text in the chart's place. On phones the chart scrolls sideways.
  - E-shop (`docs/design/eshop.pdf`): line name on the label line (Martin's and Daniela's lines), the category menu, then five products a row on 260 × 302 tiles, a large illustration (2 × 2, `src/config/shop.ts`) only on the line's first listing and in Ostatní, the bábovka (26 products a page); every other listing is one plain grid, 25 a page, until its pieces are photographed and get large photos of their own (Sami, November 2026), then the page numbers (no yellow bar, Sami, November 2026). Captions in Moment at `--weight-medium`, grey `#4c4c4c`: the type in capitals with the price beside it, the decor (motif, colour) in small letters on the second line, without "Porcelánový" (`src/lib/names.ts`, the data keeps the old titles). The price is as large as the name (`--step-caption`, the body size; Sami, November 2026), the name close to the photo's left edge, the price close to its right edge.
  - Grid alignment: every product card is two grid rows (photo, caption) shared through `subgrid`, so photos in a row end on one line and captions start on one line; the illustration spans three rows of photo and is cropped to fit (`src/components/ProductGrid.astro`).
  - Homepage mosaic (`docs/design/kosovi_homepage.pdf`): the rows keep the PDF's proportions on a 1512 wide frame, about 22 points apart; colour fields fill the gaps between photos; on phones the photographs stand one under another, full width, and the fields drop out. The photos are the PDF's own (`src/assets/home/`).
  - Makers' pages (`docs/design/kosovi_daniela_martin.pdf`): the composition is rebuilt from the PDF's own positions on a 1512 wide frame (`src/components/Composition.astro`), the fields' top 31 points under the label's; Martin's pieces show their product photos (`image` picks which; his product photos are Sami's new edits from November 2026: teapots and vases on sand or a colour, the stamped mugs), Daniela's still the PDF's photos (`src/assets/artists/daniela/`), five a row, one photo two columns wide on Martin's (`src/components/WorkGrid.astro`). The PDF's second page is labelled "Martin Kos" but shows Daniela's cups; it is her page.
  - Footer: four columns on the e-shop menu's lines (address, contacts with the Instagram link `porcelan.kosovi`, legal links, rights with the language switch), 2 px smaller than the body (`--step-footer`, which grew with it).
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
- Courses: format, length, price, gift voucher.
- Newsletter provider.
- Who holds access to the Wedos hosting, the domain and the WordPress admin?
