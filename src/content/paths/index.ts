import type { LearningPath } from "../types";
import { accessibilityPath } from "./accessibility";
import { formsPath } from "./forms";
import { heuristicsPath } from "./heuristics";
import { interactionDesignPath } from "./interaction-design";
import { lawsOfUxPath } from "./laws-of-ux";
import { researchPath } from "./research";
import { uxWritingPath } from "./ux-writing";
import { visualDesignPath } from "./visual-design";

/**
 * Every path with its full lessons, for tests and for generating the catalog (`npm run manifest`).
 * App code must not import this file: it uses content/catalog.ts and loads lessons through
 * content/load.ts, so lessons stay out of the main download. Add a new path here, in load.ts, and
 * then run `npm run manifest`.
 */
export const paths: LearningPath[] = [heuristicsPath, accessibilityPath, formsPath, lawsOfUxPath, researchPath, visualDesignPath, uxWritingPath, interactionDesignPath];
