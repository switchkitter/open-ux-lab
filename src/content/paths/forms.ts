import type { License, Lesson, LearningPath, Source } from "../types";

// Lesson text is original. Sources are openly licensed (checked 2026-10-01): GOV.UK Design System and
// Service Manual content under the Open Government Licence v3.0; USWDS in the US public domain and CC0 1.0.
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
const manual = (path: string, title: string): Source => ({
  title: `GOV.UK Service Manual: ${title}`,
  url: `https://www.gov.uk/service-manual/design/${path}`,
  license: OGL,
});
const uswds = (path: string, title: string): Source => ({
  title: `USWDS: ${title}`,
  url: `https://designsystem.digital.gov/${path}/`,
  license: CC0,
});

const lessons: Lesson[] = [
  {
    id: "f1",
    code: "F1",
    title: "Ask only what you need",
    subtitle: "The easiest question is the one you remove",
    minutes: 4,
    skills: ["forms", "language"],
    body: [
      "Every question in a form costs the person filling it in: time, effort, and sometimes worry about why you want to know. Long forms get abandoned, and each extra field is another chance for a mistake. The surest way to make a question easy is to take it out.",
      "Before adding a question, find out who needs the answer, what they will do with it, and what happens if it's missing. GOV.UK calls this a question protocol. Questions with no clear owner or use come out. Questions that only apply to some people go behind an earlier question, so everyone else skips them.",
    ],
    practice: [
      "List every question next to who uses the answer and why. If nobody can say, remove it.",
      "Don't ask for things you already have, such as details from the person's account or an earlier step.",
      "Use earlier answers to skip questions that don't apply, such as partner details for someone who lives alone.",
      "Explain sensitive questions briefly: why you're asking and who will see the answer.",
    ],
    fieldExercise:
      "Pick one form in your product. Next to each field, write who reads the answer and what they do with it. Count the fields where nobody knows.",
    sources: [manual("form-structure", "Design your forms for the format they'll appear in"), govuk("patterns/question-pages", "Question pages")],
    exercises: [
      {
        id: "f1-signup-fields",
        type: "compare",
        question: "A newsletter sign-up for a project management tool. Which form will get more sign-ups without losing anything the team actually uses?",
        a: `<div class="mk"><div class="mk-title">Get product tips every month</div><div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div><div class="mk-row"><span class="mk-btn">Subscribe</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Get product tips every month</div><div class="mk-label">First name</div><div class="mk-in">&nbsp;</div><div class="mk-label">Last name</div><div class="mk-in">&nbsp;</div><div class="mk-label">Company</div><div class="mk-in">&nbsp;</div><div class="mk-label">Job title</div><div class="mk-in">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in">&nbsp;</div><div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div><div class="mk-row"><span class="mk-btn">Subscribe</span></div></div>`,
        correct: "a",
        why: "A newsletter only needs an email address to work. Each extra field in B is effort with no benefit to the subscriber, and asking for a phone number makes people expect a sales call. If the team truly needs job titles, it can ask later, once people value the emails.",
      },
      {
        id: "f1-question-protocol",
        type: "choice",
        question: "A stakeholder wants to add “Annual household income” to a library card application. What should you do first?",
        options: [
          "Add it as an optional field so nobody is forced to answer",
          "Ask who will use the answer, for what, and whether the service works without it",
          "Add it with a dropdown of income bands to make it quicker",
          "Put it at the end of the form so it doesn't put people off",
        ],
        correct: 1,
        why: "If nobody can name a real use, the question shouldn't be there at all. Making it optional, quicker or later still asks for sensitive information with no purpose, and it adds length and doubt to every application.",
      },
    ],
  },
  {
    id: "f2",
    code: "F2",
    title: "One thing per page",
    subtitle: "Small steps, then a chance to check",
    minutes: 5,
    skills: ["forms", "effort"],
    body: [
      "A long single-page form looks efficient to the team but is hard to fill in: it's easy to lose your place, errors pile up, and on a phone the page never seems to end. Splitting a form so each page holds one thing (one question, one decision or one piece of information) keeps every step simple and lets you skip pages based on earlier answers.",
      "GOV.UK suggests starting with one thing per page and merging pages only when research shows it helps. Questions people answer as a unit, such as the lines of an address, can share a page. At the end, show a page where people can check all their answers and change any of them before they submit.",
    ],
    practice: [
      "Start with one question per page. Combine only fields that belong together, such as an address.",
      "Use the question as the page heading, so screen reader users hear it first.",
      "Before the final submit, list every answer with a Change link next to it.",
      "Save progress between pages, so people don't lose their work if they leave.",
    ],
    fieldExercise:
      "Fill in your product's longest form on a phone. Count how many times you scroll back up to check what a question asked.",
    sources: [
      manual("form-structure", "Design your forms for the format they'll appear in"),
      govuk("patterns/check-answers", "Check answers"),
      uswds("patterns/complete-a-complex-form", "Complete a complex form"),
    ],
    exercises: [
      {
        id: "f2-check-answers",
        type: "compare",
        question: "The last step of a visa application. Which ending helps people catch their mistakes?",
        a: `<div class="mk"><div class="mk-title">Submit your application</div><div class="mk-muted">By submitting, you confirm that all the details you gave are correct.</div><div class="mk-row"><span class="mk-btn">Submit</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Check your answers</div><div class="mk-row"><span class="mk-label">Name</span><span>Sofia Marín</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-label">Date of birth</span><span>14 March 1990</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-label">Passport number</span><span>502384917</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-btn">Accept and send</span></div></div>`,
        correct: "b",
        why: "B shows every answer with a way to fix it, so people can spot a mistyped passport number before it costs them weeks. A asks people to confirm details they can't see, which only shifts the blame onto them.",
      },
      {
        id: "f2-one-thing",
        type: "choice",
        question: "A benefits claim form has 40 questions on one page, and many apply only to some people. What's the best restructure?",
        options: [
          "Keep one page but add a progress bar at the top",
          "Split it into pages with one question or topic each, and use earlier answers to skip pages that don't apply",
          "Split it into two pages of 20 questions each",
          "Put each section in a collapsible accordion",
        ],
        correct: 1,
        why: "One thing per page keeps each step simple, and skipping means people only see questions that apply to them. A progress bar doesn't make 40 questions shorter, two pages of 20 keep all the same problems, and accordions hide questions people still have to find and answer.",
      },
    ],
  },
  {
    id: "f3",
    code: "F3",
    title: "Labels, hints and field sizes",
    subtitle: "Tell people what to enter and how",
    minutes: 4,
    skills: ["forms", "language", "errors"],
    body: [
      "A label tells people what to enter; a hint tells them how. Put the label above the field and keep it short and specific. Use a hint for the format or for where to find the information. Hints hidden inside the field or behind a tooltip get missed, or vanish just when they're needed.",
      "The width of a field is a hint too. A postcode field that stretches across the screen suggests a long answer, and a narrow phone number field suggests the number won't fit. Size fields to the answer you expect, and accept answers the way people naturally type them, spaces and dashes included.",
    ],
    practice: [
      "Write labels as the plain name of the thing (“Email address”) or as a question (“What is your email address?”), and stay consistent.",
      "Put hints between the label and the field, so people read them before typing.",
      "Size fields to their content: short for postcodes and security codes, longer for street addresses.",
      "Ignore spaces and dashes in phone, card and account numbers instead of rejecting them.",
    ],
    fieldExercise:
      "Look at every field in one of your product's forms and compare its width with a typical answer. Note any field that's far too wide or too narrow.",
    sources: [govuk("components/text-input", "Text input"), uswds("components/form", "Form")],
    exercises: [
      {
        id: "f3-field-width",
        type: "compare",
        question: "Which form gives people better clues about what to type?",
        a: `<div class="mk"><div class="mk-label">Postcode</div><div class="mk-in" style="width:7em">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in" style="width:12em">&nbsp;</div><div class="mk-label">Security code</div><div class="mk-muted">The last 3 digits on the back of your card</div><div class="mk-in" style="width:4em">&nbsp;</div></div>`,
        b: `<div class="mk"><div class="mk-label">Postcode</div><div class="mk-in">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in">&nbsp;</div><div class="mk-label">Security code</div><div class="mk-muted">The last 3 digits on the back of your card</div><div class="mk-in">&nbsp;</div></div>`,
        correct: "a",
        why: "A sizes each field to its answer, so the field itself hints at what belongs there. In B every field is the same full width, so a three-digit code gets as much room as a street address and the layout gives no clue about length.",
      },
      {
        id: "f3-hint-placement",
        type: "choice",
        question: "Where should a format hint like “For example, 27 3 2007” go?",
        options: [
          "Inside the field, as placeholder text",
          "Between the label and the field, as visible text linked to the field",
          "In a tooltip behind an ⓘ icon next to the label",
          "In the error message shown when the format is wrong",
        ],
        correct: 1,
        why: "People read it before they type, it stays visible while they type, and linking it to the field means screen readers announce it too. Placeholder text disappears when typing starts, tooltips are often missed and awkward on touch screens, and an error message only helps after people have already got it wrong.",
      },
    ],
  },
  {
    id: "f4",
    code: "F4",
    title: "Names and personal details",
    subtitle: "Fit the person, not the database",
    minutes: 5,
    skills: ["forms", "language"],
    body: [
      "Names vary far more than most forms assume. Plenty of people don't have a “first” and “last” name in that order, some have a single name, and many names are longer than expected or include hyphens, apostrophes or accented letters. A form that rejects someone's name tells them the service isn't for them.",
      "Decide what you need the name for. One “Full name” field fits the widest range of names, but you can't reliably split it later. Separate fields help when you must sort or match records, but more names won't fit them. Either way, make fields long enough, accept any character, and say whether you need the name as written on an official document.",
    ],
    practice: [
      "Label a single field “Full name”. For separate fields with international users, use “Given names” and “Family name” rather than “First” and “Last”.",
      "Accept spaces, hyphens, apostrophes and accented letters, and don't set a short maximum length.",
      "Only ask for a title such as Mr, Ms or Dr if you really need it.",
      "Set autocomplete attributes (name, given-name, family-name, email, tel) so browsers can fill fields in.",
    ],
    fieldExercise:
      "Sign up for your own product as “Siân O'Connor-Ngata”, then as someone with only one name. Note every field that rejects or changes either name.",
    sources: [govuk("patterns/names", "Names"), uswds("patterns/create-a-user-profile/name", "Name")],
    exercises: [
      {
        id: "f4-name-error",
        type: "compare",
        question: "Siobhán D'Arcy is creating an account. Which form treats her better?",
        a: `<div class="mk"><div class="mk-label">Full name</div><div class="mk-muted">As it's written on your passport</div><div class="mk-in">Siobhán D'Arcy</div><div class="mk-row"><span class="mk-btn">Continue</span></div></div>`,
        b: `<div class="mk"><div class="mk-label">First name</div><div class="mk-err">First name must only contain letters A to Z</div><div class="mk-in err">Siobhán</div><div class="mk-label">Last name</div><div class="mk-in">D'Arcy</div><div class="mk-row"><span class="mk-btn">Continue</span></div></div>`,
        correct: "a",
        why: "A accepts her name as she writes it and says which version of her name is needed. B calls her own name invalid because of one accented letter, which is wrong and alienating, and pushes people to misspell their names, causing mismatches with other records later.",
      },
      {
        id: "f4-autocomplete",
        type: "choice",
        question: "Your checkout asks for name, email and phone number. What helps people on phones most, for the least effort from your team?",
        options: [
          "Add autocomplete attributes (name, email, tel) and the right input types, so browsers can fill the fields and show the right keyboard",
          "Split the phone number into three fields: area code, prefix and line",
          "Pre-fill the fields with example values people can type over",
          "Add a Clear all button at the bottom of the form",
        ],
        correct: 0,
        why: "Autocomplete lets the browser fill in details people have entered before, and input types bring up the right keyboard, such as a number pad for the phone. Splitting a phone number breaks pasting and international numbers, example values have to be deleted before typing, and a Clear all button only adds a way to lose work.",
      },
    ],
  },
  {
    id: "f5",
    code: "F5",
    title: "Dates",
    subtitle: "Ask for them the way people know them",
    minutes: 4,
    skills: ["forms", "errors"],
    body: [
      "For a date people remember or can look up, such as a date of birth or a passport issue date, three small text fields for day, month and year work best: people type a few digits and they're done. Scrolling a calendar back 40 years to find a birthday is slow and fiddly.",
      "Calendar pickers earn their place when people are choosing a date close to today and the day of the week matters, such as booking an appointment. Even then, let people type the date as well, so nobody is stuck if the calendar doesn't work for them.",
    ],
    practice: [
      "For memorable dates, use labeled Day, Month and Year fields grouped in a fieldset, with the question as its legend.",
      "Show an example in the hint, like “For example, 27 3 2007”.",
      "Be forgiving: accept “3” and “03”, and don't make people type leading zeros.",
      "Use a calendar only for near-future or recent dates where seeing the week helps, and pair it with a text input.",
    ],
    fieldExercise:
      "Enter your own date of birth in your product's forms. Count the clicks and keystrokes it takes.",
    sources: [
      govuk("patterns/dates", "Dates"),
      govuk("components/date-input", "Date input"),
      uswds("components/memorable-date", "Memorable date"),
    ],
    exercises: [
      {
        id: "f5-dob",
        type: "compare",
        question: "Which is better for entering a date of birth?",
        a: `<div class="mk"><div class="mk-label">Date of birth</div><div class="mk-in">Select a date ▾</div><div class="mk-muted">Opens a calendar showing the current month, October 2026</div></div>`,
        b: `<div class="mk"><div class="mk-title">What is your date of birth?</div><div class="mk-muted">For example, 27 3 1987</div><div class="mk-row"><span><span class="mk-label">Day</span><span class="mk-in" style="display:block;width:3em">14</span></span><span><span class="mk-label">Month</span><span class="mk-in" style="display:block;width:3em">3</span></span><span><span class="mk-label">Year</span><span class="mk-in" style="display:block;width:4.5em">1990</span></span></div></div>`,
        correct: "b",
        why: "B lets people type a date they already know in a few keystrokes. A opens on the current month, so someone born in 1990 has to step back through hundreds of months or hunt for a hidden year menu.",
      },
      {
        id: "f5-picker-when",
        type: "choice",
        question: "When does a calendar date picker make the most sense?",
        options: [
          "Date of birth on an insurance quote",
          "Choosing a delivery day in the next two weeks, where the day of the week matters",
          "The issue date printed on a passport",
          "Every date field in the product, for consistency",
        ],
        correct: 1,
        why: "Calendars help when people choose a date near today and want to see the weekdays, like a delivery slot. Birth dates and document dates are already known, so typing them is quicker. A picker on every field for consistency makes the common case slower.",
      },
    ],
  },
  {
    id: "f6",
    code: "F6",
    title: "Radios, checkboxes and selects",
    subtitle: "Pick the control that shows the choice",
    minutes: 4,
    skills: ["forms", "conventions"],
    body: [
      "Radio buttons show every option at once and allow one answer. Checkboxes show every option and allow several. A select (dropdown) hides the options until it's opened, which saves space but makes people open it, scroll and read before they can choose.",
      "GOV.UK found that some people find selects very hard to use, and recommends them only as a last resort. For a handful of options, radios are faster and clearer. For very long lists, such as countries, a text field that suggests matches as people type usually beats a long dropdown.",
    ],
    practice: [
      "Use radios for one answer from a short list, and checkboxes when more than one answer can apply.",
      "Add the hint “Select all that apply” above checkboxes, so people know they can pick several.",
      "Offer a “None of these” option when none applying is a real answer, so people can say so.",
      "Avoid dropdowns for short lists. For long lists, let people type and choose from suggestions.",
    ],
    fieldExercise:
      "Find every dropdown in one of your product's forms. For each one, count the options and decide whether radios or a typed field would be faster.",
    sources: [
      govuk("components/radios", "Radios"),
      govuk("components/checkboxes", "Checkboxes"),
      govuk("components/select", "Select"),
    ],
    exercises: [
      {
        id: "f6-radios-vs-select",
        type: "compare",
        question: "A support request form asks how urgent the problem is. There are three answers. Which control is better?",
        a: `<div class="mk"><div class="mk-label">How urgent is this?</div><div class="mk-in">Select urgency ▾</div><div class="mk-row"><span class="mk-btn">Continue</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">How urgent is this?</div><div>○ It stops me working</div><div>○ It slows me down</div><div>○ It's not urgent</div><div class="mk-row"><span class="mk-btn">Continue</span></div></div>`,
        correct: "b",
        why: "B shows all three answers at once, so people compare them and choose with a single click or tap. A hides three short options behind a menu, adding a step and hiding the very words people need to decide.",
      },
      {
        id: "f6-control-choice",
        type: "choice",
        question: "A form asks “Which devices do you use for work?” with the options laptop, desktop, tablet and phone. Which control fits?",
        options: [
          "Radio buttons",
          "Checkboxes, with the hint “Select all that apply”",
          "A dropdown",
          "Four separate yes-or-no questions, one per page",
        ],
        correct: 1,
        why: "Many people use more than one device, so the control must allow several answers, and the hint tells people they can pick more than one. Radios and a dropdown force a single answer that would be wrong for most people. Four yes-or-no pages turn one quick question into four.",
      },
      {
        id: "f6-spot-two-option-select",
        type: "spot",
        question: "Which question uses the wrong kind of control?",
        title: "Book a site visit",
        parts: [
          {
            id: "name",
            label: "Field labeled Full name",
            html: `<div class="mk-label">Full name</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "parking",
            label: "Question: Will you need a parking space? Answered with a dropdown that says Select",
            html: `<div class="mk-label">Will you need a parking space?</div><div class="mk-in">Select ▾</div>`,
          },
          {
            id: "time",
            label: "Question: Preferred time, with radio buttons for Morning and Afternoon",
            html: `<div class="mk-label">Preferred time</div><div>○ Morning</div><div>○ Afternoon</div>`,
          },
          {
            id: "submit",
            label: "Button: Continue",
            html: `<span class="mk-btn">Continue</span>`,
          },
        ],
        correct: "parking",
        why: "A yes-or-no question hidden in a dropdown makes people open a menu just to see two answers. Radio buttons show both at once and take a single tap, which is exactly how the Preferred time question works.",
      },
    ],
  },
  {
    id: "f7",
    code: "F7",
    title: "Required and optional fields",
    subtitle: "Say it in words",
    minutes: 4,
    skills: ["forms"],
    body: [
      "Many forms mark required fields with a red asterisk and never explain it. Some people don't know what it means, screen readers may read it as “star” or skip it, and when nearly every field has one, the mark stops telling anyone anything.",
      "Design systems differ on the fix. GOV.UK asks only for what's needed, so almost everything is required, and marks just the exceptions with “(optional)”. USWDS marks required fields with an asterisk, explains it at the top of the form, and also labels optional fields “(optional)”. Both agree on the essentials: use words, explain any symbol, and keep optional fields rare.",
    ],
    practice: [
      "Add “(optional)” to the label or legend of every optional question.",
      "If you use asterisks, explain them at the top of the form, and set the required attribute in code.",
      "If most of a form is optional, question whether those fields belong in it at all.",
      "Let people submit an incomplete form and then show what's missing, rather than disabling the button with no explanation.",
    ],
    fieldExercise:
      "Count the required and optional fields in one of your product's forms. If the optional ones are the majority, write down what each is for.",
    sources: [govuk("patterns/question-pages", "Question pages"), uswds("components/form", "Form")],
    exercises: [
      {
        id: "f7-required-markers",
        type: "compare",
        question: "Which form makes it clearer what people have to fill in?",
        a: `<div class="mk"><div class="mk-label">Full name <span class="mk-err">*</span></div><div class="mk-in">&nbsp;</div><div class="mk-label">Email address <span class="mk-err">*</span></div><div class="mk-in">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in">&nbsp;</div><div class="mk-label">Company <span class="mk-err">*</span></div><div class="mk-in">&nbsp;</div></div>`,
        b: `<div class="mk"><div class="mk-label">Full name</div><div class="mk-in">&nbsp;</div><div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div><div class="mk-label">Phone number (optional)</div><div class="mk-in">&nbsp;</div><div class="mk-label">Company</div><div class="mk-in">&nbsp;</div></div>`,
        correct: "b",
        why: "B marks the one exception in plain words that everyone, including screen reader users, understands. A uses unexplained red asterisks: some people don't know what they mean, they rely on a symbol and color, and people have to compare every label to find the one field they can skip.",
      },
      {
        id: "f7-optional",
        type: "choice",
        question: "Every field on a page is required except “Middle name”. How should you mark that?",
        options: [
          "Add “(optional)” to the Middle name label",
          "Put an unexplained red asterisk on every other field",
          "Make the Middle name label a lighter gray",
          "Don't mark it; people will find out when they submit",
        ],
        correct: 0,
        why: "Words in the label are clear to everyone, and one marker is easy to spot. Unexplained asterisks on every other field add noise to save one word, a lighter label lowers contrast and still relies on looks alone, and leaving it unmarked makes people fill in a field they could have skipped.",
      },
    ],
  },
  {
    id: "f8",
    code: "F8",
    title: "Errors and validation",
    subtitle: "What went wrong, where, and how to fix it",
    minutes: 5,
    skills: ["forms", "feedback"],
    body: [
      "When an answer can't be accepted, people need to know three things: that there's a problem, where it is, and how to fix it. GOV.UK does this in two parts: a summary at the top of the page that lists each problem and links to its field, and a message next to each field that has a problem.",
      "Timing matters too. Telling someone their email address is invalid while they're still typing it is like being interrupted mid-sentence. Check answers when people submit the page, or at the earliest when they leave a field, and keep the message there until the answer is fixed. Write messages that say what to do, such as “Enter a phone number with at least 10 digits”.",
    ],
    practice: [
      "When a page has errors, show a summary at the top, move focus to it, and link each item to its field.",
      "Repeat each message next to its field, and add “Error:” to the start of the page title so screen reader users hear it.",
      "Don't validate an answer while people are still typing it.",
      "Keep what people entered, even invalid answers, so they can fix them rather than start again.",
    ],
    fieldExercise:
      "Submit one of your product's forms empty, first with a mouse and then with only the keyboard. Check whether you can find and reach every error both ways.",
    sources: [
      govuk("components/error-summary", "Error summary"),
      govuk("components/error-message", "Error message"),
      uswds("components/validation", "Validation"),
    ],
    exercises: [
      {
        id: "f8-error-summary",
        type: "compare",
        question: "Someone submitted a long expense claim with two problems. Which response helps them fix it fastest?",
        a: `<div class="mk"><div class="mk-errsum"><div class="mk-title">There is a problem</div><span class="mk-link">Enter your employee ID</span><span class="mk-link">Date of the expense must be in the past</span></div><div class="mk-label">Employee ID</div><div class="mk-err">Enter your employee ID</div><div class="mk-in err">&nbsp;</div></div>`,
        b: `<div class="mk"><div class="mk-err">The form contains errors. Please review your answers and submit again.</div><div class="mk-label">Employee ID</div><div class="mk-in">&nbsp;</div></div>`,
        correct: "a",
        why: "A says what's wrong and where, each link jumps straight to its field, and the same message appears next to the field. B only says something is wrong, so people have to scroll through the whole form hunting for the problems.",
      },
      {
        id: "f8-timing",
        type: "choice",
        question: "When should an email field show “Enter an email address in the correct format, like name@example.com”?",
        options: [
          "As soon as the person types the first character",
          "When they submit the page, or at the earliest when they leave the field, if the address is still invalid",
          "Never. Let invalid addresses through and handle the bounced emails later",
          "Only after the third failed attempt",
        ],
        correct: 1,
        why: "Checking on submit, or when people leave the field, judges the answer once it's finished. Checking from the first keystroke flags every half-typed address as wrong. Skipping the check means a typo quietly costs people their receipt or login, and waiting for a third attempt wastes the first two.",
      },
      {
        id: "f8-spot-vague-error",
        type: "spot",
        question: "This form was submitted with a mistake. Which part lets the person down?",
        title: "Register a guest",
        parts: [
          {
            id: "name",
            label: "Field labeled Full name, containing Mark Okafor",
            html: `<div class="mk-label">Full name</div><div class="mk-in">Mark Okafor</div>`,
          },
          {
            id: "dob",
            label: "Field labeled Date of birth, containing 31 02 1985, with red text: Invalid input",
            html: `<div class="mk-label">Date of birth</div><div class="mk-err">Invalid input</div><div class="mk-in err">31 / 02 / 1985</div>`,
          },
          {
            id: "email",
            label: "Field labeled Email, containing mark@example.com",
            html: `<div class="mk-label">Email</div><div class="mk-in">mark@example.com</div>`,
          },
          {
            id: "submit",
            label: "Button: Save guest",
            html: `<span class="mk-btn">Save guest</span>`,
          },
        ],
        correct: "dob",
        why: "“Invalid input” doesn't say what's wrong or how to fix it. The date doesn't exist, since February has no 31st, so the message should say something like “Date of birth must be a real date, like 27 3 1985”. The red text is in the right place; it's the words that fail.",
      },
    ],
  },
];

export const formsPath: LearningPath = {
  id: "forms",
  title: "Form design",
  description: "Asking the right questions, labels, dates, choices and errors, drawing on GOV.UK and USWDS research.",
  status: "live",
  lessons,
};
