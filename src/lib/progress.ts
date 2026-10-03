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

/** Counts of good learning habits, for achievements. Only ever grow. */
export type LearningStats = {
  /** Review exercises answered right. */
  reviewCorrect: number;
  /** Exercises cleared from the review pile for good. */
  cleared: number;
  /** Spot-the-problem exercises right on the first try (in a lesson). */
  spotFirstTry: number;
  /** Lessons finished with every exercise right on the first try. */
  perfectLessons: number;
  /** Days the daily goal was reached. */
  goalDays: number;
};

export const DAILY_GOALS = [
  { xp: 20, name: "Light", hint: "a few exercises" },
  { xp: 50, name: "Steady", hint: "about one lesson" },
  { xp: 100, name: "Intense", hint: "about two lessons" },
] as const;
export const DEFAULT_GOAL = 50;
/** Streak freezes are earned by leveling up; you can hold this many. */
export const MAX_FREEZES = 2;

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
  /** XP earned on one local day (today, or the last day with XP). */
  dayXp: { day: string; xp: number } | null;
  /** Daily goal in XP (one of DAILY_GOALS). */
  goal: number;
  /** Last day the daily goal was reached, so each day counts once. */
  goalMetDay: string | null;
  /** Streak freezes held: each covers one missed day. */
  freezes: number;
  /** Highest level whose reward (a streak freeze) has been given. See lib/rewards.ts. */
  levelRewarded: number;
  /** Achievement ID -> day it was earned. See lib/rewards.ts. IDs are stable, like exercise IDs. */
  badges: Record<string, string>;
  stats: LearningStats;
};

export function emptyStats(): LearningStats {
  return { reviewCorrect: 0, cleared: 0, spotFirstTry: 0, perfectLessons: 0, goalDays: 0 };
}

export function emptyProgress(): Progress {
  return {
    version: 1,
    completedLessons: {},
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    review: {},
    seen: {},
    dayXp: null,
    goal: DEFAULT_GOAL,
    goalMetDay: null,
    freezes: 0,
    levelRewarded: 1,
    badges: {},
    stats: emptyStats(),
  };
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

/** XP earned today (0 if the last XP was on an earlier day). */
export function xpToday(p: Progress, now: Date): number {
  return p.dayXp && p.dayXp.day === dayKey(now) ? p.dayXp.xp : 0;
}

/** Adds XP, counting it toward today's goal. */
export function gainXp(p: Progress, amount: number, now: Date): Progress {
  const today = dayKey(now);
  const dayXp = { day: today, xp: xpToday(p, now) + amount };
  const reached = dayXp.xp >= p.goal && p.goalMetDay !== today;
  return {
    ...p,
    xp: p.xp + amount,
    dayXp,
    ...(reached && { goalMetDay: today, stats: { ...p.stats, goalDays: p.stats.goalDays + 1 } }),
  };
}

/** Changes the daily goal. Reaching the new goal with XP already earned today counts straight away. */
export function setGoal(p: Progress, goal: number, now: Date): Progress {
  const today = dayKey(now);
  const reached = xpToday(p, now) >= goal && p.goalMetDay !== today;
  return { ...p, goal, ...(reached && { goalMetDay: today, stats: { ...p.stats, goalDays: p.stats.goalDays + 1 } }) };
}

function bump(p: Progress, stat: keyof LearningStats): Progress {
  return { ...p, stats: { ...p.stats, [stat]: p.stats[stat] + 1 } };
}

/** Days missed between the last active day and today (0 if active yesterday or today). */
export function missedDays(p: Progress, now: Date): number {
  return p.lastActiveDay ? Math.max(0, -daysUntil(p.lastActiveDay, now) - 1) : 0;
}

/**
 * Updates the daily streak. Call when the learner finishes a lesson or review.
 * Missed days are covered by streak freezes, one per day, if there are enough; otherwise the streak restarts.
 */
export function recordActivity(p: Progress, now: Date): Progress {
  const today = dayKey(now);
  if (p.lastActiveDay === today) return p;
  if (!p.lastActiveDay) return { ...p, streak: 1, lastActiveDay: today };
  const missed = missedDays(p, now);
  if (missed === 0) return { ...p, streak: p.streak + 1, lastActiveDay: today };
  if (p.streak > 0 && missed <= p.freezes) return { ...p, streak: p.streak + 1, lastActiveDay: today, freezes: p.freezes - missed };
  return { ...p, streak: 1, lastActiveDay: today };
}

/** The streak as it stands today: 0 once more days have been missed than freezes can cover. */
export function currentStreak(p: Progress, now: Date): number {
  return missedDays(p, now) <= p.freezes ? p.streak : 0;
}

/** Answer given inside a lesson. Wrong answers go to the review pile, due straight away. */
export function recordLessonAnswer(
  p: Progress,
  exerciseId: string,
  correct: boolean,
  now: Date,
  type?: "compare" | "choice" | "spot",
): Progress {
  const seen = { ...p.seen, [exerciseId]: true as const };
  if (correct) {
    const next = gainXp({ ...p, seen }, XP.correctFirstTry, now);
    return type === "spot" ? bump(next, "spotFirstTry") : next;
  }
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
  const clears = step >= REVIEW_INTERVALS.length;
  if (clears) delete review[exerciseId];
  else review[exerciseId] = { step: step + 1, due: addDays(today, REVIEW_INTERVALS[step]) };
  const next = bump(gainXp({ ...p, seen, review }, XP.reviewCorrect, now), "reviewCorrect");
  return clears ? bump(next, "cleared") : next;
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

/** Marks a lesson complete. XP for completion is only awarded once; a perfect run counts every time. */
export function completeLesson(p: Progress, lessonId: string, now: Date, perfect = false): Progress {
  const next = perfect ? bump(p, "perfectLessons") : p;
  if (p.completedLessons[lessonId]) return next;
  return gainXp({ ...next, completedLessons: { ...p.completedLessons, [lessonId]: true } }, XP.lessonComplete, now);
}
