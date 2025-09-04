---
title: Actividad
description: Aprende qué es una actividad, cómo se registra automáticamente en los ítems y cómo interpretar su flujo.
---

# ¿Qué es una Actividad?

Una **Actividad** es un registro **automático** que refleja las acciones realizadas sobre un **[ítem]** dentro de una **[checklist]** y, por extensión, dentro de un programa.

Se genera cada vez que un ítem es **creado, actualizado, marcado como hecho o desmarcado**. Esto permite tener un historial detallado de cambios a nivel de tareas individuales, quién los realizó y en qué momento.

![Overview](/images/en/projects/activity/overview.webp)

---

## ¿Para qué sirve una Actividad?

- ✅ **Registra acciones automáticas** sobre los ítems (crear, editar, marcar, desmarcar).
- ✅ **Asocia un responsable** a cada cambio (el miembro que realizó la acción).
- ✅ **Proporciona trazabilidad** de las tareas pequeñas en un programa.
- ✅ **Facilita la auditoría** del flujo de trabajo con un nivel de detalle fino.

---

## ¿Cómo se genera?

Las actividades se crean **sin intervención manual**. Cada vez que ocurre un evento en un ítem, el sistema guarda una entrada:

- 📌 **Creación de ítem** → Se registra una actividad de tipo `Creado`.
- ✏️ **Actualización de ítem** → Se registra una actividad de tipo `Editado`.
- ✅ **Marcado como hecho** → Se registra una actividad de tipo `Completado`.
- ⬜ **Desmarcado (hecho → no hecho)** → Se registra una actividad de tipo `Desmarcado`.

> ℹ️ **Ejemplo**: Cuando `Carlos Méndez` marca como completado el ítem “Diagramar portada”, se crea una actividad `Completado` vinculada al miembro y al ítem.

---

## Campos de la Actividad

Cada registro contiene la información necesaria para reconstruir el flujo de cambios de un ítem.

![Create](/images/en/projects/activity/create.webp)

### 📌 Campos (gestionados por el sistema)

| Campo         | Descripción                                                    | Tipo / Opciones                                 | Ejemplo               |
| ------------- | -------------------------------------------------------------- | ----------------------------------------------- | --------------------- |
| **Ítem**      | Ítem sobre el que se realizó la acción.                        | Referencia a **[ítem]**                         | `Diagramar portada`   |
| **Miembro**   | Miembro que ejecutó la acción. Puede estar vacío si no aplica. | Referencia a **[miembro]** / `—`                | `Carlos Méndez`       |
| **Acción**    | Tipo de evento ocurrido sobre el ítem.                         | `Creado`, `Editado`, `Completado`, `Desmarcado` | `Completado`          |
| **Creado el** | Fecha y hora exactas en que ocurrió la acción.                 | Fecha/Hora (automática)                         | `2025-02-03 14:05:12` |

> 🧭 **Orden**: Las actividades se muestran en **orden descendente** (de la más reciente a la más antigua).

---

## 📏 Reglas importantes

- 🔒 **No editable ni manual**  
  Las actividades **no se crean, editan ni duplican manualmente**. Siempre las genera el sistema.

- 🧭 **Pertenece a un programa**  
  Cada actividad está vinculada indirectamente a un **[programa]** a través del ítem y su checklist.

- 🔄 **Tipos de acción predefinidos**  
  Los tipos provienen de un catálogo del sistema (**ActivityAction**). El valor por defecto es `Creado/Desmarcado`.

---

## 💡 Buenas prácticas para interpretar actividades

- Usa el historial de actividades para **entender qué pasó con un ítem** y quién lo hizo.
- Analiza la secuencia de eventos para identificar **errores, cambios de estado o retrocesos**.
- Úsalo en conjunto con el **historial de tarjetas** para obtener una trazabilidad completa a todos los niveles.

---

## 🚀 Acciones disponibles

No hay acciones de usuario sobre las actividades (no **crear**, no **editar**, no **clonar**).  
La única acción es **consultarlas** en la vista del ítem o checklist.

---

## 📚 ¿Dónde lo veo?

- En el **detalle del ítem**, sección **Actividades**.
- En reportes de auditoría de **ítems y checklists**.

---

[ítem]: /projects/item/
[miembro]: /projects/member/
[checklist]: /projects/checklist/
[programa]: /projects/program/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a guías de uso de checklists o trazabilidad de procesos cuando estén disponibles)
-->
