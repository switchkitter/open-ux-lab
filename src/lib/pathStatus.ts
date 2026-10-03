import type { LessonMeta, PathMeta } from "../content/types";
import { challengePassed, type Progress } from "./progress";

export type PathStatus = {
  done: number;
  total: number;
  /** Rough total reading-plus-practice time in minutes. */
  minutes: number;
  /** First lesson not yet completed, or null when the path is finished. */
  next: LessonMeta | null;
  /** "challenge": every lesson is done, but the path challenge isn't passed yet. A path is complete only once it is. */
  state: "not-started" | "in-progress" | "challenge" | "complete";
};

export function pathStatus(path: PathMeta, progress: Progress): PathStatus {
  const done = path.lessons.filter((l) => progress.completedLessons[l.id]).length;
  const next = path.lessons.find((l) => !progress.completedLessons[l.id]) ?? null;
  return {
    done,
    total: path.lessons.length,
    minutes: path.lessons.reduce((n, l) => n + l.minutes, 0),
    next,
    state: done === 0 ? "not-started" : next ? "in-progress" : challengePassed(progress, path.id) ? "complete" : "challenge",
  };
}

export type NextStep = { kind: "lesson"; path: PathMeta; lesson: LessonMeta } | { kind: "challenge"; path: PathMeta };

/**
 * The learner's next step for the home page: the next lesson in the first path they've started,
 * then a path challenge they've unlocked. Null before they've started anything (the path cards
 * cover that) and once every started path is complete.
 */
export function nextStep(paths: PathMeta[], progress: Progress): NextStep | null {
  const statuses = paths.map((path) => ({ path, s: pathStatus(path, progress) }));
  const lesson = statuses.find(({ s }) => s.state === "in-progress");
  if (lesson) return { kind: "lesson", path: lesson.path, lesson: lesson.s.next! };
  const challenge = statuses.find(({ s }) => s.state === "challenge");
  if (challenge) return { kind: "challenge", path: challenge.path };
  return null;
}
