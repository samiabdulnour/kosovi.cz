# TODO

Otevřené otázky a chybějící fakta. Rozhoduje Sami. V kódu jsou místa označená `TODO(fakta)`, `TODO(rozhodnutí)` nebo `TODO(text)`.

## Rozhodnutí

- [ ] Modrobílý porcelán: značka vznikla v roce 1995, několik let Martin točil a Daniela malovala, poslední léta vyrábí všechno Martin. Jaký podpis má mít produkt? Teď se u všech 294 kusů zobrazuje „Točil Martin, malovala Daniela“ (`src/config/lines.ts`), což u novějších kusů nesedí.
- [x] Claim na úvod webu vybrán a je na úvodní stránce. Anglický překlad je pracovní (fáze 6).
- [x] Design: `docs/design/kosovi_navrh_01.pdf`, aplikovaný do náhledu.
- [x] Písmo: Inter ExtraBold, verzálky s mírným prostrkáním (zatím jen tento řez).
- [ ] Košík v hlavičce: v návrhu není, e-shop ho ale potřebuje (fáze 5). Kam ho dát?
- [ ] E-shop, kategorie z návrhu bez produktů ve starém e-shopu: Hrnek Štefan, Talíř jídelní, Talíř malý, Talíř polévkový, Odkládátka. Sporné mapování: „Hrnek malý“ = dřívější „Mini“? „Miska velká“ = dřívější „Polévka/Snídaně“? (`src/config/lines.ts`)
- [ ] Názvy produktů: návrh ukazuje „Hrnek velký / Srdce“ (druh a motiv), data mají celé staré názvy. Přejmenovat? Jeden název obsahuje „(kopírovat)“ z WordPressu.
- [ ] Výběr čtyř kusů modrobílého porcelánu na úvod (`src/config/home.ts`).
- [x] Pás fotografií na úvodu podle `docs/design/pas.pdf` (`src/config/band.ts`).
- [ ] Daniela, kategorie Design (věšáčky, úchytky): platí u nich „Malovala Daniela“? Výchozí autoři řady jsou v `src/config/lines.ts`, u jednotlivého produktu se dají přepsat polem `makers`.
- [ ] Výpal: 309 popisů produktů uvádí „2x při 1400°C“, stránka O nás „až 1380 °C“. Které číslo platí?
- [ ] Režim objednávky: nezávazná (`request`), nebo závazná (`binding`)? `src/config/order.ts`, zatím zástupně `request`.
- [ ] Doprava: způsoby, ceny, místo osobního odběru. Používají Zásilkovnu? `src/config/shipping.ts`.
- [ ] Kterých 12–20 kusů jsou vybrané kusy (`featured: true`)?
- [ ] Budou Daniela a Martin přidávat produkty sami? Pokud ano, po spuštění git CMS (Decap nebo Pages CMS).
- [ ] Mohou zákazníci navštívit dílnu? (stránka Kontakt)
- [ ] Kurzy: formát, délka, cena, dárkový poukaz.
- [ ] Newsletter: poskytovatel, nebo vůbec?
- [ ] Kdo má přístup k hostingu Wedos, doméně a administraci WordPressu?
- [ ] Hosting: Cloudflare Pages (podle CLAUDE.md), nebo Cloudflare Workers se statickými soubory, které Cloudflare teď doporučuje pro nové projekty?
- [x] Písmo, barvy a typografická škála: podle návrhu (docs/design), písmo Inter ExtraBold.

## Chybějící fakta

- [ ] Společná fotografie manželů (O nás), fotografie z dílny.
- [ ] Fotografie a popisky volné tvorby Martina i Daniely (stránky „Volné“).
- [ ] Instagram: název účtu (patička).
- [ ] CV Martina, výstavy obou.

- [ ] Martin: „přes 25 let pracuje pouze s porcelánem“ je údaj z webu z roku 2020. Aktualizovat.
- [ ] Martin: Galerie Svatoš uvádí třetí generaci hrnčířů a tenkostěnný porcelán s drobnými otvory (krajkový vzor). Použít?
- [ ] Jak pracuje Martin a jak Daniela, vlastními slovy (stránky autorů).
- [ ] Jak vzniká: potvrdit kroky a pořadí (přežah, glazování?), sušení, počet výpalů.
- [ ] O nás: krátce o ateliéru, výstavy obou autorů, sbírky s Martinovými pracemi.
- [ ] Popis každé kolekce (kdo, technika, materiál).
- [ ] Rozměry: import převzal výšku (299), průměr (141) a objem (167) z popisů. Technika a péče u produktů chybí úplně.
- [ ] Sady: data neříkají, které kusy patří k sobě. Stránka produktu zatím ukazuje kusy ze stejné kategorie.
- [ ] Zástupný text WordPressu v popisu: `hrnek-s-rybkami`, `hrnek-se-spiralou`. Tyto dva produkty nemají ani kategorii.
- [ ] Bez popisu 15 produktů, bez fotografie `porcelanovy-panak-s-dvema-srdci`, jen jedna fotografie 357 produktů. Podrobnosti v `scripts/data/import-report.md`.
- [ ] Varianty (barva očí) u 35 produktů Daniely: jak je nabízet v košíku (fáze 5).
- [ ] Texty obchodních podmínek, ochrany osobních údajů a reklamačního řádu.
- [ ] Nové fotografie (focení se plánuje). Pro produkt 4–6 záběrů včetně měřítka a detailu malby.

## Před spuštěním

- [ ] Odstranit poznámky k náhledu (`src/components/wire/`) a stránku `/struktura/`.
- [ ] Odstranit lištu náhledu a `noindex` (řídí je proměnná `PUBLIC_PREVIEW_LABEL`, v produkci se nenastavuje).
