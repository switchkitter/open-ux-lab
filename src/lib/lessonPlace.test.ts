import { describe, expect, it } from "vitest";
import { PLACE_MAX_AGE_MS, prunePlaces } from "./lessonPlace";

describe("saved places in lessons", () => {
  const now = Date.UTC(2026, 9, 2);

  it("keep recent places past the first exercise", () => {
    const raw = { w1: { step: 3, firstTry: 2, at: now - 1000 } };
    expect(prunePlaces(raw, now)).toEqual(raw);
  });

  it("forget places older than a week, before the second exercise, or with the wrong shape", () => {
    const raw = {
      old: { step: 2, firstTry: 1, at: now - PLACE_MAX_AGE_MS - 1 },
      start: { step: 1, firstTry: 0, at: now },
      broken: { step: "2" },
      empty: null,
    };
    expect(prunePlaces(raw, now)).toEqual({});
    expect(prunePlaces("nonsense", now)).toEqual({});
  });
});
