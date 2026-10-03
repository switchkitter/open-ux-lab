import { useState } from "react";
import { certificateUrl, dayLabel, linkedInUrl, type Certificate } from "../lib/certificate";
import { certificateImage } from "../lib/certificateImage";
import { hrefFor } from "../lib/route";
import { saveFile } from "../lib/saveFile";

type Message = { kind: "ok" | "error"; text: string };

/** The app's own address, e.g. "https://openuxlab.com/", so links work on preview builds too. */
const base = () => `${window.location.origin}${window.location.pathname}`;

/** A certificate, built entirely from its link. Anyone with the link sees the same page. */
export default function CertificatePage({ certificate: c }: { certificate: Certificate | null }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [busy, setBusy] = useState(false);

  if (!c) {
    return (
      <>
        <a className="back" href={hrefFor({ name: "home" })}>
          <span aria-hidden="true">←</span> Home
        </a>
        <section className="panel">
          <h1 className="page-title">This certificate link doesn't work</h1>
          <p>It may have been cut off when it was copied. Ask the person who shared it to send the whole link again.</p>
        </section>
      </>
    );
  }

  const url = certificateUrl(c, base());
  const exercises = c.path.lessons.reduce((n, l) => n + l.exercises.length, 0);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage({ kind: "ok", text: "Link copied." });
    } catch {
      setMessage({ kind: "error", text: "Couldn't copy automatically. Select the link above and copy it." });
    }
  }

  async function saveImage() {
    setBusy(true);
    try {
      const file = await certificateImage(c!, base().replace(/^https?:\/\//, "").replace(/\/$/, ""));
      const result = await saveFile(file, `Certificate: ${c!.path.title}`);
      if (result === "shared") setMessage({ kind: "ok", text: "Image ready to share." });
      if (result === "downloaded") setMessage({ kind: "ok", text: `Saved ${file.name} to your downloads.` });
    } catch {
      setMessage({ kind: "error", text: "Couldn't make the image. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        <span aria-hidden="true">←</span> Home
      </a>

      <article className="certificate" aria-labelledby="cert-name">
        <div className="cert-brand">
          Open UX <span>Lab</span>
        </div>
        <div className="eyebrow">Certificate of completion</div>
        <h1 id="cert-name" className="cert-name">
          {c.learner}
        </h1>
        <p className="cert-line">completed the learning path</p>
        <p className="cert-path">{c.path.title}</p>
        <p className="cert-detail">{`${c.path.lessons.length} lessons · ${exercises} exercises`}</p>
        <svg className="cert-seal" viewBox="0 0 60 60" width="60" height="60" aria-hidden="true" focusable="false">
          <circle cx="30" cy="30" r="26" />
          <path d="M18 31l8 8 16-17" />
        </svg>
        <p className="cert-date">{dayLabel(c.date)}</p>
      </article>

      <section className="panel cert-share" aria-labelledby="cert-share-heading">
        <h2 id="cert-share-heading">Share it</h2>
        <label className="form-label" htmlFor="cert-link">
          Certificate link
        </label>
        <input id="cert-link" className="form-input" readOnly value={url} onFocus={(e) => e.target.select()} />
        <div className="actions">
          <button className="btn" type="button" onClick={() => void copy()}>
            Copy link
          </button>
          <button className="btn ghost" type="button" disabled={busy} onClick={() => void saveImage()}>
            {busy ? "Making image…" : "Save as image"}
          </button>
          <a className="btn ghost" href={linkedInUrl(c, base())} target="_blank" rel="noopener noreferrer">
            Add to LinkedIn
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
        <div role="status">
          {message && (
            <p className={message.kind === "error" ? "form-error" : "notice"}>
              {message.kind === "error" && <span className="visually-hidden">Error: </span>}
              {message.text}
            </p>
          )}
        </div>
        <p className="footnote">
          Open UX Lab builds this page from its link. We don't store certificates or check who earned them.
        </p>
      </section>

      <p className="cert-try">
        <a href={hrefFor({ name: "path", id: c.path.id })}>{`Try the ${c.path.title} path yourself, free`}</a>
      </p>
    </>
  );
}
