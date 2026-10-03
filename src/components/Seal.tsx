/** Points of a scalloped rosette: alternating outer and inner radius around a center. */
export function rosette(cx: number, cy: number, outer: number, inner: number, points = 20): [number, number][] {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

/**
 * Certificate seal: a gold rosette with a check and two ribbon tails. Decorative. The check uses
 * --surface so it contrasts with the gold in both themes (light on dark gold, dark on bright gold).
 */
export default function Seal() {
  const edge = rosette(40, 38, 33, 29).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg className="cert-seal" viewBox="0 0 80 96" width="72" height="86" aria-hidden="true" focusable="false">
      <path className="seal-ribbon" d="M27 58l-9 34 11-6 7 9 6-33zM53 58l9 34-11-6-7 9-6-33z" />
      <polygon className="seal-edge" points={edge} />
      <circle className="seal-ring" cx="40" cy="38" r="22" />
      <path className="seal-check" d="M29 39l8 8 15-16" />
    </svg>
  );
}
