# Kresby pro menu e-shopu

Čárové kresby v měřítku pro úvod e-shopu podle
`docs/design/kosovi_eshop_vektory.pdf` (Sami, listopad 2026): pro každou
záložku jeden okrový pás s pravítkem a podlahou, kresby jsou Samiho vektory.

`pdf_vectors.py` vytáhne z PDF každou kresbu jako SVG do
`src/assets/silhouettes/<název>.svg`. Název se uvádí u položky menu
v `src/config/lines.ts` (`silhouette`).

- Velikost kresby (viewBox) je v centimetrech podle pravítka v PDF
  (20 cm od podlahy ke značce 20 cm).
- `data-axis`: osa těla v cm od levé hrany, popisek se na ni centruje.
- `data-floor`: podlaha v cm od horní hrany. Hrnky, konve a misky stojí
  spodní elipsou přes podlahu, talíře a podšálky (kreslené shora) na ní.
- `data-x`: levá hrana kresby v cm od pravítka, tak jak ji klade PDF.
- Vyplněné plochy mají třídu `f` (vybraný druh je vybarví tmavě modře,
  `--color-select`), vnitřky (otvor hrnku a mlíčenky, okraj misky, horní
  elipsa bábovky, podšálek espressa) třídu `i` (zůstávají v barvě pásu).
  Talíře a podšálky se vybarví celé, žebra bábovek jsou jen čáry.
- Hrnek espresso má kresbu z `kosovi_eshop_2.pdf` (Sami, listopad 2026),
  uloženou tady jako `hrnek-espresso.svg`; skript ji jen postaví na místo
  espressa z nového PDF.

Indexy kreseb v PDF a jejich druhy jsou na začátku skriptu (`BANDS`). Když
Sami pošle nové PDF, je potřeba je projít znovu.

```
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python pdf_vectors.py ../../docs/design/kosovi_eshop_vektory.pdf ../../src/assets/silhouettes
```

Dřívější kresby (hrnky z `kosovi_eshop_2.pdf`, ostatní kusy narýsované podle
fotek) a jejich skripty jsou v historii gitu.
