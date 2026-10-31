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
// Anything else splits before the first "s", "se" or dash.
const DECOR = /\s(?:s|se)\s|\s[–-]\s/;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function productName(title: string): ProductName {
  const clean = title
    .replace(/^porcelánov[ýáé]\s+/i, '')
    .replace(/\s*\(kopírovat\)\s*$/i, '') // a WordPress copy suffix
    .trim();
  const mug = MUG.exec(clean);
  if (mug?.[1] && mug[2]) return { type: capitalize(mug[1]), decor: mug[2] };
  const at = clean.search(DECOR);
  if (at > 0) return { type: capitalize(clean.slice(0, at)), decor: clean.slice(at + 1).replace(/^[–-]\s+/, '') };
  return { type: capitalize(clean), decor: '' };
}

/** "Hrnek velký se srdcem", for headings and page titles. */
export function productLabel(title: string): string {
  const { type, decor } = productName(title);
  return decor ? `${type} ${decor}` : type;
}
