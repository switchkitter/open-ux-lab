import { useRegisterSW } from "virtual:pwa-register/react";

/** Check for a new version at most this often while the app stays open. */
const HOURLY = 60 * 60 * 1000;

/**
 * Registers the service worker (offline support) and offers new versions when they're ready.
 *
 * - The bar lives inside the sticky header, so it never covers the page or the focused element.
 * - role="status" announces it politely without moving focus; learners update when they choose,
 *   so an update never interrupts a lesson.
 * - Home-screen apps on phones can stay open for days, so we also check for updates whenever the
 *   app comes back to the foreground.
 */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) void registration.update().catch(() => undefined);
      };
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
      });
      setInterval(check, HOURLY);
    },
  });

  return (
    <div role="status" className={needRefresh ? "update-bar" : undefined}>
      {needRefresh && (
        <div className="update-bar-in">
          <span>A new version of Open UX Lab is ready.</span>
          <span className="update-actions">
            <button type="button" className="btn small" onClick={() => void updateServiceWorker(true)}>
              Update now
            </button>
            <button type="button" className="btn small ghost" onClick={() => setNeedRefresh(false)}>
              Later
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
