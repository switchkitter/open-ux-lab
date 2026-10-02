import type { Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import { skillMap } from "../lib/skills";

export default function SkillsPage({ progress }: { progress: Progress }) {
  const map = skillMap(progress);
  const started = map.filter((s) => s.level !== "Not started").length;

  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        ← Home
      </a>
      <section>
        <div className="eyebrow">Skill map</div>
        <h1 className="page-title">Your skills</h1>
        <p className="lede">
          Each skill draws on lessons from several paths. An exercise counts as solid once you've answered it and it isn't
          waiting in your review pile.{" "}
          {started === 0 ? "Finish a lesson to start filling this in." : `You've started ${started} of ${map.length} skills.`}
        </p>
      </section>
      <ul className="skills">
        {map.map((s) => {
          const pct = s.total ? Math.round((s.solid / s.total) * 100) : 0;
          return (
            <li key={s.id} className="skill panel">
              <div className="skill-head">
                <h2>{s.name}</h2>
                <span className={`level ${s.level.replace(/\s+/g, "-").toLowerCase()}`}>{s.level}</span>
              </div>
              <p className="skill-desc">{s.description}</p>
              <div className="skill-bar" aria-hidden="true">
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="skill-count">
                {s.solid} of {s.total} exercises solid
                {s.inReview > 0 && ` · ${s.inReview} in review`}
              </p>
              {s.next ? (
                <p className="skill-next">
                  {progress.completedLessons[s.next.id] ? "Practice again: " : "Next: "}
                  <a href={hrefFor({ name: "lesson", id: s.next.id })}>
                    {s.next.title}
                  </a>
                </p>
              ) : (
                <p className="skill-next">Every exercise for this skill is solid.</p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
