import { describe, expect, it } from "vitest";
import { effectiveTheme } from "./theme";

describe("theme", () => {
  it("follows the device unless light or dark is chosen", () => {
    expect(effectiveTheme("system", true)).toBe("dark");
    expect(effectiveTheme("system", false)).toBe("light");
    expect(effectiveTheme("light", true)).toBe("light");
    expect(effectiveTheme("dark", false)).toBe("dark");
  });
});
