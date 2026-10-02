import { pathIcons } from "../art";
import { paths, plannedPaths } from "../content/paths";
import { REVIEW_INTERVALS, dueReviewIds, nextReview, whenLabel, type Progress } from "../lib/progress";
import { pathStatus } from "../lib/pathStatus";
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
          <span className="skills-link-sub">See your strengths and gaps across all paths.</span>
        </span>
        <span aria-hidden="true">→</span>
      </a>

      <section aria-labelledby="paths-heading">
        <h2 id="paths-heading" className="paths-heading">
          Learning paths
        </h2>
        <ul className="path-cards">
          {paths.map((path, i) => {
            const st = pathStatus(path, progress);
            return (
              <li key={path.id}>
                {/* Name the link by its title; progress and the next lesson are read as its description. */}
                <a
                  className={`path-card tone-${i % 3}`}
                  href={hrefFor({ name: "path", id: path.id })}
                  aria-labelledby={`card-${path.id}-title`}
                  aria-describedby={`card-${path.id}-progress card-${path.id}-next`}
                >
                  <span className="path-icon" aria-hidden="true">
                    {pathIcons[path.id]}
                  </span>
                  <span className="path-card-title" id={`card-${path.id}-title`}>
                    {path.title}
                  </span>
                  <span className="path-card-desc">{path.description}</span>
                  <span className="path-card-meta">
                    {st.total} lessons · about {st.minutes} min
                  </span>
                  <span className="meter">
                    <span id={`card-${path.id}-progress`}>
                      {st.done} of {st.total} lessons done
                    </span>
                    <span className="meter-track" aria-hidden="true">
                      <i style={{ width: `${(st.done / st.total) * 100}%` }} />
                    </span>
                  </span>
                  <span className={`path-card-next ${st.state}`} id={`card-${path.id}-next`}>
                    {st.state === "complete" ? "Completed" : st.state === "not-started" ? `Start with: ${st.next!.title}` : `Up next: ${st.next!.title}`}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

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
        <a href={hrefFor({ name: "privacy" })}>Privacy</a>.{" "}
        <a href={hrefFor({ name: "credits" })}>Sources and credits</a>.
      </p>
    </>
  );
}
