import type { ReactNode } from "react";
import { at, from, scene } from "./kit";

/** Scenes for the Accessibility basics path. Same rules as scenes.tsx. */
export const accessibilityScenes: Record<string, ReactNode> = {
  // A1: a training video gains captions.
  a1: scene(
    "a1",
    <>
      <rect className="card" x="40" y="18" width="240" height="124" rx="12" />
      <rect className="fg" x="56" y="30" width="208" height="82" rx="8" />
      <path className="bg-fill" d="M150 56l24 14-24 14z" />
      <g className="a-rise d-mid">
        <rect className="bg-fill" x="92" y="90" width="136" height="14" rx="4" />
        <rect className="fg" x="100" y="95" width="82" height="4" rx="2" />
        <rect className="fg" x="188" y="95" width="32" height="4" rx="2" />
      </g>
      <rect className="ink" x="56" y="122" width="160" height="6" rx="3" />
      <rect className="accent" x="56" y="122" width="62" height="6" rx="3" />
      <g className="a-pop d-late">
        <rect className="accent" x="228" y="116" width="36" height="18" rx="4" />
        <text className="on-accent-text" x="246" y="129" textAnchor="middle">CC</text>
      </g>
    </>,
  ),

  // A2: a picture gets a text description.
  a2: scene(
    "a2",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      <rect className="mark-soft" x="58" y="40" width="104" height="80" rx="8" />
      <path className="mark" d="M66 112l26-34 18 22 12-14 30 26z" />
      <circle className="mark" cx="140" cy="58" r="8" />
      <g className="a-rise d-mid">
        <path className="card" d="M184 50h76a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8h-76a8 8 0 0 1-8-8v-12l-8-6 8-6V58a8 8 0 0 1 8-8z" />
        <text className="label-text" x="186" y="44">alt</text>
        <rect className="accent" x="188" y="64" width="66" height="6" rx="3" />
        <rect className="ink" x="188" y="78" width="48" height="6" rx="3" />
      </g>
    </>,
  ),

  // A3: pale text darkens until it's readable.
  a3: scene(
    "a3",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      <g className="a-fade-out d-mid">
        <rect className="ink" x="60" y="44" width="140" height="11" rx="5.5" />
        <rect className="ink" x="60" y="68" width="190" height="7" rx="3.5" />
        <rect className="ink" x="60" y="82" width="150" height="7" rx="3.5" />
      </g>
      <g className="a-rise d-mid">
        <rect className="fg" x="60" y="44" width="140" height="11" rx="5.5" />
        <rect className="muted" x="60" y="68" width="190" height="7" rx="3.5" />
        <rect className="muted" x="60" y="82" width="150" height="7" rx="3.5" />
      </g>
      <g className="a-pop d-late">
        <rect className="good" x="200" y="100" width="62" height="22" rx="11" />
        <text className="on-good-text" x="231" y="115" textAnchor="middle">4.5:1</text>
      </g>
    </>,
  ),

  // A4: color-only status dots gain words and icons.
  a4: scene(
    "a4",
    <>
      <rect className="card" x="40" y="22" width="240" height="116" rx="12" />
      {[
        { y: 46, dot: "good", soft: "good-soft-fill", stroke: "stroke-good", mark: "l3 3 6-6", dx: 0 },
        { y: 80, dot: "bad", soft: "bad-soft-fill", stroke: "stroke-bad", mark: "m0-3l6 6m0-6l-6 6", dx: 0 },
        { y: 114, dot: "mark", soft: "mark-soft-fill", stroke: "stroke-mark", mark: "m3-4v5m0 3v.5", dx: 0 },
      ].map((r, i) => (
        <g key={r.y}>
          <circle className={r.dot} cx="64" cy={r.y} r="7" />
          <rect className="ink" x="80" y={r.y - 4} width="88" height="8" rx="4" />
          <g className="a-rise" style={at(0.5 + i * 0.25)}>
            <rect className={r.soft} x="184" y={r.y - 10} width="76" height="20" rx="10" />
            <path className={r.stroke} d={`M194 ${r.y}${r.mark}`} />
            <rect className={r.dot} x="210" y={r.y - 2.5} width="38" height="5" rx="2.5" />
          </g>
        </g>
      ))}
    </>,
  ),

  // A5: Tab moves a clear focus ring from button to button.
  a5: scene(
    "a5",
    <>
      <g className="a-press">
        <rect className="card" x="44" y="18" width="44" height="26" rx="6" />
        <text className="key-text small" x="66" y="35" textAnchor="middle">Tab</text>
      </g>
      <rect className="card" x="40" y="54" width="240" height="80" rx="12" />
      {[60, 132, 204].map((x) => (
        <g key={x}>
          <rect className="card" x={x} y="80" width="56" height="28" rx="8" />
          <rect className="ink" x={x + 12} y="91" width="32" height="6" rx="3" />
        </g>
      ))}
      <rect className="focus-ring a-tab" x="199" y="75" width="66" height="38" rx="12" />
    </>,
  ),

  // A6: a page's headings form a clear outline.
  a6: scene(
    "a6",
    <>
      <rect className="card" x="40" y="16" width="240" height="128" rx="12" />
      <path className="stroke-muted thin" d="M66 48v66M66 60h8M66 98h8" />
      {[
        { x: 60, y: 30, w: 130, h: 12, c: "fg" },
        { x: 80, y: 55, w: 96, h: 9, c: "accent" },
        { x: 96, y: 74, w: 110, h: 6, c: "ink" },
        { x: 80, y: 93, w: 84, h: 9, c: "accent" },
        { x: 96, y: 112, w: 100, h: 6, c: "ink" },
        { x: 96, y: 126, w: 70, h: 6, c: "ink" },
      ].map((b, i) => (
        <rect key={i} className={`${b.c} a-rise`} style={at(0.15 + i * 0.18)} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.h / 2} />
      ))}
    </>,
  ),

  // A7: placeholder-only text gives way to a real label.
  a7: scene(
    "a7",
    <>
      <rect className="card" x="40" y="28" width="240" height="104" rx="12" />
      <rect className="fg a-rise d-mid" x="60" y="48" width="72" height="8" rx="4" />
      <rect className="card" x="60" y="64" width="200" height="32" rx="8" />
      <rect className="ink a-fade-out d-early" x="74" y="77" width="84" height="7" rx="3.5" />
      <rect className="fg a-type d-late" x="74" y="77" width="116" height="7" rx="3.5" />
      <rect className="ink a-rise d-late" x="60" y="106" width="120" height="5" rx="2.5" />
    </>,
  ),

  // A8: tiny targets grow into easy ones, and a tap lands.
  a8: scene(
    "a8",
    <>
      <rect className="card" x="40" y="26" width="240" height="108" rx="12" />
      <rect className="ink" x="60" y="44" width="120" height="7" rx="3.5" />
      <g className="a-from" style={from({ sx: 0.4, sy: 0.4, delay: 0.2 })}>
        <rect className="accent-soft" x="88" y="62" width="58" height="46" rx="12" />
        <path className="stroke-accent" d="M109 92l2-7 10-10 5 5-10 10z" />
      </g>
      <g className="a-from" style={from({ sx: 0.4, sy: 0.4, delay: 0.35 })}>
        <rect className="bad-soft-fill" x="174" y="62" width="58" height="46" rx="12" />
        <path className="stroke-bad" d="M195 76h16M199 76v-3h8v3M197 80l1 14h10l1-14" />
      </g>
      <circle className="tap-ring a-ring d-late" cx="117" cy="86" r="20" />
    </>,
  ),
};

