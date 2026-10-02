import { useEffect, useRef, useState, type FormEvent } from "react";
import { sendSignInCode, signOut, verifySignInCode } from "../lib/cloud";
import { hrefFor } from "../lib/route";
import type { SyncStatus } from "../lib/useCloudSync";

type Props = { status: SyncStatus; syncNow: () => void };

export default function AccountPage({ status, syncNow }: Props) {
  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        ← All lessons
      </a>
      <section className="panel account">
        <div className="eyebrow">Account</div>
        {status.state === "off" && (
          <>
            <h1>Sync isn't available here</h1>
            <p>This copy of Open UX Lab isn't connected to a sync server. Your progress is saved in this browser.</p>
          </>
        )}
        {status.state === "checking" && <p role="status">Checking whether you're signed in…</p>}
        {status.state === "signed-out" && <SignIn />}
        {(status.state === "syncing" || status.state === "synced" || status.state === "error") && (
          <SignedIn status={status} syncNow={syncNow} />
        )}
      </section>
    </>
  );
}

function SignIn() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter an email address in the correct format, like name@example.com");
      emailRef.current?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await sendSignInCode(value);
      setEmail(value);
      setStep("code");
    } catch (err) {
      setError(friendly(err, "We couldn't send a code. Check the address and try again."));
      emailRef.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    const value = code.replace(/\s+/g, "");
    if (!/^\d{6,10}$/.test(value)) {
      setError("Enter the code from the email. It's a number with 6 or more digits.");
      codeRef.current?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await verifySignInCode(email, value);
      // Signed in: the sync hook notices and this page switches to the signed-in view.
    } catch (err) {
      setError(friendly(err, "That code didn't work. Check it, or send a new one."));
      codeRef.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  if (step === "email") {
    return (
      <>
        <h1>Sync your progress</h1>
        <p>Sign in to keep your XP, streak, lessons and review pile in step across your phone and computer. No password needed.</p>
        <form onSubmit={sendCode} noValidate>
          <div className={`form-group ${error ? "has-error" : ""}`}>
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <div className="form-hint" id="email-hint">
              We'll email you a code to sign in. We only use your address for signing in.
            </div>
            {error && (
              <p className="form-error" id="email-error">
                <span className="visually-hidden">Error: </span>
                {error}
              </p>
            )}
            <input
              ref={emailRef}
              className="form-input"
              id="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? "email-hint email-error" : "email-hint"}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Sending code…" : "Send code"}
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Check your email</h1>
      <p>
        We sent a sign-in code to <strong>{email}</strong>. It can take a minute to arrive, so check your spam folder too.
      </p>
      <form onSubmit={verify} noValidate>
        <div className={`form-group ${error ? "has-error" : ""}`}>
          <label className="form-label" htmlFor="code">
            Sign-in code
          </label>
          {error && (
            <p className="form-error" id="code-error">
              <span className="visually-hidden">Error: </span>
              {error}
            </p>
          )}
          <input
            ref={codeRef}
            className="form-input code"
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-describedby={error ? "code-error" : undefined}
            aria-invalid={error ? true : undefined}
          />
        </div>
        <div className="actions">
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
          >
            Use a different email
          </button>
        </div>
      </form>
    </>
  );
}

function SignedIn({ status, syncNow }: { status: Extract<SyncStatus, { user: unknown }>; syncNow: () => void }) {
  const [signOutError, setSignOutError] = useState<string | null>(null);
  return (
    <>
      <h1>Your progress is syncing</h1>
      <p>
        Signed in as <strong>{status.user.email ?? "your account"}</strong>. Progress you make on any device where you're
        signed in is combined automatically.
      </p>
      <p className={`sync-line ${status.state}`} role="status">
        {status.state === "syncing" && "Syncing…"}
        {status.state === "synced" && `Last synced at ${status.at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`}
        {status.state === "error" && `Not synced: ${status.message}`}
      </p>
      {signOutError && <p className="form-error">{signOutError}</p>}
      <div className="actions">
        <button className="btn" type="button" onClick={syncNow} disabled={status.state === "syncing"}>
          Sync now
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => signOut().catch((err) => setSignOutError(friendly(err, "We couldn't sign you out. Try again.")))}
        >
          Sign out
        </button>
      </div>
      <p className="footnote">Signing out keeps your progress on this device. It just stops syncing.</p>
    </>
  );
}

/** Supabase messages are written for developers; keep the common ones, fall back to plain words. */
function friendly(err: unknown, fallback: string): string {
  const message = err instanceof Error ? err.message : "";
  if (/rate limit|too many/i.test(message)) return "Too many codes were requested. Wait a few minutes and try again.";
  if (/expired|invalid/i.test(message)) return "That code is wrong or has expired. Check it, or send a new one.";
  if (!navigator.onLine) return "You're offline. Connect to the internet and try again.";
  return fallback;
}
