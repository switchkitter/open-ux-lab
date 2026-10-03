import { useRef, useState, type FormEvent } from "react";
import type { PathMeta } from "../content/types";
import { MAX_NAME, certificateHref, cleanName, loadCertificateName, readCertificate, saveCertificateName } from "../lib/certificate";
import { dayKey } from "../lib/progress";

/** Shown on a finished path: asks for the name to put on the certificate, then opens it. */
export default function CertificateOffer({ path }: { path: PathMeta }) {
  const [name, setName] = useState(loadCertificateName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function create(e: FormEvent) {
    e.preventDefault();
    const clean = cleanName(name);
    if (!clean) {
      setError("Enter the name to show on your certificate");
      inputRef.current?.focus();
      return;
    }
    saveCertificateName(clean);
    const certificate = readCertificate(path.id, dayKey(new Date()), clean)!;
    window.location.hash = certificateHref(certificate);
  }

  return (
    <section className="panel certificate-offer" aria-labelledby="cert-offer-heading">
      <h2 id="cert-offer-heading">You finished this path</h2>
      <p>Get a certificate to share on LinkedIn or keep for your portfolio.</p>
      <form onSubmit={create} noValidate>
        <div className={`form-group ${error ? "has-error" : ""}`}>
          <label className="form-label" htmlFor="cert-name">
            Name on your certificate
          </label>
          <div className="form-hint" id="cert-name-hint">
            It goes only into the certificate's link. We don't store it.
          </div>
          {error && (
            <p className="form-error" id="cert-name-error">
              <span className="visually-hidden">Error: </span>
              {error}
            </p>
          )}
          <input
            ref={inputRef}
            className="form-input"
            id="cert-name"
            autoComplete="name"
            maxLength={MAX_NAME}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby={error ? "cert-name-hint cert-name-error" : "cert-name-hint"}
            aria-invalid={error ? true : undefined}
          />
        </div>
        <button className="btn" type="submit">
          Create certificate
        </button>
      </form>
    </section>
  );
}
