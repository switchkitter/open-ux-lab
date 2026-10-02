import type { CSSProperties, ReactNode } from "react";

/**
 * Shared pieces for lesson scenes. See the scene rules in scenes.tsx and the .scene-svg styles.
 */

/** A 320×160 scene, decorative and hidden from assistive tech. */
export const scene = (name: string, children: ReactNode) => (
  <svg className={`scene-svg scene-${name}`} viewBox="0 0 320 160" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/** A 640×240 path banner, decorative and hidden from assistive tech. Same classes and motion as scenes. */
export const hero = (name: string, children: ReactNode) => (
  <svg className={`scene-svg hero-svg hero-${name}`} viewBox="0 0 640 240" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/** A check mark drawn on top of a colored circle of radius r. */
export const check = (cx: number, cy: number, r: number) => (
  <path className="on-color" d={`M${cx - r * 0.45} ${cy}l${r * 0.3} ${r * 0.32} ${r * 0.6}-${r * 0.62}`} />
);

/**
 * Style for the generic `a-from` animation: the element sits at its final position and animates in
 * from an offset, scale and/or opacity. Delay in seconds.
 */
export const from = (o: { x?: number; y?: number; sx?: number; sy?: number; opacity?: number; delay?: number }): CSSProperties =>
  ({
    "--fx": `${o.x ?? 0}px`,
    "--fy": `${o.y ?? 0}px`,
    "--fsx": o.sx ?? 1,
    "--fsy": o.sy ?? 1,
    "--fo": o.opacity ?? 1,
    animationDelay: `${o.delay ?? 0}s`,
  }) as CSSProperties;

/** Just a delay, for any animation class. */
export const at = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` });

/** 24×24 line icon in currentColor. */
export const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);
