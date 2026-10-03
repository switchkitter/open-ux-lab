import { setTheme, useTheme } from "../lib/theme";

/**
 * Header switch between light and dark, matching the sound toggle: a fixed accessible name with
 * aria-pressed, so screen readers announce "Dark mode, toggle button, pressed / not pressed". The icon
 * (moon or sun) shows the state without color. "Match my device" is on the account page.
 */
export default function ThemeToggle() {
  const { effective } = useTheme();
  const dark = effective === "dark";
  return (
    <button
      type="button"
      className="chip sound-toggle theme-toggle"
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? "Dark mode on" : "Dark mode off"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {dark ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
