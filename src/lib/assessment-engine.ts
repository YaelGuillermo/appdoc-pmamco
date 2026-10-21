/** Contrato independiente del navegador, reutilizable por cualquier tutorial. */
export interface AssessmentPair {
  readonly left: string;
  readonly right: string;
}

export type Assessment =
  | {
      readonly type: 'true_false';
      readonly question: string;
      readonly correct: boolean;
      readonly explanation: string;
    }
  | {
      readonly type: 'single_choice';
      readonly question: string;
      readonly options: readonly [string, string, string, string];
      readonly correctIndex: number;
      readonly explanation: string;
    }
  | {
      readonly type: 'matching';
      readonly question: string;
      readonly pairs: readonly AssessmentPair[];
      readonly explanation: string;
    };

export type AssessmentAnswer = boolean | number | readonly number[];

export function isAnswerComplete(assessment: Assessment, answer: AssessmentAnswer | null): boolean {
  switch (assessment.type) {
    case 'true_false':
      return typeof answer === 'boolean';
    case 'single_choice':
      return typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < 4;
    case 'matching':
      return (
        Array.isArray(answer) &&
        answer.length === assessment.pairs.length &&
        answer.every(
          (index) => Number.isInteger(index) && index >= 0 && index < assessment.pairs.length,
        )
      );
  }
}

export function gradeAssessment(assessment: Assessment, answer: AssessmentAnswer | null): boolean {
  if (!isAnswerComplete(assessment, answer)) return false;
  switch (assessment.type) {
    case 'true_false':
      return answer === assessment.correct;
    case 'single_choice':
      return answer === assessment.correctIndex;
    case 'matching':
      return Array.isArray(answer) && answer.every((value, index) => value === index);
  }
}

export interface AssessmentResult {
  readonly answer: AssessmentAnswer;
  readonly passed: boolean;
  readonly attempts: number;
}

export const assessmentStoragePrefix = 'amco:experience:assessment:v1';

export function assessmentStorageKey(
  locale: string,
  tutorialKey: string,
  lessonSlug: string,
): string {
  return `${assessmentStoragePrefix}:${locale}:${tutorialKey}:${lessonSlug}`;
}
