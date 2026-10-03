import { mergeProgress } from "./merge";
import { dayKey, type Progress } from "./progress";
import { normalizeProgress } from "./store";

/**
 * Progress backup files: a learner can save their progress as a JSON file and load it on another
 * device or browser, without an account. Pure functions; the account page does the file handling.
 */

const APP = "open-ux-lab";
const KIND = "progress";

type BackupFile = { app: typeof APP; kind: typeof KIND; exportedAt: string; progress: Progress };

export function backupFileName(now: Date): string {
  return `open-ux-lab-progress-${dayKey(now)}.json`;
}

export function makeBackup(progress: Progress, now: Date): string {
  const file: BackupFile = { app: APP, kind: KIND, exportedAt: now.toISOString(), progress };
  return JSON.stringify(file, null, 2);
}

export type ReadResult = { ok: true; progress: Progress } | { ok: false; error: string };

/** Reads a backup file's text. Error messages are written for the learner. */
export function readBackup(text: string): ReadResult {
  const notOurs = "That file isn't an Open UX Lab progress file. Choose a file you saved with “Save progress to a file”.";
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: notOurs };
  }
  if (!isRecord(data) || data.app !== APP || data.kind !== KIND || !isRecord(data.progress)) return { ok: false, error: notOurs };
  // normalizeProgress also drops hand-edited values with the wrong shape.
  return { ok: true, progress: normalizeProgress(data.progress) };
}

/** Combines a loaded backup with this browser's progress, keeping everything from both. */
export function importBackup(current: Progress, imported: Progress): Progress {
  return mergeProgress(current, imported, null);
}

/** "8 lessons, 240 XP, 3 in your review pile" */
export function describeProgress(p: Progress): string {
  const lessons = Object.keys(p.completedLessons).length;
  const review = Object.keys(p.review).length;
  return `${lessons} ${lessons === 1 ? "lesson" : "lessons"}, ${p.xp} XP, ${review} in your review pile`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
