export const languages = { cs: 'Čeština', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'cs';

// UI strings. Page copy lives in src/content/pages (phase 4 and 6).
export const ui = {
  cs: {
    'site.tagline': 'Porcelánový ateliér v Praze',
    'skip.toMain': 'Přeskočit na obsah',
    'nav.label': 'Hlavní navigace',
    'nav.collections': 'Kolekce',
    'nav.martin': 'Martin Kos',
    'nav.daniela': 'Daniela Kosová',
    'nav.process': 'Jak vzniká',
    'nav.about': 'O nás',
    'nav.courses': 'Kurzy',
    'nav.contact': 'Kontakt',
    'nav.cart': 'Košík',
    'lang.switch': 'English',
    'footer.legal': 'Právní informace',
    'footer.terms': 'Obchodní podmínky',
    'footer.privacy': 'Ochrana osobních údajů',
    'footer.returns': 'Reklamace a odstoupení',
    'product.priceOnRequest': 'Cena na dotaz',
    'product.thrownBy': 'Točil Martin',
    'product.paintedBy': 'malovala Daniela',
    'product.paintedByStart': 'Malovala Daniela',
    'collection.all': 'Vše',
    'collection.categories': 'Kategorie',
  },
  en: {
    'site.tagline': 'Porcelain studio in Prague',
    'skip.toMain': 'Skip to content',
    'nav.label': 'Main navigation',
    'nav.collections': 'Collections',
    'nav.martin': 'Martin Kos',
    'nav.daniela': 'Daniela Kosová',
    'nav.process': 'How it’s made',
    'nav.about': 'About',
    'nav.courses': 'Courses',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'lang.switch': 'Česky',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms and conditions',
    'footer.privacy': 'Privacy',
    'footer.returns': 'Complaints and returns',
    'product.priceOnRequest': 'Price on request',
    'product.thrownBy': 'Thrown by Martin',
    'product.paintedBy': 'painted by Daniela',
    'product.paintedByStart': 'Painted by Daniela',
    'collection.all': 'All',
    'collection.categories': 'Categories',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)['cs'];
