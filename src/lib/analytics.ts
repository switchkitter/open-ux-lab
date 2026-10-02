/**
 * Anonymous usage counts (see public.usage_counts and track_event() in supabase/schema.sql).
 *
 * Privacy rules, mirrored on the privacy page:
 * - Only an event name and a lesson or exercise ID are sent. No user, account, device or session ID.
 * - Nothing is sent in development, without Supabase configured, when the browser asks not to be
 *   tracked (Global Privacy Control or Do Not Track), or when the learner opts out.
 * - Sending is fire-and-forget: failures and offline use are ignored and never affect the app.
 */

export type UsageEvent = "visit" | "lesson_opened" | "lesson_completed" | "exercise_right" | "exercise_wrong" | "review_completed";

const OPT_OUT_KEY = "open-ux-lab:no-usage-counts";

type Env = {
  dev: boolean;
  configured: boolean;
  optedOut: boolean;
  nav?: { doNotTrack?: string | null; globalPrivacyControl?: boolean };
};

/** Whether this browser may send usage counts. */
export function countsAllowed({ dev, configured, optedOut, nav }: Env): boolean {
  if (dev || !configured || optedOut) return false;
  if (nav?.globalPrivacyControl) return false;
  if (nav?.doNotTrack === "1" || nav?.doNotTrack === "yes") return false;
  return true;
}

/** True when the browser itself signals "don't track" (shown on the privacy page). */
export function browserSaysDoNotTrack(nav: Env["nav"] = typeof navigator === "undefined" ? undefined : navigator): boolean {
  return Boolean(nav?.globalPrivacyControl) || nav?.doNotTrack === "1" || nav?.doNotTrack === "yes";
}

export function loadOptOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveOptOut(optedOut: boolean) {
  try {
    if (optedOut) localStorage.setItem(OPT_OUT_KEY, "1");
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Without storage the choice lasts only for this visit.
  }
}

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

/** Adds one to today's count for an event. Never throws and never waits. */
export function count(event: UsageEvent, id = "") {
  const nav = typeof navigator === "undefined" ? undefined : (navigator as Env["nav"]);
  if (!countsAllowed({ dev: import.meta.env.DEV, configured: Boolean(url && key), optedOut: loadOptOut(), nav })) return;
  try {
    void fetch(`${url}/rest/v1/rpc/track_event`, {
      method: "POST",
      headers: { apikey: key!, "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: event, event_key: id.slice(0, 64) }),
      // Lets the count finish even if the page is being closed (e.g. after the last answer).
      keepalive: true,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    }).catch(() => undefined);
  } catch {
    // Counting is optional; ignore any failure.
  }
}
