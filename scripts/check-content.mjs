import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (message) => errors.push(message);
const pathFromRoot = (path) => join(root, path);
const read = (path) => readFileSync(pathFromRoot(path), 'utf8');

function walk(folder) {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  });
}

function markdownFiles(collection, locale = 'es') {
  return walk(pathFromRoot(`src/content/${collection}/${locale}`)).filter((file) =>
    file.endsWith('.md'),
  );
}

function yaml(file) {
  const raw = readFileSync(file, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (!match) {
    fail(`${relative(root, file)}: falta el frontmatter YAML`);
    return { data: new Map(), raw: '' };
  }
  const data = new Map();
  for (const token of match[1].matchAll(/^([a-zA-Z][\w]*):\s*(.*?)\s*$/gm)) {
    let value = token[2];
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    data.set(token[1], value);
  }
  return { data, raw: match[1] };
}

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const assertSlug = (value, field, file) => {
  if (!slug.test(value ?? '')) fail(`${file}: ${field} inválido: ${value}`);
};
const assertUnique = (set, key, file) => {
  if (set.has(key)) fail(`${file}: clave/ruta duplicada: ${key}`);
  set.add(key);
};
const idOf = (collection, file) =>
  relative(pathFromRoot(`src/content/${collection}`), file)
    .replaceAll(sep, '/')
    .replace(/\.md$/, '');

// Git no debe guardar archivos generados ni secretos.
if (existsSync(pathFromRoot('.git'))) {
  const tracked = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  if (tracked.status === 0) {
    for (const file of tracked.stdout.split('\0').filter(Boolean)) {
      if (/^(?:node_modules|dist|\.astro|coverage)\//.test(file)) {
        fail(`Archivo generado versionado: ${file}`);
      }
      if (/^(?:\.env(?:\..*)?|envs\/\.env(?:\..*)?)$/.test(file) && !file.endsWith('.example')) {
        fail(`Archivo privado versionado: ${file}`);
      }
    }
  }
}

const header = read('src/components/layout/Header.astro');
if (!header.includes('PUBLISHED_LOCALES.length > 1')) {
  fail('Header: el selector de idiomas debe ocultarse mientras solo exista español');
}
const schema = read('src/content.config.ts');
if ((schema.match(/z\.enum\(LOCALES\)/g) ?? []).length !== 3) {
  fail('Las tres colecciones deben reutilizar LOCALES');
}
if (!schema.includes("reference('platforms')") || !schema.includes("reference('tutorials')")) {
  fail('Relaciones plataforma→tutorial→paso deben usar reference() tipado de Astro');
}
const locales = read('src/config/locales.ts');
if (!/DEFAULT_LOCALE:\s*Locale\s*=\s*['"]es['"]/.test(locales)) {
  fail('DEFAULT_LOCALE debe ser es');
}
if (!/PUBLISHED_LOCALES:\s*readonly Locale\[\]\s*=\s*\[\s*['"]es['"]\s*\]/.test(locales)) {
  fail('Sólo es puede publicarse por ahora');
}
if (!/LOCALES\s*=\s*\[[^\]]*['"]en['"][^\]]*['"]es['"]/.test(locales)) {
  fail('Soporte en/es futuro ausente');
}
const layout = read('src/components/layout/BaseLayout.astro');
if (!layout.includes("import '../../styles/experience.css'")) {
  fail('BaseLayout debe cargar experience.css; sin ello las tarjetas aparecen sin estilos');
}

const contentBase = pathFromRoot('src/content');
for (const collection of ['platforms', 'tutorials', 'lessons']) {
  const english = join(contentBase, collection, 'en');
  if (!existsSync(english)) fail(`Falta ${relative(root, english)} para futuras traducciones`);
  const leftovers = walk(english).filter(
    (file) => !['.gitkeep', '.gitignore'].includes(file.split(sep).at(-1)),
  );
  if (leftovers.length)
    fail(`No se debe publicar contenido inglés todavía: ${relative(root, english)}`);
}
for (const file of walk(pathFromRoot('translations'))) {
  if (['.md', '.mdx'].includes(extname(file).toLowerCase()) && file.split(sep).includes('en')) {
    fail(`Traducción Markdown antigua: ${relative(root, file)}`);
  }
}
for (const file of walk(contentBase).filter((item) => ['.md', '.mdx'].includes(extname(item)))) {
  if (
    ![
      ...['platforms', 'tutorials', 'lessons'].map(
        (collection) => join(contentBase, collection, 'es') + sep,
      ),
    ].some((folder) => file.startsWith(folder))
  ) {
    fail(`Archivo fuera del contenido español publicado: ${relative(root, file)}`);
  }
}

const platformFiles = markdownFiles('platforms');
const tutorialFiles = markdownFiles('tutorials');
const lessonFiles = markdownFiles('lessons');
const platformById = new Map();
const tutorialById = new Map();
const platformKeys = new Set();
const platformSlugs = new Set();
const platformOrder = new Set();
const tutorialKeys = new Set();
const tutorialRoutes = new Set();
const tutorialSlugs = new Set();
const tutorialOrders = new Set();
const lessonRoutes = new Set();
const groups = new Map();

for (const file of platformFiles) {
  const { data } = yaml(file);
  const rel = relative(root, file);
  const id = idOf('platforms', file);
  const key = data.get('key');
  const platformSlug = data.get('slug');
  assertSlug(key, 'key', rel);
  assertSlug(platformSlug, 'slug', rel);
  assertUnique(platformKeys, key, rel);
  assertUnique(platformSlugs, platformSlug, rel);
  assertUnique(platformOrder, data.get('order'), rel);
  if (data.get('locale') !== 'es') fail(`${rel}: idioma debe ser es`);
  if (!Number.isSafeInteger(Number(data.get('order'))) || Number(data.get('order')) < 1) {
    fail(`${rel}: order debe ser un entero positivo`);
  }
  platformById.set(id, { ...Object.fromEntries(data), id, file: rel });
}

for (const file of tutorialFiles) {
  const { data } = yaml(file);
  const rel = relative(root, file);
  const id = idOf('tutorials', file);
  const key = data.get('key');
  const tutorialSlug = data.get('slug');
  const platformId = data.get('platform');
  const platform = platformById.get(platformId);
  assertSlug(key, 'key', rel);
  assertSlug(tutorialSlug, 'slug', rel);
  assertUnique(tutorialSlugs, tutorialSlug, rel);
  const tutorialOrder = Number(data.get('order'));
  if (!Number.isSafeInteger(tutorialOrder) || tutorialOrder < 1)
    fail(`${rel}: order debe ser entero positivo`);
  assertUnique(tutorialOrders, `${platformId}/${tutorialOrder}`, rel);
  assertUnique(tutorialKeys, `${platformId}/${key}`, rel);
  assertUnique(tutorialRoutes, `${platformId}/${tutorialSlug}`, rel);
  if (data.get('locale') !== 'es') fail(`${rel}: idioma debe ser es`);
  if (!/^es\/[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(platformId ?? '')) {
    fail(`${rel}: platform debe ser ID tipado, ej. es/pm-amco-editorial`);
  }
  if (!platform) fail(`${rel}: aplicación referenciada no existe: ${platformId}`);
  else if (data.get('published') === 'true' && platform.published !== 'true') {
    fail(`${rel}: un tutorial publicado no puede depender de aplicación oculta: ${platformId}`);
  }
  if (!['clock', 'steps', 'welcome'].includes(data.get('visual'))) {
    fail(`${rel}: visual debe ser clock, steps o welcome`);
  }
  tutorialById.set(id, { ...Object.fromEntries(data), id, file: rel });
}

for (const file of lessonFiles) {
  const { data, raw } = yaml(file);
  const rel = relative(root, file);
  const tutorialId = data.get('tutorial');
  const tutorial = tutorialById.get(tutorialId);
  const stepSlug = data.get('slug');
  const basename = file.split(sep).at(-1)?.replace(/^\d+-/, '').replace(/\.md$/, '');
  if (data.get('locale') !== 'es') fail(`${rel}: idioma debe ser es`);
  if (!/^es\/[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(tutorialId ?? '')) {
    fail(`${rel}: tutorial debe ser ID tipado, ej. es/registrar-tiempo`);
  }
  if (!tutorial) fail(`${rel}: tutorial referenciado no existe: ${tutorialId}`);
  else if (data.get('published') !== 'false' && tutorial.published !== 'true') {
    fail(`${rel}: paso publicado con tutorial oculto: ${tutorialId}`);
  }
  // El nombre del archivo es editorial (puede ser español); el slug público es inglés.
  if (!basename) fail(`${rel}: nombre de archivo de paso inválido`);
  assertSlug(stepSlug, 'slug', rel);
  const order = Number(data.get('order'));
  if (!Number.isSafeInteger(order) || order < 1) fail(`${rel}: order debe ser entero positivo`);
  assertUnique(lessonRoutes, `${tutorialId}/${stepSlug}`, rel);
  const items = groups.get(tutorialId) ?? [];
  if (data.get('published') !== 'false') items.push({ order, slug: stepSlug });
  groups.set(tutorialId, items);

  // Las imágenes intercaladas en Markdown deben existir en public/.
  const lessonBody = readFileSync(file, 'utf8');
  for (const match of lessonBody.matchAll(
    /!\[[^\]]*\]\((\/assets\/tutorials\/[^)\s]+\.(?:png|webp|jpe?g))\)/g,
  )) {
    const asset = join(root, 'public', match[1].slice(1));
    if (!existsSync(asset)) fail(`${rel}: falta imagen intercalada: ${match[1]}`);
  }

  for (const match of raw.matchAll(
    /^\s*- file:\s*(\/assets\/tutorials\/[^\s]+\.(?:png|webp|jpe?g))\s*$/gm,
  )) {
    const asset = join(root, 'public', match[1].slice(1));
    if (!existsSync(asset)) fail(`${rel}: falta captura: ${match[1]}`);
  }
}

for (const [id, tutorial] of tutorialById) {
  if (tutorial.published !== 'true') continue;
  const items = (groups.get(id) ?? []).sort((a, b) => a.order - b.order);
  if (items.length === 0) fail(`${tutorial.file}: tutorial publicado sin pasos`);
  for (const [index, item] of items.entries()) {
    if (item.order !== index + 1) fail(`${tutorial.file}: los pasos deben numerarse 1, 2, 3...`);
  }
  if (new Set(items.map((item) => item.order)).size !== items.length) {
    fail(`${tutorial.file}: orden duplicado`);
  }
}

if (!platformFiles.length || !tutorialFiles.length || !lessonFiles.length) {
  fail('Faltan aplicaciones, tutoriales o pasos en español');
}
if (errors.length) {
  errors.forEach((error) => console.error(`[content] FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `[content] PASS ${platformFiles.length} aplicaciones, ${tutorialFiles.length} tutorial(s), ${lessonFiles.length} lessons; typed refs and Spanish-only publication.`,
  );
}
