# Optické srovnání hrnků

Fotky hrnků (1200 × 1600 px, světlé pozadí) srovná tak, aby hrnky jednoho typu
(podkategorie ze starého e-shopu) měly stejnou výšku, horní i spodní okraj na
stejné linii a tělo hrnku na stejné svislé ose. Hrnek jiného tvaru (nižší
a širší) se zvětší jen tak, aby nebyl o víc než 10 % širší než ostatní.

Vstupní soubory se jmenují `<slug>__<NN>.jpg`, výstup patří do
`src/assets/products/<slug>/<NN>.jpg`. Pracujte vždy z původních fotek,
ne z už srovnaných.

```
python3 -m venv .venv && .venv/bin/pip install numpy scipy pillow
.venv/bin/python mugbox.py <fotky> boxes.json kontrola.jpg
.venv/bin/python normalize.py <fotky> boxes.json ../../src/content/products <výstup> plan.json
```

`kontrola.jpg` ukazuje nalezené obrysy hrnků (červeně) a osu těla (zeleně).
