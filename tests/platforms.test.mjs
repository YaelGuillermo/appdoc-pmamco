import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const get = (file) => readFileSync(join(root, file), 'utf8');
const source = (section) =>
  readdirSync(join(root, `src/content/${section}/es`))
    .filter((name) => name.endsWith('.md'))
    .map((name) => get(`src/content/${section}/es/${name}`));
const field = (text, name) => new RegExp(`^${name}:\\s*([^\\r\\n]+)`, 'm').exec(text)?.[1]?.trim();

test('only PM Amco Editorial is published as an application', () => {
  const apps = source('platforms');
  assert.equal(apps.length, 1);
  assert.equal(field(apps[0], 'key'), 'pm-amco-editorial');
  assert.equal(field(apps[0], 'published'), 'true');
});

test('home is the only tutorial catalog and lists welcome before time-tracking', () => {
  const tutorials = source('tutorials').sort(
    (a, b) => Number(field(a, 'order')) - Number(field(b, 'order')),
  );
  assert.deepEqual(
    tutorials.map((item) => field(item, 'key')),
    ['bienvenida-gestor-tareas', 'time-tracking'],
  );
  assert.deepEqual(
    tutorials.map((item) => field(item, 'order')),
    ['1', '2'],
  );
  assert.ok(tutorials.every((item) => field(item, 'platform') === 'es/pm-amco-editorial'));
  const home = get('src/pages/[locale]/index.astro');
  assert.match(home, /TutorialCard/);
  assert.match(home, /id="tutoriales"/);
  assert.doesNotMatch(home, /PlatformCard|routes\.platforms/);
  assert.equal(existsSync(join(root, 'src/pages/[locale]/platforms')), false);
  assert.equal(existsSync(join(root, 'src/pages/[locale]/tutorials/index.astro')), false);
  assert.equal(
    existsSync(join(root, 'src/pages/[locale]/tutorials/[tutorial]/index.astro')),
    false,
  );
});

test('canonical URLs have solution names and English-only segments', () => {
  const routes = get('src/lib/routes.ts');
  assert.match(routes, /encodeURIComponent\(solutionSlug\)/);
  assert.doesNotMatch(routes, /\/platforms\//);
  assert.match(
    get('src/pages/[locale]/[solution]/tutorials/[tutorial]/index.astro'),
    /TutorialOverview/,
  );
  assert.match(
    get('src/pages/[locale]/[solution]/tutorials/[tutorial]/[lesson].astro'),
    /LessonView/,
  );
  assert.match(get('src/pages/sitemap.xml.ts'), /routes\.lesson/);
});

test('the clock illustration belongs only to its tutorial', () => {
  assert.match(
    source('tutorials').find((s) => field(s, 'key') === 'time-tracking'),
    /visual: clock/,
  );
  assert.match(
    source('tutorials').find((s) => field(s, 'key') === 'bienvenida-gestor-tareas'),
    /visual: welcome/,
  );
  assert.doesNotMatch(get('src/components/home/HomeHero.astro'), /guide-clock|10:00|13:00/);
  assert.match(
    get('src/components/tutorial/TutorialOverview.astro'),
    /tutorial\.data\.visual === 'clock'/,
  );
});

test('English paths are scoped by solution without an intermediate catalog', () => {
  const routes = get('src/lib/routes.ts');
  assert.match(routes, /encodeURIComponent\(solutionSlug\)/);
  assert.match(routes, /\/tutorials\/\$\{encodeURIComponent\(tutorialSlug\)\}/);
  assert.doesNotMatch(routes, /\/platforms\//);
  const redirects = get('public/_redirects');
  assert.match(redirects, /welcome-task-manager/);
});

test('English paths are scoped by solution without an intermediate catalog', () => {
  const routes = get('src/lib/routes.ts');
  assert.match(routes, /encodeURIComponent\(solutionSlug\)/);
  assert.match(routes, /\/tutorials\/\$\{encodeURIComponent\(tutorialSlug\)\}/);
  assert.doesNotMatch(routes, /\/platforms\//);
  const redirects = get('public/_redirects');
  assert.match(redirects, /welcome-task-manager/);
});

test('English paths are scoped by solution without an intermediate catalog', () => {
  const routes = get('src/lib/routes.ts');
  assert.match(routes, /encodeURIComponent\(solutionSlug\)/);
  assert.match(routes, /\/tutorials\/\$\{encodeURIComponent\(tutorialSlug\)\}/);
  assert.doesNotMatch(routes, /\/platforms\//);
  const redirects = get('public/_redirects');
  assert.match(redirects, /welcome-task-manager/);
});
