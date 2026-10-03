import type { Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import SoundToggle from "./SoundToggle";
import UpdatePrompt from "./UpdatePrompt";
import Spoken from "./Spoken";
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
              <Spoken text={`${progress.streak}-day streak`}>
                <b>{progress.streak}</b>-day streak
              </Spoken>
            </span>
            <span className="chip">
              <Spoken text={`${done} of ${totalLessons} lessons done`}>
                <b>{done}</b>/{totalLessons} lessons
              </Spoken>
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
