import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { LOCALES } from './config/locales';

/**
 * Los IDs se derivan de la ubicación editorial, nunca del slug público.
 * Ejemplos: es/pm-amco-editorial, es/registrar-tiempo y
 * es/registrar-tiempo/01-localiza-la-tarea-y-su-reloj.
 */
function entryIdFromPath({ entry }: { entry: string }): string {
  return entry.replace(/\.md$/i, '');
}

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** Plataforma → puede tener cero o más tutoriales. */
const platforms = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/platforms',
    generateId: entryIdFromPath,
  }),
  schema: z.object({
    key: slug,
    locale: z.enum(LOCALES),
    slug,
    title: z.string().min(3),
    label: z.string().min(3),
    summary: z.string().min(20),
    description: z.string().min(30),
    monogram: z.string().min(1).max(3),
    accent: z.enum(['sand', 'lilac', 'sage']).default('sand'),
    order: z.number().int().positive(),
    published: z.boolean().default(false),
  }),
});

/** Tutorial → referencia tipada a una plataforma por ID de colección. */
const tutorials = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/tutorials',
    generateId: entryIdFromPath,
  }),
  schema: z.object({
    key: slug,
    locale: z.enum(LOCALES),
    slug,
    platform: reference('platforms'),
    visual: z.enum(['clock', 'steps', 'welcome']).default('steps'),
    order: z.number().int().positive(),
    category: z.enum(['basics', 'planning', 'tracking']),
    difficulty: z.enum(['beginner', 'intermediate']),
    title: z.string().min(8),
    description: z.string().min(20),
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

/** Cuestionarios de aprendizaje: una sola respuesta, verdadero/falso o relación. */
const assessmentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('true_false'),
    question: z.string().min(12),
    correct: z.boolean(),
    explanation: z.string().min(15),
  }),
  z.object({
    type: z.literal('single_choice'),
    question: z.string().min(12),
    options: z.tuple([z.string().min(2), z.string().min(2), z.string().min(2), z.string().min(2)]),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().min(15),
  }),
  z.object({
    type: z.literal('matching'),
    question: z.string().min(12),
    pairs: z
      .array(z.object({ left: z.string().min(2), right: z.string().min(3) }))
      .min(2)
      .max(5)
      .refine(
        (pairs) =>
          new Set(pairs.map((pair) => pair.left)).size === pairs.length &&
          new Set(pairs.map((pair) => pair.right)).size === pairs.length,
        { message: 'Las relaciones no pueden repetir conceptos' },
      ),
    explanation: z.string().min(15),
  }),
]);

/** Paso → referencia tipada a un tutorial por ID de colección. */
const lessons = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/lessons',
    generateId: entryIdFromPath,
  }),
  schema: z.object({
    locale: z.enum(LOCALES),
    tutorial: reference('tutorials'),
    slug,
    order: z.number().int().positive(),
    section: z.enum(['discover', 'practice', 'review', 'finish']),
    title: z.string().min(8),
    description: z.string().min(18),
    takeaway: z.string().min(14),
    estimatedMinutes: z.number().int().positive(),
    screenshots: z.array(screenshot).default([]),
    note: z.string().optional(),
    interaction: z.enum(['clock', 'quiz']).optional(),
    assessment: assessmentSchema.optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { platforms, tutorials, lessons };
