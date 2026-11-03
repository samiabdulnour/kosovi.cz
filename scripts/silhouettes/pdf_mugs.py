"""Pull the mug silhouettes out of docs/design/kosovi_eshop_2.pdf as SVG, one per type.

The paths stay in PDF points, scaled to centimetres by the chart's own ruler
(0, 10 and 20 cm lines), so the viewBox is the drawing's size in cm like the
other silhouettes. Every SVG ends at the 0 cm line, the floor.

Usage: python -I pdf_mugs.py <kosovi_eshop_2.pdf> <out dir>
"""
import json
import sys

import fitz

BASE = 374.7  # 0 cm line
PT_PER_CM = (374.7 - 196.8) / 20

doc = fitz.open(sys.argv[1])
out = sys.argv[2]
drawings = doc[0].get_drawings()
items = {
    'pitny-rezim': [18], 'hrnek-velky': [17], 'hrnek-stredni': [15], 'hrnek-uzky': [16],
    'hrnek-siroky': [13], 'hrnek-mini': [14], 'hrnek-espresso': [20, 19],
}


def path_d(d, ox, oy):
    parts = []
    last = None
    f = lambda p: f'{p.x - ox:.2f} {p.y - oy:.2f}'
    for it in d['items']:
        kind = it[0]
        if kind == 'l':
            a, b = it[1], it[2]
            if last is None or (abs(last.x - a.x) > 0.01 or abs(last.y - a.y) > 0.01):
                parts.append('M' + f(a))
            parts.append('L' + f(b)); last = b
        elif kind == 'c':
            a, c1, c2, b = it[1:5]
            if last is None or (abs(last.x - a.x) > 0.01 or abs(last.y - a.y) > 0.01):
                parts.append('M' + f(a))
            parts.append('C' + ' '.join(f(p) for p in (c1, c2, b))); last = b
        elif kind == 're':
            r = it[1]
            parts.append(f'M{r.x0 - ox:.2f} {r.y0 - oy:.2f}H{r.x1 - ox:.2f}V{r.y1 - oy:.2f}H{r.x0 - ox:.2f}Z'); last = None
        elif kind == 'qu':
            q = it[1]
            parts.append('M' + f(q.ul) + 'L' + f(q.ur) + 'L' + f(q.lr) + 'L' + f(q.ll) + 'Z'); last = None
    if d.get('closePath'):
        parts.append('Z')
    return ''.join(parts)


meta = {}
for name, idx in items.items():
    ds = [drawings[i] for i in idx]
    x0 = min(d['rect'].x0 for d in ds) - 1
    x1 = max(d['rect'].x1 for d in ds) + 1
    y0 = min(d['rect'].y0 for d in ds) - 1
    w, h = x1 - x0, BASE + 0.6 - y0
    body = []
    for d in ds:
        dd = path_d(d, x0, y0)
        if d.get('type') == 'f':  # a white patch without outline
            body.append(f'<path d="{dd}" fill="#fff" stroke="none"/>')
        else:
            body.append(f'<path d="{dd}" vector-effect="non-scaling-stroke"/>')
    k = 1 / PT_PER_CM
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w * k:.3f} {h * k:.3f}" '
           f'fill="#fff" stroke="currentColor" stroke-width="1" stroke-linejoin="round">'
           f'<g transform="scale({k:.6f})">{"".join(body)}</g></svg>')
    open(f'{out}/{name}.svg', 'w').write(svg)
    meta[name] = {'w': round(w, 2), 'h': round(h, 2), 'cm': round((BASE - y0 - 1) / PT_PER_CM, 1)}
print(json.dumps(meta, indent=1))
