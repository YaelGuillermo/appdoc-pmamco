import type { Locale } from '../config/locales';

/** URL canónica única; el idioma siempre tiene prefijo (/es/, /en/). */
export const routes = {
  home(locale: Locale): string {
    return `/${locale}/`;
  },
  tutorials(locale: Locale): string {
    return `/${locale}/tutorials/`;
  },
  tutorial(locale: Locale, slug: string): string {
    return `/${locale}/tutorials/${encodeURIComponent(slug)}/`;
  },
  lesson(locale: Locale, tutorialSlug: string, lessonSlug: string): string {
    return `/${locale}/tutorials/${encodeURIComponent(tutorialSlug)}/${encodeURIComponent(lessonSlug)}/`;
  },
} as const;
