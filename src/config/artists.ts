// The makers' pages: rows of photographs on colour fields across the whole
// width, as on the homepage (src/components/Mosaic.astro), each photo with
// its caption on hover. Martin's after docs/design/kosovi_martin.pdf, each
// photo opening its category in his part of the e-shop (vases, teapots and
// tea sets, stamped mugs); a photo in none of them opens nothing for now.
// Daniela's after docs/design/kosovi_daniela.pdf, those of her first two
// categories opening them (decals, decals on onion pattern); the rest open
// nothing until their categories come (Sami, November 2026). The photos are the PDFs' own
// (src/assets/artists/).
import type { MakerKey } from './site';
import type { MosaicRow } from './mosaic';

import mVazy from '../assets/artists/martin/vazy.jpg';
import mKonve from '../assets/artists/martin/konve.jpg';
import mCajoveSoupravy from '../assets/artists/martin/cajove-soupravy.jpg';
import mVazySVazkami from '../assets/artists/martin/vazy-s-vazkami.jpg';
import mVazaTulipany from '../assets/artists/martin/vaza-tulipany.jpg';
import mHrnekRazitko1 from '../assets/artists/martin/hrnek-razitko-1.jpg';
import mTenkostenneHrnky from '../assets/artists/martin/tenkostenne-hrnky.jpg';
import mHrnekRazitko2 from '../assets/artists/martin/hrnek-razitko-2.jpg';
import mVazaRuze from '../assets/artists/martin/vaza-ruze.jpg';
import mCajovaSouprava from '../assets/artists/martin/cajova-souprava.jpg';
import mVazaModra from '../assets/artists/martin/vaza-modra.jpg';
import mZlateKonvicky from '../assets/artists/martin/zlate-konvicky.jpg';
import mVazaKvetiny from '../assets/artists/martin/vaza-kvetiny.jpg';

import dObtisky from '../assets/artists/daniela/obtisky.jpg';
import dCibulakTestoviny from '../assets/artists/daniela/cibulak-testoviny.jpg';
import dObtiskyNaCibulak from '../assets/artists/daniela/obtisky-na-cibulak.jpg';
import dByk from '../assets/artists/daniela/byk.jpg';
import dCibulakOvoce from '../assets/artists/daniela/cibulak-ovoce.jpg';
import dSosky from '../assets/artists/daniela/sosky.jpg';
import dHrnek from '../assets/artists/daniela/hrnek.jpg';
import dCibulakTalire from '../assets/artists/daniela/cibulak-talire.jpg';
import dPtaci from '../assets/artists/daniela/ptaci.jpg';
import dKachlicky from '../assets/artists/daniela/kachlicky.jpg';
import dMiskaNaZmrzlinu from '../assets/artists/daniela/miska-na-zmrzlinu.jpg';

export interface ArtistPageDesign {
  rows: MosaicRow[];
}

const painted = { cs: 'Malovaný cibulák', en: 'Painted onion pattern' };

export const artistPages: Record<MakerKey, ArtistPageDesign> = {
  // Positions are the PDF's own (kosovi_martin.pdf), rounded to a tenth of a
  // point. The labels are the PDF's, "vážkami" for its "váškami".
  martin: {
    rows: [
      {
        h: 605.5,
        items: [
          {
            x: 0,
            w: 437.4,
            caption: { cs: 'Vázy', en: 'Vases' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazy, alt: 'Bílá váza s plastickým povrchem a rozevřeným hrdlem' },
          },
          {
            x: 437.4,
            w: 551.3,
            caption: { cs: 'Konve', en: 'Teapots' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mKonve, alt: 'Zelená konvice s plastickým dekorem a ratanovým uchem na žlutém pozadí' },
          },
          {
            x: 988.7,
            w: 523.3,
            caption: { cs: 'Čajové soupravy', en: 'Tea sets' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mCajoveSoupravy, alt: 'Světle modrá čajová souprava: konvice s rýhovaným tělem a tři misky' },
          },
        ],
      },
      {
        h: 674.4,
        items: [
          { x: 0, w: 1512, color: '#a2dcf5' },
          {
            x: 54.6,
            w: 848.2,
            caption: { cs: 'Vázy s vážkami', en: 'Vases with dragonflies' },
            shop: { line: 'martin', entry: 'vazy' },
            light: true,
            photo: { src: mVazySVazkami, alt: 'Dvě kulaté vázy a vysoká váza s malovanými vážkami na modrém pozadí' },
          },
          {
            x: 938.3,
            w: 522.7,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            // on phones the third photograph (Sami, November 2026)
            phone: 3,
            photo: { src: mVazaTulipany, alt: 'Bílá váza s plastickými tečkami, v ní žluté tulipány a fialové kosatce, za ní obraz' },
          },
        ],
      },
      {
        h: 525.9,
        items: [
          { x: 366.5, w: 739.4, color: '#fff8dc' },
          {
            x: 0,
            w: 390,
            caption: { cs: 'Hrnek razítko', en: 'Stamped mug' },
            shop: { line: 'martin', entry: 'hrnky-s-razitkem' },
            photo: { src: mHrnekRazitko1, alt: 'Šedý hrnek s razítkem čtverců' },
          },
          // in none of the three categories, so it opens nothing for now (Sami, November 2026)
          {
            x: 444.4,
            w: 523.7,
            caption: { cs: 'Tenkostěnné hrnky', en: 'Thin-walled cups' },
            photo: { src: mTenkostenneHrnky, alt: 'Bílé šálky a podšálky na dřevěném prkénku, pohled shora' },
          },
          {
            x: 1021.4,
            w: 490.6,
            caption: { cs: 'Hrnek razítko', en: 'Stamped mug' },
            shop: { line: 'martin', entry: 'hrnky-s-razitkem' },
            photo: { src: mHrnekRazitko2, alt: 'Zelený hrnek s razítkem důlků' },
          },
        ],
      },
      {
        h: 718.5,
        items: [
          { x: 156.8, w: 739.4, color: '#c6e2d0' },
          {
            x: 0,
            w: 502,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaRuze, alt: 'Tmavě modrá váza se zlatým okrajem, v ní růže' },
          },
          {
            x: 555.1,
            w: 538.9,
            caption: { cs: 'Čajová souprava', en: 'Tea set' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            photo: { src: mCajovaSouprava, alt: 'Čajová souprava: konvice s ratanovým uchem a tři misky s modrou malbou na žlutém pozadí' },
          },
          {
            x: 1094,
            w: 418,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaModra, alt: 'Vysoká váza s modrým vlnitým dekorem' },
          },
        ],
      },
      {
        h: 678.5,
        items: [
          { x: 0, w: 1294.5, color: '#a2dcf5' },
          {
            x: 272.1,
            w: 508.8,
            caption: { cs: 'Zlaté konvičky', en: 'Gilded pots' },
            shop: { line: 'martin', entry: 'konve-a-cajove-soupravy' },
            light: true,
            photo: { src: mZlateKonvicky, alt: 'Dva šálky zlacené uvnitř na zeleném pozadí' },
          },
          {
            x: 995.8,
            w: 516.2,
            caption: { cs: 'Váza', en: 'Vase' },
            shop: { line: 'martin', entry: 'vazy' },
            photo: { src: mVazaKvetiny, alt: 'Světle zelená váza s důlky, v ní bílé a růžové květiny, na dřevěném stole' },
          },
        ],
      },
    ],
  },
  // Positions are the PDF's own (kosovi_daniela.pdf), rounded to a tenth of a
  // point; the rows as far apart as everywhere else, not the PDF's 37 points
  // (Sami, November 2026). The labels are the PDF's, "kuchyně" for its
  // "kuchině".
  daniela: {
    rows: [
      {
        h: 605.5,
        items: [
          {
            x: 0,
            w: 437.4,
            caption: { cs: 'Obtisky', en: 'Decals' },
            shop: { line: 'daniela', entry: 'obtisky' },
            photo: { src: dObtisky, alt: 'Miska s barevnými obtisky, loďkou, rybami a geometrickými tvary, na světle modrém pozadí' },
          },
          {
            x: 437.4,
            w: 523.3,
            caption: painted,
            photo: { src: dCibulakTestoviny, alt: 'Talíř s malovanými květy a těstovinami, vedle vidlička, na bílém ubrusu' },
          },
          {
            x: 960.9,
            w: 551.1,
            caption: { cs: 'Obtisky na cibulák', en: 'Decals on onion pattern' },
            shop: { line: 'daniela', entry: 'obtisky-na-cibulak' },
            photo: { src: dObtiskyNaCibulak, alt: 'Šálek s barevnými obtisky na oranžovém pozadí' },
          },
        ],
      },
      {
        h: 737.3,
        items: [
          { x: 449.9, w: 1062.1, color: '#a8d4fd' },
          {
            x: 0,
            w: 592.2,
            caption: { cs: 'Býk', en: 'Bull' },
            photo: { src: dByk, alt: 'Modrá kresba býčí hlavy s rohy' },
          },
          {
            x: 592.8,
            w: 621.2,
            caption: painted,
            photo: { src: dCibulakOvoce, alt: 'Hranatá miska s modře malovaným okrajem plná červeného ovoce na dřevěném stole' },
          },
        ],
      },
      {
        h: 480,
        items: [
          {
            x: 0,
            w: 810.8,
            caption: { cs: 'Sošky', en: 'Figurines' },
            photo: { src: dSosky, alt: 'Tři bílé sošky s malovanými obličeji na červeném pozadí' },
          },
          {
            x: 810.8,
            w: 701.2,
            caption: { cs: 'Hrnek', en: 'Cup' },
            photo: { src: dHrnek, alt: 'Prořezávaný hrnek bez ucha na prořezávaném podšálku, na šedém pozadí' },
          },
        ],
      },
      {
        h: 674.2,
        items: [
          { x: 0, w: 1512, color: '#ffb0d3' },
          {
            x: 117.9,
            w: 789.3,
            caption: painted,
            light: true,
            photo: { src: dCibulakTalire, alt: 'Dva talíře s modře malovanou tváří a býčí hlavou na tmavě modrém pozadí' },
          },
          {
            x: 956.7,
            w: 555.3,
            caption: { cs: 'Ptáci', en: 'Birds' },
            photo: { src: dPtaci, alt: 'Modrá a růžová kresba ptáků' },
          },
        ],
      },
      {
        h: 675.8,
        items: [
          {
            x: 0,
            w: 681.3,
            caption: { cs: 'Kachličky do kuchyně', en: 'Kitchen tiles' },
            photo: { src: dKachlicky, alt: 'Čtvercové kachličky s barevnými anděly, položené vedle sebe' },
          },
          {
            x: 668.7,
            w: 843.3,
            caption: { cs: 'Miska na zmrzlinu', en: 'Ice cream bowl' },
            light: true,
            photo: { src: dMiskaNaZmrzlinu, alt: 'Bílá miska na podnosu se skleněnými kuličkami místo nožek, na šedém pozadí' },
          },
        ],
      },
    ],
  },
};
