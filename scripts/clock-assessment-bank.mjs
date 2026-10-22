/** Cuestionario incremental: cada respuesta procede de la lección de relojes correspondiente. */
export const CLOCK_ASSESSMENTS = Object.freeze([
  {
    order: 1,
    type: 'true_false',
    question:
      'Si un reloj tiene horas registradas, la casilla de esa tarea ya queda marcada como completada.',
    correct: false,
    explanation:
      'El reloj registra tiempo y la casilla confirma que el trabajo está completado. Son acciones diferentes.',
  },
  {
    order: 2,
    type: 'single_choice',
    question: '¿Qué sucede al seleccionar «Comenzar ahora» en «Nuevo intervalo»?',
    options: [
      'Guarda una hora de inicio, aunque todavía no exista una hora de fin.',
      'Da la tarea por terminada inmediatamente.',
      'Elimina los periodos que ya estaban registrados.',
      'Inicia automáticamente todos los relojes de la lista.',
    ],
    correctIndex: 0,
    explanation:
      'Comenzar ahora registra el inicio de un nuevo intervalo; por sí solo no completa la tarea.',
  },
  {
    order: 3,
    type: 'matching',
    question:
      'Relaciona cada acción con lo que ocurre cuando haces una pausa y retomas el trabajo.',
    pairs: [
      {
        left: 'Pausar ahora',
        right: 'Guarda la hora de fin del intervalo que estabas registrando.',
      },
      {
        left: 'Retomar después',
        right: 'Permite registrar otro periodo mediante un nuevo intervalo.',
      },
      {
        left: 'Casilla de la tarea',
        right: 'Sigue pendiente mientras el trabajo no esté terminado.',
      },
    ],
    explanation:
      'Una pausa cierra un intervalo, pero conserva el trabajo pendiente y permite registrar nuevos periodos.',
  },
  {
    order: 4,
    type: 'true_false',
    question:
      'En el flujo explicado en esta guía, «Finalizar ahora» puede cerrar el intervalo y marcar la casilla de la tarea.',
    correct: true,
    explanation:
      'La guía indica que debes comprobar la casilla después de finalizar; esa es la confirmación visible.',
  },
  {
    order: 5,
    type: 'matching',
    question: 'Relaciona los conceptos que te ayudan a interpretar un intervalo.',
    pairs: [
      {
        left: 'Intervalo cerrado',
        right: 'Tiene registradas tanto la hora de inicio como la de fin.',
      },
      { left: 'Intervalo abierto', right: 'Le falta la hora de inicio, la de fin o ambas.' },
      {
        left: 'Tipo de intervalo',
        right: 'Indica si fue trabajo, comida, descanso u otra actividad.',
      },
    ],
    explanation:
      'El estado depende de las horas; el tipo describe la actividad. Abierto no siempre significa activo.',
  },
  {
    order: 6,
    type: 'single_choice',
    question:
      'Quieres corregir la hora de tu registro más reciente, sin crear otro periodo. ¿Qué apartado debes abrir?',
    options: [
      'Nuevo intervalo.',
      'Último intervalo.',
      'Iniciar todos los relojes.',
      'La casilla de completado.',
    ],
    correctIndex: 1,
    explanation:
      'Último intervalo sirve para corregir el registro reciente. Nuevo intervalo registra otro periodo.',
  },
  {
    order: 7,
    type: 'true_false',
    question:
      'La opción «Gestionar intervalos» solo te permite revisar y modificar el registro más reciente.',
    correct: false,
    explanation:
      'Gestionar intervalos permite consultar el historial de distintos periodos, y añadir, editar o eliminar registros.',
  },
  {
    order: 8,
    type: 'single_choice',
    question: 'Si necesitas registrar horas de una sola tarea, ¿cuál es el control correcto?',
    options: [
      'El reloj que se encuentra junto a esa tarea.',
      'El reloj de la lista con la opción «Iniciar todos los relojes».',
      'La opción «Finalizar todos los relojes».',
      'La casilla de completado de la lista.',
    ],
    correctIndex: 0,
    explanation:
      'El reloj de una tarea actúa sobre ella; las opciones que dicen «todos» pueden afectar varias tareas.',
  },
  {
    order: 9,
    type: 'matching',
    question: 'Relaciona los tres momentos del ejemplo de trabajo repartido en dos días.',
    pairs: [
      {
        left: 'Día 1: 10:00 a 10:40',
        right: 'Se guarda un intervalo cerrado y la tarea continúa pendiente.',
      },
      { left: 'Día 2: 12:00 a 13:00', right: 'Se registra otro intervalo separado del primero.' },
      { left: 'Trabajo terminado', right: 'Se verifica que la casilla de la tarea quede marcada.' },
    ],
    explanation:
      'Una tarea puede tener varios intervalos en días diferentes; la casilla indica cuándo está completada.',
  },
]);
