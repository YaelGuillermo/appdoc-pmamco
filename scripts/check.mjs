import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const tests = readdirSync(join(root, 'tests'))
  .filter((name) => name.endsWith('.test.mjs'))
  .sort()
  .map((name) => `tests/${name}`);

const steps = [
  ['Astro runtime resolution', 'node', ['scripts/check-astro-runtime.mjs']],
  ['Content + repository invariants', 'node', ['scripts/check-content.mjs']],
  ['Prettier format', pnpm, ['exec', 'prettier', '--check', '.']],
  ['ESLint', pnpm, ['exec', 'eslint', '.', '--max-warnings=0']],
  ['Astro typecheck', pnpm, ['exec', 'astro', 'check']],
  ['Unit tests', 'node', ['--test', ...tests]],
  ['Production build', 'node', ['scripts/with-env.mjs', 'production', 'astro', 'build']],
  ['Generated website', 'node', ['scripts/check-built-site.mjs']],
];

for (const [label, command, args] of steps) {
  console.log(`\n[quality] ${label}`);
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) {
    console.error(`[quality] FAIL ${label}: ${result.error?.message ?? result.status}`);
    process.exit(1);
  }
}
console.log('\n[quality] PASS every gate');
