import { describe, expect, it } from "vitest";
import type { LearningPath } from "../content/types";
import { mergeProgress } from "./merge";
import { challengeSet, practiceSet, practiceStatus } from "./practice";
import { CHALLENGE_PASS, CHALLENGE_SIZE, challengePassed, completeChallenge, completePractice, emptyProgress, recordChallengeAnswer, recordPracticeAnswer, XP, type Progress } from "./progress";

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

describe("path challenge", () => {
  const bigPath = { id: "z", lessons: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"].map(lesson) } as unknown as LearningPath;

  it("asks ten questions from across the whole path, no more than two per lesson", () => {
    const set = challengeSet(bigPath);
    expect(set).toHaveLength(CHALLENGE_SIZE);
    expect(new Set(set.map((i) => i.exercise.id)).size).toBe(CHALLENGE_SIZE);
    const perLesson = set.reduce<Record<string, number>>((n, i) => ({ ...n, [i.lesson.id]: (n[i.lesson.id] ?? 0) + 1 }), {});
    for (const n of Object.values(perLesson)) expect(n).toBeLessThanOrEqual(2);
  });

  it("keeps the best score, records the first pass, and gives the pass bonus once", () => {
    let progress = completeChallenge(emptyProgress(), "z", CHALLENGE_PASS - 1, day(2));
    expect(progress.challenges.z).toEqual({ best: CHALLENGE_PASS - 1, passedDay: null });
    expect(challengePassed(progress, "z")).toBe(false);
    progress = completeChallenge(progress, "z", CHALLENGE_PASS, day(3));
    expect(progress.challenges.z).toEqual({ best: CHALLENGE_PASS, passedDay: "2026-10-03" });
    expect(progress.xp).toBe(XP.challengePass);
    progress = completeChallenge(progress, "z", CHALLENGE_SIZE, day(4));
    expect(progress.challenges.z).toEqual({ best: CHALLENGE_SIZE, passedDay: "2026-10-03" });
    expect(progress.xp).toBe(XP.challengePass);
    progress = completeChallenge(progress, "z", 3, day(5));
    expect(progress.challenges.z.best).toBe(CHALLENGE_SIZE);
  });

  it("sends missed questions to the review pile", () => {
    const progress = recordChallengeAnswer(emptyProgress(), "z1-spot", false, day(2));
    expect(progress.review["z1-spot"]).toEqual({ step: 0, due: "2026-10-02" });
  });

  it("merges results from two devices: best score and earliest pass", () => {
    const a = p({ challenges: { z: { best: 7, passedDay: null }, y: { best: 9, passedDay: "2026-10-05" } } });
    const b = p({ challenges: { z: { best: 9, passedDay: "2026-10-04" }, y: { best: 8, passedDay: "2026-10-03" } } });
    expect(mergeProgress(a, b, null).challenges).toEqual({ z: { best: 9, passedDay: "2026-10-04" }, y: { best: 9, passedDay: "2026-10-03" } });
  });
});
