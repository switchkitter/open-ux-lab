/**
 * Learner progress: pure functions, no storage or UI.
 * Keeping this pure makes it easy to test and to move to a server later.
 */

export const XP = {
  correctFirstTry: 10,
  lessonComplete: 20,
  reviewCorrect: 5,
} as const;

/** Correct answers in a row needed to clear an item from review. */
export const REVIEW_CLEAR_AFTER = 2;

export type ReviewItem = { correctInARow: number };

export type Progress = {
  version: 1;
  completedLessons: Record<string, true>;
  xp: number;
  streak: number;
  /** Local calendar day of last activity, e.g. "2026-10-01" */
  lastActiveDay: string | null;
  review: Record<string, ReviewItem>;
};

export function emptyProgress(): Progress {
  return { version: 1, completedLessons: {}, xp: 0, streak: 0, lastActiveDay: null, review: {} };
}

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Updates the daily streak. Call when the learner finishes a lesson or review. */
export function recordActivity(p: Progress, now: Date): Progress {
  const today = dayKey(now);
  if (p.lastActiveDay === today) return p;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const streak = p.lastActiveDay === dayKey(yesterday) ? p.streak + 1 : 1;
  return { ...p, streak, lastActiveDay: today };
}

/** Answer given inside a lesson. Wrong answers go to the review pile. */
export function recordLessonAnswer(p: Progress, exerciseId: string, correct: boolean): Progress {
  if (correct) return { ...p, xp: p.xp + XP.correctFirstTry };
  return { ...p, review: { ...p.review, [exerciseId]: { correctInARow: 0 } } };
}

/** Answer given in review mode. Items clear after REVIEW_CLEAR_AFTER correct answers in a row. */
export function recordReviewAnswer(p: Progress, exerciseId: string, correct: boolean): Progress {
  const review = { ...p.review };
  if (!correct) {
    review[exerciseId] = { correctInARow: 0 };
    return { ...p, review };
  }
  const next = (review[exerciseId]?.correctInARow ?? 0) + 1;
  if (next >= REVIEW_CLEAR_AFTER) delete review[exerciseId];
  else review[exerciseId] = { correctInARow: next };
  return { ...p, xp: p.xp + XP.reviewCorrect, review };
}

/** Marks a lesson complete. XP for completion is only awarded once. */
export function completeLesson(p: Progress, lessonId: string): Progress {
  if (p.completedLessons[lessonId]) return p;
  return {
    ...p,
    xp: p.xp + XP.lessonComplete,
    completedLessons: { ...p.completedLessons, [lessonId]: true },
  };
}
