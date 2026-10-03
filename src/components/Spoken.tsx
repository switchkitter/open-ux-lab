import type { ReactNode } from "react";

/**
 * Text that's styled in pieces on screen (bold numbers, colored words) but should be read as one
 * phrase. VoiceOver on iPhone stops at every element and text-node boundary, so "<b>20</b> XP" is
 * read as "20", then "XP" on the next swipe. Screen readers get `text` in one piece instead.
 */
export default function Spoken({ text, children }: { text: string; children: ReactNode }) {
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{children}</span>
    </>
  );
}
