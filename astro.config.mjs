// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://amco.me',
	integrations: [
		starlight({
			title: {
				es: 'Gestor de Proyectos Amco Editorial',
				en: 'Project Management Amco Editorial',
			},
			description: "System for managing programs for Amco Editorial",
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
					label: 'Cuentas',
					translations: {
						'en': 'Accounts',
					},
					items: [
						{ 
							label: 'Usuario',
							translations: {
								'en': 'User',
							},					 
							slug: 'accounts/user', 
						},
						{
							label: 'Perfil',
							translations: {
								'en': 'Profile',
							},					 
							slug: 'accounts/profile',
						}
					],
				},
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
							label: 'Miembro',
							translations: {
								'en': 'Member',
							},					 
							slug: 'projects/member', 
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
							label: 'Documento General',
							translations: {
								'en': 'General Document',
							},					 
							slug: 'projects/generaldocument' 
						},
						{ 
							label: 'Periférico',
							translations: {
								'en': 'Peripheral',
							},					 
							slug: 'projects/peripheral' 
						},
						{ 
							label: 'Actividad',
							translations: {
								'en': 'Activity',
							},					 
							slug: 'projects/activity' 
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
							label: 'Tarjeta',
							translations: {
								'en': 'Card',
							},					 
							slug: 'projects/card' 
						},
						{ 
							label: 'Checklist',
							translations: {
								'en': 'Checklist',
							},					 
							slug: 'projects/checklist' 
						},
						{ 
							label: 'Ítem',
							translations: {
								'en': 'Item',
							},					 
							slug: 'projects/item', 
						},
						{ 
							label: 'Historial',
							translations: {
								'en': 'History',
							},					 
							slug: 'projects/history',
						},
						{ 
							label: 'Comentario',
							translations: {
								'en': 'Comment',
							},					 
							slug: 'projects/comment',
						},
						{ 
							label: 'Columna',
							translations: {
								'en': 'Column',
							},					 
							slug: 'projects/column',
						},
						{ 
							label: 'Nota',
							translations: {
								'en': 'Note',
							},					 
							slug: 'projects/note',
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
