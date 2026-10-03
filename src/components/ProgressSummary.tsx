import { currentStreak, dueReviewIds, nextReview, whenLabel, xpToday, type Progress } from "../lib/progress";
import { PRACTICE_SIZE, practiceStatus } from "../lib/practice";
import { levelFor } from "../lib/rewards";
import { hrefFor } from "../lib/route";

const exercises = (n: number) => `${n} ${n === 1 ? "exercise" : "exercises"}`;

/**
 * Home card for returning learners: level, today's goal and streak, the review pile and links to
 * achievements and the skill map. One compact card, so the learning paths start on the first screen on a phone.
 */
export default function ProgressSummary({ progress }: { progress: Progress }) {
  const now = new Date();
  const lv = levelFor(progress.xp);
  const today = xpToday(progress, now);
  const streak = currentStreak(progress, now);
  const due = dueReviewIds(progress, now).length;
  const upcoming = nextReview(progress, now);
  const practice = practiceStatus(progress, now);
  const pct = lv.xpForLevel ? Math.min(100, (lv.xpIntoLevel / lv.xpForLevel) * 100) : 100;
  const goal = today >= progress.goal ? "Daily goal reached" : `Today ${today} of ${progress.goal} XP`;
  const freezes = progress.freezes ? ` · ${progress.freezes} streak ${progress.freezes === 1 ? "freeze" : "freezes"}` : "";

  return (
    <section className="panel you" aria-labelledby="you-heading">
      <h2 id="you-heading" className="you-title">
        {`Level ${lv.level} · ${lv.title}`}
      </h2>
      <div className="you-level">
        <div className="you-bar" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span className="you-note">{lv.next ? `${lv.next.minXp - progress.xp} XP to ${lv.next.title}` : "Top level"}</span>
      </div>
      <p className="you-line">{`${goal} · ${streak}-day streak${freezes}`}</p>

      {due > 0 ? (
        <div className="you-review">
          <p>
            <strong>{`${exercises(due)} to review`}</strong>
          </p>
          <a className="btn small" href={hrefFor({ name: "review" })}>
            Review now
          </a>
        </div>
      ) : (
        upcoming && <p className="you-review quiet">{`Nothing to review today. Next review ${whenLabel(upcoming.day, now)}: ${exercises(upcoming.count)}.`}</p>
      )}

      {practice === "ready" && (
        <div className="you-review">
          <p>
            <strong>{`Daily practice: ${PRACTICE_SIZE} exercises`}</strong>
          </p>
          <a className="btn small" href={hrefFor({ name: "practice" })}>
            Practice
          </a>
        </div>
      )}
      {practice === "done" && <p className="you-review quiet">Daily practice done for today. A new set comes tomorrow.</p>}

      <div className="you-links">
        <a className="btn ghost small" href={hrefFor({ name: "achievements" })}>
          Achievements
        </a>
        <a className="btn ghost small" href={hrefFor({ name: "skills" })}>
          Skill map
        </a>
      </div>
    </section>
  );
}
