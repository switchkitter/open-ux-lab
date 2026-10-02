import type { Progress } from "../lib/progress";

type Props = { progress: Progress; totalLessons: number };

export default function Header({ progress, totalLessons }: Props) {
  const done = Object.keys(progress.completedLessons).length;
  return (
    <header className="bar">
      <div className="bar-in">
        <a className="brand" href="#/">
          Open UX <span>Lab</span>
        </a>
        <div className="stats" aria-label="Your progress">
          <span className="chip xp">
            <b>{progress.xp}</b> XP
          </span>
          <span className="chip">
            <b>{progress.streak}</b>-day streak
          </span>
          <span className="chip">
            <b>{done}</b>/{totalLessons} lessons
          </span>
        </div>
      </div>
    </header>
  );
}
