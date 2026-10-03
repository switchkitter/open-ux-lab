import { useEffect, useState } from "react";
import { pathOfExercise } from "./catalog";
import type { Exercise, LearningPath, Lesson } from "./types";

/**
 * Full lessons, loaded one path at a time when they're needed. Each path is its own file in the
 * build, cached by the service worker after the first load, so lessons also work offline.
 */
const loaders: Record<string, () => Promise<LearningPath>> = {
  heuristics: () => import("./paths/heuristics").then((m) => m.heuristicsPath),
  accessibility: () => import("./paths/accessibility").then((m) => m.accessibilityPath),
  forms: () => import("./paths/forms").then((m) => m.formsPath),
  "laws-of-ux": () => import("./paths/laws-of-ux").then((m) => m.lawsOfUxPath),
  research: () => import("./paths/research").then((m) => m.researchPath),
  "visual-design": () => import("./paths/visual-design").then((m) => m.visualDesignPath),
  "ux-writing": () => import("./paths/ux-writing").then((m) => m.uxWritingPath),
};

export const loadablePathIds = Object.keys(loaders);

const pending = new Map<string, Promise<LearningPath>>();
const loaded = new Map<string, LearningPath>();

export function loadPath(id: string): Promise<LearningPath> {
  const load = loaders[id];
  if (!load) return Promise.reject(new Error(`Unknown path: ${id}`));
  let promise = pending.get(id);
  if (!promise) {
    promise = load().then((path) => {
      loaded.set(id, path);
      return path;
    });
    pending.set(id, promise);
  }
  return promise;
}

export type Loaded<T> = { state: "loading" } | { state: "ready"; value: T } | { state: "error"; retry: () => void };

/** Loads some paths and derives a value from them. Ready straight away if they're already loaded. */
function usePaths<T>(ids: string[], pick: (paths: LearningPath[]) => T): Loaded<T> {
  const key = ids.join(",");
  const now = () => (ids.every((id) => loaded.has(id)) ? ({ state: "ready", value: pick(ids.map((id) => loaded.get(id)!)) } as const) : null);
  const [result, setResult] = useState<Loaded<T>>(() => now() ?? { state: "loading" });

  useEffect(() => {
    const ready = now();
    if (ready) {
      setResult(ready);
      return;
    }
    let cancelled = false;
    setResult({ state: "loading" });
    Promise.all(ids.map(loadPath)).then(
      (paths) => !cancelled && setResult({ state: "ready", value: pick(paths) }),
      // Browsers remember a failed module load for the life of the page, so retrying means reloading it.
      // Progress is saved in the browser, so nothing is lost.
      () => !cancelled && setResult({ state: "error", retry: () => window.location.reload() }),
    );
    return () => {
      cancelled = true;
    };
    // `key` stands for `ids`; `pick` is expected to be stable for the same ids.
  }, [key]);

  return result;
}

/** One full lesson. */
export function useLesson(pathId: string, lessonId: string): Loaded<Lesson | undefined> {
  return usePaths([pathId], ([path]) => path.lessons.find((l) => l.id === lessonId));
}

/** Full exercises by ID, in the order given, with the lesson each comes from. Unknown IDs are skipped. */
export function useExercises(exerciseIds: string[]): Loaded<{ lesson: Lesson; exercise: Exercise }[]> {
  const pathIds = [...new Set(exerciseIds.map((id) => pathOfExercise(id)?.id).filter((id): id is string => Boolean(id)))];
  return usePaths(pathIds, (paths) => {
    const byId = new Map<string, { lesson: Lesson; exercise: Exercise }>();
    for (const path of paths) for (const lesson of path.lessons) for (const exercise of lesson.exercises) byId.set(exercise.id, { lesson, exercise });
    return exerciseIds.map((id) => byId.get(id)).filter((x): x is { lesson: Lesson; exercise: Exercise } => Boolean(x));
  });
}

/** Every path, fully loaded (for the credits page). */
export function useAllPaths(): Loaded<LearningPath[]> {
  return usePaths(loadablePathIds, (paths) => paths);
}
