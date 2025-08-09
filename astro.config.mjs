// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind'; 

// https://astro.build/config
export default defineConfig({
	site: 'https://amco.me',
	integrations: [
		starlight({
			title: 'Project Management Amco Editorial',
			description: 'Description',
			logo: {
				src: './src/assets/images/logo.png',
				alt: 'Logo',
			},		
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/YaelAmco' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	    tailwind(),
	],
});
