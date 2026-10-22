import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const base = 'src/content/lessons/es/bienvenida-gestor-tareas';
const lessons = readdirSync(join(root, base))
  .filter((name) => name.endsWith('.md'))
  .sort();
const tutorial = read('src/content/tutorials/es/bienvenida-gestor-tareas.md');

function field(source, name) {
  const value = new RegExp(`^\\s*${name}:\\s*(.*?)\\s*$`, 'm').exec(source)?.[1];
  return value?.replace(/^['"]|['"]$/g, '');
}

test('welcome tutorial belongs to PM Amco and contains nine ordered, published lessons', () => {
  assert.equal(field(tutorial, 'platform'), 'es/pm-amco-editorial');
  assert.equal(field(tutorial, 'visual'), 'welcome');
  assert.equal(field(tutorial, 'published'), 'true');
  assert.equal(lessons.length, 9);
  lessons.forEach((name, index) => {
    const lesson = read(`${base}/${name}`);
    assert.match(name, new RegExp(`^${String(index + 1).padStart(2, '0')}-`));
    assert.equal(Number(field(lesson, 'order')), index + 1);
    assert.equal(field(lesson, 'tutorial'), 'es/bienvenida-gestor-tareas');
    assert.equal(field(lesson, 'published'), 'true');
    assert.match(lesson, /^assessment:\s*$/m);
  });
});

test('every embedded screenshot is a real, locally bundled asset', () => {
  let placements = 0;
  const assets = new Set();
  for (const lesson of lessons) {
    for (const match of read(`${base}/${lesson}`).matchAll(
      /!\[[^\]]*\]\((\/assets\/tutorials\/bienvenida-gestor\/es\/[^)]+)\)/g,
    )) {
      placements++;
      const path = match[1];
      assets.add(path);
      assert.ok(existsSync(join(root, 'public', path.slice(1))), `${lesson}: ${path}`);
    }
  }
  assert.equal(placements, 75, '65 Drive links and 10 DOCX inline image placements');
  assert.equal(assets.size, 74, '65 original Drive files and 9 unique embedded DOCX images');
});

test('one welcome question per lesson, including all three question formats', () => {
  const types = lessons.map((file) => field(read(`${base}/${file}`), 'type'));
  assert.deepEqual(new Set(types), new Set(['true_false', 'single_choice', 'matching']));
  for (const file of lessons) {
    const src = read(`${base}/${file}`);
    assert.match(src, /^\s*question:\s*.+/m);
    assert.match(src, /^\s*explanation:\s*.+/m);
  }
});

test('generic assessment engine grades true/false, four choices and relationships', async () => {
  const source = read('src/lib/assessment-engine.ts');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const { gradeAssessment, assessmentStorageKey } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
  );
  const tf = { type: 'true_false', question: 'Test', correct: true, explanation: 'Test' };
  const choice = {
    type: 'single_choice',
    question: 'Test',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 2,
    explanation: 'Test',
  };
  const matching = {
    type: 'matching',
    question: 'Test',
    pairs: [
      { left: 'A', right: 'B' },
      { left: 'C', right: 'D' },
    ],
    explanation: 'Test',
  };
  assert.equal(gradeAssessment(tf, true), true);
  assert.equal(gradeAssessment(tf, false), false);
  assert.equal(gradeAssessment(choice, 2), true);
  assert.equal(gradeAssessment(choice, 4), false);
  assert.equal(gradeAssessment(matching, [0, 1]), true);
  assert.equal(gradeAssessment(matching, [1, 0]), false);
  assert.equal(gradeAssessment(matching, [0]), false);
  assert.notEqual(
    assessmentStorageKey('es', 'es/pm-amco-editorial/bienvenida-gestor-tareas', 'paso-01'),
    assessmentStorageKey('es', 'es/pm-amco-editorial/time-tracking', 'paso-01'),
  );
});

test('welcome assessments are opt-in and original clock tutorial remains unchanged', () => {
  const engine = read('src/components/tutorial/LessonView.astro');
  assert.match(engine, /lesson\.data\.assessment/);
  const overview = read('src/components/tutorial/TutorialOverview.astro');
  assert.match(overview, /tutorial\.data\.visual === 'clock'/);
  assert.match(overview, /tutorial\.data\.visual === 'welcome'/);
  const original = read('src/content/tutorials/es/registrar-tiempo.md');
  assert.equal(field(original, 'visual'), 'clock');
  assert.ok(!original.includes('assessment:'));
});
