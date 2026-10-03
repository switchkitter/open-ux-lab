# Roadmap

## 0.1 — Foundation
- [x] Heuristics path: 10 lessons, 20 exercises
- [x] XP, daily streak, review pile
- [x] Progress logic separated from storage
- [x] Verify install, typecheck, tests and build on a real machine
- [x] Deploy a preview (GitHub Pages, via `.github/workflows/deploy.yml`)

## 0.2 — More content
- [x] Accessibility basics path (W3C WAI): 8 lessons, 16 exercises
- [x] Laws of UX path: 8 lessons, 16 exercises
- [x] Form design path (GOV.UK, USWDS): 8 lessons, 16 exercises
- [x] UX research methods path (GOV.UK Service Manual, NN/g, Pew): 8 lessons, 24 exercises, new User research skill
- [x] Visual design basics path (GOV.UK, USWDS, WCAG, NN/g, Material): 8 lessons, 24 exercises
- [x] Third exercise type: "spot the problem" (8 exercises, keyboard and screen reader accessible)
- [x] A spot-the-problem exercise in every lesson (34)
- [x] Shuffle option order in choice exercises

## Visual polish
- [x] Icons and animated scenes for the heuristics path, lesson tiles, small UI motion
- [x] Icons and scenes for Accessibility, Form design and Laws of UX (all 34 lessons)
- [x] Lesson codes (H1, A3...) removed from the UI
- [x] Sound effects for right and wrong answers and lesson completion, with a header toggle
- [x] Home page shows a card per learning path; each path has its own page with its lessons
- [x] Animated banner illustration at the top of each path page

## App
- [x] Installable PWA: manifest, app icon, offline support, "new version" prompt

## 0.3 — Learning that sticks
- [x] Spaced repetition with due dates (missed items return after 1, 3 and 7 days, then clear)
- [x] Skill map across paths (9 skills, #/skills)
- [x] Progress export/import as a file (account page; loading combines with existing progress)

## Motivation
- [x] Levels (Intern to UX legend), each earning a streak freeze; achievements (17 badges); daily XP goal; streak freezes. Nothing is locked behind XP.
- [x] Path certificates: link-only (no server storage), saved image, Add to LinkedIn
- [ ] Cosmetic unlocks (accent color themes by level)

## 0.4 — Ready to share
- [x] Privacy notice (#/privacy) and self-service account deletion
- [x] Self-hosted fonts (no third-party requests)
- [x] Accounts and synced progress (Supabase, email code sign-in, three-way merge), live
- [ ] Content moved to Markdown/MDX files so non-developers can contribute
- [x] Accessibility audit of the app itself (axe-core on every screen, keyboard walk-through, 320px reflow; Oct 2026)
- [x] VoiceOver pass on iPhone (Oct 2026): fixed split announcements, feedback read in one go, header covering focus, and added text descriptions to every compare design
- [ ] Screen reader pass on Windows (NVDA or Narrator)
- [x] License for code (MIT) and content (CC BY 4.0)
- [x] Link preview (Open Graph image and tags)
- [x] Sign-in emails from hello@openuxlab.com (Brevo domain authentication)
- [x] Attribution page (Sources and credits, #/credits)
- [x] Privacy-respecting analytics: anonymous daily counts in Supabase, opt-out, GPC/DNT respected
