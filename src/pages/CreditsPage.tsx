import type { ReactNode } from "react";
import { paths } from "../content/paths";
import { site } from "../content/site";
import { openLicenses, sourcesFor } from "../lib/credits";
import { hrefFor } from "../lib/route";

/** External link that says it opens in a new tab (see CLAUDE.md). */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

const FONTS = [
  { name: "Bricolage Grotesque", by: "The Bricolage Grotesque Project Authors", url: "https://github.com/ateliertriay/bricolage" },
  { name: "Atkinson Hyperlegible", by: "Braille Institute of America", url: "https://www.brailleinstitute.org/freefont/" },
];

const SOFTWARE = [
  { name: "React", url: "https://react.dev/" },
  { name: "Vite", url: "https://vite.dev/" },
  { name: "Supabase JavaScript client", url: "https://github.com/supabase/supabase-js" },
  { name: "Workbox and vite-plugin-pwa", url: "https://github.com/vite-pwa/vite-plugin-pwa" },
  { name: "Fontsource", url: "https://fontsource.org/" },
];

/**
 * Where lesson content comes from and under what terms, plus fonts and software. Source lists are
 * generated from the lessons, so new lessons appear here automatically.
 */
export default function CreditsPage() {
  const licenses = openLicenses(paths);
  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        ← Home
      </a>
      <article className="lesson credits">
        <div className="eyebrow">Credits</div>
        <h1>Sources and credits</h1>
        <div className="prose">
          <p>
            Every lesson in Open UX Lab is an original summary written for this app, with original exercises and
            illustrations. Each lesson links to the trusted sources it draws on, so you can read the full story from the
            people who did the research.
          </p>
          <p>
            Lesson content is licensed <Ext href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</Ext>: you can
            reuse it if you credit Open UX Lab. The code is MIT licensed. Both are on{" "}
            <Ext href={site.repoUrl}>GitHub</Ext>.
          </p>

          <h2>Openly licensed sources</h2>
          <p>Some lessons draw closely on guidance that its publishers make available under open licenses:</p>
          <ul>
            {licenses.map(({ license, sources }) => {
              // "GOV.UK Design System: Dates" -> "GOV.UK Design System"; the pages themselves are listed by path below.
              const publishers = [...new Set(sources.map((s) => s.split(":")[0]))];
              return (
                <li key={license.url}>
                  {`${publishers.join(" and ")} (${sources.length} ${sources.length === 1 ? "page" : "pages"}, listed below): published under `} <Ext href={license.url}>{license.name}</Ext>.
                </li>
              );
            })}
          </ul>
          <p>
            Open Government Licence material: contains public sector information licensed under the Open Government
            Licence v3.0.
          </p>

          <h2>Sources by path</h2>
          {paths.map((path) => (
            <section key={path.id} className="credit-path" aria-labelledby={`credits-${path.id}`}>
              <h3 id={`credits-${path.id}`}>
                <a href={hrefFor({ name: "path", id: path.id })}>{path.title}</a>
              </h3>
              <ul>
                {sourcesFor(path).map((s) => (
                  <li key={s.url}>
                    <Ext href={s.url}>{s.title}</Ext>
                    <span className="credit-used">{` · used in ${s.lessons.join(", ")}`}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <h2>Fonts</h2>
          <ul>
            {FONTS.map((f) => (
              <li key={f.name}>
                <Ext href={f.url}>{f.name}</Ext> by {f.by}, under the{" "}
                <Ext href="https://openfontlicense.org/">SIL Open Font License 1.1</Ext>.
              </li>
            ))}
          </ul>

          <h2>Software</h2>
          <p>Open UX Lab is built with open-source software, including:</p>
          <ul>
            {SOFTWARE.map((s) => (
              <li key={s.name}>
                <Ext href={s.url}>{s.name}</Ext> (MIT license)
              </li>
            ))}
          </ul>

          <h2>Names and trademarks</h2>
          <p>
            Names such as Nielsen Norman Group, NN/g, Laws of UX, GOV.UK and USWDS belong to their owners and are used
            only to credit their work. Open UX Lab is an independent project and isn't affiliated with or endorsed by any
            of them.
          </p>
          <p>
            Spotted a missing credit or a mistake? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </div>
      </article>
    </>
  );
}
