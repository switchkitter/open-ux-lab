/**
 * Renders authored mockup HTML from content files.
 * The id lets a parent point aria-describedby at the mockup, so screen readers read its text.
 * Only use with trusted content written in this repo (content.test.ts blocks scripts and handlers).
 */
export default function Mockup({ id, html }: { id?: string; html: string }) {
  return <div id={id} className="mockup" dangerouslySetInnerHTML={{ __html: html }} />;
}
