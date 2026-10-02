import { describe, expect, it } from "vitest";
import {
  REVIEW_CLEAR_AFTER,
  XP,
  completeLesson,
  dayKey,
  emptyProgress,
  recordActivity,
  recordLessonAnswer,
  recordReviewAnswer,
} from "./progress";

describe("streaks", () => {
  it("starts at 1 on first activity", () => {
    const p = recordActivity(emptyProgress(), new Date(2026, 9, 1));
    expect(p.streak).toBe(1);
    expect(p.lastActiveDay).toBe("2026-10-01");
  });

  it("does not double count the same day", () => {
    const d = new Date(2026, 9, 1, 9);
    const p = recordActivity(recordActivity(emptyProgress(), d), new Date(2026, 9, 1, 21));
    expect(p.streak).toBe(1);
  });

  it("extends across consecutive days, including month boundaries", () => {
    let p = recordActivity(emptyProgress(), new Date(2026, 8, 30));
    p = recordActivity(p, new Date(2026, 9, 1));
    expect(p.streak).toBe(2);
  });

  it("resets after a missed day", () => {
    let p = recordActivity(emptyProgress(), new Date(2026, 9, 1));
    p = recordActivity(p, new Date(2026, 9, 3));
    expect(p.streak).toBe(1);
  });

  it("formats day keys with zero padding", () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("answers and review", () => {
  it("awards XP for a correct lesson answer", () => {
    expect(recordLessonAnswer(emptyProgress(), "x", true).xp).toBe(XP.correctFirstTry);
  });

  it("sends wrong lesson answers to review", () => {
    const p = recordLessonAnswer(emptyProgress(), "x", false);
    expect(p.review.x).toEqual({ correctInARow: 0 });
    expect(p.xp).toBe(0);
  });

  it("clears a review item after enough correct answers in a row", () => {
    let p = recordLessonAnswer(emptyProgress(), "x", false);
    for (let i = 0; i < REVIEW_CLEAR_AFTER - 1; i++) p = recordReviewAnswer(p, "x", true);
    expect(p.review.x).toBeDefined();
    p = recordReviewAnswer(p, "x", true);
    expect(p.review.x).toBeUndefined();
  });

  it("resets the review count on a wrong answer", () => {
    let p = recordLessonAnswer(emptyProgress(), "x", false);
    p = recordReviewAnswer(p, "x", true);
    p = recordReviewAnswer(p, "x", false);
    expect(p.review.x).toEqual({ correctInARow: 0 });
  });
});

describe("lesson completion", () => {
  it("awards completion XP only once", () => {
    let p = completeLesson(emptyProgress(), "h1");
    p = completeLesson(p, "h1");
    expect(p.xp).toBe(XP.lessonComplete);
    expect(p.completedLessons.h1).toBe(true);
  });
});
