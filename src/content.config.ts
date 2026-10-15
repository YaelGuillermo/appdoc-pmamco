import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { LOCALES } from './config/locales';

/**
 * El ID interno identifica el archivo completo, incluyendo idioma y tutorial.
 * El slug del frontmatter se reserva para las URL publicas, que no cambian.
 * Ejemplo: es/registrar-tiempo/01-localiza-la-tarea-y-su-reloj.
 */
function entryIdFromPath({ entry }: { entry: string }): string {
  return entry.replace(/\.md$/i, '');
}

/** Un tutorial es el conjunto; las lecciones son pasos independientes. */
const tutorials = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/tutorials',
    generateId: entryIdFromPath,
  }),
  schema: z.object({
    key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    locale: z.enum(LOCALES),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(8),
    description: z.string().min(20),
    category: z.enum(['basics', 'planning', 'tracking']),
    difficulty: z.enum(['beginner', 'intermediate']),
    estimatedMinutes: z.number().int().positive(),
    updatedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    outcomes: z.array(z.string().min(8)).min(2).max(5),
  }),
});

const screenshot = z.object({
  file: z.string().regex(/^\/assets\/tutorials\/[a-z0-9/_-]+\.(png|webp|jpg|jpeg)$/),
  alt: z.string().min(8),
  caption: z.string().min(8),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons', generateId: entryIdFromPath }),
  schema: z.object({
    locale: z.enum(LOCALES),
    tutorial: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    order: z.number().int().positive(),
    section: z.enum(['discover', 'practice', 'review', 'finish']),
    title: z.string().min(8),
    description: z.string().min(18),
    takeaway: z.string().min(14),
    estimatedMinutes: z.number().int().positive(),
    screenshots: z.array(screenshot).default([]),
    note: z.string().optional(),
    interaction: z.enum(['clock', 'quiz']).optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { tutorials, lessons };
