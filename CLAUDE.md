# Open UX Lab

A free, Uxcel-style UX learning app: short lessons followed by exercises (pick the better design, multiple choice, spot the problem), with XP, streaks, spaced review and a skill map. It's live, installable as an app, and meant to be shared publicly.

## Status

- **Content:** 6 learning paths, 50 lessons, 150 exercises. Nielsen's 10 usability heuristics (10 lessons), Accessibility basics (8), Form design (8), Laws of UX (8), UX research methods (8), Visual design basics (8); every lesson has 3 exercises: a compare, a multiple choice and a spot-the-problem. 10 skills on the skill map.
- **Features:** path cards and path pages, spaced review (1, 3, 7 days), skill map, XP and streaks, levels, achievements, a daily goal and streak freezes, path certificates, optional accounts with cross-device sync (Supabase, email codes), progress backup to a file (save and load, no account needed), privacy page and account deletion, sources and credits page, original icons and animated scenes for every lesson and path, sound effects with a toggle, installable PWA with offline support and an update prompt, link previews.
- **Progress:** saved in the browser (localStorage) on every device; synced through Supabase when the learner signs in.
- **Live:** https://openuxlab.com (GitHub Pages custom domain, DNS at Namecheap; the old switchkitter.github.io/open-ux-lab/ address redirects there). Repo switchkitter/open-ux-lab. Every push to `main` runs tests and build, then deploys via `.github/workflows/deploy.yml`.
- **Checks:** `npm run typecheck`, `npm test` (75+ tests, including content integrity) and `npm run build` pass on Node 24; CI runs tests and build on every push. Accessibility audited with axe-core, keyboard and 320px reflow, plus a first VoiceOver pass on iPhone (Oct 2026).
- **Dependencies:** `npm audit` is clean (Vitest upgraded to 5 in Oct 2026). Vitest 5 needs Node 22.12+ or 24+.

## Stack

- Vite + React 19 + TypeScript (strict)
- Vitest for unit tests
- Plain CSS with design tokens in `src/styles.css` (no CSS framework)
- Tiny hash router in `src/lib/route.ts` (`#/`, `#/path/:id`, `#/lesson/:id`, `#/review`, `#/account`, `#/privacy`, `#/skills`, `#/credits`, `#/achievements`, `#/certificate/:path/:date/:name`)

## Commands

- `npm run dev` — local dev server
- `npm test` — run tests once
- `npm run typecheck` — TypeScript check
- `npm run build` — typecheck + production build

Run `npm run typecheck` and `npm test` after every change.

## Layout

- `src/content/types.ts` — content model (LearningPath → Lesson → Exercise). Exercise types: compare, choice, spot (see the Exercise types section of `CONTENT_GUIDELINES.md`)
- `src/content/paths/*.ts` — one file per learning path; register live paths in `paths/index.ts`
- `src/content/skills.ts` — skills for the skill map. Every lesson lists its `skills`; `src/lib/skills.ts` computes progress per skill from `progress.seen` and the review pile. A content test requires each skill to have at least 3 lessons.
- `src/content/content.test.ts` — integrity checks for all content (unique IDs, sources, valid answers, no scripts in mockups)
- `src/lib/progress.ts` — pure progress logic (XP, streaks, spaced review with `REVIEW_INTERVALS`). Keep it free of React and storage. Review items are `{ step, due }`; `normalizeReviewItem` migrates older stored shapes, so never remove that migration.
- `src/lib/store.ts` — `ProgressStore` interface + localStorage implementation. localStorage stays the source of truth on each device. `normalizeProgress` brings anything stored (browser, server, backup file) to the current shape and fills in fields added later; new `Progress` fields need a default there, a rule in `merge.ts`, and a mention in the privacy notice.
- `src/lib/rewards.ts` — levels (`LEVELS`), achievements (`BADGES`) and `settle()`, which `useProgress` runs after every change to hand out a streak freeze per new level (max 2) and new badges. Rewards never lock content. Badge IDs are stable keys in `progress.badges`: never rename or reuse them. XP goes through `gainXp` so it counts toward the daily goal (`progress.goal`, `dayXp`).
- `src/lib/merge.ts`, `src/lib/sync.ts` — pure three-way merge and one sync round (pull, merge, push). Tested with fakes.
- `src/lib/backup.ts`, `src/components/ProgressBackup.tsx` — save progress to a JSON file and load it elsewhere (account page; linked from the home footer). Loading combines with this browser's progress through `mergeProgress` with no base, so it never removes anything; hand-edited values with the wrong shape are dropped. On touch devices saving uses the share sheet (iPhone: Save to Files), otherwise a download.
- `src/lib/certificate.ts`, `src/lib/certificateImage.ts`, `src/pages/CertificatePage.tsx`, `src/components/CertificateOffer.tsx` — path certificates. A certificate lives only in its link (path, date, name); nothing is stored on a server, and the page says it isn't verified. Offered on a finished path's page. Share options: copy link, save a PNG (canvas, theme tokens), and LinkedIn's add-certification form. `src/lib/saveFile.ts` shares files on touch devices and downloads elsewhere (also used by progress backup).
- `src/lib/cloud.ts`, `src/lib/useCloudSync.ts` — optional Supabase sync (email code sign-in). Off unless `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are set (GitHub repo variables `SUPABASE_URL`/`SUPABASE_KEY` for the deployed site). Schema and row level security: `supabase/schema.sql`.
- `src/pages/PrivacyPage.tsx`, `src/content/site.ts` — privacy notice and owner/contact details. Keep the notice true: any new data collection, provider or third-party request must update it (and `privacyUpdated`) in the same change.
- `src/art/` — original lesson icons (`icons.tsx`, 24px line icons in currentColor) and animated SVG scenes (`scenes*.tsx`, one file per path, shared helpers in `kit.tsx`), keyed by lesson ID and combined in `index.ts`. Every lesson must have both (a content test checks). Scene rules: decorative and `aria-hidden`; theme classes only (no literal colors); base styles are the final frame and keyframes play once, ending within 5 seconds, so reduced motion shows the finished scene.
- `src/lib/sound.ts`, `src/lib/useSound.ts`, `src/components/SoundToggle.tsx` — feedback sounds synthesized with Web Audio (correct, wrong, lesson complete) and the header toggle. Sound rules: never the only cue (always repeats visible text), under 1 second, only in response to the learner's action, low volume, and switchable off (remembered per device). `sound.test.ts` checks length and volume. Phones pause web audio in the background (Safari reports "interrupted"); `playSound` resumes or replaces the AudioContext inside the learner's tap, and `sound-recovery.test.ts` covers those paths with a fake context.
- Navigation: the home page shows one card per learning path (`HomePage`); each opens `#/path/:id` (`PathPage`: overview, progress, one main action, `LessonList`). Lessons link back to their path. `src/lib/pathStatus.ts` computes a path's progress and next lesson. Path icons (`pathIcons` in `src/art/icons.tsx`, home cards) and banners (`pathHeroes` in `src/art/path-heroes.tsx`, 640×240, top of the path page) follow the scene rules; a new path needs both (a content test checks).
- PWA: `vite-plugin-pwa` in `vite.config.ts` (manifest, Workbox precache of the built app, `registerType: "prompt"`). `src/components/UpdatePrompt.tsx` registers the service worker, checks for updates when the app returns to the foreground, and shows an Update/Later bar inside the header. Icons in `public/icons/` (master `icon.svg`; PNGs exported from it), favicon `public/favicon.svg`. If you change the icon, re-export all PNG sizes.
- Link previews: Open Graph and Twitter tags in `index.html` (absolute URLs to https://openuxlab.com) and `public/og-image.png` (1200×630, app fonts and colors). Update both if the name, tagline or domain changes.
- `src/pages/CreditsPage.tsx`, `src/lib/credits.ts` — sources and credits page; source lists are generated from lesson data, so new sources appear automatically. Update the fonts/software lists there if those change.
- Analytics: `src/lib/analytics.ts` sends anonymous daily counts (`visit`, `lesson_opened`, `lesson_completed`, `exercise_right`, `exercise_wrong`, `review_completed`) to `track_event()` in Supabase (`usage_counts` table, no IDs, no reads through the API). Never add user, session or device IDs. Skipped in dev, with Global Privacy Control/Do Not Track, or when the learner opts out on the privacy page. Stats queries: `supabase/stats.sql`. New event names need the table's check constraint, the type and the privacy page updated together.
- `src/components/`, `src/pages/` — UI

## Content rules (important — the app is meant to be shared)

See `CONTENT_GUIDELINES.md`. In short:
- Write all lesson text, questions and explanations in original words. Never paste or closely paraphrase paragraphs from sources such as NN/g, IxDF, Laws of UX or Baymard.
- Every lesson links to at least one trusted source for depth.
- Content from openly licensed sources (e.g. GOV.UK Design System, USWDS, W3C) may be adapted only if its license allows it, with attribution. Check the license first and set `license` on the source (a content test requires it for GOV.UK and USWDS links); the lesson page then shows the attribution.
- Exercise mockups are small HTML snippets using the `.mk-*` classes (a content test fails if a class doesn't exist in `styles.css`). `.mk-say` shows what a screen reader announces; `.mk-faint` deliberately fails contrast and may only appear in the wrong design. They are rendered as trusted HTML, so never include scripts, event handlers or user input.
- Every compare exercise has `describe: { a, b }`: what a screen reader user hears for each design instead of the mockup. Neutral words, key text plus the visual details the question turns on (a content test checks length and bans judging words).
- Exercise IDs are stable keys for learners' review piles. Never rename or reuse an ID once shipped.
- Lesson `code` (H1, A3...) is for authors only. Don't show it in the UI; use the lesson title.

## Writing style for lessons

- Plain, direct sentences. Second person where it helps ("you"), active voice.
- Concrete examples from real products: enterprise tools, forms, dashboards, checkout.
- Explanations ("why") say why the right answer is right AND what's wrong with the alternative.
- Distractors should be plausible things a real team might do, not jokes.

## Design system

- Tokens are defined on `:root` with dark-mode overrides (`prefers-color-scheme` and `[data-theme]`). Use tokens, never literal colors.
- Fonts: two typefaces only, Bricolage Grotesque (display: headings and big numbers) and Atkinson Hyperlegible (everything else, including labels, chips and text in illustrations), self-hosted via @fontsource. This follows the Visual design basics typography lesson; don't add a third. Don't add Google Fonts or other third-party requests (see the privacy notice).
- The app must stay keyboard-accessible, readable at 400px wide, and meet WCAG AA contrast. This is a UX learning app, so it should model good UX.
- Every screen has exactly one `h1` (exercise questions are the `h1` on exercise screens). After a route change or a lesson/review step, call `announceScreen()` from `src/lib/focus.ts`: it sets the tab title and moves focus to the `h1`.
- Never show state by color alone: answer states use text labels ("Your answer", "Correct answer") as well as color. Use `--mark-ink` (not `--mark`) for gold text.
- Links that open a new tab include visually hidden "(opens in a new tab)" text.
- VoiceOver on iPhone reads every JSX text piece and inline element as a separate swipe. Build non-interactive sentences with numbers as one template string (`{`${n} of ${total} done`}`), and wrap styled phrases (bold numbers, the logo) in `Spoken` (`src/components/Spoken.tsx`), which gives screen readers one string.
- The header is sticky only above 720px wide; on phones it scrolls away so it can't cover the item VoiceOver or the keyboard moves to (WCAG 2.4.11). Desktop uses `scroll-padding-top`.

## Roadmap

See `docs/ROADMAP.md`.
