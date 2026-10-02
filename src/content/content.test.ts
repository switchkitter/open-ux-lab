import { describe, expect, it } from "vitest";
import { paths } from "./paths";

/** Guards against content mistakes that would break the app. */
describe("content integrity", () => {
  const lessons = paths.flatMap((p) => p.lessons);
  const exercises = lessons.flatMap((l) => l.exercises);

  it("has unique lesson ids", () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique exercise ids (they key the review pile)", () => {
    const ids = exercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("links every lesson to at least one https source", () => {
    for (const l of lessons) {
      expect(l.sources.length, l.id).toBeGreaterThan(0);
      for (const s of l.sources) expect(s.url.startsWith("https://"), s.url).toBe(true);
    }
  });

  it("has a valid correct answer for every exercise", () => {
    for (const e of exercises) {
      if (e.type === "choice") {
        expect(e.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(e.correct, e.id).toBeLessThan(e.options.length);
      } else {
        expect(["a", "b"]).toContain(e.correct);
      }
      expect(e.why.length, e.id).toBeGreaterThan(20);
    }
  });

  it("does not put scripts in mockup HTML", () => {
    for (const e of exercises) {
      if (e.type !== "compare") continue;
      for (const html of [e.a, e.b]) {
        expect(/<script|on\w+=/i.test(html), e.id).toBe(false);
      }
    }
  });
});
