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
