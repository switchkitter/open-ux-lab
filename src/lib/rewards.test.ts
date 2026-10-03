import { describe, expect, it } from "vitest";
import type { LearningPath } from "../content/types";
import { completeLesson, emptyProgress, recordActivity, recordLessonAnswer, type Progress } from "./progress";
import { BADGES, LEVELS, levelFor, rewardsBetween, settle } from "./rewards";

const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });
const day = (d: number) => new Date(2026, 9, d, 12);
const twoPaths = [
  { id: "x", lessons: [{ id: "x1" }, { id: "x2" }] },
  { id: "y", lessons: [{ id: "y1" }] },
] as unknown as LearningPath[];

describe("levels", () => {
  it("climb with XP and say how far the next one is", () => {
    expect(levelFor(0)).toMatchObject({ level: 1, title: "Intern", xpIntoLevel: 0, xpForLevel: 100 });
    expect(levelFor(260)).toMatchObject({ level: 3, title: "Designer", xpIntoLevel: 10, xpForLevel: 250 });
    expect(levelFor(99_999)).toMatchObject({ level: LEVELS.length, next: null });
  });
});

describe("settling rewards", () => {
  it("gives a streak freeze for each new level, holding at most two", () => {
    expect(settle(p({ xp: 120 }), day(2), twoPaths)).toMatchObject({ levelRewarded: 2, freezes: 1 });
    expect(settle(p({ xp: 600 }), day(2), twoPaths)).toMatchObject({ levelRewarded: 4, freezes: 2 });
  });

  it("awards each achievement once, dated the day it was earned", () => {
    const first = settle(p({ completedLessons: { x1: true } }), day(2), twoPaths);
    expect(first.badges["first-lesson"]).toBe("2026-10-02");
    const again = settle(first, day(5), twoPaths);
    expect(again.badges["first-lesson"]).toBe("2026-10-02");
    expect(settle(again, day(5), twoPaths)).toBe(again);
  });

  it("knows about finished and started paths", () => {
    const b = settle(p({ completedLessons: { x1: true, x2: true } }), day(2), twoPaths).badges;
    expect(b["path-done"]).toBeDefined();
    expect(b.explorer).toBeUndefined();
    expect(settle(p({ completedLessons: { x1: true, y1: true } }), day(2), twoPaths).badges.explorer).toBeDefined();
  });

  it("has unique, stable badge IDs", () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
});

describe("rewards between two moments", () => {
  it("report a level up, the freeze it earned, the daily goal and new badges", () => {
    const before = settle(p({ xp: 80, goal: 20 }), day(2), twoPaths);
    let after = recordLessonAnswer(before, "x1-e1", true, day(2));
    after = settle(recordActivity(completeLesson(after, "x1", day(2)), day(2)), day(2), twoPaths);
    const r = rewardsBetween(before, after, day(2));
    expect(r.levelUp?.title).toBe("Junior designer");
    expect(r.freezesEarned).toBe(1);
    expect(r.freezesUsed).toBe(0);
    expect(r.goalReached).toBe(true);
    expect(r.badges.map((b) => b.id)).toContain("first-lesson");
  });

  it("report a streak freeze used to cover a missed day", () => {
    const before = p({ streak: 4, lastActiveDay: "2026-10-01", freezes: 1, levelRewarded: 2, xp: 120 });
    const after = recordActivity(before, day(3));
    expect(after.streak).toBe(5);
    expect(rewardsBetween(before, after, day(3))).toMatchObject({ freezesUsed: 1, freezesEarned: 0 });
  });
});
