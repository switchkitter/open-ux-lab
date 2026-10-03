import { describe, expect, it } from "vitest";
import { backupFileName, describeProgress, importBackup, makeBackup, readBackup } from "./backup";
import { emptyProgress, type Progress } from "./progress";

const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });
const now = new Date(2026, 9, 2, 14, 30);

describe("progress backup files", () => {
  it("round-trips progress through a file", () => {
    const progress = p({ completedLessons: { h1: true }, xp: 50, streak: 2, lastActiveDay: "2026-10-02", review: { "h1-e1": { step: 1, due: "2026-10-03" } }, seen: { "h1-e1": true } });
    const read = readBackup(makeBackup(progress, now));
    expect(read).toEqual({ ok: true, progress });
    expect(backupFileName(now)).toBe("open-ux-lab-progress-2026-10-02.json");
  });

  it("rejects files that aren't progress backups", () => {
    for (const text of ["", "not json", "[]", "{}", JSON.stringify({ app: "other", kind: "progress", progress: {} }), JSON.stringify({ app: "open-ux-lab", kind: "progress" })]) {
      expect(readBackup(text).ok).toBe(false);
    }
  });

  it("drops values with the wrong shape from hand-edited files", () => {
    const text = JSON.stringify({ app: "open-ux-lab", kind: "progress", progress: { xp: -5, streak: "lots", lastActiveDay: "yesterday", completedLessons: { h1: true, h2: "yes" }, seen: [], review: { x: { step: 99, due: "soon" } } } });
    const read = readBackup(text);
    expect(read.ok && read.progress).toEqual(p({ completedLessons: { h1: true }, review: { x: { step: 3, due: "0000-00-00" } } }));
  });

  it("combines an imported file with this browser's progress without losing anything", () => {
    const here = p({ completedLessons: { h1: true }, xp: 30, seen: { a: true } });
    const file = p({ completedLessons: { a1: true }, xp: 80, seen: { b: true }, review: { b: { step: 0, due: "2026-10-02" } } });
    const merged = importBackup(here, file);
    expect(merged.completedLessons).toEqual({ h1: true, a1: true });
    expect(merged.xp).toBe(80);
    expect(merged.seen).toEqual({ a: true, b: true });
    expect(Object.keys(merged.review)).toEqual(["b"]);
    expect(importBackup(merged, file)).toEqual(merged);
  });

  it("describes progress in words", () => {
    expect(describeProgress(p({ completedLessons: { h1: true }, xp: 30 }))).toBe("1 lesson, 30 XP, 0 in your review pile");
  });
});
