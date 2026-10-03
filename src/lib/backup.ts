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
  const raw = isRecord(data.progress.review) ? data.progress : { ...data.progress, review: {} };
  return { ok: true, progress: clean(normalizeProgress(raw)) };
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

/** A file can be edited by hand, so keep only values with the right shape. */
function clean(p: Progress): Progress {
  const flags = (o: unknown) => Object.fromEntries(Object.entries(isRecord(o) ? o : {}).filter(([, v]) => v === true)) as Record<string, true>;
  const count = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0);
  const day = typeof p.lastActiveDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.lastActiveDay) ? p.lastActiveDay : null;
  return {
    version: 1,
    completedLessons: flags(p.completedLessons),
    xp: count(p.xp),
    streak: day ? count(p.streak) : 0,
    lastActiveDay: day,
    review: p.review,
    seen: flags(p.seen),
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
