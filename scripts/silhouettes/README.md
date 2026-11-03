# Siluety pro menu e-shopu

Čárové kresby v měřítku pro menu podle `docs/design/kosovi_eshop_2.pdf`.
Velikost kresby (viewBox) je v centimetrech, spodní hrana je podlaha.
Výstup: `src/assets/silhouettes/<název>.svg`, název se uvádí u položky menu
v `src/config/lines.ts` (`silhouette`).

- `pdf_mugs.py`: hrnky převzaté přímo z PDF, přepočtené podle pravítka
  v PDF (čáry 0, 10 a 20 cm).
- `draw.py`: ostatní kusy (konvice, cukřenky, mlíčenky, podšálky,
  bábovky, panák), nakreslené stejným stylem. Proporce jsou z fotek,
  rozměry z dat produktů. Ucho je stejné jako u hrnků v PDF.

```
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python pdf_mugs.py ../../docs/design/kosovi_eshop_2.pdf ../../src/assets/silhouettes
python3 draw.py ../../src/assets/silhouettes
```
