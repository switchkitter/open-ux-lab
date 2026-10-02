import type { LearningPath, License, Source } from "../content/types";

export type CreditedSource = Source & { lessons: string[] };

/** Every source cited by a path, once each, in first-use order, with the lessons that cite it. */
export function sourcesFor(path: LearningPath): CreditedSource[] {
  const byUrl = new Map<string, CreditedSource>();
  for (const lesson of path.lessons) {
    for (const s of lesson.sources) {
      const entry = byUrl.get(s.url) ?? { ...s, lessons: [] };
      entry.lessons.push(lesson.title);
      byUrl.set(s.url, entry);
    }
  }
  return [...byUrl.values()];
}

/** Each open license used by any source, once, with the source titles it covers. */
export function openLicenses(paths: LearningPath[]): { license: License; sources: string[] }[] {
  const byUrl = new Map<string, { license: License; sources: string[] }>();
  for (const path of paths) {
    for (const s of sourcesFor(path)) {
      if (!s.license) continue;
      const entry = byUrl.get(s.license.url) ?? { license: s.license, sources: [] };
      if (!entry.sources.includes(s.title)) entry.sources.push(s.title);
      byUrl.set(s.license.url, entry);
    }
  }
  return [...byUrl.values()];
}
