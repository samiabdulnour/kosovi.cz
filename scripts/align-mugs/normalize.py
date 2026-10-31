"""Scale and move each mug photo so mugs of one type are the same height, start
at the same line, and stand on the same vertical axis (the body, not the handle).

Per type (the old shop's subcategory): height = the type's median.
All types: the mug's vertical centre and its body centre land on the same point,
so rows that mix types stay balanced.
Where the new frame reaches past the photo, the background is extended from
a blurred copy of its edge (smooth, no repeated detail).

Usage: python -I normalize.py <photo dir> <boxes.json> <products dir> <out dir> [plan.json]
"""
import glob
import json
import os
import re
import statistics as st
import sys
from collections import defaultdict

import numpy as np
from PIL import Image, ImageFilter

W, H = 1200, 1600
MARGIN = 72  # px between the mug and the frame's side


def subcategories(products_dir):
    out = {}
    for f in glob.glob(os.path.join(products_dir, '*.md')):
        t = open(f, encoding='utf-8').read()
        slug = re.search(r'^slug: "(.*)"', t, re.M).group(1)
        sub = re.search(r'^subcategory: "(.*)"', t, re.M)
        out[slug] = sub.group(1) if sub else '-'
    return out


def main():
    src, boxes_path, products_dir, out_dir = sys.argv[1:5]
    plan_path = sys.argv[5] if len(sys.argv) > 5 else None
    boxes = json.load(open(boxes_path))
    subs = subcategories(products_dir)
    groups = defaultdict(list)
    for name, b in boxes.items():
        slug = name[:-4].split('__')[0]
        groups[subs[slug]].append(name)

    centres_y = [(b['top'] + b['bottom']) / 2 for b in boxes.values()]
    target_cy = round(st.median(centres_y))
    def side(b):
        lw, rw = b['bodyCx'] - b['left'], b['right'] - b['bodyCx']
        return 'right' if rw > lw * 1.15 else 'left' if lw > rw * 1.15 else 'both'

    # Handle on the right (most): body left of centre, as photographed.
    # Handle on the left: the mirror of that. Cups on saucers: centred.
    right_cx = round(st.median(b['bodyCx'] for b in boxes.values() if side(b) == 'right'))
    target_cxs = {'right': right_cx, 'left': W - right_cx, 'both': W // 2}
    plan = {}
    for sub, names in groups.items():
        target_h = round(st.median(boxes[n]['bottom'] - boxes[n]['top'] for n in names))
        scale = {n: target_h / (boxes[n]['bottom'] - boxes[n]['top']) for n in names}
        width = {n: boxes[n]['right'] - boxes[n]['left'] for n in names}
        # A mug of another shape (lower and wider) must not end up much wider than the rest.
        max_w = 1.1 * st.median(width[n] * scale[n] for n in names)
        for n in names:
            b = boxes[n]
            s = min(scale[n], max_w / width[n])
            plan[n] = {
                'sub': sub,
                'scale': s,
                # source point that lands on the target point
                'cx': b['bodyCx'],
                'cy': (b['top'] + b['bottom']) / 2,
                'targetH': target_h,
                'targetCx': target_cxs[side(b)],
            }
    print('target centre', target_cxs, target_cy)
    os.makedirs(out_dir, exist_ok=True)
    warnings = []
    for n, p in sorted(plan.items()):
        im = Image.open(os.path.join(src, n)).convert('RGB')
        b0 = boxes[n]
        s = p['scale']
        target_cx = p['targetCx']
        # keep the handle off the frame edge
        left = target_cx - (p['cx'] - b0['left']) * s
        right = target_cx + (b0['right'] - p['cx']) * s
        if right > W - MARGIN:
            target_cx -= right - (W - MARGIN)
        elif left < MARGIN:
            target_cx += MARGIN - left
        # source window of the output frame
        x0 = p['cx'] - target_cx / s
        y0 = p['cy'] - target_cy / s
        x1 = x0 + W / s
        y1 = y0 + H / s
        pad = int(max(0, -x0, -y0, x1 - W, y1 - H)) + 4
        b = boxes[n]
        # the extended edge must be background, not the mug
        if pad > 4 and min(b['left'], b['top'], W - 1 - b['right'], H - 1 - b['bottom']) < 24:
            warnings.append(f'{n}: mug touches the edge')
        soft = np.asarray(im.filter(ImageFilter.GaussianBlur(30)))
        big = Image.fromarray(np.pad(soft, ((pad, pad), (pad, pad), (0, 0)), mode='edge'))
        big.paste(im, (pad, pad))
        coeffs = (1 / s, 0, x0 + pad, 0, 1 / s, y0 + pad)
        out = big.transform((W, H), Image.Transform.AFFINE, coeffs, resample=Image.Resampling.BICUBIC)
        out.save(os.path.join(out_dir, n), quality=90, optimize=True, progressive=True)
        p['pad'] = pad
    for w in warnings:
        print('WARN', w)
    for sub, names in sorted(groups.items()):
        sc = [plan[n]['scale'] for n in names]
        capped = [n for n in names if plan[n]['scale'] * (boxes[n]['bottom'] - boxes[n]['top']) < plan[n]['targetH'] - 1]
        print(f'{sub:32s} n={len(names):3d} h={plan[names[0]]["targetH"]} scale {min(sc):.3f}–{max(sc):.3f} capped {capped}')
    if plan_path:
        json.dump(plan, open(plan_path, 'w'), indent=1)


main()
