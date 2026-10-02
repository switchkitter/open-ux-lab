import type { ReactNode } from "react";
import { icon } from "./kit";

/**
 * Lesson icons: original 24×24 line icons drawn in currentColor, so they follow the theme.
 * Decorative only (the lesson title carries the meaning). Keyed by lesson ID.
 */
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

  // ---- Accessibility basics ----
  // Who accessibility is for: a person with open arms
  a1: icon(
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5l-3.5 6.5M12 14.5l3.5 6.5" />
    </>,
  ),
  // Text alternatives: a picture
  a2: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 16l5-5 4 4 3-3 6 5" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </>,
  ),
  // Color contrast: half light, half dark
  a3: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </>,
  ),
  // Don't rely on color alone: a color drop beside text
  a4: icon(
    <>
      <path d="M7.5 4c2.5 3 4 5 4 7a4 4 0 0 1-8 0c0-2 1.5-4 4-7z" />
      <path d="M15 9h6M15 14h6M15 19h4" />
    </>,
  ),
  // Keyboard access: a keyboard
  a5: icon(
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M8 14.5h8" />
    </>,
  ),
  // Headings and structure: an indented outline
  a6: icon(<path d="M4 5h11M7.5 10h11M7.5 15h9M11 20h9" />),
  // Accessible forms: a labeled field
  a7: icon(
    <>
      <path d="M4 5h7" />
      <rect x="3" y="9" width="18" height="9" rx="2.5" />
      <path d="M7 13.5h6" />
    </>,
  ),
  // Links, buttons and targets: a pointer clicking
  a8: icon(<path d="M9.5 9.5l10.5 4-4.6 1.8-1.9 4.7zM5 4.5l1.6 1.6M3.5 9.5h2.3M9.5 3.5v2.3" />),

  // ---- Form design ----
  // Ask only what you need: a funnel
  f1: icon(<path d="M3.5 5h17l-6.5 7.5v6l-4 2v-8z" />),
  // One thing per page: a single page and step dots
  f2: icon(
    <>
      <rect x="5" y="2.5" width="14" height="15" rx="2.5" />
      <path d="M8.5 7.5h7M8.5 11.5h4" />
      <circle cx="8.5" cy="21" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="21" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="21" r="1" fill="currentColor" stroke="none" />
    </>,
  ),
  // Labels, hints and field sizes: a text field with a cursor
  f3: icon(
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2.5" />
      <path d="M8 9.5v5M6.8 9.5h2.4M6.8 14.5h2.4" />
    </>,
  ),
  // Names and personal details: a name badge
  f4: icon(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <circle cx="9" cy="10.5" r="2.3" />
      <path d="M5.5 16a3.5 3.5 0 0 1 7 0M15 10h3.5M15 14h3.5" />
    </>,
  ),
  // Dates: day, month and year boxes
  f5: icon(
    <>
      <rect x="2.5" y="8" width="5" height="8" rx="1.5" />
      <rect x="9.5" y="8" width="5" height="8" rx="1.5" />
      <rect x="16.5" y="8" width="5" height="8" rx="1.5" />
    </>,
  ),
  // Radios, checkboxes and selects
  f6: icon(
    <>
      <circle cx="7" cy="7" r="3.5" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M5.3 17l1.4 1.4 2.4-2.8M14 7h7M14 17h7" />
    </>,
  ),
  // Required and optional fields: an asterisk
  f7: icon(<path d="M12 4v16M5.1 8l13.8 8M18.9 8L5.1 16" />),
  // Errors and validation: an alert
  f8: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.5" r=".7" fill="currentColor" />
    </>,
  ),

  // ---- Laws of UX ----
  // Jakob's Law: a shopping cart where people expect it
  l1: icon(
    <>
      <path d="M3 4h2.5l2.3 10.5h10l2-7.5H6.8" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>,
  ),
  // Fitts's Law: a target
  l2: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </>,
  ),
  // Hick's Law: a path splitting into choices
  l3: icon(<path d="M12 21v-7l-6-6V4M12 14l6-6V4M4 6l2-2 2 2M16 6l2-2 2 2" />),
  // Miller's Law and chunking: items in groups
  l4: icon(<path d="M3 9h4M3 15h4M10 9h4M10 15h4M17 9h4M17 15h4" />),
  // Proximity and common region: dots grouped in boxes
  l5: icon(
    <>
      <rect x="2.5" y="5" width="8" height="14" rx="3" />
      <rect x="13.5" y="5" width="8" height="14" rx="3" />
      <circle cx="6.5" cy="9.5" r="1.2" fill="currentColor" />
      <circle cx="6.5" cy="14.5" r="1.2" fill="currentColor" />
      <circle cx="17.5" cy="9.5" r="1.2" fill="currentColor" />
      <circle cx="17.5" cy="14.5" r="1.2" fill="currentColor" />
    </>,
  ),
  // Von Restorff effect: one item stands out
  l6: icon(
    <>
      <circle cx="4.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <circle cx="19.5" cy="12" r="2" />
    </>,
  ),
  // Peak-end rule: a line with a high point and an ending
  l7: icon(
    <>
      <path d="M3 18l5-3.5 4-8.5 4 9 5-4.5" />
      <circle cx="12" cy="6" r="1.4" fill="currentColor" />
      <circle cx="21" cy="10.5" r="1.4" fill="currentColor" />
    </>,
  ),
  // Tesler's Law: a gear doing the work
  l8: icon(
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </>,
  ),
};
