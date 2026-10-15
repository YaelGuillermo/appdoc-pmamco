import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const target = (path) => join(dist, ...path.split('/'));

check(existsSync(target('index.html')), 'Missing root redirect');
check(existsSync(target('es/index.html')), 'Missing Spanish home page');
check(existsSync(target('es/tutorials/index.html')), 'Missing Spanish tutorial catalogue');
check(!existsSync(target('en')), 'English public routes must not be built');
check(existsSync(target('sitemap.xml')), 'Missing sitemap');
if (existsSync(target('index.html'))) {
  check(
    readFileSync(target('index.html'), 'utf8').includes('/es/'),
    'Root must redirect to Spanish',
  );
}

const contents = join(root, 'src', 'content', 'lessons', 'es');
let expected = 0;
if (existsSync(contents)) {
  for (const topic of readdirSync(contents, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  )) {
    const files = readdirSync(join(contents, topic.name)).filter((name) => name.endsWith('.md'));
    for (const name of files) {
      const content = readFileSync(join(contents, topic.name, name), 'utf8');
      const slug = /^slug:\s*['"]?([a-z0-9-]+)/m.exec(content)?.[1];
      const tutorial = join(root, 'src', 'content', 'tutorials', 'es', `${topic.name}.md`);
      // Folder names are editorial names, but route slugs come from tutorial frontmatter.
      let tutorialSlug = topic.name;
      if (existsSync(tutorial)) {
        tutorialSlug =
          /^slug:\s*['"]?([a-z0-9-]+)/m.exec(readFileSync(tutorial, 'utf8'))?.[1] ?? tutorialSlug;
      }
      if (slug) {
        expected++;
        const page = target(`es/tutorials/${tutorialSlug}/${slug}/index.html`);
        check(existsSync(page), `Missing Spanish generated lesson: ${page}`);
      }
    }
  }
}
if (existsSync(target('sitemap.xml'))) {
  const sitemap = readFileSync(target('sitemap.xml'), 'utf8');
  check(!/<loc>[^<]*\/en(?:\/|<)/.test(sitemap), 'English routes found in sitemap');
  check(sitemap.includes('/es/'), 'Sitemap lacks Spanish routes');
}
if (errors.length) {
  errors.forEach((message) => console.error(`[built-site] FAIL ${message}`));
  process.exitCode = 1;
} else {
  console.log(`[built-site] PASS root + Spanish pages + ${expected} lessons, no English routes`);
}
