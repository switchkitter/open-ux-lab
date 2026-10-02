/**
 * Returns the indices 0..length-1 in random order (Fisher–Yates).
 * Pass `random` in tests for a deterministic order.
 */
export function shuffledIndices(length: number, random: () => number = Math.random): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
