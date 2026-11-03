"""Pull the mug silhouettes out of docs/design/kosovi_eshop_2.pdf as SVG, one per type.

The paths stay in PDF points, scaled to centimetres by the chart's own ruler
(0, 10 and 20 cm lines), so the viewBox is the drawing's size in cm like the
other silhouettes. Every SVG ends at the 0 cm line, the floor.

Each part is its own path, painted back to front: the body with the handle
(its opening cut out, so the ruler shows through it), then the rim on top.
The espresso cup is turned so its handle points left like the others, and
its saucer keeps its whole front edge. data-axis is the body's axis in cm
from the left edge, for centring the drawing over its label.

Usage: python -I pdf_mugs.py <kosovi_eshop_2.pdf> <out dir>
"""
import sys

import fitz

BASE = 374.7  # 0 cm line
PT_PER_CM = (374.7 - 196.8) / 20

# drawing index in the PDF; parts in the PDF's order
MUGS = {
    'pitny-rezim': 18, 'hrnek-velky': 17, 'hrnek-stredni': 15, 'hrnek-uzky': 16,
    'hrnek-siroky': 13, 'hrnek-mini': 14,
}
ESPRESSO = 20  # parts: saucer foot, cup with handle, rim, saucer, handle opening


def subpaths(d, ox, oy):
    """The drawing's subpaths as SVG path data, and the points of each."""
    subs, points = [], []
    last = None
    f = lambda p: f'{p.x - ox:.2f} {p.y - oy:.2f}'
    for it in d['items']:
        a = it[1]
        if last is None or abs(last.x - a.x) > 0.01 or abs(last.y - a.y) > 0.01:
            subs.append(['M' + f(a)])
            points.append([a])
        if it[0] == 'l':
            subs[-1].append('L' + f(it[2]))
            last = it[2]
        elif it[0] == 'c':
            subs[-1].append('C' + ' '.join(f(p) for p in it[2:5]))
            last = it[4]
        points[-1].append(last)
    return [''.join(s) for s in subs], points


def svg(w, h, parts, axis, flip=False):
    k = 1 / PT_PER_CM
    group = f'scale({k:.6f})' + (f' translate({w:.2f} 0) scale(-1 1)' if flip else '')
    body = ''.join(
        f'<path class="f" d="{d}"{" fill-rule=\"evenodd\"" if evenodd else ""} vector-effect="non-scaling-stroke"/>'
        for d, evenodd in parts
    )
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w * k:.3f} {h * k:.3f}" '
            f'data-axis="{axis * k:.3f}" fill="#fff" stroke="currentColor" stroke-width="1" '
            f'stroke-linejoin="round"><g transform="{group}">{body}</g></svg>')


def frame(ds):
    x0 = min(d['rect'].x0 for d in ds) - 1
    x1 = max(d['rect'].x1 for d in ds) + 1
    y0 = min(d['rect'].y0 for d in ds) - 1
    return x0, y0, x1 - x0, BASE + 0.6 - y0


def main():
    doc = fitz.open(sys.argv[1])
    out = sys.argv[2]
    drawings = doc[0].get_drawings()
    for name, i in MUGS.items():
        d = drawings[i]
        x0, y0, w, h = frame([d])
        (rim, hole, body), pts = subpaths(d, x0, y0)
        rim_x = [p.x - x0 for p in pts[0]]
        axis = (min(rim_x) + max(rim_x)) / 2
        parts = [(body + hole, True), (rim, False)]
        open(f'{out}/{name}.svg', 'w').write(svg(w, h, parts, axis))
    d = drawings[ESPRESSO]
    x0, y0, w, h = frame([d])
    (foot, cup, rim, saucer, hole), pts = subpaths(d, x0, y0)
    rim_x = [p.x - x0 for p in pts[2]]
    axis = w - (min(rim_x) + max(rim_x)) / 2  # mirrored
    parts = [(foot, False), (saucer, False), (cup + hole, True), (rim, False)]
    open(f'{out}/hrnek-espresso.svg', 'w').write(svg(w, h, parts, axis, flip=True))


main()
