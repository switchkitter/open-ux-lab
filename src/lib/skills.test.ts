import { describe, expect, it } from "vitest";
import type { LearningPath, Lesson } from "../content/types";
import { emptyProgress, type Progress } from "./progress";
import { backfillSeen, skillMap } from "./skills";

const lesson = (id: string, skills: Lesson["skills"], exerciseIds: string[], spot: string[] = []): Lesson => ({
  id, code: id.toUpperCase(), title: id, subtitle: "", minutes: 3, skills, body: [], practice: [], fieldExercise: "", sources: [],
  exercises: [
    ...exerciseIds.map((e) => ({ id: e, type: "choice" as const, question: "", options: ["a", "b"], correct: 0, why: "" })),
    ...spot.map((e) => ({ id: e, type: "spot" as const, question: "", parts: [], correct: "x", why: "" })),
  ],
});

const testPaths: LearningPath[] = [
  {
    id: "t", title: "Test", description: "", status: "live",
    lessons: [lesson("x1", ["forms"], ["x1-a", "x1-b"]), lesson("x2", ["forms", "layout"], ["x2-a", "x2-b"], ["x2-spot"])],
  },
];
const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });
const skill = (map: ReturnType<typeof skillMap>, id: string) => map.find((s) => s.id === id)!;

describe("skillMap", () => {
  it("starts every skill at Not started, suggesting the first lesson", () => {
    const forms = skill(skillMap(emptyProgress(), testPaths), "forms");
    expect(forms).toMatchObject({ total: 5, solid: 0, inReview: 0, level: "Not started" });
    expect(forms.next?.id).toBe("x1");
  });

  it("counts answered exercises as solid unless they're in review", () => {
    const progress = p({
      completedLessons: { x1: true },
      seen: { "x1-a": true, "x1-b": true },
      review: { "x1-b": { step: 0, due: "2026-10-01" } },
    });
    const forms = skill(skillMap(progress, testPaths), "forms");
    expect(forms).toMatchObject({ solid: 1, inReview: 1, level: "Getting started" });
    expect(forms.next?.id).toBe("x2");
  });

  it("reaches Strong at 80% solid and then points at lessons that still need work", () => {
    const seen = { "x1-a": true, "x1-b": true, "x2-a": true, "x2-b": true } as const;
    const forms = skill(skillMap(p({ completedLessons: { x1: true, x2: true }, seen }), testPaths), "forms");
    expect(forms).toMatchObject({ solid: 4, level: "Strong" });
    expect(forms.next?.id).toBe("x2"); // the unseen spot exercise
  });

  it("only counts lessons tagged with the skill", () => {
    expect(skill(skillMap(emptyProgress(), testPaths), "layout").total).toBe(3);
    expect(skill(skillMap(emptyProgress(), testPaths), "language")).toMatchObject({ total: 0, next: null });
  });

  it("suggests lessons from the path that covers the skill most", () => {
    const twoPaths: LearningPath[] = [
      { ...testPaths[0], id: "other", lessons: [lesson("o1", ["forms"], ["o1-a"])] },
      { ...testPaths[0], id: "home" },
    ];
    expect(skill(skillMap(emptyProgress(), twoPaths), "forms").next?.id).toBe("x1");
  });
});

describe("backfillSeen", () => {
  it("marks exercises in completed lessons as seen, except spot exercises added later", () => {
    const out = backfillSeen(p({ completedLessons: { x2: true } }), testPaths);
    expect(out.seen).toEqual({ "x2-a": true, "x2-b": true });
  });

  it("leaves progress alone once anything has been recorded", () => {
    const already = p({ completedLessons: { x2: true }, seen: { "x1-a": true } });
    expect(backfillSeen(already, testPaths)).toBe(already);
    const fresh = emptyProgress();
    expect(backfillSeen(fresh, testPaths)).toBe(fresh);
  });
});
