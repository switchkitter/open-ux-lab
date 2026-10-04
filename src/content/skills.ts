/**
 * Skills that cut across learning paths. Each lesson lists the skills it builds (Lesson.skills),
 * and the skill map adds up progress on those lessons' exercises.
 * Skill IDs are stored nowhere in learner progress, so they can be renamed freely.
 */
export const skills = [
  { id: "feedback", name: "Feedback and status", description: "Telling people what's happening, what went wrong and what happens next." },
  { id: "errors", name: "Error prevention", description: "Designing so mistakes are hard to make and easy to undo." },
  { id: "language", name: "Clear language", description: "Labels, messages and links in words people understand." },
  { id: "conventions", name: "Consistency and conventions", description: "Working the way people expect from other products and the rest of yours." },
  { id: "effort", name: "Reducing mental effort", description: "Fewer choices, less to remember, and less work pushed onto people." },
  { id: "layout", name: "Layout and visual hierarchy", description: "Grouping, emphasis and contrast that guide the eye." },
  { id: "control", name: "Control and efficiency", description: "Easy exits, shortcuts, and targets that are easy to hit." },
  { id: "accessibility", name: "Accessibility", description: "Products that work for disabled people and everyone else." },
  { id: "forms", name: "Forms", description: "Asking the right questions in the right way." },
  { id: "research", name: "User research", description: "Learning what people need and whether a design works for them." },
  { id: "ia", name: "Information architecture", description: "Organizing and labeling content so people can find it." },
] as const;

export type SkillId = (typeof skills)[number]["id"];
