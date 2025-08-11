// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://amco.me',
	integrations: [
		starlight({
			title: 'Project Management Amco Editorial',
			description: 'Description',
			logo: {
				src: './public/favicon.svg',
				alt: 'Logo',
			},		
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/YaelAmco' }],
			defaultLocale: 'root',
			locales: {
			root: {
				label: 'English',
				lang: 'en',
			},
			  es: {
				label: 'Español',
			  },
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
