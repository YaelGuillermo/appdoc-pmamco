import type { Locale } from '../config/locales';

/** No hay catálogo intermedio. Segmentos públicos siempre en inglés. */
export const routes = {
  home(locale: Locale): string {
    return `/${locale}/`;
  },
  tutorials(locale: Locale): string {
    return `/${locale}/#tutoriales`;
  },
  solution(locale: Locale, slug: string): string {
    return `/${locale}/#${encodeURIComponent(slug)}`;
  },
  tutorial(locale: Locale, solutionSlug: string, tutorialSlug: string): string {
    return `/${locale}/${encodeURIComponent(solutionSlug)}/tutorials/${encodeURIComponent(tutorialSlug)}/`;
  },
  lesson(locale: Locale, solutionSlug: string, tutorialSlug: string, lessonSlug: string): string {
    return `/${locale}/${encodeURIComponent(solutionSlug)}/tutorials/${encodeURIComponent(tutorialSlug)}/${encodeURIComponent(lessonSlug)}/`;
  },
} as const;
