import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const location = (name) => join(root, name);
const manifestPath = location('package.json');
const required = ['astro.config.mjs', 'src/content/tutorials/es', 'src/config/locales.ts'];

if (!existsSync(manifestPath) || required.some((name) => !existsSync(location(name)))) {
  console.error(
    '[setup] This overlay must be extracted at the root of your existing Astro project.',
  );
  console.error('[setup] Required: package.json, astro.config.mjs and src/content/.');
  process.exit(1);
}

// Preflight conflicts before modifying package.json or any environment file.
for (const name of [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
  '.env.development.local',
  '.env.production.local',
  '.env.test.local',
]) {
  if (existsSync(location(name)) && existsSync(location(`envs/${name}`))) {
    console.error(`[setup] Both ${name} and envs/${name} exist. Merge manually first.`);
    process.exit(1);
  }
}

const packageJson = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (!packageJson.scripts || typeof packageJson.scripts !== 'object') packageJson.scripts = {};
if (!packageJson.devDependencies) packageJson.devDependencies = {};

const scripts = {
  dev: 'node scripts/with-env.mjs development astro dev',
  build: 'node scripts/with-env.mjs production astro build',
  preview: 'node scripts/with-env.mjs production astro preview',
  lint: 'eslint . --max-warnings=0',
  typecheck: 'astro check',
  format: 'prettier --write .',
  'format:check': 'prettier --check .',
  test: 'node --test tests/*.test.mjs',
  'content:check': 'node scripts/check-content.mjs',
  'site:check': 'node scripts/check-built-site.mjs',
  check: 'node scripts/check.mjs',
};
for (const [name, command] of Object.entries(packageJson.scripts)) {
  if (typeof command === 'string' && command.includes('scripts/validate-content.mjs')) {
    packageJson.scripts[name] = command.replaceAll(
      'scripts/validate-content.mjs',
      'scripts/check-content.mjs',
    );
  }
}
Object.assign(packageJson.scripts, scripts);
const oldPrepare = packageJson.scripts.prepare;
if (!oldPrepare) packageJson.scripts.prepare = 'husky';
else if (!/\bhusky\b/.test(oldPrepare)) packageJson.scripts.prepare = `${oldPrepare} && husky`;

const tools = {
  '@astrojs/check': '^0.9.4',
  '@commitlint/cli': '^19.8.1',
  '@commitlint/config-conventional': '^19.8.1',
  '@eslint/js': '^9.30.1',
  eslint: '^9.30.1',
  'eslint-plugin-astro': '^1.3.1',
  husky: '^9.1.7',
  'lint-staged': '^15.5.2',
  prettier: '^3.6.2',
  'prettier-plugin-astro': '^0.14.1',
  typescript: '^5.8.3',
  'typescript-eslint': '^8.35.0',
};
for (const [name, version] of Object.entries(tools)) {
  if (!packageJson.dependencies?.[name] && !packageJson.devDependencies[name]) {
    packageJson.devDependencies[name] = version;
  }
}
packageJson.devDependencies = Object.fromEntries(
  Object.entries(packageJson.devDependencies).sort(([a], [b]) => a.localeCompare(b)),
);
if (!packageJson.packageManager) packageJson.packageManager = 'pnpm@10.17.1';
if (!packageJson['lint-staged']) {
  packageJson['lint-staged'] = {
    '*.{astro,js,cjs,mjs,ts,tsx,css,md,json,yml,yaml}': ['prettier --write'],
  };
}
writeFileSync(manifestPath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log('[setup] package.json scripts and development tools integrated');

const envs = location('envs');
mkdirSync(envs, { recursive: true });
const runtimeNames = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
  '.env.development.local',
  '.env.production.local',
  '.env.test.local',
];
for (const name of runtimeNames) {
  const oldPath = location(name);
  const newPath = join(envs, name);
  if (!existsSync(oldPath)) continue;
  if (existsSync(newPath)) {
    console.error(`[setup] Cannot safely move ${name}: envs/${name} already exists.`);
    console.error('[setup] Merge those two files manually, then rerun setup.');
    process.exit(1);
  }
  renameSync(oldPath, newPath);
  console.log(`[setup] Moved ${name} to envs/${name}`);
}
const rootExample = location('.env.example');
if (existsSync(rootExample)) {
  const newExample = join(envs, '.env.example');
  const content = readFileSync(rootExample, 'utf8');
  if (content.trim()) writeFileSync(newExample, content);
  rmSync(rootExample);
  console.log('[setup] Migrated existing root .env.example into envs/.env.example');
}
for (const mode of ['local', 'development', 'production']) {
  const file = join(envs, `.env.${mode}`);
  if (!existsSync(file)) {
    copyFileSync(join(envs, `.env.${mode}.example`), file);
    console.log(`[setup] Created ignored envs/.env.${mode} from its example`);
  }
}

for (const name of ['src/content/lessons/en', 'src/content/tutorials/en']) {
  const folder = location(name);
  mkdirSync(folder, { recursive: true });
  for (const child of readdirSync(folder)) {
    const file = join(folder, child);
    if (child !== '.gitkeep') rmSync(file, { recursive: true, force: true });
  }
  writeFileSync(join(folder, '.gitkeep'), '');
}
for (const name of ['translations/registrar-tiempo/en', 'translations/time-tracking/en']) {
  if (existsSync(location(name))) {
    rmSync(location(name), { recursive: true, force: true });
    console.log(`[setup] Removed redundant English translations: ${name}`);
  }
}
for (const name of [
  'translations/registrar-tiempo',
  'translations/time-tracking',
  'translations',
]) {
  if (
    existsSync(location(name)) &&
    statSync(location(name)).isDirectory() &&
    readdirSync(location(name)).length === 0
  ) {
    rmSync(location(name), { recursive: true });
  }
}
const oldValidator = location('scripts/validate-content.mjs');
if (existsSync(oldValidator)) {
  rmSync(oldValidator);
  console.log('[setup] Removed obsolete scripts/validate-content.mjs');
}

const outdatedReferences = [];
for (const folder of ['tests', 'docs']) {
  const path = location(folder);
  if (!existsSync(path)) continue;
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (
        entry.isFile() &&
        /\.(mjs|js|ts|md)$/.test(file) &&
        readFileSync(file, 'utf8').includes('validate-content.mjs')
      ) {
        outdatedReferences.push(file.slice(root.length + 1));
      }
    }
  };
  visit(path);
}
if (outdatedReferences.length) {
  console.warn(
    `[setup] Review stale references to deleted script: ${outdatedReferences.join(', ')}`,
  );
}
console.log('[setup] Done. Run pnpm install, pnpm format, then pnpm check.');
