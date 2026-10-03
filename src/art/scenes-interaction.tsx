import type { ReactNode } from "react";
import { at, check, from, hero, scene } from "./kit";

/** Scenes for the Interaction design path. Same rules as scenes.tsx. */
export const interactionScenes: Record<string, ReactNode> = {
  // I1: rows gain arrows that say "open me", and a pointer heads for one.
  i1: scene(
    "i1",
    <>
      <rect className="card" x="60" y="16" width="200" height="128" rx="12" />
      {[34, 70, 106].map((y, i) => (
        <g key={y}>
          <rect className="card" x="76" y={y} width="168" height="26" rx="6" />
          <rect className="ink" x="88" y={y + 10} width={[90, 110, 76][i]} height="6" rx="3" />
          <path className="stroke-accent a-pop" style={at(0.4 + i * 0.15)} d={`M224 ${y + 8}l6 5-6 5`} />
        </g>
      ))}
      <path className="cursor a-from" style={from({ x: 40, y: 30, delay: 1.1 })} d="M200 80l0 20 5-5 4 9 4-2-4-9h7z" />
    </>,
  ),

  // I2: a button gains a focus ring, and a switch slides on.
  i2: scene(
    "i2",
    <>
      <rect className="card" x="40" y="30" width="240" height="100" rx="12" />
      <rect className="focus-ring a-pop" style={at(0.4)} x="58" y="58" width="108" height="40" rx="12" />
      <rect className="accent" x="64" y="64" width="96" height="28" rx="8" />
      <text className="on-accent-text" x="112" y="82" textAnchor="middle">
        Save
      </text>
      <rect className="accent-soft" x="190" y="64" width="60" height="28" rx="14" />
      <rect className="accent a-fill" style={at(0.9)} x="190" y="64" width="60" height="28" rx="14" />
      <circle className="on-color-fill a-shift" style={at(0.9)} cx="236" cy="78" r="10" />
      <text className="label-text" x="220" y="114" textAnchor="middle">
        On
      </text>
    </>,
  ),

  // I3: skeleton shapes hold the layout while a progress bar fills.
  i3: scene(
    "i3",
    <>
      <rect className="card" x="50" y="16" width="220" height="128" rx="12" />
      <rect className="ink" x="68" y="32" width="90" height="10" rx="5" />
      {[0, 1].map((i) => (
        <rect key={i} className="ink a-rise" style={at(0.2 + i * 0.12)} x={68 + i * 96} y="52" width="88" height="44" rx="8" />
      ))}
      <rect className="ink" x="68" y="112" width="184" height="10" rx="5" />
      <rect className="accent a-fill" style={at(0.5)} x="68" y="112" width="132" height="10" rx="5" />
    </>,
  ),

  // I4: tabs, with the current one marked by a sliding underline.
  i4: scene(
    "i4",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      {["Overview", "Tasks", "Files"].map((t, i) => (
        <text key={t} className={i === 1 ? "name-text" : "label-text"} x={76 + i * 80} y="54" textAnchor="middle">
          {t}
        </text>
      ))}
      <rect className="ink" x="52" y="64" width="216" height="2" />
      <rect className="accent a-from" style={from({ x: -80, delay: 0.5 })} x="128" y="61" width="64" height="5" rx="2.5" />
      {[84, 98, 112].map((y, i) => (
        <rect key={y} className="ink a-rise" style={at(1 + i * 0.1)} x="60" y={y} width={[180, 140, 160][i]} height="6" rx="3" />
      ))}
    </>,
  ),

  // I5: one row of an accordion opens to reveal more.
  i5: scene(
    "i5",
    <>
      <rect className="card" x="60" y="14" width="200" height="132" rx="12" />
      <rect className="card" x="76" y="28" width="168" height="24" rx="6" />
      <rect className="ink" x="88" y="37" width="80" height="6" rx="3" />
      <rect className="card card-accent" x="76" y="58" width="168" height="24" rx="6" />
      <rect className="fg" x="88" y="67" width="96" height="6" rx="3" />
      <path className="stroke-accent" d="M226 66l5 5 5-5" />
      <g className="origin-top a-from" style={from({ sy: 0, opacity: 0, delay: 0.5 })}>
        {[90, 102, 114].map((y, i) => (
          <rect key={y} className="ink" x="88" y={y} width={[140, 120, 90][i]} height="6" rx="3" />
        ))}
      </g>
      <rect className="card" x="76" y="124" width="168" height="16" rx="6" />
    </>,
  ),

  // I6: a side panel slides in while the page stays visible.
  i6: scene(
    "i6",
    <>
      <rect className="card" x="30" y="16" width="260" height="128" rx="12" />
      {[34, 54, 74, 94].map((y, i) => (
        <rect key={y} className="ink" x="48" y={y} width={[110, 130, 90, 120][i]} height="8" rx="4" />
      ))}
      <g className="a-from" style={from({ x: 90, delay: 0.4 })}>
        <rect className="card card-accent" x="184" y="16" width="106" height="128" rx="12" />
        <rect className="fg" x="198" y="32" width="56" height="8" rx="4" />
        <rect className="card" x="198" y="52" width="78" height="18" rx="4" />
        <rect className="card" x="198" y="78" width="78" height="18" rx="4" />
        <rect className="accent" x="198" y="112" width="52" height="18" rx="6" />
      </g>
    </>,
  ),

  // I7: an item moves along a short eased path into a list.
  i7: scene(
    "i7",
    <>
      <path className="curve a-draw" pathLength={1} style={at(0.2)} d="M60 120C110 120 130 40 200 40" />
      <rect className="card" x="200" y="24" width="80" height="112" rx="10" />
      {[34, 58, 82, 106].map((y, i) => (
        <rect key={y} className={i === 0 ? "accent-soft a-pop" : "ink"} style={i === 0 ? at(1.2) : undefined} x="210" y={y} width="60" height="16" rx="4" />
      ))}
      <circle className="accent a-from" style={from({ x: -140, y: 80, delay: 0.2 })} cx="240" cy="42" r="8" />
    </>,
  ),

  // I8: a big tap target on a phone, with a keyboard alternative.
  i8: scene(
    "i8",
    <>
      <rect className="card" x="56" y="10" width="84" height="140" rx="14" />
      <rect className="ink" x="70" y="30" width="56" height="8" rx="4" />
      <rect className="accent" x="70" y="104" width="56" height="28" rx="8" />
      <circle className="tap-ring a-ring" style={at(0.6)} cx="98" cy="118" r="20" />
      <rect className="card" x="170" y="60" width="110" height="64" rx="10" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="ink" x={180 + i * 24} y="72" width="18" height="16" rx="3" />
      ))}
      <rect className="accent a-pop" style={at(1)} x="204" y="96" width="66" height="16" rx="3" />
    </>,
  ),
};

/** Banner for the Interaction design path: states, tabs, a panel, progress and touch. */
export const interactionHero: ReactNode = hero(
  "interaction",
  <>
    {/* States: a focused button and a switch */}
    <g className="a-rise">
      <rect className="card" x="24" y="30" width="180" height="180" rx="14" />
      <rect className="focus-ring" x="42" y="52" width="144" height="44" rx="12" />
      <rect className="accent" x="48" y="58" width="132" height="32" rx="8" />
      <text className="on-accent-text" x="114" y="78" textAnchor="middle">
        Save changes
      </text>
      <rect className="accent" x="48" y="120" width="64" height="30" rx="15" />
      <circle className="on-color-fill" cx="96" cy="135" r="11" />
      <text className="label-text" x="124" y="139">
        On
      </text>
      <rect className="ink" x="48" y="172" width="132" height="10" rx="5" />
      <rect className="accent a-fill" style={at(0.6)} x="48" y="172" width="92" height="10" rx="5" />
    </g>
    {/* Tabs and an accordion */}
    <g className="a-rise" style={at(0.15)}>
      <rect className="card" x="224" y="30" width="200" height="180" rx="14" />
      {["Details", "Activity", "Files"].map((t, i) => (
        <text key={t} className={i === 0 ? "name-text" : "label-text"} x={260 + i * 64} y="58" textAnchor="middle">
          {t}
        </text>
      ))}
      <rect className="ink" x="236" y="68" width="176" height="2" />
      <rect className="accent" x="236" y="65" width="50" height="5" rx="2.5" />
      <rect className="card" x="240" y="86" width="168" height="24" rx="6" />
      <rect className="card card-accent" x="240" y="116" width="168" height="24" rx="6" />
      <path className="stroke-accent" d="M390 124l5 5 5-5" />
      <g className="origin-top a-from" style={from({ sy: 0, opacity: 0, delay: 0.8 })}>
        {[150, 164, 178].map((y, i) => (
          <rect key={y} className="ink" x="252" y={y} width={[130, 110, 80][i]} height="6" rx="3" />
        ))}
      </g>
    </g>
    {/* Phone with a big tap target */}
    <g className="a-rise" style={at(0.3)}>
      <rect className="card" x="472" y="20" width="112" height="200" rx="18" />
      <rect className="ink" x="490" y="44" width="76" height="10" rx="5" />
      <rect className="ink" x="490" y="66" width="60" height="8" rx="4" />
      <rect className="accent" x="490" y="160" width="76" height="36" rx="10" />
      {check(528, 178, 10)}
    </g>
    <circle className="tap-ring a-ring" style={at(1.1)} cx="528" cy="178" r="26" />
  </>,
);
