import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CLOCK_ASSESSMENTS } from '../scripts/clock-assessment-bank.mjs';
import ts from 'typescript';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const folder = 'src/content/lessons/es/registrar-tiempo';
const filenames = readdirSync(join(root, folder))
  .filter((name) => /^\d\d-.*\.md$/.test(name))
  .sort();

test('nine time lessons, one assessment each, retaining original content', () => {
  assert.equal(filenames.length, 9);
  assert.equal(CLOCK_ASSESSMENTS.length, 9);
  assert.deepEqual(
    CLOCK_ASSESSMENTS.map((item) => item.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  for (const [index, filename] of filenames.entries()) {
    const content = read(`${folder}/${filename}`);
    const question = CLOCK_ASSESSMENTS[index];
    assert.ok(question);
    assert.match(content, new RegExp(`^order: ${index + 1}$`, 'm'));
    assert.match(content, /^# amco-clock-assessment-v1$/m);
    assert.match(content, /^assessment:$/m);
    assert.match(content, new RegExp(`^  type: ${question.type}$`, 'm'));
    assert.match(content, /^  question:/m, `Missing question ${index + 1}`);
    assert.match(content, /^  explanation:/m, `Missing explanation ${index + 1}`);
    assert.match(
      content,
      /\n---\n[\s\S]*?\n## /,
      `Original Markdown body missing from ${filename}`,
    );
  }
});

test('true/false, four alternatives and matching are represented with sound question data', () => {
  assert.deepEqual(
    new Set(CLOCK_ASSESSMENTS.map((item) => item.type)),
    new Set(['true_false', 'single_choice', 'matching']),
  );
  for (const question of CLOCK_ASSESSMENTS) {
    assert.ok(question.question.length > 12);
    assert.ok(question.explanation.length > 15);
    if (question.type === 'true_false') assert.equal(typeof question.correct, 'boolean');
    if (question.type === 'single_choice') {
      assert.equal(question.options.length, 4);
      assert.ok(
        Number.isInteger(question.correctIndex) &&
          question.correctIndex >= 0 &&
          question.correctIndex < 4,
      );
    }
    if (question.type === 'matching') {
      assert.ok(question.pairs.length >= 2 && question.pairs.length <= 5);
      assert.equal(new Set(question.pairs.map((pair) => pair.left)).size, question.pairs.length);
      assert.equal(new Set(question.pairs.map((pair) => pair.right)).size, question.pairs.length);
    }
  }
});

test('the question UI contains no native select and offers accessible button controls', () => {
  const component = read('src/components/tutorial/LessonAssessment.astro');
  const client = read('src/scripts/assessment.ts');
  const css = read('src/styles/assessment-choices.css');
  assert.doesNotMatch(component, /<select\b/i);
  assert.match(component, /data-assessment-match-pair/);
  assert.match(component, /data-assessment-match-option/);
  assert.match(component, /aria-pressed="false"/);
  assert.match(component, /role="group"/);
  assert.match(client, /button\.setAttribute\('aria-pressed'/);
  assert.match(client, /assessmentStorageKey\(/);
  assert.match(client, /markStepAsLearned\(/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.ok(existsSync(join(root, 'src/lib/assessment-engine.ts')));
});

test('the last clock lesson has one gated assessment and keeps the tutorial simulation', () => {
  const view = read('src/components/tutorial/LessonView.astro');
  assert.match(view, /<LessonAssessment locale=\{locale\}/);
  assert.match(view, /!lesson\.data\.assessment\s*&&\s*tutorial\.data\.visual\s*===\s*'clock'/);
  const overview = read('src/components/tutorial/TutorialOverview.astro');
  assert.match(overview, /tutorial\.data\.visual === 'clock'/);
  const original = read('src/content/tutorials/es/registrar-tiempo.md');
  assert.match(original, /^visual: clock$/m);
});

test('assessment engine grades the new answers without confusing tutorials', async () => {
  const source = read('src/lib/assessment-engine.ts');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const { gradeAssessment, assessmentStorageKey } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
  );
  for (const question of CLOCK_ASSESSMENTS) {
    const correct =
      question.type === 'true_false'
        ? question.correct
        : question.type === 'single_choice'
          ? question.correctIndex
          : question.pairs.map((_, i) => i);
    assert.equal(gradeAssessment(question, correct), true, `Question ${question.order}`);
    const wrong =
      question.type === 'true_false'
        ? !question.correct
        : question.type === 'single_choice'
          ? (question.correctIndex + 1) % 4
          : [...correct].reverse();
    assert.equal(
      gradeAssessment(question, wrong),
      false,
      `Wrong answer accepted at ${question.order}`,
    );
  }
  assert.notEqual(
    assessmentStorageKey('es', 'es/pm-amco-editorial/time-tracking', 'first-step'),
    assessmentStorageKey('es', 'es/pm-amco-editorial/welcome-task-manager', 'first-step'),
  );
});
