// @ts-check
import { defineConfig } from 'astro/config';

// Astro estático, sin Starlight: los tutoriales tienen diseño propio.
// Si cambia el dominio, configura PUBLIC_SITE_URL en el entorno de build.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://amco.me',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
