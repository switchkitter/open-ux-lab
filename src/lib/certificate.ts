import { paths } from "../content/catalog";
import type { PathMeta } from "../content/types";
import { hrefFor } from "./route";

/**
 * Path certificates. A certificate lives entirely in its link (#/certificate/<path>/<date>/<name>):
 * nothing is stored on a server, so nothing is verified either, and the page says so.
 */

export const MAX_NAME = 60;
const NAME_KEY = "open-ux-lab:certificate-name";

export type Certificate = { path: PathMeta; learner: string; date: string };

/** Trims, collapses spaces, removes control characters and limits the length. */
export function cleanName(raw: string): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME)
    .trim();
}

function isRealDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/** The certificate a link describes, or null if the link is broken or edited into nonsense. */
export function readCertificate(pathId: string, date: string, learner: string, learningPaths: PathMeta[] = paths): Certificate | null {
  const path = learningPaths.find((p) => p.id === pathId);
  const name = cleanName(learner);
  if (!path || !name || !isRealDay(date)) return null;
  return { path, learner: name, date };
}

export function certificateHref(c: Certificate): string {
  return hrefFor({ name: "certificate", path: c.path.id, date: c.date, learner: c.learner });
}

/** Full link to share. `base` is the app's address, e.g. "https://openuxlab.com/". */
export function certificateUrl(c: Certificate, base: string): string {
  return base + certificateHref(c);
}

/** Opens LinkedIn's "Add license or certification" form, filled in. Only used when the learner chooses it. */
export function linkedInUrl(c: Certificate, base: string): string {
  const [year, month] = c.date.split("-").map(Number);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: c.path.title,
    organizationName: "Open UX Lab",
    issueYear: String(year),
    issueMonth: String(month),
    certUrl: certificateUrl(c, base),
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

export function dayLabel(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

/** The name last used on a certificate, kept in this browser only to fill in the form next time. */
export function loadCertificateName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveCertificateName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Without storage the form just starts empty next time.
  }
}
