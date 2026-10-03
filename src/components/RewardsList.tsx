import type { Progress } from "../lib/progress";
import { rewardsBetween } from "../lib/rewards";
import { hrefFor } from "../lib/route";
import BadgeIcon from "./BadgeIcon";
import Spoken from "./Spoken";

/** What the learner earned during a lesson or review, for the done screen. Renders nothing if nothing new. */
export default function RewardsList({ before, after }: { before: Progress; after: Progress }) {
  const r = rewardsBetween(before, after, new Date());
  const items: { key: string; lead: string; detail: string; badge?: boolean }[] = [];
  if (r.levelUp) items.push({ key: "level", lead: `Level up: ${r.levelUp.title}.`, detail: `You've reached level ${r.levelUp.level}.` });
  if (r.freezesEarned)
    items.push({ key: "freeze", lead: r.freezesEarned === 1 ? "Streak freeze earned." : `${r.freezesEarned} streak freezes earned.`, detail: "Each one covers a day you miss." });
  if (r.freezesUsed)
    items.push({ key: "used", lead: "Streak saved.", detail: `A streak freeze covered ${r.freezesUsed === 1 ? "the day" : `the ${r.freezesUsed} days`} you missed.` });
  if (r.goalReached) items.push({ key: "goal", lead: "Daily goal reached.", detail: `${after.goal} XP today.` });
  for (const b of r.badges) items.push({ key: b.id, lead: `New achievement: ${b.name}.`, detail: b.how, badge: true });
  if (!items.length) return null;

  return (
    <div className="rewards">
      <ul>
        {items.map((item) => (
          <li key={item.key} className={item.badge ? "reward badge" : "reward"}>
            {item.badge && <BadgeIcon earned />}
            <Spoken text={`${item.lead} ${item.detail}`}>
              <strong>{item.lead}</strong> {item.detail}
            </Spoken>
          </li>
        ))}
      </ul>
      {(r.badges.length > 0 || r.levelUp) && (
        <p className="rewards-more">
          <a href={hrefFor({ name: "achievements" })}>See all achievements</a>
        </p>
      )}
    </div>
  );
}
