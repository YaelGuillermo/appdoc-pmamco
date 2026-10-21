/** Simulación exclusivamente visual: no accede al backend ni a los proyectos. */
const key = 'amco:experience:welcome-demo:v1';
const views = ['programas', 'columnas', 'tarjetas', 'comentarios'] as const;
type View = (typeof views)[number];

function isView(value: string): value is View {
  return views.some((view) => view === value);
}

for (const root of document.querySelectorAll<HTMLElement>('[data-welcome-workspace]')) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-workspace-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-workspace-panel]'));
  function show(view: View): void {
    for (const button of buttons) {
      const selected = button.dataset.workspaceTab === view;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-active', selected);
    }
    for (const panel of panels) panel.hidden = panel.dataset.workspacePanel !== view;
    try {
      localStorage.setItem(key, view);
    } catch {
      /* Almacenamiento opcional. */
    }
  }
  let initial: View = 'programas';
  try {
    const saved = localStorage.getItem(key);
    if (saved && isView(saved)) initial = saved;
  } catch {
    /* Modo privado: iniciar desde Programas. */
  }
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const view = button.dataset.workspaceTab;
      if (view && isView(view)) show(view);
    });
  }
  show(initial);
}
