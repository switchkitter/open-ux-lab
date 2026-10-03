import { site } from "../content/site";

/**
 * Feedback on lessons and exercises (public.feedback and submit_feedback() in supabase/schema.sql).
 * Sent only when the learner presses Send; not linked to their account. If sending isn't possible,
 * the dialog offers the same message as an email instead.
 */

export type FeedbackKind = "technical" | "content" | "other";
export type FeedbackTarget = { type: "lesson" | "exercise"; id: string; title: string };

export const FEEDBACK_KINDS: { value: FeedbackKind; label: string; hint: string }[] = [
  { value: "technical", label: "Something isn't working", hint: "A technical issue: a bug, a button that does nothing, a display problem" },
  { value: "content", label: "Content problem", hint: "A wrong answer, a typo, or something unclear or out of date" },
  { value: "other", label: "Suggestion or other feedback", hint: "Ideas, praise, or anything else" },
];

export const MAX_MESSAGE = 1000;

export type FeedbackInput = {
  kind: FeedbackKind;
  target: FeedbackTarget;
  message: string;
  replyEmail: string;
  details: TechDetails | null;
};

export type TechDetails = { browser: string; system: string; screen: string; app: string };

/** Short, readable technical details, shown to the learner before they choose to send them. */
export function techDetails(ua: string, screen: { width: number; height: number }, version: string): TechDetails {
  const browser =
    /Edg\/(\d+)/.exec(ua)?.[0].replace("Edg/", "Edge ") ??
    /CriOS\/(\d+)/.exec(ua)?.[0].replace("CriOS/", "Chrome ") ??
    /FxiOS\/(\d+)/.exec(ua)?.[0].replace("FxiOS/", "Firefox ") ??
    /Firefox\/(\d+)/.exec(ua)?.[0].replace("/", " ") ??
    /Chrome\/(\d+)/.exec(ua)?.[0].replace("/", " ") ??
    (/Version\/(\d+)[\d.]* .*Safari/.exec(ua) ? `Safari ${/Version\/(\d+)/.exec(ua)![1]}` : "Unknown browser");
  const system = /iPhone|iPad/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown system";
  return { browser, system, screen: `${screen.width}×${screen.height}`, app: version };
}

export function describeDetails(d: TechDetails): string {
  return `${d.browser} on ${d.system}, screen ${d.screen}, app version ${d.app}`;
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** The same feedback as an email, for when sending to the server isn't possible. */
export function mailtoLink(input: FeedbackInput): string {
  const kind = FEEDBACK_KINDS.find((k) => k.value === input.kind)!.label;
  const lines = [
    `Feedback type: ${kind}`,
    `About the ${input.target.type}: ${input.target.title} (${input.target.id})`,
    "",
    input.message.trim(),
  ];
  if (input.details) lines.push("", `Technical details: ${describeDetails(input.details)}`);
  const subject = `Open UX Lab feedback: ${input.target.title}`;
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;
export const feedbackConfigured = Boolean(url && key);

/** Sends feedback. Throws if it couldn't be saved, so the dialog can offer email instead. */
export async function sendFeedback(input: FeedbackInput): Promise<void> {
  if (!feedbackConfigured) throw new Error("Feedback isn't set up on this copy of the app.");
  const res = await fetch(`${url}/rest/v1/rpc/submit_feedback`, {
    method: "POST",
    headers: { apikey: key!, "Content-Type": "application/json" },
    body: JSON.stringify({
      feedback_kind: input.kind,
      target_kind: input.target.type,
      target_key: input.target.id.slice(0, 64),
      body: input.message.trim().slice(0, MAX_MESSAGE),
      reply_to: input.replyEmail.trim() || null,
      tech_details: input.details,
    }),
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!res.ok) throw new Error(`Feedback not saved (${res.status})`);
}
