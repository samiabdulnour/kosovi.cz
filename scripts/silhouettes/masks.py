"""Object masks of product photos with rembg (isnet-general-use), saved as PNG
(255 = object), for measure.py.

Usage: python -I masks.py <model dir> <out dir> <photo.jpg> ...
"""
import os
import sys

os.environ.setdefault('U2NET_HOME', sys.argv[1])
from PIL import Image
from rembg import new_session, remove

session = new_session('isnet-general-use')
out = sys.argv[2]
for path in sys.argv[3:]:
    im = Image.open(path).convert('RGB')
    m = remove(im, session=session, only_mask=True)
    m.save(os.path.join(out, os.path.basename(path).replace('.jpg', '.png')))
    print('ok', os.path.basename(path))
