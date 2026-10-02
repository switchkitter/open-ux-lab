import { mergeProgress } from "./merge";
import type { Progress } from "./progress";

/** Server copy of one learner's progress. */
export interface RemoteProgress {
  load(): Promise<Progress | null>;
  save(progress: Progress): Promise<void>;
}

/** The last version this device and the server agreed on; the base for three-way merges. */
export interface SyncBase {
  load(): Progress | null;
  save(progress: Progress): void;
}

/**
 * One sync round: pull, merge with local changes, push the result if the server doesn't have it yet.
 * Returns the merged progress, which the caller should adopt locally.
 */
export async function syncProgress(local: Progress, remote: RemoteProgress, base: SyncBase): Promise<Progress> {
  const server = await remote.load();
  const merged = server ? mergeProgress(local, server, base.load()) : local;
  if (!server || !sameProgress(merged, server)) await remote.save(merged);
  base.save(merged);
  return merged;
}

export function sameProgress(a: Progress, b: Progress): boolean {
  return canonical(a) === canonical(b);
}

/** JSON with sorted keys, so key order doesn't make equal progress look different. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  );
}
