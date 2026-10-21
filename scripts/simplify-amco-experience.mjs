import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  rmSync,
  readdirSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const root = resolve(process.cwd());
const args = new Set(process.argv.slice(2));
if (
  [...args].some((value) => !['--dry-run', '--apply'].includes(value)) ||
  (args.has('--dry-run') && args.has('--apply'))
) {
  throw new Error('Usa --dry-run o --apply, no ambos.');
}
const apply = args.has('--apply');
const obsolete = [
  'src/pages/[locale]/platforms/index.astro',
  'src/pages/[locale]/platforms/[platform]/index.astro',
  'src/pages/[locale]/platforms/[platform]/tutorials/[tutorial]/index.astro',
  'src/pages/[locale]/platforms/[platform]/tutorials/[tutorial]/[lesson].astro',
  'src/pages/[locale]/tutorials/index.astro',
  'src/content/platforms/es/raccord.md',
  'src/content/platforms/es/genially.md',
  'src/components/platform/PlatformCard.astro',
  'src/components/layout/LegacyRedirect.astro',
  'src/lib/platforms.ts',
];
const tutorialFiles = [
  { file: 'src/content/tutorials/es/bienvenida-gestor-tareas.md', order: 1 },
  { file: 'src/content/tutorials/es/registrar-tiempo.md', order: 2 },
];
const required = [
  'src/content/platforms/es/pm-amco-editorial.md',
  'src/content/lessons/es/bienvenida-gestor-tareas/01-primer-acceso-e-idioma.md',
  'src/content/lessons/es/registrar-tiempo/01-localiza-la-tarea-y-su-reloj.md',
  'src/components/tutorial/WelcomeWorkspaceDemo.astro',
  'src/components/tutorial/ClockDemo.astro',
];
for (const file of required) {
  if (!existsSync(join(root, file)))
    throw new Error(`No se modificó nada: falta ${file}; instala V2 + Bienvenida.`);
}

function changeOrder({ file, order }) {
  const path = join(root, file);
  if (!existsSync(path)) throw new Error(`Falta tutorial ${file}`);
  const previous = readFileSync(path, 'utf8');
  if (!previous.startsWith('---\n')) throw new Error(`${file}: frontmatter YAML inválido`);
  const end = previous.indexOf('\n---', 4);
  if (end < 0) throw new Error(`${file}: frontmatter sin cerrar`);
  let head = previous.slice(0, end);
  const tail = previous.slice(end);
  if (/^order:\s*\d+$/m.test(head)) head = head.replace(/^order:\s*\d+$/m, `order: ${order}`);
  else {
    const visual = /^visual:\s*[a-z-]+$/m;
    if (!visual.test(head)) throw new Error(`${file}: campo visual no encontrado`);
    head = head.replace(visual, (match) => `${match}\norder: ${order}`);
  }
  // Compatible con un estado previo de V2 que aún no ejecutó la migración de IDs.
  head = head.replace(/^platform:\s*pm-amco-editorial$/m, 'platform: es/pm-amco-editorial');
  const expected = `${head}${tail}`;
  return { file, order, path, previous, expected, changed: previous !== expected };
}
const cssPath = join(root, 'src/styles/experience.css');
if (!existsSync(cssPath)) throw new Error('No se modificó nada: falta src/styles/experience.css.');
const cssOriginal = readFileSync(cssPath, 'utf8');
const cssAdded = `

/* Inicio único: identidad de la aplicación sobre sus dos tutoriales. */
.experience-app-heading {
  display: flex;
  align-items: center;
  gap: clamp(16px, 3vw, 28px);
  padding: 22px 0 30px;
  margin-bottom: clamp(24px, 4vw, 44px);
  border-bottom: 1px solid rgba(25, 46, 62, .13);
}
.experience-app-heading__monogram {
  display: grid;
  place-items: center;
  flex: 0 0 clamp(70px, 9vw, 96px);
  width: clamp(70px, 9vw, 96px);
  aspect-ratio: 1;
  border-radius: 22px;
  background: #e6e0d4;
  color: #1b3043;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -.05em;
}
.experience-app-heading__copy { flex: 1; min-width: 0; }
.experience-app-heading__copy h2 { margin: 7px 0; font-size: clamp(25px, 3vw, 37px); letter-spacing: -.04em; line-height: 1.1; }
.experience-app-heading__copy p { margin: 0; line-height: 1.6; max-width: 710px; }
@media (max-width: 740px) {
  .experience-app-heading { align-items: flex-start; flex-wrap: wrap; }
  .experience-app-heading > .catalog-count { margin-left: 0; width: 100%; }
}
`;
const cssChanged = !cssOriginal.includes(
  '/* Inicio único: identidad de la aplicación sobre sus dos tutoriales. */',
);
const updates = tutorialFiles.map(changeOrder);
const deletes = obsolete.filter((file) => existsSync(join(root, file)));
console.log('Amco Experience · inicio único · PM Amco Editorial');
for (const update of updates)
  console.log(`${update.changed ? 'ACTUALIZAR' : 'OK'} ${update.file} (orden ${update.order})`);
for (const file of deletes) console.log(`RETIRAR ${file}`);
console.log(`${cssChanged ? 'EXTENDER' : 'OK'} src/styles/experience.css`);
if (!apply) {
  console.log(
    `PREVISUALIZACIÓN: ${updates.filter((u) => u.changed).length} actualizaciones, ${deletes.length} archivos retirados. Nada modificado.`,
  );
  process.exit(0);
}
const backups = [
  ...updates.filter((u) => u.changed).map((u) => u.file),
  ...deletes,
  ...(cssChanged ? ['src/styles/experience.css'] : []),
];
if (!backups.length) {
  console.log('YA APLICADO: sin cambios.');
  process.exit(0);
}
const backup = mkdtempSync(join(tmpdir(), 'amco-experience-home-'));
for (const file of backups) {
  const backupFile = join(backup, file);
  mkdirSync(dirname(backupFile), { recursive: true });
  copyFileSync(join(root, file), backupFile);
}
try {
  for (const item of updates.filter((u) => u.changed)) writeFileSync(item.path, item.expected);
  if (cssChanged) writeFileSync(cssPath, cssOriginal + cssAdded);
  for (const file of deletes) rmSync(join(root, file));
} catch (error) {
  for (const file of backups) {
    const dest = join(root, file);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(join(backup, file), dest);
  }
  throw error;
}
// Only remove empty route parent directories; do not delete unrecognized user files.
for (const dir of [
  'src/pages/[locale]/platforms/[platform]/tutorials/[tutorial]',
  'src/pages/[locale]/platforms/[platform]/tutorials',
  'src/pages/[locale]/platforms/[platform]',
  'src/pages/[locale]/platforms',
  'src/components/platform',
]) {
  const path = join(root, dir);
  if (existsSync(path) && readdirSync(path).length === 0) rmSync(path, { recursive: true });
}
console.log(
  `LISTO: ${updates.filter((u) => u.changed).length} tutoriales ordenados, ${deletes.length} archivos retirados y estilos ampliados: ${cssChanged}. Respaldo: ${backup}`,
);
