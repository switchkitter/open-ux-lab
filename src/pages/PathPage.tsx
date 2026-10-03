import { pathHeroes } from "../art";
import { paths } from "../content/catalog";
import CertificateOffer from "../components/CertificateOffer";
import LessonList from "../components/LessonList";
import type { PathMeta } from "../content/types";
import { pathStatus } from "../lib/pathStatus";
import { CHALLENGE_PASS, CHALLENGE_SIZE, challengePassed, type Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";

/** One learning path: its overview, progress, a single main action, and its lessons. */
export default function PathPage({ path, progress }: { path: PathMeta; progress: Progress }) {
  const s = pathStatus(path, progress);
  const first = path.lessons[0];
  const action =
    s.state === "complete"
      ? { label: "Practice again from the start", id: first.id }
      : s.state === "not-started"
        ? { label: `Start: ${first.title}`, id: first.id }
        : { label: `Continue: ${s.next!.title}`, id: s.next!.id };

  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        <span aria-hidden="true">←</span> Home
      </a>
      <section className="path-hero">
        {pathHeroes[path.id] && <figure className={`path-banner tone-${paths.indexOf(path) % 3}`}>{pathHeroes[path.id]}</figure>}
        <div>
          <div className="eyebrow">
            {`Path · ${s.total} lessons · about ${s.minutes} min`}
          </div>
          <h1 className="page-title">{path.title}</h1>
          <p className="lede">{path.description}</p>
          <div className="meter path-meter">
            <span>
              {`${s.done} of ${s.total} done`}
            </span>
            <span className="meter-track" aria-hidden="true">
              <i style={{ width: `${(s.done / s.total) * 100}%` }} />
            </span>
          </div>
          <div className="actions">
            {/* On a finished path the challenge (or the certificate) below is the main action, so this one is secondary. */}
            <a className={s.state === "complete" ? "btn ghost" : "btn"} href={hrefFor({ name: "lesson", id: action.id })}>
              {action.label}
            </a>
          </div>
        </div>
      </section>
      {s.state === "complete" && <ChallengePanel path={path} progress={progress} />}
      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="lessons-heading">
          Lessons
        </h2>
        <LessonList path={path} progress={progress} />
      </section>
    </>
  );
}

/** On a finished path: the challenge that unlocks the certificate, then the certificate itself. */
function ChallengePanel({ path, progress }: { path: PathMeta; progress: Progress }) {
  const result = progress.challenges[path.id];
  if (challengePassed(progress, path.id)) {
    return (
      <>
        <section className="panel challenge-panel" aria-labelledby="challenge-heading">
          <h2 id="challenge-heading">Path challenge passed</h2>
          <p>{`Best score: ${result!.best} of ${CHALLENGE_SIZE}.`}</p>
          <div className="actions">
            <a className="btn ghost small" href={hrefFor({ name: "challenge", id: path.id })}>
              Take it again
            </a>
          </div>
        </section>
        <CertificateOffer path={path} />
      </>
    );
  }
  return (
    <section className="panel challenge-panel" aria-labelledby="challenge-heading">
      <h2 id="challenge-heading">Path challenge</h2>
      <p>{`${CHALLENGE_SIZE} questions from across this path, with no hints until the end. Score ${CHALLENGE_PASS} or more to earn your certificate.`}</p>
      {result && <p className="challenge-best">{`Best so far: ${result.best} of ${CHALLENGE_SIZE}.`}</p>}
      <div className="actions">
        <a className="btn" href={hrefFor({ name: "challenge", id: path.id })}>
          {result ? "Try the challenge again" : "Start the challenge"}
        </a>
      </div>
    </section>
  );
}
