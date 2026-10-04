import type { ReactNode } from "react";
import { at, check, from, hero, scene } from "./kit";

/** Scenes for the Information architecture path. Same rules as scenes.tsx. */
export const iaScenes: Record<string, ReactNode> = {
  // IA1: scattered cards settle into three labeled groups.
  ia1: scene(
    "ia1",
    <>
      {[0, 1, 2].map((g) => (
        <g key={g}>
          <rect className="accent" x={44 + g * 84} y="20" width="64" height="12" rx="6" />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className="card a-from"
              style={from({ x: [40, -60, 20][(g + i) % 3], y: [50, -10, 30][(g * 2 + i) % 3], delay: 0.2 + (g * 3 + i) * 0.08 })}
              x={44 + g * 84}
              y={44 + i * 32}
              width="64"
              height="24"
              rx="5"
            />
          ))}
        </g>
      ))}
    </>,
  ),

  // IA2: an A to Z list beside groups by topic.
  ia2: scene(
    "ia2",
    <>
      <rect className="card" x="24" y="20" width="128" height="120" rx="10" />
      {["A", "B", "C", "D"].map((l, i) => (
        <g key={l} className="a-rise" style={at(0.2 + i * 0.12)}>
          <text className="name-text" x="40" y={47 + i * 24}>
            {l}
          </text>
          <rect className="ink" x="60" y={38 + i * 24} width={[70, 56, 64, 48][i]} height="8" rx="4" />
        </g>
      ))}
      <rect className="card" x="168" y="20" width="128" height="120" rx="10" />
      {[0, 1].map((g) => (
        <g key={g} className="a-rise" style={at(0.8 + g * 0.3)}>
          <rect className="chip-fill" x="182" y={32 + g * 54} width="60" height="16" rx="8" />
          <rect className="ink" x="190" y={56 + g * 54} width="90" height="6" rx="3" />
          <rect className="ink" x="190" y={68 + g * 54} width="70" height="6" rx="3" />
        </g>
      ))}
    </>,
  ),

  // IA3: a pointer heads for the label that says what's there.
  ia3: scene(
    "ia3",
    <>
      <rect className="card" x="30" y="30" width="260" height="100" rx="12" />
      {["Features", "Pricing", "Guides"].map((t, i) => (
        <text key={t} className="name-text" x={80 + i * 80} y="62" textAnchor="middle">
          {t}
        </text>
      ))}
      <rect className="accent a-fill" style={at(1.2)} x="135" y="68" width="50" height="3" rx="1.5" />
      <rect className="ink" x="50" y="90" width="140" height="8" rx="4" />
      <rect className="ink" x="50" y="106" width="100" height="8" rx="4" />
      <path className="cursor a-from" style={from({ x: 60, y: 50, delay: 0.3 })} d="M166 72l0 20 5-5 4 9 4-2-4-9h7z" />
    </>,
  ),

  // IA4: a shallow tree, with the route to one page traced from the top.
  ia4: scene(
    "ia4",
    <>
      <path className="stroke-muted" d="M160 38V54M64 54H256M64 54v14M128 54v14M192 54v14M256 54v14M192 88v14M172 102h40M172 102v14M212 102v14" />
      <path className="curve a-draw" pathLength={1} d="M160 38V54H192V102H212V116" />
      <rect className="accent" x="136" y="14" width="48" height="24" rx="6" />
      {[64, 128, 192, 256].map((x) => (
        <rect key={x} className="card" x={x - 24} y="68" width="48" height="20" rx="5" />
      ))}
      <rect className="card" x="156" y="116" width="32" height="20" rx="5" />
      <rect className="card" x="196" y="116" width="32" height="20" rx="5" />
      <rect className="accent a-pop" style={at(1.5)} x="196" y="116" width="32" height="20" rx="5" />
    </>,
  ),

  // IA5: breadcrumbs, with a pin dropping onto the current page.
  ia5: scene(
    "ia5",
    <>
      <rect className="card" x="24" y="34" width="272" height="96" rx="12" />
      <text className="label-text" x="44" y="62">
        Home
      </text>
      <text className="label-text" x="74" y="62">
        ›
      </text>
      <text className="label-text" x="86" y="62">
        Billing
      </text>
      <text className="label-text" x="122" y="62">
        ›
      </text>
      <text className="name-text" x="134" y="62">
        Refunds
      </text>
      <rect className="fg" x="44" y="76" width="150" height="10" rx="5" />
      <rect className="ink" x="44" y="96" width="210" height="6" rx="3" />
      <rect className="ink" x="44" y="110" width="170" height="6" rx="3" />
      <g className="a-from" style={from({ y: -24, opacity: 0, delay: 0.6 })}>
        <path className="accent" d="M160 46c-8-9-12-15-12-21a12 12 0 0 1 24 0c0 6-4 12-12 21z" />
        <circle className="on-color-fill" cx="160" cy="25" r="4" />
      </g>
    </>,
  ),

  // IA6: a query is typed, filters appear and the list narrows.
  ia6: scene(
    "ia6",
    <>
      <rect className="card" x="30" y="12" width="260" height="136" rx="12" />
      <rect className="card" x="46" y="26" width="228" height="24" rx="12" />
      <circle className="stroke-muted" cx="61" cy="37" r="5" />
      <path className="stroke-muted" d="M65 41l4 4" />
      <rect className="fg a-type" style={at(0.2)} x="76" y="35" width="80" height="6" rx="3" />
      {[0, 1].map((i) => (
        <rect key={i} className="chip-fill a-pop" style={at(0.9 + i * 0.15)} x={46 + i * 70} y="60" width="60" height="16" rx="8" />
      ))}
      {[88, 102, 116, 130].map((y, i) => (
        <rect key={y} className={i % 2 ? "ink a-fade-out" : "ink"} style={i % 2 ? at(1.4) : undefined} x="46" y={y} width={[200, 170, 186, 150][i]} height="8" rx="4" />
      ))}
    </>,
  ),

  // IA7: cards are sorted into two groups.
  ia7: scene(
    "ia7",
    <>
      <rect className="chip-fill" x="56" y="16" width="72" height="16" rx="8" />
      <rect className="chip-fill" x="192" y="16" width="72" height="16" rx="8" />
      <rect className="region" x="36" y="40" width="112" height="106" rx="10" />
      <rect className="region" x="172" y="40" width="112" height="106" rx="10" />
      {[50, 80, 110].map((y, i) => (
        <rect key={y} className="card a-from" style={from({ x: 70, y: [-20, 10, -40][i], delay: 0.2 + i * 0.35 })} x="48" y={y} width="88" height="24" rx="5" />
      ))}
      {[50, 80].map((y, i) => (
        <rect key={y} className="card a-from" style={from({ x: -70, y: [30, -10][i], delay: 0.38 + i * 0.35 })} x="184" y={y} width="88" height="24" rx="5" />
      ))}
    </>,
  ),

  // IA8: a text-only tree, with the route to one item marked.
  ia8: scene(
    "ia8",
    <>
      <rect className="card" x="60" y="12" width="200" height="136" rx="12" />
      <rect className="accent-soft a-pop" style={at(1.1)} x="106" y="96" width="140" height="17" rx="4" />
      {(
        [
          [0, "Shop"],
          [0, "Help"],
          [1, "Orders"],
          [1, "Returns"],
          [2, "Returns policy"],
          [0, "Account"],
        ] as const
      ).map(([depth, t], i) => (
        <text key={t} className={i === 4 ? "name-text" : "label-text"} x={80 + depth * 16} y={36 + i * 18}>
          {t}
        </text>
      ))}
      <g className="a-pop" style={at(1.5)}>
        <circle className="good" cx="232" cy="104" r="8" />
        {check(232, 104, 8)}
      </g>
    </>,
  ),
};

/** Banner for the Information architecture path: a site map, search with filters, and breadcrumbs. */
export const iaHero: ReactNode = hero(
  "ia",
  <>
    {/* A site map with the route to one page traced */}
    <g className="a-rise">
      <rect className="card" x="24" y="24" width="300" height="192" rx="14" />
      <path className="stroke-muted" d="M174 64V86M74 86H274M74 86v22M140 86v22M208 86v22M274 86v22M208 130v13M182 143h52M182 143v13M234 143v13" />
      <path className="curve a-draw" pathLength={1} style={at(0.5)} d="M174 64V86H208V143H234V156" />
      <rect className="accent" x="144" y="40" width="60" height="24" rx="6" />
      {[74, 140, 208, 274].map((x) => (
        <rect key={x} className="card" x={x - 24} y="108" width="48" height="22" rx="5" />
      ))}
      <rect className="card" x="158" y="156" width="48" height="22" rx="5" />
      <rect className="card" x="210" y="156" width="48" height="22" rx="5" />
      <rect className="accent a-pop" style={at(1.7)} x="210" y="156" width="48" height="22" rx="5" />
    </g>
    {/* Search with filters */}
    <g className="a-rise" style={at(0.15)}>
      <rect className="card" x="348" y="24" width="268" height="88" rx="14" />
      <rect className="card" x="364" y="40" width="236" height="26" rx="13" />
      <circle className="stroke-muted" cx="381" cy="53" r="6" />
      <path className="stroke-muted" d="M386 58l4 4" />
      <rect className="fg a-type" style={at(0.6)} x="398" y="50" width="90" height="6" rx="3" />
      <rect className="chip-fill" x="364" y="78" width="70" height="18" rx="9" />
      <rect className="chip-fill" x="442" y="78" width="70" height="18" rx="9" />
    </g>
    {/* Breadcrumbs above a page */}
    <g className="a-rise" style={at(0.3)}>
      <rect className="card" x="348" y="128" width="268" height="88" rx="14" />
      <text className="label-text" x="368" y="154">
        Home
      </text>
      <text className="label-text" x="398" y="154">
        ›
      </text>
      <text className="label-text" x="410" y="154">
        Help
      </text>
      <text className="label-text" x="436" y="154">
        ›
      </text>
      <text className="name-text" x="448" y="154">
        Refunds
      </text>
      <rect className="accent a-fill" style={at(1.2)} x="448" y="159" width="54" height="3" rx="1.5" />
      <rect className="fg" x="368" y="172" width="160" height="10" rx="5" />
      <rect className="ink" x="368" y="192" width="200" height="6" rx="3" />
    </g>
  </>,
);
