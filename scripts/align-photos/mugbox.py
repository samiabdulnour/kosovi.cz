"""Find the mug in each edited photo: top of the rim, bottom of the foot, left and right.

The background is a smooth light grey-beige. The mug is cobalt blue (strongly blue)
and white porcelain (brighter than the background). The shadow under it is darker
and neutral, so it is left out on purpose.

Usage: python -I mugbox.py <photo dir> <out.json> [debug sheet.jpg]
"""
import glob
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def background(a):
    # Per row, the median of a strip at each edge, blended across the width
    # (some photos are lighter on one side); smoothed down the image.
    left = ndimage.uniform_filter1d(np.median(a[:, :40], axis=1), 61, axis=0)
    right = ndimage.uniform_filter1d(np.median(a[:, -40:], axis=1), 61, axis=0)
    t = np.linspace(0, 1, a.shape[1])[None, :, None]
    return left[:, None, :] * (1 - t) + right[:, None, :] * t


def box(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.int16)
    bg = background(a)
    r, b = a[..., 0], a[..., 2]
    lum = a.mean(axis=2)
    blue = (b - r > 40) & (b > 60)
    dark = lum < 90  # the navy "forever" mugs
    bright = lum - bg.mean(axis=2) > 14
    # The core is the glazed body and handle; white parts count only where they touch it.
    ink = ndimage.binary_opening(blue | dark, iterations=2)
    lab, n = ndimage.label(ink)
    if n == 0:
        return None
    sizes = ndimage.sum(ink, lab, range(1, n + 1))
    core = np.isin(lab, np.nonzero(sizes >= sizes.max() * 0.05)[0] + 1)
    near = ndimage.binary_dilation(core, iterations=12)
    full = ndimage.binary_opening(blue | dark | bright, iterations=2)
    lab, n = ndimage.label(full)
    touching = np.unique(lab[near & full])
    m = np.isin(lab, touching[touching > 0])
    rows = np.nonzero(m.sum(axis=1) >= 6)[0]
    cols = np.nonzero(m.sum(axis=0) >= 6)[0]
    top, bottom = int(rows.min()), int(rows.max())
    h = bottom - top
    # Body centre from the foot, below where the handle joins.
    band = m[bottom - int(h * 0.08): bottom - int(h * 0.03)]
    fcols = np.nonzero(band.sum(axis=0) >= 3)[0]
    # The highest point of anything attached, including a rattan handle and
    # its brass rings (warm colours the outline above leaves out).
    warm = ndimage.binary_opening((r - b > 50) & (lum < 250), iterations=2)
    lab, n = ndimage.label(warm)
    left, right = int(cols.min()), int(cols.max())
    full_top = top
    for i, sl in enumerate(ndimage.find_objects(lab)):
        ys, xs = sl
        # above the piece (or reaching into it), over it, and not a speck
        if xs.stop > left and xs.start < right and ys.stop >= top - 250 and (lab[sl] == i + 1).sum() >= 200:
            full_top = min(full_top, ys.start)
    return {
        'top': top,
        'fullTop': full_top,
        'bottom': bottom,
        'left': left,
        'right': right,
        'bodyCx': float((fcols.min() + fcols.max()) / 2),
        'bodyW': int(fcols.max() - fcols.min()),
    }


def main():
    src, out = sys.argv[1], sys.argv[2]
    sheet = sys.argv[3] if len(sys.argv) > 3 else None
    files = sorted(glob.glob(os.path.join(src, '*.jpg')))
    res = {}
    for f in files:
        res[os.path.basename(f)] = box(f)
    with open(out, 'w') as fh:
        json.dump(res, fh, indent=1)
    if sheet:
        thumbs = []
        for f in files:
            bx = res[os.path.basename(f)]
            im = Image.open(f).convert('RGB')
            d = ImageDraw.Draw(im)
            if bx:
                d.rectangle([bx['left'], bx['top'], bx['right'], bx['bottom']], outline=(255, 0, 0), width=6)
                d.line([bx['bodyCx'], bx['top'], bx['bodyCx'], bx['bottom']], fill=(0, 200, 0), width=6)
                if bx['fullTop'] < bx['top']:
                    d.line([bx['left'], bx['fullTop'], bx['right'], bx['fullTop']], fill=(255, 140, 0), width=6)
            thumbs.append(im.resize((150, 200)))
        cols = 16
        rows = (len(thumbs) + cols - 1) // cols
        S = Image.new('RGB', (cols * 150, rows * 200), 'white')
        for i, t in enumerate(thumbs):
            S.paste(t, ((i % cols) * 150, (i // cols) * 200))
        S.save(sheet, quality=85)


main()
