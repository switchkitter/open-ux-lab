import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  FEEDBACK_KINDS,
  MAX_MESSAGE,
  describeDetails,
  mailtoLink,
  sendFeedback,
  techDetails,
  validEmail,
  type FeedbackInput,
  type FeedbackKind,
  type FeedbackTarget,
} from "../lib/feedback";

type State = "editing" | "sending" | "sent" | "failed";

/**
 * "Give feedback" button and its dialog, for a lesson or an exercise. Uses the native <dialog> element,
 * which traps focus, closes with Escape and makes the rest of the page inert while it's open.
 */
export default function FeedbackButton({ target }: { target: FeedbackTarget }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const failRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [state, setState] = useState<State>("editing");
  const [errors, setErrors] = useState<{ kind?: string; message?: string; email?: string }>({});
  // The failure message sits at the end of the form; bring it into view on small screens.
  useEffect(() => {
    if (state === "failed") failRef.current?.scrollIntoView({ block: "nearest" });
  }, [state]);
  const details = techDetails(navigator.userAgent, { width: window.screen.width, height: window.screen.height }, __APP_VERSION__);

  const input = (): FeedbackInput => ({
    kind: kind ?? "other",
    target,
    message,
    replyEmail: email,
    details: kind === "technical" && includeDetails ? details : null,
  });

  function open() {
    setState("editing");
    setErrors({});
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function reset() {
    // After a successful send, start fresh next time; otherwise keep the draft.
    if (state === "sent") {
      setKind(null);
      setMessage("");
      setEmail("");
      setState("editing");
    }
    openerRef.current?.focus();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!kind) next.kind = "Choose the kind of feedback";
    if (!message.trim()) next.message = "Tell us what you noticed";
    if (email.trim() && !validEmail(email)) next.email = "Enter an email address in the correct format, like name@example.com";
    setErrors(next);
    if (next.kind) return document.getElementById(`${id}-kind-0`)?.focus();
    if (next.message) return messageRef.current?.focus();
    if (next.email) return emailRef.current?.focus();
    setState("sending");
    try {
      await sendFeedback(input());
      setState("sent");
    } catch {
      setState("failed");
    }
  }

  const describedBy = (field: string, hint?: string) =>
    [hint, errors[field as keyof typeof errors] ? `${id}-${field}-error` : null].filter(Boolean).join(" ") || undefined;
  const errorText = (field: keyof typeof errors) =>
    errors[field] && (
      <p className="form-error" id={`${id}-${field}-error`}>
        <span className="visually-hidden">Error: </span>
        {errors[field]}
      </p>
    );

  return (
    <>
      <button ref={openerRef} className="feedback-open" type="button" onClick={open}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="M5 21V4h11l-1.5 4L16 12H5" />
        </svg>
        {`Give feedback on this ${target.type}`}
      </button>

      <dialog ref={dialogRef} className="feedback-dialog" aria-labelledby={`${id}-title`} onClose={reset}>
        {state === "sent" ? (
          <div className="feedback-done" role="status">
            <h2 id={`${id}-title`}>Thanks for your feedback</h2>
            <p>We read every message, and it helps us fix problems and improve the lessons.</p>
            <div className="actions">
              <button className="btn" type="button" onClick={close} autoFocus>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id={`${id}-title`}>{`Feedback on this ${target.type}`}</h2>
            <p className="feedback-about">{target.title}</p>

            <fieldset className={`form-group ${errors.kind ? "has-error" : ""}`} aria-describedby={errors.kind ? `${id}-kind-error` : undefined}>
              <legend className="form-label">What kind of feedback is it?</legend>
              {errorText("kind")}
              {FEEDBACK_KINDS.map((k, i) => (
                <label key={k.value} className="check feedback-kind">
                  <input id={`${id}-kind-${i}`} type="radio" name={`${id}-kind`} checked={kind === k.value} onChange={() => setKind(k.value)} />
                  <span>
                    <strong>{k.label}</strong>
                    <span className="form-hint">{k.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className={`form-group ${errors.message ? "has-error" : ""}`}>
              <label className="form-label" htmlFor={`${id}-message`}>
                Tell us more
              </label>
              <div className="form-hint" id={`${id}-message-hint`}>
                {`What did you notice? Please don't include personal details. Up to ${MAX_MESSAGE} characters.`}
              </div>
              {errorText("message")}
              <textarea
                ref={messageRef}
                id={`${id}-message`}
                className="form-input"
                rows={4}
                maxLength={MAX_MESSAGE}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-describedby={describedBy("message", `${id}-message-hint`)}
                aria-invalid={errors.message ? true : undefined}
              />
            </div>

            {kind === "technical" && (
              <label className="check">
                <input type="checkbox" checked={includeDetails} onChange={(e) => setIncludeDetails(e.target.checked)} />
                <span>
                  Include technical details
                  <span className="form-hint">{describeDetails(details)}</span>
                </span>
              </label>
            )}

            <div className={`form-group ${errors.email ? "has-error" : ""}`}>
              <label className="form-label" htmlFor={`${id}-email`}>
                Email (optional)
              </label>
              <div className="form-hint" id={`${id}-email-hint`}>
                Only if you'd like a reply. We use it for nothing else.
              </div>
              {errorText("email")}
              <input
                ref={emailRef}
                id={`${id}-email`}
                className="form-input"
                type="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={describedBy("email", `${id}-email-hint`)}
                aria-invalid={errors.email ? true : undefined}
              />
            </div>

            {state === "failed" && (
              <div ref={failRef} className="form-error" role="alert">
                <p>We couldn't send your feedback. Your message is still here.</p>
                <p>
                  <a href={mailtoLink(input())}>Email it to us instead</a>
                </p>
              </div>
            )}

            <div className="actions">
              <button className="btn" type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : state === "failed" ? "Try again" : "Send feedback"}
              </button>
              <button className="btn ghost" type="button" onClick={close}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
