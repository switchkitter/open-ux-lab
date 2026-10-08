import { useSyncExternalStore } from "react";

/**
 * Accent colors unlocked by level. Purely cosmetic: they change --accent, --accent-ink and --accent-soft
 * (defined per accent, light and dark, in styles.css) and never lock content. The choice is remembered per
 * device, like the theme; index.html applies it before the page draws, and App re-checks it against the
 * learner's level so a locked accent (after a progress reset, say) falls back to the default.
 * No reds or greens: those mean wrong and right in exercises.
 */
export type Accent = { id: string; name: string; level: number };

export const ACCENTS: readonly Accent[] = [
  { id: "indigo", name: "Indigo", level: 1 },
  { id: "ocean", name: "Ocean", level: 2 },
  { id: "violet", name: "Violet", level: 4 },
  { id: "plum", name: "Plum", level: 6 },
  { id: "graphite", name: "Graphite", level: 8 },
];

export const DEFAULT_ACCENT = "indigo";
const KEY = "open-ux-lab:accent";

/** The accent first unlocked at this level, if any. */
export function accentUnlockedAt(level: number): Accent | undefined {
  return ACCENTS.find((a) => a.level === level && a.level > 1);
}

/** The accent to show: the saved choice if it exists and the learner's level has reached it, else the default. */
export function accentToShow(saved: string | null, level: number): string {
  const accent = ACCENTS.find((a) => a.id === saved);
  return accent && accent.level <= level ? accent.id : DEFAULT_ACCENT;
}

function load(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

let saved = load();
let level = 1;
const listeners = new Set<() => void>();

function apply() {
  const showing = accentToShow(saved, level);
  const root = document.documentElement;
  if (showing === DEFAULT_ACCENT) delete root.dataset.accent;
  else root.dataset.accent = showing;
  listeners.forEach((l) => l());
}

/** Tells the accent which level the learner has reached; App calls it whenever the level changes. */
export function setAccentLevel(next: number) {
  level = next;
  apply();
}

export function setAccent(id: string) {
  saved = id;
  try {
    if (id === DEFAULT_ACCENT) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, id);
  } catch {
    // Without storage, the choice lasts for this visit only.
  }
  apply();
}

/** The accent showing now. */
export function useAccent(): string {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => accentToShow(saved, level),
  );
}
