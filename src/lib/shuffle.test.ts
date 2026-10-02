import { describe, expect, it } from "vitest";
import { shuffledIndices } from "./shuffle";

describe("shuffledIndices", () => {
  it("returns every index exactly once", () => {
    for (let n = 0; n <= 6; n++) {
      expect([...shuffledIndices(n)].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it("uses the random source it is given", () => {
    // random() always 0 swaps each position with index 0: [0,1,2,3] -> [1,2,3,0]
    expect(shuffledIndices(4, () => 0)).toEqual([1, 2, 3, 0]);
    // random() just under 1 swaps each position with itself: order unchanged
    expect(shuffledIndices(4, () => 0.999)).toEqual([0, 1, 2, 3]);
  });

  it("puts the first option in every position over many runs", () => {
    const seen = new Set<number>();
    for (let run = 0; run < 200; run++) seen.add(shuffledIndices(4).indexOf(0));
    expect(seen.size).toBe(4);
  });
});
