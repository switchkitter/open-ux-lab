import type { ReactNode } from "react";
import { researchHero } from "./hero-research";
import { at, check, from, hero } from "./kit";
import { visualHero } from "./scenes-visual";
import { writingHero } from "./scenes-writing";

/**
 * Banner illustrations for learning paths, shown at the top of each path page. Each one gathers
 * motifs from across the path. Same rules as lesson scenes (see scenes.tsx): original, decorative,
 * theme classes only, and motion that plays once and ends on the finished picture.
 */
export const pathHeroes: Record<string, ReactNode> = {
  // Nielsen's heuristics: an interface reviewed against a checklist.
  heuristics: hero(
    "heuristics",
    <>
      <g className="a-pop" style={at(0.2)}>
        <circle className="accent" cx="72" cy="66" r="20" />
        <text className="help-text big" x="72" y="74" textAnchor="middle">?</text>
      </g>
      <g className="a-rise">
        <rect className="card" x="150" y="28" width="340" height="184" rx="14" />
        <rect className="ink" x="150" y="28" width="340" height="26" rx="14" />
        <rect className="ink" x="150" y="42" width="340" height="12" />
        <circle className="bad" cx="168" cy="41" r="4" />
        <circle className="mark" cx="181" cy="41" r="4" />
        <circle className="good" cx="194" cy="41" r="4" />
        <rect className="accent-soft" x="164" y="66" width="70" height="132" rx="8" />
        <rect className="accent" x="174" y="80" width="48" height="6" rx="3" />
        {[96, 112, 128].map((y, i) => (
          <rect key={y} className="ink" x="174" y={y} width={[40, 44, 36][i]} height="6" rx="3" />
        ))}
        <rect className="fg" x="248" y="68" width="120" height="10" rx="5" />
        <rect className="ink" x="248" y="88" width="220" height="6" rx="3" />
        <rect className="ink" x="248" y="100" width="180" height="6" rx="3" />
        <rect className="card" x="248" y="118" width="104" height="58" rx="8" />
        <rect className="card" x="362" y="118" width="104" height="58" rx="8" />
        <rect className="mark-soft" x="258" y="128" width="22" height="22" rx="5" />
        <rect className="ink" x="258" y="158" width="70" height="6" rx="3" />
        <rect className="good-soft-fill" x="372" y="128" width="22" height="22" rx="5" />
        <rect className="ink" x="372" y="158" width="60" height="6" rx="3" />
        <rect className="ink" x="248" y="188" width="218" height="6" rx="3" />
        <rect className="accent a-fill" x="248" y="188" width="218" height="6" rx="3" />
      </g>
      <g className="a-from" style={from({ x: 24, opacity: 0, delay: 0.3 })}>
        <rect className="card" x="430" y="60" width="176" height="146" rx="12" />
        <rect className="fg" x="446" y="76" width="84" height="8" rx="4" />
      </g>
      {[100, 120, 140, 160, 180].map((y, i) => (
        <g key={y}>
          <g className="a-pop" style={at(0.7 + i * 0.18)}>
            <circle className="good" cx="454" cy={y} r="7" />
            {check(454, y, 7)}
          </g>
          <rect className="ink a-from" style={from({ opacity: 0, delay: 0.5 })} x="468" y={y - 3} width={[110, 96, 104, 88, 100][i]} height="6" rx="3" />
        </g>
      ))}
      <g className="a-toast" style={at(1.7)}>
        <rect className="fg" x="24" y="150" width="116" height="32" rx="16" />
        <circle className="good" cx="44" cy="166" r="8" />
        {check(44, 166, 8)}
        <rect className="bg-fill" x="60" y="163" width="62" height="6" rx="3" />
      </g>
    </>,
  ),

  // Accessibility: one person at the center of many ways to perceive and operate.
  accessibility: hero(
    "accessibility",
    <>
      <circle className="region a-pop" cx="320" cy="120" r="94" />
      <g className="a-pop" style={at(0.1)}>
        <circle className="card" cx="320" cy="120" r="62" />
        <circle className="accent" cx="320" cy="86" r="11" />
        <path className="stroke-accent thick" d="M282 108l38 8 38-8M320 116v26l-18 32M320 142l18 32" />
      </g>
      <g className="a-pop" style={at(0.5)}>
        <rect className="card" x="66" y="30" width="138" height="80" rx="10" />
        <rect className="fg" x="78" y="42" width="114" height="56" rx="6" />
        <path className="bg-fill" d="M128 52l16 9-16 9z" />
        <rect className="bg-fill" x="94" y="78" width="82" height="10" rx="3" />
      </g>
      <g className="a-pop" style={at(0.75)}>
        <rect className="card" x="76" y="132" width="128" height="76" rx="10" />
        <circle className="card" cx="112" cy="170" r="20" />
        <path className="fg" d="M112 150a20 20 0 0 1 0 40z" />
        <rect className="good" x="142" y="160" width="50" height="20" rx="10" />
        <text className="on-good-text" x="167" y="174" textAnchor="middle">4.5:1</text>
      </g>
      <g className="a-pop" style={at(1)}>
        <rect className="card" x="436" y="30" width="148" height="80" rx="10" />
        {[450, 496, 542].map((x, i) => (
          <g key={x}>
            <rect className="card" x={x} y="52" width="36" height="34" rx="6" />
            <text className="key-text small" x={x + 18} y="73" textAnchor="middle">{["Tab", "↵", "⌘"][i]}</text>
          </g>
        ))}
        <rect className="focus-ring" x="491" y="47" width="46" height="44" rx="9" />
      </g>
      <g className="a-pop" style={at(1.25)}>
        <rect className="card" x="436" y="132" width="148" height="76" rx="10" />
        <rect className="mark-soft" x="448" y="144" width="54" height="52" rx="6" />
        <path className="mark" d="M452 190l14-18 10 12 7-8 15 14z" />
        <rect className="accent" x="512" y="152" width="58" height="6" rx="3" />
        <rect className="ink" x="512" y="166" width="42" height="6" rx="3" />
        <text className="label-text" x="512" y="190">alt</text>
      </g>
    </>,
  ),

  // Form design: a multi-step form done well, with fixed errors and plain labels around it.
  forms: hero(
    "forms",
    <>
      <g className="a-rise">
        <rect className="card" x="200" y="18" width="240" height="204" rx="14" />
        {[296, 312, 328, 344].map((cx, i) => (
          <circle key={cx} className={i < 2 ? "accent" : "ink"} cx={cx} cy="36" r="4" />
        ))}
        <rect className="fg" x="220" y="52" width="120" height="10" rx="5" />
        <rect className="ink" x="220" y="74" width="60" height="6" rx="3" />
        <rect className="card" x="220" y="84" width="200" height="24" rx="6" />
        <rect className="ink" x="220" y="118" width="80" height="6" rx="3" />
        {[
          { x: 220, w: 34, t: "14" },
          { x: 262, w: 34, t: "3" },
          { x: 304, w: 54, t: "1990" },
        ].map((b, i) => (
          <g key={b.x}>
            <rect className="card" x={b.x} y="128" width={b.w} height="28" rx="6" />
            <text className="date-text small a-pop" style={at(0.9 + i * 0.2)} x={b.x + b.w / 2} y="147" textAnchor="middle">
              {b.t}
            </text>
          </g>
        ))}
        {[176, 198].map((cy, i) => (
          <g key={cy}>
            <circle className="radio" cx="228" cy={cy} r="7" />
            {i === 0 && <circle className="accent" cx="228" cy={cy} r="3.5" />}
            <rect className="ink" x="242" y={cy - 3} width={[70, 56][i]} height="6" rx="3" />
          </g>
        ))}
        <rect className="accent" x="336" y="178" width="84" height="28" rx="14" />
        <rect className="on-accent-bar" x="356" y="189" width="44" height="5" rx="2.5" />
      </g>
      <rect className="fg a-type" style={at(0.5)} x="232" y="93" width="96" height="6" rx="3" />
      <g className="a-from" style={from({ x: -24, opacity: 0, delay: 0.4 })}>
        <rect className="card" x="34" y="54" width="146" height="76" rx="10" />
        <rect className="stroke-good" x="34" y="54" width="146" height="76" rx="10" />
        <circle className="good" cx="56" cy="76" r="9" />
        {check(56, 76, 9)}
        <rect className="fg" x="74" y="73" width="84" height="6" rx="3" />
        <rect className="accent" x="50" y="96" width="104" height="5" rx="2.5" />
        <rect className="accent" x="50" y="108" width="74" height="5" rx="2.5" />
      </g>
      <g className="a-from" style={from({ x: 24, opacity: 0, delay: 0.7 })}>
        <rect className="card" x="462" y="36" width="148" height="58" rx="10" />
        <text className="name-text" x="476" y="70">Siobhán D'Arcy</text>
        <circle className="good" cx="592" cy="65" r="8" />
        {check(592, 65, 8)}
      </g>
      <g className="a-from" style={from({ x: 24, opacity: 0, delay: 1 })}>
        <rect className="card" x="462" y="116" width="148" height="86" rx="10" />
        <rect className="fg" x="476" y="132" width="58" height="7" rx="3.5" />
        <rect className="ink" x="540" y="128" width="58" height="14" rx="7" />
        <text className="tiny-text" x="569" y="138.5" textAnchor="middle">(optional)</text>
        <rect className="card" x="476" y="152" width="120" height="22" rx="6" />
        <rect className="ink" x="476" y="184" width="80" height="5" rx="2.5" />
      </g>
    </>,
  ),

  // Laws of UX: six small panels, one for each of several laws.
  "laws-of-ux": hero(
    "laws",
    <>
      {[
        { x: 24, y: 24, w: 180, h: 92 },
        { x: 228, y: 24, w: 184, h: 92 },
        { x: 436, y: 24, w: 180, h: 92 },
        { x: 24, y: 132, w: 180, h: 84 },
        { x: 228, y: 132, w: 184, h: 84 },
        { x: 436, y: 132, w: 180, h: 84 },
      ].map((c, i) => (
        <rect key={i} className="card a-rise" style={at(i * 0.12)} x={c.x} y={c.y} width={c.w} height={c.h} rx="12" />
      ))}
      {/* Fitts's Law: a big, close target and a pointer */}
      <g className="a-rise" style={at(0.1)}>
        <rect className="accent" x="56" y="48" width="116" height="38" rx="19" />
        <rect className="on-accent-bar" x="88" y="64" width="52" height="6" rx="3" />
        <rect className="accent" x="40" y="102" width="28" height="3" rx="1.5" />
      </g>
      <g className="a-from" style={from({ x: -70, y: 24, delay: 0.6 })}>
        <path className="cursor" d="M140 66v20l5-5 4 9 4-2-4-9h7z" />
      </g>
      {/* Hick's Law: three clear choices, one recommended */}
      <g className="a-rise" style={at(0.25)}>
        {[246, 302, 358].map((x, i) => (
          <g key={x}>
            <rect className={i === 1 ? "card card-accent" : "card"} x={x} y="42" width="48" height="60" rx="8" />
            <rect className={i === 1 ? "accent" : "ink"} x={x + 8} y="86" width="32" height="8" rx="4" />
            <rect className="ink" x={x + 8} y="56" width="24" height="5" rx="2.5" />
          </g>
        ))}
        <rect className="accent" x="312" y="36" width="28" height="9" rx="4.5" />
      </g>
      {/* Miller's Law: chunks of three */}
      {[454, 506, 558].map((g, gi) => (
        <g key={g} className="a-from" style={from({ x: (gi - 1) * -10, delay: 0.7 })}>
          {[0, 1, 2].map((j) => (
            <rect key={j} className="chip-fill" x={g + j * 15} y="50" width="13" height="24" rx="3" />
          ))}
          <rect className="accent" x={g} y="84" width="43" height="3" rx="1.5" />
        </g>
      ))}
      {/* Proximity and common region */}
      <rect className="region a-pop" style={at(1.1)} x="48" y="146" width="56" height="56" rx="12" />
      <rect className="region a-pop" style={at(1.1)} x="124" y="146" width="56" height="56" rx="12" />
      {[64, 88, 140, 164].map((cx) =>
        [162, 186].map((cy) => <circle key={`${cx}${cy}`} className="fg a-from" style={from({ x: cx < 110 ? 8 : -8, delay: 0.8 })} cx={cx} cy={cy} r="6" />),
      )}
      {/* Von Restorff effect */}
      {[244, 276, 308, 380].map((x) => (
        <rect key={x} className="ink" x={x} y="164" width="26" height="20" rx="10" />
      ))}
      <rect className="accent a-pop" style={at(1.2)} x="338" y="159" width="36" height="30" rx="15" />
      {/* Peak-end rule */}
      <path className="curve a-draw" pathLength={1} style={at(0.9)} d="M452 200C470 196 484 192 496 188S516 150 526 146S548 196 562 192S586 172 600 164" />
      <circle className="mark a-pop" style={at(1.6)} cx="526" cy="146" r="6" />
      <circle className="good a-pop" style={at(1.9)} cx="600" cy="164" r="6" />
    </>,
  ),

  // UX research methods: interview, usability test, survey results and synthesis.
  research: researchHero,

  // Visual design basics: type specimen, layout grid, palette and components.
  "visual-design": visualHero,
  // UX writing: a clear button label, a helpful error, a specific dialog, an empty state and a success message.
  "ux-writing": writingHero,
};
