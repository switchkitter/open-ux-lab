import { paths } from "../content/catalog";
import type { ExerciseMeta, LessonMeta, PathMeta } from "../content/types";
import { CHALLENGE_SIZE, dayKey, type Progress } from "./progress";

/**
 * Daily practice: a small mixed set of exercises from lessons the learner has finished. The set is
 * the same all day (seeded by the date), so reloading doesn't reshuffle it, and changes tomorrow.
 */

export const PRACTICE_SIZE = 5;

/** Which exercises to practice; PracticePage loads the full exercises. */
export type PracticeItem = { lesson: LessonMeta; exercise: ExerciseMeta };

/** A small, fast pseudo-random generator, so a day's set is the same every time it's built. */
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/**
 * Shuffles the pool and picks `size` items, first keeping to the per-type and per-lesson limits so
 * the set is varied, then filling up from the rest if needed.
 */
export function pickMixed(pool: PracticeItem[], size: number, random: () => number, maxPerType: number, maxPerLesson: number): PracticeItem[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picked: PracticeItem[] = [];
  const perType: Record<string, number> = {};
  const perLesson: Record<string, number> = {};
  for (const item of shuffled) {
    if (picked.length === size) break;
    if ((perType[item.exercise.type] ?? 0) >= maxPerType || (perLesson[item.lesson.id] ?? 0) >= maxPerLesson) continue;
    picked.push(item);
    perType[item.exercise.type] = (perType[item.exercise.type] ?? 0) + 1;
    perLesson[item.lesson.id] = (perLesson[item.lesson.id] ?? 0) + 1;
  }
  for (const item of shuffled) {
    if (picked.length === size) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked;
}

/** Exercises from finished lessons, shuffled for the day, mixing exercise types where possible. */
export function practiceSet(progress: Progress, now: Date, learningPaths: PathMeta[] = paths, size = PRACTICE_SIZE): PracticeItem[] {
  const pool: PracticeItem[] = learningPaths.flatMap((p) =>
    p.lessons.filter((l) => progress.completedLessons[l.id]).flatMap((lesson) => lesson.exercises.map((exercise) => ({ lesson, exercise }))),
  );
  if (pool.length < size) return [];
  return pickMixed(pool, size, seeded(dayKey(now)), 2, 1);
}

/** A path challenge: questions from across the whole path, in a new random set each attempt. */
export function challengeSet(path: PathMeta, random: () => number = Math.random, size = CHALLENGE_SIZE): PracticeItem[] {
  const pool = path.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => ({ lesson, exercise })));
  return pickMixed(pool, Math.min(size, pool.length), random, Math.ceil(size / 4) + 1, 2);
}

export type PracticeStatus = "unavailable" | "ready" | "done";

export function practiceStatus(progress: Progress, now: Date, learningPaths: PathMeta[] = paths): PracticeStatus {
  if (progress.practiceDay === dayKey(now)) return "done";
  return practiceSet(progress, now, learningPaths).length ? "ready" : "unavailable";
}
