# Arquitectura de PM Amco Editorial

## Principio rector

El producto es una **biblioteca de tutoriales orientados a acciones**, no una API reference. Las personas llegan para saber _qué hacer_, _dónde hacer clic_, _qué cambió_ y _cómo comprobarlo_. El código evita dependencias de React, Tailwind y Starlight porque no aportan valor a este sitio estático de aprendizaje.

## Capas

| Carpeta                    | Responsabilidad                                                |
| -------------------------- | -------------------------------------------------------------- |
| `src/config/`              | Idiomas, publicación y diccionarios de interfaz                |
| `src/content.config.ts`    | Contratos de metadatos, validados con Zod                      |
| `src/content/tutorials/`   | Contenido editorial de portadas de tutorial                    |
| `src/content/lessons/`     | Un Markdown por paso; independientes, ordenados y localizables |
| `src/lib/`                 | Consulta tipada, agrupación y generación de URLs/SEO           |
| `src/components/layout/`   | Estructura base y navegación compartidas                       |
| `src/components/tutorial/` | Primitivas de experiencia: pasos, capturas, práctica, progreso |
| `src/scripts/`             | Mejora progresiva mínima del navegador (sin framework)         |
| `src/pages/`               | Rutas estáticas generadas según contenido realmente publicado  |
| `public/assets/tutorials/` | Recursos públicos específicos de cada curso/idioma             |
| `tests/` + `scripts/`      | Pruebas de contenido y validación previa al build              |

**Regla:** no importes componentes de UI desde `src/lib` ni pongas texto de tutorial dentro de un componente. Los componentes describen _cómo se ve_, Markdown describe _qué se aprende_.

## Estrategia de idiomas

- `DEFAULT_LOCALE = 'en'`: idioma principal previsto.
- `LOCALES = ['en', 'es']`: idiomas del sistema.
- `PUBLISHED_LOCALES = ['es']`: _solo_ se publica español hasta que existan traducciones editoriales completas.
- Idiomas en rutas con prefijo: `/es/…` y, cuando esté habilitado, `/en/…`.
- La raíz `/` lleva al primer idioma realmente publicado; una vez se habilite inglés, pasa a `/en/`.
- El diccionario `src/config/translations.ts` ya implementa ambos idiomas en textos de la interfaz.
- Cada tutorial tiene una clave permanente (`key`, como `time-tracking`) y un `slug` que puede cambiar por idioma.
- Las lecciones se unen por `tutorial`, no por traducir a ciegas el nombre de archivo.
- No se crean páginas en inglés sin contenido en inglés. Esto evita fallbacks invisibles y SEO duplicado.

### Activar inglés más adelante

1. Traduce manualmente el tutorial a `src/content/tutorials/en/<slug>.md` (`key: time-tracking`, `locale: en`, nuevo `slug`).
2. Escribe **cada** lección en `src/content/lessons/en/<slug-del-tutorial>/`, con `locale: en` y `tutorial: time-tracking`.
3. Si hay capturas específicas para inglés, colócalas en `public/assets/tutorials/<slug>/en/` y actualiza sus rutas.
4. Activa `en` en `PUBLISHED_LOCALES` (en `src/config/locales.ts`).
5. Verifica `pnpm quality`. Las rutas, catálogo, navegación e índice se generan desde el contenido.

No usar traducción automática en producción sin revisión de la terminología en pantalla.

## Componentes reutilizables

- `Screenshot.astro`: recurso real si existe, placeholder accesible si no existe.
- `LearningIndex.astro`: lecciones agrupadas por etapa y marcador de pasos aprendidos.
- `LessonSidebar.astro`: navegación estructurada, con paso actual.
- `StepPager.astro`: enlaces anterior/siguiente.
- `ClockDemo.astro`: simulación aislada y explícitamente ilustrativa.
- `KnowledgeCheck.astro`: ejercicio con respuesta accesible.

## Estado y privacidad

El progreso se guarda solo en `localStorage`, bajo `pmamco:guides:progress:v1:<locale>:<tutorial-key>`, después de que la persona marca un paso. No existe backend, cuenta, rastreo ni envío de información. Bloquear `localStorage` no rompe la navegación. El indicador es ayuda personal, no registro oficial de formación.

## Reglas para nuevos tutoriales

- Preferir verbos y objetivos concretos en títulos: «Corrige…», «Registra…», «Evita…».
- Una lección = una acción o decisión con resultado comprobable.
- Guardar advertencias en `note` y capturas con `alt` y `caption` descriptivos.
- Evitar menús o acciones no corroboradas por material de producto.
- Mantener el orden (`order`) sin saltos, y sumar `estimatedMinutes` al del tutorial.
- Separar las capturas por tutorial e idioma; nunca dejarlas sueltas en la raíz de `public`.
