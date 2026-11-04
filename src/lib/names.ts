// How a product is named under its photo (design eshop.pdf): the type
// ("Hrnek velký") in capitals and the decor ("se srdcem") in small letters,
// without "Porcelánový". The data keeps the old titles unchanged.

export interface ProductName {
  type: string;
  decor: string;
}

// Mug titles: the type is "hrnek" with its size or kind, the rest is the decor,
// even without a preposition ("hrnek velký den a noc").
const MUG = /^((?:mini )?hrnek(?: (?:pitný režim|na presso|velký|střední|malý|úzký|široký|bílý))?)\s+(.+)$/i;
// Shot glasses: "panák", the rest is the motif ("panák smajlík", "panák na imunitu").
const SHOT = /^(panák)\s+(.+)$/i;
// Bábovka moulds: the colour goes to the second line ("bábovka velká modrá").
const MOULD = /^(bábovka(?: malá| velká)?)\s+(bílá|modrá)$/i;
// Anything else splits before the first "s", "se" or dash.
const DECOR = /\s(?:s|se)\s|\s[–-]\s/;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function productName(title: string): ProductName {
  const clean = title
    .replace(/^porcelánov[ýáé]\s+/i, '')
    .replace(/\s*\(kopírovat\)\s*$/i, '') // a WordPress copy suffix
    .trim();
  for (const pattern of [MUG, SHOT, MOULD]) {
    const match = pattern.exec(clean);
    if (match?.[1] && match[2]) return { type: capitalize(match[1]), decor: match[2] };
  }
  const at = clean.search(DECOR);
  if (at > 0) return { type: capitalize(clean.slice(0, at)), decor: clean.slice(at + 1).replace(/^[–-]\s+/, '') };
  return { type: capitalize(clean), decor: '' };
}

/** "Hrnek velký se srdcem", for headings and page titles. */
export function productLabel(title: string): string {
  const { type, decor } = productName(title);
  return decor ? `${type} ${decor}` : type;
}

// Motifs in the decors, so related pieces can be found: word stems (without
// diacritics) that name the same thing, e.g. a bicycle or a fish.
const MOTIFS: [RegExp, string][] = [
  [/^andel/, 'andel'],
  [/^(kol[oaeu]?|kolem|bicykl\w*|jizdni\w*|elektrokol\w*|cyklist\w*|bike)$/, 'kolo'],
  [/^kolobez/, 'kolobezka'],
  [/^(srdc|srdic)/, 'srdce'],
  [/^(ryb[aeiokuy]|rybk|rybar|sardin)/, 'ryba'],
  [/^velryb/, 'velryba'],
  [/^delfin/, 'delfin'],
  [/^kotv/, 'kotva'],
  [/^(lod|plachet)/, 'lod'],
  [/^cap/, 'cap'],
  [/^kocar/, 'kocarek'],
  [/^koc/, 'kocka'],
  [/^(kon[eiěs]|koni|konsk)/, 'kun'],
  [/^slun/, 'slunce'],
  [/^spiral/, 'spirala'],
  [/^hvezd/, 'hvezda'],
  [/^aut(o|y|em|a)?$/, 'auto'],
  [/^letad/, 'letadlo'],
  [/^zelv/, 'zelva'],
  [/^pegas/, 'pegas'],
  [/^(pruh|prouz)/, 'pruh'],
  [/^precl/, 'precl'],
  [/^tulipan/, 'tulipan'],
  [/^noc/, 'noc'],
  [/^(lyzar|ski|apreski)/, 'lyze'],
];
const SKIP = new Set(['s', 'se', 'na', 'a', 'v', 've', 'z', 'ze', 'do', 'pro', 'ramecku', 'malym', 'malymi', 'velkym', 'dvema', 'hlavou']);

/**
 * The motifs of a piece's decor, e.g. ['andel', 'kolo'] for "s andělem na
 * kole" and ['kolo'] for "s bicykly". Empty without a decor.
 */
export function decorMotifs(title: string): string[] {
  const { decor } = productName(title);
  const words = decor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z]+/)
    .filter((w) => w && !SKIP.has(w));
  const motifs = words.map((w) => MOTIFS.find(([re]) => re.test(w))?.[1] ?? w.slice(0, 4));
  return [...new Set(motifs)].sort();
}
