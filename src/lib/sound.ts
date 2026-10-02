/**
 * Short feedback sounds, synthesized with the Web Audio API (no audio files, no network).
 *
 * Accessibility rules:
 * - Sounds only ever repeat feedback that's also shown as text and color, never replace it.
 * - Each sound is under a second and only plays in response to the learner's own action.
 * - Learners can turn sounds off with the header toggle; the choice is remembered on the device.
 */

export type SoundName = "correct" | "wrong" | "complete";

const STORAGE_KEY = "open-ux-lab:sound";

/** Whether sound effects are on. Defaults to on; storage errors fall back to the default. */
export function loadSoundEnabled(): boolean {
  try {
    return parseSoundSetting(localStorage.getItem(STORAGE_KEY));
  } catch {
    return true;
  }
}

export function saveSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // The setting just won't be remembered.
  }
}

export function parseSoundSetting(raw: string | null): boolean {
  return raw !== "off";
}

type Note = { freq: number; start: number; length: number; gain: number; type?: OscillatorType };

/** Notes for each sound, in seconds. Kept as data so tests can check lengths. */
export const SOUNDS: Record<SoundName, Note[]> = {
  // Two bright rising notes.
  correct: [
    { freq: 784, start: 0, length: 0.12, gain: 0.12 }, // G5
    { freq: 1175, start: 0.09, length: 0.2, gain: 0.12 }, // D6
  ],
  // Two soft falling notes: a gentle "not quite", not a buzzer.
  wrong: [
    { freq: 330, start: 0, length: 0.16, gain: 0.1, type: "triangle" }, // E4
    { freq: 262, start: 0.13, length: 0.24, gain: 0.1, type: "triangle" }, // C4
  ],
  // A quick rising arpeggio with a held top note.
  complete: [
    { freq: 523, start: 0, length: 0.14, gain: 0.1 }, // C5
    { freq: 659, start: 0.1, length: 0.14, gain: 0.1 }, // E5
    { freq: 784, start: 0.2, length: 0.14, gain: 0.1 }, // G5
    { freq: 1047, start: 0.3, length: 0.45, gain: 0.12 }, // C6
    { freq: 1568, start: 0.3, length: 0.35, gain: 0.04 }, // G6 sparkle
  ],
};

/** Total length of a sound in seconds. */
export function soundLength(name: SoundName): number {
  return Math.max(...SOUNDS[name].map((n) => n.start + n.length));
}

let context: AudioContext | null = null;

type AudioWindow = { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };

function newContext(): AudioContext | null {
  const w = (typeof window === "undefined" ? undefined : window) as AudioWindow | undefined;
  const Ctx = w?.AudioContext ?? w?.webkitAudioContext;
  return Ctx ? new Ctx() : null;
}

/** Schedules a sound's notes on a running context. */
function schedule(ctx: AudioContext, name: SoundName) {
  const now = ctx.currentTime + 0.01;
  for (const note of SOUNDS[name]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.type ?? "sine";
    osc.frequency.value = note.freq;
    // Quick fade in and out so notes don't click.
    const t0 = now + note.start;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(note.gain, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + note.length + 0.02);
  }
}

/** Gives up on a context and starts a fresh one. Must run inside the learner's tap or key press. */
function replaceContext(): AudioContext | null {
  try {
    void context?.close();
  } catch {
    // Already closed.
  }
  needsFresh = false;
  context = newContext();
  return context;
}

/** Set when a resume fails or hangs, so the next tap starts a fresh context instead. */
let needsFresh = false;

/** A sound requested while the context was waking up, played once it's running (if still recent). */
const MAX_DELAY_MS = 600;

/**
 * Returns a context that is running or being resumed. Must run inside the learner's tap or key
 * press: that's the only time browsers (Safari especially) let audio start or restart.
 *
 * Phones pause web audio when the app goes to the background, the screen locks, or another app
 * takes the audio. Chrome reports the context as "suspended"; Safari, including home-screen apps,
 * as "interrupted", and it may never come back on its own. Interrupted, closed or failed contexts
 * are replaced; suspended ones are resumed.
 */
function wake(): AudioContext | null {
  let ctx = context;
  // "interrupted" is Safari-only, so it isn't in TypeScript's AudioContextState.
  if (!ctx || needsFresh || ctx.state === "closed" || (ctx.state as string) === "interrupted") ctx = replaceContext();
  if (!ctx || ctx.state === "running") return ctx;
  const c = ctx;
  const timer = setTimeout(() => {
    if (c.state !== "running") needsFresh = true;
  }, MAX_DELAY_MS);
  c.resume().then(
    () => {
      clearTimeout(timer);
      if (c.state !== "running") needsFresh = true;
    },
    () => {
      clearTimeout(timer);
      needsFresh = true;
    },
  );
  return c;
}

/**
 * Plays a sound if sound is on. Call only from a click or key handler. If audio is still waking up
 * (for example, just after returning to the app), the sound plays as soon as it's ready, or is
 * skipped if that takes too long. Fails silently where Web Audio isn't available.
 */
export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = wake();
    if (!ctx) return;
    if (ctx.state === "running") {
      schedule(ctx, name);
      return;
    }
    const asked = Date.now();
    const onChange = () => {
      if (ctx.state !== "running") return;
      ctx.removeEventListener("statechange", onChange);
      if (Date.now() - asked <= MAX_DELAY_MS) schedule(ctx, name);
    };
    ctx.addEventListener("statechange", onChange);
    setTimeout(() => ctx.removeEventListener("statechange", onChange), MAX_DELAY_MS);
  } catch {
    // Sound is a nice-to-have; never let it break an answer.
  }
}

/**
 * Wakes audio on the learner's first touch or key press after returning to the app, so it's
 * already running by the time an answer's click handler plays a sound. Only does anything once a
 * sound has played before (it never starts audio on its own) and while sound is on.
 */
export function keepAudioAwake(isEnabled: () => boolean) {
  if (typeof document === "undefined") return;
  const handler = () => {
    if (!isEnabled() || !context) return;
    if (context.state !== "running" || needsFresh) wake();
  };
  document.addEventListener("pointerdown", handler, { capture: true, passive: true });
  document.addEventListener("keydown", handler, { capture: true });
}

/** Test hook: forget the current context. */
export function resetSoundForTests() {
  context = null;
  needsFresh = false;
}
