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

/**
 * Plays a sound if sound is on. Call only from a click or key handler: browsers only allow audio
 * after the learner has interacted with the page. Fails silently where Web Audio isn't available.
 */
export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    context ??= new Ctx();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime + 0.01;
    for (const note of SOUNDS[name]) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = note.type ?? "sine";
      osc.frequency.value = note.freq;
      // Quick fade in and out so notes don't click.
      const t0 = now + note.start;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(note.gain, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.length);
      osc.connect(gain).connect(context.destination);
      osc.start(t0);
      osc.stop(t0 + note.length + 0.02);
    }
  } catch {
    // Sound is a nice-to-have; never let it break an answer.
  }
}
