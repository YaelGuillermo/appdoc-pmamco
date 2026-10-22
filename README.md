# Amco Experience

Amco Experience es el espacio de aprendizaje para las herramientas y plataformas del universo Amco.

**Jerarquía:** plataforma → tutorial → lección. Cada plataforma tiene su catálogo independiente, pero comparte el sistema visual, la navegación y los componentes de aprendizaje.

Actualmente se publican contenidos en español; la arquitectura conserva soporte para inglés sin mostrar páginas vacías.

## Plataformas

- **PM Amco Editorial:** contiene el tutorial existente de registro de tiempo (9 lecciones).
- **Raccord:** colección preparada; tutoriales próximamente.
- **Genially:** colección preparada; tutoriales próximamente.

Ninguna guía se inventa para las colecciones vacías: se muestran como próximas.

## Desarrollo

Requisitos: Node.js 22 y pnpm.

```sh
pnpm install
pnpm dev
```

## Calidad

```sh
pnpm check
```

Verifica contenido, formato, lint, Astro, pruebas, build y rutas publicadas.

## Organización

- `src/content/platforms/es/`: configuración y presentación de plataformas.
- `src/content/tutorials/es/`: tutoriales con el campo `platform`.
- `src/content/lessons/es/`: lecciones asociadas a referencias tipadas de `tutorials`.
- `src/lib/catalog.ts`: árbol tipado plataforma → tutorial → paso, con relaciones verificadas.
- `src/lib/platforms.ts`: consulta las plataformas publicadas.
- `src/lib/tutorials.ts`: consulta los tutoriales de una plataforma y sus lecciones.
- `src/lib/routes.ts`: rutas canónicas y compatibilidad con enlaces anteriores.
- `src/styles/global.css`: sistema visual original, **intacto**.
- `src/styles/experience.css`: estilos adicionales para el catálogo de plataformas.
- `public/assets/`: capturas e imágenes existentes, sin cambios.
- `envs/`: ejemplos de entornos.

Los tutoriales usan `platform: es/id-de-plataforma` y los pasos usan `tutorial: es/id-del-tutorial`, mediante `reference()` de Astro. Las rutas antiguas siguen disponibles como redirecciones HTML hacia `/es/platforms/`. Los cambios de referencias se aplican una vez con `node scripts/migrate-experience-references.mjs`, sin tocar los cuerpos de Markdown.

La apariencia extiende el tema original cargando **ambos** CSS (`global.css` y `experience.css`) desde `BaseLayout.astro`.

Para agregar nuevas plataformas o tutoriales, consulta [Arquitectura de Amco Experience](docs/AMCO-EXPERIENCE.md).

## Despliegue

Netlify publica la rama `main` después de integrar un Pull Request.

- Sitio: https://amco-debut.netlify.app/
- Build command: `pnpm check`
- Publish directory: `dist`
- Production branch: `main`

Cuando cambie el dominio, actualiza `PUBLIC_SITE_URL` y `public/robots.txt`.
