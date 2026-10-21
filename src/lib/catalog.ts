import { getCollection, type CollectionEntry } from 'astro:content';
import { PUBLISHED_LOCALES, type Locale } from '../config/locales';

/** Modelo de dominio: una aplicación posee tutoriales y estos poseen pasos. */
export type Platform = CollectionEntry<'platforms'>;
export type Tutorial = CollectionEntry<'tutorials'>;
export type Lesson = CollectionEntry<'lessons'>;

export interface TutorialGroup {
  readonly tutorial: Tutorial;
  readonly lessons: readonly Lesson[];
}

export interface PlatformGroup {
  readonly platform: Platform;
  readonly tutorials: readonly TutorialGroup[];
}

export interface TutorialContext {
  readonly platform: Platform;
  readonly tutorial: Tutorial;
  readonly lessons: readonly Lesson[];
}

const byOrder = (a: Lesson, b: Lesson): number => a.data.order - b.data.order;

/**
 * Único punto para construir el árbol publicado. Ningún tutorial puede mostrarse
 * fuera de su aplicación ni un paso fuera de su tutorial. En vez de ocultar
 * relaciones rotas, detenemos el build con un mensaje editorial preciso.
 */
export async function getCatalog(locale: Locale): Promise<readonly PlatformGroup[]> {
  const [platforms, tutorials, lessons] = await Promise.all([
    getCollection('platforms', (entry) => entry.data.locale === locale && entry.data.published),
    getCollection('tutorials', (entry) => entry.data.locale === locale && entry.data.published),
    getCollection('lessons', (entry) => entry.data.locale === locale && entry.data.published),
  ]);

  const platformById = new Map(platforms.map((platform) => [platform.id, platform]));
  const tutorialById = new Map(tutorials.map((tutorial) => [tutorial.id, tutorial]));
  const tutorialsByPlatform = new Map<string, Tutorial[]>();
  const lessonsByTutorial = new Map<string, Lesson[]>();

  for (const tutorial of tutorials) {
    const platformId = tutorial.data.platform.id;
    const platform = platformById.get(platformId);
    if (!platform) {
      throw new Error(
        `Tutorial ${tutorial.id}: aplicación no publicada o inexistente (${platformId})`,
      );
    }
    if (platform.data.locale !== tutorial.data.locale) {
      throw new Error(
        `Tutorial ${tutorial.id}: idioma distinto al de la aplicación ${platform.id}`,
      );
    }
    const items = tutorialsByPlatform.get(platformId) ?? [];
    items.push(tutorial);
    tutorialsByPlatform.set(platformId, items);
  }

  for (const lesson of lessons) {
    const tutorialId = lesson.data.tutorial.id;
    const tutorial = tutorialById.get(tutorialId);
    if (!tutorial) {
      throw new Error(`Paso ${lesson.id}: tutorial no publicado o inexistente (${tutorialId})`);
    }
    if (tutorial.data.locale !== lesson.data.locale) {
      throw new Error(`Paso ${lesson.id}: idioma distinto al del tutorial ${tutorial.id}`);
    }
    const items = lessonsByTutorial.get(tutorialId) ?? [];
    items.push(lesson);
    lessonsByTutorial.set(tutorialId, items);
  }

  return platforms
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map((platform) => ({
      platform,
      tutorials: (tutorialsByPlatform.get(platform.id) ?? [])
        .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
        .map((tutorial) => {
          const ordered = (lessonsByTutorial.get(tutorial.id) ?? []).sort(byOrder);
          if (ordered.length === 0) {
            throw new Error(`Tutorial publicado sin pasos: ${tutorial.id}`);
          }
          if (ordered.some((step, index) => step.data.order !== index + 1)) {
            throw new Error(`Tutorial ${tutorial.id}: pasos sin orden consecutivo a partir de 1`);
          }
          return { tutorial, lessons: ordered };
        }),
    }));
}

export async function listPublishedTutorialContexts(): Promise<readonly TutorialContext[]> {
  const catalogs = await Promise.all(PUBLISHED_LOCALES.map(getCatalog));
  return catalogs.flatMap((groups) =>
    groups.flatMap(({ platform, tutorials }) =>
      tutorials.map(({ tutorial, lessons }) => ({ platform, tutorial, lessons })),
    ),
  );
}

/** Almacenamiento con scope por plataforma. Evita colisiones entre aplicaciones. */
export function tutorialProgressKey(tutorial: Tutorial): string {
  return `${tutorial.data.platform.id}/${tutorial.data.key}`;
}
