import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../scripts/with-env.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('only Spanish is published and all Spanish content relationships are valid', () => {
  const output = execFileSync('node', ['scripts/check-content.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.match(output, /\[content\] PASS/);
});

test('branch policy permits conventional feature branches and forbids main', () => {
  const file = join(root, 'scripts/validate-branch-name.sh');
  const valid = spawnSync('sh', [file, 'feat/prepare-astro-ci']);
  const invalid = spawnSync('sh', [file, 'main']);
  const invalidFormat = spawnSync('sh', [file, 'random-work']);
  assert.equal(valid.status, 0);
  assert.notEqual(invalid.status, 0);
  assert.notEqual(invalidFormat.status, 0);
});

test('environment-specific variables override local defaults; process env wins', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'pmamco-env-'));
  try {
    mkdirSync(join(fixture, 'envs'));
    writeFileSync(join(fixture, 'envs/.env'), 'SOURCE=base\nORDER=base\n');
    writeFileSync(join(fixture, 'envs/.env.local'), 'ORDER=local\n');
    writeFileSync(join(fixture, 'envs/.env.development'), 'ORDER=development\n');
    writeFileSync(join(fixture, 'envs/.env.development.local'), 'ORDER=development_local\n');
    const development = loadEnv('development', {}, fixture);
    assert.equal(development.SOURCE, 'base');
    assert.equal(development.ORDER, 'development_local');
    assert.equal(loadEnv('development', { ORDER: 'process' }, fixture).ORDER, 'process');
    assert.equal(loadEnv('production', {}, fixture).ORDER, 'local');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
