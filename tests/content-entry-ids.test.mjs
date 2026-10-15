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

test('glob loaders use the path as the internal ID, not the frontmatter slug', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /function entryIdFromPath\(/);
  assert.match(config, /return entry\.replace\(\/\\\.md\$\/i, ''\);/);
  assert.equal((config.match(/generateId:\s*entryIdFromPath/g) ?? []).length, 2);
});

test('every published Markdown file has a distinct path-scoped ID', () => {
  for (const collection of ['lessons', 'tutorials']) {
    const base = join(root, 'src/content', collection);
    const paths = collectMarkdown(base);
    const ids = paths.map((file) =>
      relative(base, file).replaceAll('\\', '/').replace(/\.md$/i, ''),
    );
    assert.equal(new Set(ids).size, ids.length, `IDs duplicados en ${collection}`);
    assert.ok(
      ids.every((id) => id.startsWith('es/')),
      `Contenido inesperado en ${collection}`,
    );
  }
  assert.notEqual('es/registrar-tiempo', 'en/registrar-tiempo');
});
