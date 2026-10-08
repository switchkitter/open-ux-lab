import { useState } from "react";
import BadgeIcon from "../components/BadgeIcon";
import { DAILY_GOALS, MAX_FREEZES, setGoal, type Progress } from "../lib/progress";
import { accentUnlockedAt } from "../lib/accent";
import { BADGES, LEVELS, levelFor } from "../lib/rewards";
import { hrefFor } from "../lib/route";
import type { UpdateProgress } from "../lib/useProgress";

type Props = { progress: Progress; update: UpdateProgress };

const dateLabel = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

export default function AchievementsPage({ progress, update }: Props) {
  const lv = levelFor(progress.xp);
  const earned = BADGES.filter((b) => progress.badges[b.id]).length;
  const [saved, setSaved] = useState(false);

  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        <span aria-hidden="true">←</span> Home
      </a>
      <section>
        <div className="eyebrow">{`Level ${lv.level} · ${progress.xp} XP`}</div>
        <h1 className="page-title">Your achievements</h1>
        <p className="lede">
          XP builds your level. Each new level earns a streak freeze, and some bring a new accent color for the app. Every
          lesson is always open: rewards never lock any learning.
        </p>
      </section>

      <section className="panel ach-section" aria-labelledby="levels-heading">
        <h2 id="levels-heading">Levels</h2>
        <ol className="levels">
          {LEVELS.map((l) => {
            const accent = accentUnlockedAt(l.level);
            const state = l.level < lv.level ? "Reached" : l.level === lv.level ? "Your level" : `${l.minXp - progress.xp} XP to go`;
            return (
              <li key={l.level} className={l.level === lv.level ? "current" : l.level < lv.level ? "reached" : ""}>
                <span className="levels-name">{`${l.level}. ${l.title}${accent ? ` (${accent.name} accent color)` : ""}`}</span>
                <span className="levels-state">{`${l.minXp} XP · ${state}`}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel ach-section" aria-labelledby="goal-heading">
        <h2 id="goal-heading">Daily goal</h2>
        <fieldset className="goal-options">
          <legend>How much XP do you want to earn each day?</legend>
          {DAILY_GOALS.map((g) => (
            <label key={g.xp} className="check">
              <input
                type="radio"
                name="goal"
                checked={progress.goal === g.xp}
                onChange={() => {
                  update((p) => setGoal(p, g.xp, new Date()));
                  setSaved(true);
                }}
              />
              <span>
                <strong>{`${g.name}: ${g.xp} XP a day`}</strong>
                <span className="goal-hint">{` (${g.hint})`}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <p className="footnote" role="status">
          {saved ? "Saved. Your new goal starts counting today." : ""}
        </p>
      </section>

      <section className="panel ach-section" aria-labelledby="freeze-heading">
        <h2 id="freeze-heading">Streak freezes</h2>
        <p>{`You have ${progress.freezes} of ${MAX_FREEZES}. If you miss a day, a freeze covers it and your streak carries on. You earn one each time you reach a new level.`}</p>
      </section>

      <section aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="paths-heading">
          {`Badges: ${earned} of ${BADGES.length} earned`}
        </h2>
        <ul className="badges">
          {/* Earned first, so learners see what they have without scrolling past the locked ones. */}
          {[...BADGES].sort((a, b) => Number(!progress.badges[a.id]) - Number(!progress.badges[b.id])).map((b) => {
            const day = progress.badges[b.id];
            return (
              <li key={b.id} className={`badge-card panel ${day ? "earned" : "locked"}`}>
                <BadgeIcon earned={Boolean(day)} />
                <div>
                  <h3>{b.name}</h3>
                  <p>{b.how}</p>
                  <p className="badge-state">{day ? `Earned ${dateLabel(day)}` : "Not earned yet"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
