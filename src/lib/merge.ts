import { dayKey, type Progress, type ReviewItem } from "./progress";

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
  };
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
      // Keep whichever side changed since the base; if both did, the more cautious count.
      merged[id] = same(l, b) ? r : same(r, b) ? l : { correctInARow: Math.min(l.correctInARow, r.correctInARow) };
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
  return !!a && !!b && a.correctInARow === b.correctInARow;
}
