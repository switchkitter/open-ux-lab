import { paths } from "../content/paths";
import type { Exercise, LearningPath, Lesson } from "../content/types";
import { dayKey, type Progress } from "./progress";

/**
 * Daily practice: a small mixed set of exercises from lessons the learner has finished. The set is
 * the same all day (seeded by the date), so reloading doesn't reshuffle it, and changes tomorrow.
 */

export const PRACTICE_SIZE = 5;

export type PracticeItem = { lesson: Lesson; exercise: Exercise };

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

/** Exercises from finished lessons, shuffled for the day, mixing exercise types where possible. */
export function practiceSet(progress: Progress, now: Date, learningPaths: LearningPath[] = paths, size = PRACTICE_SIZE): PracticeItem[] {
  const pool: PracticeItem[] = learningPaths.flatMap((p) =>
    p.lessons.filter((l) => progress.completedLessons[l.id]).flatMap((lesson) => lesson.exercises.map((exercise) => ({ lesson, exercise }))),
  );
  if (pool.length < size) return [];
  const random = seeded(dayKey(now));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // At most two of each exercise type and one per lesson first, then fill up from the rest.
  const picked: PracticeItem[] = [];
  const perType: Record<string, number> = {};
  const lessonsUsed = new Set<string>();
  for (const item of pool) {
    if (picked.length === size) break;
    if ((perType[item.exercise.type] ?? 0) >= 2 || lessonsUsed.has(item.lesson.id)) continue;
    picked.push(item);
    perType[item.exercise.type] = (perType[item.exercise.type] ?? 0) + 1;
    lessonsUsed.add(item.lesson.id);
  }
  for (const item of pool) {
    if (picked.length === size) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked;
}

export type PracticeStatus = "unavailable" | "ready" | "done";

export function practiceStatus(progress: Progress, now: Date, learningPaths: LearningPath[] = paths): PracticeStatus {
  if (progress.practiceDay === dayKey(now)) return "done";
  return practiceSet(progress, now, learningPaths).length ? "ready" : "unavailable";
}
