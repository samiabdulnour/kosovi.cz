import { cz } from '../lib/typography';
import { defaultLang, languages, ui, type Lang, type UiKey } from './ui';

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

export function langOf(locale: string | undefined): Lang {
  return isLang(locale) ? locale : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => {
    const text = ui[lang][key] ?? ui[defaultLang][key];
    return lang === 'cs' ? cz(text) : text;
  };
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a root-relative path with the base path (previews run under a sub-path). */
export function withBase(path: string): string {
  return `${base}${path}`;
}
