// A photo whose format does not fit its box (the product page's 666 × 501)
// gets the box's empty sides painted in the photo's own backdrop: the colours
// along the photo's edges, sampled at build time, run out to the box's edge,
// and the photo's edges fade into them. A stand-in until the photos have a
// backdrop wide enough (Sami, November 2026). Where the piece itself reaches
// the photo's edge, the colours would run out in streaks, so that photo stays
// in its own format, the box's sides left empty (Sami, November 2026).
import type { ImageMetadata } from 'astro';
import sharp, { type Region } from 'sharp';

export interface PhotoFit {
  /** Which sides of the box the photo leaves empty: left and right, top and bottom, or none. */
  sides: 'x' | 'y' | 'none';
  /** Inline style: the photo's size in the box and the backdrop. */
  style: string;
}

const BANDS = 24; // colour stops along each edge
const SAMPLES = BANDS * 4; // finer samples, to tell a plain backdrop from a piece at the edge
const STRIP = 0.02; // the edge strip sampled, as a share of the photo's width or height
// A plain backdrop changes little from one sample to the next, even where the
// light falls off; a piece crossing the edge jumps by far more (measured on
// all product photos, November 2026: backdrops up to 18, pieces from 28).
const MAX_JUMP = 25;

type Rgb = [number, number, number];

const hex = ([r, g, b]: Rgb) => `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** The edge's average colour in SAMPLES steps along it. */
async function edge(file: string, region: Region, along: 'x' | 'y'): Promise<Rgb[]> {
  const data = await sharp(file)
    .rotate() // as the photo is shown, if the file asks to be turned
    .extract(region)
    .resize(along === 'y' ? 1 : SAMPLES, along === 'y' ? SAMPLES : 1, { fit: 'fill' })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer();
  return Array.from({ length: SAMPLES }, (_, i): Rgb => [data[i * 3]!, data[i * 3 + 1]!, data[i * 3 + 2]!]);
}

/** Whether the edge is a plain backdrop: no sudden change along it. */
const plain = (samples: Rgb[]) =>
  samples.every((c, i) => i === 0 || Math.hypot(...c.map((v, k) => v - samples[i - 1]![k]!)) <= MAX_JUMP);

/** BANDS colour stops, each the average of its samples. */
const stops = (samples: Rgb[]) =>
  Array.from({ length: BANDS }, (_, i) => {
    const group = samples.slice((i * SAMPLES) / BANDS, ((i + 1) * SAMPLES) / BANDS);
    return hex([0, 1, 2].map((k) => group.reduce((s, c) => s + c[k]!, 0) / group.length) as Rgb);
  });

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

// The whole photo in its own format, the box's sides left white.
const ownFormat: PhotoFit = { sides: 'none', style: 'background: none' };

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
    if (!plain(left) || !plain(right)) return ownFormat;
    return {
      sides: 'x',
      style:
        `--pw: ${pct(ratio / boxRatio)}; --ph: 100%; background: ` +
        `linear-gradient(${stops(left).join(', ')}) left / 50.5% 100% no-repeat, ` +
        `linear-gradient(${stops(right).join(', ')}) right / 50.5% 100% no-repeat`,
    };
  }
  // wider than the box: paint the top and bottom
  const strip = Math.max(1, Math.round(h * STRIP));
  const [top, bottom] = await Promise.all([
    edge(file, { left: 0, top: 0, width: w, height: strip }, 'x'),
    edge(file, { left: 0, top: h - strip, width: w, height: strip }, 'x'),
  ]);
  if (!plain(top) || !plain(bottom)) return ownFormat;
  return {
    sides: 'y',
    style:
      `--pw: 100%; --ph: ${pct(boxRatio / ratio)}; background: ` +
      `linear-gradient(to right, ${stops(top).join(', ')}) top / 100% 50.5% no-repeat, ` +
      `linear-gradient(to right, ${stops(bottom).join(', ')}) bottom / 100% 50.5% no-repeat`,
  };
}
