# Amco Guide

Sitio de documentación y tutoriales de PM Amco Editorial.

Construido con Astro, TypeScript y pnpm.

Actualmente, la documentación se publica en español. La arquitectura
está preparada para incorporar inglés posteriormente.

## Requisitos

- Node.js 22
- pnpm

## Desarrollo local

Instalar dependencias:

    pnpm install

Iniciar el servidor:

    pnpm dev

## Calidad y pruebas

Ejecutar todas las validaciones:

    pnpm check

Este comando verifica:

- Integridad del contenido
- Formato con Prettier
- ESLint
- Tipos de Astro
- Pruebas automatizadas
- Compilación de producción
- Rutas del sitio generado

## Organización del contenido

- `src/content/tutorials/es/`: tutoriales en español.
- `src/content/lessons/es/`: lecciones en español.
- `src/content/tutorials/en/`: preparado para futuras traducciones.
- `src/content/lessons/en/`: preparado para futuras traducciones.
- `public/assets/`: imágenes y recursos públicos.
- `envs/`: configuración y ejemplos de entornos.

## Despliegue

El sitio se publica en Netlify desde la rama `main`.

Sitio: https://amco-debut.netlify.app/

Configuración de compilación:

- Production branch: `main`
- Build command: `pnpm check`
- Publish directory: `dist`

## Contribuciones

Los cambios deben desarrollarse en una rama independiente y
enviarse mediante un Pull Request hacia `main`.
