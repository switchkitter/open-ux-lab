/**
 * Content model for Open UX Lab.
 *
 * Content rules (see CONTENT_GUIDELINES.md):
 * - Lesson text and exercises are written in our own words.
 * - Every lesson links to at least one trusted source for depth.
 * - Mockup HTML is authored by us and rendered as trusted markup. Never put user input in it.
 */

export type Source = {
  title: string;
  url: string;
};

/** Two mini UI mockups; the learner picks the better one. */
export type CompareExercise = {
  id: string;
  type: "compare";
  question: string;
  /** Trusted HTML using the .mk-* mockup classes in styles.css */
  a: string;
  b: string;
  correct: "a" | "b";
  why: string;
};

/** Classic multiple choice. */
export type ChoiceExercise = {
  id: string;
  type: "choice";
  question: string;
  options: string[];
  /** Index into options */
  correct: number;
  why: string;
};

export type Exercise = CompareExercise | ChoiceExercise;

export type Lesson = {
  id: string;
  /** Short reference code shown in the UI, e.g. "H1" */
  code: string;
  title: string;
  subtitle: string;
  minutes: number;
  body: string[];
  practice: string[];
  /** A small task the learner can try on a real product at work */
  fieldExercise: string;
  sources: Source[];
  exercises: Exercise[];
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  status: "live" | "planned";
  lessons: Lesson[];
};
