# TODO

Otevřené otázky a chybějící fakta. Rozhoduje Sami. V kódu jsou místa označená `TODO(fakta)`, `TODO(rozhodnutí)` nebo `TODO(text)`.

## Rozhodnutí

- [x] Modrobílý porcelán, podpis autorů: stránka produktu autory neuvádí (Sami, listopad 2026). Výchozí autoři řad zůstávají v datech (`src/config/lines.ts`).
- [x] Claim na úvod webu vybrán a je na úvodní stránce. Anglický překlad je pracovní (fáze 6).
- [x] Design: `docs/design/kosovi_navrh_01.pdf`, aplikovaný do náhledu.
- [x] Písmo verzálek: Moment v tloušťce 125 (jako popisky v e-shopu), prostrkání 0,085 em (Sami, listopad 2026; dříve Inter ExtraBold).
- [x] Písma: Moment (verzálky) a Claristik clarendon (text malými písmeny), Samiho vlastní, jako WOFF2 v `src/assets/fonts/` (listopad 2026).
- [x] Košík v hlavičce s počtem kusů (počet se ukáže, až bude košík, fáze 5).
- [ ] Ilustrace v e-shopu (bábovka) je jen na prvním výpisu modrobílého porcelánu a v sekci Ostatní, jinde je velký devátý kus výpisu (Sami, listopad 2026). Vede na Bábovku velkou a ukazuje „od 3 500 Kč“ (malá a velká mají v novém menu každá svou siluetu). Má vést jinam?
- [ ] Jazyk: přepínač EN je teď v patičce, v nové hlavičce není. Vyhovuje to?
- [ ] E-shop, kategorie z návrhu bez produktů ve starém e-shopu: Talíř jídelní, Talíř malý, Talíř polévkový. Sporné mapování: „Miska velká“ = dřívější „Polévka/Snídaně“? (`src/config/lines.ts`). Hrnek Štefan a Odkládátka v novém menu (`kosovi_eshop_2.pdf`) nejsou.
- [ ] Menu se siluetami, rozměry: velikosti pod kresbami jsou z dat, zaokrouhlené na celé cm (Sami, listopad 2026). Opraveno podle Samiho: cukřenka velká má výšku 7 cm (data měla 17,5 cm), panák 4–6 cm a průměr se u panáků neuvádí (smazán z dat i popisů). Zbývá: mlíčenky mají v datech průměr 5,5 a 8,5 cm, na fotkách jsou užší (kresby podle fotek); hrnek espresso nemá rozměr žádný (zůstává 6 cm z PDF).
- [ ] Menu se siluetami pro Talíře, misky a mísy (Sami je ještě upravuje).
- [ ] Stránka produktu: krátké texty u jiných druhů než hrnků jsou návrh podle hrnku a ověřených faktů (`src/config/descriptions.ts`), potřebují Samiho schválení. Chybí péče o konvice s ratanovým uchem a jestli formy na bábovku smějí do trouby.
- [x] Stránka produktu: podpis autorů odstraněn (Sami, listopad 2026).
- [ ] Stránky Martina a Daniely (`kosovi_daniela_martin.pdf`): fotky z PDF jsou nové úpravy starých fotek z e-shopu (nové pozadí). Nahradit jimi i fotky těch výrobků v e-shopu? Má Sami ty úpravy ve větším rozlišení (v PDF mají kolem 900 × 1 055 px)?
- [ ] Stránky Martina a Daniely: druhá strana PDF má nadpis „Martin Kos“, ale jsou na ní Danieliny šálky, použita pro Danielu. Velké fotky nahoře nikam nevedou (mísa s víkem a miska s ovocem v e-shopu nejsou). Stránky „Volná tvorba“ zůstaly, ale nic na ně nevede: zrušit?
- [ ] Stránka produktu, fotky: okraje čtverce 531 × 501 jsou zatím doplněné barvou okrajů fotky (`src/lib/edges.ts`). Sami doplní pozadí fotek.
- [ ] Stránka produktu, související kusy: 12 modrobílých kusů s dekorem, který jinde není (např. hrnek velký s kočárkem, se sovou, závěsné talíře 1–4), související kusy nemá. Doplnit je kusy ze stejné záložky jako u Ostatní?
- [ ] Košík: tlačítko zatím ukládá kusy do prohlížeče, stránka košíku a objednávka přijdou ve fázi 5.
- [ ] Názvy produktů: návrh ukazuje „Hrnek velký / Srdce“ (druh a motiv), data mají celé staré názvy. Přejmenovat? Jeden název obsahuje „(kopírovat)“ z WordPressu.
- [ ] Výběr čtyř kusů modrobílého porcelánu na úvod (`src/config/home.ts`).
- [x] Pás fotografií na úvodu zrušen (Sami, listopad 2026); nahoře je místo něj řada dvou fotek z `kosovi_homepage.pdf`. Původní pás je v historii gitu (`src/config/band.ts`, `docs/design/pas.pdf`).
- [ ] Daniela, kategorie Design (věšáčky, úchytky): platí u nich „Malovala Daniela“? Výchozí autoři řady jsou v `src/config/lines.ts`, u jednotlivého produktu se dají přepsat polem `makers`.
- [ ] Výpal: 309 popisů produktů uvádí „2x při 1400°C“, stránka O nás „až 1380 °C“. Které číslo platí?
- [ ] Režim objednávky: nezávazná (`request`), nebo závazná (`binding`)? `src/config/order.ts`, zatím zástupně `request`.
- [ ] Doprava: způsoby, ceny, místo osobního odběru. Používají Zásilkovnu? `src/config/shipping.ts`.
- [ ] Kterých 12–20 kusů jsou vybrané kusy (`featured: true`)?
- [ ] Budou Daniela a Martin přidávat produkty sami? Pokud ano, po spuštění git CMS (Decap nebo Pages CMS).
- [x] Návštěva dílny: pouze po telefonickém dohovoru, adresa na stránce Kontakt není (Sami, listopad 2026).
- [x] Adresa v patičce zůstává (Sami, listopad 2026).
- [ ] Úvodní stránka podle `kosovi_homepage.pdf`: v PDF není claim („Od modrobílého porcelánu…“), proto na stránce teď chybí. Vrátit ho?
- [x] Hlavička podle `kosovi_homepage.pdf` (Sami, listopad 2026): „EN“ místo „Košík“, „Daniela a Martin Kosovi“ větší a na pozici z PDF. Košík se v menu objeví, jen když v něm něco je.
- [ ] Patička v `kosovi_homepage.pdf` má tři sloupce bez právních odkazů (obchodní podmínky atd.). Na webu zatím zůstává dosavadní patička se čtyřmi sloupci. Změnit?
- [ ] Úvodní stránka: fotka se snídaní nemá v PDF jméno autora, takže nikam nevede. Má vést někam?
- [x] Úvodní stránka, blok Daniely: talíře s kohoutem (vyříznuté ze Samiho snímku obrazovky, kurzor uprostřed odretušovaný). Původní soubor fotky by byl lepší, má-li ho Sami.
- [ ] Kurzy: formát, délka, cena, dárkový poukaz.
- [ ] Newsletter: poskytovatel, nebo vůbec?
- [ ] Kdo má přístup k hostingu Wedos, doméně a administraci WordPressu?
- [ ] Hosting: Cloudflare Pages (podle CLAUDE.md), nebo Cloudflare Workers se statickými soubory, které Cloudflare teď doporučuje pro nové projekty?
- [x] Písmo, barvy a typografická škála: podle návrhu (docs/design), písmo Moment (dříve Inter ExtraBold).

## Chybějící fakta

- [ ] Společná fotografie manželů (O nás), fotografie z dílny.
- [ ] Fotografie a popisky volné tvorby Martina i Daniely (stránky „Volné“).
- [x] Instagram: `porcelan.kosovi`, odkaz v patičce.
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
