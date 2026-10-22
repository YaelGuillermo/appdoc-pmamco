/** Progreso por tutorial: una plataforma no puede sobrescribir a otra. */
type ProgressState = string[];
const storagePrefix = 'amco:experience:progress:v2';
const previousStoragePrefix = 'pmamco:guides:progress:v1';

function normalizeState(value: unknown): ProgressState {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
}

function readStored(key: string): ProgressState | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return normalizeState(JSON.parse(raw) as unknown);
  } catch {
    return undefined;
  }
}

const slugTranslations: Readonly<Record<string, string>> = {
  'primer-acceso-e-idioma': 'first-access-and-language',
  'explora-la-pantalla-inicial': 'explore-the-home-screen',
  'crea-y-administra-columnas': 'create-and-manage-columns',
  'estructura-y-movimiento-de-tarjetas': 'card-structure-and-movement',
  'conoce-el-interior-de-una-tarjeta': 'explore-a-card',
  'escribe-y-publica-comentarios': 'write-and-publish-comments',
  'edita-y-archiva-comentarios': 'edit-and-archive-comments',
  'mueve-y-reasigna-tarjetas': 'move-and-reassign-cards',
  'notas-y-ultimos-elementos': 'notes-and-final-elements',
  'localiza-la-tarea-y-su-reloj': 'find-the-task-and-clock',
  'comienza-a-registrar-tiempo': 'start-tracking-time',
  'pausa-y-continua-despues': 'pause-and-resume-later',
  'finaliza-la-tarea': 'finish-the-task',
  'interpreta-los-intervalos': 'understand-time-intervals',
  'corrige-el-ultimo-intervalo': 'correct-the-latest-interval',
  'revisa-y-edita-el-historial': 'review-and-edit-history',
  'evita-cambiar-varias-tareas': 'avoid-changing-multiple-tasks',
  'practica-con-dos-dias': 'practice-across-two-days',
};
function translatedSteps(items: ProgressState): ProgressState {
  return Array.from(new Set(items.map((step) => slugTranslations[step] ?? step)));
}

function readState(locale: string, tutorialKey: string, legacyKey?: string): ProgressState {
  const key = `${storagePrefix}:${locale}:${tutorialKey}`;
  const current = readStored(key);
  if (current !== undefined) {
    const translated = translatedSteps(current);
    if (JSON.stringify(translated) !== JSON.stringify(current))
      saveState(locale, tutorialKey, translated);
    return translated;
  }

  // Conserva los nueve pasos guardados antes de la migración, sin mezclar plataformas.
  if (legacyKey === 'time-tracking' && tutorialKey === 'es/pm-amco-editorial/time-tracking') {
    const previous = readStored(`${previousStoragePrefix}:${locale}:${legacyKey}`);
    if (previous !== undefined) {
      try {
        localStorage.setItem(key, JSON.stringify(translatedSteps(previous)));
      } catch {
        // El sitio funciona si el navegador prohíbe localStorage.
      }
      return translatedSteps(previous);
    }
  }
  return [];
}

function saveState(locale: string, tutorialKey: string, state: ProgressState): void {
  try {
    localStorage.setItem(`${storagePrefix}:${locale}:${tutorialKey}`, JSON.stringify(state));
  } catch {
    // La experiencia funciona aunque se desactive el almacenamiento local.
  }
}

function parseSteps(raw: string | undefined): string[] {
  try {
    return normalizeState(JSON.parse(raw ?? '[]') as unknown);
  } catch {
    return [];
  }
}

function updateProgress(root: HTMLElement): void {
  const key = root.dataset.tutorialKey;
  const locale = root.dataset.locale;
  if (!key || !locale) return;
  const steps = parseSteps(root.dataset.stepList);
  const done = readState(locale, key, root.dataset.legacyProgressKey).filter((step) =>
    steps.includes(step),
  );
  const count = done.length;
  const percent = steps.length === 0 ? 0 : Math.round((count / steps.length) * 100);

  root.querySelectorAll<HTMLElement>('[data-progress-count]').forEach((element) => {
    element.textContent = `${count} / ${steps.length}`;
  });
  root.querySelectorAll<HTMLElement>('[data-progress-fill]').forEach((element) => {
    element.style.width = `${percent}%`;
  });
  root.querySelectorAll<HTMLElement>('[data-step-marker]').forEach((element) => {
    element.classList.toggle('is-learned', done.includes(element.dataset.stepMarker ?? ''));
  });
  root.querySelectorAll<HTMLButtonElement>('[data-progress-toggle]').forEach((button) => {
    const learned = done.includes(button.dataset.stepId ?? '');
    button.setAttribute('aria-pressed', String(learned));
    button.classList.toggle('is-learned', learned);
    const label = button.querySelector<HTMLElement>('[data-progress-toggle-label]');
    if (label) {
      label.textContent = learned
        ? (button.dataset.doneLabel ?? '')
        : (button.dataset.undoneLabel ?? '');
    }
  });

  const continueLink = root.querySelector<HTMLAnchorElement>('[data-continue-link]');
  const nextStep = steps.find((step) => !done.includes(step)) ?? steps[0];
  const base = root.dataset.stepUrlBase;
  if (continueLink && nextStep && base) {
    continueLink.href = `${base}${encodeURIComponent(nextStep)}/`;
    const label = continueLink.querySelector<HTMLElement>('[data-continue-label]');
    if (label && count > 0 && count < steps.length) {
      label.textContent = continueLink.dataset.continueText ?? label.textContent;
    }
  }
}

function renderAll(): void {
  document.querySelectorAll<HTMLElement>('[data-progress-root]').forEach(updateProgress);
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>('[data-progress-toggle]');
  const root = button?.closest<HTMLElement>('[data-progress-root]');
  const locale = root?.dataset.locale;
  const key = root?.dataset.tutorialKey;
  const step = button?.dataset.stepId;
  if (!button || !root || !locale || !key || !step) return;
  const state = readState(locale, key, root.dataset.legacyProgressKey);
  const next = state.includes(step) ? state.filter((value) => value !== step) : [...state, step];
  saveState(locale, key, next);
  renderAll();
});

renderAll();
window.addEventListener('pageshow', renderAll);

/** Respuestas correctas: marcar el paso aprendido y actualizar todas las vistas. */
document.addEventListener('amco:assessment-passed', (event: Event) => {
  if (!(event instanceof CustomEvent)) return;
  const data: unknown = event.detail;
  if (!data || typeof data !== 'object') return;
  const { locale, tutorialKey, step } = data as Record<string, unknown>;
  if (typeof locale !== 'string' || typeof tutorialKey !== 'string' || typeof step !== 'string')
    return;
  const before = readState(locale, tutorialKey);
  if (!before.includes(step)) saveState(locale, tutorialKey, [...before, step]);
  renderAll();
});
