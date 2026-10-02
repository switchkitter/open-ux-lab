import type { ReactNode } from "react";
import { at, from, scene } from "./kit";

// Chunking (L4): nine characters, evenly spaced at first, then grouped in threes.
const CHARS = ["Q", "X", "7", "K", "2", "M", "9", "P", "L"];
const evenX = (i: number) => 58 + i * 23;
const groupX = (i: number) => 58 + Math.floor(i / 3) * 74 + (i % 3) * 20;

// Proximity (L5): eight dots in an even grid gather into two groups.
const DOTS = [
  { even: [100, 64], final: [92, 64] }, { even: [140, 64], final: [118, 64] },
  { even: [180, 64], final: [202, 64] }, { even: [220, 64], final: [228, 64] },
  { even: [100, 96], final: [92, 96] }, { even: [140, 96], final: [118, 96] },
  { even: [180, 96], final: [202, 96] }, { even: [220, 96], final: [228, 96] },
];

/** Scenes for the Laws of UX path. Same rules as scenes.tsx. */
export const lawsScenes: Record<string, ReactNode> = {
  // L1: your site puts the cart where every other site does.
  l1: scene(
    "l1",
    <>
      {[30, 122, 214].map((x, i) => (
        <g key={x} className="a-rise" style={at(i === 2 ? 0.8 : 0.1 + i * 0.2)}>
          <rect className={i === 2 ? "card card-accent" : "card"} x={x} y="30" width="76" height="100" rx="9" />
          <rect className="ink" x={x} y="30" width="76" height="20" rx="9" />
          <rect className="ink" x={x} y="40" width="76" height="10" />
          <rect className="fg" x={x + 8} y="37" width="22" height="6" rx="3" />
          <path className="stroke-accent" d={`M${x + 55} 36h3l2 7h8l1.5-5h-10`} />
          <rect className="ink" x={x + 8} y="62" width="56" height="7" rx="3.5" />
          <rect className="ink" x={x + 8} y="76" width="44" height="7" rx="3.5" />
          <rect className="ink" x={x + 8} y="96" width="60" height="24" rx="5" />
        </g>
      ))}
    </>,
  ),

  // L2: the pointer heads for a big, close target and clicks.
  l2: scene(
    "l2",
    <>
      <rect className="card" x="40" y="26" width="240" height="108" rx="12" />
      <rect className="ink" x="60" y="44" width="110" height="8" rx="4" />
      <rect className="accent" x="132" y="66" width="128" height="38" rx="19" />
      <rect className="on-accent-bar" x="168" y="82" width="56" height="6" rx="3" />
      <circle className="tap-ring a-ring d-late" cx="206" cy="88" r="16" />
      <g className="a-from" style={from({ x: -130, y: 32, delay: 0.2 })}>
        <path className="cursor" d="M200 82v20l5-5 4 9 4-2-4-9h7z" />
      </g>
      <rect className="accent" x="60" y="116" width="40" height="4" rx="2" />
    </>,
  ),

  // L3: a row of look-alike options becomes three clear ones, one recommended.
  l3: scene(
    "l3",
    <>
      <rect className="card" x="40" y="20" width="240" height="120" rx="12" />
      <g className="a-fade-out d-mid">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} className="card" x={54 + i * 36} y="46" width="30" height="68" rx="6" />
        ))}
      </g>
      {[60, 128, 196].map((x, i) => (
        <g key={x} className="a-rise" style={at(1 + i * 0.12)}>
          <rect className={i === 1 ? "card card-accent" : "card"} x={x} y="46" width="62" height="74" rx="9" />
          <rect className="fg" x={x + 10} y="60" width="34" height="7" rx="3.5" />
          <rect className="ink" x={x + 10} y="74" width="42" height="5" rx="2.5" />
          <rect className={i === 1 ? "accent" : "ink"} x={x + 10} y="100" width="42" height="12" rx="6" />
        </g>
      ))}
      <rect className="accent a-pop d-late" x="139" y="38" width="40" height="12" rx="6" />
    </>,
  ),

  // L4: a long code is easier to hold in mind in chunks of three.
  l4: scene(
    "l4",
    <>
      <rect className="card" x="40" y="40" width="240" height="80" rx="12" />
      {CHARS.map((c, i) => (
        <g key={i} className="a-from" style={from({ x: evenX(i) - groupX(i), delay: 0.5 })}>
          <rect className="chip-fill" x={groupX(i)} y="62" width="18" height="28" rx="4" />
          <text className="chip-text" x={groupX(i) + 9} y="81" textAnchor="middle">{c}</text>
        </g>
      ))}
      {[0, 1, 2].map((g) => (
        <rect key={g} className="accent a-pop d-late" x={58 + g * 74} y="98" width="58" height="3" rx="1.5" />
      ))}
    </>,
  ),

  // L5: dots move into two groups and a region makes the grouping clear.
  l5: scene(
    "l5",
    <>
      <rect className="card" x="40" y="26" width="240" height="108" rx="12" />
      <rect className="region a-pop d-late" x="74" y="46" width="62" height="68" rx="14" />
      <rect className="region a-pop d-late" x="184" y="46" width="62" height="68" rx="14" />
      {DOTS.map((d, i) => (
        <circle key={i} className="fg a-from" style={from({ x: d.even[0] - d.final[0], delay: 0.3 })} cx={d.final[0]} cy={d.final[1]} r="7" />
      ))}
    </>,
  ),

  // L6: one item in the row stands out.
  l6: scene(
    "l6",
    <>
      <rect className="card" x="40" y="40" width="240" height="80" rx="12" />
      {[0, 1, 2, 4].map((i) => (
        <rect key={i} className="ink" x={56 + i * 44} y="68" width="36" height="24" rx="12" />
      ))}
      <rect className="ink a-fade-out d-mid" x="188" y="68" width="36" height="24" rx="12" />
      <rect className="accent a-pop d-mid" x="185" y="64" width="42" height="32" rx="16" />
    </>,
  ),

  // L7: a journey's line draws out; its peak and its ending are what people remember.
  l7: scene(
    "l7",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      <path className="stroke-muted thin" d="M58 118h204" />
      <path className="curve a-draw" pathLength={1} d="M60 104C84 100 100 96 118 92S146 50 160 44S190 98 210 94S240 72 258 62" />
      <circle className="mark a-pop" style={at(0.9)} cx="160" cy="44" r="7" />
      <circle className="good a-pop" style={at(1.5)} cx="258" cy="62" r="7" />
    </>,
  ),

  // L8: the complexity moves from the person to the system.
  l8: scene(
    "l8",
    <>
      <rect className="card" x="40" y="28" width="240" height="104" rx="12" />
      <circle className="fg" cx="78" cy="68" r="11" />
      <path className="fg" d="M60 108a18 18 0 0 1 36 0z" />
      <circle className="gear-teeth" cx="240" cy="82" r="20" />
      <circle className="accent" cx="240" cy="82" r="15" />
      <circle className="bg-fill" cx="240" cy="82" r="5" />
      <g className="a-from" style={from({ x: -72, delay: 0.4 })}>
        <rect className="mark" x="164" y="58" width="36" height="36" rx="6" />
        <path className="stroke-bg" d="M172 70c4-4 8 4 12 0s8 4 12 0M172 82c4-4 8 4 12 0s8 4 12 0" />
      </g>
      <path className="stroke-muted thin a-draw" pathLength={1} d="M110 118h100m-6-5l6 5-6 5" />
    </>,
  ),
};
