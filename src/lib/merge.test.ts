import { describe, expect, it } from "vitest";
import { mergeProgress } from "./merge";
import { emptyProgress, type Progress } from "./progress";

const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });

describe("mergeProgress", () => {
  it("keeps lessons completed on either device", () => {
    const m = mergeProgress(p({ completedLessons: { h1: true } }), p({ completedLessons: { a1: true } }), null);
    expect(m.completedLessons).toEqual({ h1: true, a1: true });
  });

  it("takes the higher XP on a first sync, so shared history isn't double counted", () => {
    expect(mergeProgress(p({ xp: 120 }), p({ xp: 80 }), null).xp).toBe(120);
  });

  it("adds XP earned on each device since the last sync", () => {
    const base = p({ xp: 100 });
    expect(mergeProgress(p({ xp: 130 }), p({ xp: 150 }), base).xp).toBe(180);
  });

  it("is a no-op when nothing changed", () => {
    const same = p({ xp: 40, completedLessons: { h1: true }, review: { x: { correctInARow: 1 } } });
    expect(mergeProgress(same, same, same)).toEqual(same);
  });

  describe("review pile", () => {
    it("keeps items missed on either device", () => {
      const m = mergeProgress(p({ review: { x: { correctInARow: 0 } } }), p({ review: { y: { correctInARow: 0 } } }), p({}));
      expect(Object.keys(m.review).sort()).toEqual(["x", "y"]);
    });

    it("drops an item cleared on one device instead of bringing it back", () => {
      const base = p({ review: { x: { correctInARow: 1 } } });
      const cleared = p({ review: {} });
      expect(mergeProgress(base, cleared, base).review).toEqual({});
      expect(mergeProgress(cleared, base, base).review).toEqual({});
    });

    it("keeps an item cleared on one device but missed again on the other", () => {
      const base = p({ review: { x: { correctInARow: 1 } } });
      const missedAgain = p({ review: { x: { correctInARow: 0 } } });
      expect(mergeProgress(missedAgain, p({}), base).review).toEqual({ x: { correctInARow: 0 } });
    });

    it("takes the side that changed, or the lower count if both did", () => {
      const base = p({ review: { x: { correctInARow: 0 } } });
      expect(mergeProgress(base, p({ review: { x: { correctInARow: 1 } } }), base).review.x).toEqual({ correctInARow: 1 });
      const m = mergeProgress(p({ review: { x: { correctInARow: 1 } } }), p({ review: { x: { correctInARow: 0 } } }), p({}));
      expect(m.review.x).toEqual({ correctInARow: 0 });
    });
  });

  describe("streak", () => {
    it("uses the device that was active most recently", () => {
      const m = mergeProgress(p({ streak: 5, lastActiveDay: "2026-09-20" }), p({ streak: 2, lastActiveDay: "2026-10-01" }), null);
      expect(m).toMatchObject({ streak: 2, lastActiveDay: "2026-10-01" });
    });

    it("joins streaks when one device was active the day before the other", () => {
      const m = mergeProgress(p({ streak: 4, lastActiveDay: "2026-09-30" }), p({ streak: 1, lastActiveDay: "2026-10-01" }), null);
      expect(m).toMatchObject({ streak: 5, lastActiveDay: "2026-10-01" });
    });

    it("joins across a month boundary and takes the max on the same day", () => {
      expect(mergeProgress(p({ streak: 3, lastActiveDay: "2026-09-30" }), p({ streak: 1, lastActiveDay: "2026-10-01" }), null).streak).toBe(4);
      expect(mergeProgress(p({ streak: 3, lastActiveDay: "2026-10-01" }), p({ streak: 6, lastActiveDay: "2026-10-01" }), null).streak).toBe(6);
    });

    it("handles a device with no activity yet", () => {
      expect(mergeProgress(p({}), p({ streak: 2, lastActiveDay: "2026-10-01" }), null)).toMatchObject({ streak: 2 });
    });
  });
});
