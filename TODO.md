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
- [ ] E-shop: Hrnek Štefan a Odkládátka v novém menu (`kosovi_eshop_2.pdf`, `kosovi_eshop_vektory.pdf`) nejsou. („Miska velká“ je podle Samiho „Miska polévková“, dřívější „Polévka/Snídaně“.)
- [ ] Menu se siluetami, rozměry: velikosti pod kresbami jsou z dat, zaokrouhlené na celé cm (Sami, listopad 2026). Opraveno podle Samiho: cukřenka velká má výšku 7 cm (data měla 17,5 cm), panák 4–6 cm a průměr se u panáků neuvádí (smazán z dat i popisů). Zbývá: hrnek espresso nemá rozměr žádný (zůstává 6 cm z PDF). Kresby jsou teď Samiho z `kosovi_eshop_vektory.pdf`.
- [x] Talíře a Misky a mísy jsou dvě záložky (Sami, listopad 2026).
- [x] Úvod e-shopu podle `kosovi_eshop_vektory.pdf` (Sami, listopad 2026): nové kresby pro všech šest záložek, „Konve“ místo „Konvice“, „Talíř desertní“ místo „Talíř malý“, „Miska polévková“ místo „Miska velká“ (staré „Polévka/Snídaně“).
- [x] Úvod e-shopu: míry pod všemi kresbami, u kterých je data znají (Sami, listopad 2026). Kresby se od dat místy liší (cukřenka velká 7 cm v datech, 12 cm na kresbě; talíř Praktik ⌀ 28 cm, na kresbě 20 cm), každý kus je originál, takže to nevadí (Sami). Konev kulatá střední zůstává 19 cm z dat.
- [x] Úvod e-shopu: značka 30 cm ve skutečné výšce (Sami, listopad 2026).
- [x] Talíř jídelní, desertní a polévkový vedou na jídelní soupravu (Sami, listopad 2026).
- [ ] Stránka produktu: krátké texty u jiných druhů než hrnků jsou návrh podle hrnku a ověřených faktů (`src/config/descriptions.ts`), potřebují Samiho schválení. Chybí péče o konvice s ratanovým uchem a jestli formy na bábovku smějí do trouby.
- [x] Stránka produktu: podpis autorů odstraněn (Sami, listopad 2026).
- [x] Stránka produktu podle `kosovi_detail_produktu.pdf` (Sami, listopad 2026): větší fotka, tlačítka okrovou, druhy záložky na skrytém okrovém panelu, který vyjede po najetí kurzorem, související kusy na zeleném pásu. Kresba velikosti zmizela.
- [x] Stránka produktu: místo „Šířka“ z PDF „Průměr“ (Sami, listopad 2026).
- [x] „100% porcelán“ u všech kusů kromě konvic a čajových souprav s ratanovým uchem (Sami, listopad 2026).
- [x] Text u hrnků: „…do myčky, mikrovlnné trouby i ledničky.“ (Sami, listopad 2026).
- [ ] Stránky Martina a Daniely (`kosovi_daniela_martin.pdf`): fotky z PDF jsou nové úpravy starých fotek z e-shopu (nové pozadí). Nahradit jimi i fotky těch výrobků v e-shopu? Má Sami ty úpravy ve větším rozlišení (v PDF mají kolem 900 × 1 055 px)?
- [ ] Stránky Martina a Daniely: druhá strana PDF má nadpis „Martin Kos“, ale jsou na ní Danieliny šálky, použita pro Danielu. Velké fotky nahoře nikam nevedou (mísa s víkem a miska s ovocem v e-shopu nejsou). Stránky „Volná tvorba“ zůstaly, ale nic na ně nevede: zrušit?
- [ ] Stránka produktu, fotky: okraje čtverce 531 × 501 jsou zatím doplněné barvou okrajů fotky (`src/lib/edges.ts`). Sami doplní pozadí fotek.
- [x] Stránka produktu, související kusy: zbytek z pěti dlaždic doplní kusy ze stejné záložky pod „Další“, u všech produktů (Sami, listopad 2026). Bez lišty zůstávají jen dva hrnky bez kategorie (`hrnek-s-rybkami`, `hrnek-se-spiralou`) a `obklad-na-objednavku`.
- [ ] Košík: tlačítko zatím ukládá kusy do prohlížeče, stránka košíku a objednávka přijdou ve fázi 5.
- [ ] Názvy produktů: návrh ukazuje „Hrnek velký / Srdce“ (druh a motiv), data mají celé staré názvy. Přejmenovat? Jeden název obsahuje „(kopírovat)“ z WordPressu.
- [ ] Výběr čtyř kusů modrobílého porcelánu na úvod (`src/config/home.ts`).
- [x] Pás fotografií na úvodu zrušen (Sami, listopad 2026); nahoře je místo něj řada dvou fotek z `kosovi_homepage.pdf`. Původní pás je v historii gitu (`src/config/band.ts`, `docs/design/pas.pdf`).
- [ ] Daniela, kategorie Design (věšáčky, úchytky): platí u nich „Malovala Daniela“? Výchozí autoři řady jsou v `src/config/lines.ts`, u jednotlivého produktu se dají přepsat polem `makers`.
- [ ] Výpal: 309 popisů produktů uvádí „2x při 1400°C“ (některé „minimálně 2x v peci při 1000°C a 2x při 1400°C“), stránka O nás dva výpaly, druhý na 1 380 °C. Které číslo platí?
- [ ] Režim objednávky: nezávazná (`request`), nebo závazná (`binding`)? `src/config/order.ts`, zatím zástupně `request`.
- [ ] Doprava: způsoby, ceny, místo osobního odběru. Používají Zásilkovnu? `src/config/shipping.ts`.
- [ ] Kterých 12–20 kusů jsou vybrané kusy (`featured: true`)?
- [ ] Budou Daniela a Martin přidávat produkty sami? Pokud ano, po spuštění git CMS (Decap nebo Pages CMS).
- [x] Návštěva dílny: pouze po telefonickém dohovoru, adresa na stránce Kontakt není (Sami, listopad 2026).
- [x] Adresa v patičce zůstává (Sami, listopad 2026).
- [x] O nás podle `kosovi_o_nas.pdf` (Sami, listopad 2026): text z PDF s opravenými překlepy, chvalné obraty zmírněné na Samiho přání (bez superlativů, popis místo hodnocení, žádná nová fakta). Anglický překlad je pracovní (fáze 6).
- [x] Mini hrnky „bike forever“, „ski forever“ a „wing foil forever“ odstraněny z webu (Sami, listopad 2026). Fotky a data jsou v historii gitu, ve `scripts/data/` zůstávají. Ve fázi 7 přesměrovat jejich staré adresy (`/produkt/porcelanovy-mini-hrnek-bike-forever/`, `…-ski-forever/`, `…-wing-foil-forever/`) na výpis mini hrnků.
- [x] Hrnky den a noc jako jeden produkt, stejně jako velký (Sami, listopad 2026): první fotka denní strana se sluncem v okně, druhá noční. Produkty „Hrnek úzký se sluncem 2“ (č. 111), „Hrnek široký se sluncem 2“ (č. 074) a „Mini hrnek se sluncem 2“ (č. 033) jsou v nich sloučené, zůstává cena a katalogové číslo produktu den a noc (096, 075, 034). „Mini hrnek s noční kočkou“ se jmenuje „Mini hrnek den a noc“. Ve fázi 7 přesměrovat `/produkt/porcelanovy-hrnek-uzky-se-sluncem-2/` na `/produkt/porcelanovy-hrnek-uzky/`, `/produkt/porcelanovy-hrnek-siroky-se-sluncem-2/` na `/produkt/porcelanovy-hrnek-siroky-s-nocni-kockou/` a `/produkt/porcelanovy-mini-hrnek-se-sluncem-2/` na `/produkt/porcelanovy-mini-hrnek-s-nocni-kockou/`.
- [x] Martinova stránka podle `kosovi_martin.pdf` (Sami, listopad 2026): fotky vedou do Martinových kategorií, popisky po najetí myší. Tenkostěnné hrnky nepatří do žádné kategorie, zatím nikam nevedou.
- [x] Martinův e-shop má tři kategorie podle fotek z Dropboxu (Sami, listopad 2026): Vázy, Konve a čajové soupravy, Hrnky s razítkem. Výpisy mají okrový pás se záložkami jako e-shop, bez pravítka. U Martinových výrobků kromě hrnků s razítkem je místo „Vložit do košíku“ tlačítko „Zeptat se na produkt“ (e-mail s názvem a odkazem); bez ceny se cena nepíše.
- [x] Tři nové Martinovy vázy (s důlky a květinami, tmavě modrá se zlatým okrajem a růžemi, s tečkami a tulipány) se jmenují „Váza“, cenu ani rozměry neuvádějí (Sami, listopad 2026).
- [x] Čajová souprava 1 patří do kategorie Konve a čajové soupravy (Sami, listopad 2026).
- [x] Danielina stránka podle `kosovi_daniela.pdf` (Sami, listopad 2026): řady fotek jako u Martina, popisky po najetí myší. Opraveno „kuchině“ na „kuchyně“.
- [ ] Danielina stránka: fotky zatím nikam nevedou, Sami pošle Danieliny kategorie později.
- [x] V okrovém pásu Martinova e-shopu vede nápis „Martin Kos“ na Martinovu stránku (Sami, listopad 2026).
- [x] Na stránce Martinova výrobku vyjíždí ze strany panel s jeho třemi kategoriemi jako v e-shopu (Sami, listopad 2026).
- [ ] Ve fázi 7 přesměrovat dosavadní adresy Martinových kategorií (`/kolekce/martin-kos/konve-solitery/`, `…/cajove-soupravy/`, `…/hrnky-s-plastickym-dekorem/` a `…/hrnek-maly|stredni|velky/`) na nové.
- [ ] Úvodní stránka podle `kosovi_homepage.pdf`: v PDF není claim („Od modrobílého porcelánu…“), proto na stránce teď chybí. Vrátit ho?
- [x] Hlavička podle druhého `kosovi_homepage.pdf` (Sami, listopad 2026): Porcelán Kosovi vede na úvod, Modrobílý porcelán do e-shopu, Daniela a Martin na jejich stránky, vše ve stejné velikosti jako zbytek webu (16 px z PDF bylo moc, Sami, listopad 2026). „Daniela a Martin Kosovi“ z hlavičky zmizelo. Košík se v menu objeví, jen když v něm něco je.
- [x] Patička: třetí sloupec s právními odkazy odstraněn, stránky zatím nemají text (Sami, listopad 2026). Odkazy (obchodní podmínky, ochrana osobních údajů, reklamace a odstoupení) vrátit do patičky, až budou texty; objednávkový formulář na obchodní podmínky odkazovat musí.
- [x] Úvodní stránka: video vede na Danielinu stránku, černé konvice na Martinovu, tlačítko pro zastavení videa odstraněno (Sami, listopad 2026). Návštěvníkům s omezeným pohybem (`prefers-reduced-motion`) se video nespustí.
- [x] Úvodní stránka podle druhého `kosovi_homepage.pdf` (Sami, listopad 2026): místo zeleného pásu s pěti hrnky a cenami jsou na zeleném pásu fotky jídelní soupravy a konvice s rybami, fotka se snídaní vypadla. Fotky jsou vyříznuté z PDF.
- [ ] Kurzy: formát, délka, cena, dárkový poukaz.
- [ ] Newsletter: poskytovatel, nebo vůbec?
- [ ] Kdo má přístup k hostingu Wedos, doméně a administraci WordPressu?
- [ ] Hosting: Cloudflare Pages (podle CLAUDE.md), nebo Cloudflare Workers se statickými soubory, které Cloudflare teď doporučuje pro nové projekty?
- [x] Písmo, barvy a typografická škála: podle návrhu (docs/design), písmo Moment (dříve Inter ExtraBold).

## Chybějící fakta

- [x] Společná fotografie manželů: z `kosovi_o_nas.pdf` (Sami, listopad 2026), 2 118 × 1 427 px.
- [ ] Fotografie z dílny.
- [ ] Fotografie a popisky volné tvorby Martina i Daniely (stránky „Volné“).
- [x] Instagram: `porcelan.kosovi`, odkaz v patičce.
- [ ] CV Martina, výstavy obou.

- [ ] Martin: „přes 25 let pracuje pouze s porcelánem“ je údaj z webu z roku 2020. Aktualizovat.
- [ ] Martin: Galerie Svatoš uvádí třetí generaci hrnčířů a tenkostěnný porcelán s drobnými otvory (krajkový vzor). Použít?
- [ ] Jak pracuje Martin a jak Daniela, vlastními slovy (stránky autorů).
- [x] Jak vzniká modrobílý porcelán: Samiho text na stránce O nás (technický porcelán, dva výpaly, malba voskem, ponoření do kobaltu a do průhledné glazury, druhý výpal na 1 380 °C v plynové peci).
- [ ] O nás: výstavy obou autorů, sbírky s Martinovými pracemi (v `kosovi_o_nas.pdf` nejsou).
- [ ] Popis každé kolekce (kdo, technika, materiál).
- [ ] Rozměry: import převzal výšku (299), průměr (141) a objem (167) z popisů. Technika a péče u produktů chybí úplně.
- [ ] Sady: data neříkají, které kusy patří k sobě. Stránka produktu zatím ukazuje kusy ze stejné kategorie.
- [ ] Zástupný text WordPressu v popisu: `hrnek-s-rybkami`, `hrnek-se-spiralou`. Tyto dva produkty nemají ani kategorii.
- [ ] Bez popisu 15 produktů, jen jedna fotografie 357 produktů. `porcelanovy-panak-s-dvema-srdci` nemá fotku ani ve starém e-shopu, proto je zatím skrytý (Sami, listopad 2026): produkt bez fotky se na webu neukazuje, s fotkou se vrátí sám. Do té doby přesměrovat jeho starou adresu (fáze 7). Podrobnosti v `scripts/data/import-report.md`.
- [ ] Varianty (barva očí) u 35 produktů Daniely: jak je nabízet v košíku (fáze 5).
- [ ] Texty obchodních podmínek, ochrany osobních údajů a reklamačního řádu.
- [ ] Nové fotografie (focení se plánuje). Pro produkt 4–6 záběrů včetně měřítka a detailu malby.

## Před spuštěním

- [ ] Odstranit poznámky k náhledu (`src/components/wire/`) a stránku `/struktura/`.
- [ ] Odstranit lištu náhledu a `noindex` (řídí je proměnná `PUBLIC_PREVIEW_LABEL`, v produkci se nenastavuje).
- [ ] Projít další fotky produktů (druhá a další fotka vedle hlavní): starý e-shop některým produktům přiřadil fotky jiných kusů (hrnek bílý s kolem, opraveno). Sami to chce projít až na konec.
