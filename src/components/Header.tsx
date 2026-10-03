import { currentStreak, type Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import UpdatePrompt from "./UpdatePrompt";
import Spoken from "./Spoken";
import type { SyncStatus } from "../lib/useCloudSync";

type Props = { progress: Progress; totalLessons: number; syncStatus: SyncStatus };

/**
 * The account link. It shows a settled state, not activity: progress is always saved on the device
 * first, so a background sync never needs the learner to wait. "Syncing…" would suggest they can't
 * leave. Only a failed sync changes it. `spoken` names the destination for screen readers and
 * includes the visible words (WCAG 2.5.3).
 */
const syncLabel: Record<SyncStatus["state"], { shown: string; spoken: string; mark?: string } | null> = {
  off: null,
  checking: null,
  // "Sign in" suggested an account was required, but it is optional and only syncs progress.
  "signed-out": { shown: "Sync progress", spoken: "Sync progress" },
  syncing: { shown: "Synced", spoken: "Account, progress synced", mark: "✓" },
  synced: { shown: "Synced", spoken: "Account, progress synced", mark: "✓" },
  error: { shown: "Not synced", spoken: "Account, progress not synced" },
};

export default function Header({ progress, totalLessons, syncStatus }: Props) {
  const sync = syncLabel[syncStatus.state];
  const done = Object.keys(progress.completedLessons).length;
  const streak = currentStreak(progress, new Date());
  return (
    <header className="bar">
      <div className="bar-in">
        <a className="brand" href="#/">
          <Spoken text="Open UX Lab">
            Open UX <span>Lab</span>
          </Spoken>
        </a>
        <div className="bar-right">
          <div className="stats" role="group" aria-label="Your progress">
            <span className="chip xp">
              <Spoken text={`${progress.xp} XP`}>
                <b>{progress.xp}</b> XP
              </Spoken>
            </span>
            <span className="chip">
              <Spoken text={`${streak}-day streak`}>
                <b>{streak}</b>-day streak
              </Spoken>
            </span>
            <span className="chip">
              <Spoken text={`${done} of ${totalLessons} lessons done`}>
                <b>{done}</b>/{totalLessons} lessons
              </Spoken>
            </span>
          </div>
          {/* An action, not a progress number, so it sits outside the progress group, next to the sound toggle. */}
          {sync && (
            <a className={`account-link ${syncStatus.state}`} href={hrefFor({ name: "account" })}>
              <Spoken text={sync.spoken}>
                {sync.mark && <span className="sync-mark">{sync.mark}</span>}
                {sync.shown}
              </Spoken>
            </a>
          )}
          <ThemeToggle />
          <SoundToggle />
        </div>
      </div>
      <UpdatePrompt />
    </header>
  );
}
