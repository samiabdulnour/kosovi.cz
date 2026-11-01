"""Scale and move product photos so pieces of one type look the same size and
stand on the same line.

Groups are the old shop's category and subcategory. Two ways to measure:

--by height (mugs): every mug of a type gets the type's median height; all
    types share the same vertical centre, and the mug's body (not its handle)
    stands on the same vertical axis. A piece of another shape (lower and
    wider) is scaled up only until it is 10 % wider than the rest.
--by width (bowls, plates, teapots, sugar bowls, jugs): the outline's width
    is reliable where the height is not (lids, rattan handles), so every piece
    of a type gets the type's median width, its foot on the type's median
    bottom line and its foot centre on the type's median axis.

Only the first photo of a product (__01, the one in the listing) is moved
unless --all is given; other photos are copied as they are. Groups smaller
than --min-group, groups listed in --skip and groups that already agree
within --tolerance are copied as they are.

Where the new frame reaches past the photo, the background is extended from
a blurred copy of its edge (smooth, no repeated detail).

Usage: python -I normalize.py <photo dir> <boxes.json> <products dir> <out dir>
           [--by height|width] [--all] [--skip cat/sub ...] [--min-group N]
           [--tolerance 0.03] [--plan plan.json]
"""
import argparse
import glob
import json
import os
import re
import shutil
import statistics as st
from collections import defaultdict

import numpy as np
from PIL import Image, ImageFilter

W, H = 1200, 1600
MARGIN = 72  # px between the piece and the frame's side


def groups_of(products_dir):
    out = {}
    for f in glob.glob(os.path.join(products_dir, '*.md')):
        t = open(f, encoding='utf-8').read()
        slug = re.search(r'^slug: "(.*)"', t, re.M).group(1)
        cat = re.search(r'^category: "(.*)"', t, re.M)
        sub = re.search(r'^subcategory: "(.*)"', t, re.M)
        out[slug] = f"{cat.group(1) if cat else '-'}/{sub.group(1) if sub else '-'}"
    return out


def side(b):
    lw, rw = b['bodyCx'] - b['left'], b['right'] - b['bodyCx']
    return 'right' if rw > lw * 1.15 else 'left' if lw > rw * 1.15 else 'both'


def plan_by_height(boxes, groups):
    centres_y = [(b['top'] + b['bottom']) / 2 for b in boxes.values()]
    target_cy = st.median(centres_y)
    # Handle on the right (most): body left of centre, as photographed.
    # Handle on the left: the mirror of that. Cups on saucers: centred.
    right_cx = round(st.median(b['bodyCx'] for b in boxes.values() if side(b) == 'right'))
    target_cxs = {'right': right_cx, 'left': W - right_cx, 'both': W // 2}
    plan = {}
    for group, names in groups.items():
        target_h = st.median(boxes[n]['bottom'] - boxes[n]['top'] for n in names)
        scale = {n: target_h / (boxes[n]['bottom'] - boxes[n]['top']) for n in names}
        width = {n: boxes[n]['right'] - boxes[n]['left'] for n in names}
        # A mug of another shape (lower and wider) must not end up much wider than the rest.
        max_w = 1.1 * st.median(width[n] * scale[n] for n in names)
        for n in names:
            b = boxes[n]
            plan[n] = {
                'group': group,
                'scale': min(scale[n], max_w / width[n]),
                # the source point (sx, sy) lands on the target point (tx, ty)
                'sx': b['bodyCx'],
                'sy': (b['top'] + b['bottom']) / 2,
                'tx': target_cxs[side(b)],
                'ty': target_cy,
            }
    return plan


def plan_by_width(boxes, groups):
    plan = {}
    for group, names in groups.items():
        target_w = st.median(boxes[n]['right'] - boxes[n]['left'] for n in names)
        scale = {n: target_w / (boxes[n]['right'] - boxes[n]['left']) for n in names}
        target_bottom = st.median(boxes[n]['bottom'] for n in names)
        target_cx = st.median(boxes[n]['bodyCx'] for n in names)
        for n in names:
            b = boxes[n]
            plan[n] = {
                'group': group,
                'scale': scale[n],
                'sx': b['bodyCx'],
                'sy': b['bottom'],
                'tx': target_cx,
                'ty': target_bottom,
            }
    return plan


def render(src_path, b, p, out_path):
    im = Image.open(src_path).convert('RGB')
    s, tx = p['scale'], p['tx']
    # keep the piece off the frame's sides
    left = tx - (p['sx'] - b['left']) * s
    right = tx + (b['right'] - p['sx']) * s
    if right > W - MARGIN:
        tx -= right - (W - MARGIN)
    elif left < MARGIN:
        tx += MARGIN - left
    # source window of the output frame
    x0 = p['sx'] - tx / s
    y0 = p['sy'] - p['ty'] / s
    x1 = x0 + W / s
    y1 = y0 + H / s
    pad = int(max(0, -x0, -y0, x1 - W, y1 - H)) + 4
    soft = np.asarray(im.filter(ImageFilter.GaussianBlur(30)))
    big = Image.fromarray(np.pad(soft, ((pad, pad), (pad, pad), (0, 0)), mode='edge'))
    big.paste(im, (pad, pad))
    coeffs = (1 / s, 0, x0 + pad, 0, 1 / s, y0 + pad)
    out = big.transform((W, H), Image.Transform.AFFINE, coeffs, resample=Image.Resampling.BICUBIC)
    out.save(out_path, quality=90, optimize=True, progressive=True)
    edge = pad > 4 and min(b['left'], b['top'], W - 1 - b['right'], H - 1 - b['bottom']) < 24
    return edge


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('boxes')
    ap.add_argument('products')
    ap.add_argument('out')
    ap.add_argument('--by', choices=['height', 'width'], default='height')
    ap.add_argument('--all', action='store_true', help='move every photo, not only __01')
    ap.add_argument('--skip', nargs='*', default=[])
    ap.add_argument('--min-group', type=int, default=3)
    ap.add_argument('--tolerance', type=float, default=0.0)
    ap.add_argument('--plan')
    a = ap.parse_args()

    boxes = json.load(open(a.boxes))
    group_of = groups_of(a.products)
    groups = defaultdict(list)
    for name in boxes:
        slug, num = name[:-4].split('__')
        if a.all or num == '01':
            groups[group_of[slug]].append(name)

    def measure(n):
        b = boxes[n]
        return b['bottom'] - b['top'] if a.by == 'height' else b['right'] - b['left']

    keep = {}
    for g in list(groups):
        sizes = [measure(n) for n in groups[g]]
        spread = (max(sizes) - min(sizes)) / 2 / st.median(sizes)
        if g in a.skip:
            keep[g] = 'skipped'
        elif len(sizes) < a.min_group:
            keep[g] = f'only {len(sizes)}'
        elif spread <= a.tolerance:
            keep[g] = f'agrees within {spread:.1%}'
        if g in keep:
            del groups[g]

    plan = (plan_by_height if a.by == 'height' else plan_by_width)(boxes, groups)
    os.makedirs(a.out, exist_ok=True)
    warnings = []
    for f in sorted(glob.glob(os.path.join(a.src, '*.jpg'))):
        n = os.path.basename(f)
        if n in plan:
            if render(f, boxes[n], plan[n], os.path.join(a.out, n)):
                warnings.append(f'{n}: the piece touches the frame edge')
        else:
            shutil.copyfile(f, os.path.join(a.out, n))
    for g, why in sorted(keep.items()):
        print(f'{g:40s} unchanged ({why})')
    for g, names in sorted(groups.items()):
        sc = [plan[n]['scale'] for n in names]
        print(f'{g:40s} n={len(names):3d} scale {min(sc):.3f}–{max(sc):.3f}')
    for w in warnings:
        print('WARN', w)
    if a.plan:
        json.dump(plan, open(a.plan, 'w'), indent=1)


main()
