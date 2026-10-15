/** Progreso intencional: solo se marca cuando la persona confirma un paso. */
type ProgressState = string[];
const storagePrefix = 'pmamco:guides:progress:v1';

function readState(locale: string, tutorialKey: string): ProgressState {
  const key = `${storagePrefix}:${locale}:${tutorialKey}`;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveState(locale: string, tutorialKey: string, state: ProgressState): void {
  try {
    localStorage.setItem(`${storagePrefix}:${locale}:${tutorialKey}`, JSON.stringify(state));
  } catch {
    // La página sigue funcionando si el navegador impide guardar datos.
  }
}

function parseSteps(raw: string | undefined): string[] {
  try {
    const decoded: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(decoded)
      ? decoded.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function updateProgress(root: HTMLElement): void {
  const key = root.dataset.tutorialKey;
  const locale = root.dataset.locale;
  if (!key || !locale) return;
  const steps = parseSteps(root.dataset.stepList);
  const done = readState(locale, key).filter((step) => steps.includes(step));
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
    if (label)
      label.textContent = learned
        ? (button.dataset.doneLabel ?? '')
        : (button.dataset.undoneLabel ?? '');
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
  const state = readState(locale, key);
  const next = state.includes(step) ? state.filter((value) => value !== step) : [...state, step];
  saveState(locale, key, next);
  renderAll();
});

renderAll();
window.addEventListener('pageshow', renderAll);
