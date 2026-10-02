# Content guidelines

Open UX Lab teaches from trusted public sources but publishes only original material. These rules keep the app safe to share.

## Sources we build from

| Source | Use for | How we use it |
| --- | --- | --- |
| Nielsen Norman Group (nngroup.com) | Heuristics, research methods, interaction patterns | Summarize in our own words, link out |
| W3C WAI (w3.org/WAI) | Accessibility, WCAG, ARIA patterns | Summarize and link; check the W3C document license before adapting any text |
| GOV.UK Design System | Forms, components, research rationale | Openly licensed; adapt with attribution per its license |
| U.S. Web Design System (designsystem.digital.gov) | Components, accessibility, research | Public domain in the U.S. for federal works; still attribute |
| Material Design, Apple HIG | Platform conventions | Summarize and link only |
| Laws of UX (lawsofux.com) | Psychology principles | Summarize and link only |
| Baymard Institute (free articles) | Forms, checkout, e-commerce | Summarize and link only |
| IxDF free literature | Background concepts | Summarize and link only |

Always confirm a source's current license before adapting its text. When unsure, treat it as "summarize and link only".

## Rules

1. **Original wording.** Write lessons, questions and explanations from scratch. Don't copy sentences or follow a source article's structure point by point.
2. **Short quotes only, rarely.** If exact wording really matters, quote under 15 words, once per source, with attribution.
3. **Always link.** Every lesson has at least one source link so learners can go deeper.
4. **Original examples.** Mockups and scenarios are invented by us. Don't recreate screenshots of real products or brand assets.
5. **No real people's data.** Names in mockups are fictional.

## Checklist for a new lesson

- [ ] Body (2 short paragraphs) in original words
- [ ] 3–4 "In practice" bullets
- [ ] One "Try it at work" field exercise
- [ ] At least one https source
- [ ] At least one compare exercise and one choice exercise (a spot-the-problem exercise is optional)
- [ ] Every exercise has a unique, stable `id`
- [ ] `skills` lists the skills the lesson builds (see `src/content/skills.ts`)
- [ ] Every "why" explains the right answer and what's wrong with the alternatives
- [ ] `npm test` passes

## Exercise types

- **Compare** ("Which is better?"): two mockups, one better. Good for visual problems such as contrast, spacing and hierarchy.
- **Choice**: a question with 3–4 options. Options are shuffled on screen, so never refer to positions ("the first option", "all of the above").
- **Spot the problem**: one mockup split into parts; the learner selects the part that breaks the principle.
  - Only for problems that come across in words: labels, wording, error messages, control choice, link text, what an action does. Purely visual problems (contrast, alignment) can't be found with a screen reader, so use a compare exercise for those.
  - Each part's `label` is everything a screen reader user hears for it, so it must include the part's visible text and describe what's there in neutral words ("Field labeled Email", "Small text link: continue"). Never hint at which part is wrong.
  - Use 3–6 parts, with one clear problem. The `why` should also say briefly why the other parts are fine.

## Icons and illustrations

- All art is original. Don't trace or recreate icons or illustrations from Uxcel, NN/g or any other product.
- Lesson icons and scenes live in `src/art/`. Scenes act out the lesson's principle in a few seconds of motion and must read clearly as a still image too.
- Art is decorative: never put information in a scene that isn't also in the lesson text.
