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
				label: 'Español',
				lang: 'es',
			},
			  en: {
				label: 'English',
			  },
			},
			sidebar: [
				{
					label: 'Proyectos',
					translations: {
						'en': 'Projects',
					},				
					items: [
						{ 
							label: 'Programa',
							translations: {
								'en': 'Program',
							},					 
							slug: 'projects/program' 
						},
						{ 
							label: 'Recurso',
							translations: {
								'en': 'Resource',
							},					 
							slug: 'projects/resource' 
						},
						{ 
							label: 'Proceso',
							translations: {
								'en': 'Process',
							},					 
							slug: 'projects/process' 
						},
						{ 
							label: 'Libro',
							translations: {
								'en': 'Book',
							},					 
							slug: 'projects/book' 
						},
						{ 
							label: 'Grado',
							translations: {
								'en': 'Grade',
							},					 
							slug: 'projects/grade' 
						},
						{ 
							label: 'Sesión',
							translations: {
								'en': 'Session',
							},					 
							slug: 'projects/session' 
						},
						{ 
							label: 'Documento General',
							translations: {
								'en': 'General Document',
							},					 
							slug: 'projects/generaldocument' 
						},
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
