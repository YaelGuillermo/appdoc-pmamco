import type { APIRoute } from 'astro';
import { PUBLISHED_LOCALES } from '../config/locales';
import { routes } from '../lib/routes';
import { getCatalog } from '../lib/catalog';
import { absoluteUrl } from '../lib/seo';

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const host = site ?? new URL('https://amco-debut.netlify.app/');
  const paths: string[] = [];

  for (const locale of PUBLISHED_LOCALES) {
    paths.push(routes.home(locale));
    for (const { platform, tutorials } of await getCatalog(locale)) {
      for (const { tutorial, lessons } of tutorials) {
        paths.push(routes.tutorial(locale, platform.data.slug, tutorial.data.slug));
        for (const lesson of lessons) {
          paths.push(
            routes.lesson(locale, platform.data.slug, tutorial.data.slug, lesson.data.slug),
          );
        }
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${escapeXml(absoluteUrl(path, host))}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
