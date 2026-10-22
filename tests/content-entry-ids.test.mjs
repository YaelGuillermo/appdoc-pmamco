import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function collectMarkdown(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const child = join(directory, item.name);
    return item.isDirectory()
      ? collectMarkdown(child)
      : item.isFile() && child.endsWith('.md')
        ? [child]
        : [];
  });
}

test('all three glob loaders use file-scoped IDs, never public slugs', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /function entryIdFromPath\(/);
  assert.match(config, /return entry\.replace\(\/\\\.md\$\/i, ''\);/);
  assert.equal((config.match(/generateId:\s*entryIdFromPath/g) ?? []).length, 3);
});

test('platforms, tutorials, and steps have distinct path-scoped IDs', () => {
  for (const collection of ['platforms', 'tutorials', 'lessons']) {
    const base = join(root, 'src/content', collection);
    const paths = collectMarkdown(base);
    const ids = paths.map((file) =>
      relative(base, file).replaceAll('\\', '/').replace(/\.md$/i, ''),
    );
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${collection}`);
    assert.ok(
      ids.every((id) => id.startsWith('es/')),
      `Unexpected locale in ${collection}`,
    );
  }
});
