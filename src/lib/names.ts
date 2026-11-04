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

/**
 * The motif of a piece for finding others with the same decor: the first word
 * of its decor without diacritics, cut to three letters, so "s kotvou" and
 * "s kotvami", "se srdcem" and "se srdci" match. Undefined without a decor.
 */
export function motifKey(title: string): string | undefined {
  const { decor } = productName(title);
  const word = decor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z]+/)
    .find((w) => w.length >= 3 && !['pro', 'nad', 'pod'].includes(w));
  return word?.slice(0, 3);
}
