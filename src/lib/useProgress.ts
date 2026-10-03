import { useCallback, useState } from "react";
import type { Progress } from "./progress";
import { settle } from "./rewards";
import { backfillSeen } from "./skills";
import { localProgressStore, type ProgressStore } from "./store";

/** React state for learner progress, persisted through a ProgressStore. */
export function useProgress(store: ProgressStore = localProgressStore) {
  const [progress, setProgress] = useState<Progress>(() => {
    const loaded = store.load();
    // Also hands out rewards earned before this version (badges for lessons already finished, level freezes).
    const migrated = settle(backfillSeen(loaded), new Date());
    if (migrated !== loaded) store.save(migrated);
    return migrated;
  });

  const update = useCallback(
    (change: (p: Progress) => Progress) => {
      setProgress((prev) => {
        // Every change, including sync merges and imported backups, settles rewards the same way.
        const next = settle(change(prev), new Date());
        if (next !== prev) store.save(next);
        return next;
      });
    },
    [store],
  );

  return [progress, update] as const;
}

export type UpdateProgress = ReturnType<typeof useProgress>[1];
