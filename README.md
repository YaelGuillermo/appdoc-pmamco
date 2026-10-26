# Amco Experience

Amco Experience is the learning hub for the tools and platforms within the Amco ecosystem.

**Hierarchy:** platform → tutorial → lesson. Each platform has its own independent catalog while sharing the same visual system, navigation, and learning components.

Content is currently published in Spanish. The architecture preserves support for English without displaying empty pages.

## Platforms

- **PM Amco Editorial:** Contains the existing time registration tutorial (9 lessons).

## Development

Requirements: Node.js 22 and pnpm.

sh

```
pnpm install
pnpm dev
```

## Quality Assurance

sh

```
pnpm check
```

Verifies content, formatting, linting, Astro, tests, build output, and published routes.

## Project Structure

- `src/content/platforms/es/`: Platform configuration and presentation.
- `src/content/tutorials/es/`: Tutorials with the `platform` field.
- `src/content/lessons/es/`: Lessons linked through typed references to `tutorials`.
- `src/lib/catalog.ts`: Typed platform → tutorial → lesson tree with validated relationships.
- `src/lib/platforms.ts`: Retrieves published platforms.
- `src/lib/tutorials.ts`: Retrieves tutorials and their lessons for a given platform.
- `src/lib/routes.ts`: Canonical routes and backward compatibility with previous links.
- `src/styles/global.css`: Original visual system, **unchanged**.
- `src/styles/experience.css`: Additional styles for the platform catalog.
- `public/assets/`: Existing screenshots and images, unchanged.
- `envs/`: Environment examples.

Tutorials use `platform: es/platform-id`, and lessons use `tutorial: es/tutorial-id`, through Astro's `reference()` function.

Legacy routes remain available as HTML redirects to `/es/platforms/`. Reference updates are applied once using `node scripts/migrate-experience-references.mjs`, without modifying Markdown content.

The design extends the original theme by loading **both** CSS files (`global.css` and `experience.css`) from `BaseLayout.astro`.

To add new platforms or tutorials, see Amco Experience Architecture.

## Deployment

Netlify deploys the `main` branch after a Pull Request is merged.

- Site: [https://amco-debut.netlify.app/](<https://amco-debut.netlify.app/>)
- Build command: `pnpm check`
- Publish directory: `dist`
- Production branch: `main`

When the domain changes, update `PUBLIC_SITE_URL` and `public/robots.txt`.