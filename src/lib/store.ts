import { emptyProgress, type Progress } from "./progress";

/**
 * Where progress lives. Today it's the browser; later this can be swapped
 * for a server-backed store (e.g. Supabase) without touching the UI.
 */
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
}

const KEY = "open-ux-lab:progress";

export const localProgressStore: ProgressStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyProgress();
      const parsed = JSON.parse(raw) as Partial<Progress>;
      return { ...emptyProgress(), ...parsed, version: 1 };
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
