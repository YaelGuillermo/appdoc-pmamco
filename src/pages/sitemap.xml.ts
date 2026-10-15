import type { APIRoute } from 'astro';
import { PUBLISHED_LOCALES } from '../config/locales';
import { routes } from '../lib/routes';
import { listLessons, listTutorials } from '../lib/tutorials';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
  const host = site ?? new URL('https://amco.me/');
  const paths: string[] = [];
  for (const locale of PUBLISHED_LOCALES) {
    paths.push(routes.home(locale), routes.tutorials(locale));
    const tutorials = await listTutorials(locale);
    for (const tutorial of tutorials) {
      paths.push(routes.tutorial(locale, tutorial.data.slug));
      const lessons = await listLessons(tutorial.data.key, locale);
      for (const lesson of lessons)
        paths.push(routes.lesson(locale, tutorial.data.slug, lesson.data.slug));
    }
  }
  const escapeXml = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeXml(absoluteUrl(path, host))}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
