import { describe, expect, it } from "vitest";
import {
  REVIEW_INTERVALS,
  XP,
  addDays,
  completeLesson,
  currentStreak,
  dayKey,
  dueReviewIds,
  emptyProgress,
  nextReview,
  normalizeReviewItem,
  recordActivity,
  recordLessonAnswer,
  recordReviewAnswer,
  reviewOutcome,
  setGoal,
  whenLabel,
  xpToday,
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

describe("answers and spaced review", () => {
  const day = (d: number) => new Date(2026, 9, d, 12);

  it("awards XP for a correct lesson answer", () => {
    expect(recordLessonAnswer(emptyProgress(), "x", true, day(1)).xp).toBe(XP.correctFirstTry);
  });

  it("sends wrong lesson answers to review, due straight away", () => {
    const p = recordLessonAnswer(emptyProgress(), "x", false, day(1));
    expect(p.review.x).toEqual({ step: 0, due: "2026-10-01" });
    expect(p.xp).toBe(0);
    expect(dueReviewIds(p, day(1))).toEqual(["x"]);
  });

  it("spaces correct reviews out by the intervals, then clears the item", () => {
    let p = recordLessonAnswer(emptyProgress(), "x", false, day(1));
    let today = 1;
    for (const interval of REVIEW_INTERVALS) {
      p = recordReviewAnswer(p, "x", true, day(today));
      expect(p.review.x.due).toBe(dayKey(day(today + interval)));
      expect(dueReviewIds(p, day(today + interval - 1))).toEqual([]);
      today += interval;
      expect(dueReviewIds(p, day(today))).toEqual(["x"]);
    }
    p = recordReviewAnswer(p, "x", true, day(today));
    expect(p.review.x).toBeUndefined();
    expect(p.xp).toBe(XP.reviewCorrect * (REVIEW_INTERVALS.length + 1));
  });

  it("starts an item over, due tomorrow, after a wrong review", () => {
    let p = recordLessonAnswer(emptyProgress(), "x", false, day(1));
    p = recordReviewAnswer(p, "x", true, day(1));
    p = recordReviewAnswer(p, "x", false, day(2));
    expect(p.review.x).toEqual({ step: 0, due: "2026-10-03" });
  });

  it("keeps overdue items due, soonest first", () => {
    const p = { ...emptyProgress(), review: { b: { step: 1, due: "2026-10-03" }, a: { step: 0, due: "2026-09-28" }, c: { step: 2, due: "2026-10-09" } } };
    expect(dueReviewIds(p, day(5))).toEqual(["a", "b"]);
    expect(nextReview(p, day(5))).toEqual({ day: "2026-10-09", count: 1 });
    expect(nextReview(emptyProgress(), day(5))).toBeNull();
  });

  it("describes what each review answer will do", () => {
    let p = recordLessonAnswer(emptyProgress(), "x", false, day(1));
    expect(reviewOutcome(p, "x", true)).toBe("Next review tomorrow.");
    expect(reviewOutcome(p, "x", false)).toBe("It'll come back tomorrow.");
    p = recordReviewAnswer(p, "x", true, day(1));
    expect(reviewOutcome(p, "x", true)).toBe("Next review in 3 days.");
    expect(whenLabel("2026-10-04", day(1))).toBe("in 3 days");
    expect(whenLabel("2026-10-02", day(1))).toBe("tomorrow");
  });

  it("adds days across month ends", () => {
    expect(addDays("2026-09-29", 3)).toBe("2026-10-02");
  });
});

describe("stored review items from older versions", () => {
  it("become due straight away at the same step", () => {
    expect(normalizeReviewItem({ correctInARow: 1 })).toEqual({ step: 1, due: "0000-00-00" });
    expect(normalizeReviewItem({ step: 2, due: "2026-10-05" })).toEqual({ step: 2, due: "2026-10-05" });
    expect(normalizeReviewItem(null)).toEqual({ step: 0, due: "0000-00-00" });
  });
});

describe("lesson completion", () => {
  it("awards completion XP only once", () => {
    let p = completeLesson(emptyProgress(), "h1", new Date(2026, 9, 1));
    p = completeLesson(p, "h1", new Date(2026, 9, 1));
    expect(p.xp).toBe(XP.lessonComplete);
    expect(p.completedLessons.h1).toBe(true);
  });
});

describe("daily goal", () => {
  it("counts XP per day and records each day the goal is reached once", () => {
    let p = { ...emptyProgress(), goal: 20 };
    p = recordLessonAnswer(p, "a", true, new Date(2026, 9, 1, 9));
    expect(xpToday(p, new Date(2026, 9, 1, 18))).toBe(10);
    expect(p.stats.goalDays).toBe(0);
    p = recordLessonAnswer(p, "b", true, new Date(2026, 9, 1, 10));
    p = recordLessonAnswer(p, "c", true, new Date(2026, 9, 1, 11));
    expect(p.stats.goalDays).toBe(1);
    expect(xpToday(p, new Date(2026, 9, 2))).toBe(0);
  });

  it("counts straight away when lowering the goal below today's XP", () => {
    let p = recordLessonAnswer(emptyProgress(), "a", true, new Date(2026, 9, 1));
    p = recordLessonAnswer(p, "b", true, new Date(2026, 9, 1));
    p = setGoal(p, 20, new Date(2026, 9, 1));
    expect(p.goalMetDay).toBe("2026-10-01");
  });
});

describe("streak freezes", () => {
  const active = (day: string, streak: number, freezes: number) => ({ ...emptyProgress(), lastActiveDay: day, streak, freezes });

  it("cover missed days, one freeze each", () => {
    expect(recordActivity(active("2026-09-29", 5, 2), new Date(2026, 9, 2))).toMatchObject({ streak: 6, freezes: 0 });
  });

  it("aren't spent when there aren't enough to cover the gap", () => {
    expect(recordActivity(active("2026-09-28", 5, 2), new Date(2026, 9, 2))).toMatchObject({ streak: 1, freezes: 2 });
  });

  it("keep the streak showing while they cover the gap", () => {
    expect(currentStreak(active("2026-09-30", 5, 1), new Date(2026, 9, 2))).toBe(5);
    expect(currentStreak(active("2026-09-30", 5, 0), new Date(2026, 9, 2))).toBe(0);
  });
});

describe("learning stats", () => {
  it("count spot-the-problem first tries, perfect lessons, review answers and cleared items", () => {
    const now = new Date(2026, 9, 1);
    let p = recordLessonAnswer(emptyProgress(), "s", true, now, "spot");
    p = completeLesson(p, "h1", now, true);
    p = { ...p, review: { r: { step: 3, due: "2026-10-01" } } };
    p = recordReviewAnswer(p, "r", true, now);
    expect(p.stats).toMatchObject({ spotFirstTry: 1, perfectLessons: 1, reviewCorrect: 1, cleared: 1 });
  });
});
