# Siluety pro menu e-shopu

Čárové kresby v měřítku pro menu podle `docs/design/kosovi_eshop_2.pdf`.
Velikost kresby (viewBox) je v centimetrech, spodní hrana je podlaha,
`data-axis` je osa těla (kresba i popisek se na ni centrují).
Výstup: `src/assets/silhouettes/<název>.svg`, název se uvádí u položky menu
v `src/config/lines.ts` (`silhouette`). Vyplněné plochy mají třídu `f`,
vybraný druh je vybarví modře (`--color-select`).

- `pdf_mugs.py`: hrnky převzaté přímo z PDF, přepočtené podle pravítka
  v PDF (čáry 0, 10 a 20 cm). Otvor v uchu je průhledný, espresso je
  otočené uchem doleva jako ostatní.
- `draw.py`: ostatní kusy (konvice, cukřenky, mlíčenky, podšálky,
  bábovky, panák) jako čistá geometrie ve stylu hrnků z PDF. Profil těla,
  ucho, hubička, víko a ratan jsou naměřené z fotek (`masks.py`,
  `measure.py`), pro každou velikost konvice zvlášť; rozměry v cm jsou
  z dat produktů.

```
python3 -m venv .venv && .venv/bin/pip install pymupdf rembg pillow numpy scipy
.venv/bin/python pdf_mugs.py ../../docs/design/kosovi_eshop_2.pdf ../../src/assets/silhouettes
python3 draw.py ../../src/assets/silhouettes
# měření nové fotky (čísla se pak přepíší do draw.py)
.venv/bin/python masks.py <složka modelu> <masky> <fotka.jpg>
.venv/bin/python measure.py <fotka.jpg> <maska.png>
```
