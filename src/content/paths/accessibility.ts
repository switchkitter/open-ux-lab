import type { Lesson, LearningPath } from "../types";

// Lessons summarize W3C WAI material in our own words and link to it (summarize-and-link only; no W3C text adapted).
const understanding = (slug: string, title: string) => ({
  title: `WCAG 2.2 Understanding: ${title}`,
  url: `https://www.w3.org/WAI/WCAG22/Understanding/${slug}.html`,
});

const lessons: Lesson[] = [
  {
    id: "a1",
    code: "A1",
    title: "Who accessibility is for",
    subtitle: "More people than you think, and the standard behind it",
    minutes: 5,
    skills: ["accessibility"],
    body: [
      "An accessible product works for people with disabilities: someone who is blind and uses a screen reader, someone who can't use a mouse, someone who zooms text to read it, relies on captions, or needs plain language to follow a task. About 1 in 6 people worldwide live with a significant disability, and most people gain one as they age.",
      "The same fixes help far more people: captions in a noisy office, strong contrast in bright sun, keyboard shortcuts for power users, a big tap target for a parent holding a phone in one hand. The international standard is WCAG, which groups its requirements under four principles: content must be perceivable, operable, understandable and robust. Many laws and public-sector rules, such as Section 508 in the US and EN 301 549 in Europe, are based on WCAG level AA.",
    ],
    practice: [
      "Treat accessibility as a design requirement from the first sketch, not a fix before launch.",
      "Aim for WCAG 2.2 level AA. Level A is the floor; AA is what most organizations and laws expect.",
      "Include disabled people in research. Checklists find many problems, but not whether a task actually works for someone.",
      "Learn the quick checks: keyboard only, zoom to 200%, and a contrast checker. They find a lot in a few minutes.",
    ],
    fieldExercise:
      "Put your mouse aside and try to finish one core task in your product with only the keyboard. Note every point where you got stuck or lost track of where you were.",
    sources: [
      { title: "W3C WAI: Introduction to Web Accessibility", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
      { title: "W3C WAI: Diverse Abilities and Barriers", url: "https://www.w3.org/WAI/people-use-web/abilities-barriers/" },
      { title: "W3C WAI: WCAG 2 Overview", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" },
    ],
    exercises: [
      {
        id: "a1-video-captions",
        type: "compare",
        question: "A company posts a safety training video for its warehouse staff. Which player serves them better?",
        a: `<div class="mk"><div class="mk-media">Video · 4:12</div><div class="mk-row"><span class="mk-btn sec">▶ Play</span><span class="mk-btn sec">CC Captions on</span><span class="mk-link">Read the transcript</span></div></div>`,
        b: `<div class="mk"><div class="mk-media">Video · 4:12 · plays automatically with sound</div><div class="mk-row"><span class="mk-btn sec">❚❚ Pause</span></div></div>`,
        describe: {
          a: "A 4 minute 12 second video with a Play button, a Captions on button, and a Read the transcript link.",
          b: "A 4 minute 12 second video that plays automatically with sound, with one Pause button.",
        },
        correct: "a",
        why: "A's captions serve Deaf and hard-of-hearing staff and anyone watching on a loud warehouse floor, and the transcript can be searched and read at your own pace. B has no captions, and starting with sound talks over screen readers and startles people in shared spaces.",
      },
      {
        id: "a1-who-benefits",
        type: "choice",
        question: "A stakeholder says, “Only a few of our users have disabilities, so accessibility can wait.” What's the strongest response?",
        options: [
          "Agree, and plan a separate accessible version of the site for later",
          "Say it's mainly a legal risk, since accessibility lawsuits are common",
          "Explain that disability is common and often invisible, and that the same fixes help people with temporary or situational limits too",
          "Suggest adding an accessibility toolbar widget that lets users change colors and text size",
        ],
        correct: 2,
        why: "Disability is more common than teams assume, many people never disclose it, and the fixes also help someone with a broken wrist, an old phone or glare on the screen. A separate accessible version tends to fall behind the main site, and overlay widgets don't fix the underlying code. Legal risk is real, but leading with it frames accessibility as compliance rather than as serving users.",
      },
      {
        id: "a1-spot-no-captions",
        type: "spot",
        question: "This onboarding video is for every new employee. Which part leaves some of them out?",
        title: "Your first week",
        parts: [
          {
            id: "video",
            label: "Video player: Welcome to the team, 6 minutes 40 seconds",
            html: `<div class="mk-media">Video · Welcome to the team · 6:40</div>`,
          },
          {
            id: "controls",
            label: "Video controls: Play, Volume and Full screen buttons only",
            html: `<div class="mk-row"><span class="mk-btn sec">▶ Play</span><span class="mk-btn sec">Volume</span><span class="mk-btn sec">Full screen</span></div>`,
          },
          {
            id: "questions",
            label: "Text: Questions? Ask your manager.",
            html: `<div class="mk-muted">Questions? Ask your manager.</div>`,
          },
        ],
        correct: "controls",
        why: "There's no captions button and no transcript, so Deaf and hard-of-hearing employees miss the content, as does anyone watching in a noisy office or without sound. Captions and a transcript fix that. The video itself and the note about questions are fine.",
      },
    ],
  },
  {
    id: "a2",
    code: "A2",
    title: "Text alternatives",
    subtitle: "Describe images by their purpose",
    minutes: 5,
    skills: ["accessibility", "language"],
    body: [
      "Screen readers can't see images. They read the image's alt text instead, and when there is none they often read the file name. Good alt text gives the same information or function the image gives a sighted person, in a short phrase.",
      "What to write depends on why the image is there. A photo that only adds mood gets empty alt text (alt=\"\") so screen readers skip it. An icon that works as a button needs a name for the action, not a description of the drawing. A chart needs its main point in the text alternative, with the full data available nearby.",
    ],
    practice: [
      "Ask yourself what you'd say about the image if you were reading the page aloud over the phone, and write that.",
      "Don't start with “Image of” or “Picture of”. Screen readers already announce that it's an image.",
      "Name the function of linked images and icon buttons: “Search”, not “Magnifying glass”.",
      "Give decorative images empty alt text, and don't put important text inside images.",
    ],
    fieldExercise:
      "Turn on your computer's screen reader (VoiceOver on Mac, Narrator on Windows) and move through one page of your product. Write down every image or icon announced as a file name, as “unlabeled”, or not at all when it carries meaning.",
    sources: [
      { title: "W3C WAI: Images Tutorial", url: "https://www.w3.org/WAI/tutorials/images/" },
      { title: "W3C WAI: An alt Decision Tree", url: "https://www.w3.org/WAI/tutorials/images/decision-tree/" },
    ],
    exercises: [
      {
        id: "a2-icon-button",
        type: "compare",
        question: "An icon-only button deletes an invoice. The box shows what a screen reader announces when the button gets focus. Which is better?",
        a: `<div class="mk"><div class="mk-row"><span>INV-2041 · Northwind Supply · $1,200</span><span class="mk-btn sec">🗑</span></div><div class="mk-say"><b>Screen reader</b>“trash-can-icon.svg, button”</div></div>`,
        b: `<div class="mk"><div class="mk-row"><span>INV-2041 · Northwind Supply · $1,200</span><span class="mk-btn sec">🗑</span></div><div class="mk-say"><b>Screen reader</b>“Delete invoice INV-2041, button”</div></div>`,
        describe: {
          a: "An invoice row, INV-2041, Northwind Supply, $1,200, with a trash can icon button. A screen reader announces: trash-can-icon.svg, button.",
          b: "An invoice row, INV-2041, Northwind Supply, $1,200, with a trash can icon button. A screen reader announces: Delete invoice INV-2041, button.",
        },
        correct: "b",
        why: "B names the action and the invoice, so someone moving through a table of identical icons knows exactly what each button does. A announces the file name, which describes neither the action nor which row it affects.",
      },
      {
        id: "a2-decorative",
        type: "choice",
        question: "A sign-in page has a large stock photo of colleagues smiling at a laptop. It sets a mood but carries no information. What alt text should it have?",
        options: [
          "“Image of three colleagues smiling at a laptop in a bright office”",
          "Empty alt text (alt=\"\"), so screen readers skip it",
          "No alt attribute at all",
          "“Sign in to your account”",
        ],
        correct: 1,
        why: "Empty alt text tells screen readers the image is decorative, so people reach the sign-in form sooner. A description makes everyone listen to something that adds nothing. Leaving out the attribute is worse: many screen readers then read the file name. Repeating the page title duplicates the heading.",
      },
      {
        id: "a2-spot-logo-filename",
        type: "spot",
        question: "A screen reader user is shopping. The boxes show what their screen reader announces. Which part fails them?",
        title: "Ceramic mug",
        parts: [
          {
            id: "logo",
            label: "Logo image. Screen reader says: logo_final_v2.png, link",
            html: `<div class="mk-say"><b>Screen reader</b>“logo_final_v2.png, link”</div>`,
          },
          {
            id: "photo",
            label: "Product photo. Screen reader says: Blue ceramic mug with a curved handle, 350 ml",
            html: `<div class="mk-say"><b>Screen reader</b>“Blue ceramic mug with a curved handle, 350 ml”</div>`,
          },
          {
            id: "price",
            label: "Price: $18",
            html: `<div class="mk-big">$18</div>`,
          },
          {
            id: "add",
            label: "Button: Add to cart",
            html: `<span class="mk-btn">Add to cart</span>`,
          },
        ],
        correct: "logo",
        why: "The logo is a link to the home page, so its text alternative should name the company or say “Home”, not read out a file name. The product photo's alt text is a good example: it describes what a sighted shopper would learn from the picture.",
      },
    ],
  },
  {
    id: "a3",
    code: "A3",
    title: "Color contrast",
    subtitle: "Text people can actually read",
    minutes: 5,
    skills: ["accessibility", "layout"],
    body: [
      "Low-contrast text is the most common accessibility problem found on websites, and it affects far more than people with low vision. Pale gray text on white is hard to read on a cheap monitor, outdoors, or late in the day with tired eyes.",
      "WCAG measures contrast as a ratio between text and its background, from 1:1 (no contrast) to 21:1 (black on white). Level AA asks for at least 4.5:1 for normal text and 3:1 for large text (about 24px, or about 19px bold). Icons, input borders and focus indicators that people need in order to use the interface need 3:1 against what's around them.",
    ],
    practice: [
      "Check every text and background pair with a contrast checker, including text on brand colors and on images.",
      "Watch light gray helper text, placeholder text and text over photos. They fail most often.",
      "Build passing pairs into your design tokens, so every team gets readable text by default.",
      "Check light and dark themes separately. A pair that passes in one often fails in the other.",
    ],
    fieldExercise:
      "Put the text colors from your product's main screen into a contrast checker, such as WebAIM's, and list every pair below 4.5:1.",
    sources: [
      understanding("contrast-minimum", "Contrast (Minimum)"),
      understanding("non-text-contrast", "Non-text Contrast"),
      { title: "WebAIM: Contrast Checker", url: "https://webaim.org/resources/contrastchecker/" },
    ],
    exercises: [
      {
        id: "a3-helper-text",
        type: "compare",
        question: "Which form hint will more people be able to read?",
        a: `<div class="mk"><div class="mk-label">Employee ID</div><div class="mk-in">&nbsp;</div><div class="mk-faint">Printed under the photo on your badge, for example E-10442</div></div>`,
        b: `<div class="mk"><div class="mk-label">Employee ID</div><div class="mk-in">&nbsp;</div><div class="mk-muted">Printed under the photo on your badge, for example E-10442</div></div>`,
        describe: {
          a: "An Employee ID field. The hint below it, “Printed under the photo on your badge, for example E-10442”, is very pale gray text on white.",
          b: "An Employee ID field. The hint below it, “Printed under the photo on your badge, for example E-10442”, is medium-dark gray text on white.",
        },
        correct: "b",
        why: "B's gray is dark enough to pass the 4.5:1 minimum. A's pale gray falls well below it, so people with low vision, screen glare or an older display may not be able to read the one line that tells them where to find their ID.",
      },
      {
        id: "a3-ratio",
        type: "choice",
        question: "Body text in your app is 16px regular weight. What's the minimum contrast ratio against its background for WCAG level AA?",
        options: ["3:1", "7:1", "4.5:1", "There is no minimum if the typeface is legible"],
        correct: 2,
        why: "Normal-size text needs 4.5:1 at level AA. 3:1 applies only to large text (about 24px, or 19px bold) and to interface parts such as icons and borders. 7:1 is the stricter AAA level. A legible typeface doesn't change the requirement.",
      },
      {
        id: "a3-spot-contrast-ratios",
        type: "spot",
        question: "Each part shows its measured contrast ratio. Which one fails WCAG level AA?",
        title: "Monthly report",
        parts: [
          {
            id: "heading",
            label: "Large bold heading: Monthly report. Contrast 12.6:1",
            html: `<div class="mk-row"><span class="mk-title">Monthly report</span><span class="mk-pill">12.6:1</span></div>`,
          },
          {
            id: "total",
            label: "Large bold number, about 32 pixels: $84,200. Contrast 3.6:1",
            html: `<div class="mk-row"><span class="mk-big">$84,200</span><span class="mk-pill">3.6:1 · large text</span></div>`,
          },
          {
            id: "body",
            label: "Body text, 16 pixels: Revenue grew 8% in September. Contrast 9.1:1",
            html: `<div class="mk-row"><span>Revenue grew 8% in September.</span><span class="mk-pill">9.1:1</span></div>`,
          },
          {
            id: "note",
            label: "Body text, 16 pixels: Figures exclude refunds. Contrast 3.2:1",
            html: `<div class="mk-row"><span>Figures exclude refunds.</span><span class="mk-pill">3.2:1 · 16px</span></div>`,
          },
        ],
        correct: "note",
        why: "Normal-size text needs at least 4.5:1, and this note has 3.2:1. The large $84,200 only needs 3:1 because it's large text, so its 3.6:1 passes. The heading and body text pass easily.",
      },
    ],
  },
  {
    id: "a4",
    code: "A4",
    title: "Don't rely on color alone",
    subtitle: "Always add a second cue",
    minutes: 4,
    skills: ["accessibility", "layout"],
    body: [
      "About 1 in 12 men and 1 in 200 women have some form of color vision deficiency, most often trouble telling red from green. Screen reader users get no color at all. If color is the only thing that separates two states, some people can't tell them apart.",
      "Color is still useful. The rule is to pair it with something else, such as text, an icon, a pattern, position or an underline. Then color speeds things up for people who can see it, and nobody depends on it.",
    ],
    practice: [
      "Give every status a word or icon as well as a color: “Failed”, not only a red dot.",
      "Underline links in body text, or set them apart in some way besides color.",
      "Show form errors with a message and an icon, not only a red border.",
      "Label chart lines directly or use different line styles instead of a color-only legend.",
    ],
    fieldExercise:
      "Take a screenshot of a dashboard or status page in your product and convert it to grayscale. Check that every status, chart series and error is still clear.",
    sources: [understanding("use-of-color", "Use of Color")],
    exercises: [
      {
        id: "a4-status-dots",
        type: "compare",
        question: "A dashboard shows the state of each server. Which version works for everyone?",
        a: `<div class="mk"><div class="mk-title">Servers</div><div class="mk-row"><span class="mk-dot good"></span><span>api-01</span><span class="mk-muted">Running</span></div><div class="mk-row"><span class="mk-dot bad"></span><span>api-02</span><span class="mk-muted">Down since 09:14</span></div><div class="mk-row"><span class="mk-dot warn"></span><span>db-01</span><span class="mk-muted">Slow responses</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Servers</div><div class="mk-row"><span class="mk-dot good"></span><span>api-01</span></div><div class="mk-row"><span class="mk-dot bad"></span><span>api-02</span></div><div class="mk-row"><span class="mk-dot warn"></span><span>db-01</span></div></div>`,
        describe: {
          a: "A Servers list. api-01: green dot, Running. api-02: red dot, Down since 09:14. db-01: amber dot, Slow responses.",
          b: "A Servers list. api-01: green dot. api-02: red dot. db-01: amber dot. There are no words next to the dots.",
        },
        correct: "a",
        why: "A pairs each color with words, so the state is clear to someone with red-green color blindness and to a screen reader user. In B, the red and green dots can look almost the same to many people, and a screen reader announces nothing about them.",
      },
      {
        id: "a4-required-fields",
        type: "choice",
        question: "A form shows required field labels in red, with a note at the top: “Fields in red are required.” What's the best fix?",
        options: [
          "Use a brighter red so the required labels stand out more",
          "Put the explanation of the red labels in a tooltip next to the form title",
          "Switch the required color to green, which is easier to tell apart from black",
          "Add “(required)” to those labels, or mark the optional ones with “(optional)” instead",
        ],
        correct: 3,
        why: "Words in the label work for everyone, including screen reader users, who hear them with the field name. A brighter red or a different color still relies on color alone, and a tooltip hides the explanation where few people will find it.",
      },
      {
        id: "a4-spot-red-border-only",
        type: "spot",
        question: "This form was submitted with problems. Which part relies on color alone?",
        title: "Create an account",
        parts: [
          {
            id: "name",
            label: "Field labeled Name, with a green border and the text Looks good",
            html: `<div class="mk-label">Name</div><div class="mk-in" style="border-color:var(--good)">Priya Shah</div><div class="mk-up">✓ Looks good</div>`,
          },
          {
            id: "email",
            label: "Field labeled Email, with a red border and no message",
            html: `<div class="mk-label">Email</div><div class="mk-in err">priya.shah@</div>`,
          },
          {
            id: "password",
            label: "Field labeled Password, with a red border and the message Use at least 12 characters",
            html: `<div class="mk-label">Password</div><div class="mk-err">⚠ Use at least 12 characters</div><div class="mk-in err">••••••</div>`,
          },
          {
            id: "submit",
            label: "Button: Create account",
            html: `<span class="mk-btn">Create account</span>`,
          },
        ],
        correct: "email",
        why: "The email field signals its error only with a red border, which many color-blind people can't see and screen readers don't announce. It needs a message in words, like the password field has: an icon and text that say what's wrong and how to fix it.",
      },
    ],
  },
  {
    id: "a5",
    code: "A5",
    title: "Keyboard access and visible focus",
    subtitle: "Everything works without a mouse",
    minutes: 5,
    skills: ["accessibility", "control"],
    body: [
      "Many people don't use a mouse: people with tremors or limited hand movement, blind people using screen readers, people using switch devices or voice control, and power users who prefer shortcuts. They all rely on the keyboard or on tools that act like one. Every link, button, field and menu must be reachable and usable with Tab, Shift+Tab, Enter, Space and the arrow keys.",
      "Keyboard users also need to see where they are. The focus indicator, usually an outline, does the job of their mouse pointer. Removing it with CSS (outline: none) and not replacing it leaves people guessing which control will respond when they press Enter.",
    ],
    practice: [
      "Use real button and link elements. A clickable div can't be reached with Tab or triggered with Enter unless you rebuild all of that by hand.",
      "Keep the focus order the same as the visual reading order.",
      "Design the focus style on purpose: a thick outline with strong contrast, checked in every theme.",
      "Make sure people can leave every dialog, menu and widget with the keyboard. Esc should close overlays.",
    ],
    fieldExercise:
      "Tab through your product's sign-up or checkout flow. Count every time you lose sight of the focus or can't reach or operate a control.",
    sources: [
      understanding("keyboard", "Keyboard"),
      understanding("focus-visible", "Focus Visible"),
      { title: "W3C WAI: Keyboard Compatibility (video)", url: "https://www.w3.org/WAI/perspective-videos/keyboard/" },
    ],
    exercises: [
      {
        id: "a5-focus-visible",
        type: "compare",
        question: "Someone is tabbing through a report page, and keyboard focus is on the Export button. Which design lets them see that?",
        a: `<div class="mk"><div class="mk-title">Q3 headcount report</div><div class="mk-row"><span class="mk-btn sec">Filter</span><span class="mk-btn sec">Export</span><span class="mk-btn sec">Share</span></div><div class="mk-muted">Keyboard focus: Export</div></div>`,
        b: `<div class="mk"><div class="mk-title">Q3 headcount report</div><div class="mk-row"><span class="mk-btn sec">Filter</span><span class="mk-btn sec mk-focus">Export</span><span class="mk-btn sec">Share</span></div><div class="mk-muted">Keyboard focus: Export</div></div>`,
        describe: {
          a: "A report page with Filter, Export and Share buttons. Keyboard focus is on Export, but all three buttons look exactly the same.",
          b: "A report page with Filter, Export and Share buttons. Keyboard focus is on Export, which has a thick colored outline around it.",
        },
        correct: "b",
        why: "B draws a clear outline around the focused button, so the person knows what Enter will do. A looks the same wherever focus is, which usually means someone removed the browser's default outline and put nothing in its place.",
      },
      {
        id: "a5-div-button",
        type: "choice",
        question: "A developer built a custom “Approve” control from a styled div with a click handler. Mouse users like it. What's the most likely problem?",
        options: [
          "Keyboard and screen reader users can't reach or use it: a div isn't focusable and isn't announced as a button",
          "It looks different from the other buttons in the app",
          "It loads more slowly than a native button",
          "Nothing, as long as it has a clear hover state",
        ],
        correct: 0,
        why: "A native button comes with keyboard focus, Enter and Space activation, and the button role for free. A div has none of these, so each must be added by hand, and teams often miss one. Switching to a button element is the simpler fix. A hover state only helps mouse users.",
      },
      {
        id: "a5-spot-keyboard-trap",
        type: "spot",
        question: "These are the results of testing a form with only the keyboard. Which part fails keyboard users?",
        title: "New task",
        parts: [
          {
            id: "title",
            label: "Text field: Title. Keyboard test: reached with Tab, typing works",
            html: `<div class="mk-label">Title</div><div class="mk-in">&nbsp;</div><div class="mk-muted">Tab ✓ · typing ✓</div>`,
          },
          {
            id: "priority",
            label: "Custom dropdown: Priority. Keyboard test: skipped by Tab, Enter does nothing",
            html: `<div class="mk-label">Priority</div><div class="mk-in">Normal ▾</div><div class="mk-muted">Tab ✗ skipped · Enter ✗</div>`,
          },
          {
            id: "details",
            label: "Link: View details. Keyboard test: reached with Tab, Enter opens it",
            html: `<span class="mk-link">View details</span><div class="mk-muted">Tab ✓ · Enter ✓</div>`,
          },
          {
            id: "save",
            label: "Button: Save. Keyboard test: reached with Tab, Enter and Space work",
            html: `<span class="mk-btn">Save</span><div class="mk-muted">Tab ✓ · Enter ✓ · Space ✓</div>`,
          },
        ],
        correct: "priority",
        why: "Keyboard users can't reach the Priority dropdown or open it, so they can't set a priority at all. Custom controls need focus and key handling, or better, a native select element that comes with both. The other controls pass the test.",
      },
    ],
  },
  {
    id: "a6",
    code: "A6",
    title: "Headings and page structure",
    subtitle: "Let people skim with a screen reader",
    minutes: 5,
    skills: ["accessibility", "layout"],
    body: [
      "Sighted people skim a page by its layout: big bold headings, a sidebar, a footer. Screen reader users skim too, by jumping from heading to heading or from region to region. That only works when the structure is in the code: real heading elements in a sensible order, and landmark regions such as header, nav, main and footer.",
      "Text that only looks like a heading, such as a bold paragraph styled large, is invisible to that kind of navigation. Headings that skip levels or are picked for their size make the outline confusing, like a table of contents with random numbering.",
    ],
    practice: [
      "Give each page one h1 that says what the page is, then use h2 for main sections and h3 inside them.",
      "Choose heading levels for structure, and set their size with CSS.",
      "Wrap the main regions of the page in header, nav, main and footer elements.",
      "On pages with long navigation, make a “Skip to main content” link the first thing keyboard users reach.",
    ],
    fieldExercise:
      "Use a heading outline browser extension (HeadingsMap is one) on a page of your product. Check that the outline reads like a sensible table of contents, with no skipped levels or missing sections.",
    sources: [
      { title: "W3C WAI: Page Structure Tutorial", url: "https://www.w3.org/WAI/tutorials/page-structure/" },
      understanding("info-and-relationships", "Info and Relationships"),
    ],
    exercises: [
      {
        id: "a6-heading-outline",
        type: "compare",
        question: "Two builds of the same settings page look identical. The box shows what a screen reader user gets when they ask for a list of headings. Which is better?",
        a: `<div class="mk"><div class="mk-big">Account settings</div><div class="mk-title">Profile</div><div class="mk-title">Notifications</div><div class="mk-title">Billing</div><div class="mk-say"><b>Headings list</b>No headings found on this page</div></div>`,
        b: `<div class="mk"><div class="mk-big">Account settings</div><div class="mk-title">Profile</div><div class="mk-title">Notifications</div><div class="mk-title">Billing</div><div class="mk-say"><b>Headings list</b>H1 Account settings<br>H2 Profile<br>H2 Notifications<br>H2 Billing</div></div>`,
        describe: {
          a: "A settings page with big bold text, Account settings, then Profile, Notifications and Billing. A screen reader's headings list says: No headings found on this page.",
          b: "A settings page with big bold text, Account settings, then Profile, Notifications and Billing. A screen reader's headings list shows: level 1, Account settings; level 2, Profile, Notifications and Billing.",
        },
        correct: "b",
        why: "Only B uses real heading elements, so a screen reader user can open the list and jump straight to Billing. In A the big bold text is just styled paragraphs, so they have to listen through the page from the top to find what they need.",
      },
      {
        id: "a6-heading-level",
        type: "choice",
        question: "A designer wants a small sidebar heading and asks for an h5, because h5 is the right size. The page has one h1 and no other headings yet. What's the better approach?",
        options: [
          "Use h5, since it's the closest visual match",
          "Use a bold paragraph instead, so it doesn't affect the outline",
          "Pick the level that fits the page structure (here, h2) and make it smaller with CSS",
          "Use a second h1 so screen reader users find it first",
        ],
        correct: 2,
        why: "Heading levels describe the outline, and CSS controls their size. An h5 straight after the h1 tells screen reader users that sections are missing. A bold paragraph removes the heading from navigation entirely, and a second h1 blurs what the page is about.",
      },
      {
        id: "a6-spot-skipped-level",
        type: "spot",
        question: "This is the heading outline of a billing page. Which heading breaks the structure?",
        title: "Billing",
        parts: [
          {
            id: "h1",
            label: "Heading level 1: Billing",
            html: `<div class="mk-row"><span class="mk-pill">H1</span><span class="mk-title">Billing</span></div>`,
          },
          {
            id: "h2a",
            label: "Heading level 2: Payment method",
            html: `<div class="mk-row"><span class="mk-pill">H2</span><span>Payment method</span></div>`,
          },
          {
            id: "h4",
            label: "Heading level 4: Card details",
            html: `<div class="mk-row" style="padding-left:24px"><span class="mk-pill">H4</span><span>Card details</span></div>`,
          },
          {
            id: "h2b",
            label: "Heading level 2: Invoices",
            html: `<div class="mk-row"><span class="mk-pill">H2</span><span>Invoices</span></div>`,
          },
        ],
        correct: "h4",
        why: "Card details jumps from level 2 straight to level 4, so screen reader users hear that a level is missing and wonder what they skipped. It should be an h3 under Payment method, styled smaller with CSS if needed. The rest of the outline is in order.",
      },
    ],
  },
  {
    id: "a7",
    code: "A7",
    title: "Accessible forms",
    subtitle: "Labels, hints and errors everyone gets",
    minutes: 5,
    skills: ["accessibility", "forms"],
    body: [
      "Every field needs a visible label that stays in place, connected to the field in code so screen readers announce it when the field gets focus. Placeholder text is not a label: it disappears as soon as someone types, it's usually too pale to read, and not every screen reader announces it.",
      "When something goes wrong, say what the problem is and how to fix it, in text next to the field. Then make sure screen reader users find out, by moving focus to an error summary or announcing the error. A red border on its own, or a single message at the top of a long page, is easy to miss.",
    ],
    practice: [
      "Put the label above the field and connect the two in code, with matching for and id attributes or by wrapping the field in its label.",
      "Show format hints, like “MM/YY”, as visible text linked to the field rather than as placeholder text.",
      "Write errors that name the field and the fix: “Enter an expiry date in the future”, not “Invalid input”.",
      "Group related radio buttons and checkboxes with a fieldset and legend, so the question is read with each option.",
    ],
    fieldExercise:
      "Click each label in one of your product's forms. If clicking a label doesn't put the cursor in its field, the label probably isn't connected in code.",
    sources: [
      { title: "W3C WAI: Forms Tutorial", url: "https://www.w3.org/WAI/tutorials/forms/" },
      understanding("error-identification", "Error Identification"),
    ],
    exercises: [
      {
        id: "a7-placeholder-label",
        type: "compare",
        question: "Someone has started typing a card number. Which design still tells them what each field is for?",
        a: `<div class="mk"><div class="mk-label">Card number</div><div class="mk-in">4111 1111</div><div class="mk-label">Expiry date</div><div class="mk-muted">For example, 04/29</div><div class="mk-in">&nbsp;</div></div>`,
        b: `<div class="mk"><div class="mk-in">4111 1111</div><div class="mk-in"><span class="mk-faint">Expiry date (MM/YY)</span></div></div>`,
        describe: {
          a: "A field labeled Card number containing 4111 1111. Then an empty field labeled Expiry date, with the hint “For example, 04/29” above it.",
          b: "Two fields with no labels above them. The first contains 4111 1111. The second is empty except for pale placeholder text inside it: Expiry date (MM/YY).",
        },
        correct: "a",
        why: "A's labels and hint stay visible while people type and when they come back to check their answers. In B the first placeholder vanished once typing began, so people must delete their input to see what was asked, and the pale placeholder in the second field is hard to read.",
      },
      {
        id: "a7-error-message",
        type: "choice",
        question: "A date of birth field fails validation because the date is in the future. Which error is best?",
        options: [
          "“Error”",
          "“Invalid input in field 3”",
          "A red border around the field, with no message",
          "“Date of birth must be a date in the past, like 14 03 1990”",
        ],
        correct: 3,
        why: "It names the field, says what's wrong and shows how to fix it, in text a screen reader can announce. “Error” and “field 3” leave people hunting for the problem, and a red border alone is invisible to screen reader users and hard to see for people with color blindness.",
      },
      {
        id: "a7-spot-placeholder",
        type: "spot",
        question: "Which field will people struggle with once they start typing?",
        title: "Create your account",
        parts: [
          {
            id: "name",
            label: "Field labeled Full name, with Ana Silva typed in",
            html: `<div class="mk-label">Full name</div><div class="mk-in">Ana Silva</div>`,
          },
          {
            id: "email",
            label: "Field with no label above it. Gray text inside reads Email address",
            html: `<div class="mk-in"><span class="mk-muted">Email address</span></div>`,
          },
          {
            id: "password",
            label: "Field labeled Password, with the hint At least 12 characters",
            html: `<div class="mk-label">Password</div><div class="mk-muted">At least 12 characters</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "submit",
            label: "Button: Create account",
            html: `<span class="mk-btn">Create account</span>`,
          },
        ],
        correct: "email",
        why: "The email field has no label, only placeholder text inside it. As soon as someone types, the only clue to what the field is for disappears, and some screen readers don't announce placeholders at all. The other fields keep a visible label above the input.",
      },
    ],
  },
  {
    id: "a8",
    code: "A8",
    title: "Links, buttons and targets",
    subtitle: "Clear names and room to tap",
    minutes: 5,
    skills: ["accessibility", "language"],
    body: [
      "Screen reader users often bring up a list of every link or button on a page. In that list, ten links called “Read more” are useless. Each link and button should make sense on its own, or at least together with its sentence or table row.",
      "Controls also need to be big enough to hit. People with tremors, people on a bumpy train and anyone using a phone with one thumb all miss small targets. WCAG 2.2 level AA asks for targets of at least 24 by 24 CSS pixels, or enough space around smaller ones. Apple and Google recommend about 44 to 48 for touch.",
    ],
    practice: [
      "Write link text that says where it goes: “Download the 2026 benefits guide (PDF, 2 MB)”, not “Click here”.",
      "Use links to go somewhere and buttons to do something. Screen readers announce them differently, and people expect different behavior.",
      "Make sure a control's visible text is part of its accessible name, so voice control users can say what they see.",
      "Give small icons a larger tap area with padding, and keep destructive actions away from frequent ones.",
    ],
    fieldExercise:
      "On your phone, try to complete a task in your product using only the thumb of your non-dominant hand. Note every target you miss or hit by accident.",
    sources: [
      understanding("link-purpose-in-context", "Link Purpose (In Context)"),
      understanding("target-size-minimum", "Target Size (Minimum)"),
      understanding("label-in-name", "Label in Name"),
    ],
    exercises: [
      {
        id: "a8-link-text",
        type: "compare",
        question: "An intranet home page lists news stories. The box shows a screen reader's list of links. Which works better?",
        a: `<div class="mk"><div class="mk-title">News</div><div class="mk-link">Office closed on Monday, October 12</div><div class="mk-link">New travel expense policy</div><div class="mk-link">Parking garage repairs schedule</div><div class="mk-say"><b>Links list</b>Office closed on Monday, October 12<br>New travel expense policy<br>Parking garage repairs schedule</div></div>`,
        b: `<div class="mk"><div class="mk-title">News</div><div>Office closed on Monday, October 12 <span class="mk-link">Read more</span></div><div>New travel expense policy <span class="mk-link">Read more</span></div><div>Parking garage repairs schedule <span class="mk-link">Read more</span></div><div class="mk-say"><b>Links list</b>Read more<br>Read more<br>Read more</div></div>`,
        describe: {
          a: "A news list where each headline is itself a link. A screen reader's links list reads: Office closed on Monday, October 12; New travel expense policy; Parking garage repairs schedule.",
          b: "A news list of three headlines, each followed by a Read more link. A screen reader's links list reads: Read more, Read more, Read more.",
        },
        correct: "a",
        why: "A's links name their destinations, so someone scanning the links list can pick the story they want. In B every link is announced as “Read more”, so people have to leave the list and read around each link to learn where it goes.",
      },
      {
        id: "a8-target-size",
        type: "choice",
        question: "A data table puts Edit and Delete icons 2px apart, each 14px square. People on tablets keep deleting the wrong row. What's the best fix?",
        options: [
          "Add a confirmation dialog to Delete",
          "Make each target at least 24 by 24px with space between them, and consider moving Delete into a row menu",
          "Make the Delete icon red",
          "Add tooltips to both icons",
        ],
        correct: 1,
        why: "Bigger, well-spaced targets prevent the mis-taps, and moving a destructive action away from a frequent one adds a safety margin. A confirmation only catches the mistake after it happens and slows down every intended delete. Color and tooltips don't make the targets any easier to hit.",
      },
      {
        id: "a8-spot-click-here",
        type: "spot",
        question: "A screen reader user pulls up a list of every link on this HR page. Which part gives them a useless link?",
        title: "Benefits",
        parts: [
          {
            id: "intro",
            label: "Paragraph: Open enrollment runs from 1 to 15 November.",
            html: `<div>Open enrollment runs from 1 to 15 November.</div>`,
          },
          {
            id: "guide",
            label: "Link: Download the 2026 benefits guide (PDF, 2 MB)",
            html: `<span class="mk-link">Download the 2026 benefits guide (PDF, 2 MB)</span>`,
          },
          {
            id: "address",
            label: "Sentence with a link: To update your home address, click here.",
            html: `<div>To update your home address, <span class="mk-link">click here</span>.</div>`,
          },
          {
            id: "contact",
            label: "Link: Contact the HR team",
            html: `<span class="mk-link">Contact the HR team</span>`,
          },
        ],
        correct: "address",
        why: "In a list of links, “click here” says nothing about where it goes, so screen reader users have to leave the list and read around it to find out. Link the words that describe the destination instead: “Update your home address”. The other links make sense on their own.",
      },
    ],
  },
];

export const accessibilityPath: LearningPath = {
  id: "accessibility",
  title: "Accessibility basics",
  description: "Who accessibility serves, contrast, keyboard access, structure and forms. Built from W3C WAI material.",
  status: "live",
  lessons,
};
