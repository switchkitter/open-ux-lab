import { describe, expect, it } from "vitest";
import { browserSaysDoNotTrack, countsAllowed } from "./analytics";

const base = { dev: false, configured: true, optedOut: false, nav: {} };

describe("anonymous usage counts", () => {
  it("are sent only from a configured production build", () => {
    expect(countsAllowed(base)).toBe(true);
    expect(countsAllowed({ ...base, dev: true })).toBe(false);
    expect(countsAllowed({ ...base, configured: false })).toBe(false);
  });

  it("respect the learner's opt-out", () => {
    expect(countsAllowed({ ...base, optedOut: true })).toBe(false);
  });

  it("respect Global Privacy Control and Do Not Track", () => {
    expect(countsAllowed({ ...base, nav: { globalPrivacyControl: true } })).toBe(false);
    expect(countsAllowed({ ...base, nav: { doNotTrack: "1" } })).toBe(false);
    expect(countsAllowed({ ...base, nav: { doNotTrack: "0" } })).toBe(true);
    expect(browserSaysDoNotTrack({ globalPrivacyControl: true })).toBe(true);
    expect(browserSaysDoNotTrack({})).toBe(false);
  });
});
