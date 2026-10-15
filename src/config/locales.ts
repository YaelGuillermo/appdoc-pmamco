/** Spanish is the only published locale; English is a future capability. */
export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/** Habilitar 'en' solo tras incorporar tutoriales y lecciones traducidos. */
export const PUBLISHED_LOCALES: readonly Locale[] = ['es'];

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export const LANGUAGE_HTML: Record<Locale, string> = {
  en: 'en',
  es: 'es',
};

export function isLocale(input: string): input is Locale {
  return LOCALES.some((locale) => locale === input);
}

export function isPublishedLocale(input: string): input is Locale {
  return isLocale(input) && PUBLISHED_LOCALES.includes(input);
}

/** Es la única función que decide a dónde lleva el inicio público. */
export function getLandingLocale(): Locale {
  return PUBLISHED_LOCALES.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : (PUBLISHED_LOCALES[0] ?? DEFAULT_LOCALE);
}
