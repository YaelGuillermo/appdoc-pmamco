# Amco Experience — arquitectura por plataformas

El sitio se organiza en **plataformas → tutoriales → pasos**, sin duplicar diseños ni acoplar la página principal al reloj del tutorial original.

```text
Amco Experience
├── PM Amco Editorial
│   └── Registrar tiempo (visual: clock)
│       ├── 01. Encuentra la tarea y su reloj
│       └── ... 09 pasos existentes
├── Raccord
│   └── Tutoriales futuros
└── Genially
    └── Tutoriales futuros
```

## Instalar la corrección V2

Este ZIP es **incremental**: se aplica encima de `amco_experience_abstraccion.zip`, no sobre el proyecto inicial sin la primera capa. Conserva los Markdown originales, sus nueve pasos, capturas, estilos globales y configuración del repositorio.

Si tienes cambios sin confirmar, respáldalos primero. Sobre la rama actual donde instalaste el ZIP de Amco Experience:

```sh
unzip -o "$HOME/Downloads/amco_experience_v2.zip" -d .
node scripts/migrate-experience-references.mjs
pnpm exec prettier --write .
pnpm check
```

La migración **solo cambia dos propiedades del YAML**, cuando sea necesario: `platform` en los tutoriales y `tutorial` en las lecciones. No modifica títulos, cuerpos, enlaces, capturas ni contenido editorial. Es idempotente y comprueba que las entradas referenciadas existen.

## Qué se corrigió

**Apariencia:** `BaseLayout.astro` carga `global.css` seguido de `experience.css`. El ZIP anterior creaba las clases CSS, pero omitía importarlas. Por eso las tarjetas se mostraban como texto sin diseño.

**Tipado fuerte:** Astro Content Collections utiliza referencias mediante `reference('platforms')` y `reference('tutorials')` en vez de cadenas libres. `src/lib/catalog.ts` expone el árbol tipado `PlatformGroup` → `TutorialGroup` → `Lesson` y nunca deja que un tutorial aparezca sin plataforma publicada.

**Calidad:** se actualizó `scripts/check-content.mjs` para validar referencias, unicidad de rutas, idiomas, publicación de padres, orden de pasos, capturas, y conexión de CSS. `scripts/check-built-site.mjs` comprueba las rutas construidas, assets visuales y redirecciones antiguas.

**Progreso:** los nuevos tutoriales almacenan avance por plataforma. El avance anterior del tutorial `time-tracking` se migra de `pmamco:guides:progress:v1` cuando el navegador todavía lo conserva.

**Diseño:** las ilustraciones de reloj y `ClockDemo.astro` solo se montan en tutoriales que opten por `visual: clock`. La portada y las tarjetas del ecosistema son genéricas.

## Crear una nueva plataforma

Crea `src/content/platforms/es/mi-producto.md`, por ejemplo:

```yaml
---
key: mi-producto
locale: es
slug: mi-producto
title: Mi Producto
label: HERRAMIENTAS AMCO
summary: Aprende a utilizar esta herramienta y descubre sus funciones más importantes.
description: Tutoriales claros para aprender a utilizar Mi Producto dentro del ecosistema de Amco.
monogram: M
accent: sage
order: 4
published: true
---
Los tutoriales de esta plataforma estarán disponibles próximamente.
```

`key` y `slug` son identificadores distintos de `id`: **`id` viene del path** `es/mi-producto`. Una plataforma puede publicarse sin tutoriales; entonces se muestra «Próximamente».

## Crear un tutorial de esa plataforma

Crea `src/content/tutorials/es/mi-tutorial.md` y define la referencia **con el ID de Content Collections**:

```yaml
---
key: primer-tutorial
locale: es
slug: primeros-pasos
platform: es/mi-producto
visual: steps
category: basics
difficulty: beginner
title: Primeros pasos con Mi Producto
description: Descubre las herramientas básicas con una guía práctica paso a paso.
estimatedMinutes: 15
updatedAt: '2026-10-16'
featured: false
published: true
outcomes:
  - Reconocer las herramientas principales de la plataforma.
  - Seguir un flujo de trabajo básico con seguridad.
---
Aquí va una introducción para las personas que harán este tutorial.
```

La relación `platform: es/mi-producto` se valida contra las entradas de `platforms`; no es un `key` arbitrario. Los tutoriales publicados deben tener por lo menos un paso publicado.

## Crear pasos

Crea `src/content/lessons/es/mi-tutorial/01-primer-paso.md`:

```yaml
---
locale: es
tutorial: es/mi-tutorial
slug: primer-paso
order: 1
section: discover
title: Reconoce las herramientas básicas
description: Encuentra las funciones esenciales dentro de la plataforma.
takeaway: Aprender a ubicar las herramientas te ayudará a continuar con seguridad.
estimatedMinutes: 3
screenshots: []
published: true
---
Contenido claro para la persona usuaria.
```

**`tutorial: es/mi-tutorial` usa el nombre del archivo Markdown**, no `key: primer-tutorial` ni `slug: primeros-pasos`. Los pasos se ordenan por `order` de forma consecutiva, sin saltos. Puedes agregar cuantos tutoriales y pasos necesites; no hay rutas escritas manualmente por plataforma.

## Rutas canónicas

- `/es/`
- `/es/platforms/`
- `/es/platforms/pm-amco-editorial/`
- `/es/platforms/pm-amco-editorial/tutorials/time-tracking/`
- `/es/platforms/pm-amco-editorial/tutorials/time-tracking/localiza-la-tarea-y-su-reloj/`

La carpeta anterior `/es/tutorials/time-tracking/` sigue redirigiendo hacia la ruta nueva.

## Compatibilidad y despliegue

No se edita `src/styles/global.css`, `ClockDemo.astro`, ni las nueve lecciones fuera de sus referencias YAML. El diseño se extiende desde `src/styles/experience.css`. No se generan páginas en inglés hasta que existan contenidos completos.

En Netlify se mantiene: build `pnpm check`, directorio publicado `dist` y rama de producción `main`. Ejecuta `pnpm check` localmente antes de subir la rama. El ZIP incremental no sustituye tu repositorio Git ni efectúa commits.
