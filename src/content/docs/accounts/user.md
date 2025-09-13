---
title: Usuario
description: Aprende qué es un usuario en el sistema, qué roles puede tener y cómo funcionan sus permisos.
---

# ¿Qué es un Usuario?

Un **Usuario** representa a una persona registrada en la plataforma, con credenciales de acceso y un rol asignado.  
Los usuarios son la base del sistema: pueden crear o unirse a **[programas]** como **[miembros]**, y colaborar en tareas, libros, recursos y más, según los permisos otorgados.

![Overview](/images/en/accounts/user/overview.webp)

---

<!--
## ¿Para qué sirve un Usuario?

- ✅ **Acceder al sistema** mediante correo y contraseña.
- ✅ **Identificar acciones** en programas, tarjetas, comentarios, etc.
- ✅ **Gestionar roles** (usuario, staff, administrador).
- ✅ **Controlar permisos** como la posibilidad de crear programas.

---
-->

## Campos del Usuario

Cada usuario tiene los siguientes atributos:

![Create](/images/en/accounts/user/create.webp)

### 📌 Campos obligatorios

| Campo          | Descripción                                                | Límite                    | Ejemplo                     |
| -------------- | ---------------------------------------------------------- | ------------------------- | --------------------------- |
| **Email**      | Correo electrónico único del usuario. Se usa para acceder. | Máximo **64 caracteres**  | `ana.torres@amcoonline.net` |
| **Nombre**     | Nombre de pila.                                            | Máximo **32 caracteres**  | `Ana`                       |
| **Apellido**   | Apellido del usuario.                                      | Máximo **32 caracteres**  | `Torres`                    |
| **Contraseña** | Clave del usuario. Se usa para acceder.                    | Máximo **128 caracteres** | `Amc0-ROB-12B`              |

---

### 🔤 Campos adicionales

| Campo                     | Descripción                                                   | Ejemplo                     |
| ------------------------- | ------------------------------------------------------------- | --------------------------- | --------------------- |
| **Rol**                   | Define el nivel del usuario en el sistema.                    | `Usuario`, `Staff`, `Admin` | `Usuario`             |
| **Puede crear programas** | Indica si el usuario puede iniciar nuevos programas.          | `True`                      |
| **Activo**                | Estado de la cuenta (`true` = activa, `false` = desactivada). | `True`                      |
| **Staff**                 | Marca si el usuario pertenece al equipo de staff (interno).   | `False`                     |
| **Fecha de registro**     | Fecha en que el usuario se unió al sistema.                   |                             | `2025-02-14 12:15:10` |

---

## 📏 Reglas importantes

- 📧 **El email es el identificador único** y se usa para iniciar sesión.
- 🧭 **Roles de usuario**:
  - `Usuario` → Acceso estándar.
  - `Staff` → Acceso administrativo interno.
  - `Admin` → Acceso completo y permisos avanzados.
- 🔒 **Creación de programas**: solo habilitado si el campo `can_create_programs` está en `True`.
- ♻️ **Eliminación lógica**: al “eliminar” un usuario, no desaparece, sino que se marca como **inactivo**.

---

## 💡 Buenas prácticas

- Usa un **email válido y único** para cada usuario.
- Mantén la información personal (nombre, apellido) actualizada y con formato correcto.
- Activa `can_create_programs` solo para usuarios que realmente necesitan crear programas.
- Utiliza la eliminación lógica (`soft_delete`) para evitar pérdida irreversible de datos.

---

## 🚀 Acciones sobre usuarios

![Actions](/images/en/accounts/user/actions.webp)

| Acción            | Qué hace                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **✏️ Editar**     | Permite modificar nombre, apellido, rol o permisos.                                       |
| **👁️ Ver**        | Muestra el perfil del usuario con sus detalles completos.                                 |
| **📦 Desactivar** | Realiza un **borrado lógico**, marcando al usuario como inactivo (`soft_delete`).         |
| **♻️ Restaurar**  | Reactiva un usuario previamente desactivado.                                              |
| **❌ Eliminar**   | Realiza un **borrado definitivo** (`hard_delete`), eliminando al usuario permanentemente. |

---

## 📚 ¿Qué sigue después de crear un usuario?

Una vez creado, el usuario puede:

- Iniciar sesión con su **email y contraseña**.
- Ser agregado como **miembro** en programas.
- Recibir permisos especiales según su **rol**.
- Participar en la colaboración de **tarjetas, comentarios y recursos**.

---

[programas]: /projects/program/
[miembros]: /projects/member/

<!--
## 🔗 Lectura recomendada

- (Agrega aquí enlaces internos a guías de gestión de usuarios y roles cuando estén disponibles)
-->
