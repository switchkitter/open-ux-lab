import { manifest } from "./manifest";
import type { LessonMeta, PathMeta } from "./types";

/**
 * Every path and lesson, without lesson text or exercises. This is what the app imports; full
 * lessons load per path from content/load.ts, so the first visit doesn't download all of them.
 * Never import content/paths from app code (a test checks): it would put every lesson back in
 * the main download.
 */
export const paths: PathMeta[] = manifest;

/** Paths shown as "coming" on the home screen. */
export const plannedPaths: Pick<PathMeta, "id" | "title" | "description">[] = [];

export const totalLessons = paths.reduce((n, p) => n + p.lessons.length, 0);

export function findLesson(lessonId: string): { path: PathMeta; lesson: LessonMeta } | undefined {
  for (const path of paths) {
    const lesson = path.lessons.find((l) => l.id === lessonId);
    if (lesson) return { path, lesson };
  }
  return undefined;
}

/** The path an exercise belongs to, so it can be loaded. */
export function pathOfExercise(exerciseId: string): PathMeta | undefined {
  return paths.find((p) => p.lessons.some((l) => l.exercises.some((e) => e.id === exerciseId)));
}
