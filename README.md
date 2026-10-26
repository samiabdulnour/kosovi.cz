# kosovi.cz

Nový web porcelánového ateliéru Daniely a Martina Kosových. Nahrazuje web z roku 2020 (WordPress/WooCommerce).

Zadání, stack a pracovní pravidla jsou v [CLAUDE.md](CLAUDE.md), otevřené otázky v [TODO.md](TODO.md).

## Náhledy

- Větev `main`: https://samiabdulnour.github.io/kosovi.cz/
- Každý pull request: `https://samiabdulnour.github.io/kosovi.cz/pr-preview/pr-<číslo>/`, odkaz přijde do komentáře u PR.
- Přehled všech stránek a jejich stavu: `/struktura/` (odkaz „Přehled stránek“ v horní liště náhledu).

Náhledy běží na GitHub Pages z větve `gh-pages`. Jednorázové nastavení: Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **gh-pages**, složka **/ (root)**.

## Lokální vývoj

Potřebuje Node 24 (`.node-version`).

```
npm install
npm run dev      # vývojový server na http://localhost:4321
npm run build    # musí projít před každým commitem
npm run check    # kontrola typů
```
