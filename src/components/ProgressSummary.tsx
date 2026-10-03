import { currentStreak, dueReviewIds, nextReview, whenLabel, xpToday, type Progress } from "../lib/progress";
import { paths } from "../content/catalog";
import { nextStep } from "../lib/pathStatus";
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
  const next = nextStep(paths, progress);
  // One primary button: review if anything is due, else the next lesson or challenge, else practice.
  const primary = due > 0 ? "review" : next ? "next" : "practice";
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

      {/* The main action comes first: review when anything is due. */}
      {due > 0 && (
        <div className="you-review">
          <p>
            <strong>{`${exercises(due)} to review`}</strong>
          </p>
          <a className="btn small" href={hrefFor({ name: "review" })}>
            Review now
          </a>
        </div>
      )}

      {next && (
        <div className="you-review">
          <p>
            <strong>{next.kind === "lesson" ? `Up next: ${next.lesson.title}` : `Up next: ${next.path.title} challenge`}</strong>
          </p>
          <a
            className={primary === "next" ? "btn small" : "btn ghost small"}
            href={next.kind === "lesson" ? hrefFor({ name: "lesson", id: next.lesson.id }) : hrefFor({ name: "challenge", id: next.path.id })}
          >
            {next.kind === "lesson" ? "Continue" : "Start"}
          </a>
        </div>
      )}

      {due === 0 && upcoming && (
        <p className="you-review quiet">{`Nothing to review today. Next review ${whenLabel(upcoming.day, now)}: ${exercises(upcoming.count)}.`}</p>
      )}

      {practice === "ready" && (
        <div className="you-review">
          <p>
            <strong>{`Daily practice: ${PRACTICE_SIZE} exercises`}</strong>
          </p>
          {/* Secondary unless it is the only next step (see `primary`). */}
          <a className={primary === "practice" ? "btn small" : "btn ghost small"} href={hrefFor({ name: "practice" })}>
            Practice
          </a>
        </div>
      )}
      {practice === "done" && <p className="you-review quiet">Daily practice done for today. A new set comes tomorrow.</p>}

      <div className="you-links">
        <a className="btn ghost small" href={hrefFor({ name: "achievements" })}>
          <LinkIcon d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
          Achievements
        </a>
        <a className="btn ghost small" href={hrefFor({ name: "skills" })}>
          <LinkIcon d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />
          Skill map
        </a>
      </div>
    </section>
  );
}

/** A small decorative line icon in the accent color; the link text names the destination. */
function LinkIcon({ d }: { d: string }) {
  return (
    <svg className="you-link-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
