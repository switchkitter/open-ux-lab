# Open UX Lab

A free, Uxcel-style UX learning app: short lessons followed by "pick the better design" exercises, with XP, streaks and a review pile for missed questions. The goal is to grow it into something good enough to share publicly.

## Status

- **Built:** Path 1, Nielsen's 10 usability heuristics (10 lessons, 20 exercises). Path 2, Accessibility basics (8 lessons, 16 exercises). Path 3, Form design (8 lessons, 16 exercises). Path 4, Laws of UX (8 lessons, 16 exercises). Progress is stored in the browser (localStorage).
- **Live:** https://switchkitter.github.io/open-ux-lab/ (repo switchkitter/open-ux-lab). Every push to `main` runs tests and build, then deploys via `.github/workflows/deploy.yml`.
- **Verified (2026-10-01):** `npm install`, `npm run typecheck`, `npm test` (15 tests) and `npm run build` all pass on Node 24.
- **Known:** `npm audit` reports a moderate advisory in vitest 3.x (dev-only, via `@vitest/mocker`). The fix is a major upgrade to vitest 5; not done yet.

## Stack

- Vite + React 19 + TypeScript (strict)
- Vitest for unit tests
- Plain CSS with design tokens in `src/styles.css` (no CSS framework)
- Tiny hash router in `src/lib/route.ts` (`#/`, `#/lesson/:id`, `#/review`, `#/account`, `#/privacy`)

## Commands

- `npm run dev` — local dev server
- `npm test` — run tests once
- `npm run typecheck` — TypeScript check
- `npm run build` — typecheck + production build

Run `npm run typecheck` and `npm test` after every change.

## Layout

- `src/content/types.ts` — content model (LearningPath → Lesson → Exercise)
- `src/content/paths/*.ts` — one file per learning path; register live paths in `paths/index.ts`
- `src/content/content.test.ts` — integrity checks for all content (unique IDs, sources, valid answers, no scripts in mockups)
- `src/lib/progress.ts` — pure progress logic (XP, streaks, review). Keep it free of React and storage.
- `src/lib/store.ts` — `ProgressStore` interface + localStorage implementation. localStorage stays the source of truth on each device.
- `src/lib/merge.ts`, `src/lib/sync.ts` — pure three-way merge and one sync round (pull, merge, push). Tested with fakes.
- `src/lib/cloud.ts`, `src/lib/useCloudSync.ts` — optional Supabase sync (email code sign-in). Off unless `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are set (GitHub repo variables `SUPABASE_URL`/`SUPABASE_KEY` for the deployed site). Schema and row level security: `supabase/schema.sql`.
- `src/pages/PrivacyPage.tsx`, `src/content/site.ts` — privacy notice and owner/contact details. Keep the notice true: any new data collection, provider or third-party request must update it (and `privacyUpdated`) in the same change.
- `src/components/`, `src/pages/` — UI

## Content rules (important — the app is meant to be shared)

See `CONTENT_GUIDELINES.md`. In short:
- Write all lesson text, questions and explanations in original words. Never paste or closely paraphrase paragraphs from sources such as NN/g, IxDF, Laws of UX or Baymard.
- Every lesson links to at least one trusted source for depth.
- Content from openly licensed sources (e.g. GOV.UK Design System, USWDS, W3C) may be adapted only if its license allows it, with attribution. Check the license first and set `license` on the source (a content test requires it for GOV.UK and USWDS links); the lesson page then shows the attribution.
- Exercise mockups are small HTML snippets using the `.mk-*` classes (a content test fails if a class doesn't exist in `styles.css`). `.mk-say` shows what a screen reader announces; `.mk-faint` deliberately fails contrast and may only appear in the wrong design. They are rendered as trusted HTML, so never include scripts, event handlers or user input.
- Exercise IDs are stable keys for learners' review piles. Never rename or reuse an ID once shipped.

## Writing style for lessons

- Plain, direct sentences. Second person where it helps ("you"), active voice.
- Concrete examples from real products: enterprise tools, forms, dashboards, checkout.
- Explanations ("why") say why the right answer is right AND what's wrong with the alternative.
- Distractors should be plausible things a real team might do, not jokes.

## Design system

- Tokens are defined on `:root` with dark-mode overrides (`prefers-color-scheme` and `[data-theme]`). Use tokens, never literal colors.
- Fonts: Bricolage Grotesque (display), Atkinson Hyperlegible (body), JetBrains Mono (labels/codes), self-hosted via @fontsource. Don't add Google Fonts or other third-party requests (see the privacy notice).
- The app must stay keyboard-accessible, readable at 400px wide, and meet WCAG AA contrast. This is a UX learning app, so it should model good UX.
- Every screen has exactly one `h1` (exercise questions are the `h1` on exercise screens). After a route change or a lesson/review step, call `announceScreen()` from `src/lib/focus.ts`: it sets the tab title and moves focus to the `h1`.
- Never show state by color alone: answer states use text labels ("Your answer", "Correct answer") as well as color. Use `--mark-ink` (not `--mark`) for gold text.
- Links that open a new tab include visually hidden "(opens in a new tab)" text.

## Roadmap

See `docs/ROADMAP.md`.
