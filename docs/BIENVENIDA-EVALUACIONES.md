# Cuestionarios de Amco Experience

Las evaluaciones son opcionales por lección. Los tutoriales anteriores sin `assessment` mantienen su botón y comportamiento de progreso original.

## Contrato

```yaml
assessment:
  type: single_choice
  question: ¿Dónde se consultan las cinco tarjetas recientes?
  options:
    - Anuncios
    - Mis Tarjetas
    - Biblioteca
    - Notas
  correctIndex: 1
  explanation: Mis Tarjetas muestra las últimas cinco tarjetas asignadas.
```

También se admiten `true_false` (`correct: true/false`) y `matching` (pares `left`/`right`). El validador Astro limita el número de respuestas de `single_choice` a cuatro y requiere de dos a cinco relaciones únicas en `matching`.

## Flujo de progreso

1. La persona responde al final de la lección.
2. El motor independiente de DOM (`assessment-engine.ts`) comprueba la respuesta.
3. El resultado y número de intentos se guardan en la clave `amco:experience:assessment:v1` + idioma + tutorial + slug del paso.
4. Cuando es correcta, la evaluación emite `amco:assessment-passed` y el sistema de progreso guarda el paso como aprendido bajo `amco:experience:progress:v2`.
5. Al volver a cargar la lección se restaura el resultado y se sincroniza de nuevo el progreso.

La portada del tutorial muestra el total de lecciones aprendidas. La simulación visual «Tu primer recorrido» no envía datos a PM Amco Editorial. Todo funciona del lado del cliente, sin nuevas dependencias ni cambios de backend.
