import { describe, expect, it } from "vitest";
import css from "../styles.css?raw";
import { ACCENTS, DEFAULT_ACCENT, accentToShow, accentUnlockedAt } from "./accent";
import { LEVELS } from "./rewards";

/** Reads the custom properties declared in the first rule whose selector starts with `selector`. */
function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(selector + " {");
  if (start < 0) throw new Error(`No rule for ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("accent colors", () => {
  it("unlock at real levels, one per level, starting with the default", () => {
    expect(ACCENTS[0]).toMatchObject({ id: DEFAULT_ACCENT, level: 1 });
    const levels = ACCENTS.map((a) => a.level);
    expect(new Set(levels).size).toBe(levels.length);
    for (const level of levels) expect(LEVELS.some((l) => l.level === level)).toBe(true);
    expect(accentUnlockedAt(1)).toBeUndefined();
    expect(accentUnlockedAt(2)?.id).toBe("ocean");
  });

  it("show the saved choice only once its level is reached", () => {
    expect(accentToShow(null, 8)).toBe(DEFAULT_ACCENT);
    expect(accentToShow("ocean", 1)).toBe(DEFAULT_ACCENT);
    expect(accentToShow("ocean", 2)).toBe("ocean");
    expect(accentToShow("graphite", 7)).toBe(DEFAULT_ACCENT);
    expect(accentToShow("not-a-color", 8)).toBe(DEFAULT_ACCENT);
  });

  const light = tokens(":root");
  const dark = tokens(':root[data-theme="dark"]');

  for (const accent of ACCENTS) {
    for (const [mode, base, selector] of [
      ["light", light, `[data-accent="${accent.id}"]`],
      ["dark", dark, `:root[data-theme="dark"][data-accent="${accent.id}"], :root[data-theme="dark"] [data-accent="${accent.id}"]`],
    ] as const) {
      it(`${accent.name} meets AA contrast in ${mode} mode`, () => {
        const t = tokens(selector);
        // Accent is used for link and label text on the page, cards, mockups and its own soft tint.
        for (const bg of [base["--bg"], base["--surface"], base["--mk-bg"], t["--accent-soft"]]) expect(contrast(t["--accent"], bg)).toBeGreaterThanOrEqual(4.5);
        // Text on filled buttons, and body text on the soft tint.
        expect(contrast(t["--accent-ink"], t["--accent"])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(base["--fg"], t["--accent-soft"])).toBeGreaterThanOrEqual(4.5);
      });
    }

    it(`${accent.name} uses the same dark colors for a dark device and the dark theme`, () => {
      const device = tokens(`  :root:not([data-theme="light"])[data-accent="${accent.id}"], :root:not([data-theme="light"]) [data-accent="${accent.id}"]`);
      expect(device).toEqual(tokens(`:root[data-theme="dark"][data-accent="${accent.id}"], :root[data-theme="dark"] [data-accent="${accent.id}"]`));
    });
  }

  it("keeps the default accent in step with the base tokens", () => {
    const t = tokens(`[data-accent="${DEFAULT_ACCENT}"]`);
    expect(t["--accent"]).toBe(light["--accent"]);
    expect(t["--accent-soft"]).toBe(light["--accent-soft"]);
  });
});
