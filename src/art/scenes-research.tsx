import type { ReactNode } from "react";
import { at, check, from, scene } from "./kit";

/** Scenes for the UX research methods path. Same rules as scenes.tsx. */
export const researchScenes: Record<string, ReactNode> = {
  // R1: a question chooses between what people say and what they do; "do" wins for this one.
  r1: scene(
    "r1",
    <>
      <g className="a-rise">
        <path className="card" d="M52 34h92a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H80l-14 12V90H52a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z" />
        <rect className="ink" x="58" y="50" width="76" height="6" rx="3" />
        <rect className="ink" x="58" y="64" width="56" height="6" rx="3" />
        <text className="label-text" x="58" y="122">SAY</text>
      </g>
      <g className="a-rise" style={at(0.2)}>
        <rect className="card" x="176" y="34" width="104" height="70" rx="8" />
        <rect className="ink" x="188" y="48" width="60" height="6" rx="3" />
        <rect className="accent" x="188" y="74" width="44" height="16" rx="8" />
        <path className="cursor" d="M226 82v16l4-4 3 7 3-1-3-7h6z" />
        <text className="label-text" x="176" y="122">DO</text>
      </g>
      <rect className="focus-ring a-pop d-late" x="170" y="28" width="116" height="82" rx="12" />
      <g className="a-pop" style={at(0.9)}>
        <circle className="accent" cx="160" cy="134" r="12" />
        <text className="help-text" x="160" y="138.5" textAnchor="middle">?</text>
      </g>
    </>,
  ),

  // R2: a one-page plan whose sections tick off one by one.
  r2: scene(
    "r2",
    <>
      <rect className="card a-rise" x="96" y="14" width="128" height="134" rx="10" />
      <rect className="fg a-rise" x="112" y="28" width="70" height="8" rx="4" />
      {[50, 72, 94, 116].map((y, i) => (
        <g key={y}>
          <rect className="ink" x="132" y={y - 3} width={[72, 56, 64, 48][i]} height="6" rx="3" />
          <g className="a-pop" style={at(0.5 + i * 0.25)}>
            <circle className="good" cx="119" cy={y} r="7" />
            {check(119, y, 7)}
          </g>
        </g>
      ))}
      <g className="a-from" style={from({ x: 20, opacity: 0, delay: 0.3 })}>
        <rect className="card" x="234" y="40" width="54" height="56" rx="8" />
        <rect className="accent" x="234" y="40" width="54" height="14" rx="7" />
        <rect className="accent" x="234" y="47" width="54" height="7" />
        <circle className="accent" cx="252" cy="72" r="5" />
        <circle className="ink" cx="270" cy="72" r="5" />
      </g>
    </>,
  ),

  // R3: a small, varied group of participants joins, one at a time.
  r3: scene(
    "r3",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      {[72, 116, 160, 204, 248].map((cx, i) => (
        <g key={cx} className="a-rise" style={at(0.15 + i * 0.18)}>
          <circle className={["accent", "mark", "good", "fg", "accent-soft-strong"][i]} cx={cx} cy="68" r="12" />
          <path className={["accent", "mark", "good", "fg", "accent-soft-strong"][i]} d={`M${cx - 18} 106a18 18 0 0 1 36 0z`} />
        </g>
      ))}
      <g className="a-pop" style={at(1.2)}>
        <circle className="accent" cx="262" cy="46" r="10" />
        <text className="on-accent-text" x="262" y="49.5" textAnchor="middle">5</text>
      </g>
    </>,
  ),

  // R4: a short open question, then a long answer.
  r4: scene(
    "r4",
    <>
      <g className="a-rise">
        <path className="accent" d="M48 30h96a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H72l-12 10V62H48a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" />
        <rect className="on-accent-bar" x="56" y="42" width="78" height="6" rx="3" />
      </g>
      <g className="a-rise" style={at(0.6)}>
        <path className="card" d="M112 78h152a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8h-14v12l-14-12H112a8 8 0 0 1-8-8V86a8 8 0 0 1 8-8z" />
        <rect className="ink" x="118" y="90" width="138" height="6" rx="3" />
        <rect className="ink" x="118" y="102" width="120" height="6" rx="3" />
        <rect className="ink" x="118" y="114" width="90" height="6" rx="3" />
      </g>
    </>,
  ),

  // R5: a participant works through a task while thinking aloud.
  r5: scene(
    "r5",
    <>
      <rect className="card" x="40" y="22" width="180" height="116" rx="12" />
      <rect className="fg" x="56" y="38" width="90" height="8" rx="4" />
      <rect className="ink" x="56" y="58" width="140" height="6" rx="3" />
      <rect className="card" x="56" y="74" width="148" height="20" rx="6" />
      <rect className="accent" x="56" y="106" width="70" height="20" rx="10" />
      <g className="a-from" style={from({ x: 70, y: -40, delay: 0.3 })}>
        <path className="cursor" d="M96 112v18l5-5 3 8 4-2-3-8h7z" />
      </g>
      <g className="a-pop" style={at(1.1)}>
        <path className="card" d="M236 44h52a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-36l-10 10v-10h-6a8 8 0 0 1-8-8V52a8 8 0 0 1 8-8z" />
        <rect className="ink" x="242" y="56" width="44" height="5" rx="2.5" />
        <rect className="ink" x="242" y="66" width="30" height="5" rx="2.5" />
      </g>
    </>,
  ),

  // R6: an answer is chosen and the results fill in.
  r6: scene(
    "r6",
    <>
      <rect className="card" x="40" y="24" width="124" height="112" rx="10" />
      <rect className="fg" x="54" y="38" width="80" height="7" rx="3.5" />
      {[62, 84, 106].map((cy, i) => (
        <g key={cy}>
          <circle className="radio" cx="62" cy={cy} r="7" />
          <rect className="ink" x="76" y={cy - 3} width={[64, 50, 58][i]} height="6" rx="3" />
        </g>
      ))}
      <circle className="accent a-pop" style={at(0.4)} cx="62" cy="84" r="3.5" />
      <rect className="card" x="178" y="24" width="102" height="112" rx="10" />
      {[46, 72, 98].map((y, i) => (
        <rect key={y} className="accent origin-left a-from" style={from({ sx: 0, delay: 0.7 + i * 0.15 })} x="192" y={y} width={[62, 40, 24][i]} height="14" rx="4" />
      ))}
    </>,
  ),

  // R7: scattered notes gather into two themes.
  r7: scene(
    "r7",
    <>
      <rect className="card" x="40" y="18" width="240" height="124" rx="12" />
      {[
        { x: 70, y: 52, fx: 90, fy: 40 },
        { x: 104, y: 52, fx: 120, fy: 56 },
        { x: 70, y: 86, fx: 140, fy: 0 },
        { x: 104, y: 86, fx: 30, fy: 30 },
        { x: 190, y: 52, fx: -100, fy: 50 },
        { x: 224, y: 52, fx: -40, fy: 60 },
        { x: 190, y: 86, fx: -120, fy: -20 },
      ].map((n, i) => (
        <rect key={i} className={i < 4 ? "mark-soft a-from" : "good-soft-fill a-from"} style={from({ x: n.fx, y: n.fy, delay: 0.3 })} x={n.x} y={n.y} width="28" height="28" rx="3" />
      ))}
      <rect className="fg a-pop d-late" x="70" y="34" width="62" height="7" rx="3.5" />
      <rect className="fg a-pop d-late" x="190" y="34" width="62" height="7" rx="3.5" />
      <rect className="region a-pop d-late" x="62" y="44" width="78" height="78" rx="10" />
      <rect className="region a-pop d-late" x="182" y="44" width="78" height="78" rx="10" />
    </>,
  ),

  // R8: a plain-language consent card gets an informed "yes", protected by a shield.
  r8: scene(
    "r8",
    <>
      <rect className="card" x="64" y="20" width="160" height="120" rx="12" />
      <rect className="fg" x="80" y="34" width="90" height="8" rx="4" />
      {[54, 68, 82, 96].map((y, i) => (
        <rect key={y} className="ink" x="80" y={y} width={[124, 110, 118, 90][i]} height="6" rx="3" />
      ))}
      <rect className="card" x="80" y="112" width="16" height="16" rx="4" />
      <path className="stroke-good a-pop" style={at(0.9)} d="M83 120l4 4 7-8" />
      <rect className="ink" x="104" y="117" width="70" height="6" rx="3" />
      <g className="a-pop" style={at(1.3)}>
        <path className="good" d="M252 52l20 8v15c0 12-8 21-20 25-12-4-20-13-20-25V60z" />
        <circle className="on-color-fill" cx="252" cy="72" r="5" />
        <path className="on-color-fill" d="M243 90a9 9 0 0 1 18 0z" />
      </g>
    </>,
  ),
};
