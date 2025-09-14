---
title: Checklist
description: Aprende qué es una checklist, cómo crearla, cómo se calcula su progreso y qué límites aplica en el sistema.
---

# ¿Qué es una Checklist?

Una **Checklist** es una lista de verificación asociada a una **[tarjeta]** que agrupa tareas puntuales para un equipo y una fase de trabajo. Te ayuda a coordinar entregables, revisar avances y mantener el flujo de trabajo ordenado dentro de la tarjeta.

Cada checklist pertenece a **una sola tarjeta** y puede contener múltiples ítems (tareas pequeñas) que se marcan como hechas para calcular el progreso.

![Overview](/images/en/projects/checklist/overview.webp)

---

## ¿Para qué sirve una Checklist?

- ✅ **Divide el trabajo** de una tarjeta en pasos claros y accionables.
- ✅ **Organiza por equipo y fase**, facilitando la coordinación.
- ✅ **Mide el avance automáticamente** conforme se completan los ítems.
- ✅ **Mantiene el foco** del equipo en los pendientes del bloque actual.

---

## Campos de la Checklist

Al crear o actualizar una checklist, deberás completar los siguientes campos. Aquí te explicamos qué significa cada uno y cuáles son obligatorios.

![Create](/images/en/projects/checklist/create.webp)

### 📌 Campos obligatorios

Estos campos **debes completarlos siempre** para poder guardar la checklist.

| Campo       | Descripción                                                                              | Opciones / Tipo                | Ejemplo        |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------------------ | -------------- |
| **Tarjeta** | La tarjeta a la que pertenece esta checklist. _(Se asigna desde el contexto de edición)_ | Referencia a **[tarjeta]**     | `Actividad 05` |
| **Equipo**  | Equipo responsable del proceso que cubre esta checklist.                                 | Lista de equipos predefinidos¹ | `Diseño`       |
| **Fase**    | Etapa del flujo a la que pertenece esta checklist.                                       | Lista de fases predefinidas²   | `No iniciada`  |

> ¹ y ²: Las opciones dependen de la configuración del sistema (catálogos internos de **Equipo** y **Fase**).

---

### 🔤 Campos opcionales (pero recomendados)

| Campo             | Descripción                                                              | Tipo     | Ejemplo |
| ----------------- | ------------------------------------------------------------------------ | -------- | ------- |
| **Para revisión** | Indica si esta checklist es **específicamente** para tareas de revisión. | Booleano | `Sí`    |

> 💡 **Nota**: El orden de las checklists dentro de la tarjeta se puede ajustar (drag & drop) y se respeta en el tablero.

---

## 📏 Límites y reglas importantes

- 🔒 **Máximo 30 checklists activas por tarjeta**  
  Por cada tarjeta puedes tener **hasta 30** checklists activas. Si necesitas más, archiva o elimina alguna existente.

- 📐 **Orden por tarjeta**  
  El orden de las checklists es **local a la tarjeta**: solo afecta a las checklists de esa misma tarjeta.

- 📊 **Progreso automático**  
  El progreso de una checklist se calcula **automáticamente**:  
  \- Se consideran únicamente los **ítems activos** (no archivados).  
  \- **Progreso = (Ítems completados / Ítems activos) × 100**.  
  \- Una checklist se marca **“Completada”** cuando el progreso es **100%**.

---

## 💡 Buenas prácticas

- Crea checklists **enfocadas** por tema o subentregable (p. ej., “Ilustración portada”, “Corrección estilo”).
- Usa el campo **Equipo** para que cada área tenga su propio bloque de verificación.
- Cambia la **Fase** para reflejar el estado real del proceso (de “No iniciada” a “En proceso”, etc.).
- Activa **Para revisión** cuando la lista esté destinada a revisores (QA/Edición/Validación).

---

## 🚀 Acciones rápidas

Desde el menú de cada checklist, encontrarás acciones para gestionarla eficientemente:

![Actions](/images/en/projects/checklist/actions.webp)

| Acción          | Qué hace                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **✏️ Editar**   | Permite cambiar equipo, fase y el estado “para revisión”.                                       |
| **⇅ Reordenar** | Cambia el **orden** de la checklist dentro de la tarjeta (drag & drop).                         |
| **👁️ Ver**      | Muestra detalles y el desglose de ítems, incluyendo el **progreso**.                            |
| **🗜️ Clonar**   | Duplica la checklist (útil para reutilizar la misma estructura de ítems en otra fase o equipo). |
| **📦 Archivar** | Retira temporalmente la checklist. Puedes recuperarla cuando lo necesites.                      |

---

## 📚 ¿Qué sigue después de crear una checklist?

Una vez creada, puedes:

- Añadir **ítems** (tareas) y marcarlos como **hechos** a medida que avances.
- Duplicar la checklist para reutilizar su estructura en otra fase.
- Visualizar el **progreso** en tiempo real dentro de la tarjeta.

---

## 📝 Notas sobre progreso e ítems

- Si una checklist **no tiene ítems activos**, su progreso es **0%**.
- El conteo de ítems solo considera aquellos **no archivados** dentro de la checklist.
- Cuando todos los ítems activos están completos, la checklist queda **al 100%**.

---

[tarjeta]: /projects/card/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a guías de creación de ítems o flujos por fase cuando estén disponibles)
-->
