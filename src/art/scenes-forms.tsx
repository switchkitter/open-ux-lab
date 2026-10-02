import type { ReactNode } from "react";
import { at, check, from, scene } from "./kit";

/** Scenes for the Form design path. Same rules as scenes.tsx. */
export const formsScenes: Record<string, ReactNode> = {
  // F1: extra questions drop away and the form shrinks to what's needed.
  f1: scene(
    "f1",
    <>
      <rect className="card" x="70" y="12" width="180" height="138" rx="12" />
      <rect className="fg" x="88" y="28" width="100" height="9" rx="4.5" />
      <rect className="ink" x="88" y="48" width="50" height="6" rx="3" />
      <rect className="card" x="88" y="58" width="144" height="18" rx="5" />
      <g className="a-fade-out d-early">
        <rect className="card" x="88" y="88" width="144" height="14" rx="5" />
        <rect className="card" x="88" y="108" width="144" height="14" rx="5" />
      </g>
      <rect className="accent a-from" style={from({ y: 40, delay: 0.5 })} x="88" y="88" width="72" height="20" rx="10" />
    </>,
  ),

  // F2: one long form becomes small pages with one thing each.
  f2: scene(
    "f2",
    <>
      <g className="a-fade-out d-early">
        <rect className="card" x="110" y="16" width="100" height="128" rx="10" />
        {[30, 46, 62, 78, 94, 110].map((y) => (
          <rect key={y} className="ink" x="122" y={y} width="76" height="8" rx="4" />
        ))}
      </g>
      {[52, 128, 204].map((x, i) => (
        <g key={x} className="a-rise" style={at(0.6 + i * 0.2)}>
          <rect className={i === 0 ? "card card-accent" : "card"} x={x} y="34" width="64" height="84" rx="9" />
          <rect className="fg" x={x + 10} y="48" width="40" height="7" rx="3.5" />
          <rect className="card" x={x + 10} y="64" width="44" height="14" rx="4" />
          <rect className="accent" x={x + 10} y="94" width="28" height="12" rx="6" />
        </g>
      ))}
      {[148, 160, 172].map((cx, i) => (
        <circle key={cx} className={i === 0 ? "accent" : "ink"} cx={cx} cy="134" r="3.5" />
      ))}
    </>,
  ),

  // F3: one-size fields shrink to fit the answers they expect.
  f3: scene(
    "f3",
    <>
      <rect className="card" x="40" y="20" width="240" height="120" rx="12" />
      {[
        { y: 34, w: 70 },
        { y: 68, w: 120 },
        { y: 102, w: 44 },
      ].map((f, i) => (
        <g key={f.y}>
          <rect className="ink" x="60" y={f.y} width="56" height="6" rx="3" />
          <rect className="card origin-left a-from" style={from({ sx: 200 / f.w, delay: 0.3 + i * 0.2 })} x="60" y={f.y + 10} width={f.w} height="16" rx="5" />
        </g>
      ))}
    </>,
  ),

  // F4: a name with an accent and an apostrophe is accepted as written.
  f4: scene(
    "f4",
    <>
      <rect className="card" x="40" y="34" width="240" height="92" rx="12" />
      <rect className="ink" x="60" y="50" width="70" height="6" rx="3" />
      <rect className="card" x="60" y="62" width="200" height="32" rx="8" />
      <text className="name-text a-type" x="72" y="83">Siobhán D'Arcy</text>
      <rect className="stroke-good a-pop d-late" x="60" y="62" width="200" height="32" rx="8" />
      <g className="a-pop d-late">
        <circle className="good" cx="241" cy="78" r="9" />
        {check(241, 78, 9)}
      </g>
      <rect className="ink" x="60" y="104" width="120" height="5" rx="2.5" />
    </>,
  ),

  // F5: day, month and year are typed straight in.
  f5: scene(
    "f5",
    <>
      <rect className="card" x="40" y="28" width="240" height="104" rx="12" />
      <rect className="fg" x="60" y="44" width="130" height="8" rx="4" />
      {[
        { x: 60, w: 40, t: "14" },
        { x: 110, w: 40, t: "3" },
        { x: 160, w: 64, t: "1990" },
      ].map((b, i) => (
        <g key={b.x}>
          <rect className="card" x={b.x} y="64" width={b.w} height="36" rx="7" />
          <text className="date-text a-pop" style={at(0.3 + i * 0.3)} x={b.x + b.w / 2} y="88" textAnchor="middle">
            {b.t}
          </text>
        </g>
      ))}
      <rect className="ink" x="60" y="112" width="100" height="5" rx="2.5" />
    </>,
  ),

  // F6: a dropdown opens up into visible radio buttons.
  f6: scene(
    "f6",
    <>
      <rect className="card" x="40" y="22" width="240" height="116" rx="12" />
      <rect className="fg" x="60" y="38" width="120" height="8" rx="4" />
      <g className="a-fade-out d-mid">
        <rect className="card" x="60" y="56" width="150" height="26" rx="7" />
        <rect className="ink" x="72" y="66" width="60" height="6" rx="3" />
        <path className="stroke-muted" d="M188 66l5 5 5-5" />
      </g>
      {[66, 92, 118].map((cy, i) => (
        <g key={cy} className="a-rise" style={at(0.9 + i * 0.15)}>
          <circle className="radio" cx="70" cy={cy} r="7" />
          {i === 0 && <circle className="accent" cx="70" cy={cy} r="3.5" />}
          <rect className="ink" x="86" y={cy - 3.5} width={[96, 76, 86][i]} height="7" rx="3.5" />
        </g>
      ))}
    </>,
  ),

  // F7: unexplained asterisks give way to one plain "(optional)".
  f7: scene(
    "f7",
    <>
      <rect className="card" x="40" y="20" width="240" height="120" rx="12" />
      {[34, 70, 106].map((y, i) => (
        <g key={y}>
          <rect className="fg" x="60" y={y} width={[60, 82, 70][i]} height="7" rx="3.5" />
          <rect className="card" x="60" y={y + 12} width="200" height="14" rx="5" />
        </g>
      ))}
      <g className="a-fade-out d-mid">
        {[{ x: 126, y: 34 }, { x: 148, y: 70 }, { x: 136, y: 106 }].map((p) => (
          <text key={p.y} className="bad-text" x={p.x} y={p.y + 9}>*</text>
        ))}
      </g>
      <g className="a-pop d-late">
        <rect className="ink" x="138" y="103" width="62" height="14" rx="7" />
        <text className="tiny-text" x="169" y="113.5" textAnchor="middle">(optional)</text>
      </g>
    </>,
  ),

  // F8: an error summary appears and points to the field to fix.
  f8: scene(
    "f8",
    <>
      <rect className="card" x="40" y="12" width="240" height="136" rx="12" />
      <g className="a-from" style={from({ y: -12, opacity: 0, delay: 0.3 })}>
        <rect className="summary" x="56" y="24" width="208" height="48" rx="6" />
        <rect className="fg" x="68" y="34" width="90" height="7" rx="3.5" />
        <rect className="accent" x="68" y="48" width="120" height="5" rx="2.5" />
        <rect className="accent" x="68" y="58" width="96" height="5" rx="2.5" />
      </g>
      <rect className="ink" x="56" y="84" width="60" height="6" rx="3" />
      <rect className="bad a-rise d-late" x="56" y="96" width="110" height="6" rx="3" />
      <rect className="card" x="56" y="108" width="208" height="26" rx="6" />
      <rect className="stroke-bad a-pop d-late" x="56" y="108" width="208" height="26" rx="6" />
    </>,
  ),
};
