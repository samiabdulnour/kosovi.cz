"""Pull the e-shop's drawings out of docs/design/kosovi_eshop_vektory.pdf (Sami,
November 2026) as SVG, one per kind, with their place in the size chart.

The PDF has one ochre band per tab, each with a ruler at the left (short
10, 20 and 30 cm ticks) and a floor line. Every drawing is a closed shape
filled with the band's colour and stroked white. Here each one is cut into
parts so the chosen kind can be filled dark blue (class f) while its inside
(the opening of a cup or a jug, a bowl's rim, the top of a bábovka; class i)
keeps the band's colour, as before (Sami, November 2026). Plates and saucers
fill whole (Sami, November 2026).

The espresso cup keeps its drawing from kosovi_eshop_2.pdf (Sami, November
2026: the new one's saucer looked wrong), kept here as hrnek-espresso.svg;
the script only places it, its axis where the new PDF has the cup's.

The viewBox is the drawing's size in cm (the band's own ruler: 20 cm from the
floor to the 20 cm tick). Attributes for the chart (src/components/ShopMenu.astro):
  data-axis   the body's axis, cm from the drawing's left edge (the label
              centres on it)
  data-floor  the floor line, cm from the drawing's top (3D pieces stand
              with their base ellipse across it, plates and saucers on it)
  data-x      the drawing's left edge, cm from the ruler, as placed in the PDF

Usage: python -I pdf_vectors.py <kosovi_eshop_vektory.pdf> <out dir>
"""
import os
import re
import sys

import fitz

# per band: floor y, 20 cm tick y, ruler x, and kind -> drawing indices
BANDS = [
    (328.1, 150.2, 282.3, {
        'pitny-rezim': [55], 'hrnek-velky': [54], 'hrnek-stredni': [52], 'hrnek-uzky': [53],
        'hrnek-siroky': [50], 'hrnek-mini': [51], 'hrnek-espresso': [56, 57],
    }),
    (787.6, 609.7, 282.3, {
        'talir-zavesny': [58, 67], 'talir-praktik': [59, 66], 'talir-jidelni': [60, 64],
        'talir-desertni': [61, 65], 'talir-polevkovy': [62, 63],
    }),
    (1251.6, 1073.7, 282.3, {'misa-salatova': [68], 'miska-polevkova': [69], 'miska-mala': [70]}),
    (1713.4, 1535.5, 281.6, {
        'konev-rovna-velka': [49], 'konev-kulata-velka': [46], 'konev-rovna-stredni': [48],
        'konev-kulata-stredni': [45], 'konev-rovna-mala': [47], 'konev-kulata-mala': [44],
    }),
    (2176.3, 1998.4, 281.6, {
        'cukrenka-velka': [71], 'cukrenka-mala': [72], 'mlicenka-velka': [74], 'mlicenka-mala': [73],
    }),
    (2639.2, 2461.3, 281.6, {
        'babovka-velka': [75], 'babovka-mala': [76], 'podsalek-velky': [77, 79],
        'podsalek-maly': [78, 80], 'panak': [81],
    }),
]
# the line over the plates of a dinner set, and its ends
SET_LINE = 8


class Sub:
    """One subpath: its segments in PDF points and points along it."""

    def __init__(self, start):
        self.start = start
        self.segs = []  # ('l', p) or ('c', p1, p2, p3)
        self.pts = [start]

    @property
    def end(self):
        return self.pts[-1]

    @property
    def closed(self):
        return len(self.segs) > 0 and abs(self.start.x - self.end.x) < 0.05 and abs(self.start.y - self.end.y) < 0.05

    def box(self):
        xs = [p.x for p in self.pts]
        ys = [p.y for p in self.pts]
        return min(xs), min(ys), max(xs), max(ys)

    def area(self):
        x0, y0, x1, y1 = self.box()
        return (x1 - x0) * (y1 - y0)

    def cx(self):
        x0, _, x1, _ = self.box()
        return (x0 + x1) / 2


def bezier(p0, p1, p2, p3, n=24):
    out = []
    for k in range(1, n + 1):
        t = k / n
        u = 1 - t
        out.append(fitz.Point(
            u ** 3 * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t ** 3 * p3.x,
            u ** 3 * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t ** 3 * p3.y,
        ))
    return out


def subpaths(drawing):
    """Split at every move, and where a subpath returns to its start and goes
    on (a bowl's rim drawn in one stroke with its body)."""
    subs = []
    for it in drawing['items']:
        if it[0] == 're':
            r = it[1]
            s = Sub(fitz.Point(r.x0, r.y0))
            for p in (fitz.Point(r.x1, r.y0), fitz.Point(r.x1, r.y1), fitz.Point(r.x0, r.y1), fitz.Point(r.x0, r.y0)):
                s.segs.append(('l', p))
                s.pts.append(p)
            subs.append(s)
            continue
        a = it[1]
        if not subs or subs[-1].closed or abs(subs[-1].end.x - a.x) > 0.01 or abs(subs[-1].end.y - a.y) > 0.01:
            subs.append(Sub(a))
        s = subs[-1]
        if it[0] == 'l':
            s.segs.append(('l', it[2]))
            s.pts.append(it[2])
        elif it[0] == 'c':
            s.segs.append(('c', it[2], it[3], it[4]))
            s.pts += bezier(it[1], it[2], it[3], it[4])
    return subs


def from_items(items):
    """One subpath from a run of segments (lines and curves) that join up."""
    s = Sub(items[0][1])
    for it in items:
        if it[0] == 'l':
            s.segs.append(('l', it[2]))
            s.pts.append(it[2])
        else:
            s.segs.append(('c', it[2], it[3], it[4]))
            s.pts += bezier(it[1], it[2], it[3], it[4])
    return s


def bowl(items):
    """A bowl is drawn in one stroke: the rim's back, its front right half out
    and back, the body from right to left, the front left half out and back.
    Rebuilt as the body closed by the rim's front (f) and the whole rim (i)."""
    back, right_out, right_in, *body, left_out, left_in = items
    return from_items([*body, left_out, right_in]), from_items([back, right_out, left_in])


def d_of(subs, ox, oy):
    f = lambda p: f'{p.x - ox:.2f} {p.y - oy:.2f}'
    out = ''
    for s in subs:
        out += 'M' + f(s.start)
        for seg in s.segs:
            out += ('L' + f(seg[1])) if seg[0] == 'l' else ('C' + ' '.join(f(p) for p in seg[1:]))
        if s.closed:
            out += 'Z'
    return out


def parts_of(kind, subs):
    """(subpaths, class, evenodd) back to front, and the axis in PDF points."""
    by_area = sorted(subs, key=lambda s: -s.area())
    closed = [s for s in by_area if s.closed]
    if kind == 'hrnek-espresso':
        foot_rect, foot_arc, cup, rim, saucer, hole = subs
        return [([foot_rect, foot_arc], 'i', False), ([saucer], 'i', False), ([cup, hole], 'f', True), ([rim], 'i', False)], rim.cx()
    if kind.startswith(('hrnek', 'pitny')):
        rim, hole, body = subs
        return [([body, hole], 'f', True), ([rim], 'i', False)], rim.cx()
    if kind.startswith(('talir', 'podsalek')):
        outer, inner = by_area
        return [([outer], 'f', False), ([inner], 'f', False)], outer.cx()
    if kind.startswith(('misa', 'miska')):
        body, rim = subs
        return [([body], 'f', False), ([rim], 'i', False)], rim.cx()
    if kind.startswith('konev'):
        body = by_area[0]
        rest = [s for s in subs if s is not body]
        lid = min(rest, key=lambda s: s.box()[1])
        hole = next(s for s in rest if s is not lid)
        return [([body, hole], 'f', True), ([lid], 'f', False)], lid.cx()
    if kind.startswith('cukrenka'):
        body, lid = by_area
        return [([body], 'f', False), ([lid], 'f', False)], lid.cx()
    if kind.startswith('mlicenka'):
        body = by_area[0]
        rest = [s for s in subs if s is not body]
        top = min(rest, key=lambda s: s.box()[1])
        hole = next(s for s in rest if s is not top)
        return [([body, hole], 'f', True), ([top], 'i', False)], top.cx()
    if kind.startswith('babovka'):
        rim, inner = closed[0], closed[1]
        axis = rim.cx()
        small = [s for s in closed[2:]]
        tube_top = min(small, key=lambda s: abs(s.cx() - axis))
        holes = [s for s in small if s is not tube_top]
        tube_sides = [s for s in subs if not s.closed and (s.box()[2] - s.box()[0]) < 6 and abs(s.cx() - axis) < 25]
        rest = [s for s in subs if s not in [rim, inner, tube_top, *holes, *tube_sides]]
        body = max(rest, key=lambda s: s.area())
        flutes = [s for s in rest if s is not body]
        # the body filled, its flutes as lines over it; the top ellipse (rim,
        # opening and the tube inside it) and the handles' holes left in the
        # band's colour
        parts = [([body], 'f', False), (flutes, 'line', False)]
        if holes:
            parts.append((holes, 'i', False))
        parts += [([rim], 'i', False), ([inner], 'i', False), ([*tube_sides, tube_top], 'i', False)]
        return parts, axis
    if kind == 'panak':
        top, body = subs
        return [([body], 'f', False), ([top], 'i', False)], top.cx()
    raise ValueError(kind)


def place_kept(path, out_path, axis_at, k):
    """A drawing kept by hand (it ends at the floor): add where it stands."""
    svg = open(path).read()
    w, h = (float(v) for v in re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
    axis = float(re.search(r'data-axis="([\d.]+)"', svg).group(1))
    floor = h - 0.6 / k  # its frame reaches 0.6 points under the floor
    svg = svg.replace(f'data-axis="{axis:.3f}"', f'data-axis="{axis:.3f}" data-floor="{floor:.3f}" data-x="{axis_at - axis:.3f}"')
    open(out_path, 'w').write(svg)
    print(f'{os.path.basename(out_path)[:-4]:22s} {w:6.2f} x {h:5.2f} cm  at {axis_at - axis:6.2f} cm  axis {axis:5.2f} (kept)')


def main():
    doc = fitz.open(sys.argv[1])
    out = sys.argv[2]
    drawings = doc[0].get_drawings()
    for floor, tick20, ruler, kinds in BANDS:
        k = (floor - tick20) / 20  # points per cm
        for kind, idx in kinds.items():
            if kind.startswith(('misa', 'miska')):
                subs = list(bowl(drawings[idx[0]]['items']))
            else:
                subs = [s for i in idx for s in subpaths(drawings[i])]
            parts, axis = parts_of(kind, subs)
            pts = [p for s in subs for p in s.pts]
            pad = 0.6
            x0 = min(p.x for p in pts) - pad
            y0 = min(p.y for p in pts) - pad
            x1 = max(p.x for p in pts) + pad
            y1 = max(p.y for p in pts) + pad
            body = ''
            for group, cls, evenodd in parts:
                rule = ' fill-rule="evenodd"' if evenodd else ''
                paint = ' fill="none"' if cls == 'line' else f' class="{cls}"'
                body += f'<path{paint} d="{d_of(group, x0, y0)}"{rule} vector-effect="non-scaling-stroke"/>'
            if kind == 'hrnek-espresso':
                here = os.path.dirname(os.path.abspath(__file__))
                place_kept(os.path.join(here, 'hrnek-espresso.svg'), f'{out}/{kind}.svg', (axis - ruler) / k, k)
                continue
            svg = (
                f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {(x1 - x0) / k:.3f} {(y1 - y0) / k:.3f}" '
                f'data-axis="{(axis - x0) / k:.3f}" data-floor="{(floor - y0) / k:.3f}" data-x="{(x0 - ruler) / k:.3f}" '
                f'fill="#fff" stroke="currentColor" stroke-width="1" stroke-linejoin="round" stroke-linecap="round">'
                f'<g transform="scale({1 / k:.6f})">{body}</g></svg>'
            )
            open(f'{out}/{kind}.svg', 'w').write(svg)
            print(f'{kind:22s} {(x1 - x0) / k:6.2f} x {(y1 - y0) / k:5.2f} cm  at {(x0 - ruler) / k:6.2f} cm  axis {(axis - x0) / k:5.2f}')
    line = drawings[SET_LINE]['rect']
    floor, tick20, ruler, _ = BANDS[1]
    k = (floor - tick20) / 20
    print(f'set line: {(line.x0 - ruler) / k:.2f} to {(line.x1 - ruler) / k:.2f} cm, {(line.y0 - floor) / k:.2f} cm under the floor')


main()
