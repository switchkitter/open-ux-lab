import { play, setSoundEnabled, useSoundEnabled } from "../lib/useSound";

/**
 * Header toggle for sound effects: an icon button with a fixed accessible name and aria-pressed, so
 * screen readers announce "Sound effects, toggle button, pressed / not pressed". The icon (waves or
 * a cross) shows the state without relying on color; the tooltip names it for mouse users.
 */
export default function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      className={`chip sound-toggle ${on ? "on" : "off"}`}
      aria-pressed={on}
      aria-label="Sound effects"
      title={on ? "Sound effects on" : "Sound effects off"}
      onClick={() => {
        setSoundEnabled(!on);
        // A short sample confirms sound is working when it's switched on.
        if (!on) play("correct");
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
    </button>
  );
}
