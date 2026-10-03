import { MAX_FREEZES, currentStreak, xpToday, type Progress } from "../lib/progress";
import { BADGES, levelFor } from "../lib/rewards";
import { hrefFor } from "../lib/route";

/** Home panel: level, today's goal and streak, linking to the achievements page. */
export default function ProgressSummary({ progress }: { progress: Progress }) {
  const now = new Date();
  const lv = levelFor(progress.xp);
  const today = xpToday(progress, now);
  const goalMet = today >= progress.goal;
  const streak = currentStreak(progress, now);
  const earned = BADGES.filter((b) => progress.badges[b.id]).length;
  const pct = (n: number, of: number) => `${Math.min(100, of ? (n / of) * 100 : 100)}%`;

  return (
    <section className="panel you" aria-labelledby="you-level">
      <div className="you-part">
        <div className="eyebrow">{`Level ${lv.level}`}</div>
        <h2 id="you-level" className="you-title">
          {lv.title}
        </h2>
        <div className="you-bar" aria-hidden="true">
          <i style={{ width: pct(lv.xpIntoLevel, lv.xpForLevel) }} />
        </div>
        <p className="you-note">{lv.next ? `${lv.next.minXp - progress.xp} XP to ${lv.next.title}` : "Top level reached"}</p>
      </div>
      <div className="you-part">
        <div className="eyebrow">Today</div>
        <p className="you-title">{goalMet ? "Daily goal reached" : `${today} of ${progress.goal} XP`}</p>
        <div className={`you-bar goal ${goalMet ? "met" : ""}`} aria-hidden="true">
          <i style={{ width: pct(today, progress.goal) }} />
        </div>
        <p className="you-note">
          {`${streak}-day streak · ${progress.freezes} of ${MAX_FREEZES} streak freezes`}
        </p>
      </div>
      <a className="you-link" href={hrefFor({ name: "achievements" })}>
        {`Achievements: ${earned} of ${BADGES.length}`}
        <span aria-hidden="true"> →</span>
      </a>
    </section>
  );
}
