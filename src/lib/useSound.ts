import { useSyncExternalStore } from "react";
import { loadSoundEnabled, playSound, saveSoundEnabled, type SoundName } from "./sound";

// One shared setting for the whole app, so the header toggle and exercises always agree.
let enabled = loadSoundEnabled();
const listeners = new Set<() => void>();

export function setSoundEnabled(on: boolean) {
  enabled = on;
  saveSoundEnabled(on);
  listeners.forEach((l) => l());
}

/** Plays a feedback sound if the learner has sound on. Call from click or key handlers. */
export function play(name: SoundName) {
  playSound(name, enabled);
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => enabled,
  );
}
