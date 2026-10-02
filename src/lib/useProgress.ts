import { useCallback, useState } from "react";
import type { Progress } from "./progress";
import { backfillSeen } from "./skills";
import { localProgressStore, type ProgressStore } from "./store";

/** React state for learner progress, persisted through a ProgressStore. */
export function useProgress(store: ProgressStore = localProgressStore) {
  const [progress, setProgress] = useState<Progress>(() => {
    const loaded = store.load();
    const migrated = backfillSeen(loaded);
    if (migrated !== loaded) store.save(migrated);
    return migrated;
  });

  const update = useCallback(
    (change: (p: Progress) => Progress) => {
      setProgress((prev) => {
        const next = change(prev);
        if (next !== prev) store.save(next);
        return next;
      });
    },
    [store],
  );

  return [progress, update] as const;
}

export type UpdateProgress = ReturnType<typeof useProgress>[1];
