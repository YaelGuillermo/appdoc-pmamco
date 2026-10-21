// @ts-check
import { defineConfig } from 'astro/config';

// Astro estático; PUBLIC_SITE_URL puede sobrescribir el dominio canónico.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://amco-debut.netlify.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
