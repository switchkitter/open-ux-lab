import { pathHeroes } from "../art";
import { paths } from "../content/paths";
import LessonList from "../components/LessonList";
import type { LearningPath } from "../content/types";
import { pathStatus } from "../lib/pathStatus";
import type { Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";

/** One learning path: its overview, progress, a single main action, and its lessons. */
export default function PathPage({ path, progress }: { path: LearningPath; progress: Progress }) {
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
        ← Home
      </a>
      <section className="path-hero">
        {pathHeroes[path.id] && <figure className={`path-banner tone-${paths.indexOf(path) % 3}`}>{pathHeroes[path.id]}</figure>}
        <div>
          <div className="eyebrow">
            Path · {s.total} lessons · about {s.minutes} min
          </div>
          <h1 className="page-title">{path.title}</h1>
          <p className="lede">{path.description}</p>
          <div className="meter path-meter">
            <span>
              {s.done} of {s.total} done
            </span>
            <span className="meter-track" aria-hidden="true">
              <i style={{ width: `${(s.done / s.total) * 100}%` }} />
            </span>
          </div>
          <div className="actions">
            <a className="btn" href={hrefFor({ name: "lesson", id: action.id })}>
              {action.label}
            </a>
          </div>
        </div>
      </section>
      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="lessons-heading">
          Lessons
        </h2>
        <LessonList path={path} progress={progress} />
      </section>
    </>
  );
}
