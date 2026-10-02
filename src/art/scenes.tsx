import type { ReactNode } from "react";
import { check, scene } from "./kit";

/**
 * Lesson illustrations: original animated SVG scenes that act out each principle.
 *
 * Rules (see .scene in styles.css):
 * - Decorative: the lesson text says everything, so scenes are hidden from screen readers.
 * - Each animation plays once and ends within 5 seconds (WCAG 2.2.2), on a meaningful final frame.
 * - Base styles are the final frame. Keyframes start from the earlier state, so with reduced motion
 *   (animations off) people see the finished scene.
 * - Colors come from theme tokens via classes, so scenes work in light and dark mode.
 */
export const heuristicsScenes: Record<string, ReactNode> = {
  // H1: an upload progresses and confirms it finished.
  h1: scene(
    "h1",
    <>
      <rect className="card" x="40" y="30" width="240" height="100" rx="12" />
      <rect className="mark-soft" x="60" y="50" width="24" height="30" rx="4" />
      <rect className="ink" x="96" y="54" width="110" height="8" rx="4" />
      <rect className="ink" x="96" y="68" width="70" height="6" rx="3" />
      <rect className="ink" x="60" y="98" width="200" height="8" rx="4" />
      <rect className="accent a-fill" x="60" y="98" width="200" height="8" rx="4" />
      <g className="a-pop d-late">
        <circle className="good" cx="246" cy="64" r="15" />
        {check(246, 64, 15)}
      </g>
    </>,
  ),

  // H2: a raw system value gives way to a calendar people recognize.
  h2: scene(
    "h2",
    <>
      <rect className="card" x="40" y="28" width="240" height="104" rx="12" />
      <g className="a-fade-out">
        <rect className="ink" x="60" y="58" width="92" height="44" rx="8" />
        <rect className="muted" x="72" y="72" width="16" height="6" rx="3" />
        <rect className="muted" x="94" y="72" width="40" height="6" rx="3" />
        <rect className="muted" x="72" y="84" width="54" height="6" rx="3" />
      </g>
      <path className="stroke-muted" d="M162 80h22m-7-7l7 7-7 7" />
      <g className="a-rise d-mid">
        <rect className="card" x="196" y="48" width="64" height="66" rx="8" />
        <rect className="accent" x="196" y="48" width="64" height="16" rx="8" />
        <rect className="accent" x="196" y="56" width="64" height="8" />
        <rect className="ink" x="208" y="42" width="5" height="12" rx="2.5" />
        <rect className="ink" x="243" y="42" width="5" height="12" rx="2.5" />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <circle key={`${c}${r}`} className={c === 1 && r === 0 ? "accent" : "ink"} cx={212 + c * 16} cy={80 + r * 18} r="5" />
          )),
        )}
      </g>
    </>,
  ),

  // H3: a row is archived and an undo toast appears.
  h3: scene(
    "h3",
    <>
      <rect className="card" x="40" y="18" width="240" height="124" rx="12" />
      {[30, 54, 78].map((y, i) => (
        <g key={y} className={i === 1 ? "a-slide-away" : undefined}>
          <circle className="ink" cx="66" cy={y + 9} r="8" />
          <rect className="ink" x="82" y={y + 3} width={i === 1 ? 150 : 170} height="12" rx="6" />
        </g>
      ))}
      <g className="a-toast d-late">
        <rect className="fg" x="84" y="108" width="152" height="24" rx="12" />
        <rect className="bg-fill" x="100" y="117" width="72" height="6" rx="3" />
        <path className="stroke-bg" d="M206 114l-5 5 5 5m-5-5h12a4 4 0 0 1 0 8h-3" />
      </g>
    </>,
  ),

  // H4: one odd button falls into line with the rest.
  h4: scene(
    "h4",
    <>
      <rect className="card" x="40" y="40" width="240" height="80" rx="12" />
      {[52, 108, 164].map((x) => (
        <rect key={x} className="accent" x={x} y="68" width="48" height="24" rx="12" />
      ))}
      <g className="a-fade-out d-mid">
        <rect className="mark" x="222" y="62" width="44" height="36" rx="2" transform="rotate(-8 244 80)" />
      </g>
      <rect className="accent a-pop d-late" x="220" y="68" width="48" height="24" rx="12" />
    </>,
  ),

  // H5: the destructive action moves away from the safe one and gains a guard.
  h5: scene(
    "h5",
    <>
      <rect className="card" x="40" y="24" width="240" height="112" rx="12" />
      <rect className="ink" x="60" y="42" width="120" height="8" rx="4" />
      <rect className="card" x="60" y="58" width="128" height="22" rx="6" />
      <rect className="accent" x="60" y="98" width="72" height="24" rx="12" />
      <g className="a-shift d-mid">
        <rect className="stroke-bad-fill" x="186" y="98" width="74" height="24" rx="12" />
        <rect className="bad" x="204" y="108" width="38" height="5" rx="2.5" />
      </g>
      <g className="a-pop d-late">
        <path className="good" d="M223 56l13 5v9c0 8-5.5 13-13 15.5-7.5-2.5-13-7.5-13-15.5v-9z" />
        {check(223, 70, 9)}
      </g>
    </>,
  ),

  // H6: suggestions appear as soon as someone starts typing.
  h6: scene(
    "h6",
    <>
      <rect className="card" x="60" y="22" width="200" height="28" rx="8" />
      <circle className="stroke-muted" cx="76" cy="36" r="5" />
      <path className="stroke-muted" d="M80 40l4 4" />
      <rect className="fg a-type" x="92" y="33" width="44" height="6" rx="3" />
      <rect className="card a-rise d-early" x="60" y="56" width="200" height="84" rx="8" />
      {[64, 90, 116].map((y, i) => (
        <g key={y} className={`a-rise d-${["mid", "mid2", "late"][i]}`}>
          {i === 0 && <rect className="accent-soft" x="66" y={y} width="188" height="20" rx="5" />}
          <rect className={i === 0 ? "accent" : "ink"} x="76" y={y + 6} width="8" height="8" rx="2" />
          <rect className="ink" x="92" y={y + 7} width={[120, 96, 108][i]} height="6" rx="3" />
        </g>
      ))}
    </>,
  ),

  // H7: a keyboard shortcut opens a command palette.
  h7: scene(
    "h7",
    <>
      <g className="a-press">
        <rect className="card" x="52" y="61" width="38" height="34" rx="7" />
        <text className="key-text" x="71" y="84" textAnchor="middle">⌘</text>
      </g>
      <g className="a-press d-early">
        <rect className="card" x="96" y="61" width="38" height="34" rx="7" />
        <text className="key-text" x="115" y="84" textAnchor="middle">K</text>
      </g>
      <g className="a-zoom d-mid">
        <rect className="card" x="152" y="26" width="132" height="104" rx="10" />
        <rect className="ink" x="164" y="38" width="108" height="16" rx="5" />
        <rect className="accent-soft" x="160" y="62" width="116" height="18" rx="5" />
        <rect className="accent" x="168" y="68" width="60" height="6" rx="3" />
        <rect className="ink" x="168" y="90" width="80" height="6" rx="3" />
        <rect className="ink" x="168" y="108" width="70" height="6" rx="3" />
      </g>
    </>,
  ),

  // H8: clutter falls away, leaving one clear message and action.
  h8: scene(
    "h8",
    <>
      <rect className="card" x="70" y="26" width="180" height="108" rx="12" />
      <rect className="fg" x="90" y="46" width="96" height="10" rx="5" />
      <rect className="ink" x="90" y="66" width="140" height="6" rx="3" />
      <rect className="ink" x="90" y="78" width="110" height="6" rx="3" />
      <rect className="accent" x="90" y="100" width="70" height="20" rx="10" />
      <g className="a-clutter">
        <circle className="mark" cx="214" cy="48" r="9" />
        <rect className="bad" x="176" y="98" width="52" height="16" rx="3" />
        <path className="mark" d="M228 104l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" />
        <rect className="good" x="200" y="64" width="34" height="12" rx="6" />
        <circle className="accent-soft-strong" cx="96" cy="124" r="7" />
        <rect className="mark-soft" x="194" y="34" width="44" height="10" rx="5" />
      </g>
    </>,
  ),

  // H9: an error with a clear message gets fixed.
  h9: scene(
    "h9",
    <>
      <rect className="card" x="40" y="26" width="240" height="108" rx="12" />
      <rect className="ink" x="60" y="44" width="80" height="7" rx="3.5" />
      <rect className="card" x="60" y="58" width="200" height="30" rx="8" />
      <rect className="fg" x="72" y="70" width="90" height="6" rx="3" />
      <g className="a-fade-out d-late">
        <rect className="stroke-bad" x="60" y="58" width="200" height="30" rx="8" />
        <path className="bad" d="M240 64l10 17h-20z" />
        <rect className="bad" x="60" y="98" width="150" height="7" rx="3.5" />
      </g>
      <g className="a-pop d-late">
        <rect className="stroke-good" x="60" y="58" width="200" height="30" rx="8" />
        <circle className="good" cx="242" cy="73" r="9" />
        {check(242, 73, 9)}
      </g>
    </>,
  ),

  // H10: help opens right where the question comes up.
  h10: scene(
    "h10",
    <>
      <rect className="card" x="40" y="26" width="240" height="108" rx="12" />
      <rect className="ink" x="60" y="44" width="96" height="7" rx="3.5" />
      <circle className="accent" cx="168" cy="47.5" r="8" />
      <text className="help-text" x="168" y="51.5" textAnchor="middle">?</text>
      <rect className="card" x="60" y="104" width="200" height="22" rx="7" />
      <g className="a-tip d-mid">
        <path className="fg" d="M156 61h112a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H156a6 6 0 0 1-6-6V67a6 6 0 0 1 6-6zM161 61l7-6 7 6z" />
        <rect className="bg-fill" x="160" y="70" width="98" height="5" rx="2.5" />
        <rect className="bg-fill" x="160" y="80" width="70" height="5" rx="2.5" />
      </g>
    </>,
  ),
};
