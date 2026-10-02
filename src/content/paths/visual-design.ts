import type { License, Lesson, LearningPath, Source } from "../types";

// Lesson text is original. GOV.UK Design System content is Open Government Licence v3.0 and USWDS is
// public domain / CC0 (checked 2026-10-02); NN/g, Material Design and W3C are summarized and linked.
const OGL: License = {
  name: "the Open Government Licence v3.0",
  url: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
};
const CC0: License = { name: "CC0 1.0 (public domain)", url: "https://creativecommons.org/publicdomain/zero/1.0/" };

const govuk = (path: string, title: string): Source => ({
  title: `GOV.UK Design System: ${title}`,
  url: `https://design-system.service.gov.uk/${path}/`,
  license: OGL,
});
const uswds = (path: string, title: string): Source => ({
  title: `USWDS: ${title}`,
  url: `https://designsystem.digital.gov/${path}/`,
  license: CC0,
});
const nng = (slug: string, title: string): Source => ({ title: `NN/g: ${title}`, url: `https://www.nngroup.com/articles/${slug}/` });
const understanding = (slug: string, title: string): Source => ({
  title: `WCAG 2.2 Understanding: ${title}`,
  url: `https://www.w3.org/WAI/WCAG22/Understanding/${slug}.html`,
});

const line = (label: string, text: string) => `<div class="mk-row"><span class="mk-label">${label}</span><span>${text}</span></div>`;
const btn = (text: string, cls = "") => `<span class="mk-btn${cls ? " " + cls : ""}">${text}</span>`;

const lessons: Lesson[] = [
  {
    id: "v1",
    code: "V1",
    title: "Visual hierarchy",
    subtitle: "Show what matters first",
    minutes: 5,
    skills: ["layout"],
    body: [
      "Visual hierarchy is the order in which people notice things. Size, weight, color, contrast, position and space all signal importance. In left-to-right languages, the biggest, boldest, highest-contrast element near the top left gets seen first, and small faint text last.",
      "A clear hierarchy matches that visual order to what matters for the task: what this screen is, the key information, then the main action. When everything is large and bold, nothing stands out, and people have to read it all to find what they came for.",
    ],
    practice: [
      "Decide the one or two things people must see first on each screen, and make those the most prominent.",
      "Use a few distinct levels, such as title, section heading, body and caption, rather than many slightly different sizes.",
      "Combine signals. Size with weight and space reads more clearly than size alone.",
      "Squint at the screen, or blur a screenshot, to check what stands out.",
    ],
    fieldExercise:
      "Blur a screenshot of your product's most-used screen. Write down the first three things you notice, and compare them with what people need first.",
    sources: [
      nng("visual-hierarchy-ux-definition", "Visual Hierarchy in UX: Definition"),
      nng("principles-visual-design", "5 Principles of Visual Design in UX"),
    ],
    exercises: [
      {
        id: "v1-balance-first",
        type: "compare",
        question: "Which account summary makes the balance easiest to find?",
        a: `<div class="mk">${line("Account", "Everyday saver")}${line("Balance", "$4,218.50")}${line("Interest rate", "2.1%")}${line("Updated", "Today, 9:14 AM")}</div>`,
        b: `<div class="mk"><div class="mk-label">Everyday saver</div><div class="mk-big">$4,218.50</div><div class="mk-muted">Available balance</div>${line("Interest rate", "2.1%")}${line("Updated", "Today, 9:14 AM")}</div>`,
        correct: "b",
        why: "B makes the balance, the one number people open this screen for, the largest thing on it, with supporting details quieter below. In A every line has the same size and weight, so people have to read each row to find it.",
      },
      {
        id: "v1-everything-bold",
        type: "choice",
        question: "On a product page, the title, price, delivery details, reviews and Add to cart button are all large and bold. What's the problem?",
        options: [
          "When everything is emphasized, nothing stands out, so people can't tell what matters most",
          "Bold text is always harder to read than regular text",
          "The page needs more colors to separate the sections",
          "Nothing, because important information should be bold",
        ],
        correct: 0,
        why: "Emphasis only works by contrast with what's around it, so making everything prominent removes the hierarchy. Bold text isn't hard to read in itself, and adding colors would add more noise rather than fix the order of importance.",
      },
      {
        id: "v1-spot-competing",
        type: "spot",
        question: "Which part competes with what people need to see first?",
        title: "Team overview",
        parts: [
          { id: "title", label: "Page title: Team overview, large and bold", html: `<div class="mk-big" style="font-size:22px">Team overview</div>` },
          { id: "number", label: "Key number: 12 open tickets, large", html: `<div class="mk-big">12</div><div class="mk-muted">open tickets</div>` },
          { id: "note", label: "Footnote: Data refreshes every 5 minutes, in the same large bold style as the page title", html: `<div class="mk-big" style="font-size:22px">Data refreshes every 5 minutes</div>` },
          { id: "button", label: "Button: View tickets", html: btn("View tickets") },
        ],
        correct: "note",
        why: "A footnote about refresh timing is the least important thing here, but it's styled like the page title, so it pulls attention away from the open tickets. It should be small, quiet text. The title, key number and button are styled in sensible order.",
      },
    ],
  },
  {
    id: "v2",
    code: "V2",
    title: "Typography for interfaces",
    subtitle: "Text that's easy to read",
    minutes: 5,
    skills: ["layout", "accessibility"],
    body: [
      "Most of an interface is text, so type does most of the work. Body text needs to be big enough to read comfortably, usually 16 pixels or more on the web, with generous spacing between lines, about 1.5 times the font size, so the eye can find the start of the next line.",
      "Line length matters too. Very long lines are tiring to follow and very short ones break the flow. About 45 to 90 characters per line suits most reading, with around 66 a good target for long text. Set text left-aligned rather than justified, use one or two typefaces at most, and check your layout still works when people enlarge text or increase its spacing.",
    ],
    practice: [
      "Use 16px or larger for body text, and keep smaller text for short labels.",
      "Set line height to about 1.5 for paragraphs.",
      "Cap the width of text blocks so lines stay around 45 to 90 characters.",
      "Align text to the left in left-to-right languages, and avoid justified text, which leaves uneven gaps.",
    ],
    fieldExercise:
      "Open your product's longest page of text on a desktop screen. Count the characters on a typical line, and if it's over 90, find where to cap the width.",
    sources: [
      uswds("components/typography", "Typography"),
      govuk("styles/type-scale", "Type scale"),
      understanding("visual-presentation", "Visual Presentation"),
      understanding("text-spacing", "Text Spacing"),
    ],
    exercises: [
      {
        id: "v2-readable-text",
        type: "compare",
        question: "Which help article is easier to read?",
        a: `<div class="mk"><div class="mk-title">Change your billing address</div><p style="margin:0;font-size:11px;line-height:1.1;text-align:justify">To change your billing address, open Settings and choose Billing. Your new address applies to the next invoice. Past invoices keep the address they were issued with, so download them first if you need copies.</p></div>`,
        b: `<div class="mk"><div class="mk-title">Change your billing address</div><p style="margin:0;font-size:14px;line-height:1.55;max-width:30ch">To change your billing address, open Settings and choose Billing. Your new address applies to the next invoice. Past invoices keep the address they were issued with, so download them first if you need copies.</p></div>`,
        correct: "b",
        why: "B uses a larger size, generous line spacing, a comfortable line length and left alignment, so the eye moves easily from line to line. A is small, cramped and justified, which leaves uneven gaps between words and makes lines hard to track.",
      },
      {
        id: "v2-line-height",
        type: "choice",
        question: "Your body text is 16px. Which line height is the best starting point for paragraphs?",
        options: ["16px (1.0)", "24px (1.5)", "40px (2.5)", "Whatever fits the most text on screen"],
        correct: 1,
        why: "About 1.5 times the font size gives the eye room to find the next line, and it's the spacing WCAG uses as a benchmark for readable text. 1.0 crams lines together, 2.5 spreads them so far apart that a paragraph stops reading as one block, and fitting more text isn't the goal.",
      },
      {
        id: "v2-spot-legal",
        type: "spot",
        question: "Which part of this article page will be hardest to read?",
        title: "Working from home policy",
        parts: [
          { id: "heading", label: "Heading: Working from home policy, large and bold", html: `<div class="mk-big" style="font-size:22px">Working from home policy</div>` },
          { id: "body", label: "Body text: 16 pixels, line height 1.5, about 70 characters per line", html: `<p style="margin:0;font-size:14px;line-height:1.5">You can work from home up to three days a week, agreed with your manager in advance.</p>` },
          { id: "legal", label: "Legal note: 10 pixel gray text, justified", html: `<p class="mk-muted" style="margin:0;font-size:10px;line-height:1.1;text-align:justify">This policy applies to all permanent and fixed-term employees and may be updated at any time by the people team following consultation.</p>` },
          { id: "link", label: "Link: Download the full policy (PDF)", html: `<span class="mk-link">Download the full policy (PDF)</span>` },
        ],
        correct: "legal",
        why: "Tiny, tightly spaced, justified text is hard for everyone and impossible for some people to read, and legal wording is exactly what people need to understand. Give it normal body styling, perhaps a little smaller. The heading, body text and link are readable.",
      },
    ],
  },
  {
    id: "v3",
    code: "V3",
    title: "Spacing and alignment",
    subtitle: "Space is information",
    minutes: 4,
    skills: ["layout"],
    body: [
      "Consistent spacing makes a layout feel calm and easy to scan. Pick a small set of spacing values, a scale, and only use those: for example 4, 8, 16, 24, 32 and 48 pixels, or the 5-pixel steps the GOV.UK Design System uses. Random gaps of 13, 17 and 22 pixels look careless and blur which things belong together.",
      "Alignment works the same way. Line elements up along a few strong edges so the eye can travel straight down the page. Every extra starting point, like a centered label above a left-aligned field, adds visual noise. Use more space between groups than within them, so the structure is obvious at a glance.",
    ],
    practice: [
      "Choose a spacing scale and use only its values.",
      "Align elements to a few shared edges, usually the left edge of the content.",
      "Leave more space between groups than inside them.",
      "Avoid centering blocks of text and form labels. Left-aligned content is easier to scan.",
    ],
    fieldExercise:
      "Measure the gaps between elements on one screen of your product. List every different value you find, and map each to the nearest step of a simple scale.",
    sources: [
      govuk("styles/spacing", "Spacing"),
      uswds("design-tokens/spacing-units", "Spacing units"),
      { title: "Material Design 3: Spacing", url: "https://m3.material.io/foundations/layout/understanding-layout/spacing" },
    ],
    exercises: [
      {
        id: "v3-one-edge",
        type: "compare",
        question: "Which settings card is easier to scan?",
        a: `<div class="mk"><div class="mk-title" style="text-align:center">Profile</div><div class="mk-label" style="text-align:right">Display name</div><div class="mk-in" style="margin-left:24px">Priya</div><div class="mk-label" style="text-align:center">Time zone</div><div class="mk-in" style="margin-left:8px">Europe/Dublin ▾</div><div style="text-align:center">${btn("Save")}</div></div>`,
        b: `<div class="mk"><div class="mk-title">Profile</div><div class="mk-label">Display name</div><div class="mk-in">Priya</div><div class="mk-label">Time zone</div><div class="mk-in">Europe/Dublin ▾</div><div>${btn("Save")}</div></div>`,
        correct: "b",
        why: "In B everything shares one left edge, so the eye runs straight down the card. In A the title, labels, fields and button all start in different places, so people have to hunt for the start of each element, and labels drift away from their fields.",
      },
      {
        id: "v3-scale",
        type: "choice",
        question: "A design uses gaps of 7, 9, 13, 18, 22 and 31 pixels. What's the best fix?",
        options: [
          "Replace them with a small scale, such as 4, 8, 16, 24 and 32, and use only those",
          "Make every gap 20 pixels",
          "Keep them, because each one was chosen carefully",
          "Remove the gaps to fit more on the screen",
        ],
        correct: 0,
        why: "A small scale keeps spacing consistent while still letting gaps differ, so groups stay clear. Making every gap the same throws away the grouping that spacing communicates, and removing gaps makes everything run together.",
      },
      {
        id: "v3-spot-misaligned",
        type: "spot",
        question: "Which part breaks this form's alignment?",
        title: "Contact details",
        parts: [
          { id: "name", label: "Label Full name, left-aligned, with its field on the same left edge", html: `<div class="mk-label">Full name</div><div class="mk-in">&nbsp;</div>` },
          { id: "email", label: "Label Email, left-aligned, with its field on the same left edge", html: `<div class="mk-label">Email</div><div class="mk-in">&nbsp;</div>` },
          { id: "phone", label: "Label Phone number, centered, above a field indented 30 pixels from the others", html: `<div class="mk-label" style="text-align:center">Phone number</div><div class="mk-in" style="margin-left:30px">&nbsp;</div>` },
          { id: "save", label: "Button: Save, on the same left edge", html: btn("Save") },
        ],
        correct: "phone",
        why: "The phone number label is centered and its field is indented, so it breaks the strong left edge everything else follows, and the label no longer sits clearly with its field. Line it up with the others. The rest of the form shares one edge.",
      },
    ],
  },
  {
    id: "v4",
    code: "V4",
    title: "Color with a purpose",
    subtitle: "Fewer colors, clearer meaning",
    minutes: 5,
    skills: ["layout", "accessibility"],
    body: [
      "Color is most useful when it means something. Keep a small palette: neutrals for most of the interface, one accent color for interactive elements, and a few colors with fixed meanings for success, warning and error. Use them the same way everywhere, so the accent always means “you can click this” and red always means “something's wrong”.",
      "Every pairing needs enough contrast: 4.5:1 for normal text, and 3:1 for large text and interface parts. Color should support meaning, never carry it alone, as the Accessibility basics path explains. And the more colors compete for attention, the easier it is to miss the ones that matter.",
    ],
    practice: [
      "Limit the palette to neutrals, one accent, and success, warning and error colors.",
      "Give each color one job, and keep that job across the whole product.",
      "Check contrast for every text and background pair, in light and dark themes.",
      "Don't use the error color for decoration, or people will read it as a problem.",
    ],
    fieldExercise:
      "List every color on one screen of your product, and write next to each what it means. Mark any color with no clear job, and any job that uses more than one color.",
    sources: [
      govuk("styles/colour", "Colour"),
      uswds("design-tokens/color/overview", "Color"),
      nng("color-enhance-design", "Using Color to Enhance Your Design"),
    ],
    exercises: [
      {
        id: "v4-color-signals",
        type: "compare",
        question: "On which dashboard is the urgent problem easier to spot?",
        a: `<div class="mk"><div class="mk-grid"><div class="mk-cell" style="background:var(--accent-soft)"><b>128</b>Orders</div><div class="mk-cell" style="background:var(--good-soft)"><b>$9.4k</b>Revenue</div><div class="mk-cell" style="background:var(--mark-soft)"><b>2</b>Failed payments</div><div class="mk-cell" style="background:var(--bad-soft)"><b>14</b>New customers</div><div class="mk-cell" style="background:var(--accent-soft)"><b>4.6</b>Rating</div><div class="mk-cell" style="background:var(--good-soft)"><b>31</b>Returns</div></div></div>`,
        b: `<div class="mk"><div class="mk-grid"><div class="mk-cell"><b>128</b>Orders</div><div class="mk-cell"><b>$9.4k</b>Revenue</div><div class="mk-cell" style="background:var(--bad-soft);border-color:var(--bad)"><b>⚠ 2</b>Failed payments</div><div class="mk-cell"><b>14</b>New customers</div><div class="mk-cell"><b>4.6</b>Rating</div><div class="mk-cell"><b>31</b>Returns</div></div></div>`,
        correct: "b",
        why: "In B the tiles are neutral, so the one red tile with a warning icon stands out as the thing needing attention. In A every tile has its own color for no reason, so the failed payments blend in, and “New customers” even looks like a problem.",
      },
      {
        id: "v4-red-badges",
        type: "choice",
        question: "The marketing team wants the “New” badges in the app to be bright red to grab attention. What's the risk?",
        options: [
          "People may read red as an error or warning, and real errors become easier to miss",
          "Red badges take longer to load",
          "Red is too dark to use for badges",
          "None, because red is the most eye-catching color",
        ],
        correct: 0,
        why: "When red already means “something's wrong”, using it for good news confuses that meaning and trains people to ignore it, so real errors get missed. Loading time and darkness aren't the issue, and being eye-catching is exactly why red should be saved for problems.",
      },
      {
        id: "v4-spot-color-job",
        type: "spot",
        question: "Which part uses a color against the meaning it has everywhere else?",
        title: "Your account",
        parts: [
          { id: "link", label: "Link: View invoice, in the blue link color", html: `<span class="mk-link">View invoice</span>` },
          { id: "button", label: "Button: Pay now, in the blue accent color", html: btn("Pay now") },
          { id: "success", label: "Message: Payment received, in green with a check mark", html: `<div class="mk-up">✓ Payment received</div>` },
          { id: "heading", label: "Section heading: Plan details, in red, with no problem to report", html: `<div class="mk-title" style="color:var(--bad)">Plan details</div>` },
        ],
        correct: "heading",
        why: "Red means “error” everywhere else in this interface, so a red heading makes people look for a problem that isn't there. Headings should use the normal text color. The link, button and success message each use their color for its usual job.",
      },
    ],
  },
  {
    id: "v5",
    code: "V5",
    title: "Layout and grids",
    subtitle: "Structure that adapts",
    minutes: 5,
    skills: ["layout"],
    body: [
      "A grid gives every screen the same underlying structure: a set of columns and gaps that content lines up to. It makes layouts feel consistent, speeds up design decisions, and helps people scan, because related things sit in predictable places.",
      "Layouts also have to adapt. On a phone, multi-column layouts usually collapse into one column, so the order of content matters. People scan rather than read, often down the left side and across the start of each block, so put key words at the start of headings and links, and keep the most important content first in the order, not just visually first on large screens.",
    ],
    practice: [
      "Use a grid with consistent columns and gaps, and line content up to it.",
      "Design the small-screen layout first, then add columns as space allows.",
      "Put the most important content first in the reading order.",
      "Start headings and link text with the key words, so scanning works.",
    ],
    fieldExercise:
      "View one of your product's pages at 320 pixels wide. Check that nothing scrolls sideways and that the most important content comes first.",
    sources: [
      nng("using-grids-in-interface-designs", "Using Grids in Interface Designs"),
      nng("f-shaped-pattern-reading-web-content", "F-Shaped Pattern of Reading: Misunderstood, But Still Relevant"),
      uswds("utilities/layout-grid", "Layout grid"),
      govuk("styles/layout", "Layout"),
    ],
    exercises: [
      {
        id: "v5-mobile-order",
        type: "compare",
        question: "On a phone, which content order works better for a product page?",
        a: `<div class="mk"><div class="mk-cell">1 · Related products</div><div class="mk-cell">2 · Reviews</div><div class="mk-cell">3 · Product photo</div><div class="mk-cell">4 · Price and Add to cart</div></div>`,
        b: `<div class="mk"><div class="mk-cell">1 · Product photo</div><div class="mk-cell">2 · Price and Add to cart</div><div class="mk-cell">3 · Description</div><div class="mk-cell">4 · Reviews</div></div>`,
        correct: "b",
        why: "B puts what shoppers came for, the product and how to buy it, first, with supporting detail after. A is what you get when a desktop sidebar collapses on top of the main content, pushing the price and button off the first screen.",
      },
      {
        id: "v5-grid-benefit",
        type: "choice",
        question: "What's the main benefit of designing on a consistent grid?",
        options: [
          "Content lines up in predictable places, so screens look consistent and are easier to scan",
          "It fits more content on each screen",
          "It removes the need to test on phones",
          "It makes every page look identical",
        ],
        correct: 0,
        why: "A shared structure means related things sit where people expect them, on every screen. A grid doesn't add space, it still needs testing at every size, and it supports varied layouts rather than making pages identical.",
      },
      {
        id: "v5-spot-buried-words",
        type: "spot",
        question: "People scan these search results. Which one is hardest to scan?",
        title: "Search results: expenses",
        parts: [
          { id: "r1", label: "Result title: Expense policy 2026", html: `<span class="mk-link">Expense policy 2026</span><div class="mk-muted">What you can claim and how to claim it.</div>` },
          { id: "r2", label: "Result title: Travel expenses: what you can claim", html: `<span class="mk-link">Travel expenses: what you can claim</span>` },
          { id: "r3", label: "Result title: This document, which was last revised by the finance team in March, describes how meal expenses work", html: `<span class="mk-link">This document, which was last revised by the finance team in March, describes how meal expenses work</span>` },
          { id: "filter", label: "Filter: Document type, showing All", html: `<div class="mk-in">Document type: All ▾</div>` },
        ],
        correct: "r3",
        why: "The useful words, meal expenses, come at the very end of a long title, and people scanning the start of each result will skip it. “Meal expenses: how they work” would be found at a glance. The other titles start with their key words.",
      },
    ],
  },
  {
    id: "v6",
    code: "V6",
    title: "Icons and imagery",
    subtitle: "Pictures that help, not puzzle",
    minutes: 4,
    skills: ["layout", "language"],
    body: [
      "Icons save space and can speed up recognition, but only a few, like search, home and print, are widely understood on their own. Most icons mean different things to different people, so pair them with a text label, especially in navigation. Keep one consistent style: the same line weight, corners and size.",
      "Images should add information or set the right tone, not fill space. A photo of the actual product, a screenshot of the step being described, or a diagram that explains a process helps people. Generic stock photos rarely do, and they push useful content further down the page.",
    ],
    practice: [
      "Label icons with text, unless the icon is universally understood and space is tight.",
      "Use one icon set with consistent stroke, size and style.",
      "Make icon buttons at least 24 by 24 pixels, and give them an accessible name.",
      "Choose images that show real content: the product, the step or the result.",
    ],
    fieldExercise:
      "Show five icons from your product, without their labels, to a colleague who doesn't work on it. Write down what they think each one does.",
    sources: [
      nng("icon-usability", "Icon Usability"),
      uswds("components/icon", "Icon"),
      understanding("target-size-minimum", "Target Size (Minimum)"),
    ],
    exercises: [
      {
        id: "v6-labelled-icons",
        type: "compare",
        question: "Which app navigation will new users understand faster?",
        a: `<div class="mk"><div class="mk-row" style="justify-content:space-around;font-size:18px"><span>⌂</span><span>✎</span><span>◷</span><span>⚙</span></div></div>`,
        b: `<div class="mk"><div class="mk-row" style="justify-content:space-around;text-align:center"><span>⌂<br><small>Home</small></span><span>✎<br><small>Notes</small></span><span>◷<br><small>History</small></span><span>⚙<br><small>Settings</small></span></div></div>`,
        correct: "b",
        why: "Labels remove the guesswork: the clock could mean history, reminders or recent items, and the pencil could mean edit, notes or compose. B tells people where each tab goes. A saves a little space but makes everyone guess, and new users guess wrong.",
      },
      {
        id: "v6-stock-photo",
        type: "choice",
        question: "A help page about resetting a password starts with a large stock photo of smiling people at laptops. What's the best change?",
        options: [
          "Replace it with a small screenshot of the reset screen, or remove it",
          "Make the photo bigger so the page feels friendlier",
          "Add a caption to the stock photo",
          "Use a different stock photo with more people in it",
        ],
        correct: 0,
        why: "A screenshot of the actual screen helps people recognize where they need to go, and removing the photo brings the steps up the page. A bigger or different stock photo still says nothing useful, and a caption doesn't make it relevant.",
      },
      {
        id: "v6-spot-odd-icon",
        type: "spot",
        question: "Which toolbar button breaks the visual pattern?",
        title: "Text editor toolbar",
        parts: [
          { id: "bold", label: "Button: Bold, a simple outline icon with the label Bold", html: `${btn("<b>B</b> Bold", "sec")}` },
          { id: "italic", label: "Button: Italic, a simple outline icon with the label Italic", html: `${btn("<i>I</i> Italic", "sec")}` },
          { id: "link", label: "Button: a colorful chain icon in a heavier style than the others, with no label", html: `<span class="mk-btn sec" style="background:var(--mark-soft)"><svg width="22" height="14" viewBox="0 0 24 14" aria-hidden="true"><ellipse cx="8" cy="7" rx="6" ry="4.5" fill="none" stroke="var(--bad)" stroke-width="3"/><ellipse cx="16" cy="7" rx="6" ry="4.5" fill="none" stroke="var(--accent)" stroke-width="3"/></svg></span>` },
          { id: "undo", label: "Button: Undo, a simple outline icon with the label Undo", html: `${btn("↶ Undo", "sec")}` },
        ],
        correct: "link",
        why: "The link button uses a different, colorful icon style and drops the label, so it looks like it belongs to another product and its meaning has to be guessed. Use the same outline style and a label, like the others. The rest of the toolbar is consistent.",
      },
    ],
  },
  {
    id: "v7",
    code: "V7",
    title: "Buttons that look clickable",
    subtitle: "Make actions obvious",
    minutes: 5,
    skills: ["control", "conventions"],
    body: [
      "People need to know what they can click without guessing. Buttons should look like buttons: a filled or outlined shape with a clear label and enough size and padding. Text styled like a heading, or a link that looks like plain text, gets missed.",
      "Use a clear order of actions: one primary button for the main action on a screen, secondary buttons for alternatives, and plain links for minor actions. When a page offers lots of equally loud actions, people stall, unsure which one is the next step. Design every state, including hover, focus, pressed and disabled, and write labels that say what happens, like “Save changes” rather than “OK”.",
    ],
    practice: [
      "Give each screen one primary action, styled to stand out.",
      "Use a quieter secondary style for other actions, and links for minor ones.",
      "Label buttons with what happens: “Send invoice”, not “Submit”.",
      "Design hover, focus, pressed and disabled states, and make focus clearly visible.",
    ],
    fieldExercise:
      "Screenshot one screen of your product and mark everything clickable. Then show an unmarked copy to someone and ask them to point to everything they think they could click.",
    sources: [
      govuk("components/button", "Button"),
      uswds("components/button", "Button"),
      nng("flat-ui-less-attention-cause-uncertainty", "Flat UI Elements Attract Less Attention and Cause Uncertainty"),
      nng("button-states-communicate-interaction", "Button States: Communicate Interaction"),
    ],
    exercises: [
      {
        id: "v7-looks-clickable",
        type: "compare",
        question: "Which card makes it clearer how to continue?",
        a: `<div class="mk"><div class="mk-title">Delivery address saved</div><div class="mk-muted">14 Mill Road, Galway</div><div class="mk-muted">Continue to payment →</div></div>`,
        b: `<div class="mk"><div class="mk-title">Delivery address saved</div><div class="mk-muted">14 Mill Road, Galway</div><div>${btn("Continue to payment")}</div></div>`,
        correct: "b",
        why: "B's button clearly looks like something to press. In A the way forward is gray text styled like the address above it, so many people won't realize they can click it and will wonder how to carry on.",
      },
      {
        id: "v7-labels",
        type: "choice",
        question: "Which button label is best for submitting an expense claim?",
        options: ["OK", "Submit", "Send expense claim", "Click here"],
        correct: 2,
        why: "It says exactly what will happen, which reassures people and makes sense to screen reader users who hear it on its own. “OK” and “Submit” are vague, and “Click here” says nothing about the action and doesn't work for people who don't use a mouse.",
      },
      {
        id: "v7-spot-hidden-link",
        type: "spot",
        question: "Which part will people struggle to recognize as clickable?",
        title: "Your order",
        parts: [
          { id: "status", label: "Text: Arriving Thursday", html: `<div class="mk-title">Arriving Thursday</div>` },
          { id: "items", label: "Text: 2 items, $84.00", html: `<div>2 items · $84.00</div>` },
          { id: "track", label: "Link: Track package, in the same plain black text as the paragraph, not underlined or colored", html: `<div>Track package</div>` },
          { id: "details", label: "Button: View order details", html: btn("View order details", "sec") },
        ],
        correct: "track",
        why: "“Track package” is a link, but it looks exactly like the plain text around it, so most people won't notice they can click it. Links need a visible cue, such as color plus an underline. The status, items and button are clear.",
      },
    ],
  },
  {
    id: "v8",
    code: "V8",
    title: "Visual consistency and design systems",
    subtitle: "Decide once, reuse everywhere",
    minutes: 5,
    skills: ["conventions", "layout"],
    body: [
      "When the same thing looks and behaves the same way everywhere, people learn your interface once. A design system makes that practical: a shared set of design tokens (named colors, type sizes and spacing values) and reusable components (buttons, form fields, alerts), with guidance on when to use each one.",
      "Design systems also save teams from solving the same problem twice, and they let an accessibility fix spread everywhere at once. Start small: collect the components you already have, merge near-duplicates, and name colors and spacing by their purpose, like “color-error” or “space-section”, rather than by their value.",
    ],
    practice: [
      "Name design tokens by purpose (“color-error”) rather than value (“red-600”).",
      "Before designing a new component, check whether an existing one can do the job.",
      "Merge near-duplicates, like three slightly different primary buttons.",
      "Document when to use each component, not just what it looks like.",
    ],
    fieldExercise:
      "Collect every button style in your product into one screenshot. Count the variations, and decide which ones you actually need.",
    sources: [
      nng("design-systems-101", "Design Systems 101"),
      uswds("design-tokens", "Design tokens"),
    ],
    exercises: [
      {
        id: "v8-token-names",
        type: "compare",
        question: "Which way of naming colors in a design system holds up better over time?",
        a: `<div class="mk"><div class="mk-label">Color tokens</div><div>blue-500</div><div>red-600</div><div>gray-300</div></div>`,
        b: `<div class="mk"><div class="mk-label">Color tokens</div><div>color-link</div><div>color-error</div><div>color-border</div></div>`,
        correct: "b",
        why: "Purpose-based names say how to use each color, and they still make sense after a rebrand or in dark mode, when the actual values change. In A, if links become purple, “blue-500” either lies or has to be renamed everywhere, and nobody can tell from the name when to use it.",
      },
      {
        id: "v8-reuse",
        type: "choice",
        question: "A team needs a dismissible message at the top of a page. The design system already has an Alert component. What should they do?",
        options: [
          "Use the Alert component, and propose a change to it if something is missing",
          "Design a new component that looks a little different",
          "Copy the Alert's code and adjust it locally",
          "Use a modal dialog instead",
        ],
        correct: 0,
        why: "Reusing the shared component keeps the product consistent and means fixes reach every page, and proposing a change helps everyone who uses it. A near-duplicate or a local copy splits the system and loses future fixes, and a modal is a heavier pattern that interrupts people.",
      },
      {
        id: "v8-spot-off-system",
        type: "spot",
        question: "Which button doesn't follow this product's design system?",
        title: "Report actions",
        parts: [
          { id: "save", label: "Button: Save, rounded, blue, standard height", html: btn("Save") },
          { id: "export", label: "Button: Export, rounded, blue, standard height", html: btn("Export") },
          { id: "share", label: "Button: Share, square corners, green, smaller and shorter than the others", html: `<span class="mk-btn" style="border-radius:0;background:var(--good);padding:2px 6px;font-size:10px">Share</span>` },
          { id: "delete", label: "Button: Delete, rounded, with a red outline, the system's style for destructive actions", html: `<span class="mk-btn sec" style="color:var(--bad);border-color:var(--bad)">Delete</span>` },
        ],
        correct: "share",
        why: "Share uses a one-off shape, color and size that exist nowhere else, so it looks like a different kind of control and adds a style the team now has to maintain. Delete looks different on purpose: it uses the system's destructive style. Save and Export follow the standard button.",
      },
    ],
  },
];

export const visualDesignPath: LearningPath = {
  id: "visual-design",
  title: "Visual design basics",
  description: "Hierarchy, typography, spacing, color, layout, icons, buttons and design systems.",
  status: "live",
  lessons,
};
