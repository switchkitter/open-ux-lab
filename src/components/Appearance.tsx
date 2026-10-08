import { ACCENTS, setAccent, useAccent } from "../lib/accent";
import { LEVELS, levelFor } from "../lib/rewards";
import { setTheme, useTheme, type ThemeChoice } from "../lib/theme";

const OPTIONS: { value: ThemeChoice; label: string; hint: string }[] = [
  { value: "system", label: "Match my device", hint: "Light or dark, following your device's setting" },
  { value: "light", label: "Light", hint: "Always light" },
  { value: "dark", label: "Dark", hint: "Always dark" },
];

/** Theme choice on the account page, including "Match my device", which the header switch doesn't offer, and accent colors unlocked by level. */
export default function Appearance({ xp }: { xp: number }) {
  const { choice } = useTheme();
  const accent = useAccent();
  const { level } = levelFor(xp);
  const open = ACCENTS.filter((a) => a.level <= level);
  const locked = ACCENTS.filter((a) => a.level > level);
  return (
    <div className="appearance">
      <h2>Appearance</h2>
      <fieldset className="goal-options">
        <legend>Theme</legend>
        {OPTIONS.map((o) => (
          <label key={o.value} className="check">
            <input type="radio" name="theme" checked={choice === o.value} onChange={() => setTheme(o.value)} />
            <span>
              <strong>{o.label}</strong>
              <span className="goal-hint">{` (${o.hint})`}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset className="goal-options">
        <legend>Accent color</legend>
        {open.map((a) => (
          <label key={a.id} className="check">
            <input type="radio" name="accent" checked={accent === a.id} onChange={() => setAccent(a.id)} />
            <span className="swatch" data-accent={a.id} aria-hidden="true" />
            <strong>{a.name}</strong>
          </label>
        ))}
      </fieldset>
      {locked.length > 0 && (
        <div className="locked-accents">
          <h3>{`Locked colors (${locked.length})`}</h3>
          <ul>
            {locked.map((a) => {
              const reach = LEVELS.find((l) => l.level === a.level)!;
              return (
                <li key={a.id}>
                  <LockIcon />
                  <span className="swatch" data-accent={a.id} aria-hidden="true" />
                  <span>
                    <strong>{a.name}</strong>
                    <span className="goal-hint">{` Reach level ${reach.level}, ${reach.title}: ${reach.minXp - xp} XP to go`}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <p className="footnote">Saved on this device.</p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg className="lock-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
