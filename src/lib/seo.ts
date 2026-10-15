import type { Locale } from '../config/locales';

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path.replace(/^\/+/, ''), site).toString();
}

export function howToStructuredData(options: {
  title: string;
  description: string;
  locale: Locale;
  url: string;
  steps: readonly { title: string; url: string }[];
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.title,
    description: options.description,
    inLanguage: options.locale,
    url: options.url,
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      url: step.url,
    })),
  });
}
