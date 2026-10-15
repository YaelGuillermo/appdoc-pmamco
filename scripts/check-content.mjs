import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (message) => errors.push(message);
const pathFromRoot = (path) => join(root, path);
const read = (path) => readFileSync(pathFromRoot(path), 'utf8');

function walk(folder) {
  if (!existsSync(folder)) return [];
  const result = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) result.push(...walk(path));
    else if (entry.isFile()) result.push(path);
  }
  return result;
}

function frontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (!block) {
    fail(`${relative(root, file)}: missing YAML frontmatter`);
    return { data: new Map(), raw };
  }
  const data = new Map();
  for (const match of block[1].matchAll(/^([a-zA-Z][\w]*):\s*(.*?)\s*$/gm)) {
    let value = match[2];
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    data.set(match[1], value);
  }
  return { data, raw: block[1] };
}

// Check the Git index as well: .gitignore alone does not untrack old files.
if (existsSync(pathFromRoot('.git'))) {
  const tracked = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  if (tracked.status === 0) {
    for (const file of tracked.stdout.split('\0').filter(Boolean)) {
      if (/^(?:node_modules|dist|\.astro|coverage)\//.test(file))
        fail(`Generated file tracked by Git: ${file}`);
      if (/^(?:\.env(?:\..*)?|envs\/\.env(?:\..*)?)$/.test(file) && !file.endsWith('.example')) {
        fail(`Private environment file tracked by Git: ${file}`);
      }
    }
  }
}

const headerFile = read('src/components/layout/Header.astro');
if (!headerFile.includes('PUBLISHED_LOCALES.length > 1')) {
  fail('Header must hide its language switcher while a single language is published');
}
const schemaFile = read('src/content.config.ts');
if ((schemaFile.match(/z\.enum\(LOCALES\)/g) ?? []).length !== 2) {
  fail('Content schemas must reuse the canonical LOCALES registry in both collections');
}
const localesFile = read('src/config/locales.ts');
if (!/DEFAULT_LOCALE:\s*Locale\s*=\s*['"]es['"]/.test(localesFile)) {
  fail('src/config/locales.ts: DEFAULT_LOCALE must be es');
}
if (!/PUBLISHED_LOCALES:\s*readonly Locale\[\]\s*=\s*\[\s*['"]es['"]\s*\]/.test(localesFile)) {
  fail('src/config/locales.ts: only es may be published');
}
if (!/LOCALES\s*=\s*\[[^\]]*['"]en['"][^\]]*['"]es['"]/.test(localesFile)) {
  fail('src/config/locales.ts: future en/es locale support is missing');
}

const contentBase = pathFromRoot('src/content');
for (const section of ['tutorials', 'lessons']) {
  const english = join(contentBase, section, 'en');
  if (!existsSync(english))
    fail(`${relative(root, english)}: English placeholder directory missing`);
  const files = walk(english).filter(
    (file) => !['.gitkeep', '.gitignore'].includes(file.split('/').at(-1)),
  );
  if (files.length) fail(`${relative(root, english)} must stay empty (except .gitkeep)`);
}

const legacy = pathFromRoot('translations');
for (const file of walk(legacy)) {
  if (['.md', '.mdx'].includes(extname(file).toLowerCase()) && file.split('/').includes('en')) {
    fail(`${relative(root, file)}: obsolete English Markdown translation`);
  }
}

const allContent = walk(contentBase).filter((file) => ['.md', '.mdx'].includes(extname(file)));
for (const file of allContent) {
  if (
    !file.startsWith(join(contentBase, 'tutorials', 'es') + '/') &&
    !file.startsWith(join(contentBase, 'lessons', 'es') + '/')
  ) {
    fail(`${relative(root, file)}: only Spanish content is permitted`);
  }
}

const tutorials = new Map();
const tutorialFiles = walk(join(contentBase, 'tutorials', 'es')).filter((file) =>
  file.endsWith('.md'),
);
for (const file of tutorialFiles) {
  const { data } = frontmatter(file);
  const key = data.get('key');
  if (!key || tutorials.has(key))
    fail(`${relative(root, file)}: missing or duplicate tutorial key`);
  else tutorials.set(key, file);
  if (data.get('locale') !== 'es') fail(`${relative(root, file)}: locale must be es`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.get('slug') ?? '')) {
    fail(`${relative(root, file)}: invalid tutorial slug`);
  }
}

const groups = new Map();
const lessonFiles = walk(join(contentBase, 'lessons', 'es')).filter((file) => file.endsWith('.md'));
for (const file of lessonFiles) {
  const { data, raw } = frontmatter(file);
  const rel = relative(root, file);
  if (data.get('locale') !== 'es') fail(`${rel}: locale must be es`);
  const key = data.get('tutorial');
  if (!tutorials.has(key)) fail(`${rel}: tutorial key does not reference a Spanish tutorial`);
  const slug = data.get('slug');
  const basename = file.split('/').at(-1)?.replace(/^\d+-/, '').replace(/\.md$/, '');
  if (slug !== basename) fail(`${rel}: slug "${slug}" does not match file name "${basename}"`);
  const order = Number(data.get('order'));
  if (!Number.isSafeInteger(order) || order < 1) fail(`${rel}: invalid lesson order`);
  const group = groups.get(key) ?? [];
  group.push({ order, slug, file: rel });
  groups.set(key, group);

  for (const match of raw.matchAll(
    /^\s*- file:\s*(\/assets\/tutorials\/[^\s]+\.(?:png|webp|jpe?g))\s*$/gm,
  )) {
    const asset = join(root, 'public', match[1].slice(1));
    if (!existsSync(asset)) fail(`${rel}: screenshot missing: ${match[1]}`);
  }
}

for (const [key, lessons] of groups) {
  const sorted = lessons.toSorted((a, b) => a.order - b.order);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].order !== i + 1) fail(`${key}: lesson order must be consecutive from 1`);
  }
  if (new Set(lessons.map((l) => l.slug)).size !== lessons.length)
    fail(`${key}: duplicate lesson slug`);
}
for (const key of tutorials.keys()) {
  if (!groups.has(key)) fail(`${key}: tutorial has no lessons`);
}
if (!tutorialFiles.length || !lessonFiles.length) fail('Spanish tutorials or lessons are missing');

if (errors.length) {
  errors.forEach((error) => console.error(`[content] FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `[content] PASS ${tutorialFiles.length} Spanish tutorials, ${lessonFiles.length} lessons; English is unpublished and empty.`,
  );
}
