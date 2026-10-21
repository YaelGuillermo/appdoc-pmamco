import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLOCK_ASSESSMENTS } from './clock-assessment-bank.mjs';

/**
 * Parche incremental para Amco Experience (despues de Bienvenida + rutas inglesas).
 * - Conserva las nueve lecciones originales: agrega solo su frontmatter assessment.
 * - Sustituye el cuestionario compartido por controles accesibles sin <select>.
 * - Respalda cada archivo modificado en una carpeta temporal antes de escribir.
 * - Permite --dry-run y es idempotente.
 */
const repo = resolve(process.cwd());
const mode = process.argv[2];
if (mode === '--help' || mode === '-h') {
  console.log('Uso: node scripts/install-clock-assessments.mjs --dry-run | --apply');
  process.exit(0);
}
if (!['--apply', '--dry-run'].includes(mode) || process.argv.length !== 3) {
  throw new Error('Debes indicar --dry-run o --apply.');
}
const apply = mode === '--apply';
const bundle = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(repo, path), 'utf8');
const changes = new Map();

function check(path) {
  if (!existsSync(join(repo, path)))
    throw new Error(`Falta ${path}. Instala antes Amco Experience V2 y Bienvenida.`);
}
function stage(path, next, note) {
  const dest = join(repo, path);
  const old = existsSync(dest) ? readFileSync(dest, 'utf8') : null;
  changes.set(path, { path, old, next, note, changed: old !== next });
}
function quoted(value) {
  return JSON.stringify(value);
}
function assessmentToYaml(assessment) {
  const lines = [
    '# amco-clock-assessment-v1',
    'assessment:',
    `  type: ${assessment.type}`,
    `  question: ${quoted(assessment.question)}`,
  ];
  if (assessment.type === 'true_false') {
    lines.push(`  correct: ${assessment.correct}`);
  } else if (assessment.type === 'single_choice') {
    lines.push('  options:');
    for (const option of assessment.options) lines.push(`    - ${quoted(option)}`);
    lines.push(`  correctIndex: ${assessment.correctIndex}`);
  } else if (assessment.type === 'matching') {
    lines.push('  pairs:');
    for (const pair of assessment.pairs) {
      lines.push(`    - left: ${quoted(pair.left)}`);
      lines.push(`      right: ${quoted(pair.right)}`);
    }
  } else {
    throw new Error(`Tipo de evaluacion desconocido: ${assessment.type}`);
  }
  lines.push(`  explanation: ${quoted(assessment.explanation)}`);
  return lines.join('\n');
}

check('package.json');
check('src/content.config.ts');
check('src/components/tutorial/LessonView.astro');
check('src/components/tutorial/LessonAssessment.astro');
check('src/scripts/assessment.ts');
check('src/scripts/progress.ts');
check('src/lib/assessment-engine.ts');

const schema = read('src/content.config.ts');
if (!schema.includes('assessment: assessmentSchema.optional()')) {
  throw new Error(
    'La coleccion lessons aun no acepta assessment. Instala el tutorial de bienvenida primero.',
  );
}
/** Repara el listener borrado por la migracion de rutas, sin reemplazar el progreso. */
const progressPath = 'src/scripts/progress.ts';
const progress = read(progressPath);
if (
  !progress.includes('function readState(') ||
  !progress.includes('function saveState(') ||
  !progress.includes('function renderAll(')
) {
  throw new Error(`${progressPath}: estructura de progreso desconocida. No se sobrescribira.`);
}
const listenerPresent = /document\.addEventListener\(\s*['"]amco:assessment-passed['"]/.test(
  progress,
);
const progressListener = `
/** Respuestas correctas: marcar el paso aprendido y actualizar todas las vistas. */
document.addEventListener('amco:assessment-passed', (event: Event) => {
  if (!(event instanceof CustomEvent)) return;
  const data: unknown = event.detail;
  if (!data || typeof data !== 'object') return;
  const { locale, tutorialKey, step } = data as Record<string, unknown>;
  if (typeof locale !== 'string' || typeof tutorialKey !== 'string' || typeof step !== 'string') return;
  const before = readState(locale, tutorialKey);
  if (!before.includes(step)) saveState(locale, tutorialKey, [...before, step]);
  renderAll();
});
`;
stage(
  progressPath,
  listenerPresent ? progress : progress.trimEnd() + '\n' + progressListener,
  listenerPresent ? 'Conector de evaluaciones ya existe' : 'Restaurar guardado de evaluaciones',
);

/** Corrige exclusivamente la cadena rota en el sitemap; preserva rutas existentes. */
const sitemapPath = 'src/pages/sitemap.xml.ts';
check(sitemapPath);
const sitemap = read(sitemapPath);
if (!sitemap.includes('<urlset xmlns=') || !sitemap.includes('absoluteUrl(')) {
  throw new Error(`${sitemapPath}: no tiene la estructura conocida; no se sobreescribira.`);
}
const brokenNewlineJoin = /\.join\((['"])\r?\n\1\)/g;
const repairedSitemap = sitemap.replace(brokenNewlineJoin, ".join('\\n')");
stage(
  sitemapPath,
  repairedSitemap,
  repairedSitemap === sitemap
    ? 'Sitemap: sin correccion necesaria'
    : 'Reparar literal de salto de linea en el sitemap',
);

const timeDir = 'src/content/lessons/es/registrar-tiempo';
const bankOrders = new Set();
for (const assessment of CLOCK_ASSESSMENTS) {
  const order = assessment.order;
  if (bankOrders.has(order)) throw new Error(`Pregunta duplicada para el paso ${order}`);
  bankOrders.add(order);
  const index = String(order).padStart(2, '0');
  const { readdirSync } = await import('node:fs');
  const filenames = readdirSync(join(repo, timeDir)).filter(
    (name) => name.startsWith(`${index}-`) && name.endsWith('.md'),
  );
  if (filenames.length !== 1)
    throw new Error(
      `El paso ${index} debe tener exactamente un archivo Markdown; encontre ${filenames.length}.`,
    );
  const path = `${timeDir}/${filenames[0]}`;
  const old = read(path);
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n)/.exec(old);
  if (!match) throw new Error(`${path}: falta frontmatter YAML valido.`);
  if (!new RegExp(`^order:\\s*${order}\\s*$`, 'm').test(match[1]))
    throw new Error(`${path}: orden no coincide.`);
  if (!/^tutorial:\s*(?:es\/registrar-tiempo|time-tracking)\s*$/m.test(match[1]))
    throw new Error(`${path}: referencia de tutorial inesperada.`);
  if (/^assessment:\s*$/m.test(match[1])) {
    if (!match[1].includes('# amco-clock-assessment-v1')) {
      throw new Error(`${path}: ya tiene una evaluacion distinta; no se sobrescribira.`);
    }
    stage(path, old, 'Pregunta ya instalada');
    continue;
  }
  const frontmatter = assessmentToYaml(assessment);
  const next = old.replace(match[0], `${match[0].slice(0, -3)}${frontmatter}\n---`);
  if (next === old) throw new Error(`No fue posible actualizar ${path}`);
  stage(path, next, `Nueva pregunta ${assessment.type}`);
}
if (bankOrders.size !== 9 || [...bankOrders].some((n) => n < 1 || n > 9))
  throw new Error('Se necesitan 9 preguntas (pasos 1 a 9).');

const lessonViewPath = 'src/components/tutorial/LessonView.astro';
const lessonView = read(lessonViewPath);
if (
  !lessonView.includes('<LessonAssessment locale={locale} tutorial={tutorial} lesson={lesson} />')
) {
  throw new Error(
    'LessonView.astro no integra LessonAssessment: aplica Bienvenida antes de este parche.',
  );
}
const oldQuiz =
  /lesson\.data\.interaction\s*===\s*'quiz'\s*&&\s*tutorial\.data\.visual\s*===\s*'clock'\s*&&\s*\(/;
const newQuiz =
  /lesson\.data\.interaction\s*===\s*'quiz'\s*&&\s*!lesson\.data\.assessment\s*&&\s*tutorial\.data\.visual\s*===\s*'clock'\s*&&\s*\(/;
if (!oldQuiz.test(lessonView) && !newQuiz.test(lessonView)) {
  throw new Error(
    'LessonView.astro tiene una condicion de KnowledgeCheck desconocida: no se modifica.',
  );
}
const guardedQuiz =
  "lesson.data.interaction === 'quiz' && !lesson.data.assessment && tutorial.data.visual === 'clock' && (";
stage(
  lessonViewPath,
  newQuiz.test(lessonView) ? lessonView : lessonView.replace(oldQuiz, guardedQuiz),
  'Evitar cuestionarios duplicados en el paso 9',
);

const templates = [
  'src/components/tutorial/LessonAssessment.astro',
  'src/scripts/assessment.ts',
  'src/styles/assessment-choices.css',
];
for (const path of templates) {
  const payload = join(bundle, 'payload', path);
  if (!existsSync(payload)) throw new Error(`El ZIP esta incompleto: falta payload/${path}`);
  const expected = readFileSync(payload, 'utf8');
  const previous = existsSync(join(repo, path)) ? read(path) : null;
  if (
    path.endsWith('LessonAssessment.astro') &&
    previous &&
    !previous.includes('data-assessment-choice') &&
    !previous.includes('experience-assessment--polished')
  ) {
    throw new Error(`${path}: personalizacion no reconocida; revisa antes de reemplazar.`);
  }
  if (
    path.endsWith('src/scripts/assessment.ts') &&
    previous &&
    !previous.includes('amco:assessment-passed') &&
    !previous.includes('markStepAsLearned')
  ) {
    throw new Error(`${path}: implementacion de evaluacion no reconocida.`);
  }
  if (
    path.endsWith('assessment-choices.css') &&
    previous &&
    previous !== expected &&
    !previous.includes('Amco Experience | Respuestas personalizadas')
  ) {
    throw new Error(`${path}: ya existe con otro contenido, por seguridad no se sobrescribe.`);
  }
  const installed =
    previous !== null &&
    ((path.endsWith('LessonAssessment.astro') &&
      previous.includes('experience-assessment--polished') &&
      previous.includes('data-assessment-match-option')) ||
      (path.endsWith('assessment.ts') &&
        previous.includes('matchingButtons') &&
        previous.includes('data-assessment-match-pair')) ||
      (path.endsWith('assessment-choices.css') &&
        previous.includes('Amco Experience | Respuestas personalizadas')));
  stage(path, installed ? previous : expected, 'Componente o estilo reutilizable de cuestionarios');
}

console.log(
  `\n[amco-assessments] ${apply ? 'INSTALACION' : 'PREVISUALIZACION'} - sin cambios fuera de estos archivos:`,
);
for (const item of changes.values()) {
  console.log(`${item.changed ? 'MODIFICAR' : 'SIN CAMBIOS'} ${item.path} - ${item.note}`);
}
if (!apply) {
  console.log(
    '\n[amco-assessments] No se escribio ningun archivo. Ejecuta --apply para confirmar.',
  );
  process.exit(0);
}
const changed = [...changes.values()].filter((item) => item.changed);
if (changed.length === 0) {
  console.log('[amco-assessments] Parche ya aplicado, no hay cambios.');
  process.exit(0);
}
const backup = mkdtempSync(join(tmpdir(), 'amco-clock-assessments-'));
for (const item of changed) {
  if (item.old === null) continue;
  const target = join(backup, item.path);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(repo, item.path), target);
}
try {
  for (const item of changed) {
    const target = join(repo, item.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, item.next, 'utf8');
  }
} catch (error) {
  for (const item of changed) {
    const dest = join(repo, item.path);
    if (item.old === null) rmSync(dest, { force: true });
    else copyFileSync(join(backup, item.path), dest);
  }
  throw error;
}
console.log(`[amco-assessments] OK: ${changed.length} archivos actualizados. Respaldo: ${backup}`);
console.log('[amco-assessments] Ejecuta: pnpm exec prettier --write . && pnpm check');
