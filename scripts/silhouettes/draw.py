"""Line silhouettes for the e-shop size chart, in the style of the mug drawings
in docs/design/kosovi_eshop_2.pdf: white fill, thin outline, a slight view from
above (rims and lids are ellipses 0.22 as high as wide), handles on the left.

The shapes are measured from the product photos (body profile, handle, spout,
lid, rattan bail; see measure.py) and drawn as clean curves. Units in this file
are the piece's height in its photo (H = 1), x from the body's axis; the
handle is on the left (x < 0), the spout on the right. Each drawing is then
scaled to centimetres from the product data. An SVG's viewBox is its size in
cm, the floor at the bottom; data-axis is the body's axis in cm from the left.

Usage: python3 draw.py <out dir>
"""
import os
import sys

E = 0.22  # ellipse ratio of rims and lids (as in the PDF mugs)
K = 0.5523  # quarter-circle Bézier constant
PAD = 0.15  # cm around the drawing


# --- a tiny path builder in y-up units -----------------------------------------

class Fig:
    def __init__(self):
        self.parts = []  # (commands, fill, evenodd)

    def add(self, cmds, fill=True, evenodd=False, inside=False):
        """fill: a white face (class f, blue when the kind is chosen); inside:
        a face seen inside the piece, which stays white (class i)."""
        self.parts.append((cmds, 'i' if inside else fill, evenodd))

    def svg(self, cm_per_unit, ceramic_top=None):
        pts = [p for cmds, _, _ in self.parts for c in cmds for p in c[1:]]
        x0 = min(p[0] for p in pts)
        x1 = max(p[0] for p in pts)
        y1 = max(p[1] for p in pts)
        s = cm_per_unit
        X = lambda x: (x - x0) * s + PAD
        Y = lambda y: (y1 - y) * s + PAD
        out = []
        for cmds, fill, evenodd in self.parts:
            d = ''
            for c in cmds:
                if c[0] == 'Z':
                    d += 'Z'
                else:
                    d += c[0] + ' '.join(f'{X(p[0]):.3f} {Y(p[1]):.3f}' for p in c[1:])
            attrs = ' class="i"' if fill == 'i' else ' class="f"' if fill else ' fill="none"'
            if evenodd:
                attrs += ' fill-rule="evenodd"'
            out.append(f'<path{attrs} d="{d}" vector-effect="non-scaling-stroke"/>')
        w, h = (x1 - x0) * s + 2 * PAD, y1 * s + 2 * PAD
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.3f} {h:.3f}" '
                f'data-axis="{X(0):.3f}" fill="#fff" stroke="currentColor" stroke-width="1" '
                f'stroke-linejoin="round" stroke-linecap="round">' + ''.join(out) + '</svg>'), w, h


def spline(points):
    """Catmull-Rom through the points (open), as C commands after points[0]."""
    cmds = []
    n = len(points)
    for i in range(n - 1):
        p0 = points[i - 1] if i > 0 else points[i]
        p1, p2 = points[i], points[i + 1]
        p3 = points[i + 2] if i + 2 < n else points[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        cmds.append(('C', c1, c2, p2))
    return cmds


def lower_half(cx, cy, rx, ry):
    """Near half of an ellipse, from its left end to its right end."""
    return [('C', (cx - rx, cy - K * ry), (cx - K * rx, cy - ry), (cx, cy - ry)),
            ('C', (cx + K * rx, cy - ry), (cx + rx, cy - K * ry), (cx + rx, cy))]


def upper_half(cx, cy, rx, ry, lift=0.0):
    """Far half of an ellipse, from its right end to its left end (lift: a dome)."""
    top = cy + ry + lift
    return [('C', (cx + rx, cy + K * (ry + lift)), (cx + K * rx, top), (cx, top)),
            ('C', (cx - K * rx, top), (cx - rx, cy + K * (ry + lift)), (cx - rx, cy))]


def ellipse(cx, cy, rx, ry):
    return [('M', (cx - rx, cy))] + lower_half(cx, cy, rx, ry) + upper_half(cx, cy, rx, ry) + [('Z',)]


def body(profile, closed_top=True):
    """A turned body: the near half of its base, its sides through the profile
    [(y, r), ...] from the base up, and the far half of its top."""
    (yb, rb), (yt, rt) = profile[0], profile[-1]
    right = [(r, y) for y, r in profile]
    left = [(-r, y) for y, r in reversed(profile)]
    cmds = [('M', (-rb, yb))] + lower_half(0, yb, rb, E * rb) + spline(right)
    cmds += upper_half(0, yt, rt, E * rt) + spline(left) + [('Z',)]
    return cmds


def handle(fig, x, y_top, y_bottom, width, x_bottom=None):
    """The handle of the PDF mugs, on the left wall at x, its opening cut out.
    On a rounded body the wall is at x where the handle starts and x_bottom
    where it ends; width is measured from x."""
    hh = y_top - y_bottom
    xb = x if x_bottom is None else x_bottom
    P = lambda u, v: (x + (xb - x) * min(max(v, 0), 1) - u * width, y_top - v * hh)
    outer = [('M', P(0, 0)), ('C', P(0.512, -0.093), P(1.0, 0.035), P(0.992, 0.284)),
             ('C', P(0.975, 0.619), P(0, 0.787), P(0, 1.0)), ('L', P(-0.3, 1.0)), ('L', P(-0.3, 0)), ('Z',)]
    inner = [('M', P(0, 0.739)), ('L', P(0, 0.152)), ('C', P(0.430, 0.051), P(0.686, 0.172), P(0.686, 0.289)),
             ('C', P(0.686, 0.464), P(0, 0.651), P(0, 0.739)), ('Z',)]
    fig.add(outer + inner, evenodd=True)


def radius_at(profile, y):
    """The body's radius at height y, from its profile [(y, r), ...]."""
    pts = sorted(profile)
    if y <= pts[0][0]:
        return pts[0][1]
    for (ya, ra), (yb, rb) in zip(pts, pts[1:]):
        if ya <= y <= yb:
            return ra + (rb - ra) * (y - ya) / (yb - ya)
    return pts[-1][1]


def spout(fig, lower, upper, profile=None):
    """A spout on the right: its lower edge from the body out to the tip, its
    upper edge from the tip back to the body (both measured), closed inside.
    The upper edge ends on the body just under its top, so it runs into the
    shoulder instead of crossing above it."""
    if profile:
        y_top = max(y for y, _ in profile)
        end_y = min(upper[-1][1], y_top - 0.02)
        upper = [p for p in upper if p[0] > radius_at(profile, p[1]) + 0.02 or p is upper[0]]
        upper.append((radius_at(profile, end_y) - 0.03, end_y))
    cmds = [('M', lower[0])] + spline(lower) + [('L', upper[0])] + spline(upper)
    cmds += [('L', (upper[-1][0] - 0.06, upper[-1][1])), ('L', (lower[0][0] - 0.06, lower[0][1])), ('Z',)]
    fig.add(cmds)


def rattan(fig, y_feet, y_top, half, thick, cx=0.0):
    """The rattan bail seen from the side: a band in an arch, brass rings at its feet."""
    def arch(a, top):
        h = top - y_feet
        return [('C', (cx - a * 1.08, y_feet + h * 0.62), (cx - a * 0.92, top), (cx, top)),
                ('C', (cx + a * 0.92, top), (cx + a * 1.08, y_feet + h * 0.62), (cx + a, y_feet))]
    outer = [('M', (cx - half, y_feet))] + arch(half, y_top)
    a2, t2 = half - thick, y_top - thick
    h2 = t2 - y_feet
    inner_back = [('L', (cx + a2, y_feet)),
                  ('C', (cx + a2 * 1.08, y_feet + h2 * 0.62), (cx + a2 * 0.92, t2), (cx, t2)),
                  ('C', (cx - a2 * 0.92, t2), (cx - a2 * 1.08, y_feet + h2 * 0.62), (cx - a2, y_feet)), ('Z',)]
    fig.add(outer + inner_back)


def rings(fig, y_feet, half, thick, cx=0.0):
    rh = thick * 1.6
    for x in (cx - half - thick * 0.15, cx + half - thick * 1.15):
        y = y_feet + thick * 0.2
        fig.add([('M', (x, y)), ('L', (x + thick * 1.3, y)), ('L', (x + thick * 1.3, y + rh)),
                 ('L', (x, y + rh)), ('Z',)])


# --- the pieces ------------------------------------------------------------------

# Straight teapots, measured per size (konev rovná malá, střední, velká)
ROVNA = {
    'mala': dict(
        walls=[(0.33, 0.330), (0.50, 0.358), (0.62, 0.362), (0.72, 0.366)],
        shoulder=[(0.78, 0.352), (0.83, 0.318), (0.87, 0.272), (0.895, 0.235)],
        lid=0.25, handle=(0.71, 0.22, 0.28),
        spout_low=[(0.356, 0.36), (0.42, 0.53), (0.48, 0.69), (0.54, 0.80), (0.60, 0.85), (0.668, 0.873)],
        spout_up=[(0.66, 0.885), (0.60, 0.915), (0.54, 0.93), (0.48, 0.895), (0.40, 0.85), (0.33, 0.82)],
        bail=(1.45, 0.135),
    ),
    'stredni': dict(
        walls=[(0.32, 0.322), (0.50, 0.344), (0.62, 0.347), (0.74, 0.350)],
        shoulder=[(0.79, 0.338), (0.84, 0.31), (0.88, 0.265), (0.905, 0.23)],
        lid=0.225, handle=(0.73, 0.22, 0.26),
        spout_low=[(0.337, 0.35), (0.40, 0.53), (0.47, 0.69), (0.53, 0.81), (0.60, 0.877), (0.665, 0.90)],
        spout_up=[(0.66, 0.912), (0.60, 0.945), (0.55, 0.95), (0.47, 0.914), (0.40, 0.871), (0.32, 0.83)],
        bail=(1.51, 0.145),
    ),
    'velka': dict(
        walls=[(0.25, 0.250), (0.45, 0.262), (0.62, 0.266), (0.76, 0.268)],
        shoulder=[(0.80, 0.248), (0.84, 0.215), (0.875, 0.185), (0.90, 0.172)],
        lid=0.155, handle=(0.78, 0.33, 0.20),
        spout_low=[(0.275, 0.36), (0.32, 0.565), (0.37, 0.69), (0.41, 0.78), (0.46, 0.835), (0.505, 0.852)],
        spout_up=[(0.50, 0.865), (0.46, 0.882), (0.42, 0.887), (0.37, 0.86), (0.32, 0.826), (0.26, 0.795)],
        bail=(1.37, 0.13),
    ),
}


def konev_rovna(p):
    f = Fig()
    r0 = p['walls'][0][1] - 0.005
    base = [(E * r0, r0), (0.10, p['walls'][0][1] - 0.002), (0.30, p['walls'][0][1])]
    prof = base + p['walls'][1:] + p['shoulder']
    y_neck, r_neck = p['shoulder'][-1]
    rl = p['lid']
    lid_side = 0.035
    top_bail, half = p['bail']
    y_lid_top = y_neck + lid_side
    rattan(f, y_lid_top + E * rl * 0.2, top_bail, half, 0.032)
    yt, yb, w = p['handle']
    handle(f, -p['walls'][1][1] + 0.01, yt, yb, w)
    spout(f, p['spout_low'], p['spout_up'][:-1], prof)
    f.add(body(prof))
    if rl < r_neck - 0.01:  # the shoulder's top shows around a smaller lid
        f.add([('M', (-r_neck, y_neck))] + lower_half(0, y_neck, r_neck, E * r_neck), fill=False)
    f.add([('M', (-rl, y_neck))] + lower_half(0, y_neck, rl, E * rl) + [('L', (rl, y_lid_top))]
          + upper_half(0, y_lid_top, rl, E * rl) + [('Z',)])
    f.add([('M', (-rl, y_lid_top))] + lower_half(0, y_lid_top, rl, E * rl), fill=False)
    rings(f, y_lid_top + E * rl * 0.2, half, 0.032)
    return f, y_lid_top + E * rl


# Round teapots, measured per size (konev kulatá malá, střední, velká)
KULATA = {
    'mala': dict(
        profile=[(0.10, 0.27), (0.20, 0.365), (0.30, 0.425), (0.40, 0.462), (0.50, 0.474), (0.60, 0.462),
                 (0.68, 0.43), (0.75, 0.38), (0.80, 0.327), (0.845, 0.26)],
        flange=0.265, dome=0.95, knob=(0.045, 0.085, 0.05),
        handle=(0.40, 0.78, 0.26, 0.36),
        spout_low=[(0.44, 0.45), (0.51, 0.64), (0.57, 0.742), (0.63, 0.79), (0.70, 0.801), (0.761, 0.806)],
        spout_up=[(0.75, 0.83), (0.70, 0.875), (0.63, 0.908), (0.57, 0.89), (0.50, 0.86), (0.40, 0.82)],
        bail=(1.57, 0.09),
    ),
    'stredni': dict(
        profile=[(0.10, 0.25), (0.20, 0.322), (0.30, 0.392), (0.40, 0.408), (0.50, 0.414), (0.60, 0.405),
                 (0.70, 0.388), (0.76, 0.36), (0.80, 0.307), (0.85, 0.248)],
        flange=0.215, dome=0.955, knob=(0.04, 0.075, 0.045),
        handle=(0.38, 0.80, 0.30, 0.25),
        spout_low=[(0.40, 0.55), (0.45, 0.735), (0.51, 0.814), (0.56, 0.861), (0.62, 0.885), (0.676, 0.896)],
        spout_up=[(0.67, 0.915), (0.62, 0.949), (0.56, 0.966), (0.50, 0.94), (0.45, 0.91), (0.38, 0.885)],
        bail=(1.52, 0.10),
    ),
    'velka': dict(
        profile=[(0.10, 0.239), (0.20, 0.311), (0.30, 0.357), (0.40, 0.392), (0.50, 0.40), (0.60, 0.393),
                 (0.70, 0.375), (0.78, 0.35), (0.84, 0.29), (0.875, 0.235)],
        flange=0.21, dome=0.965, knob=(0.04, 0.075, 0.04),
        handle=(0.37, 0.84, 0.40, 0.20),
        spout_low=[(0.37, 0.62), (0.42, 0.79), (0.47, 0.852), (0.52, 0.885), (0.58, 0.906), (0.626, 0.914)],
        spout_up=[(0.62, 0.93), (0.58, 0.968), (0.525, 0.982), (0.47, 0.955), (0.42, 0.933), (0.36, 0.91)],
        bail=(1.40, 0.095),
    ),
}


def konev_kulata(p):
    f = Fig()
    r0 = p['profile'][0][1] - 0.03
    prof = [(E * r0, r0)] + p['profile']
    y_neck, r_neck = p['profile'][-1]
    rf = p['flange']
    y_dome = p['dome']
    kst, kcap, kh = p['knob']
    top_bail, half = p['bail']
    rattan(f, y_neck + 0.03, top_bail, half, 0.028, cx=-0.01)
    hx, yt, yb, w = p['handle']
    x_top, x_bot = -radius_at(prof, yt) + 0.02, -radius_at(prof, yb) + 0.02
    handle(f, x_top, yt, yb, hx + w + x_top, x_bottom=x_bot)
    spout(f, p['spout_low'], p['spout_up'][:-1], prof)
    f.add(body(prof))
    # domed lid on a flange, a knob on top
    y_f = y_neck + 0.005
    lid = ([('M', (-rf, y_f))] + lower_half(0, y_f, rf, E * rf) +
           [('C', (rf, y_f + 0.06), (rf * 0.55, y_dome), (kst, y_dome)), ('L', (-kst, y_dome)),
            ('C', (-rf * 0.55, y_dome), (-rf, y_f + 0.06), (-rf, y_f)), ('Z',)])
    f.add(lid)
    ky = y_dome
    f.add([('M', (-kst, ky - 0.01)), ('L', (-kst, ky + kh * 0.45)),
           ('C', (-kcap * 1.1, ky + kh * 0.5), (-kcap * 0.9, ky + kh), (0, ky + kh)),
           ('C', (kcap * 0.9, ky + kh), (kcap * 1.1, ky + kh * 0.5), (kst, ky + kh * 0.45)),
           ('L', (kst, ky - 0.01)), ('Z',)])
    return f, ky + kh


def cukrenka():
    """Sugar bowl (both sizes have the same shape): a drum, an overhanging lid
    with a notch for the spoon, a mushroom knob."""
    f = Fig()
    r0 = 0.30
    prof = [(E * r0, r0), (0.12, 0.335), (0.20, 0.37), (0.35, 0.385), (0.50, 0.393), (0.60, 0.40)]
    f.add(body(prof))
    rl, yb, yt = 0.455, 0.58, 0.70
    f.add([('M', (-rl, yb))] + lower_half(0, yb, rl, E * rl) + [('L', (rl, yt))]
          + upper_half(0, yt, rl, E * rl, lift=0.03) + [('Z',)])
    f.add([('M', (-rl, yt))] + lower_half(0, yt, rl, E * rl), fill=False)
    # the notch for the spoon, cut into the lid's front edge
    import math
    edge = lambda x: yb - E * rl * math.sqrt(max(0.0, 1 - (x / rl) ** 2))
    n0, n1 = 0.17, 0.31
    f.add([('M', (n0, edge(n0))), ('C', (n0, edge(n0) + 0.06), (n1, edge(n1) + 0.06), (n1, edge(n1)))], fill=False)
    ky = yt + E * rl * 0.35 + 0.03
    kst, kcap, kh = 0.05, 0.10, 0.12
    f.add([('M', (-kst, ky - 0.02)), ('L', (-kst, ky + kh * 0.45)),
           ('C', (-kcap * 1.15, ky + kh * 0.5), (-kcap * 0.95, ky + kh), (0, ky + kh)),
           ('C', (kcap * 0.95, ky + kh), (kcap * 1.15, ky + kh * 0.5), (kst, ky + kh * 0.45)),
           ('L', (kst, ky - 0.02)), ('Z',)])
    return f, 0.40  # scaled by the body's radius


MLICENKA = {
    'mala': dict(walls=[(0.10, 0.267), (0.20, 0.30), (0.40, 0.315), (0.60, 0.324), (0.74, 0.332)],
                 rim=(0.86, 0.35), lip=0.40, handle=(0.68, 0.22, 0.31)),
    'velka': dict(walls=[(0.10, 0.282), (0.20, 0.322), (0.40, 0.327), (0.60, 0.336), (0.74, 0.345)],
                  rim=(0.86, 0.36), lip=0.405, handle=(0.70, 0.25, 0.25)),
}


def mlicenka(p):
    """Milk jug: a straight cup with a thick rim, a pouring lip on the right."""
    f = Fig()
    w0 = p['walls'][0][1]
    yr, rr = p['rim']
    prof = [(E * (w0 - 0.04), w0 - 0.04)] + p['walls'] + [(0.80, rr), (yr, rr)]
    yt, yb, w = p['handle']
    handle(f, -p['walls'][2][1] + 0.01, yt, yb, w)
    # the lip: the rim drawn out to a point on the right
    lip = p['lip']
    f.add([('M', (rr * 0.55, yr + E * rr * 0.83)), ('C', (rr * 0.9, yr + E * rr * 0.75), (lip - 0.02, yr + 0.02), (lip, yr + 0.005)),
           ('C', (lip - 0.02, yr - 0.03), (rr + 0.01, yr - 0.05), (rr, yr - 0.09)), ('L', (rr * 0.6, yr - 0.09)), ('Z',)])
    f.add(body(prof))
    f.add(ellipse(0, yr, rr, E * rr), inside=True)
    f.add(ellipse(0, yr - 0.004, rr * 0.86, E * rr * 0.86), fill=False)
    return f, yr + E * rr


def panak():
    """Shot glass: a foot ring, a slight waist, widening to the rim."""
    f = Fig()
    prof = [(E * 0.25, 0.25), (0.11, 0.251), (0.15, 0.236), (0.30, 0.24), (0.50, 0.252), (0.70, 0.265), (0.89, 0.275)]
    f.add(body(prof))
    f.add([('M', (-0.25, 0.12))] + lower_half(0, 0.12, 0.25, E * 0.25), fill=False)
    f.add(ellipse(0, 0.89, 0.275, E * 0.275), inside=True)
    f.add(ellipse(0, 0.885, 0.245, E * 0.245), fill=False)
    return f, 0.89 + E * 0.275


def podsalek(r):
    """Saucer of radius r cm: a wide rim, the well for the cup, a foot ring."""
    f = Fig()
    h = 0.36 * r  # drawn from the photos; no measured height
    rf = 0.6 * r
    foot = 0.22 * h
    f.add([('M', (-r, h)), ('C', (-r * 0.97, h - 0.35 * h), (-rf * 1.15, foot + 0.15 * h), (-rf, foot)),
           ('L', (-rf, E * rf))] + lower_half(0, E * rf, rf, E * rf) +
          [('L', (rf, foot)), ('C', (rf * 1.15, foot + 0.15 * h), (r * 0.97, h - 0.35 * h), (r, h))]
          + upper_half(0, h, r, E * r) + [('Z',)])
    f.add([('M', (-rf, foot))] + lower_half(0, foot, rf, E * rf), fill=False)
    f.add(ellipse(0, h, r, E * r), inside=True)
    f.add(ellipse(0, h - 0.04 * h, r * 0.56, E * r * 0.56), fill=False)
    return f, 1.0  # already in cm


def babovka(h, R):
    """Bábovka mould, h and R in cm: fluted sides narrowing to the base, a rim
    with two lugs, the tube in the middle."""
    import math
    f = Fig()
    rb = 0.47 * R
    prof_t = [(0.0, 0.47), (0.15, 0.55), (0.35, 0.64), (0.6, 0.76), (0.8, 0.87), (0.93, 0.96), (1.0, 1.0)]
    y_rim = h
    yb = E * rb
    pts = [(yb + t * (y_rim - yb), f_ * R) for t, f_ in prof_t]
    # lugs at the rim
    for s in (-1, 1):
        x = s * R * 0.97
        y1, y2 = y_rim - 0.06 * h, y_rim - 0.30 * h
        f.add([('M', (x, y1)), ('C', (x + s * 0.10 * R, y1 + 0.02 * h), (x + s * 0.12 * R, y2), (x - s * 0.02 * R, y2 - 0.02 * h)), ('Z',)])
    # the body with a scalloped near base
    n = 8
    scal = []
    for i in range(n):
        a1 = math.pi * (i + 1) / n
        x1, y1 = -rb * math.cos(a1), yb - E * rb * math.sin(a1)
        am = math.pi * (i + 0.5) / n
        xm, ym = -rb * math.cos(am) * 1.02, yb - E * rb * math.sin(am) - 0.05 * h
        scal.append(('Q', (xm, ym), (x1, y1)))
    right = [(r, y) for y, r in pts]
    left = [(-r, y) for y, r in reversed(pts)]
    cmds = [('M', (-rb, yb))] + scal + spline(right) + upper_half(0, y_rim, R, E * R) + spline(left) + [('Z',)]
    f.add(cmds)
    # flutes down the near side
    for i in range(1, n):
        a = math.pi * i / n
        xb, yb_ = -rb * math.cos(a), yb - E * rb * math.sin(a)
        xt, yt = -R * 0.98 * math.cos(a), y_rim - E * R * math.sin(a) * 0.98 - 0.04 * h
        f.add([('M', (xt, yt)), ('Q', ((xt + xb) / 2 * 1.06, (yt + yb_) / 2), (xb, yb_ + 0.02 * h))], fill=False)
    f.add(ellipse(0, y_rim, R, E * R), inside=True)
    f.add(ellipse(0, y_rim - 0.01 * h, R * 0.88, E * R * 0.88), fill=False)
    rt = 0.085 * R
    f.add([('M', (-rt * 1.5, y_rim - E * R * 0.5)), ('L', (-rt, y_rim))] + lower_half(0, y_rim, rt, E * rt)
          + [('L', (rt * 1.5, y_rim - E * R * 0.5))], fill=False)
    f.add(ellipse(0, y_rim, rt, E * rt), inside=True)
    return f, 1.0


# name: (figure maker, how to scale)
#   ('height', cm): the drawn ceramic height (no rattan) is cm
#   ('radius', cm): the given unit radius is cm
#   ('cm', None): drawn in cm already
SHAPES = {
    'konev-rovna-mala': (lambda: konev_rovna(ROVNA['mala']), ('height', 15)),
    'konev-rovna-stredni': (lambda: konev_rovna(ROVNA['stredni']), ('height', 17)),
    'konev-rovna-velka': (lambda: konev_rovna(ROVNA['velka']), ('height', 23)),
    'konev-kulata-mala': (lambda: konev_kulata(KULATA['mala']), ('height', 15)),
    'konev-kulata-stredni': (lambda: konev_kulata(KULATA['stredni']), ('height', 19)),
    'konev-kulata-velka': (lambda: konev_kulata(KULATA['velka']), ('height', 23)),
    # by the diameter in the data (8 and 10 cm)
    'cukrenka-mala': (cukrenka, ('radius', 4.0)),
    'cukrenka-velka': (cukrenka, ('radius', 5.0)),
    # by the height in the data; the photos are taller than the data's diameters suggest
    'mlicenka-mala': (lambda: mlicenka(MLICENKA['mala']), ('height', 6.5)),
    'mlicenka-velka': (lambda: mlicenka(MLICENKA['velka']), ('height', 9.5)),
    'panak': (panak, ('height', 5)),  # 4–6 cm (Sami, November 2026)
    'podsalek-maly': (lambda: podsalek(10.5 / 2), ('cm', None)),
    'podsalek-velky': (lambda: podsalek(13.5 / 2), ('cm', None)),
    # the data: malá 11,5 cm high and 24 cm across, velká 10 cm and 27,5 cm
    'babovka-mala': (lambda: babovka(11.5, 24 / 2), ('cm', None)),
    'babovka-velka': (lambda: babovka(10, 27.5 / 2), ('cm', None)),
}

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for name, (make, (kind, cm)) in SHAPES.items():
        fig, ref = make()
        scale = cm / ref if kind in ('height', 'radius') else 1.0
        svg, w, h = fig.svg(scale)
        open(os.path.join(out, f'{name}.svg'), 'w').write(svg)
        print(f'{name:22s} {w:5.1f} × {h:5.1f} cm')
