// Line drawings for the e-shop size chart (src/assets/silhouettes, made by
// scripts/silhouettes/). Each SVG's viewBox is its size in centimetres.

const files = import.meta.glob<string>('../assets/silhouettes/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface Silhouette {
  /** The SVG markup, inlined so the outline takes the text colour. */
  svg: string;
  /** Width and height in cm, the floor at the bottom. */
  w: number;
  h: number;
  /** The body's axis in cm from the left edge (a handle sticks out to one side). */
  axis: number;
  /** The floor line in cm from the top: a piece stands with its base ellipse
   *  across it, a plate or saucer (drawn from above) on it. */
  floor: number;
  /** Left edge in cm from the chart's ruler, as placed in kosovi_eshop_vektory.pdf. */
  x: number;
}

const byName = new Map<string, Silhouette>();
for (const [path, svg] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.svg$/, '');
  const box = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  if (!box) throw new Error(`Silhouette ${name} has no viewBox`);
  const axis = /data-axis="([\d.]+)"/.exec(svg);
  const floor = /data-floor="([\d.]+)"/.exec(svg);
  const x = /data-x="([\d.]+)"/.exec(svg);
  byName.set(name, {
    // decorative: the link text next to it names the piece
    svg: svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" '),
    w: Number(box[1]),
    h: Number(box[2]),
    axis: axis ? Number(axis[1]) : Number(box[1]) / 2,
    floor: floor ? Number(floor[1]) : Number(box[2]),
    x: x ? Number(x[1]) : 0,
  });
}

export function silhouette(name: string): Silhouette {
  const found = byName.get(name);
  if (!found) throw new Error(`Unknown silhouette: ${name}`);
  return found;
}
