import type { Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import SoundToggle from "./SoundToggle";
import UpdatePrompt from "./UpdatePrompt";
import type { SyncStatus } from "../lib/useCloudSync";

type Props = { progress: Progress; totalLessons: number; syncStatus: SyncStatus };

const syncLabel: Record<SyncStatus["state"], string | null> = {
  off: null,
  checking: null,
  "signed-out": "Sign in to sync",
  syncing: "Account: syncing…",
  synced: "Account: synced",
  error: "Account: not synced",
};

export default function Header({ progress, totalLessons, syncStatus }: Props) {
  const sync = syncLabel[syncStatus.state];
  const done = Object.keys(progress.completedLessons).length;
  return (
    <header className="bar">
      <div className="bar-in">
        <a className="brand" href="#/">
          Open UX <span>Lab</span>
        </a>
        <div className="bar-right">
          <div className="stats" role="group" aria-label="Your progress">
            <span className="chip xp">
              <b>{progress.xp}</b> XP
            </span>
            <span className="chip">
              <b>{progress.streak}</b>-day streak
            </span>
            <span className="chip">
              <b>{done}</b>/{totalLessons} lessons
            </span>
            {sync && (
              <a className={`chip sync ${syncStatus.state}`} href={hrefFor({ name: "account" })}>
                {sync}
              </a>
            )}
          </div>
          <SoundToggle />
        </div>
      </div>
      <UpdatePrompt />
    </header>
  );
}
