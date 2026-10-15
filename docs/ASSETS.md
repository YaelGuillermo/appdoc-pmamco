# Imágenes del primer tutorial

**Carpeta:** `public/assets/tutorials/time-tracking/es/`

La exportación compartida de Raccord identifica las capturas como `img1.png` … `img10.png`, pero **no incluye sus archivos binarios**. Este proyecto no finge que están presentes. Muestra una tarjeta de reemplazo hasta que copies la captura verdadera en su lugar. En el siguiente build se mostrará automáticamente, sin editar código.

| Captura original | Nombre nuevo en `public/assets/tutorials/time-tracking/es/` | Dónde se muestra | Diapositiva fuente |
| ---------------- | ----------------------------------------------------------- | ---------------- | ------------------ |
| `img1.png`       | `01-tarea-y-casilla.png`                                    | Paso 1           | 02                 |
| `img4.png`       | `02-reloj-de-tarea.png`                                     | Paso 1           | 03                 |
| `img2.png`       | `03-nuevo-intervalo.png`                                    | Paso 2           | 08                 |
| `img6.png`       | `04-pausar-intervalo.png`                                   | Paso 3           | 06                 |
| `img7.png`       | `05-varios-intervalos.png`                                  | Paso 3           | 07                 |
| `img3.png`       | `06-ultimo-intervalo.png`                                   | Paso 6           | 09                 |
| `img5.png`       | `07-dos-menus.png`                                          | Paso 6           | 10                 |
| `img8.png`       | `08-administrar-intervalos.png`                             | Paso 7           | 12                 |
| `img9.png`       | `09-reloj-de-lista.png`                                     | Paso 8           | 13                 |
| `img10.png`      | `10-acciones-de-lista.png`                                  | Paso 8           | 13                 |

## Ejemplo de incorporación

Desde la carpeta del proyecto, si las capturas originales están en `~/Downloads/capturas`:

```bash
cp ~/Downloads/capturas/img1.png public/assets/tutorials/time-tracking/es/01-tarea-y-casilla.png
cp ~/Downloads/capturas/img4.png public/assets/tutorials/time-tracking/es/02-reloj-de-tarea.png
```

Para convertir a WebP, cambia el archivo en Markdown de `.png` a `.webp` y deposita el archivo convertido con esa extensión. Mantén un nombre estable por imagen. Usa capturas recortadas, sin datos personales ni tokens.

## Cómo se vinculan

Cada paso declara su arreglo `screenshots` en los metadatos YAML del Markdown. La página pasa esas declaraciones al componente `Screenshot.astro`. Si existe el archivo en `public/`, se muestra; si falta, se presenta su ruta de instalación.

Para añadir otra imagen, agrégala en `public/assets/tutorials/<slug>/<idioma>/` y una entrada nueva en `screenshots` (con `file`, `alt`, `caption`). No modifiques el componente.
