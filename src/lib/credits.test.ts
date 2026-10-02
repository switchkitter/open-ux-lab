import { describe, expect, it } from "vitest";
import { paths } from "../content/paths";
import { openLicenses, sourcesFor } from "./credits";

describe("credits", () => {
  it("lists every source a path cites, once, with the lessons that cite it", () => {
    for (const path of paths) {
      const listed = sourcesFor(path);
      const cited = new Set(path.lessons.flatMap((l) => l.sources.map((s) => s.url)));
      expect(new Set(listed.map((s) => s.url))).toEqual(cited);
      for (const s of listed) expect(s.lessons.length, s.url).toBeGreaterThan(0);
    }
  });

  it("groups the open licenses used by sources", () => {
    const names = openLicenses(paths).map((l) => l.license.name);
    expect(names).toContain("the Open Government Licence v3.0");
    expect(names).toContain("CC0 1.0 (public domain)");
    expect(new Set(names).size).toBe(names.length);
  });
});
