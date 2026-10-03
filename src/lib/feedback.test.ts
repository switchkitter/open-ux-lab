import { describe, expect, it } from "vitest";
import { describeDetails, mailtoLink, techDetails, validEmail } from "./feedback";

const iphoneChrome =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1";
const windowsEdge =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0";
const macSafari = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";

describe("feedback", () => {
  it("sums up technical details in a few readable words, with no identifiers", () => {
    expect(techDetails(iphoneChrome, { width: 390, height: 844 }, "2f88945")).toEqual({ browser: "Chrome 141", system: "iOS", screen: "390×844", app: "2f88945" });
    expect(techDetails(windowsEdge, { width: 1920, height: 1080 }, "x").browser).toBe("Edge 141");
    expect(techDetails(macSafari, { width: 1440, height: 900 }, "x")).toMatchObject({ browser: "Safari 26", system: "macOS" });
    expect(describeDetails(techDetails(iphoneChrome, { width: 390, height: 844 }, "2f88945"))).toBe("Chrome 141 on iOS, screen 390×844, app version 2f88945");
  });

  it("checks reply emails loosely", () => {
    expect(validEmail("ana@example.com")).toBe(true);
    expect(validEmail("ana@example")).toBe(false);
    expect(validEmail("ana example.com")).toBe(false);
  });

  it("can turn feedback into an email when sending isn't possible", () => {
    const link = mailtoLink({
      kind: "content",
      target: { type: "exercise", id: "w5-yes-no", title: "Which dialog lets people answer without rereading it?" },
      message: "Typo in the second option",
      replyEmail: "",
      details: null,
    });
    expect(link.startsWith("mailto:openuxlab@protonmail.com?subject=")).toBe(true);
    const body = decodeURIComponent(link.split("&body=")[1]);
    expect(body).toContain("Feedback type: Content problem");
    expect(body).toContain("(w5-yes-no)");
    expect(body).toContain("Typo in the second option");
  });
});
