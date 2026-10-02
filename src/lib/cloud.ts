import type { SupabaseClient } from "@supabase/supabase-js";
import type { Progress } from "./progress";
import { normalizeProgress } from "./store";
import type { RemoteProgress, SyncBase } from "./sync";

/**
 * Supabase-backed accounts and progress. Everything here is optional: without the VITE_SUPABASE_*
 * variables the app runs local-only and never loads the Supabase library.
 * Table and policies: supabase/schema.sql.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

export const cloudConfigured = Boolean(url && key);

export type CloudUser = { id: string; email: string | null };

let clientPromise: Promise<SupabaseClient> | null = null;

function client(): Promise<SupabaseClient> {
  if (!cloudConfigured) return Promise.reject(new Error("Cloud sync isn't configured."));
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url!, key!, {
      // The app uses #/ routes, so don't let Supabase read the URL hash. Sign-in uses typed codes instead.
      auth: { detectSessionInUrl: false, persistSession: true, autoRefreshToken: true, storageKey: "open-ux-lab:auth" },
    }),
  );
  return clientPromise;
}

/** Calls back now and on every sign-in or sign-out. Returns an unsubscribe function. */
export function watchUser(callback: (user: CloudUser | null) => void): () => void {
  let unsubscribe = () => {};
  let stopped = false;
  void client().then((supabase) => {
    if (stopped) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session ? { id: session.user.id, email: session.user.email ?? null } : null);
    });
    unsubscribe = () => data.subscription.unsubscribe();
  }, () => {
    // The Supabase library failed to load (for example, offline). Treat as signed out; signing in reports the error.
    if (!stopped) callback(null);
  });
  return () => {
    stopped = true;
    unsubscribe();
  };
}

/** Emails a one-time sign-in code. Creates the account on first use. */
export async function sendSignInCode(email: string): Promise<void> {
  const { error } = await (await client()).auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifySignInCode(email: string, code: string): Promise<void> {
  const { error } = await (await client()).auth.verifyOtp({ email, token: code, type: "email" });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await (await client()).auth.signOut();
  if (error) throw error;
}

/** Deletes the signed-in account and its synced progress on the server, then signs this browser out. */
export async function deleteAccount(userId: string): Promise<void> {
  const supabase = await client();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
  try {
    localStorage.removeItem(syncBaseKey(userId));
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
  // The account no longer exists, so only clear the session stored in this browser.
  await supabase.auth.signOut({ scope: "local" });
}

export function remoteProgress(userId: string): RemoteProgress {
  return {
    async load() {
      const { data, error } = await (await client())
        .from("progress")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ? normalizeProgress(data.data) : null;
    },
    async save(progress) {
      const { error } = await (await client())
        .from("progress")
        .upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
  };
}

/** Per-account sync base in this browser, so switching accounts never mixes up bases. */
const syncBaseKey = (userId: string) => `open-ux-lab:sync-base:${userId}`;

export function localSyncBase(userId: string): SyncBase {
  const storageKey = syncBaseKey(userId);
  return {
    load() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? normalizeProgress(JSON.parse(raw)) : null;
      } catch {
        return null;
      }
    },
    save(progress: Progress) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch {
        // Without a stored base the next sync falls back to a first-sync merge, which is still safe.
      }
    },
  };
}
