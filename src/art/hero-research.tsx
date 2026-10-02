import type { ReactNode } from "react";
import { at, check, from, hero } from "./kit";

/** Banner for the UX research methods path: interview, usability test, survey results and synthesis. */
export const researchHero: ReactNode = hero(
  "research",
  <>
    {/* Interview */}
    <g className="a-rise">
      <rect className="card" x="24" y="30" width="170" height="180" rx="14" />
      <path className="accent" d="M40 48h96a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H66l-12 10V78H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8z" />
      <rect className="on-accent-bar" x="46" y="60" width="74" height="5" rx="2.5" />
      <path className="card" d="M78 102h96a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8h-12v12l-12-12H78a8 8 0 0 1-8-8v-40a8 8 0 0 1 8-8z" />
      <rect className="ink" x="84" y="114" width="82" height="5" rx="2.5" />
      <rect className="ink" x="84" y="126" width="70" height="5" rx="2.5" />
      <rect className="ink" x="84" y="138" width="56" height="5" rx="2.5" />
      <circle className="mark" cx="48" cy="184" r="10" />
      <path className="mark" d="M33 204a15 15 0 0 1 30 0z" />
    </g>
    {/* Usability test */}
    <g className="a-rise" style={at(0.2)}>
      <rect className="card" x="216" y="30" width="208" height="140" rx="14" />
      <rect className="ink" x="216" y="30" width="208" height="22" rx="14" />
      <rect className="ink" x="216" y="42" width="208" height="10" />
      <rect className="fg" x="232" y="66" width="96" height="9" rx="4.5" />
      <rect className="ink" x="232" y="86" width="170" height="6" rx="3" />
      <rect className="card" x="232" y="102" width="176" height="22" rx="6" />
      <rect className="accent" x="232" y="134" width="80" height="22" rx="11" />
      <rect className="on-accent-bar" x="250" y="143" width="44" height="5" rx="2.5" />
      <rect className="card" x="282" y="180" width="76" height="40" rx="8" />
      <text className="label-text" x="290" y="196">TASK 2</text>
      <rect className="ink" x="290" y="204" width="56" height="5" rx="2.5" />
    </g>
    <g className="a-from" style={from({ x: 90, y: -50, delay: 0.6 })}>
      <path className="cursor" d="M286 140v20l5-5 4 9 4-2-4-9h7z" />
    </g>
    {/* Survey results */}
    <g className="a-rise" style={at(0.35)}>
      <rect className="card" x="446" y="30" width="170" height="86" rx="14" />
      {[48, 70, 92].map((y) => (
        <rect key={y} className="ink" x="462" y={y} width="138" height="12" rx="4" />
      ))}
    </g>
    {[48, 70, 92].map((y, i) => (
      <rect key={y} className="accent origin-left a-from" style={from({ sx: 0, delay: 0.8 + i * 0.15 })} x="462" y={y} width={[112, 74, 40][i]} height="12" rx="4" />
    ))}
    {/* Synthesis */}
    <g className="a-rise" style={at(0.5)}>
      <rect className="card" x="446" y="130" width="170" height="90" rx="14" />
    </g>
    {[
      { x: 462, y: 156, fx: 60, fy: 20 },
      { x: 490, y: 156, fx: 90, fy: 34 },
      { x: 462, y: 184, fx: 100, fy: -10 },
      { x: 546, y: 156, fx: -60, fy: 30 },
      { x: 574, y: 156, fx: -80, fy: 10 },
      { x: 546, y: 184, fx: -40, fy: -20 },
    ].map((n, i) => (
      <rect key={i} className={i < 3 ? "mark-soft a-from" : "good-soft-fill a-from"} style={from({ x: n.fx, y: n.fy, delay: 1 })} x={n.x} y={n.y} width="22" height="22" rx="3" />
    ))}
    <rect className="fg a-pop" style={at(1.6)} x="462" y="142" width="48" height="6" rx="3" />
    <rect className="fg a-pop" style={at(1.6)} x="546" y="142" width="48" height="6" rx="3" />
    <g className="a-pop" style={at(1.9)}>
      <circle className="good" cx="600" cy="202" r="10" />
      {check(600, 202, 10)}
    </g>
  </>,
);
