// @ts-check
import { defineConfig } from 'astro/config';

// Production runs at the root of kosovi.cz. Previews on GitHub Pages live
// under a sub-path, so the workflows pass SITE_URL and BASE_PATH.
const site = process.env.SITE_URL || 'https://kosovi.cz';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  // Old WordPress URLs end with a slash (/produkt/<slug>/), keep it that way.
  trailingSlash: 'always',
  build: {
    // GitHub Pages runs Jekyll, which drops folders starting with "_".
    assets: 'assets',
  },
  i18n: {
    locales: ['cs', 'en'],
    defaultLocale: 'cs',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
