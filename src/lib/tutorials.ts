import type { Locale } from '../config/locales';
import { getCatalog, type Lesson, type Platform, type Tutorial } from './catalog';

export type { Tutorial, Lesson } from './catalog';

/** Sólo acepta una plataforma real; ya no hay cadenas de key arbitrarias. */
export async function listTutorials(locale: Locale, platform: Platform): Promise<Tutorial[]> {
  const groups = await getCatalog(locale);
  return (
    groups
      .find((group) => group.platform.id === platform.id)
      ?.tutorials.map((group) => group.tutorial) ?? []
  );
}

/** Sólo acepta un tutorial real; los IDs de las referencias son tipados por Astro. */
export async function listLessons(tutorial: Tutorial, locale: Locale): Promise<Lesson[]> {
  const groups = await getCatalog(locale);
  return (
    groups
      .flatMap((platform) => platform.tutorials)
      .find((group) => group.tutorial.id === tutorial.id)
      ?.lessons.slice() ?? []
  );
}

export async function findTutorial(
  locale: Locale,
  platform: Platform,
  slug: string,
): Promise<Tutorial | undefined> {
  return (await listTutorials(locale, platform)).find((tutorial) => tutorial.data.slug === slug);
}

export type Chapter = {
  title: string;
  lessons: Lesson[];
};

export function chapterTitle(section: Lesson['data']['section'], locale: Locale): string {
  const titles = {
    discover: { es: 'Primero, ubícate', en: 'Get oriented' },
    practice: { es: 'Ahora, manos a la obra', en: 'Try it yourself' },
    review: { es: 'Revisa y corrige', en: 'Review and adjust' },
    finish: { es: 'Ponlo en práctica', en: 'Put it into practice' },
  } as const;
  return titles[section][locale];
}

export function groupChapters(lessons: readonly Lesson[], locale: Locale): Chapter[] {
  const groups: Chapter[] = [];
  for (const lesson of lessons) {
    const title = chapterTitle(lesson.data.section, locale);
    const last = groups[groups.length - 1];
    if (last?.title === title) last.lessons.push(lesson);
    else groups.push({ title, lessons: [lesson] });
  }
  return groups;
}
