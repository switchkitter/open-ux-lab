import { DAILY_GOALS, DEFAULT_GOAL, MAX_FREEZES, emptyProgress, emptyStats, normalizeReviewItem, type LearningStats, type Progress, type ReviewItem } from "./progress";

/**
 * Where progress lives. Today it's the browser; later this can be swapped
 * for a server-backed store (e.g. Supabase) without touching the UI.
 */
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
}

const KEY = "open-ux-lab:progress";

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const count = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0);
const day = (v: unknown) => (typeof v === "string" && DAY.test(v) ? v : null);
const flags = (o: unknown) => Object.fromEntries(Object.entries(isRecord(o) ? o : {}).filter(([, v]) => v === true)) as Record<string, true>;

/**
 * Brings progress from storage, the server or a backup file to the current shape: fills in fields added
 * since it was saved (older progress has no goal, badges or stats) and drops values with the wrong type.
 */
export function normalizeProgress(raw: unknown): Progress {
  if (!isRecord(raw)) return emptyProgress();
  const base = emptyProgress();
  const review: Record<string, ReviewItem> = {};
  for (const [id, item] of Object.entries(isRecord(raw.review) ? raw.review : {})) review[id] = normalizeReviewItem(item);
  const lastActiveDay = day(raw.lastActiveDay);
  const dayXp = isRecord(raw.dayXp) && day(raw.dayXp.day) ? { day: day(raw.dayXp.day)!, xp: count(raw.dayXp.xp) } : null;
  const rawStats = isRecord(raw.stats) ? raw.stats : {};
  const stats = Object.fromEntries(Object.keys(emptyStats()).map((k) => [k, count(rawStats[k])])) as LearningStats;
  const badges = Object.fromEntries(Object.entries(isRecord(raw.badges) ? raw.badges : {}).filter(([, v]) => day(v))) as Record<string, string>;
  return {
    ...base,
    completedLessons: flags(raw.completedLessons),
    xp: count(raw.xp),
    streak: lastActiveDay ? count(raw.streak) : 0,
    lastActiveDay,
    review,
    seen: flags(raw.seen),
    dayXp,
    goal: DAILY_GOALS.some((g) => g.xp === raw.goal) ? (raw.goal as number) : DEFAULT_GOAL,
    goalMetDay: day(raw.goalMetDay),
    freezes: Math.min(count(raw.freezes), MAX_FREEZES),
    levelRewarded: Math.max(1, count(raw.levelRewarded)),
    badges,
    stats,
  };
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
