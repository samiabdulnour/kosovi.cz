# Import ze starého webu

Vygenerováno skriptem `scripts/import-wp.ts`. Zdroj: veřejné Store API WooCommerce a WordPress REST API na kosovi.cz.

## Počty

Celkem 416 produktů.

| Řada | Import | Starý e-shop |
|---|---|---|
| Modrobílý porcelán | 294 | 294 |
| Martin | 37 | 37 |
| Daniela | 85 | 85 |

| Řada / kategorie | Produktů |
|---|---|
| daniela/dekory | 38 |
| daniela/design | 41 |
| daniela/obklady | 1 |
| daniela/obrazky | 5 |
| martin/(bez kategorie) | 2 |
| martin/cajove-soupravy | 4 |
| martin/hrnky-s-plastickym-dekorem | 18 |
| martin/konve-solitery | 9 |
| martin/vazy | 4 |
| spolecna/babovky | 3 |
| spolecna/cukrenky | 9 |
| spolecna/hrnky | 155 |
| spolecna/konvice-kulate | 8 |
| spolecna/konvice-rovne | 30 |
| spolecna/misky | 49 |
| spolecna/misy | 1 |
| spolecna/mlicenky | 8 |
| spolecna/panaky | 17 |
| spolecna/podsalky | 2 |
| spolecna/talire | 12 |

## Mezery v datech

- Bez fotografie (1): `porcelanovy-panak-s-dvema-srdci`
- Jen jedna fotografie: 357 produktů. Stránka produktu počítá se 4–6 záběry, takže je potřeba nové focení.
- Bez popisu (15): `hrnek-na-presso-s-kotvou-2`, `hrnek-na-presso-s-kotvou`, `vaza-s-vazkami`, `cajova-souprava-5`, `cajova-souprava-4`, `cajova-souprava-3`, `cajova-souprava-1`, `konvice-modra`, `konvice-s-dekorem`, `konvice-s-plastickym-dekorem`, `konvice-zelena-2`, `konvice-zelena-1`, `konvice-bila`, `konvice-zelena-s-plastickym-dekorem`, `konvice-modra-s-plastickym-dekorem`
- Bez kategorie (2): `hrnek-s-rybkami`, `hrnek-se-spiralou`
- Rozměry převzaté z popisu (jen řádky s jednou hodnotou, např. „Výška cca 9cm“): výška 299, průměr 141, objem 167. Rozsahy, sady a „Rozměr 20 x 30 cm“ zůstaly jen v textu popisu.
- Technika a péče (myčka, mikrovlnka) nejsou u produktů uvedené, pole zůstala prázdná.
- Kdo kus vyrobil: v datech prázdné, platí výchozí autoři řady v `src/config/lines.ts`.

## Neobvyklé

- Zástupný text z WordPressu v popisu (2): `hrnek-s-rybkami`, `hrnek-se-spiralou` („Zde krátký popis produktu“, „Detailní popis výrobku“). Importováno beze změny.
- Cena 0 Kč a nejde koupit, importováno jako „cena na dotaz“ (3): `obklad-na-objednavku`, `jidelni-servis-na-objednavku`, `jidelni-souprava`
- Produkty s volbou varianty, např. barva očí (35): `vesak-velka-kocka-s-modryma-ocima`, `vesak-velka-kocka-se-zelenyma-ocima`, `vesak-velka-kocka-s-fialkovyma-ocima`, `vesak-velka-kocka-s-oranzovyma-ocima`, `vesak-uzke-zvire-s-modryma-ocima`, `vesak-stredni-kocka-s-modryma-ocima`, `vesak-stredni-kocka-se-zlutyma-ocima`, `vesak-male-zvire-s-modryma-ocima`, `vesak-male-zvire-se-tyrkysovyma-ocima`, `vesak-male-zvire-se-oranzovyma-ocima`, `vesak-mala-kocka-se-zlutyma-ocima`, `vesak-mala-kocka-se-zelenyma-ocima`, `vesak-mala-kocka-s-fialovymi-a-olivovymi-skvrnami`, `vesak-mala-kocka-s-fialovymi-skvrnami`, `uchytka-medvidek-cervene-oci`, `uchytka-medvidek-fialove-oci`, `uchytka-medvidek-olivove-oci`, `uchytka-medvidek-svetle-modre-oci`, `uchytka-medvidek-zelene-oci`, `uchytka-medvidek-zlute-oci`, `uchytka-kocka-oranzove-oci`, `uchytka-kocka-cervene-oci`, `uchytka-kocka-svetle-modre-oci`, `uchytka-kocka-stredne-modre-oci`, `uchytka-kocka-tmave-modre-oci`, `uchytka-kocka-zlute-oci`, `vesak-velke-zvire-ii`, `vesak-velke-zvire`, `vesak-uzke-zvire-se-zlutyma-ocima`, `vesak-male-zvire-se-skvrnami`, `vesak-velka-kocka-s-napisy`, `vesak-stredni-kocka-s-fialovyma-ocima`, `vesak-mala-kocka-s-modrymi-skvrnami`, `uchytka-medvidek-oranzove-oci`, `uchytka-kocka-zelene-oci`. Uloženo v poli `options`, košík s tím musí počítat (fáze 5).
- Sklad: 198 produktů má evidované množství (z toho 74 vyprodaných), 218 je skladem bez evidence množství (`stock: null`). Na objednávku (backorder): `obklad-na-objednavku`, `jidelni-servis-na-objednavku`
- 309 popisů uvádí výpal „2x při 1400°C“, stránka O nás uvádí „až 1380 °C“. Které číslo platí?
- Kategorie „PODŠÁLKY A ODKÁDÁTKA“ má v názvu překlep, na novém webu „Podšálky a odkládátka“.
- 48 fotografií WordPress při nahrání zmenšil na 2560 px (soubory „-scaled“). Importovaná je tato verze, pro web stačí. Originály (asi 150 MB) se dají stáhnout dodatečně.
- Stránky: importováno 5 (`daniela-kosova`, `martin-kos`, `modrobily-porcelan`, `o-nas`, `ochrana-osobnich-udaju`). Systémové stránky e-shopu a ukázková stránka WordPressu vynechány. Samostatná stránka s obchodními podmínkami na starém webu není, „Zásady ochrany osobních údajů“ obsahují i podmínky prodeje.
- Text stránky O nás obsahuje výrazy, které nová pravidla pro texty zakazují („unikátní“, „100% originál“, „nejkvalitnější“). Je importovaný beze změny jako podklad, finální text vznikne ve fázi 4.
