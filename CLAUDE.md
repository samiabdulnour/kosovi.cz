# kosovi.cz

New website for **Daniela a Martin Kosovi**, a porcelain studio in Prague. It replaces the 2020 WordPress/WooCommerce site at kosovi.cz (hosted on Wedos). Online sales are very low. The redesign has one job above all: present the two of them as a creator duo and make their work easy to understand and order.

The owner of this repo is Sami (architect, iOS developer). He makes the design and content decisions. Ask him whenever a fact, price or decision is missing.

## The core idea

One studio, two pairs of hands. **Martin Kos throws porcelain on the potter's wheel. Daniela Kosová paints it** (cobalt under the glaze) and also makes her own artwork.

- The homepage leads with both of them and their joint work, not with a product grid.
- The blue-and-white porcelain (modrobílý porcelán) is presented as their joint line. **UNCONFIRMED:** the old site calls it "náš" porcelán, but nobody has confirmed it is his forms with her painting. Keep this easy to change until Sami confirms.
- Solo work branches off: Martin's thrown pieces (tea sets, teapots, vases, mugs with relief decoration) and Daniela's art (decors, design, paintings, tiles, sculpture), presented at gallery level, with "cena na dotaz" where a price is not set.
- Every product says who made it.
- Lead with 12 to 20 signature pieces. The full catalogue (about 416 items) sits behind them.

## Stack

- **Astro** (current stable, pinned), static output, TypeScript strict.
- Content collections in `src/content/` with zod schemas.
- `astro:assets` `<Image>` for all imagery. Never ship raw originals.
- Plain CSS with custom properties. No CSS framework, no UI framework unless a feature truly needs one. The cart is a small vanilla TS island.
- **Hosting: Cloudflare Pages**, a preview URL per branch. One Pages Function for orders. If Cloudflare now recommends Workers static assets over Pages for Astro, say so and propose the switch before doing it.
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
  layouts/
  pages/               # routes, see "Pages" below
  config/              # shipping.ts, order.ts, site.ts
  i18n/                # UI strings cs/en
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
npx astro check        # type check
npm run import         # runs scripts/import-wp.ts
npx wrangler pages dev # local run with the order function
```

## Phases

Work one phase at a time, on its own branch. Stop at the end of each phase and summarise what was done and what is missing.

1. **Scaffold.** Astro project, Cloudflare config, base layout, CSS tokens placeholder, i18n setup (cs default at `/`, en at `/en/`).
2. **Import the old content** (details below).
3. **Design plan.** Propose the visual system (see "Design direction") and wait for Sami's approval before building UI.
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

## Product schema

```
title: string
slug: string                 # keep the old slug
line: "spolecna" | "martin" | "daniela"
category: string             # see categories below
makers: { thrownBy?: "martin", paintedBy?: "daniela" }
price: number | null         # CZK; null = "cena na dotaz"
stock: number
featured: boolean            # signature pieces, Sami picks them
catalogNo?: string
dimensions?: { heightCm?: number, diameterCm?: number, volumeMl?: number }
technique?: string
care?: { dishwasher?: boolean, microwave?: boolean }
images: { src: image, alt: string }[]
description?: string
oldUrl?: string
```

Unknown values stay empty. Never guess dimensions, volumes, techniques or makers. List the gaps in `TODO.md`.

Old categories. Modrobílý porcelán: hrnky, podšálky, talíře, misky, mísy, konvice rovné, konvice kulaté, cukřenky, mlíčenky, bábovky, panáky. Martin: čajové soupravy, konve solitéry, vázy, hrnky s plastickým dekorem. Daniela: dekory, design, obrázky, obklady.

## Pages (Czech first)

Keep old URLs wherever the page still exists, so fewer redirects are needed.

| Route | Content |
|---|---|
| `/` | Both of them, the joint line, signature pieces, how to order |
| `/kolekce/` and `/kolekce/<line>/` | Collections, joint line first, filter by category |
| `/produkt/<slug>/` | Product page (same URL as the old site) |
| `/martin-kos/`, `/daniela-kosova/` | Artist pages: bio, how they work, their pieces (old URLs, now real pages instead of shop menus) |
| `/jak-vznika/` | Throwing, drying, painting with cobalt, firing. Photos or short video per step. This page justifies the price |
| `/o-nas/` | The studio, both bios short, collections and exhibitions as proof |
| `/kurzy/` | Courses on request, gift voucher |
| `/kontakt/` | Contact, workshop visits if Sami confirms they are possible |
| `/kosik/` | Cart and order form (old URL) |
| `/objednavka-odeslana/` | Confirmation |
| `/obchodni-podminky/`, `/ochrana-osobnich-udaju/`, `/reklamace-a-odstoupeni/` | Legal. Sami supplies or approves the text |

English at `/en/...` for home, collections, artist pages, how it's made, about, contact. Product pages in English can come later.

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
- **Never invent facts.** Use only the source facts below. Where something is missing, write `TODO(fakta): what is needed` and add it to `TODO.md`.
- Czech typography: „uvozovky“, a non-breaking space after one-letter words (k, s, v, z, o, u, a, i) and between number and unit (`4 000 Kč`, `1 380 °C`), a non-breaking space as thousands separator, an en dash for ranges.
- UI microcopy: plain verbs, sentence case, buttons say exactly what happens.

## Source facts

From the current O nás page. These are the only facts copy may use.

**Porcelain:** thrown on the potter's wheel, which is unusual for porcelain. Fired up to 1380 °C. Blue-and-white pieces decorated with cobalt, under the glaze or in the glaze, fired together with the porcelain, so the decoration does not wear off. Dishwasher and microwave safe.

**Martin Kos:** born 1959 in Hradec Králové. Both parents were ceramicists. Apprenticed as a potter in Týniště nad Orlicí. Graduated from the ceramics school in Bechyně, as did his parents and his grandfather. Worked at ÚVD Keramo Praha, independent since 1987. Learned to throw porcelain and has worked only in porcelain for over 25 years.

**Daniela Kosová:** born in Bratislava. Studied ceramics at SUPŠ in Bratislava, then at UMPRUM in Prague. Trained in Andrej Rudavský's studio and in the porcelain factories in Dubí and Duchcov. Decorates underglaze (fired at 1390 °C), in-glaze (1250 °C) and overglaze including gilding (800 °C). Work in the collections of UPM Praha, Alšova jihočeská galerie, Slovenské centrum dizajnu in Bratislava, the museum in Darney (France), Porvoo (Finland), and private collections.

**Studio:** Na Vlčovce 6, 160 00 Praha 6. +420 607 635 393, +420 728 717 232, danielakosova@gmail.com. Courses in ceramics and porcelain on request.

**Third-party, confirm before use:** Galerie Svatoš describes Martin as a third-generation potter and mentions his thin-walled porcelain perforated with small holes, giving the translucent cups a lace pattern.

## Design direction

- Subject: hand-thrown porcelain, cobalt on white, two makers. Photography carries the site. The layout stays quiet and lets the pieces breathe.
- **Before building any UI, propose a design plan and wait for approval:** 4 to 6 named colours, typefaces and their roles, a type scale, ASCII wireframes of the homepage, a collection page and a product page. Sami has a strong typographic eye and makes the final call on type.
- Avoid the generic looks: cream background with terracotta accent, rounded SaaS cards with soft shadows, all-caps eyebrow labels, sliders and carousels, fade-up animation on every section, "→" on every link.
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

- Is the blue-and-white line their joint work (his forms, her painting)?
- Order mode: request or binding?
- Shipping methods, prices, pickup location. Do they use Zásilkovna?
- Which 12 to 20 pieces are the signature pieces?
- Will Daniela and Martin add products themselves? If yes, add a git-based CMS (Decap or Pages CMS) after launch.
- Can customers visit the workshop?
- Courses: format, length, price, gift voucher.
- Newsletter provider.
- Who holds access to the Wedos hosting, the domain and the WordPress admin?
