---
title: Libro
description: Aprende qué es un libro, cómo crear uno y qué campos debes completar.
---

# ¿Qué es un Libro?

Un **Libro** es un producto principal que materializa el propósito de un **[programa]**. Es la unidad fundamental de trabajo dentro de un programa, donde se estructuran, organizan y desarrollan los contenidos específicos. Los libros pueden ser manuales, guías, documentos técnicos o cualquier otro tipo de material educativo o editorial.

Los libros son la base de cualquier programa y permiten dividir grandes proyectos en partes manejables. Además, puedes organizarlos jerárquicamente, ya que un libro puede contener sub-libros (división del libro), lo que facilita la organización de contenido complejo.

![Overview](/images/en/projects/book/overview.webp)

---

## ¿Para qué sirve un Libro?

- ✅ **Organiza el contenido** en unidades lógicas y manejables.
- ✅ **Define la secuencia** de desarrollo del proyecto.
- ✅ **Asigna responsabilidades** a través de miembros del equipo.
- ✅ **Facilita el seguimiento del progreso** por parte del equipo.

---

## Campos del Libro

Al crear o actualizar un libro, deberás completar los siguientes campos. Aquí te explicamos qué significa cada uno, cuáles son obligatorios y cuáles tienen opciones disponibles.

![Create](/images/en/projects/book/create.webp)

### 📌 Campos obligatorios

Estos campos **debes completarlos siempre** para poder guardar el libro.

| Campo               | Descripción                                                       | Límite                   | Ejemplo               |
| ------------------- | ----------------------------------------------------------------- | ------------------------ | --------------------- |
| **Título**          | Nombre identificativo del libro. Debe ser claro y representativo. | Máximo **64 caracteres** | `Libro`               |
| **Fecha de inicio** | Día en que comienzan las actividades del libro.                   | —                        | `15 de enero de 2025` |
| **Fecha final**     | Día en que termina oficialmente el libro.                         | —                        | `30 de junio de 2025` |
| **Programa**        | El programa al que pertenece este libro. _(Llenado automático)_   | —                        | `Impact`              |

> ⚠️ **Importante**: Si no completas estos campos, no podrás guardar el libro.

---

### 🔤 Campos opcionales (pero recomendados)

Estos campos no son obligatorios, pero ayudan a estructurar mejor tu libro.

| Campo                 | Descripción                                                                                                            | Límite                     | Ejemplo                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| **Descripción**       | Explica el propósito, objetivos o alcance del libro. Ayuda a otros a entender de qué se trata.                         | Máximo **512 caracteres**  | `Este libro cubre las mejores prácticas de redacción técnica para documentos profesionales.` |
| **Número**            | Número secuencial del libro dentro del programa. Ayuda a ordenar los libros en una secuencia lógica.                   | Entre **1 y 15**           | `3`                                                                                          |
| **Grupo**             | Define el público objetivo del libro.                                                                                  | `Estudiante`, `Docente`    | `Estudiante`                                                                                 |
| **Cuenta de páginas** | Número aproximado de páginas del libro. Útil para planificar el tamaño y la duración del trabajo.                      | Entre **25 y 450** páginas | `120`                                                                                        |
| **Libro padre**       | Opcional. Permite organizar libros jerárquicamente, creando sub-libros bajo un libro principal. _(Llenado automático)_ | —                          | `Libro`                                                                                      |

---

## 📏 Límites y reglas importantes

- 🔒 **Máximo 15 libros activos por programa**  
  Solo puedes tener **15 libros activos** a la vez dentro de un programa. Si necesitas crear uno nuevo, deberás archivar uno anterior.

- 📅 **Las fechas deben tener sentido**
  - El libro debe comenzar **después o en** la fecha de inicio de su **programa** (si es principal) o de su **libro padre** (si es sub-libro).
  - Debe terminar **antes o en** la fecha final de ese mismo contexto.
  - Además, la **fecha de inicio no puede ser posterior a la fecha final**. No puedes crear un libro que termine antes de empezar.

- 🔄 **El progreso se calcula automáticamente**  
  El sistema monitorea el avance de los libros dentro del programa. Puedes verlo en el reporte general.

---

## 💡 Consejos para crear un buen libro

- Usa un **título claro y específico**, evita nombres genéricos como “Libro 1”.
- Aprovecha la **descripción** para explicar el propósito y alcance del libro.
- Define un **número secuencial** que refleje la secuencia lógica dentro del programa.
- Asigna un **responsable** para garantizar que alguien esté a cargo del desarrollo.
- Considera usar **sub-libros** si necesitas dividir el contenido en secciones más pequeñas.

---

## 🚀 Acciones

En la interfaz de libros, encontrarás varias acciones rápidas disponibles para gestionar tus libros de manera eficiente. Aquí te explicamos qué hace cada una:

![Actions](/images/en/projects/book/actions.webp)

| Acción          | Qué hace                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **🗜️ Clonar**   | Crea una copia profunda del libro y los objetos anidados (sub-libros, grados, sesiones, etc.). Útil para replicar estructuras complejas. |
| **📄 Duplicar** | Crea una copia superficial del libro (sin contenido interno). Ideal como plantilla.                                                      |
| **✏️ Editar**   | Permite modificar el libro.                                                                                                              |
| **👁️ Ver**      | Muestra detalles del libro: título, descripción, fechas, número, etc.                                                                    |
| **🖼️ Foto**     | Muestra la imagen o portada asociada al libro.                                                                                           |
| **📦 Archivar** | Retira el libro de forma temporal. Puedes recuperarlo cuando lo necesites.                                                               |

---

## 📚 ¿Qué sigue después de crear un libro?

Una vez creado, puedes:

- Añadir **sub-libros** y **grados** al libro.
- Seguir el **progreso del libro** desde el tablero.
- Marcar el libro como **favorito** para acceder rápidamente.

---

## 📝 Notas adicionales sobre la recursividad

Un libro puede contener **sub-libros** (división del libro), lo que permite organizar el contenido de manera jerárquica. Por ejemplo:

- **Libro Principal**: "Manual de Redacción Técnica"
  - **Sub-Libro 1**: "Capítulo 1: Introducción a la Redacción Técnica"
  - **Sub-Libro 2**: "Capítulo 2: Estilo y Estructura de Documentos"

Esta estructura jerárquica te ayuda a manejar proyectos grandes dividiéndolos en partes más pequeñas y manejables.

---

[programa]: /projects/program/

<!--
## 🔗 Lectura recomendada

- [¿Qué es una guía de cómo hacerlo?](https://diataxis.fr/how-to-guides/) – Aprende a estructurar documentación práctica y efectiva.
-->
