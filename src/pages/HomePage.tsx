import { pathIcons } from "../art";
import ProgressSummary from "../components/ProgressSummary";
import { paths, plannedPaths } from "../content/catalog";
import type { Progress } from "../lib/progress";
import { pathStatus } from "../lib/pathStatus";
import { hrefFor } from "../lib/route";

export default function HomePage({ progress }: { progress: Progress }) {
  // The pitch is for first-time visitors; once someone has started, their progress comes first instead.
  const returning = progress.xp > 0 || Object.keys(progress.seen).length > 0;

  return (
    <>
      {returning ? (
        <section className="hero compact">
          <h1>Welcome back</h1>
        </section>
      ) : (
        <section className="hero">
          <div className="eyebrow">Free UX practice</div>
          <h1>Learn UX by judging real interface decisions</h1>
          <p className="lede">
            Short lessons, then exercises where you pick the better design and see why. Lessons summarize trusted
            public sources and link to them for the full story.
          </p>
        </section>
      )}

      {returning && <ProgressSummary progress={progress} />}

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
                  {/* Pinned to the bottom of the card, so these line up across a row whatever the description length. */}
                  <span className="path-card-foot">
                    <span className="path-card-meta">
                      {`${st.total} lessons · about ${st.minutes} min`}
                    </span>
                    <span className="meter">
                      <span id={`card-${path.id}-progress`}>
                        {`${st.done} of ${st.total} lessons done`}
                      </span>
                      <span className="meter-track" aria-hidden="true">
                        <i style={{ width: `${(st.done / st.total) * 100}%` }} />
                      </span>
                    </span>
                    <span className={`path-card-next ${st.state}`} id={`card-${path.id}-next`}>
                      {st.state === "complete" ? "Completed" : st.state === "not-started" ? `Start with: ${st.next!.title}` : `Up next: ${st.next!.title}`}
                    </span>
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
        <a href={hrefFor({ name: "account" })}>Back up your progress</a>.{" "}
        <a href={hrefFor({ name: "privacy" })}>Privacy</a>.{" "}
        <a href={hrefFor({ name: "credits" })}>Sources and credits</a>.
      </p>
    </>
  );
}
