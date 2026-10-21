import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Amco Experience: instalación incremental del cuestionario de bienvenida.
 * No sustituye otros tutoriales, lecciones, CSS o assets existentes.
 * --dry-run examina todos los cambios sin escribir archivos.
 * --apply escribe solo cinco archivos existentes, tras crear respaldo en /tmp.
 */
const root = process.cwd();
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
if (args.has('--help') || args.has('-h')) {
  console.log('Uso: node scripts/install-bienvenida.mjs [--dry-run | --apply]');
  process.exit(0);
}
if ([...args].some((argument) => !['--apply', '--dry-run'].includes(argument))) {
  throw new Error('Opción desconocida. Usa --dry-run o --apply.');
}

function inject(file, transform) {
  const path = join(root, file);
  if (!existsSync(path)) throw new Error(`Falta ${file}; instala Amco Experience V2 primero.`);
  const before = readFileSync(path, 'utf8');
  const after = transform(before);
  return { file, path, before, after, changed: before !== after };
}
function replaceOnce(file, source, search, replacement) {
  if (!source.includes(search))
    throw new Error(`${file}: no se encontró el fragmento esperado; no se modificó nada.`);
  return source.replace(search, replacement);
}

const changes = [];
changes.push(
  inject('src/content.config.ts', (original) => {
    let text = original;
    if (!text.includes("'welcome'")) {
      text = replaceOnce(
        'src/content.config.ts',
        text,
        "visual: z.enum(['clock', 'steps']).default('steps'),",
        "visual: z.enum(['clock', 'steps', 'welcome']).default('steps'),",
      );
    }
    if (!text.includes('const assessmentSchema =')) {
      const insert = `/** Cuestionarios de aprendizaje: una sola respuesta, verdadero/falso o relación. */\nconst assessmentSchema = z.discriminatedUnion('type', [\n  z.object({\n    type: z.literal('true_false'),\n    question: z.string().min(12),\n    correct: z.boolean(),\n    explanation: z.string().min(15),\n  }),\n  z.object({\n    type: z.literal('single_choice'),\n    question: z.string().min(12),\n    options: z.tuple([z.string().min(2), z.string().min(2), z.string().min(2), z.string().min(2)]),\n    correctIndex: z.number().int().min(0).max(3),\n    explanation: z.string().min(15),\n  }),\n  z.object({\n    type: z.literal('matching'),\n    question: z.string().min(12),\n    pairs: z.array(z.object({left: z.string().min(2), right: z.string().min(3)}))\n      .min(2).max(5).refine((pairs) =>\n        new Set(pairs.map((pair) => pair.left)).size === pairs.length &&\n        new Set(pairs.map((pair) => pair.right)).size === pairs.length,\n        { message: 'Las relaciones no pueden repetir conceptos' },\n      ),\n    explanation: z.string().min(15),\n  }),\n]);\n\n`;
      text = replaceOnce(
        'src/content.config.ts',
        text,
        '/** Paso → referencia tipada a un tutorial por ID de colección. */',
        insert + '/** Paso → referencia tipada a un tutorial por ID de colección. */',
      );
    }
    if (!text.includes('assessment: assessmentSchema.optional(),')) {
      text = replaceOnce(
        'src/content.config.ts',
        text,
        "    interaction: z.enum(['clock', 'quiz']).optional(),",
        "    interaction: z.enum(['clock', 'quiz']).optional(),\n    assessment: assessmentSchema.optional(),",
      );
    }
    return text;
  }),
);

changes.push(
  inject('scripts/check-content.mjs', (original) => {
    let text = original;
    if (!text.includes("['clock', 'steps', 'welcome']")) {
      text = replaceOnce(
        'scripts/check-content.mjs',
        text,
        "['clock', 'steps']",
        "['clock', 'steps', 'welcome']",
      );
      text = text.replace(
        'visual debe ser clock o steps',
        'visual debe ser clock, steps o welcome',
      );
    }
    if (!text.includes('const lessonBody = readFileSync(file')) {
      const marker = '  for (const match of raw.matchAll(';
      const insert =
        [
          '  // Las imágenes intercaladas en Markdown deben existir en public/.',
          "  const lessonBody = readFileSync(file, 'utf8');",
          '  for (const match of lessonBody.matchAll(/!\\[[^\\]]*\\]\\((\\/assets\\/tutorials\\/[^)\\s]+\\.(?:png|webp|jpe?g))\\)/g)) {',
          "    const asset = join(root, 'public', match[1].slice(1));",
          '    if (!existsSync(asset)) fail(`${rel}: falta imagen intercalada: ${match[1]}`);',
          '  }',
          '',
        ].join('\n') + '\n';
      text = replaceOnce('scripts/check-content.mjs', text, marker, insert + marker);
    }
    return text;
  }),
);

changes.push(
  inject('src/components/tutorial/LessonView.astro', (original) => {
    let text = original;
    if (!text.includes("import LessonAssessment from './LessonAssessment.astro';")) {
      text = replaceOnce(
        'LessonView.astro',
        text,
        "import KnowledgeCheck from './KnowledgeCheck.astro';",
        "import KnowledgeCheck from './KnowledgeCheck.astro';\nimport LessonAssessment from './LessonAssessment.astro';",
      );
    }
    if (
      !text.includes('<LessonAssessment locale={locale} tutorial={tutorial} lesson={lesson} />')
    ) {
      text = replaceOnce(
        'LessonView.astro',
        text,
        '        <div class="lesson-complete">',
        '        {lesson.data.assessment && (\n          <LessonAssessment locale={locale} tutorial={tutorial} lesson={lesson} />\n        )}\n        <div class="lesson-complete">',
      );
    }
    if (!text.includes('data-assessment-progress-status')) {
      const start = text.indexOf('<button', text.indexOf('class="lesson-complete"'));
      const end = text.indexOf('</button>', start);
      if (start === -1 || end === -1)
        throw new Error('LessonView.astro: no se pudo localizar el botón de progreso original.');
      const originalButton = text.slice(start, end + '</button>'.length);
      text =
        text.slice(0, start) +
        `{lesson.data.assessment ? (\n            <div class="experience-assessment__step-state">\n              <Icon name="check-circle" size={18} />\n              <span data-assessment-progress-status>Responde la pregunta para aprender este paso.</span>\n            </div>\n          ) : (\n            ${originalButton}\n          )}` +
        text.slice(end + '</button>'.length);
    }
    return text;
  }),
);

changes.push(
  inject('src/components/tutorial/TutorialOverview.astro', (original) => {
    let text = original;
    if (!text.includes("import WelcomeWorkspaceDemo from './WelcomeWorkspaceDemo.astro';")) {
      text = replaceOnce(
        'TutorialOverview.astro',
        text,
        "import ClockDemo from './ClockDemo.astro';",
        "import ClockDemo from './ClockDemo.astro';\nimport WelcomeWorkspaceDemo from './WelcomeWorkspaceDemo.astro';",
      );
    }
    if (
      !text.includes(
        '<WelcomeWorkspaceDemo locale={locale} tutorial={tutorial} lessons={lessons} />',
      )
    ) {
      text = replaceOnce(
        'TutorialOverview.astro',
        text,
        '</BaseLayout>',
        '  {tutorial.data.visual === \'welcome\' && (\n    <div class="container"><WelcomeWorkspaceDemo locale={locale} tutorial={tutorial} lessons={lessons} /></div>\n  )}\n</BaseLayout>',
      );
    }
    return text;
  }),
);

changes.push(
  inject('src/scripts/progress.ts', (original) => {
    if (original.includes("document.addEventListener('amco:assessment-passed'")) return original;
    const insert = `\n/** Respuestas correctas: marcar el paso aprendido, sin depender de un check manual. */\ndocument.addEventListener('amco:assessment-passed', (event: Event) => {\n  if (!(event instanceof CustomEvent)) return;\n  const data: unknown = event.detail;\n  if (!data || typeof data !== 'object') return;\n  const { locale, tutorialKey, step } = data as Record<string, unknown>;\n  if (typeof locale !== 'string' || typeof tutorialKey !== 'string' || typeof step !== 'string') return;\n  const before = readState(locale, tutorialKey);\n  if (!before.includes(step)) saveState(locale, tutorialKey, [...before, step]);\n  renderAll();\n});\n`;
    return original + insert;
  }),
);

// All preflight checks succeeded, so the installer is atomic at the validation stage.
for (const item of changes) console.log(`${item.changed ? 'MODIFICAR' : 'OK'} ${item.file}`);
if (!apply) {
  console.log('PREVISUALIZACIÓN. No se modificó ningún archivo. Ejecuta --apply para instalar.');
  process.exit(0);
}
const needed = changes.filter((change) => change.changed);
if (!needed.length) {
  console.log('YA INSTALADO: no hubo cambios.');
  process.exit(0);
}
const backup = mkdtempSync(join(tmpdir(), 'amco-experience-bienvenida-'));
for (const change of needed) {
  const previous = join(backup, change.file);
  mkdirSync(dirname(previous), { recursive: true });
  copyFileSync(change.path, previous);
}
try {
  for (const change of needed) writeFileSync(change.path, change.after, 'utf8');
} catch (error) {
  for (const change of needed) {
    copyFileSync(join(backup, change.file), change.path);
  }
  throw error;
}
console.log(`INSTALADO: ${needed.length} archivos existentes actualizados. Respaldo: ${backup}`);
