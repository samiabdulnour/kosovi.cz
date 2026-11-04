# Optické srovnání fotek produktů

Fotky (1200 × 1600 px, světlé pozadí) srovná tak, aby kusy jednoho typu
(kategorie a podkategorie ze starého e-shopu) byly v e-shopu stejně velké
a stály na stejné linii.

- Hrnky (`--by height`): stejná výška, horní i spodní okraj na jedné linii,
  tělo hrnku na stejné svislé ose. Hrnek jiného tvaru (nižší a širší) se
  zvětší jen tak, aby nebyl o víc než 10 % širší než ostatní.
- Misky, talíře, konvice, cukřenky, mlíčenky (`--by width`): stejná šířka
  (průměr, rozpětí od hubičky k uchu), spodní okraj na jedné linii. Výška
  tu spolehlivá není, víčko a ratanové ucho ji mění.

- Panáky (`--by height --no-shape-cap --axis box`): všechny stejně vysoké,
  i když jsou na fotce tři vedle sebe, a na středu podle celého obrysu
  (zadní sklenička trojice stojí výš, spodek proto osu neurčí).
- Konvice navíc `--fit-top 90`: celý typ se zmenší tak, aby ratanové ucho
  končilo aspoň 90 px pod horním okrajem dlaždice v e-shopu (dlaždice
  260 × 302 ořízne z fotky 3 : 4 kus nahoře i dole).

Posouvá se jen první fotka produktu (`__01`, ta v e-shopu), ostatní se
zkopírují beze změny. Beze změny zůstanou i typy s méně než třemi kusy,
typy uvedené v `--skip` a typy, které se shodují v rámci `--tolerance`.

Vstupní soubory se jmenují `<slug>__<NN>.jpg`, výstup patří do
`src/assets/products/<slug>/<NN>.jpg`. Pracujte vždy z původních fotek,
ne z už srovnaných.

```
python3 -m venv .venv && .venv/bin/pip install numpy scipy pillow
.venv/bin/python mugbox.py <fotky> boxes.json kontrola.jpg
# hrnky (srovnají se i další fotky produktu: --all)
.venv/bin/python normalize.py <fotky> boxes.json ../../src/content/products <výstup> --by height --all
# misky, talíře, cukřenky, mlíčenky
.venv/bin/python normalize.py <fotky> boxes.json ../../src/content/products <výstup> \
  --by width --skip panaky/- babovky/- konvice- --tolerance 0.03
# konvice
.venv/bin/python normalize.py <fotky> boxes.json ../../src/content/products <výstup> \
  --by width --only konvice- --min-group 2 --fit-top 90
# panáky
.venv/bin/python normalize.py <fotky> boxes.json ../../src/content/products <výstup> \
  --by height --only panaky/ --no-shape-cap --axis box
```

`kontrola.jpg` ukazuje nalezené obrysy (červeně), osu podle spodku (zeleně)
a nejvyšší bod včetně ratanového ucha (oranžově).
Bílé předměty (bábovky, bílé podšálky) skript na světlém pozadí nenajde.
