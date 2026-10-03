import { paths } from "../content/catalog";
import { skills, type SkillId } from "../content/skills";
import type { LessonMeta, PathMeta } from "../content/types";
import type { Progress } from "./progress";

export type SkillProgress = {
  id: SkillId;
  name: string;
  description: string;
  /** Exercises in lessons that build this skill. */
  total: number;
  /** Answered and not waiting in the review pile. */
  solid: number;
  /** Waiting in the review pile. */
  inReview: number;
  level: "Not started" | "Getting started" | "Developing" | "Strong";
  /** Best lesson to do next for this skill: the first one with exercises not yet solid. */
  next: LessonMeta | null;
};

/** How far along each skill is, based on which of its lessons' exercises are solid. */
export function skillMap(progress: Progress, learningPaths: PathMeta[] = paths): SkillProgress[] {
  const isSolid = (id: string) => progress.seen[id] && !progress.review[id];
  const builds = (l: LessonMeta, id: SkillId) => (l.skills as readonly string[]).includes(id);

  return skills.map((skill) => {
    // Lessons for this skill, starting with the path that covers it most (the Forms path for Forms),
    // so the suggested next lesson comes from the skill's home path.
    const byPath = learningPaths
      .map((p) => p.lessons.filter((l) => builds(l, skill.id)))
      .sort((a, b) => b.length - a.length);
    const skillLessons = byPath.flat();
    const ids = skillLessons.flatMap((l) => l.exercises.map((e) => e.id));
    const solid = ids.filter(isSolid).length;
    const inReview = ids.filter((id) => progress.review[id]).length;
    const share = ids.length ? solid / ids.length : 0;
    const level = solid === 0 && inReview === 0 ? "Not started" : share < 0.4 ? "Getting started" : share < 0.8 ? "Developing" : "Strong";
    // Prefer a lesson not yet completed; otherwise one whose exercises still need work.
    const next =
      skillLessons.find((l) => !progress.completedLessons[l.id]) ??
      skillLessons.find((l) => l.exercises.some((e) => !isSolid(e.id))) ??
      null;
    return { id: skill.id, name: skill.name, description: skill.description, total: ids.length, solid, inReview, level, next };
  });
}

/**
 * Progress saved before the skill map existed has no record of answered exercises. Treat every
 * exercise in a completed lesson as answered, except spot-the-problem exercises, which were added
 * to lessons later and so may not have been seen. Runs only when nothing has been recorded yet.
 */
export function backfillSeen(progress: Progress, learningPaths: PathMeta[] = paths): Progress {
  if (Object.keys(progress.seen).length || !Object.keys(progress.completedLessons).length) return progress;
  const seen: Record<string, true> = {};
  for (const lesson of learningPaths.flatMap((p) => p.lessons)) {
    if (!progress.completedLessons[lesson.id]) continue;
    for (const e of lesson.exercises) if (e.type !== "spot") seen[e.id] = true;
  }
  for (const id of Object.keys(progress.review)) seen[id] = true;
  return { ...progress, seen };
}
