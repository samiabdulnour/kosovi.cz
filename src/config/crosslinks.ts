// Pieces from the other parts of the e-shop, on the light blue band under a listing,
// as under a product page (src/components/RelatedBand.astro), so that the
// blue-and-white porcelain, Daniela's work and Martin's lead to each other
// (Sami, November 2026: Martin's teapots under the blue-and-white teapots,
// Daniela's plates under the plates). Paired by the kind of piece; a tab's
// kinds (the blue-and-white mugs' sizes) take their tab's band.
import type { Lang } from '../i18n/ui';
import type { LineKey } from './lines';

export interface CrossGroup {
  /** The heading over the group's tiles; it opens the listing they come from. */
  title: Record<Lang, string>;
  /** The listing the pieces come from, in its order (a tab's kinds taking
   *  turns); without `entry`, the line's tabs taking turns, and the heading
   *  opens the maker's page (the e-shop's main page for the blue-and-white). */
  from: { line: LineKey; entry?: string };
  /** Only pieces whose slug starts with one of these (Daniela's plates among her decals). */
  only?: string[];
  /** Where the heading leads, where not to the listing the pieces come from. */
  link?: { line: LineKey; entry?: string };
  /** How many tiles; a band has five. */
  count: number;
}

const blueWhite = (entry: string | undefined, title: Record<Lang, string>, count: number): CrossGroup => ({
  title,
  from: { line: 'spolecna', entry },
  count,
});

const toBlueWhite = blueWhite(undefined, { cs: 'Modrobílý porcelán', en: 'Blue and white porcelain' }, 3);
const toMartin = (count: number): CrossGroup => ({ title: { cs: 'Od Martina', en: 'By Martin' }, from: { line: 'martin' }, count });
const toDaniela = (count: number): CrossGroup => ({ title: { cs: 'Od Daniely', en: 'By Daniela' }, from: { line: 'daniela' }, count });

const martinsMugs = (count: number): CrossGroup => ({
  title: { cs: 'Hrnky od Martina', en: 'Mugs by Martin' },
  from: { line: 'martin', entry: 'hrnky-s-razitkem' },
  count,
});
const danielasMugs = (count: number): CrossGroup => ({
  title: { cs: 'Hrnky od Daniely', en: 'Mugs by Daniela' },
  from: { line: 'daniela', entry: 'autorske-hrnky' },
  count,
});
const blueWhiteMugs = blueWhite('hrnky', { cs: 'Modrobílé hrnky', en: 'Blue and white mugs' }, 3);
const blueWhitePlates = blueWhite('talire', { cs: 'Modrobílé talíře', en: 'Blue and white plates' }, 2);

/** By line, then by tab ('' for the line's first listing). */
export const crossLinks: Record<LineKey, Record<string, CrossGroup[]>> = {
  spolecna: {
    '': [toMartin(3), toDaniela(2)],
    hrnky: [martinsMugs(3), danielasMugs(2)],
    talire: [
      {
        title: { cs: 'Talíře od Daniely', en: 'Plates by Daniela' },
        // her plates from both decal tabs, the heading opening Obtisky
        from: { line: 'daniela' },
        only: ['talir-'],
        link: { line: 'daniela', entry: 'obtisky' },
        count: 5,
      },
    ],
    'misky-a-misy': [
      {
        title: { cs: 'Misky od Daniely', en: 'Bowls by Daniela' },
        from: { line: 'daniela', entry: 'obtisky' },
        only: ['miska-'],
        count: 5,
      },
    ],
    konvice: [
      {
        title: { cs: 'Konve od Martina', en: 'Teapots by Martin' },
        from: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
        // the teapots, not the tea sets, which come first in his listing
        only: ['konvic'],
        count: 5,
      },
    ],
    'cukrenky-a-mlicenky': [
      {
        title: { cs: 'Šálky od Daniely', en: 'Cups by Daniela' },
        from: { line: 'daniela', entry: 'obtisky-na-cibulak' },
        only: ['salek-'],
        count: 5,
      },
    ],
    ostatni: [
      { title: { cs: 'Vázy od Martina', en: 'Vases by Martin' }, from: { line: 'martin', entry: 'vazy' }, count: 3 },
      {
        title: { cs: 'Tácy od Daniely', en: 'Trays by Daniela' },
        from: { line: 'daniela', entry: 'obtisky' },
        only: ['tac-'],
        count: 2,
      },
    ],
  },
  martin: {
    '': [toBlueWhite, toDaniela(2)],
    vazy: [toBlueWhite, toDaniela(2)],
    'konve-a-cajove-soupravy': [blueWhite('konvice', { cs: 'Modrobílé konve', en: 'Blue and white teapots' }, 5)],
    'hrnky-s-razitkem': [blueWhiteMugs, danielasMugs(2)],
  },
  daniela: {
    '': [toBlueWhite, toMartin(2)],
    obtisky: [blueWhite('misky-a-misy', { cs: 'Modrobílé misky', en: 'Blue and white bowls' }, 3), blueWhitePlates],
    'obtisky-na-cibulak': [blueWhiteMugs, blueWhitePlates],
    'autorske-hrnky': [blueWhiteMugs, martinsMugs(2)],
  },
};
