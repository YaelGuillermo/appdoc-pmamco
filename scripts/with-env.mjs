import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function loadEnv(mode, inherited = process.env, projectRoot = root) {
  if (!/^(development|production|test)$/.test(mode)) {
    throw new Error(`Invalid environment mode: ${mode}`);
  }
  const names = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
  const values = {};
  for (const name of names) {
    const path = resolve(projectRoot, 'envs', name);
    if (existsSync(path)) Object.assign(values, parseEnv(readFileSync(path, 'utf8')));
  }
  return { ...values, ...inherited };
}

const isEntrypoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  const [, , mode, ...command] = process.argv;
  if (!command.length) {
    console.error(
      'Usage: node scripts/with-env.mjs <development|production|test> <program> [args...]',
    );
    process.exit(2);
  }
  try {
    const runner = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const result = spawnSync(runner, ['exec', ...command], {
      cwd: root,
      env: loadEnv(mode),
      stdio: 'inherit',
    });
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  } catch (error) {
    console.error(`[env] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
