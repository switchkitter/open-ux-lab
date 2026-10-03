import { useEffect, type ReactNode } from "react";
import type { Loaded } from "../content/load";

/**
 * Shown while a page's lessons load (usually a split second; instant once cached). The real heading
 * is already in place, so the route change can announce it and focus it as usual.
 */
export default function LoadingScreen({ back, eyebrow, title, state }: { back?: ReactNode; eyebrow?: string; title: string; state: Loaded<unknown> }) {
  return (
    <>
      {back}
      <section className="loading-screen">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {state.state === "error" ? (
          <div className="form-error" role="alert">
            <p>We couldn't load this. Check your connection and try again.</p>
            <div className="actions">
              <button className="btn" type="button" onClick={state.retry}>
                Try again
              </button>
            </div>
          </div>
        ) : (
          <p className="loading-note" role="status">
            Loading…
          </p>
        )}
      </section>
    </>
  );
}

/**
 * When loaded content replaces the loading screen, its heading replaces the one that had focus.
 * Put focus on the new heading so screen reader and keyboard users stay in place.
 */
export function useRefocusAfterLoad(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    requestAnimationFrame(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      const heading = document.querySelector<HTMLElement>("main h1");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
  }, [ready]);
}
