/**
 * Screen changes in a single-page app don't load a new document, so screen readers and keyboard
 * users get no signal that anything happened. After each change we update the tab title and move
 * focus to the new screen's main heading, so it's read out and Tab continues from there.
 */
export function announceScreen(title: string) {
  document.title = title ? `${title} – Open UX Lab` : "Open UX Lab";
  // Wait a frame so the new screen has rendered.
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
}
