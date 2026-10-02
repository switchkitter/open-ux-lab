import type { SkillId } from "./skills";

/**
 * Content model for Open UX Lab.
 *
 * Content rules (see CONTENT_GUIDELINES.md):
 * - Lesson text and exercises are written in our own words.
 * - Every lesson links to at least one trusted source for depth.
 * - Mockup HTML is authored by us and rendered as trusted markup. Never put user input in it.
 */

export type License = {
  name: string;
  url: string;
};

export type Source = {
  title: string;
  url: string;
  /** Set for openly licensed sources (GOV.UK, USWDS, ...) so the lesson can show attribution. */
  license?: License;
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

/** One selectable part of a "spot the problem" mockup. */
export type SpotPart = {
  /** Unique within the exercise; `correct` refers to it. */
  id: string;
  /**
   * Everything a screen reader user hears for this part, so include its visible text. Describe what's
   * there in neutral words ("Field labeled Email", "Gray text inside reads ..."), never whether it's wrong.
   */
  label: string;
  /** Trusted HTML using the .mk-* classes. */
  html: string;
};

/**
 * A single mockup split into parts; the learner selects the part that breaks a principle.
 * Only use for problems that come across in words (labels, wording, structure, control choice),
 * not purely visual ones like contrast, so the exercise works with a screen reader.
 */
export type SpotExercise = {
  id: string;
  type: "spot";
  question: string;
  /** Screen title shown above the parts; not selectable. */
  title?: string;
  /** Top to bottom. A nested array is a row of parts side by side. */
  parts: (SpotPart | SpotPart[])[];
  /** ID of the part with the problem. */
  correct: string;
  why: string;
};

export type Exercise = CompareExercise | ChoiceExercise | SpotExercise;

export type Lesson = {
  id: string;
  /** Short reference code shown in the UI, e.g. "H1" */
  code: string;
  title: string;
  subtitle: string;
  minutes: number;
  /** Skills this lesson builds, for the skill map (src/content/skills.ts). */
  skills: SkillId[];
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
