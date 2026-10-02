import type { ReactNode } from "react";
import { accessibilityScenes } from "./scenes-accessibility";
import { formsScenes } from "./scenes-forms";
import { heuristicsScenes } from "./scenes";
import { lawsScenes } from "./scenes-laws";

export { lessonIcons, pathIcons } from "./icons";
export { pathHeroes } from "./path-heroes";

/** Animated scene for each lesson, keyed by lesson ID. */
export const lessonScenes: Record<string, ReactNode> = {
  ...heuristicsScenes,
  ...accessibilityScenes,
  ...formsScenes,
  ...lawsScenes,
};
