import { describe, expect, it } from "vitest";
import type { LearningPath } from "../content/types";
import { certificateUrl, cleanName, linkedInUrl, readCertificate } from "./certificate";
import { parseRoute } from "./route";

const forms = { id: "forms", title: "Form design", lessons: [] } as unknown as LearningPath;

describe("certificates", () => {
  it("tidy the name: spaces, control characters and length", () => {
    expect(cleanName("  Siobhán   D'Arcy \n")).toBe("Siobhán D'Arcy");
    expect(cleanName("a".repeat(100))).toHaveLength(60);
    expect(cleanName("   ")).toBe("");
  });

  it("are read back from their own link", () => {
    const c = readCertificate("forms", "2026-10-02", "Siobhán D'Arcy / Ó Sé", [forms])!;
    const url = certificateUrl(c, "https://openuxlab.com/");
    const route = parseRoute(url.slice(url.indexOf("#")));
    expect(route.name === "certificate" && readCertificate(route.path, route.date, route.learner, [forms])).toEqual(c);
  });

  it("reject links with an unknown path, an impossible date or no name", () => {
    expect(readCertificate("nope", "2026-10-02", "Ana", [forms])).toBeNull();
    expect(readCertificate("forms", "2026-02-30", "Ana", [forms])).toBeNull();
    expect(readCertificate("forms", "2026-10-02", "  ", [forms])).toBeNull();
  });

  it("fill in LinkedIn's certification form", () => {
    const c = readCertificate("forms", "2026-10-02", "Ana", [forms])!;
    const url = new URL(linkedInUrl(c, "https://openuxlab.com/"));
    expect(url.hostname).toBe("www.linkedin.com");
    expect(url.searchParams.get("name")).toBe("Form design");
    expect(url.searchParams.get("organizationName")).toBe("Open UX Lab");
    expect(url.searchParams.get("issueMonth")).toBe("10");
    expect(url.searchParams.get("certUrl")).toBe("https://openuxlab.com/#/certificate/forms/2026-10-02/Ana");
  });
});
