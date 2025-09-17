---
title: Perfil
description: Aprende qué es un perfil de usuario, qué campos lo componen y cómo se calculan edad y salarios (mensual y diario) en MXN y USD.
---

# ¿Qué es un Perfil?

El **Perfil** amplía la información de un **[usuario]** con datos laborales y personales: rol en la empresa, tipo de contratación, horario, país, biografía, fecha de contratación, **salario mensual** (en MXN o USD) y propiedades **derivadas** como **edad** y **salario diario** (en MXN y USD).

Cada usuario tiene **exactamente un** perfil (relación 1:1). Además, puedes **subir una foto** para identificarlo visualmente.

![Overview](/images/en/accounts/profile/overview.webp)

---

## ¿Para qué sirve un Perfil?

- ✅ **Centraliza** la información laboral y personal de cada usuario.
- ✅ **Controla** rol, tipo de empleado y horario de trabajo.
- ✅ **Registra** la fecha de contratación y una biografía breve.
- ✅ **Gestiona salarios** en MXN o USD con validaciones y conversión automática.
- ✅ **Calcula** edad y salario **diario** a partir de los datos guardados.

---

## Campos del Perfil

Al crear o actualizar un perfil, considera los siguientes campos.

![Create](/images/en/accounts/profile/create.webp)

### 📌 Campos obligatorios

| Campo       | Descripción                                 | Tipo / Límite                       | Ejemplo                  |
| ----------- | ------------------------------------------- | ----------------------------------- | ------------------------ |
| **Usuario** | Usuario al que pertenece este perfil (1:1). | Referencia a **[usuario]**          | `ana.torres@example.com` |
| **Rol**     | Rol del empleado en la organización.        | Catálogo interno (EmployeeRole)     | `Content Editor`         |
| **Tipo**    | Tipo de empleado.                           | Catálogo interno (EmployeeType)     | `Headcount`              |
| **Horario** | Esquema de jornada laboral.                 | Catálogo interno (EmployeeSchedule) | `Tiempo completo`        |

> Los catálogos (Rol, Tipo, Horario) se gestionan desde configuración interna del sistema.

---

### 🔤 Campos opcionales (pero recomendados)

| Campo                     | Descripción                             | Tipo / Límite           | Ejemplo                 |
| ------------------------- | --------------------------------------- | ----------------------- | ----------------------- | ---------- |
| **Fecha de contratación** | Día en que la persona fue contratada.   | Fecha                   | `2024-08-01`            |
| **Biografía**             | Resumen corto del perfil profesional.   | Máx. **512** caracteres | `Editora de contenido…` |
| **Género**                | Género del usuario.                     | Catálogo (Gender)       | `Otro`                  |
| **Fecha de nacimiento**   | Usada para calcular **edad**.           | Fecha                   | `1992-05-10`            |
| **País**                  | País de residencia.                     | Selector de países      | `México`                |
| **Foto**                  | Imagen asociada al perfil.              | Archivo                 | `foto_perfil.png`       |
| **Salario mensual**       | Monto bruto mensual y moneda (MXN/USD). | `Money(MXN              | USD)`                   | `8364 MXN` |

---

## 💵 Salario, monedas y conversiones

- **Monedas permitidas:** `MXN` y `USD`.
- **Valor por defecto:** `8364 MXN`.
- **Rangos válidos (para MXN):** mínimo **3500 MXN**, máximo **100000 MXN**.
- **Conversión automática:**
  - `monthly_salary_usd` → convierte el salario mensual a **USD** si fue capturado en MXN.
  - `monthly_salary_mxn` → convierte el salario mensual a **MXN** si fue capturado en USD.
  - `daily_salary_usd` y `daily_salary_mxn` → calculan el **salario diario** dividiendo el mensual **entre 30** (resultado redondeado a 2 decimales).

> ℹ️ Las conversiones usan la utilidad interna `convert_amount` y pueden devolver `None` si ocurre algún error o no hay salario capturado.

---

## 👤 Edad

El campo **edad** se calcula automáticamente a partir de la **fecha de nacimiento**, tomando en cuenta el día y el mes actuales.  
Si no hay fecha de nacimiento, la edad será `null`.

---

## 🧭 Reglas y comportamiento

- **Un perfil por usuario:** la relación es **uno a uno**.
- **Orden por usuario:** los perfiles se listan alfabéticamente por email del usuario.
- **Foto de perfil:** se administra mediante el soporte de **carga de fotos** del sistema.
- **Validaciones:** biografía ≤ 512 caracteres; salarios dentro del rango permitido.

---

## 💡 Buenas prácticas

- Mantén **rol, tipo y horario** alineados con el contrato actual.
- Captura el **salario** en la moneda principal del contrato; usa las vistas de **conversión** solo para referencia.
- Completa **fecha de nacimiento** para habilitar el cálculo de **edad** (útil en reportes).
- Añade una **biografía** breve y una **foto** profesional para mejorar la identificación interna.

---

## 🚀 Acciones comunes

![Actions](/images/en/accounts/profile/actions.webp)

| Acción        | Qué hace                                             |
| ------------- | ---------------------------------------------------- |
| **✏️ Editar** | Modifica datos generales, salario, biografía y país. |
| **🖼️ Foto**   | Cambia o elimina la foto del perfil.                 |
| **👁️ Ver**    | Consulta todos los detalles del perfil.              |

---

## 📚 ¿Qué sigue después de crear un perfil?

- Asociar o verificar el **usuario** correspondiente.
- Completar **salario** y confirmar **moneda**.
- Cargar **foto** y **biografía**.
- Revisar cálculos de **edad** y **salario diario**.

---

[usuario]: /accounts/user/
