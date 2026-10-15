import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectRequire = createRequire(join(root, 'package.json'));

try {
  const manifestPath = projectRequire.resolve('astro/package.json');
  const runtimePath = projectRequire.resolve('astro/compiler-runtime');
  if (!existsSync(runtimePath)) {
    throw new Error(`La ruta exportada por Astro no existe: ${runtimePath}`);
  }
  const { version } = JSON.parse(readFileSync(manifestPath, 'utf8'));
  console.log(`[astro-runtime] PASS Astro ${version}; astro/compiler-runtime disponible.`);
} catch (error) {
  console.error('[astro-runtime] FAIL No se puede resolver el runtime de la instalacion actual.');
  console.error(error instanceof Error ? error.message : String(error));
  console.error(
    '[astro-runtime] Deten el servidor dev, ejecuta pnpm install --force y repite la validacion.',
  );
  console.error('[astro-runtime] Conserva pnpm-lock.yaml: no hace falta borrarlo.');
  process.exitCode = 1;
}
