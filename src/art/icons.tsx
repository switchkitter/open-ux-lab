import type { ReactNode } from "react";

/**
 * Lesson icons: original 24×24 line icons drawn in currentColor, so they follow the theme.
 * Decorative only (the lesson title carries the meaning). Keyed by lesson ID.
 */
const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const lessonIcons: Record<string, ReactNode> = {
  // Visibility of system status: a progress ring nearly complete
  h1: icon(
    <>
      <path d="M12 3a9 9 0 1 1-8.5 6" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>,
  ),
  // Match with the real world: a calendar page
  h2: icon(
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </>,
  ),
  // User control and freedom: undo
  h3: icon(
    <>
      <path d="M9 7L4.5 11.5 9 16" />
      <path d="M4.5 11.5H15a4.5 4.5 0 0 1 0 9h-3" />
    </>,
  ),
  // Consistency and standards: matching shapes
  h4: icon(
    <>
      <rect x="3" y="4" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="4" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="14.5" width="7.5" height="5.5" rx="2" />
      <rect x="13.5" y="14.5" width="7.5" height="5.5" rx="2" />
    </>,
  ),
  // Error prevention: a shield
  h5: icon(
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" />
      <path d="M9 12l2 2 4-4" />
    </>,
  ),
  // Recognition rather than recall: an eye
  h6: icon(
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>,
  ),
  // Flexibility and efficiency: a lightning bolt
  h7: icon(<path d="M13 2.5L5 13.5h6.5L10.5 21.5l8.5-11h-6.5z" />),
  // Aesthetic and minimalist design: one clear sparkle
  h8: icon(
    <>
      <path d="M12 3.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5z" />
      <path d="M18.5 16.5v4M16.5 18.5h4" />
    </>,
  ),
  // Recognize, diagnose and recover from errors: a life ring
  h9: icon(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M6 6l3.5 3.5M14.5 14.5L18 18M18 6l-3.5 3.5M9.5 14.5L6 18" />
    </>,
  ),
  // Help and documentation: a question in a speech bubble
  h10: icon(
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 15.5z" />
      <path d="M10 8a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5" />
      <circle cx="12" cy="14" r=".6" fill="currentColor" />
    </>,
  ),
};
