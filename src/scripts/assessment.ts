import {
  assessmentStorageKey,
  gradeAssessment,
  isAnswerComplete,
  type Assessment,
  type AssessmentAnswer,
  type AssessmentResult,
} from '../lib/assessment-engine';

interface StoredAssessment {
  readonly passed: boolean;
  readonly attempts: number;
  readonly answer: AssessmentAnswer;
}

function loadResult(key: string): StoredAssessment | null {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (!stored || typeof stored !== 'object') return null;
    const record = stored as Record<string, unknown>;
    if (typeof record.passed !== 'boolean') return null;
    if (
      typeof record.attempts !== 'number' ||
      !Number.isSafeInteger(record.attempts) ||
      record.attempts < 0
    )
      return null;
    return {
      passed: record.passed,
      attempts: record.attempts,
      answer: record.answer as AssessmentAnswer,
    };
  } catch {
    return null;
  }
}

function saveResult(key: string, result: AssessmentResult): void {
  try {
    localStorage.setItem(key, JSON.stringify(result));
  } catch {
    // Si el almacenamiento está restringido, el cuestionario sigue funcionando.
  }
}

function markStepAsLearned(locale: string, tutorialKey: string, step: string): void {
  document.dispatchEvent(
    new CustomEvent('amco:assessment-passed', { detail: { locale, tutorialKey, step } }),
  );
}

function initializeAssessment(root: HTMLElement): void {
  const locale = root.dataset.locale;
  const tutorialKey = root.dataset.tutorialKey;
  const step = root.dataset.stepSlug;
  const raw = root.dataset.question;
  if (!locale || !tutorialKey || !step || !raw) return;

  let assessment: Assessment;
  try {
    assessment = JSON.parse(raw) as Assessment;
  } catch {
    return;
  }

  const feedback = root.querySelector<HTMLElement>('[data-assessment-feedback]');
  const submit = root.querySelector<HTMLButtonElement>('[data-assessment-submit]');
  if (!feedback || !submit) return;
  const feedbackNode: HTMLElement = feedback;
  const submitButton: HTMLButtonElement = submit;
  const submitLabel = submitButton.querySelector<HTMLElement>('[data-assessment-submit-label]');
  const choiceButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-assessment-choice]'),
  );
  const matchingButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-assessment-match-pair]'),
  );
  const stepStatus = document.querySelector<HTMLElement>('[data-assessment-progress-status]');
  const es = locale === 'es';
  const storageKey = assessmentStorageKey(locale, tutorialKey, step);

  let selected: AssessmentAnswer | null = null;
  let matches: (number | null)[] =
    assessment.type === 'matching'
      ? Array.from({ length: assessment.pairs.length }, () => null)
      : [];
  const saved = loadResult(storageKey);
  let result: AssessmentResult | null =
    saved &&
    isAnswerComplete(assessment, saved.answer) &&
    gradeAssessment(assessment, saved.answer) === saved.passed
      ? saved
      : null;
  let editedSinceSubmit = false;

  if (result) {
    selected = result.answer;
    if (assessment.type === 'matching' && Array.isArray(result.answer)) {
      matches = [...result.answer];
    }
  }

  function currentAnswer(): AssessmentAnswer | null {
    if (assessment.type !== 'matching') return selected;
    return matches.every((value): value is number => value !== null)
      ? ([...matches] as number[])
      : null;
  }

  function render(): void {
    const passed = result?.passed === true;
    root.classList.toggle('is-passed', passed);
    choiceButtons.forEach((button) => {
      const index = Number(button.dataset.assessmentChoice);
      const active =
        assessment.type === 'true_false' ? selected === (index === 1) : selected === index;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
      button.disabled = passed;
    });
    matchingButtons.forEach((button) => {
      const pair = Number(button.dataset.assessmentMatchPair);
      const option = Number(button.dataset.assessmentMatchOption);
      const active = matches[pair] === option;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
      button.disabled = passed;
    });
    submitButton.disabled = passed;
    if (submitLabel)
      submitLabel.textContent = passed
        ? es
          ? 'Aprendido'
          : 'Learned'
        : es
          ? 'Comprobar respuesta'
          : 'Check answer';
    feedbackNode.classList.toggle('is-success', passed);
    feedbackNode.classList.toggle('is-error', !passed && result !== null && !editedSinceSubmit);
    if (passed && result) {
      if (stepStatus) stepStatus.textContent = es ? 'Paso aprendido' : 'Step learned';
      feedbackNode.textContent = es
        ? `¡Correcto! ${assessment.explanation} Intentos: ${result.attempts}.`
        : `Correct! ${assessment.explanation} Attempts: ${result.attempts}.`;
    } else if (result && !editedSinceSubmit && result.attempts > 0) {
      feedbackNode.textContent = es
        ? `Todavía no es correcto. Repasa la explicación y vuelve a intentarlo. Intentos: ${result.attempts}.`
        : `Not quite. Review the lesson and try again. Attempts: ${result.attempts}.`;
    } else {
      feedbackNode.textContent = '';
    }
  }

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (result?.passed) return;
      const index = Number(button.dataset.assessmentChoice);
      selected = assessment.type === 'true_false' ? index === 1 : index;
      editedSinceSubmit = true;
      render();
    });
  });

  matchingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (assessment.type !== 'matching' || result?.passed) return;
      const pair = Number(button.dataset.assessmentMatchPair);
      const option = Number(button.dataset.assessmentMatchOption);
      if (!Number.isInteger(pair) || pair < 0 || pair >= matches.length) return;
      if (!Number.isInteger(option) || option < 0 || option >= matches.length) return;
      if (matches[pair] === option) {
        matches[pair] = null;
      } else {
        // Relacion uno a uno: una misma respuesta no puede asignarse a dos conceptos.
        matches = matches.map((value, index) =>
          index !== pair && value === option ? null : value,
        );
        matches[pair] = option;
      }
      editedSinceSubmit = true;
      render();
    });
  });

  submitButton.addEventListener('click', () => {
    if (result?.passed) return;
    const answer = currentAnswer();
    if (!isAnswerComplete(assessment, answer) || answer === null) {
      feedbackNode.textContent = es
        ? 'Selecciona una respuesta para cada concepto antes de comprobar.'
        : 'Choose an answer for every concept before checking.';
      feedbackNode.classList.add('is-error');
      feedbackNode.classList.remove('is-success');
      return;
    }
    const passed = gradeAssessment(assessment, answer);
    result = { answer, passed, attempts: (result?.attempts ?? 0) + 1 };
    editedSinceSubmit = false;
    saveResult(storageKey, result);
    render();
    if (passed) markStepAsLearned(locale, tutorialKey, step);
  });

  render();
  if (result?.passed) {
    window.addEventListener('pageshow', () => markStepAsLearned(locale, tutorialKey, step), {
      once: true,
    });
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => markStepAsLearned(locale, tutorialKey, step),
        { once: true },
      );
    } else {
      markStepAsLearned(locale, tutorialKey, step);
    }
  }
}

document
  .querySelectorAll<HTMLElement>('[data-experience-assessment]')
  .forEach(initializeAssessment);
