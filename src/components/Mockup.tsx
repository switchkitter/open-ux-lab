/**
 * Renders authored mockup HTML from content files.
 * Only use with trusted content written in this repo (content.test.ts blocks scripts and handlers).
 */
export default function Mockup({ html }: { html: string }) {
  return <div className="mockup" dangerouslySetInnerHTML={{ __html: html }} />;
}
