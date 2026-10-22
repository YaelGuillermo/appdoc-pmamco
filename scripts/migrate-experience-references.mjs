/**
 * Migración idempotente: cambia únicamente los escalares YAML de referencias.
 * No reescribe cuerpos, capturas ni contenido editorial existente.
 *
 * platform: pm-amco-editorial  -> platform: es/pm-amco-editorial
 * tutorial: time-tracking     -> tutorial: es/registrar-tiempo
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = join(root, 'src/content');
const locales = ['es', 'en'];

function files(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? files(path)
      : entry.isFile() && entry.name.endsWith('.md')
        ? [path]
        : [];
  });
}

function yamlScalar(source, name) {
  const match = new RegExp(`^${name}:\\s*['"]?([^'"\\r\\n]+?)['"]?\\s*$`, 'm').exec(source);
  return match?.[1]?.trim();
}

function frontmatter(source, filename) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/.exec(source);
  if (!match) throw new Error(`Frontmatter YAML ausente: ${filename}`);
  return match;
}

function registry(collection) {
  const byLocaleAndKey = new Map();
  for (const locale of locales) {
    const directory = join(contentRoot, collection, locale);
    for (const file of files(directory)) {
      const text = readFileSync(file, 'utf8');
      const header = frontmatter(text, file)[1];
      const key = yamlScalar(header, 'key');
      if (!key) throw new Error(`${file}: falta key`);
      const id = `${locale}/${file
        .slice(directory.length + 1)
        .replace(/\.md$/, '')
        .replaceAll('\\', '/')}`;
      const identity = `${locale}:${key}`;
      if (byLocaleAndKey.has(identity)) throw new Error(`Clave duplicada: ${identity}`);
      byLocaleAndKey.set(identity, id);
    }
  }
  return byLocaleAndKey;
}

function migrate(collection, property, lookup) {
  let updated = 0;
  for (const locale of locales) {
    for (const file of files(join(contentRoot, collection, locale))) {
      const original = readFileSync(file, 'utf8');
      const header = frontmatter(original, file);
      const existing = yamlScalar(header[1], property);
      if (!existing) throw new Error(`${file}: falta ${property}`);
      let id = existing;
      if (!existing.includes('/')) {
        id = lookup.get(`${locale}:${existing}`);
        if (!id) throw new Error(`${file}: ${property} no existe (${existing})`);
      }
      if (!id.startsWith(`${locale}/`) || ![...lookup.values()].includes(id)) {
        throw new Error(`${file}: referencia ${property} inválida (${id})`);
      }
      const updatedHeader = header[1].replace(
        new RegExp(`^${property}:\\s*[^\\r\\n]*`, 'm'),
        `${property}: ${id}`,
      );
      const next =
        original.slice(0, header.index) +
        header[0].replace(header[1], updatedHeader) +
        original.slice(header.index + header[0].length);
      if (next !== original) {
        writeFileSync(file, next);
        updated++;
      }
    }
  }
  return updated;
}

const platforms = registry('platforms');
const tutorials = registry('tutorials');
const changedTutorials = migrate('tutorials', 'platform', platforms);
const changedSteps = migrate('lessons', 'tutorial', tutorials);
console.log(
  `[migration] PASS ${changedTutorials} tutorial(es), ${changedSteps} paso(s) actualizados; operación idempotente.`,
);
