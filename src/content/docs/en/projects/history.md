---
title: Historial
description: Aprende qué es el historial de una tarjeta, cómo se registra automáticamente y cómo leer su línea de tiempo.
---

# ¿Qué es el Historial?

El **Historial** es el registro **automático** de eventos relevantes que ocurren sobre una **[tarjeta]** dentro de un programa.  
Se crea sin intervención manual (no hay acciones de “crear” o “duplicar”): por ejemplo, cuando una tarjeta es **tomada/asignada** por un **[miembro]**, el sistema genera una entrada que deja constancia del flujo de trabajo — **quién tuvo la tarjeta y cuándo**.

![Overview](/images/en/projects/history/overview.webp)

---

## ¿Para qué sirve el Historial?

- ✅ **Trazabilidad completa**: muestra por **quién** ha pasado la tarjeta y **en qué momento**.
- ✅ **Auditoría del proceso**: ayuda a entender decisiones y cambios de responsables.
- ✅ **Transparencia del flujo**: aporta contexto para revisiones y reportes.
- ✅ **Orden cronológico**: permite leer la **línea de tiempo** de la tarjeta de principio a fin.

---

## ¿Cómo se genera?

El historial se **genera automáticamente** cuando ocurren acciones clave definidas por el sistema (por ejemplo, **asignación** de una tarjeta).  
No es necesario (ni posible) crear o editar manualmente estas entradas: el sistema las guarda con la **fecha y hora exactas** del evento.

> ℹ️ **Ejemplo**: Cuando `María Pérez` toma la tarjeta “Portada Libro A”, se registra una entrada del historial de tipo **Asignación** con el miembro responsable y la marca de tiempo.

---

## Campos del Historial

Cada entrada del historial guarda la mínima información necesaria para reconstruir la línea de tiempo.

![Create](/images/en/projects/history/create.webp)

### 📌 Campos (gestionados por el sistema)

| Campo         | Descripción                                                                  | Tipo / Opciones                  | Ejemplo               |
| ------------- | ---------------------------------------------------------------------------- | -------------------------------- | --------------------- |
| **Tarjeta**   | La tarjeta a la que pertenece esta entrada de historial.                     | Referencia a **[tarjeta]**       | `Actividad 05`        |
| **Miembro**   | Miembro responsable **después** de la acción (puede ser nulo si no aplica).  | Referencia a **[miembro]** / `—` | `María Pérez`         |
| **Acción**    | Tipo de evento registrado. Definido por el sistema (p. ej., **Asignación**). | Catálogo interno (HistoryAction) | `Asignación`          |
| **Creado el** | Fecha y hora en que ocurrió la acción.                                       | Fecha/Hora (automática)          | `2025-01-15 10:23:11` |

> 🧭 **Orden**: Las entradas se muestran en **orden cronológico** (del más antiguo al más reciente) para facilitar la lectura de la línea de tiempo.

---

## 📏 Reglas importantes

- 🔒 **No editable por usuarios**  
  Las entradas del historial **no se crean, editan ni duplican** manualmente. Las gestiona el sistema.

- 🧭 **Pertenece a un programa**  
  El historial **siempre** está vinculado a un **[programa]** a través de su tarjeta.

- 🧩 **Acciones definidas**  
  Los tipos de acción provienen de un catálogo del sistema. El tipo por defecto es **Asignación**.

---

## 💡 Buenas prácticas para interpretar el historial

- Lee las entradas **de arriba hacia abajo** para entender el flujo desde el inicio.
- Relaciona cada evento con el **responsable** y **momento** exacto para auditorías.
- Úsalo en conjunto con el **tablero** y los **reportes** para obtener contexto completo.

---

## 🚀 Acciones disponibles

No hay acciones de usuario sobre el historial (no **crear**, no **editar**, no **clonar**).  
La única acción es **consultarlo** desde la tarjeta para entender su evolución.

---

## 📚 ¿Dónde lo veo?

- En el **detalle de la tarjeta**, sección **Historial**.
- En reportes o vistas donde se muestre la **línea de tiempo** de cambios y asignaciones.

---

[tarjeta]: /projects/card/
[miembro]: /projects/member/
[programa]: /projects/program/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a políticas de auditoría o flujos de asignación cuando estén disponibles)
-->
