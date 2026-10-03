import { setTheme, useTheme, type ThemeChoice } from "../lib/theme";

const OPTIONS: { value: ThemeChoice; label: string; hint: string }[] = [
  { value: "system", label: "Match my device", hint: "Light or dark, following your device's setting" },
  { value: "light", label: "Light", hint: "Always light" },
  { value: "dark", label: "Dark", hint: "Always dark" },
];

/** Theme choice on the account page, including "Match my device", which the header switch doesn't offer. */
export default function Appearance() {
  const { choice } = useTheme();
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
      <p className="footnote">Saved on this device.</p>
    </div>
  );
}
