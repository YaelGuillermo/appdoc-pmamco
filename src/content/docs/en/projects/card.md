---
title: Tarjeta
description: Aprende qué es una tarjeta, cómo crear una y qué campos debes completar.
---

# ¿Qué es una Tarjeta?

Una **Tarjeta** es una unidad de trabajo específica y accionable que representa una tarea, actividad o elemento dentro de un **[libro]**, **[documento general]** o **[periférico]**. Está diseñada para organizar, asignar y hacer seguimiento del progreso de acciones concretas en el desarrollo de un proyecto editorial o académico.

Las tarjetas permiten desglosar el trabajo en pasos manejables, asignar responsables, establecer dependencias y medir el avance mediante listas de verificación. Son el motor operativo que impulsa la ejecución del contenido dentro de una estructura mayor como un libro o sesión.

![Overview](/images/en/projects/card/overview.webp)

---

## ¿Para qué sirve una Tarjeta?

- ✅ **Desglosa tareas grandes** en acciones específicas y ejecutables.
- ✅ **Asigna responsabilidades** con campos claros para dueños y auxiliares.
- ✅ **Establece prioridades** mediante niveles de estado (estatus) y valor.
- ✅ **Controla el flujo de trabajo** usando columnas y dependencias.
- ✅ **Vincula recursos externos** como enlaces o documentos relacionados.
- ✅ **Mide el progreso automáticamente** basado en checklists completadas.

---

## Campos de la Tarjeta

Al crear o actualizar una tarjeta, deberás completar los siguientes campos. Aquí te explicamos qué significa cada uno, cuáles son obligatorios y cuáles tienen opciones disponibles.

![Create](/images/en/projects/card/create.webp)

### 📌 Campos obligatorios

Estos campos **debes completarlos siempre** para poder guardar la tarjeta.

| Campo                 | Descripción                                                                                                | Límite                   | Ejemplo                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------- |
| **Título**            | Nombre identificativo de la tarjeta. Debe reflejar claramente la acción a realizar.                        | Máximo **64 caracteres** | `Redactar introducción` |
| **Tipo de contenido** | Modelo al que pertenece esta tarjeta: `Sesión`, `Documento general` o `Periférico`. _(Llenado automático)_ | —                        | `Sesión`                |

> ⚠️ **Importante**: Si no completas estos campos, no podrás guardar la tarjeta.

---

### 🔤 Campos opcionales (pero recomendados)

Estos campos no son obligatorios, pero ayudan a estructurar mejor tu tarjeta.

| Campo                      | Descripción                                                                          | Opciones / Límite         | Ejemplo                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Descripción**            | Explica el propósito o contenido de la tarjeta. Ayuda a otros a saber cuándo usarlo. | Máximo **512 caracteres** | `Este tarjeta define las actividades de redacción, formato y voz para todos los libros del programa.` |
| **Fecha y hora de inicio** | Fecha y hora programada para comenzar la tarea.                                      | —                         | `15 de enero de 2025, 9:00 AM`                                                                        |
| **Fecha y hora final**     | Fecha y hora esperada de finalización.                                               | —                         | `17 de enero de 2025, 6:00 PM`                                                                        |
| **Enlace (URL)**           | Vinculación a recursos externos: documentos, videos, páginas web.                    | URL válida                | `https://ejemplo.com/plantilla`                                                                       |
| **Recurso**                | Material que apoya el desarrollo de un programa.                                     | —                         | `Guía de estilo editorial`                                                                            |
| **Columna**                | Tablero asignado de la persona responsable en la ejecución de la tarjeta.            | —                         | `Inbox (Claudia Domínguez)`                                                                           |
| **Auxiliar**               | Persona que colabora en la ejecución de la tarjeta.                                  | —                         | `Carlos Méndez`                                                                                       |
| **Estado**                 | Nivel de prioridad o urgencia de la tarjeta.                                         | `Bajo`, `Medio`, `Alto`   | `Alto`                                                                                                |
| **Valor**                  | Cantidad de recursos asignados (1 a 5).                                              | Entre **1 y 5** puntos    | `3`                                                                                                   |
| **Depende de**             | Tarjeta que debe completarse antes de iniciar esta.                                  | —                         | `Revisar ortografía`                                                                                  |

---

## 📏 Límites y reglas importantes

- 🔒 **Máximo 20 tarjetas por objeto principal**  
  Solo puedes tener **20 tarjetas activas** asociadas a un mismo objeto (como una sesión o documento). Si necesitas más, considera archivar tarjetas finalizadas.

- 📅 **Las fechas deben tener sentido**  
  La **fecha de inicio** no puede ser posterior a la **fecha final**. Además, debe respetar el rango del libro o programa padre.

- 🔗 **Dependencias lógicas**  
  Si una tarjeta depende de otra, no estará disponible hasta que la anterior alcance un progreso del **100%**.

- 🔄 **El progreso se calcula automáticamente**  
  El sistema monitorea los ítems completados en todas las **checklists activas** vinculadas. El progreso es:  
  `(ítems completados / ítems totales) × 100%`

- 🧩 **Fase más avanzada alcanzada**  
  La tarjeta identifica automáticamente la **fase más alta** de una checklist en la que hay al menos un ítem completado.

---

## 💡 Consejos para crear una buena tarjeta

- Usa un **título claro y accionable**, como `Editar capítulo 2` o `Validar referencias bibliográficas`.
- Asigna un **valor real** según la cantidad de recursos empleados.
- Define **dependencias** cuando el orden sea crítico para el flujo de trabajo.
- Utiliza el campo **URL** para vincular plantillas, ejemplos o herramientas útiles.
- Aprovecha el campo **Recurso** para conectar materiales oficiales del programa.
- Usa **columnas** para asignar tareas a los miembros del programa.

---

## 🚀 Acciones rápidas

Desde el menú de cada tarjeta, puedes realizar acciones clave con un clic. Aquí te explicamos qué hace cada una:

![Actions](/images/en/projects/card/actions.webp)

| Acción          | Qué hace                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **🗜️ Clonar**   | Crea una copia profunda de la tarjeta y los objetos anidados (checklists, ítems, etc.). Útil para replicar estructuras complejas. |
| **📄 Duplicar** | Crea una copia superficial de la tarjeta (sin contenido interno). Ideal como plantilla.                                           |
| **✏️ Editar**   | Permite modificar la tarjeta.                                                                                                     |
| **👁️ Ver**      | Muestra detalles de la tarjeta: título, descripción, fechas, recurso, etc.                                                        |
| **📦 Archivar** | Retira la tarjeta de forma temporal sin perder su historial. Puedes recuperarla después.                                          |

> 💡 **Tip**: Usa _Clonar_ para replicar estructuras de revisión o formatos estándar entre diferentes sesiones o libros.

---

## 📚 ¿Qué sigue después de crear una tarjeta?

Una vez creada, puedes:

- Añadir **checklists** para desglosar pasos internos.
- Asignarla a una **columna** para gestionar su estado.
- Vincularla a un **auxiliar** para trabajo colaborativo.
- Seguir su **progreso automático** desde el tablero.
- Usarla como **prerrequisito** para otras tarjetas mediante dependencias.

---

## 🧩 Relación con otros modelos

La tarjeta está diseñada para ser flexible y reutilizable gracias al uso de `GenericForeignKey`. Puede vincularse a cualquiera de los siguientes modelos:

| Modelo                | ¿Qué representa?                                | Ejemplo de uso                      |
| --------------------- | ----------------------------------------------- | ----------------------------------- |
| **Sesión**            | Una unidad temática dentro de un libro.         | `Sesión 3: Metodología cualitativa` |
| **Documento general** | Un documento independiente del libro principal. | `Informe de investigación`          |
| **Periférico**        | Material complementario del programa.           | `Infografía resumen`                |

---

[libro]: /projects/book/
[documento general]: /projects/generaldocument/
[periférico]: /projects/peripheral/

<!--
## 🔗 Lectura recomendada

- [¿Qué es una guía de cómo hacerlo?](https://diataxis.fr/how-to-guides/) – Aprende a estructurar documentación práctica y efectiva.
-->
