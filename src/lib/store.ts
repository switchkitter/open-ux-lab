import { emptyProgress, normalizeReviewItem, type Progress, type ReviewItem } from "./progress";

/**
 * Where progress lives. Today it's the browser; later this can be swapped
 * for a server-backed store (e.g. Supabase) without touching the UI.
 */
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
}

const KEY = "open-ux-lab:progress";

/** Fills in missing fields so progress from storage or the server always has the current shape. */
export function normalizeProgress(raw: unknown): Progress {
  if (!raw || typeof raw !== "object") return emptyProgress();
  const p = { ...emptyProgress(), ...(raw as Partial<Progress>), version: 1 as const };
  const review: Record<string, ReviewItem> = {};
  for (const [id, item] of Object.entries(p.review ?? {})) review[id] = normalizeReviewItem(item);
  const seen = p.seen && typeof p.seen === "object" ? p.seen : {};
  return { ...p, review, seen };
}

export const localProgressStore: ProgressStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? normalizeProgress(JSON.parse(raw)) : emptyProgress();
    } catch {
      return emptyProgress();
    }
  },
  save(progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      // Storage can be unavailable (private mode, quota). Progress stays in memory.
    }
  },
};
