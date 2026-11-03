"""Measure a piece from its photo and its mask (masks.py), for drawing it in draw.py.

Usage: python -I measure.py <photo.jpg> <mask.png> > piece.json


Units: the ceramic height H (rattan left out) = 1, y up from the floor,
x from the body's axis, positive towards the handle (right in the photos).

Output JSON:
  body:  [[y, half_width], ...] the body profile (handle and spout removed)
  right: [[y, x], ...] outer extent on the handle side
  left:  [[y, x], ...] outer extent on the spout side (negative x)
  rattan: {top, xl, xr, feet_y} where there is one
  aspect: photo pixel height of H
"""
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

photo, maskfile = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(photo).convert('RGB')).astype(np.int16)
m = np.asarray(Image.open(maskfile)) > 128
m = ndimage.binary_opening(m, iterations=2)
lab, n = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1, n + 1))
m = np.isin(lab, np.nonzero(sizes >= sizes.max() * 0.02)[0] + 1)
r, b = a[..., 0], a[..., 2]
lum = a.mean(axis=2)
warm = (r - b > 40) & (lum < 252) & m
warm = ndimage.binary_opening(warm, iterations=2)
# brass rings sit on the rattan: count everything warm and the rows between
ceramic = m & ~ndimage.binary_dilation(warm, iterations=3)
rows = np.nonzero(ndimage.binary_opening(ceramic, iterations=3).sum(axis=1) >= 12)[0]
top, bottom = int(rows.min()), int(rows.max())
H = bottom - top
band = ceramic[bottom - int(0.06 * H): bottom - int(0.02 * H)]
fc = np.nonzero(band.sum(axis=0) >= 2)[0]
axis = (fc.min() + fc.max()) / 2

body, right, left = [], [], []
for k in range(0, 101):
    f = k / 100
    y = int(round(bottom - f * H))
    xs = np.nonzero(ceramic[y])[0]
    if len(xs) == 0:
        continue
    runs = np.split(xs, np.nonzero(np.diff(xs) > 1)[0] + 1)
    run = min(runs, key=lambda rr: 0 if rr[0] <= axis <= rr[-1] else min(abs(rr[0] - axis), abs(rr[-1] - axis)))
    lw, rw = axis - run[0], run[-1] - axis
    body.append([round(f, 3), round(lw / H, 4), round(rw / H, 4)])
    right.append([round(f, 3), round((xs[-1] - axis) / H, 4)])
    left.append([round(f, 3), round((xs[0] - axis) / H, 4)])

res = {'H_px': H, 'body': body, 'right': right, 'left': left}
if warm.sum() > 500:
    wy, wx = np.nonzero(warm)
    res['rattan'] = {
        'top': round((bottom - wy.min()) / H, 4),
        'xl': round((wx.min() - axis) / H, 4), 'xr': round((wx.max() - axis) / H, 4),
        'low': round((bottom - wy.max()) / H, 4),
    }
    # the arch: outer and inner x at heights above the lid
    arch = []
    for k in range(0, 41):
        y = int(wy.min() + k * (wy.max() - wy.min()) / 40)
        xs = np.nonzero(warm[y])[0]
        if len(xs):
            arch.append([round((bottom - y) / H, 3), round((xs[0] - axis) / H, 4), round((xs[-1] - axis) / H, 4)])
    res['arch'] = arch
print(json.dumps(res))
