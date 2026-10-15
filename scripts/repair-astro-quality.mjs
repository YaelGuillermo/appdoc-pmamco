import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

if (
  !existsSync(join(root, 'astro.config.mjs')) ||
  !existsSync(join(root, 'src/content.config.ts'))
) {
  console.error('[repair] Ejecuta este script dentro de la raiz de appdoc-pmamco.');
  process.exit(1);
}

function run(label, executable, args) {
  console.log(`\n[repair] ${label}`);
  const result = spawnSync(executable, args, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`[repair] FAIL ${label}: ${result.error?.message ?? result.status}`);
    process.exit(1);
  }
}

console.log('[repair] IMPORTANTE: detiene primero el proceso pnpm dev / astro dev.');
run('Comprobar runtime de Astro', process.execPath, ['scripts/check-astro-runtime.mjs']);

// Cache generada: no se modifica el codigo fuente, assets, dependencias ni lockfile.
for (const relativePath of ['.astro', 'node_modules/.vite']) {
  const target = join(root, relativePath);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`[repair] Cache eliminada: ${relativePath}`);
  }
}

run('Formatear todo el repositorio (Prettier)', pnpm, ['exec', 'prettier', '--write', '.']);
run('Regenerar contenido y tipos (Astro sync)', pnpm, ['exec', 'astro', 'sync']);
run('Validar contenido, formato, lint, tipos, pruebas y build', pnpm, ['check']);
console.log(
  '\n[repair] PASS El gate de calidad termino correctamente. Ya puedes iniciar pnpm dev.',
);
