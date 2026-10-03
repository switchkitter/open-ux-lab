import type { ReactNode } from "react";
import { at, check, from, hero, scene } from "./kit";

/** Scenes for the UX writing and microcopy path. Same rules as scenes.tsx. */
export const writingScenes: Record<string, ReactNode> = {
  // W1: a jargon word fades away and a plain button takes its place.
  w1: scene(
    "w1",
    <>
      <rect className="card" x="70" y="22" width="180" height="116" rx="12" />
      <rect className="ink" x="90" y="38" width="80" height="7" rx="3.5" />
      <text className="chip-text a-fade-out" style={at(0.5)} x="160" y="72" textAnchor="middle">
        Authenticate
      </text>
      <g className="a-pop" style={at(1)}>
        <rect className="accent" x="110" y="56" width="100" height="28" rx="14" />
        <text className="on-accent-text" x="160" y="74" textAnchor="middle">
          Sign in
        </text>
      </g>
      {[98, 112].map((y, i) => (
        <rect key={y} className="ink a-rise" style={at(1.3 + i * 0.1)} x="90" y={y} width={[130, 90][i]} height="6" rx="3" />
      ))}
    </>,
  ),

  // W2: a pointer presses a button whose label names the action.
  w2: scene(
    "w2",
    <>
      <rect className="card" x="60" y="20" width="200" height="120" rx="12" />
      <rect className="fg" x="80" y="36" width="90" height="9" rx="4.5" />
      {[54, 66].map((y, i) => (
        <rect key={y} className="ink" x="80" y={y} width={[150, 120][i]} height="6" rx="3" />
      ))}
      <g className="a-press" style={at(1.2)}>
        <rect className="accent" x="80" y="84" width="104" height="28" rx="8" />
        <text className="on-accent-text" x="132" y="102" textAnchor="middle">
          Send invoice
        </text>
      </g>
      <path className="stroke-accent thin-2 a-draw" pathLength={1} style={at(0.4)} d="M196 104h44" />
      <path className="cursor a-from" style={from({ x: 50, y: 30, delay: 0.5 })} d="M168 100l0 20 5-5 4 9 4-2-4-9h7z" />
    </>,
  ),

  // W3: an error appears next to the field, saying how to fix it.
  w3: scene(
    "w3",
    <>
      <rect className="card" x="40" y="18" width="240" height="124" rx="12" />
      <rect className="ink" x="60" y="34" width="70" height="7" rx="3.5" />
      <g className="a-rise" style={at(0.6)}>
        <path className="bad" d="M68 52l9 15h-18z" />
        <text className="bad-text" x="84" y="66">Use 12+ characters</text>
      </g>
      <rect className="stroke-bad-fill a-pop" style={at(0.3)} x="60" y="76" width="200" height="28" rx="6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} className="muted" cx={74 + i * 12} cy="90" r="3" />
      ))}
      <rect className="ink a-rise" style={at(1)} x="60" y="116" width="96" height="16" rx="5" />
    </>,
  ),

  // W4: an empty tray gains a short explanation and one clear action.
  w4: scene(
    "w4",
    <>
      <rect className="card" x="60" y="18" width="200" height="124" rx="12" />
      <path className="stroke-muted a-pop" d="M128 58l8-20h48l8 20v18h-64z M128 58h18l4 6h20l4-6h18" />
      <rect className="ink a-rise" style={at(0.6)} x="104" y="88" width="112" height="7" rx="3.5" />
      <g className="a-pop" style={at(1)}>
        <rect className="accent" x="112" y="104" width="96" height="24" rx="12" />
        <text className="on-accent-text" x="160" y="120" textAnchor="middle">
          Create a project
        </text>
      </g>
    </>,
  ),

  // W5: a dialog asks a specific question and names both answers.
  w5: scene(
    "w5",
    <>
      <g className="a-zoom" style={at(0.2)}>
        <rect className="card" x="64" y="24" width="192" height="112" rx="12" />
        <text className="name-text" x="82" y="50">
          Delete Q3 budget.xlsx?
        </text>
        <rect className="ink" x="82" y="60" width="150" height="6" rx="3" />
        <rect className="ink" x="82" y="72" width="110" height="6" rx="3" />
        <rect className="card" x="82" y="96" width="70" height="26" rx="8" />
        <text className="tiny-text" x="117" y="113" textAnchor="middle">
          Keep file
        </text>
        <rect className="bad" x="160" y="96" width="78" height="26" rx="8" />
        <text className="on-good-text" x="199" y="113" textAnchor="middle">
          Delete file
        </text>
      </g>
    </>,
  ),

  // W6: rows move to the archive and a specific confirmation slides up.
  w6: scene(
    "w6",
    <>
      <rect className="card" x="60" y="14" width="200" height="132" rx="12" />
      {[30, 50, 70].map((y, i) => (
        <rect key={y} className="ink a-slide-away" style={at(0.3 + i * 0.12)} x="78" y={y} width="164" height="12" rx="4" />
      ))}
      <rect className="ink" x="78" y="30" width="120" height="12" rx="4" />
      <g className="a-toast" style={at(1.2)}>
        <rect className="good-soft-fill" x="74" y="98" width="172" height="34" rx="8" />
        <circle className="good" cx="94" cy="115" r="9" />
        {check(94, 115, 9)}
        <text className="chip-text" x="110" y="120">
          3 files archived
        </text>
      </g>
    </>,
  ),

  // W7: one voice, with the tone dialed from playful to serious for a payment problem.
  w7: scene(
    "w7",
    <>
      <g className="a-pop" style={at(0.2)}>
        <path className="mark-soft" d="M40 26h110a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H70l-14 12V72H40a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10z" />
        <text className="chip-text" x="95" y="54" textAnchor="middle">
          Nice work!
        </text>
      </g>
      <g className="a-pop" style={at(0.5)}>
        <path className="card" d="M170 26h110a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-16v12l-14-12H170a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10z" />
        <text className="tiny-text" x="225" y="47" textAnchor="middle">
          Your payment didn't
        </text>
        <text className="tiny-text" x="225" y="60" textAnchor="middle">
          go through.
        </text>
      </g>
      <rect className="ink" x="60" y="118" width="200" height="6" rx="3" />
      <text className="label-text" x="60" y="144">
        Playful
      </text>
      <text className="label-text" x="260" y="144" textAnchor="end">
        Serious
      </text>
      <circle className="accent a-shift" style={at(0.9)} cx="230" cy="121" r="10" />
    </>,
  ),

  // W8: the eye runs down the start of each line, where the key words are.
  w8: scene(
    "w8",
    <>
      <rect className="card" x="60" y="16" width="200" height="128" rx="12" />
      {[34, 60, 86, 112].map((y, i) => (
        <g key={y} className="a-rise" style={at(0.2 + i * 0.12)}>
          <rect className="fg" x="80" y={y} width={[52, 64, 46, 58][i]} height="10" rx="4" />
          <rect className="ink" x={[138, 150, 132, 144][i]} y={y + 2} width={[80, 70, 96, 70][i]} height="6" rx="3" />
        </g>
      ))}
      <path className="guide a-draw" pathLength={1} style={at(0.9)} d="M72 30v96" />
    </>,
  ),
};

/** Banner for the UX writing path: a button label, a helpful error, a clear dialog and a specific success message. */
export const writingHero: ReactNode = hero(
  "writing",
  <>
    {/* Page with a pencil */}
    <g className="a-rise">
      <rect className="card" x="24" y="30" width="170" height="180" rx="14" />
      <rect className="fg" x="44" y="52" width="100" height="12" rx="5" />
      {[78, 94, 110, 126].map((y, i) => (
        <rect key={y} className="ink" x="44" y={y} width={[130, 116, 124, 80][i]} height="7" rx="3.5" />
      ))}
      <rect className="accent" x="44" y="152" width="110" height="34" rx="10" />
      <text className="on-accent-text" x="99" y="173" textAnchor="middle">
        Send application
      </text>
    </g>
    <path className="stroke-accent a-draw" pathLength={1} style={at(0.6)} d="M44 140h70" />
    {/* Error message next to a field */}
    <g className="a-rise" style={at(0.15)}>
      <rect className="card" x="214" y="30" width="200" height="86" rx="14" />
      <path className="bad" d="M230 46l8 14h-16z" />
      <text className="bad-text" x="244" y="59">Use 12+ characters</text>
      <rect className="stroke-bad-fill" x="232" y="70" width="164" height="28" rx="6" />
    </g>
    {/* Confirmation dialog */}
    <g className="a-zoom" style={at(0.5)}>
      <rect className="card" x="214" y="128" width="200" height="82" rx="14" />
      <text className="name-text" x="232" y="154">
        Delete this project?
      </text>
      <rect className="card" x="232" y="168" width="76" height="26" rx="8" />
      <text className="tiny-text" x="270" y="185" textAnchor="middle">
        Keep project
      </text>
      <rect className="bad" x="316" y="168" width="80" height="26" rx="8" />
      <text className="on-good-text" x="356" y="185" textAnchor="middle">
        Delete project
      </text>
    </g>
    {/* Empty state and success toast */}
    <g className="a-rise" style={at(0.3)}>
      <rect className="card" x="434" y="30" width="182" height="120" rx="14" />
      <path className="stroke-muted" d="M494 74l7-18h42l7 18v16h-56z M494 74h16l3 5h18l3-5h16" />
      <rect className="ink" x="470" y="104" width="110" height="7" rx="3.5" />
      <rect className="accent" x="480" y="118" width="90" height="20" rx="10" />
    </g>
    <g className="a-toast" style={at(1.1)}>
      <rect className="good-soft-fill" x="434" y="166" width="182" height="44" rx="12" />
      <circle className="good" cx="458" cy="188" r="10" />
      {check(458, 188, 10)}
      <text className="chip-text" x="476" y="193">
        Invoice sent
      </text>
    </g>
  </>,
);
