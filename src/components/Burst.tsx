import type { CSSProperties, ReactNode } from "react";

const SPARKS = 10;

/** A one-off ring of sparks around its child, for celebrations. Decorative; off with reduced motion. */
export default function Burst({ children }: { children: ReactNode }) {
  return (
    <span className="burst">
      {children}
      <svg aria-hidden="true" focusable="false">
        {Array.from({ length: SPARKS }, (_, i) => {
          const angle = (i / SPARKS) * Math.PI * 2;
          const style = { "--dx": `${Math.cos(angle) * 70}px`, "--dy": `${Math.sin(angle) * 40}px` } as CSSProperties;
          return <circle key={i} cx="50%" cy="50%" r={i % 2 ? 3 : 4} fill={i % 3 ? "var(--accent)" : "var(--mark)"} style={style} />;
        })}
      </svg>
    </span>
  );
}
