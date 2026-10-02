import type { ReactNode } from "react";
import { at, check, from, hero, scene } from "./kit";

/** Scenes for the Visual design basics path. Same rules as scenes.tsx. */
export const visualScenes: Record<string, ReactNode> = {
  // V1: one element grows into the clear first thing to see.
  v1: scene(
    "v1",
    <>
      <rect className="card" x="70" y="20" width="180" height="120" rx="12" />
      <rect className="ink" x="88" y="38" width="70" height="7" rx="3.5" />
      <rect className="fg origin-left a-from" style={from({ sx: 0.45, sy: 0.4, delay: 0.3 })} x="88" y="54" width="120" height="26" rx="6" />
      {[92, 106, 120].map((y, i) => (
        <rect key={y} className="ink a-rise" style={at(0.9 + i * 0.12)} x="88" y={y} width={[140, 110, 80][i]} height="6" rx="3" />
      ))}
    </>,
  ),

  // V2: a big letterform, and lines of text kept to a comfortable measure.
  v2: scene(
    "v2",
    <>
      <text className="type-glyph a-pop" x="88" y="104" textAnchor="middle">Aa</text>
      <rect className="card" x="146" y="24" width="140" height="112" rx="10" />
      {[44, 60, 76, 92, 108].map((y, i) => (
        <rect key={y} className="ink a-rise" style={at(0.3 + i * 0.1)} x="162" y={y} width={[104, 98, 106, 92, 60][i]} height="6" rx="3" />
      ))}
      <path className="stroke-accent thin-2 a-draw" pathLength={1} style={at(1)} d="M162 124h104m-6-4l6 4-6 4m-98-8l-6 4 6 4" />
    </>,
  ),

  // V3: scattered blocks line up on one edge.
  v3: scene(
    "v3",
    <>
      <rect className="card" x="60" y="18" width="200" height="124" rx="12" />
      <path className="guide a-pop" d="M92 30v100" />
      {[
        { y: 34, w: 120, fx: 40 },
        { y: 58, w: 140, fx: -14 },
        { y: 82, w: 100, fx: 60 },
        { y: 106, w: 70, fx: 24 },
      ].map((b, i) => (
        <rect key={b.y} className={i === 3 ? "accent a-from" : "ink a-from"} style={from({ x: b.fx, delay: 0.5 + i * 0.1 })} x="92" y={b.y} width={b.w} height="16" rx="5" />
      ))}
    </>,
  ),

  // V4: a restrained palette; color is saved for the one thing that needs attention.
  v4: scene(
    "v4",
    <>
      {["ink", "muted", "fg", "accent", "good", "mark", "bad"].map((c, i) => (
        <circle key={c} className={`${c} a-pop`} style={at(0.1 + i * 0.08)} cx={70 + i * 30} cy="34" r="10" />
      ))}
      <rect className="card" x="56" y="58" width="208" height="84" rx="10" />
      {[0, 1, 2].map((i) => (
        <rect key={i} className={i === 2 ? "bad-soft-fill" : "card"} x={70 + i * 62} y="72" width="54" height="56" rx="7" />
      ))}
      <rect className="stroke-bad a-pop" style={at(1)} x="194" y="72" width="54" height="56" rx="7" />
      <path className="bad a-pop" style={at(1.1)} d="M221 84l10 17h-20z" />
      <rect className="ink" x="80" y="108" width="34" height="6" rx="3" />
      <rect className="ink" x="142" y="108" width="34" height="6" rx="3" />
      <rect className="bad" x="204" y="108" width="34" height="6" rx="3" />
    </>,
  ),

  // V5: cards snap into the columns of a grid.
  v5: scene(
    "v5",
    <>
      <rect className="card" x="40" y="18" width="240" height="124" rx="12" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} className="accent-soft" x={56 + i * 36} y="30" width="28" height="100" rx="3" />
      ))}
      <rect className="ink a-from" style={from({ x: -20, y: -10, delay: 0.4 })} x="56" y="36" width="208" height="20" rx="5" />
      <rect className="card a-from" style={from({ x: 18, y: 12, delay: 0.6 })} x="56" y="64" width="100" height="58" rx="6" />
      <rect className="card a-from" style={from({ x: -16, y: 18, delay: 0.75 })} x="164" y="64" width="100" height="58" rx="6" />
      <rect className="accent a-pop" style={at(1.2)} x="66" y="104" width="40" height="10" rx="5" />
    </>,
  ),

  // V6: icons get labels.
  v6: scene(
    "v6",
    <>
      <rect className="card" x="40" y="30" width="240" height="100" rx="12" />
      {[
        { x: 84, glyph: "⌂" },
        { x: 144, glyph: "✎" },
        { x: 204, glyph: "◷" },
      ].map((t, i) => (
        <g key={t.x}>
          <g className="a-pop" style={at(0.2 + i * 0.12)}>
            <rect className="accent-soft" x={t.x - 22} y="46" width="44" height="40" rx="10" />
            <text className="icon-glyph" x={t.x} y="74" textAnchor="middle">{t.glyph}</text>
          </g>
          <rect className="fg a-rise" style={at(0.9 + i * 0.12)} x={t.x - 18} y="98" width="36" height="7" rx="3.5" />
        </g>
      ))}
      <g className="a-pop" style={at(1.4)}>
        <circle className="good" cx="262" cy="52" r="10" />
        {check(262, 52, 10)}
      </g>
    </>,
  ),

  // V7: the primary button gets pressed; secondary and link stay quieter.
  v7: scene(
    "v7",
    <>
      <rect className="card" x="50" y="30" width="220" height="100" rx="12" />
      <g className="a-press" style={at(1)}>
        <rect className="accent" x="70" y="52" width="88" height="30" rx="15" />
        <rect className="on-accent-bar" x="92" y="64" width="44" height="6" rx="3" />
      </g>
      <rect className="card" x="168" y="52" width="80" height="30" rx="15" />
      <rect className="ink" x="186" y="64" width="44" height="6" rx="3" />
      <rect className="accent" x="70" y="102" width="56" height="4" rx="2" />
      <rect className="focus-ring a-pop" style={at(1.4)} x="64" y="46" width="100" height="42" rx="20" />
      <g className="a-from" style={from({ x: 80, y: 40, delay: 0.3 })}>
        <path className="cursor" d="M140 72v18l5-5 3 8 4-2-3-8h7z" />
      </g>
    </>,
  ),

  // V8: tokens on the left build the components on the right.
  v8: scene(
    "v8",
    <>
      <rect className="card" x="30" y="22" width="110" height="116" rx="12" />
      {["accent", "good", "bad", "fg"].map((c, i) => (
        <circle key={c} className={`${c} a-pop`} style={at(0.1 + i * 0.08)} cx={52 + i * 22} cy="44" r="8" />
      ))}
      <text className="type-glyph small a-pop" style={at(0.5)} x="44" y="88">Aa</text>
      {[16, 24, 36].map((w, i) => (
        <rect key={w} className="accent-soft-strong a-rise" style={at(0.6 + i * 0.08)} x="44" y={102 + i * 10} width={w} height="6" rx="2" />
      ))}
      <path className="stroke-muted a-draw" pathLength={1} style={at(0.8)} d="M148 80h22m-7-7l7 7-7 7" />
      <rect className="card a-rise" style={at(1)} x="180" y="22" width="110" height="116" rx="12" />
      <rect className="accent a-rise" style={at(1.15)} x="194" y="38" width="66" height="20" rx="10" />
      <rect className="card a-rise" style={at(1.25)} x="194" y="68" width="82" height="20" rx="6" />
      <rect className="bad-soft-fill a-rise" style={at(1.35)} x="194" y="98" width="82" height="26" rx="6" />
      <rect className="bad a-rise" style={at(1.35)} x="194" y="98" width="4" height="26" rx="2" />
    </>,
  ),
};

/** Banner for the Visual design basics path: type, grid, color and components. */
export const visualHero: ReactNode = hero(
  "visual",
  <>
    {/* Type specimen */}
    <g className="a-rise">
      <rect className="card" x="24" y="30" width="170" height="180" rx="14" />
      <text className="type-glyph big" x="44" y="120">Aa</text>
      {[146, 164, 180, 194].map((y, i) => (
        <rect key={y} className={i === 0 ? "fg" : "ink"} x="44" y={y} width={[110, 130, 120, 80][i]} height={[9, 6, 6, 6][i]} rx="3" />
      ))}
    </g>
    {/* Grid with content */}
    <g className="a-rise" style={at(0.15)}>
      <rect className="card" x="214" y="30" width="212" height="180" rx="14" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} className="accent-soft" x={228 + i * 32} y="44" width="24" height="152" rx="3" />
      ))}
    </g>
    <rect className="fg a-from" style={from({ y: -10, opacity: 0, delay: 0.5 })} x="228" y="54" width="184" height="16" rx="5" />
    <rect className="card a-from" style={from({ x: 14, y: 14, delay: 0.7 })} x="228" y="82" width="88" height="70" rx="8" />
    <rect className="card a-from" style={from({ x: -14, y: 18, delay: 0.85 })} x="324" y="82" width="88" height="70" rx="8" />
    <rect className="accent a-pop" style={at(1.2)} x="228" y="166" width="88" height="22" rx="11" />
    {/* Palette and components */}
    <g className="a-rise" style={at(0.3)}>
      <rect className="card" x="446" y="30" width="170" height="180" rx="14" />
    </g>
    {["fg", "muted", "ink", "accent", "good", "mark", "bad"].map((c, i) => (
      <circle key={c} className={`${c} a-pop`} style={at(0.6 + i * 0.08)} cx={468 + i * 21} cy="56" r="8" />
    ))}
    <rect className="accent a-rise" style={at(1.2)} x="462" y="80" width="80" height="26" rx="13" />
    <rect className="card a-rise" style={at(1.3)} x="550" y="80" width="52" height="26" rx="13" />
    <rect className="card a-rise" style={at(1.4)} x="462" y="118" width="140" height="24" rx="6" />
    <g className="a-rise" style={at(1.5)}>
      <rect className="good-soft-fill" x="462" y="154" width="140" height="38" rx="6" />
      <circle className="good" cx="480" cy="173" r="8" />
      {check(480, 173, 8)}
      <rect className="ink" x="496" y="170" width="90" height="6" rx="3" />
    </g>
  </>,
);
