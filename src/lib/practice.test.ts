import { describe, expect, it } from "vitest";
import type { LearningPath } from "../content/types";
import { mergeProgress } from "./merge";
import { practiceSet, practiceStatus } from "./practice";
import { completePractice, emptyProgress, recordPracticeAnswer, XP, type Progress } from "./progress";

const types = ["compare", "choice", "spot", "sort"] as const;
const lesson = (id: string) => ({ id, exercises: types.map((t) => ({ id: `${id}-${t}`, type: t })) });
const testPaths = [
  { id: "x", lessons: ["x1", "x2", "x3"].map(lesson) },
  { id: "y", lessons: ["y1", "y2"].map(lesson) },
] as unknown as LearningPath[];
const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });
const done = (...ids: string[]) => p({ completedLessons: Object.fromEntries(ids.map((i) => [i, true as const])) });
const day = (d: number) => new Date(2026, 9, d, 9);

describe("daily practice", () => {
  it("picks five exercises from finished lessons only", () => {
    const set = practiceSet(done("x1", "y2"), day(2), testPaths);
    expect(set).toHaveLength(5);
    for (const item of set) expect(["x1", "y2"]).toContain(item.lesson.id);
    expect(new Set(set.map((i) => i.exercise.id)).size).toBe(5);
  });

  it("isn't available until there are enough exercises to practice", () => {
    expect(practiceSet(done("x1"), day(2), testPaths)).toEqual([]);
    expect(practiceStatus(done("x1"), day(2), testPaths)).toBe("unavailable");
  });

  it("keeps the same set all day and changes it the next day", () => {
    const progress = done("x1", "x2", "x3", "y1", "y2");
    const ids = (d: Date) => practiceSet(progress, d, testPaths).map((i) => i.exercise.id);
    expect(ids(new Date(2026, 9, 2, 8))).toEqual(ids(new Date(2026, 9, 2, 22)));
    expect(ids(day(2))).not.toEqual(ids(day(3)));
  });

  it("mixes exercise types and lessons when it can", () => {
    const set = practiceSet(done("x1", "x2", "x3", "y1", "y2"), day(2), testPaths);
    const perType = set.reduce<Record<string, number>>((n, i) => ({ ...n, [i.exercise.type]: (n[i.exercise.type] ?? 0) + 1 }), {});
    for (const n of Object.values(perType)) expect(n).toBeLessThanOrEqual(2);
    expect(new Set(set.map((i) => i.lesson.id)).size).toBe(5);
  });

  it("earns XP for right answers, sends misses to review, and counts as done once finished", () => {
    let progress = recordPracticeAnswer(done("x1", "x2"), "x1-sort", true, day(2));
    progress = recordPracticeAnswer(progress, "x2-spot", false, day(2));
    expect(progress.xp).toBe(XP.practiceCorrect);
    expect(progress.review["x2-spot"]).toEqual({ step: 0, due: "2026-10-02" });
    progress = completePractice(progress, day(2));
    expect(practiceStatus(progress, day(2), testPaths)).toBe("done");
    expect(practiceStatus(progress, day(3), testPaths)).toBe("ready");
    expect(progress.streak).toBe(1);
  });

  it("stays done when another device syncs", () => {
    expect(mergeProgress(p({ practiceDay: "2026-10-01" }), p({ practiceDay: "2026-10-02" }), null).practiceDay).toBe("2026-10-02");
  });
});
