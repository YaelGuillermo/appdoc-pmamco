import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('Amco Experience CSS is loaded after the preserved global theme', () => {
  const layout = read('src/components/layout/BaseLayout.astro');
  const original = layout.indexOf("import '../../styles/global.css'");
  const extension = layout.indexOf("import '../../styles/experience.css'");
  assert.ok(original >= 0);
  assert.ok(extension > original, 'Experience CSS must be loaded after the original theme');
  assert.match(read('src/styles/experience.css'), /\.experience-app-heading\s*\{/);
});

test('content relations use typed Astro references', () => {
  const schema = read('src/content.config.ts');
  assert.match(schema, /platform:\s*reference\('platforms'\)/);
  assert.match(schema, /tutorial:\s*reference\('tutorials'\)/);
  const catalog = read('src/lib/catalog.ts');
  assert.match(catalog, /interface PlatformGroup/);
  assert.match(catalog, /interface TutorialGroup/);
  assert.match(catalog, /lesson\.data\.tutorial\.id/);
  assert.match(catalog, /tutorial\.data\.platform\.id/);
});

test('reference migration keeps the Markdown body and is idempotent', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'amco-experience-migration-'));
  try {
    const platform = join(fixture, 'src/content/platforms/es');
    const tutorial = join(fixture, 'src/content/tutorials/es');
    const steps = join(fixture, 'src/content/lessons/es/example');
    for (const folder of [platform, tutorial, steps]) mkdirSync(folder, { recursive: true });
    writeFileSync(join(platform, 'pm-amco-editorial.md'), '---\nkey: pm-amco-editorial\n---\n');
    const tutorialFile = join(tutorial, 'registrar-tiempo.md');
    const lessonFile = join(steps, '01-primer-paso.md');
    writeFileSync(
      tutorialFile,
      '---\nkey: time-tracking\nplatform: pm-amco-editorial\n---\n\nNo tocar el cuerpo.\n',
    );
    writeFileSync(lessonFile, '---\ntutorial: time-tracking\n---\n\nEl paso sigue intacto.\n');
    const migration = join(root, 'scripts/migrate-experience-references.mjs');
    execFileSync(process.execPath, [migration, fixture], { encoding: 'utf8' });
    const after = [readFileSync(tutorialFile, 'utf8'), readFileSync(lessonFile, 'utf8')];
    assert.match(after[0], /^platform: es\/pm-amco-editorial$/m);
    assert.match(after[1], /^tutorial: es\/registrar-tiempo$/m);
    assert.match(after[0], /No tocar el cuerpo\./);
    assert.match(after[1], /El paso sigue intacto\./);
    execFileSync(process.execPath, [migration, fixture], { encoding: 'utf8' });
    assert.deepEqual(after, [readFileSync(tutorialFile, 'utf8'), readFileSync(lessonFile, 'utf8')]);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
