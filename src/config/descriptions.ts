// The short text on a product page (kosovi_eshop_produkt.pdf), per kind of
// piece, keyed by the menu entry slug in src/config/lines.ts (a kind first,
// then its tab). Products without one show their old description.
//
// The mug text is Sami's (the PDF, November 2026; "mičky" corrected). The
// others follow it and use only the source facts in CLAUDE.md: thrown on the
// wheel, painted with cobalt, dishwasher and microwave safe.
// TODO(text): Sami to approve the texts other than the mugs'.
import type { LineKey } from './lines';

export const kindTexts: Partial<Record<LineKey, Record<string, string>>> = {
  spolecna: {
    hrnky: 'Porcelánový hrnek ručně točený i malovaný. Hrnek můžete vkládat do myčky, mikrovlnné trouby i ledničky.',
    'talir-zavesny': 'Porcelánový závěsný talíř, ručně točený i malovaný.',
    'talir-praktik': 'Porcelánový talíř ručně točený i malovaný. Můžete ho vkládat do myčky i mikrovlnné trouby.',
    'miska-mala': 'Porcelánová miska ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'miska-velka': 'Porcelánová miska ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'misa-salatova': 'Porcelánová salátová mísa ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'talire-misky-misy': 'Porcelán ručně točený i malovaný. Můžete ho vkládat do myčky i mikrovlnné trouby.',
    // TODO(fakta): can the teapots with their rattan handle go in the dishwasher or microwave?
    konvice: 'Porcelánová konvice ručně točená i malovaná, s ratanovým uchem.',
    'cukrenka-velka': 'Porcelánová cukřenka s víčkem, ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'cukrenka-mala': 'Porcelánová cukřenka s víčkem, ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'mlicenka-velka': 'Porcelánová mlíčenka ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'mlicenka-mala': 'Porcelánová mlíčenka ručně točená i malovaná. Můžete ji vkládat do myčky i mikrovlnné trouby.',
    'podsalek-velky': 'Porcelánový podšálek, ručně točený. Můžete ho vkládat do myčky i mikrovlnné trouby.',
    'podsalek-maly': 'Porcelánový podšálek, ručně točený. Můžete ho vkládat do myčky i mikrovlnné trouby.',
    // TODO(fakta): can the moulds go in the oven, and to what temperature?
    'babovka-velka': 'Porcelánová forma na bábovku, ručně točená.',
    'babovka-mala': 'Porcelánová forma na bábovku, ručně točená.',
    panaky: 'Porcelánový panák ručně točený i malovaný. Můžete ho vkládat do myčky i mikrovlnné trouby.',
  },
};
