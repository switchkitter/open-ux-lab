import { useCallback, useEffect, useRef, useState } from "react";
import { cloudConfigured, localSyncBase, remoteProgress, watchUser, type CloudUser } from "./cloud";
import { mergeProgress } from "./merge";
import type { Progress } from "./progress";
import { sameProgress, syncProgress } from "./sync";
import type { UpdateProgress } from "./useProgress";

export type SyncStatus =
  | { state: "off" } // not configured on this build
  | { state: "checking" } // loading the saved sign-in
  | { state: "signed-out" }
  | { state: "syncing"; user: CloudUser }
  | { state: "synced"; user: CloudUser; at: Date }
  | { state: "error"; user: CloudUser; message: string };

/** Wait this long after a change before syncing, so a burst of answers becomes one request. */
const DEBOUNCE_MS = 1500;

/** Keeps local progress in sync with the signed-in account. Local progress always stays the source of truth on screen. */
export function useCloudSync(progress: Progress, update: UpdateProgress) {
  const [user, setUser] = useState<CloudUser | null | undefined>(cloudConfigured ? undefined : null);
  const [status, setStatus] = useState<SyncStatus>(cloudConfigured ? { state: "checking" } : { state: "off" });
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const running = useRef(false);
  const again = useRef(false);

  useEffect(() => {
    if (!cloudConfigured) return;
    // Token refreshes report the same user as a new object; keep the old one so syncs don't re-run.
    return watchUser((next) => setUser((prev) => (prev && next && prev.id === next.id && prev.email === next.email ? prev : next)));
  }, []);

  const syncNow = useCallback(async () => {
    if (!user) return;
    if (running.current) {
      again.current = true;
      return;
    }
    running.current = true;
    setStatus({ state: "syncing", user });
    try {
      const start = progressRef.current;
      const merged = await syncProgress(start, remoteProgress(user.id), localSyncBase(user.id));
      // Answers given while the request was in flight are merged in rather than overwritten.
      update((current) => (sameProgress(merged, current) ? current : current === start ? merged : mergeProgress(current, merged, start)));
      setStatus({ state: "synced", user, at: new Date() });
    } catch (error) {
      setStatus({ state: "error", user, message: describe(error) });
    } finally {
      running.current = false;
      if (again.current) {
        again.current = false;
        void syncNow();
      }
    }
  }, [user, update]);

  // Sign-in state changes: sync straight away, or show signed out.
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      if (cloudConfigured) setStatus({ state: "signed-out" });
      return;
    }
    void syncNow();
  }, [user, syncNow]);

  // Local changes: sync shortly after, unless this device already matches its last sync.
  useEffect(() => {
    if (!user) return;
    if (sameProgress(progress, localSyncBase(user.id).load() ?? progress)) return;
    const timer = window.setTimeout(() => void syncNow(), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [progress, user, syncNow]);

  // Coming back to the app or reconnecting: pick up progress made on other devices.
  useEffect(() => {
    if (!user) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void syncNow();
    };
    const onOnline = () => void syncNow();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, [user, syncNow]);

  return { status, syncNow };
}

function describe(error: unknown): string {
  if (!navigator.onLine) return "You're offline. Progress is saved on this device and will sync when you reconnect.";
  return error instanceof Error && error.message ? error.message : "Couldn't reach the sync server.";
}
