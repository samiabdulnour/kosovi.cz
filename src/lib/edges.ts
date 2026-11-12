// A photo whose format does not fit its box (the product page's 531 × 501)
// gets the box's empty sides painted in the photo's own backdrop: the colours
// along the photo's edges, sampled at build time, run out to the box's edge,
// and the photo's edges fade into them. A stand-in until the photos have a
// backdrop wide enough (Sami, November 2026).
import type { ImageMetadata } from 'astro';
import sharp, { type Region } from 'sharp';

export interface PhotoFit {
  /** Which sides of the box the photo leaves empty: left and right, top and bottom, or none. */
  sides: 'x' | 'y' | 'none';
  /** Inline style: the photo's size in the box and the backdrop. */
  style: string;
}

const BANDS = 24; // colour stops along each edge
const STRIP = 0.02; // the edge strip sampled, as a share of the photo's width or height

const hex = (data: Buffer, i: number) =>
  `#${[0, 1, 2].map((c) => data[i * 3 + c]!.toString(16).padStart(2, '0')).join('')}`;

/** The edge's average colour in BANDS steps along it. */
async function edge(file: string, region: Region, along: 'x' | 'y'): Promise<string[]> {
  const data = await sharp(file)
    .rotate() // as the photo is shown, if the file asks to be turned
    .extract(region)
    .resize(along === 'y' ? 1 : BANDS, along === 'y' ? BANDS : 1, { fit: 'fill' })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer();
  return Array.from({ length: BANDS }, (_, i) => hex(data, i));
}

const cache = new Map<string, Promise<PhotoFit>>();

export function photoFit(src: ImageMetadata, boxRatio: number): Promise<PhotoFit> {
  const file = (src as ImageMetadata & { fsPath?: string }).fsPath;
  const key = `${file ?? src.src}@${boxRatio}`;
  let fit = cache.get(key);
  if (!fit) {
    fit = measure(src, file, boxRatio);
    cache.set(key, fit);
  }
  return fit;
}

async function measure(src: ImageMetadata, file: string | undefined, boxRatio: number): Promise<PhotoFit> {
  const { width: w, height: h } = src;
  const ratio = w / h;
  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
  if (Math.abs(ratio / boxRatio - 1) < 0.01 || !file) {
    return { sides: 'none', style: '' };
  }
  if (ratio < boxRatio) {
    // narrower than the box: paint the left and right sides
    const strip = Math.max(1, Math.round(w * STRIP));
    const [left, right] = await Promise.all([
      edge(file, { left: 0, top: 0, width: strip, height: h }, 'y'),
      edge(file, { left: w - strip, top: 0, width: strip, height: h }, 'y'),
    ]);
    return {
      sides: 'x',
      style:
        `--pw: ${pct(ratio / boxRatio)}; --ph: 100%; background: ` +
        `linear-gradient(${left.join(', ')}) left / 50.5% 100% no-repeat, ` +
        `linear-gradient(${right.join(', ')}) right / 50.5% 100% no-repeat`,
    };
  }
  // wider than the box: paint the top and bottom
  const strip = Math.max(1, Math.round(h * STRIP));
  const [top, bottom] = await Promise.all([
    edge(file, { left: 0, top: 0, width: w, height: strip }, 'x'),
    edge(file, { left: 0, top: h - strip, width: w, height: strip }, 'x'),
  ]);
  return {
    sides: 'y',
    style:
      `--pw: 100%; --ph: ${pct(boxRatio / ratio)}; background: ` +
      `linear-gradient(to right, ${top.join(', ')}) top / 100% 50.5% no-repeat, ` +
      `linear-gradient(to right, ${bottom.join(', ')}) bottom / 100% 50.5% no-repeat`,
  };
}
