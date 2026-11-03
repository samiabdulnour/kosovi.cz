"""Line silhouettes for the e-shop size chart, in the style of the mug drawings
in docs/design/kosovi_eshop_2.pdf: white fill, thin outline, a slight view from
above (rims and lids are ellipses), handles on the left.

Everything is drawn in centimetres; an SVG's viewBox is its size in cm and its
bottom edge is the floor. Proportions come from the product photos, sizes from
the product data (src/content/products). The handle is the one from the PDF
mugs, scaled.

Usage: python3 silhouettes.py <out dir>
"""
import os
import sys

E = 0.22  # ellipse ratio of rims seen from slightly above (as in the PDF mugs)
PAD = 0.15  # cm around the drawing, so the outline is not cut


def f(v):
    return f'{v:.3f}'.rstrip('0').rstrip('.')


class Drawing:
    def __init__(self, w, h):
        """w, h in cm; x from -w/2 to w/2 (0 is the axis), y down, floor at h."""
        self.w, self.h = w, h
        self.paths = []

    def p(self, x, y):
        return f'{f(x + self.w / 2 + PAD)} {f(y + PAD)}'

    def add(self, d, extra=''):
        self.paths.append(f'<path d="{d}"{extra}/>')

    # --- primitives -------------------------------------------------------
    def ellipse(self, cx, cy, rx, ry):
        return (f'M{self.p(cx - rx, cy)}A{f(rx)} {f(ry)} 0 1 0 {self.p(cx + rx, cy)}'
                f'A{f(rx)} {f(ry)} 0 1 0 {self.p(cx - rx, cy)}Z')

    def front_arc(self, cx, cy, rx, ry, left_to_right=True):
        """The near (lower) half of an ellipse."""
        if left_to_right:
            return f'A{f(rx)} {f(ry)} 0 0 0 {self.p(cx + rx, cy)}'
        return f'A{f(rx)} {f(ry)} 0 0 1 {self.p(cx - rx, cy)}'

    def handle(self, x, y_top, y_bottom, width, side=-1):
        """The PDF mug handle between two points on a wall at x."""
        hh = y_bottom - y_top
        pt = lambda u, v: self.p(x + side * u * width, y_top + v * hh)
        outer = (f'M{pt(0, 0)}C{pt(0.512, -0.093)} {pt(1.0, 0.035)} {pt(0.992, 0.284)}'
                 f'C{pt(0.975, 0.619)} {pt(0, 0.787)} {pt(0, 1.0)}')
        inner = (f'M{pt(0, 0.739)}L{pt(0, 0.152)}C{pt(0.430, 0.051)} {pt(0.686, 0.172)} {pt(0.686, 0.289)}'
                 f'C{pt(0.686, 0.464)} {pt(0, 0.651)} {pt(0, 0.739)}Z')
        # the outer stroke is closed along the wall, so the handle fills white
        return outer + f'L{pt(0, 0)}Z', inner

    def svg(self):
        w, h = self.w + 2 * PAD, self.h + 2 * PAD
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" '
                f'fill="#fff" stroke="currentColor" stroke-width="1" stroke-linejoin="round" '
                f'stroke-linecap="round">' + ''.join(
                    p.replace('/>', ' vector-effect="non-scaling-stroke"/>') for p in self.paths) + '</svg>')


# --- shapes --------------------------------------------------------------

def rattan(d, y_lid, height, half_width, thickness):
    """The rattan bail handle seen from the side: an arch with brass rings at its feet."""
    a, t = half_width, thickness
    top = y_lid - height
    bow = 0.18 * a  # the sides bow out a little

    def arch(a, top, y):
        return (f'M{d.p(-a, y)}C{d.p(-a - bow, top + (y - top) * 0.55)} {d.p(-a * 1.02, top)} {d.p(0, top)}'
                f'C{d.p(a * 1.02, top)} {d.p(a + bow, top + (y - top) * 0.55)} {d.p(a, y)}')

    outer = arch(a, top, y_lid)
    inner = arch(a - t, top + t, y_lid)
    # one closed band: out along the outer arch, back along the inner one
    inner_rev = (f'L{d.p(a - t, y_lid)}C{d.p(a - t + bow, top + t + (y_lid - top - t) * 0.55)} {d.p((a - t) * 1.02, top + t)} {d.p(0, top + t)}'
                 f'C{d.p(-(a - t) * 1.02, top + t)} {d.p(-a + t - bow, top + t + (y_lid - top - t) * 0.55)} {d.p(-a + t, y_lid)}Z')
    d.add(outer + inner_rev)
    ring_h = t * 2.0
    for x in (-a - t * 0.2, a - t * 1.05):
        y = y_lid - ring_h * 0.95
        d.add(f'M{d.p(x, y)}L{d.p(x + t * 1.25, y)}L{d.p(x + t * 1.25, y + ring_h)}L{d.p(x, y + ring_h)}Z')


def konev_rovna(H):
    """Straight teapot: cylinder, rounded white shoulder, flat lid, spout, handle, rattan bail."""
    bw = 0.61 * H
    rx = bw / 2
    ryb = E * rx
    y_sh = H - 0.72 * H  # wall top (y down)
    rl = 0.30 * bw  # lid radius
    y_neck = H - 0.93 * H
    lid_t = 0.045 * H
    y_lid = 0.0
    spout_tip = (rx + 0.70 * bw, H - 0.96 * H)
    d = Drawing(bw + 2 * 0.80 * bw, H + 0.5 * H)
    # shift everything down by the bail height
    off = 0.5 * H
    Y = lambda y: y + off
    # handle (left), drawn first so the body covers its joint
    outer, inner = d.handle(-rx, Y(H - 0.70 * H), Y(H - 0.24 * H), 0.42 * bw, -1)
    d.add(outer)
    d.add(inner)
    # spout (right)
    tx, ty = spout_tip
    d.add(f'M{d.p(rx - 0.05, Y(H - 0.84 * H))}C{d.p(rx + 0.32 * bw, Y(H - 0.84 * H))} {d.p(tx - 0.32 * bw, Y(ty + 0.05 * H))} {d.p(tx, Y(ty))}'
          f'L{d.p(tx + 0.02 * H, Y(ty + 0.035 * H))}'
          f'C{d.p(tx - 0.30 * bw, Y(ty + 0.14 * H))} {d.p(rx + 0.28 * bw, Y(H - 0.52 * H))} {d.p(rx - 0.05, Y(H - 0.56 * H))}Z')
    # body: base arc, walls, shoulder to the neck
    body = (f'M{d.p(-rx, Y(H - ryb))}' + d.front_arc(0, Y(H - ryb), rx, ryb) +
            f'L{d.p(rx, Y(y_sh))}C{d.p(rx, Y(y_sh - 0.13 * H))} {d.p(rl + 0.10 * bw, Y(y_neck + 0.02 * H))} {d.p(rl, Y(y_neck))}'
            f'L{d.p(-rl, Y(y_neck))}C{d.p(-rl - 0.10 * bw, Y(y_neck + 0.02 * H))} {d.p(-rx, Y(y_sh - 0.13 * H))} {d.p(-rx, Y(y_sh))}Z')
    d.add(body)
    # glaze line where the white shoulder meets the blue
    d.add(f'M{d.p(-rx, Y(y_sh))}' + d.front_arc(0, Y(y_sh), rx, E * rx), ' fill="none"')
    # flat lid: a disc
    rlid = rl * 1.12
    d.add(f'M{d.p(-rlid, Y(y_lid + E * rlid))}L{d.p(-rlid, Y(y_lid + E * rlid + lid_t))}' +
          d.front_arc(0, Y(y_lid + E * rlid + lid_t), rlid, E * rlid) + f'L{d.p(rlid, Y(y_lid + E * rlid))}Z')
    d.add(d.ellipse(0, Y(y_lid + E * rlid), rlid, E * rlid))
    rattan(d, Y(y_lid + E * rlid * 0.6), 0.5 * H, 0.26 * bw, 0.028 * H)
    return d


def konev_kulata(H):
    """Round teapot: egg-shaped body on a narrow foot, domed lid with a knob."""
    bw = 0.78 * H
    rmax = bw / 2
    rf = 0.30 * bw  # foot
    ryf = E * rf
    rn = 0.22 * bw  # neck
    y_max = H - 0.42 * H
    y_neck = H - 0.84 * H
    off = 0.62 * H
    Y = lambda y: y + off
    d = Drawing(bw + 2 * 0.42 * bw, H + off)
    outer, inner = d.handle(-rmax * 0.82, Y(H - 0.70 * H), Y(H - 0.32 * H), 0.38 * bw, -1)
    d.add(outer)
    d.add(inner)
    tx, ty = rmax + 0.32 * bw, H - 0.86 * H
    d.add(f'M{d.p(rmax * 0.80, Y(H - 0.66 * H))}C{d.p(rmax + 0.10 * bw, Y(H - 0.70 * H))} {d.p(tx - 0.12 * bw, Y(ty + 0.03 * H))} {d.p(tx, Y(ty))}'
          f'L{d.p(tx + 0.015 * H, Y(ty + 0.03 * H))}'
          f'C{d.p(tx - 0.10 * bw, Y(ty + 0.10 * H))} {d.p(rmax + 0.06 * bw, Y(H - 0.40 * H))} {d.p(rmax * 0.95, Y(H - 0.36 * H))}Z')
    body = (f'M{d.p(-rf, Y(H - ryf))}' + d.front_arc(0, Y(H - ryf), rf, ryf) +
            f'C{d.p(rf + 0.18 * bw, Y(H - 0.06 * H))} {d.p(rmax, Y(H - 0.22 * H))} {d.p(rmax, Y(y_max))}'
            f'C{d.p(rmax, Y(y_max - 0.24 * H))} {d.p(rn + 0.12 * bw, Y(y_neck + 0.03 * H))} {d.p(rn, Y(y_neck))}'
            f'L{d.p(-rn, Y(y_neck))}'
            f'C{d.p(-rn - 0.12 * bw, Y(y_neck + 0.03 * H))} {d.p(-rmax, Y(y_max - 0.24 * H))} {d.p(-rmax, Y(y_max))}'
            f'C{d.p(-rmax, Y(H - 0.22 * H))} {d.p(-rf - 0.18 * bw, Y(H - 0.06 * H))} {d.p(-rf, Y(H - ryf))}Z')
    d.add(body)
    # domed lid with a knob
    rl = rn * 1.05
    y_lid = y_neck + 0.01 * H
    d.add(f'M{d.p(-rl, Y(y_lid))}C{d.p(-rl, Y(y_lid - 0.07 * H))} {d.p(-0.05 * bw, Y(y_lid - 0.09 * H))} {d.p(0, Y(y_lid - 0.09 * H))}'
          f'C{d.p(0.05 * bw, Y(y_lid - 0.09 * H))} {d.p(rl, Y(y_lid - 0.07 * H))} {d.p(rl, Y(y_lid))}' +
          d.front_arc(0, Y(y_lid), rl, E * rl, left_to_right=False) + 'Z')
    kn = 0.045 * bw
    y_k = y_lid - 0.09 * H
    d.add(f'M{d.p(-kn * 0.6, Y(y_k + 0.01 * H))}L{d.p(-kn * 0.6, Y(y_k - 0.03 * H))}'
          f'C{d.p(-kn * 1.4, Y(y_k - 0.035 * H))} {d.p(-kn * 1.2, Y(y_k - 0.07 * H))} {d.p(0, Y(y_k - 0.07 * H))}'
          f'C{d.p(kn * 1.2, Y(y_k - 0.07 * H))} {d.p(kn * 1.4, Y(y_k - 0.035 * H))} {d.p(kn * 0.6, Y(y_k - 0.03 * H))}'
          f'L{d.p(kn * 0.6, Y(y_k + 0.01 * H))}Z')
    rattan(d, Y(y_lid - 0.02 * H), 0.62 * H, 0.22 * bw, 0.026 * H)
    return d


def cukrenka(body_h, diameter):
    """Sugar bowl: a drum with rounded foot, an overhanging cap lid and a knob."""
    rx = diameter / 2
    ry = E * rx
    lid_h = 0.28 * body_h
    knob_h = 0.30 * body_h
    H = body_h + lid_h + knob_h
    d = Drawing(diameter * 1.1, H)
    y_rim = H - body_h
    body = (f'M{d.p(-rx, H - ry - 0.06 * body_h)}' +
            f'C{d.p(-rx, H - ry * 0.4)} {d.p(-rx * 0.9, H)} {d.p(0, H)}'
            f'C{d.p(rx * 0.9, H)} {d.p(rx, H - ry * 0.4)} {d.p(rx, H - ry - 0.06 * body_h)}'
            f'L{d.p(rx, y_rim)}L{d.p(-rx, y_rim)}Z')
    d.add(body)
    rl = rx * 1.05
    y_lb = y_rim + 0.02 * body_h  # lid edge
    lid = (f'M{d.p(-rl, y_lb - 0.10 * body_h)}L{d.p(-rl, y_lb)}' + d.front_arc(0, y_lb, rl, E * rl) +
           f'L{d.p(rl, y_lb - 0.10 * body_h)}'
           f'C{d.p(rl, y_lb - lid_h * 0.9)} {d.p(rl * 0.35, y_lb - lid_h * 1.05)} {d.p(0, y_lb - lid_h * 1.05)}'
           f'C{d.p(-rl * 0.35, y_lb - lid_h * 1.05)} {d.p(-rl, y_lb - lid_h * 0.9)} {d.p(-rl, y_lb - 0.10 * body_h)}Z')
    d.add(lid)
    kn = 0.07 * diameter
    y_k = y_lb - lid_h * 1.0
    d.add(f'M{d.p(-kn * 0.55, y_k + 0.02 * body_h)}L{d.p(-kn * 0.55, y_k - knob_h * 0.45)}'
          f'C{d.p(-kn * 1.6, y_k - knob_h * 0.5)} {d.p(-kn * 1.3, y_k - knob_h)} {d.p(0, y_k - knob_h)}'
          f'C{d.p(kn * 1.3, y_k - knob_h)} {d.p(kn * 1.6, y_k - knob_h * 0.5)} {d.p(kn * 0.55, y_k - knob_h * 0.45)}'
          f'L{d.p(kn * 0.55, y_k + 0.02 * body_h)}Z')
    return d


def mlicenka(h, diameter):
    """Milk jug: a straight cup with a pinched lip on the right and a handle on the left."""
    rx = diameter / 2
    ry = E * rx
    lip = 0.22 * diameter
    d = Drawing(diameter + 0.55 * diameter + lip, h)
    shift = (0.55 * diameter - lip) / 2  # keep the jug centred on its body
    X = lambda x: x - shift * 0  # body stays on the axis
    outer, inner = d.handle(-rx, ry + 0.10 * h, h - 0.20 * h, 0.48 * diameter, -1)
    d.add(outer)
    d.add(inner)
    body = (f'M{d.p(-rx, ry)}L{d.p(-rx, h - ry)}' + d.front_arc(0, h - ry, rx, ry) + f'L{d.p(rx, ry)}Z')
    d.add(body)
    # rim with the lip
    d.add(f'M{d.p(-rx, ry)}A{f(rx)} {f(ry)} 0 0 1 {d.p(rx * 0.55, ry - ry * 0.83)}'
          f'C{d.p(rx * 0.9, 0)} {d.p(rx + lip * 0.7, ry * 0.2)} {d.p(rx + lip, ry * 0.55)}'
          f'C{d.p(rx + lip * 0.6, ry * 1.3)} {d.p(rx * 0.9, ry * 1.9)} {d.p(rx * 0.55, ry + ry * 0.83)}'
          f'A{f(rx)} {f(ry)} 0 0 1 {d.p(-rx, ry)}Z')
    # the lip joins the wall
    d.add(f'M{d.p(rx + lip, ry * 0.55)}C{d.p(rx + lip * 0.5, ry * 2.2)} {d.p(rx, ry * 3)} {d.p(rx, ry * 4.2)}', ' fill="none"')
    return d


def panak(h, diameter):
    """Shot glass: a slightly waisted cylinder on a foot ring."""
    rx = diameter / 2
    ry = E * rx
    foot = 0.07 * h
    d = Drawing(diameter * 1.05, h)
    body = (f'M{d.p(-rx, ry)}C{d.p(-rx * 0.94, h * 0.4)} {d.p(-rx * 0.94, h * 0.6)} {d.p(-rx * 0.98, h - foot - ry)}'
            f'L{d.p(-rx * 1.02, h - foot - ry)}L{d.p(-rx * 1.02, h - ry)}' + d.front_arc(0, h - ry, rx * 1.02, ry) +
            f'L{d.p(rx * 1.02, h - foot - ry)}L{d.p(rx * 0.98, h - foot - ry)}'
            f'C{d.p(rx * 0.94, h * 0.6)} {d.p(rx * 0.94, h * 0.4)} {d.p(rx, ry)}Z')
    d.add(body)
    d.add(f'M{d.p(-rx * 0.98, h - foot - ry)}' + d.front_arc(0, h - foot - ry, rx * 0.98, ry * 0.98), ' fill="none"')
    d.add(d.ellipse(0, ry, rx, ry))
    return d


def babovka(h, diameter):
    """Bábovka mould: a wide rim, fluted sides narrowing to the base, two lugs, the tube inside."""
    rx = diameter / 2
    ry = E * rx
    lug = 0.07 * diameter
    d = Drawing(diameter + 2 * lug, h)
    y_rim = ry
    rb = 0.66 * rx  # base
    y_b = h - E * rb
    # lugs under the rim
    for s in (-1, 1):
        x = s * rx * 0.985
        y1, y2 = y_rim + 0.10 * h, y_rim + 0.36 * h
        d.add(f'M{d.p(x, y1)}C{d.p(x + s * lug * 1.1, y1 - 0.02 * h)} {d.p(x + s * lug * 1.3, y2)} {d.p(x - s * lug * 0.1, y2 + 0.02 * h)}Z')
    # fluted body: the near half of the base is scalloped
    n = 7
    scallops = ''
    for i in range(n):
        a0 = 3.14159 * i / n
        a1 = 3.14159 * (i + 1) / n
        import math
        x0, y0 = -rb * math.cos(a0), y_b + E * rb * math.sin(a0)
        x1, y1 = -rb * math.cos(a1), y_b + E * rb * math.sin(a1)
        xm, ym = (x0 + x1) / 2, (y0 + y1) / 2 + 0.07 * h
        scallops += f'Q{d.p(xm, ym)} {d.p(x1, y1)}'
    body = (f'M{d.p(-rx, y_rim)}C{d.p(-rx, y_rim + 0.45 * h)} {d.p(-rb - 0.05 * diameter, y_b - 0.25 * h)} {d.p(-rb, y_b)}' +
            scallops +
            f'C{d.p(rb + 0.05 * diameter, y_b - 0.25 * h)} {d.p(rx, y_rim + 0.45 * h)} {d.p(rx, y_rim)}Z')
    d.add(body)
    # flutes: a few lines down the near side
    import math
    for i in range(1, n):
        a = 3.14159 * i / n
        xb, yb = -rb * math.cos(a), y_b + E * rb * math.sin(a)
        xt, yt = -rx * 0.97 * math.cos(a), y_rim + E * rx * math.sin(a) * 0.97 + 0.08 * h
        d.add(f'M{d.p(xt, yt)}Q{d.p((xt + xb) / 2 * 1.04, (yt + yb) / 2)} {d.p(xb, yb - 0.02 * h)}', ' fill="none"')
    # the rim and the inside with the central tube
    d.add(d.ellipse(0, y_rim, rx, ry))
    d.add(d.ellipse(0, y_rim + 0.01 * h, rx * 0.86, ry * 0.86), ' fill="none"')
    rt = 0.085 * rx
    d.add(f'M{d.p(-rt * 1.6, y_rim + ry * 0.55)}L{d.p(-rt, y_rim - 0.05 * h)}' + d.front_arc(0, y_rim - 0.05 * h, rt, E * rt) +
          f'L{d.p(rt * 1.6, y_rim + ry * 0.55)}')
    d.add(d.ellipse(0, y_rim - 0.05 * h, rt, E * rt))
    return d


def podsalek(diameter):
    """Saucer: a wide rim, the well for the cup, a low foot."""
    rx = diameter / 2
    ry = E * rx
    h = 0.17 * diameter  # drawn height, not a measured one
    d = Drawing(diameter, h + 2 * ry)
    y_rim = ry
    rf = 0.62 * rx
    y_f = h + ry - E * rf
    d.add(f'M{d.p(-rx, y_rim)}L{d.p(-rx, y_rim + 0.05 * h)}C{d.p(-rx * 0.95, y_rim + 0.6 * h)} {d.p(-rf * 1.2, y_f - 0.05 * h)} {d.p(-rf, y_f)}' +
          d.front_arc(0, y_f, rf, E * rf) +
          f'C{d.p(rf * 1.2, y_f - 0.05 * h)} {d.p(rx * 0.95, y_rim + 0.6 * h)} {d.p(rx, y_rim + 0.05 * h)}L{d.p(rx, y_rim)}Z')
    d.add(d.ellipse(0, y_rim, rx, ry))
    d.add(d.ellipse(0, y_rim + 0.02 * h, rx * 0.55, ry * 0.55), ' fill="none"')
    return d


SHAPES = {
    # konvice: height from the product data (without the rattan handle)
    'konev-rovna-mala': lambda: konev_rovna(15),
    'konev-rovna-stredni': lambda: konev_rovna(17),
    'konev-rovna-velka': lambda: konev_rovna(23),
    'konev-kulata-mala': lambda: konev_kulata(15),
    'konev-kulata-stredni': lambda: konev_kulata(19),
    'konev-kulata-velka': lambda: konev_kulata(23),
    # cukřenky: body height and diameter from the data; the big one by its diameter
    'cukrenka-mala': lambda: cukrenka(6, 8),
    'cukrenka-velka': lambda: cukrenka(6 * 10 / 8, 10),
    'mlicenka-mala': lambda: mlicenka(6.5, 5.5),
    'mlicenka-velka': lambda: mlicenka(9.5, 8.5),
    'podsalek-maly': lambda: podsalek(10.5),
    'podsalek-velky': lambda: podsalek(13.5),
    'babovka-mala': lambda: babovka(10, 24),
    'babovka-velka': lambda: babovka(11.5, 27.5),
    'panak': lambda: panak(6, 2.8),
}

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for name, make in SHAPES.items():
        d = make()
        open(os.path.join(out, f'{name}.svg'), 'w').write(d.svg())
        print(f'{name:22s} {d.w:5.1f} × {d.h:5.1f} cm')
