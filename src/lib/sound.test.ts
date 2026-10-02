import { describe, expect, it } from "vitest";
import { SOUNDS, parseSoundSetting, playSound, soundLength, type SoundName } from "./sound";

describe("sound effects", () => {
  it("keeps every sound well under 3 seconds (WCAG 1.4.2 starts at 3)", () => {
    for (const name of Object.keys(SOUNDS) as SoundName[]) expect(soundLength(name), name).toBeLessThan(1);
  });

  it("keeps volumes low", () => {
    for (const notes of Object.values(SOUNDS)) for (const n of notes) expect(n.gain).toBeLessThanOrEqual(0.15);
  });

  it("is on unless the learner turned it off", () => {
    expect(parseSoundSetting(null)).toBe(true);
    expect(parseSoundSetting("on")).toBe(true);
    expect(parseSoundSetting("off")).toBe(false);
  });

  it("does nothing, without throwing, where there's no Web Audio", () => {
    expect(() => playSound("correct", true)).not.toThrow();
    expect(() => playSound("complete", false)).not.toThrow();
  });
});
