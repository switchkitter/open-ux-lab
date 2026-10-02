/**
 * Learner progress: pure functions, no storage or UI.
 * Keeping this pure makes it easy to test and to move to a server later.
 */

export const XP = {
  correctFirstTry: 10,
  lessonComplete: 20,
  reviewCorrect: 5,
} as const;

/**
 * Spaced review: after each correct review, an item comes back after the next interval (in days).
 * Correct once more after the last interval and it's cleared. A wrong answer starts it over.
 */
export const REVIEW_INTERVALS = [1, 3, 7] as const;

export type ReviewItem = {
  /** Correct reviews in a row so far (0 = just missed). */
  step: number;
  /** Local day it's next due, e.g. "2026-10-02". Due when this is today or earlier. */
  due: string;
};

export type Progress = {
  version: 1;
  completedLessons: Record<string, true>;
  xp: number;
  streak: number;
  /** Local calendar day of last activity, e.g. "2026-10-01" */
  lastActiveDay: string | null;
  review: Record<string, ReviewItem>;
  /** Exercises answered at least once, for the skill map. Only ever grows. */
  seen: Record<string, true>;
};

export function emptyProgress(): Progress {
  return { version: 1, completedLessons: {}, xp: 0, streak: 0, lastActiveDay: null, review: {}, seen: {} };
}

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Day key `days` after the given day key. */
export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + days));
}

/** Whole days from today until the given day key (0 = today, negative = past). */
export function daysUntil(key: string, now: Date): number {
  const [y, m, d] = key.split("-").map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000);
}

/** "today", "tomorrow" or "in 3 days". */
export function whenLabel(key: string, now: Date): string {
  const n = daysUntil(key, now);
  return n <= 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`;
}

/** What happens to an item after this review answer, in words, before recording it. */
export function reviewOutcome(p: Progress, exerciseId: string, correct: boolean): string {
  if (!correct) return "It'll come back tomorrow.";
  const step = p.review[exerciseId]?.step ?? 0;
  if (step >= REVIEW_INTERVALS.length) return "That's cleared from your review pile.";
  const days = REVIEW_INTERVALS[step];
  return `Next review ${days === 1 ? "tomorrow" : `in ${days} days`}.`;
}

export function isDue(item: ReviewItem, now: Date): boolean {
  return item.due <= dayKey(now);
}

/** Exercise IDs due for review now, soonest first. */
export function dueReviewIds(p: Progress, now: Date): string[] {
  return Object.entries(p.review)
    .filter(([, item]) => isDue(item, now))
    .sort(([, a], [, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0))
    .map(([id]) => id);
}

/** The earliest upcoming review day and how many items are due then, or null if nothing is scheduled. */
export function nextReview(p: Progress, now: Date): { day: string; count: number } | null {
  const today = dayKey(now);
  const upcoming = Object.values(p.review).filter((item) => item.due > today).map((item) => item.due).sort();
  if (!upcoming.length) return null;
  return { day: upcoming[0], count: upcoming.filter((d) => d === upcoming[0]).length };
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

/** Answer given inside a lesson. Wrong answers go to the review pile, due straight away. */
export function recordLessonAnswer(p: Progress, exerciseId: string, correct: boolean, now: Date): Progress {
  const seen = { ...p.seen, [exerciseId]: true as const };
  if (correct) return { ...p, seen, xp: p.xp + XP.correctFirstTry };
  return { ...p, seen, review: { ...p.review, [exerciseId]: { step: 0, due: dayKey(now) } } };
}

/**
 * Answer given in review mode. Correct moves the item to the next interval, or clears it after the
 * last one. Wrong starts it over, due tomorrow (the learner has just seen the explanation).
 */
export function recordReviewAnswer(p: Progress, exerciseId: string, correct: boolean, now: Date): Progress {
  const review = { ...p.review };
  const seen = { ...p.seen, [exerciseId]: true as const };
  const today = dayKey(now);
  if (!correct) {
    review[exerciseId] = { step: 0, due: addDays(today, 1) };
    return { ...p, seen, review };
  }
  const step = review[exerciseId]?.step ?? 0;
  if (step >= REVIEW_INTERVALS.length) delete review[exerciseId];
  else review[exerciseId] = { step: step + 1, due: addDays(today, REVIEW_INTERVALS[step]) };
  return { ...p, seen, xp: p.xp + XP.reviewCorrect, review };
}

/**
 * Brings a stored review item to the current shape. Older versions stored { correctInARow } with no
 * due date; those become due straight away at the same step.
 */
export function normalizeReviewItem(raw: unknown): ReviewItem {
  const item = (raw && typeof raw === "object" ? raw : {}) as Partial<ReviewItem> & { correctInARow?: number };
  const step = typeof item.step === "number" ? item.step : typeof item.correctInARow === "number" ? item.correctInARow : 0;
  const due = typeof item.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.due) ? item.due : "0000-00-00";
  return { step: Math.max(0, Math.min(step, REVIEW_INTERVALS.length)), due };
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
