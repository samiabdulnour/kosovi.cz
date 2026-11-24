"""Extend a photo's plain backdrop above and below to a taller format.

usage: extend_backdrop.py in.jpg out.jpg ratio_w ratio_h top_share
The top is the original's top rows mirrored (they must be plain backdrop);
the bottom is the per-column colour of the last rows, smoothed sideways,
with the grain of the top backdrop laid over it.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

src, out, rw, rh, top_share = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
img = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = img.shape
new_h = round(W * rh / rw)
add = new_h - H
top = round(add * top_share)
bottom = add - top
print('size', W, H, '->', W, new_h, 'top', top, 'bottom', bottom)

# top: the plain rows mirrored
top_part = img[1 : top + 1][::-1]

# grain of the plain top backdrop
plain = img[0:220]
grain = plain - ndimage.gaussian_filter(plain, sigma=(6, 6, 0))

# bottom: the last rows' colour per column, smoothed sideways, plus grain
edge = img[H - 30 : H].mean(axis=0)
edge = ndimage.gaussian_filter1d(edge, sigma=40, axis=0, mode='nearest')
base = np.repeat(edge[None], bottom, axis=0)
g = grain[:bottom] if bottom <= grain.shape[0] else np.concatenate([grain, grain[::-1]])[:bottom]
bottom_part = base + g[:, ::-1]

# a soft seam: the first rows under the photo lean on the photo's last rows
n = min(24, bottom)
last = img[H - n : H][::-1]
w = np.linspace(1, 0, n)[:, None, None] ** 2 * 0.5
bottom_part[:n] = bottom_part[:n] * (1 - w) + last * w

res = np.concatenate([top_part, img, bottom_part]).clip(0, 255).astype(np.uint8)
Image.fromarray(res).save(out, quality=95, subsampling=0)
