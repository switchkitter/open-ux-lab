import { MAX_FREEZES, dayKey, emptyStats, type LearningStats, type Progress, type ReviewItem } from "./progress";

/**
 * Three-way merge of progress from two devices.
 *
 * `base` is the last version both sides agreed on (the last successful sync), or null the first
 * time a device syncs. With a base we can tell "cleared on the other device" apart from "never
 * there", and add up XP earned on each side since the base.
 */
export function mergeProgress(local: Progress, remote: Progress, base: Progress | null): Progress {
  return {
    version: 1,
    completedLessons: { ...remote.completedLessons, ...local.completedLessons },
    xp: base ? Math.max(local.xp, remote.xp, local.xp + remote.xp - base.xp) : Math.max(local.xp, remote.xp),
    ...mergeStreak(local, remote),
    review: mergeReview(local.review, remote.review, base?.review ?? {}),
    seen: { ...remote.seen, ...local.seen },
    dayXp: mergeDayXp(local, remote, base),
    // A setting, not a count: this device's choice wins.
    goal: local.goal,
    goalMetDay: later(local.goalMetDay, remote.goalMetDay),
    // Freezes are earned and spent on both sides, so combine the changes since the base.
    freezes: Math.min(MAX_FREEZES, Math.max(0, base ? local.freezes + remote.freezes - base.freezes : Math.max(local.freezes, remote.freezes))),
    levelRewarded: Math.max(local.levelRewarded, remote.levelRewarded),
    practiceDay: later(local.practiceDay, remote.practiceDay),
    badges: mergeBadges(local.badges, remote.badges),
    stats: mergeStats(local.stats, remote.stats, base?.stats ?? null),
  };
}

/** Counts that only grow: add what each side gained since the base, like XP. */
function grown(l: number, r: number, b: number | null): number {
  return b === null ? Math.max(l, r) : Math.max(l, r, l + r - b);
}

function mergeStats(l: LearningStats, r: LearningStats, b: LearningStats | null): LearningStats {
  const keys = Object.keys(emptyStats()) as (keyof LearningStats)[];
  return Object.fromEntries(keys.map((k) => [k, grown(l[k], r[k], b ? b[k] : null)])) as LearningStats;
}

function mergeDayXp(l: Progress, r: Progress, b: Progress | null): Progress["dayXp"] {
  if (!l.dayXp || !r.dayXp) return l.dayXp ?? r.dayXp;
  if (l.dayXp.day !== r.dayXp.day) return l.dayXp.day > r.dayXp.day ? l.dayXp : r.dayXp;
  const baseXp = b?.dayXp?.day === l.dayXp.day ? b.dayXp.xp : null;
  return { day: l.dayXp.day, xp: grown(l.dayXp.xp, r.dayXp.xp, baseXp) };
}

/** Earned on either device; keep the earlier date. */
function mergeBadges(l: Record<string, string>, r: Record<string, string>): Record<string, string> {
  const merged = { ...r };
  for (const [id, d] of Object.entries(l)) if (!merged[id] || d < merged[id]) merged[id] = d;
  return merged;
}

function later(a: string | null, b: string | null): string | null {
  if (!a || !b) return a ?? b;
  return a > b ? a : b;
}

function mergeStreak(a: Progress, b: Progress): Pick<Progress, "streak" | "lastActiveDay"> {
  if (!a.lastActiveDay) return { streak: b.streak, lastActiveDay: b.lastActiveDay };
  if (!b.lastActiveDay) return { streak: a.streak, lastActiveDay: a.lastActiveDay };
  if (a.lastActiveDay === b.lastActiveDay) return { streak: Math.max(a.streak, b.streak), lastActiveDay: a.lastActiveDay };
  const [later, earlier] = a.lastActiveDay > b.lastActiveDay ? [a, b] : [b, a];
  // Active yesterday on one device and today on the other: the streaks join up.
  const joined = earlier.lastActiveDay === previousDay(later.lastActiveDay!) ? earlier.streak + 1 : 0;
  return { streak: Math.max(later.streak, joined), lastActiveDay: later.lastActiveDay };
}

function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

function mergeReview(
  local: Record<string, ReviewItem>,
  remote: Record<string, ReviewItem>,
  base: Record<string, ReviewItem>,
): Record<string, ReviewItem> {
  const merged: Record<string, ReviewItem> = {};
  for (const id of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const l = local[id];
    const r = remote[id];
    const b = base[id];
    if (l && r) {
      // Keep whichever side changed since the base; if both did, the more cautious one (lower step, sooner due).
      merged[id] = same(l, b) ? r : same(r, b) ? l : cautious(l, r);
    } else {
      const only = (l ?? r)!;
      // Present on one side only. If it was in the base and that side hasn't touched it,
      // the other side cleared it, so leave it out.
      if (!(b && same(only, b))) merged[id] = only;
    }
  }
  return merged;
}

function same(a: ReviewItem | undefined, b: ReviewItem | undefined): boolean {
  return !!a && !!b && a.step === b.step && a.due === b.due;
}

function cautious(a: ReviewItem, b: ReviewItem): ReviewItem {
  if (a.step !== b.step) return a.step < b.step ? a : b;
  return a.due <= b.due ? a : b;
}
