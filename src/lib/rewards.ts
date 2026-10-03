import { paths } from "../content/catalog";
import type { PathMeta } from "../content/types";
import { MAX_FREEZES, currentStreak, dayKey, missedDays, type Progress } from "./progress";

/**
 * Levels and achievements. Rewards never gate content: every lesson stays open. They give XP a meaning
 * (levels, each earning a streak freeze) and reward habits that help people learn (reviewing, streaks).
 * Pure functions; `settle` runs after every progress change (see useProgress).
 */

export type Level = { level: number; title: string; minXp: number };

export const LEVELS: readonly Level[] = [
  { level: 1, title: "Intern", minXp: 0 },
  { level: 2, title: "Junior designer", minXp: 100 },
  { level: 3, title: "Designer", minXp: 250 },
  { level: 4, title: "Senior designer", minXp: 500 },
  { level: 5, title: "Lead designer", minXp: 900 },
  { level: 6, title: "Principal designer", minXp: 1400 },
  { level: 7, title: "Design director", minXp: 2000 },
  { level: 8, title: "UX legend", minXp: 2800 },
];

export type LevelStatus = Level & { next: Level | null; xpIntoLevel: number; xpForLevel: number };

export function levelFor(xp: number): LevelStatus {
  const index = LEVELS.filter((l) => xp >= l.minXp).length - 1;
  const current = LEVELS[Math.max(0, index)];
  const next = LEVELS[index + 1] ?? null;
  return {
    ...current,
    next,
    xpIntoLevel: xp - current.minXp,
    xpForLevel: next ? next.minXp - current.minXp : 0,
  };
}

type Context = { progress: Progress; paths: PathMeta[]; now: Date };

export type Badge = {
  /** Stable key in progress.badges. Never rename or reuse once shipped. */
  id: string;
  name: string;
  /** How to earn it, shown before and after earning. */
  how: string;
  earned: (c: Context) => boolean;
};

const lessonsDone = (c: Context) => Object.keys(c.progress.completedLessons).length;
const pathDone = (p: PathMeta, c: Context) => p.lessons.every((l) => c.progress.completedLessons[l.id]);
const pathStarted = (p: PathMeta, c: Context) => p.lessons.some((l) => c.progress.completedLessons[l.id]);
const totalLessons = (c: Context) => c.paths.reduce((n, p) => n + p.lessons.length, 0);

export const BADGES: readonly Badge[] = [
  { id: "first-lesson", name: "First steps", how: "Finish your first lesson.", earned: (c) => lessonsDone(c) >= 1 },
  { id: "lessons-10", name: "Getting the hang of it", how: "Finish 10 lessons.", earned: (c) => lessonsDone(c) >= 10 },
  { id: "lessons-25", name: "Twenty-five down", how: "Finish 25 lessons.", earned: (c) => lessonsDone(c) >= 25 },
  { id: "all-lessons", name: "Completionist", how: "Finish every lesson in the app.", earned: (c) => lessonsDone(c) >= totalLessons(c) },
  { id: "path-done", name: "Every lesson done", how: "Finish every lesson in one learning path.", earned: (c) => c.paths.some((p) => pathDone(p, c)) },
  { id: "explorer", name: "Explorer", how: "Finish at least one lesson in every learning path.", earned: (c) => c.paths.every((p) => pathStarted(p, c)) },
  { id: "challenge-1", name: "Proven", how: "Pass a path challenge.", earned: (c) => Object.values(c.progress.challenges).some((r) => r.passedDay) },
  { id: "flawless", name: "Flawless", how: "Get every exercise in a lesson right on the first try.", earned: (c) => c.progress.stats.perfectLessons >= 1 },
  { id: "sharp-eye", name: "Sharp eye", how: "Get 10 spot-the-problem exercises right on the first try.", earned: (c) => c.progress.stats.spotFirstTry >= 10 },
  { id: "second-chance", name: "Second chance", how: "Get an exercise right in review.", earned: (c) => c.progress.stats.reviewCorrect >= 1 },
  { id: "review-25", name: "Learning from mistakes", how: "Get 25 exercises right in review.", earned: (c) => c.progress.stats.reviewCorrect >= 25 },
  { id: "cleared-1", name: "Locked in", how: "Clear an exercise from your review pile for good.", earned: (c) => c.progress.stats.cleared >= 1 },
  { id: "cleared-10", name: "Long-term memory", how: "Clear 10 exercises from your review pile for good.", earned: (c) => c.progress.stats.cleared >= 10 },
  { id: "streak-3", name: "On a roll", how: "Keep a 3-day streak.", earned: (c) => currentStreak(c.progress, c.now) >= 3 },
  { id: "streak-7", name: "Week streak", how: "Keep a 7-day streak.", earned: (c) => currentStreak(c.progress, c.now) >= 7 },
  { id: "streak-30", name: "Habit formed", how: "Keep a 30-day streak.", earned: (c) => currentStreak(c.progress, c.now) >= 30 },
  { id: "goal-1", name: "Goal reached", how: "Reach your daily goal.", earned: (c) => c.progress.stats.goalDays >= 1 },
  { id: "goal-7", name: "Goal getter", how: "Reach your daily goal on 7 different days.", earned: (c) => c.progress.stats.goalDays >= 7 },
];

/**
 * Hands out what the learner has earned: a streak freeze for each new level (up to MAX_FREEZES held)
 * and any new achievements. Safe to run any number of times; returns the same object when nothing changes.
 */
export function settle(progress: Progress, now: Date, learningPaths: PathMeta[] = paths): Progress {
  let p = progress;
  const { level } = levelFor(p.xp);
  if (level > p.levelRewarded) {
    p = { ...p, levelRewarded: level, freezes: Math.min(MAX_FREEZES, p.freezes + (level - p.levelRewarded)) };
  }
  const context: Context = { progress: p, paths: learningPaths, now };
  const fresh = BADGES.filter((b) => !p.badges[b.id] && b.earned(context));
  if (fresh.length) {
    const today = dayKey(now);
    p = { ...p, badges: { ...p.badges, ...Object.fromEntries(fresh.map((b) => [b.id, today])) } };
  }
  return p;
}

export type Rewards = {
  levelUp: Level | null;
  freezesEarned: number;
  freezesUsed: number;
  goalReached: boolean;
  badges: Badge[];
};

/** What changed between two snapshots, for the "lesson complete" and "review complete" screens. */
export function rewardsBetween(before: Progress, after: Progress, now: Date): Rewards {
  const was = levelFor(before.xp);
  const is = levelFor(after.xp);
  const today = dayKey(now);
  // Freezes cover missed days when the streak carries on past a gap; new levels then add to what's left.
  const missed = missedDays(before, now);
  const freezesUsed = missed > 0 && after.lastActiveDay === today && after.streak === before.streak + 1 ? missed : 0;
  return {
    levelUp: is.level > was.level ? is : null,
    freezesEarned: Math.max(0, after.freezes - (before.freezes - freezesUsed)),
    freezesUsed,
    goalReached: after.goalMetDay === today && before.goalMetDay !== today,
    badges: BADGES.filter((b) => after.badges[b.id] && !before.badges[b.id]),
  };
}
