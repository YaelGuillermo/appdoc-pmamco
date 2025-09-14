---
title: Ítem
description: Aprende qué es un ítem dentro de una checklist, qué campos lo componen, cómo se ordena y qué límites aplica.
---

# ¿Qué es un Ítem?

Un **Ítem** es la unidad más pequeña de trabajo dentro de una **[checklist]**. Representa una tarea concreta asociada a un **[proceso]**, y puede incluir un enlace externo o archivo de apoyo.  
Los ítems permiten dar seguimiento granular al progreso de una checklist: cada vez que se marca un ítem como **completado**, se actualiza automáticamente el avance de la checklist.

![Overview](/images/en/projects/item/overview.webp)

---

## ¿Para qué sirve un Ítem?

- ✅ **Desglosa tareas específicas** dentro de una checklist.
- ✅ **Asocia procesos concretos** al flujo de trabajo.
- ✅ **Permite adjuntar enlaces** a recursos externos.
- ✅ **Actualiza el progreso automáticamente** al marcarse como completado.

---

## Campos del Ítem

Al crear o actualizar un ítem, deberás completar los siguientes campos. Aquí te explicamos cuáles son obligatorios y cuáles opcionales.

![Create](/images/en/projects/item/create.webp)

### 📌 Campos obligatorios

| Campo         | Descripción                                                             | Tipo / Opciones              | Ejemplo            |
| ------------- | ----------------------------------------------------------------------- | ---------------------------- | ------------------ |
| **Checklist** | La checklist a la que pertenece este ítem. _(Asignado automáticamente)_ | Referencia a **[checklist]** | `Checklist Diseño` |
| **Proceso**   | El proceso específico que representa este ítem.                         | Referencia a **[proceso]**   | `Diagramación`     |

---

### 🔤 Campos opcionales (pero recomendados)

| Campo          | Descripción                                                                 | Tipo     | Ejemplo                         |
| -------------- | --------------------------------------------------------------------------- | -------- | ------------------------------- |
| **URL**        | Enlace externo relacionado con la tarea (documento, diseño, recurso, etc.). | Link     | `https://figma.com/file/abc123` |
| **Completado** | Indica si la tarea está terminada.                                          | Booleano | `Sí`                            |
| **Foto**       | Imagen asociada al ítem (ej. captura, recurso visual).                      | Archivo  | `captura_portada.png`           |

---

## 📏 Límites y reglas importantes

- 🔒 **Máximo 25 ítems activos por checklist**  
  Cada checklist puede contener hasta **25 ítems** activos.

- 📐 **Orden local por checklist**  
  Los ítems tienen un **orden interno** que se gestiona dentro de la checklist.

- 🔄 **Impacto en progreso**  
  Al marcar un ítem como completado, se recalcula automáticamente el **progreso de la checklist**.

---

## 💡 Buenas prácticas

- Define ítems como **acciones claras y medibles** (“Revisar portada” mejor que “Portada”).
- Usa la **URL** para enlazar a recursos en Drive, Figma o repositorios.
- Adjunta una **foto** solo cuando sea relevante para validar el resultado.
- Marca ítems como **completados** únicamente cuando estén verificados al 100%.

---

## 🚀 Acciones rápidas

Desde el menú de cada ítem, puedes realizar acciones clave con un clic:

![Actions](/images/en/projects/item/actions.webp)

| Acción          | Qué hace                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| **✏️ Editar**   | Permite cambiar el proceso, URL, estado completado o foto asociada.                 |
| **⇅ Reordenar** | Cambia el orden de los ítems dentro de la checklist (drag & drop).                  |
| **👁️ Ver**      | Muestra detalles del ítem y su relación con la checklist y el proceso.              |
| **📦 Archivar** | Retira temporalmente el ítem. No se considera en el progreso hasta que se restaure. |

---

## 📚 ¿Qué sigue después de crear un ítem?

Una vez creado, puedes:

- Marcarlo como **completado** cuando la tarea esté terminada.
- Adjuntar o actualizar la **URL** de referencia.
- Reordenar los ítems para reflejar la secuencia de trabajo.
- Ver cómo se **actualiza el progreso de la checklist** automáticamente.

---

[checklist]: /projects/checklist/
[proceso]: /projects/process/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a la documentación de procesos o flujos de trabajo cuando estén disponibles)
-->
