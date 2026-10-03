import { describe, expect, it } from "vitest";
import css from "../styles.css?raw";
import { lessonIcons, lessonScenes, pathHeroes, pathIcons } from "../art";
import { paths } from "./paths";
import { site } from "./site";
import { skills } from "./skills";
import type { Exercise, SpotPart } from "./types";

const spotParts = (e: Exercise): SpotPart[] => (e.type === "spot" ? e.parts.flat() : []);

/** All trusted mockup HTML in an exercise. */
const mockupHtml = (e: Exercise): string[] =>
  e.type === "compare" ? [e.a, e.b] : e.type === "spot" ? spotParts(e).map((p) => p.html) : [];

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

  it("records the license of openly licensed sources (needed for attribution)", () => {
    const openHosts = ["design-system.service.gov.uk", "www.gov.uk", "designsystem.digital.gov"];
    for (const l of lessons) {
      for (const s of l.sources) {
        if (openHosts.includes(new URL(s.url).hostname)) expect(s.license, `${l.id}: ${s.url}`).toBeDefined();
      }
    }
  });

  it("has a valid correct answer for every exercise", () => {
    for (const e of exercises) {
      if (e.type === "choice") {
        expect(e.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(e.correct, e.id).toBeLessThan(e.options.length);
      } else if (e.type === "compare") {
        expect(["a", "b"]).toContain(e.correct);
      } else if (e.type === "sort") {
        expect(e.groups, e.id).toHaveLength(2);
        expect(e.items.length, e.id).toBeGreaterThanOrEqual(4);
        expect(e.items.length, e.id).toBeLessThanOrEqual(6);
        expect(new Set(e.items.map((i) => i.id)).size, e.id).toBe(e.items.length);
        // Both groups must be used, or the answer is guessable from the setup.
        expect(new Set(e.items.map((i) => i.group)).size, e.id).toBe(2);
        for (const g of e.groups) expect(g.length, `${e.id}: group name fits a button`).toBeLessThanOrEqual(28);
      } else {
        expect(spotParts(e).map((p) => p.id), e.id).toContain(e.correct);
      }
      expect(e.why.length, e.id).toBeGreaterThan(20);
    }
  });

  it("does not put scripts in mockup HTML", () => {
    for (const e of exercises) {
      for (const html of mockupHtml(e)) {
        expect(/<script|on\w+=/i.test(html), e.id).toBe(false);
      }
    }
  });

  it("only uses mockup classes that exist in styles.css", () => {
    for (const e of exercises) {
      for (const html of mockupHtml(e)) {
        for (const [, classes] of html.matchAll(/class="([^"]*)"/g)) {
          for (const c of classes.split(/\s+/).filter((c) => c.startsWith("mk-"))) {
            expect(css.includes(`.${c} `) || css.includes(`.${c}{`), `${e.id}: .${c}`).toBe(true);
          }
        }
      }
    }
  });

  it("uses the failing-contrast .mk-faint class only in the worse design", () => {
    for (const e of exercises) {
      if (e.type !== "compare") continue;
      const better = e.correct === "a" ? e.a : e.b;
      expect(better.includes("mk-faint"), e.id).toBe(false);
    }
  });

  it("gives spot-the-problem parts unique IDs and a screen reader label", () => {
    for (const e of exercises) {
      const parts = spotParts(e);
      if (!parts.length) continue;
      expect(new Set(parts.map((p) => p.id)).size, e.id).toBe(parts.length);
      expect(parts.length, e.id).toBeGreaterThanOrEqual(3);
      for (const p of parts) expect(p.label.trim().length, `${e.id}/${p.id}`).toBeGreaterThan(3);
    }
  });

  it("describes both designs of every compare exercise in neutral words", () => {
    // The description is all a screen reader user gets, so it can't be missing, identical or give the answer away.
    for (const e of exercises) {
      if (e.type !== "compare") continue;
      for (const text of [e.describe.a, e.describe.b]) {
        expect(text.length, e.id).toBeGreaterThan(20);
        expect(text.length, e.id).toBeLessThan(260);
        expect(text, e.id).not.toMatch(/(better|worse|easier|harder|clearer|clearly|confusing|cluttered|correct|wrong|good|bad)/i);
      }
      expect(e.describe.a, e.id).not.toBe(e.describe.b);
    }
  });

  it("keeps spot-the-problem exercises to problems that come across in words", () => {
    // Purely visual problems (like low contrast) can't be found with a screen reader; use compare instead.
    for (const e of exercises) {
      if (e.type !== "spot") continue;
      for (const html of mockupHtml(e)) expect(html.includes("mk-faint"), e.id).toBe(false);
    }
  });

  it("tags every lesson with at least one skill, and every skill with at least three lessons", () => {
    for (const l of lessons) expect(l.skills.length, l.id).toBeGreaterThan(0);
    for (const skill of skills) {
      const count = lessons.filter((l) => (l.skills as readonly string[]).includes(skill.id)).length;
      expect(count, skill.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("gives every lesson an icon and a scene", () => {
    for (const l of lessons) {
      expect(lessonIcons[l.id], `${l.id} icon`).toBeDefined();
      expect(lessonScenes[l.id], `${l.id} scene`).toBeDefined();
    }
  });

  it("gives every learning path an icon and a banner", () => {
    for (const p of paths) {
      expect(pathIcons[p.id], `${p.id} icon`).toBeDefined();
      expect(pathHeroes[p.id], `${p.id} banner`).toBeDefined();
    }
  });

  it("has a contact email for the privacy page", () => {
    expect(site.contactEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
