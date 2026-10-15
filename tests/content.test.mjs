import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const lessonRoot = join(root, 'src/content/lessons/es/registrar-tiempo');
const files = readdirSync(lessonRoot)
  .filter((name) => name.endsWith('.md'))
  .sort();
const contents = files.map((file) => readFileSync(join(lessonRoot, file), 'utf8'));

test('tutorial has exactly nine ordered lessons', () => {
  assert.equal(files.length, 9);
  files.forEach((file, index) => {
    assert.ok(file.startsWith(`${String(index + 1).padStart(2, '0')}-`));
    assert.match(contents[index], new RegExp(`^order: ${index + 1}$`, 'm'));
  });
});
test('asset slots use organized public paths', async () => {
  const assert = (await import('node:assert/strict')).default;
  const { readdirSync, readFileSync, existsSync } = await import('node:fs');

  const lessonsDir = new URL('../src/content/lessons/es/registrar-tiempo/', import.meta.url);

  let screenshotCount = 0;

  for (const filename of readdirSync(lessonsDir).filter((f) => f.endsWith('.md'))) {
    const markdown = readFileSync(new URL(filename, lessonsDir), 'utf8');

    for (const match of markdown.matchAll(/^\s*-\s*file:\s*(\S+)\s*$/gm)) {
      const asset = match[1];
      screenshotCount++;

      assert.match(
        asset,
        /^\/assets\/tutorials\/time-tracking\/es\/[a-z0-9_-]+\.(png|webp|jpg|jpeg)$/,
        `${filename}: invalid asset path ${asset}`,
      );

      assert.ok(
        existsSync(new URL('../public' + asset, import.meta.url)),
        `${filename}: missing asset ${asset}`,
      );
    }
  }

  assert.ok(screenshotCount > 0, 'Expected at least one screenshot');
});

test('lesson content does not treat pausing as completing', () => {
  assert.match(contents[2], /La tarea \*\*sigue pendiente\*\*/);
  assert.match(contents[7], /varios relojes de la lista a la vez/);
});
test('English routes cannot publish empty content', async () => {
  const assert = (await import('node:assert/strict')).default;
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');

  const config = readFileSync(new URL('../src/config/locales.ts', import.meta.url), 'utf8');

  assert.match(config, /DEFAULT_LOCALE:\s*Locale\s*=\s*['"]es['"]/);
  assert.match(config, /PUBLISHED_LOCALES:\s*readonly Locale\[\]\s*=\s*\[['"]es['"]\]/);

  for (const folder of ['lessons', 'tutorials']) {
    const enDir = new URL(`../src/content/${folder}/en/`, import.meta.url);

    if (!existsSync(enDir)) continue;

    const files = readdirSync(enDir, { recursive: true }).filter((file) => /\.mdx?$/.test(file));

    assert.deepEqual(files, [], `English ${folder} must remain empty`);
  }
});
