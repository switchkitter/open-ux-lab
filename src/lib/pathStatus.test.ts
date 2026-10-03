import { describe, expect, it } from "vitest";
import { paths } from "../content/paths";
import { emptyProgress } from "./progress";
import { nextStep, pathStatus } from "./pathStatus";

const heuristics = paths.find((p) => p.id === "heuristics")!;

describe("pathStatus", () => {
  it("starts at the first lesson", () => {
    const s = pathStatus(heuristics, emptyProgress());
    expect(s).toMatchObject({ done: 0, total: 10, state: "not-started" });
    expect(s.next?.id).toBe("h1");
    expect(s.minutes).toBeGreaterThan(0);
  });

  it("points at the first unfinished lesson, even with gaps", () => {
    const s = pathStatus(heuristics, { ...emptyProgress(), completedLessons: { h1: true, h3: true } });
    expect(s).toMatchObject({ done: 2, state: "in-progress" });
    expect(s.next?.id).toBe("h2");
  });

  it("waits for the challenge once every lesson is done, and is complete only after passing it", () => {
    const completedLessons = Object.fromEntries(heuristics.lessons.map((l) => [l.id, true as const]));
    expect(pathStatus(heuristics, { ...emptyProgress(), completedLessons })).toMatchObject({ done: 10, next: null, state: "challenge" });
    const challenges = { heuristics: { best: 6, passedDay: null } };
    expect(pathStatus(heuristics, { ...emptyProgress(), completedLessons, challenges }).state).toBe("challenge");
    const passed = { heuristics: { best: 9, passedDay: "2026-10-03" } };
    expect(pathStatus(heuristics, { ...emptyProgress(), completedLessons, challenges: passed }).state).toBe("complete");
  });
});

describe("nextStep", () => {
  const forms = paths.find((p) => p.id === "forms")!;
  const all = (p: typeof forms) => Object.fromEntries(p.lessons.map((l) => [l.id, true as const]));

  it("continues the first path in progress, then offers an unlocked challenge, else nothing", () => {
    expect(nextStep(paths, emptyProgress())).toBeNull();
    expect(nextStep(paths, { ...emptyProgress(), completedLessons: { f1: true } })).toMatchObject({ kind: "lesson", lesson: { id: "f2" } });
    expect(nextStep(paths, { ...emptyProgress(), completedLessons: all(forms) })).toMatchObject({ kind: "challenge", path: { id: "forms" } });
    const passed = { forms: { best: 9, passedDay: "2026-10-03" } };
    expect(nextStep(paths, { ...emptyProgress(), completedLessons: all(forms), challenges: passed })).toBeNull();
  });
});
