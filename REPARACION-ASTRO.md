# Reparacion de Astro: contenido, runtime y formato

Este ZIP es una **correccion incremental** para el paquete `pmamco_astro_quality_es.zip`. No contiene ni elimina tus lecciones, imagenes, variables de entorno, dependencias o lockfile.

## Cambios

- Los IDs de las colecciones se generan a partir de la **ruta relativa del archivo** (`es/registrar-tiempo/...`), no desde `slug`. Evita colisiones de IDs internos entre idiomas y conserva las URL publicas existentes.
- `scripts/check-astro-runtime.mjs` comprueba que la instalacion actual exporte `astro/compiler-runtime`.
- `scripts/repair-astro-quality.mjs` limpia las caches generadas `.astro` y `node_modules/.vite`, ejecuta Prettier, regenera la cache de contenido y ejecuta el gate completo `pnpm check`.
- `scripts/check.mjs` ahora valida la resolucion del runtime antes de correr el resto del pipeline.
- `tests/content-entry-ids.test.mjs` cubre que ambas colecciones utilicen identificadores independientes de los slugs y que las rutas sean unicas.

## Instalacion

**1. Deten el servidor `pnpm dev` con Ctrl+C antes de reemplazar archivos.**

**2. En la raiz de appdoc-pmamco:**

```sh
unzip -o "$HOME/Downloads/pmamco_astro_fix.zip" -d .
pnpm install
node scripts/repair-astro-quality.mjs
```

**3. Cuando el script indique PASS:**

```sh
pnpm dev
git status --short
git diff --check
```

El script usa el Prettier instalado en tu proyecto para aplicar exactamente el formato definido en `.prettierrc.json`, sin reconstruir manualmente los componentes Astro.

## Si astro/compiler-runtime no se resuelve

No edites `src/pages/index.astro` ni los imports autogenerados. Deten dev y repara la instalacion preservando pnpm-lock.yaml:

```sh
pnpm install --force
node scripts/check-astro-runtime.mjs
node scripts/repair-astro-quality.mjs
```

Si `pnpm install --force` tampoco recupera el paquete, revisa `pnpm why astro` y los errores de instalacion antes de modificar versiones al azar.

## Alcance de las pruebas

La correccion de IDs y los scripts se pueden validar de forma estatica. La compilacion y el formato reales dependen de la instalacion que tienes en tu Mac. El resultado de `pnpm check` local determina si el repositorio esta listo para commit.
