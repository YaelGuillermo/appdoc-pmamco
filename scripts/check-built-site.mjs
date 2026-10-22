import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const errors = [];
const check = (valid, message) => {
  if (!valid) errors.push(message);
};
const output = (...paths) => join(dist, ...paths);
const files = (directory) =>
  existsSync(directory) ? readdirSync(directory, { withFileTypes: true }) : [];
const scalar = (source, name) =>
  new RegExp(`^${name}:\\s*['"]?([^'"\\r\\n]+?)['"]?\\s*$`, 'm').exec(source)?.[1]?.trim();
const md = (directory) =>
  files(directory)
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => ({
      id: `es/${entry.name.slice(0, -3)}`,
      raw: readFileSync(join(directory, entry.name), 'utf8'),
    }));

check(existsSync(output('index.html')), 'Falta redirección de raíz');
check(existsSync(output('es/index.html')), 'Falta inicio en español');
check(!existsSync(output('es/platforms')), 'No debe generarse /es/platforms/');
check(!existsSync(output('es/tutorials')), 'No debe generarse /es/tutorials/');
check(
  !existsSync(output('es/tutorials/index.html')),
  'El inicio es el único catálogo, no /es/tutorials/',
);
check(existsSync(output('sitemap.xml')), 'Falta sitemap');
check(!existsSync(output('en')), 'El inglés permanece inédito');
if (existsSync(output('index.html'))) {
  check(
    readFileSync(output('index.html'), 'utf8').includes('/es/'),
    'La raíz debe redirigir a español',
  );
}
const tutorials = new Map(
  md(join(root, 'src/content/tutorials/es')).map((entry) => [
    entry.id,
    {
      slug: scalar(entry.raw, 'slug'),
      published: scalar(entry.raw, 'published'),
    },
  ]),
);
let steps = 0;
for (const [tutorialId, tutorial] of tutorials) {
  if (tutorial.published !== 'true') continue;
  check(
    existsSync(output('es', 'pm-amco-editorial', 'tutorials', tutorial.slug, 'index.html')),
    `Falta tutorial: ${tutorial.slug}`,
  );
  for (const folder of files(join(root, 'src/content/lessons/es')).filter((entry) =>
    entry.isDirectory(),
  )) {
    for (const lesson of md(join(root, 'src/content/lessons/es', folder.name))) {
      if (
        scalar(lesson.raw, 'tutorial') !== tutorialId ||
        scalar(lesson.raw, 'published') === 'false'
      )
        continue;
      steps++;
      const slug = scalar(lesson.raw, 'slug');
      check(
        existsSync(
          output('es', 'pm-amco-editorial', 'tutorials', tutorial.slug, slug, 'index.html'),
        ),
        `Falta lección: ${tutorial.slug}/${slug}`,
      );
    }
  }
}
const assets = files(output('_astro'))
  .filter((file) => file.isFile() && file.name.endsWith('.css'))
  .map((file) => readFileSync(output('_astro', file.name), 'utf8'));
check(
  assets.some((css) => css.includes('experience-app-heading')),
  'Falta diseño de aplicación en CSS',
);
if (existsSync(output('sitemap.xml'))) {
  const sitemap = readFileSync(output('sitemap.xml'), 'utf8');
  check(!/\/en\//.test(sitemap), 'No debe aparecer inglés en sitemap');
  check(!sitemap.includes('/platforms/'), 'El sitemap no debe publicar /platforms/');
  check(
    sitemap.includes('/es/pm-amco-editorial/tutorials/welcome-task-manager/'),
    'Sitemap sin Bienvenida',
  );
  check(
    sitemap.includes('/es/pm-amco-editorial/tutorials/time-tracking/'),
    'Sitemap sin Registrar tiempo',
  );
}
if (errors.length) {
  for (const message of errors) console.error(`[built-site] FAIL ${message}`);
  process.exitCode = 1;
} else
  console.log(
    `[built-site] PASS inicio único, ${tutorials.size} tutoriales, ${steps} pasos, estilos y rutas en español`,
  );
