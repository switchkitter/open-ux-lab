import type { Exercise, LearningPath, Lesson } from "../types";
import { accessibilityPath } from "./accessibility";
import { formsPath } from "./forms";
import { heuristicsPath } from "./heuristics";

export const paths: LearningPath[] = [heuristicsPath, accessibilityPath, formsPath];

/** Paths shown as "coming" on the home screen. Move one into `paths` when its lessons exist. */
export const plannedPaths: Pick<LearningPath, "id" | "title" | "description">[] = [
  {
    id: "laws-of-ux",
    title: "Laws of UX",
    description: "Fitts's Law, Hick's Law, Miller's Law and other psychology principles.",
  },
];

export function findLesson(lessonId: string): { path: LearningPath; lesson: Lesson } | undefined {
  for (const path of paths) {
    const lesson = path.lessons.find((l) => l.id === lessonId);
    if (lesson) return { path, lesson };
  }
  return undefined;
}

export function findExercise(exerciseId: string): { lesson: Lesson; exercise: Exercise } | undefined {
  for (const path of paths) {
    for (const lesson of path.lessons) {
      const exercise = lesson.exercises.find((e) => e.id === exerciseId);
      if (exercise) return { lesson, exercise };
    }
  }
  return undefined;
}
