import { useSyncExternalStore } from "react";

/**
 * Light or dark theme. "system" follows the device setting (the CSS default); "light" and "dark" set
 * data-theme on <html>, which the design tokens in styles.css respond to. Remembered per device.
 * index.html applies the saved choice before the page draws, so there's no flash of the wrong theme.
 */
export type ThemeChoice = "system" | "light" | "dark";

const KEY = "open-ux-lab:theme";
const darkQuery = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function load(): ThemeChoice {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

let choice: ThemeChoice = load();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
darkQuery?.addEventListener("change", notify);

/** The theme actually showing: the choice, or the device setting when the choice is "system". */
export function effectiveTheme(c: ThemeChoice = choice, deviceDark = darkQuery?.matches ?? false): "light" | "dark" {
  return c === "system" ? (deviceDark ? "dark" : "light") : c;
}

function apply() {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  // Browser and phone toolbars: follow the chosen theme, or the device when matching it.
  const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.dataset.original ??= meta.content;
    meta.content = choice === "system" ? meta.dataset.original : bg;
  });
}

export function setTheme(next: ThemeChoice) {
  choice = next;
  try {
    if (next === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    // Without storage, the choice lasts for this visit only.
  }
  apply();
  notify();
}

/** Applies the saved choice; call once at startup (the inline script in index.html does the same earlier). */
export function initTheme() {
  apply();
}

export function useTheme(): { choice: ThemeChoice; effective: "light" | "dark" } {
  // The snapshot includes the theme showing, so a change in the device setting re-renders too.
  const snapshot = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => `${choice}|${effectiveTheme()}`,
  );
  const [c, effective] = snapshot.split("|") as [ThemeChoice, "light" | "dark"];
  return { choice: c, effective };
}
