import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

test('sitemap XML template is valid TypeScript, with an escaped newline join', () => {
  const file = 'src/pages/sitemap.xml.ts';
  const source = read(file);
  const document = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  assert.equal(
    document.parseDiagnostics.length,
    0,
    'El sitemap debe compilar sin errores de sintaxis',
  );
  assert.match(
    source,
    /\.join\(['"]\\n['"]\)/,
    'La lista XML debe usar un salto de linea escapado',
  );
});

test('successful assessments update persisted step progress', () => {
  const progress = read('src/scripts/progress.ts');
  const assessment = read('src/scripts/assessment.ts');
  assert.match(progress, /document\.addEventListener\(\s*['"]amco:assessment-passed['"]/);
  assert.match(progress, /saveState\(locale, tutorialKey, \[\.\.\.before, step\]\)/);
  assert.match(progress, /renderAll\(\)/);
  assert.match(assessment, /new CustomEvent\(['"]amco:assessment-passed['"]/);
});

test('clock lesson assessments keep the visual answer interface', () => {
  const lesson = read('src/components/tutorial/LessonAssessment.astro');
  assert.doesNotMatch(lesson, /<select\b/i);
  assert.match(lesson, /data-assessment-match-option/);
  assert.match(lesson, /data-assessment-choice/);
});
