---
title: Miembro
description: Aprende qué es un miembro dentro de un programa, cómo funciona su acceso y qué campos lo definen.
---

# ¿Qué es un Miembro?

Un **Miembro** representa la participación de un **[usuario]** dentro de un **[programa]**. Define el nivel de acceso que tiene una persona, el equipo al que pertenece y si ha aceptado o no la invitación.

Los miembros son la base de la colaboración: permiten organizar el trabajo en equipos, controlar permisos y asegurar que cada persona tenga un rol definido en el programa.

![Overview](/images/en/projects/member/overview.webp)

---

## ¿Para qué sirve un Miembro?

- ✅ **Invita y gestiona usuarios** dentro de un programa.
- ✅ **Controla el nivel de acceso** (ej. propietario, miembro, solo lectura).
- ✅ **Organiza equipos de trabajo** por rol o especialidad.
- ✅ **Verifica invitaciones** y confirma la participación de cada persona.

---

## Campos del Miembro

Al crear o actualizar un miembro, deberás completar los siguientes campos. Aquí te explicamos cuáles son obligatorios y cuáles opcionales.

![Create](/images/en/projects/member/create.webp)

### 📌 Campos obligatorios

Estos campos **siempre deben completarse** para que un miembro sea válido en el programa.

| Campo               | Descripción                                                | Opciones / Tipo                                                | Ejemplo                   |
| ------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- | ------------------------- |
| **Usuario**         | El usuario que forma parte del programa.                   | Referencia a **[usuario]**                                     | `jose.garcia@example.com` |
| **Programa**        | El programa al que se invita al usuario.                   | Referencia a **[programa]**                                    | `Impact`                  |
| **Nivel de acceso** | Define los permisos del miembro dentro del programa.       | `Propietario`, `Administrador`, `Miembro`, `Lector`            | `Miembro`                 |
| **Equipo**          | El equipo al que pertenece el miembro dentro del programa. | `Diseño`, `Planeación`, `Edición`, `Calidad`, `Administración` | `Diseño`                  |

---

### 🔤 Campos opcionales (pero recomendados)

| Campo        | Descripción                                               | Tipo     | Ejemplo           |
| ------------ | --------------------------------------------------------- | -------- | ----------------- |
| **Aceptado** | Indica si el usuario ya aceptó la invitación al programa. | Booleano | `Sí`              |
| **Foto**     | Imagen asociada al miembro (ej. foto de perfil o avatar). | Archivo  | `foto_perfil.png` |

---

## 📏 Límites y reglas importantes

- 🔒 **Máximo 75 miembros activos por programa**  
  Cada programa puede tener hasta **75 miembros** simultáneamente.

- 🧭 **Unicidad por programa**  
  Un mismo usuario **no puede ser agregado dos veces** al mismo programa.

- 🔄 **Grupos de equipo automáticos**  
  Según el equipo asignado, el miembro se clasifica en un **grupo de trabajo**:
  - `Edición` o `Calidad` → **Revisión**
  - `Planeación` o `Administración` → **Operaciones**
  - Otros → **No agrupado**

---

## 💡 Buenas prácticas

- Asigna el **nivel de acceso correcto** según el rol real del usuario.
- Organiza a los miembros en **equipos claros** para mejorar la trazabilidad.
- Usa la propiedad **Aceptado** para validar que el usuario haya confirmado la invitación.
- No superes el límite de **75 miembros** por programa.

---

## 🚀 Acciones rápidas

Desde el menú de cada miembro, puedes realizar acciones clave con un clic:

![Actions](/images/en/projects/member/actions.webp)

| Acción          | Qué hace                                                                               |
| --------------- | -------------------------------------------------------------------------------------- |
| **✏️ Editar**   | Permite cambiar el nivel de acceso, equipo o foto del miembro.                         |
| **👁️ Ver**      | Muestra detalles del miembro: usuario, programa, nivel de acceso, equipo y aceptación. |
| **📦 Archivar** | Retira temporalmente al miembro del programa (sin eliminar al usuario del sistema).    |

---

## 📚 ¿Qué sigue después de crear un miembro?

Una vez agregado, puedes:

- Invitar al usuario para que acepte su participación.
- Cambiar su **nivel de acceso** según evolucione su rol en el programa.
- Asignarlo a **equipos específicos** para organizar el trabajo.
- Hacer seguimiento de la aceptación y actividad del miembro.

---

[usuario]: /accounts/user/
[programa]: /projects/program/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a guías sobre gestión de permisos o equipos de trabajo cuando estén disponibles)
-->
