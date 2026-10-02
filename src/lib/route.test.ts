import { describe, expect, it } from "vitest";
import { hrefFor, parseRoute, type Route } from "./route";

describe("routes", () => {
  it("round-trips every route through its link", () => {
    const routes: Route[] = [
      { name: "home" },
      { name: "path", id: "heuristics" },
      { name: "lesson", id: "h1" },
      { name: "review" },
      { name: "skills" },
      { name: "account" },
      { name: "privacy" },
    ];
    for (const r of routes) expect(parseRoute(hrefFor(r))).toEqual(r);
  });

  it("falls back to home for unknown or incomplete links", () => {
    expect(parseRoute("#/path/")).toEqual({ name: "home" });
    expect(parseRoute("#/nonsense")).toEqual({ name: "home" });
    expect(parseRoute("")).toEqual({ name: "home" });
  });
});
