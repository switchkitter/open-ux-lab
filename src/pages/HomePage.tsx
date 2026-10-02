import { paths, plannedPaths } from "../content/paths";
import { REVIEW_INTERVALS, dueReviewIds, nextReview, whenLabel, type Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";

export default function HomePage({ progress }: { progress: Progress }) {
  const now = new Date();
  const dueCount = dueReviewIds(progress, now).length;
  const upcoming = nextReview(progress, now);
  const plural = (n: number) => `${n} ${n === 1 ? "exercise" : "exercises"}`;
  const intervals = REVIEW_INTERVALS.join(", then ");

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Free UX practice</div>
        <h1>Learn UX by judging real interface decisions</h1>
        <p className="lede">
          Short lessons, then exercises where you pick the better design and see why. Lessons summarize trusted
          public sources and link to them for the full story.
        </p>
      </section>

      {dueCount > 0 && (
        <section className="panel review">
          <div>
            <h2 className="review-title">{plural(dueCount)} to review today</h2>
            <p>
              Each time you get one right, it comes back later: after {intervals} days. Get it right once more after
              that and it's cleared.
            </p>
          </div>
          <a className="btn" href={hrefFor({ name: "review" })}>
            Start review
          </a>
        </section>
      )}
      {dueCount === 0 && upcoming && (
        <section className="panel review quiet">
          <div>
            <h2 className="review-title">Nothing to review today</h2>
            <p>
              Next review {whenLabel(upcoming.day, now)}: {plural(upcoming.count)}.
            </p>
          </div>
        </section>
      )}

      <a className="panel skills-link" href={hrefFor({ name: "skills" })}>
        <span>
          <span className="skills-link-title">Your skill map</span>
          <span className="skills-link-sub">See your strengths and gaps across all four paths.</span>
        </span>
        <span aria-hidden="true">→</span>
      </a>

      {paths.map((path, pathIndex) => {
        const done = path.lessons.filter((l) => progress.completedLessons[l.id]).length;
        const nextId = path.lessons.find((l) => !progress.completedLessons[l.id])?.id;
        return (
          <section key={path.id}>
            <div className="section-head">
              <div>
                <div className="eyebrow">Path {pathIndex + 1}</div>
                <h2>{path.title}</h2>
              </div>
              <div className="meter">
                <span>
                  {done}/{path.lessons.length}
                </span>
                <span className="meter-track">
                  <i style={{ width: `${(done / path.lessons.length) * 100}%` }} />
                </span>
              </div>
            </div>
            <ol className="path">
              {path.lessons.map((lesson) => {
                const status = progress.completedLessons[lesson.id] ? (
                  <span className="status done">Done</span>
                ) : lesson.id === nextId ? (
                  <span className="status next">Up next</span>
                ) : (
                  <span className="status todo">{lesson.minutes} min</span>
                );
                return (
                  <li key={lesson.id}>
                    <a className="row" href={hrefFor({ name: "lesson", id: lesson.id })}>
                      <span className="code">{lesson.code}</span>
                      <span className="row-title">
                        {lesson.title}
                        <span className="row-sub">{lesson.subtitle}</span>
                      </span>
                      {status}
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {plannedPaths.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Coming paths</h2>
          </div>
          <div className="roadmap">
            {plannedPaths.map((p) => (
              <div className="road" key={p.id}>
                <div className="eyebrow">Planned</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="footnote">
        Lessons are licensed{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>; code is MIT.{" "}
        <a href="https://github.com/switchkitter/open-ux-lab">Source on GitHub</a>.{" "}
        <a href={hrefFor({ name: "privacy" })}>Privacy</a>.
      </p>
    </>
  );
}
