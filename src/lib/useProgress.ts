import { useCallback, useState } from "react";
import type { Progress } from "./progress";
import { localProgressStore, type ProgressStore } from "./store";

/** React state for learner progress, persisted through a ProgressStore. */
export function useProgress(store: ProgressStore = localProgressStore) {
  const [progress, setProgress] = useState<Progress>(() => store.load());

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
