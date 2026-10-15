import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/locales';

export type Tutorial = CollectionEntry<'tutorials'>;
export type Lesson = CollectionEntry<'lessons'>;

export async function listTutorials(locale: Locale): Promise<Tutorial[]> {
  const items = await getCollection(
    'tutorials',
    (entry) => entry.data.locale === locale && entry.data.published,
  );
  return items.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title),
  );
}

export async function listLessons(tutorialKey: string, locale: Locale): Promise<Lesson[]> {
  const items = await getCollection(
    'lessons',
    (entry) =>
      entry.data.tutorial === tutorialKey && entry.data.locale === locale && entry.data.published,
  );
  return items.sort((a, b) => a.data.order - b.data.order);
}

export async function findTutorial(locale: Locale, slug: string): Promise<Tutorial | undefined> {
  const items = await listTutorials(locale);
  return items.find((tutorial) => tutorial.data.slug === slug);
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
