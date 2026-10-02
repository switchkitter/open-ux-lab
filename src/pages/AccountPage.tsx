import { useEffect, useRef, useState, type FormEvent } from "react";
import { deleteAccount, sendSignInCode, signOut, verifySignInCode } from "../lib/cloud";
import { emptyProgress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import type { SyncStatus } from "../lib/useCloudSync";
import type { UpdateProgress } from "../lib/useProgress";

type Props = { status: SyncStatus; syncNow: () => void; update: UpdateProgress };

export default function AccountPage({ status, syncNow, update }: Props) {
  // Survives the switch to the signed-out view after an account is deleted.
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        ← Home
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
        {notice && status.state === "signed-out" && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        {status.state === "signed-out" && <SignIn />}
        {(status.state === "syncing" || status.state === "synced" || status.state === "error") && (
          <SignedIn
            status={status}
            syncNow={syncNow}
            onDeleted={(clearedDevice) => {
              if (clearedDevice) update(() => emptyProgress());
              setNotice(
                clearedDevice
                  ? "Your account and synced progress have been deleted, and this browser's progress has been cleared."
                  : "Your account and synced progress have been deleted. Progress saved in this browser is still here.",
              );
            }}
          />
        )}
        <p className="footnote">
          <a href={hrefFor({ name: "privacy" })}>How we handle your data</a>
        </p>
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

type SignedInProps = {
  status: Extract<SyncStatus, { user: unknown }>;
  syncNow: () => void;
  onDeleted: (clearedDevice: boolean) => void;
};

function SignedIn({ status, syncNow, onDeleted }: SignedInProps) {
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
      <DeleteAccount userId={status.user.id} onDeleted={onDeleted} />
    </>
  );
}

function DeleteAccount({ userId, onDeleted }: { userId: string; onDeleted: (clearedDevice: boolean) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [clearDevice, setClearDevice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) headingRef.current?.focus();
  }, [confirming]);

  async function confirmDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteAccount(userId);
      onDeleted(clearDevice);
    } catch (err) {
      setError(friendly(err, "We couldn't delete your account. Check your connection and try again."));
      setBusy(false);
    }
  }

  return (
    <div className="danger-zone">
      <h2>Delete your account</h2>
      {!confirming ? (
        <>
          <p>This permanently deletes your email address and synced progress from our server.</p>
          <div className="actions">
            <button ref={openRef} className="btn ghost danger" type="button" onClick={() => setConfirming(true)}>
              Delete account
            </button>
          </div>
        </>
      ) : (
        <div className="confirm" role="group" aria-labelledby="delete-confirm-title">
          <h3 id="delete-confirm-title" ref={headingRef} tabIndex={-1}>
            Are you sure? This can't be undone.
          </h3>
          <p>Your email address and synced progress will be deleted. Other devices will stop syncing.</p>
          <label className="check">
            <input type="checkbox" checked={clearDevice} onChange={(e) => setClearDevice(e.target.checked)} />
            Also clear the progress saved in this browser
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="actions">
            <button className="btn danger" type="button" onClick={confirmDelete} disabled={busy}>
              {busy ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button
              className="btn ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                setError(null);
                // Return focus to where the person started.
                requestAnimationFrame(() => openRef.current?.focus());
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
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
