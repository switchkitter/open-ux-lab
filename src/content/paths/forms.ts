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
    sources: [manual("form-structure", "Structuring forms"), govuk("patterns/question-pages", "Question pages")],
    exercises: [
      {
        id: "f1-signup-fields",
        type: "compare",
        question: "A newsletter sign-up for a project management tool. Which form will get more sign-ups without losing anything the team actually uses?",
        a: `<div class="mk"><div class="mk-title">Get product tips every month</div><div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div><div class="mk-row"><span class="mk-btn">Subscribe</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Get product tips every month</div><div class="mk-label">First name</div><div class="mk-muted">So we can personalize your emails</div><div class="mk-in">&nbsp;</div><div class="mk-label">Company</div><div class="mk-in">&nbsp;</div><div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div><div class="mk-row"><span class="mk-btn">Subscribe</span></div></div>`,
        describe: {
          a: "A newsletter sign-up, “Get product tips every month”, with one field, Email address, and a Subscribe button.",
          b: "A newsletter sign-up, “Get product tips every month”, with three fields: First name (with the hint “So we can personalize your emails”), Company and Email address, then a Subscribe button.",
        },
        correct: "a",
        why: "A newsletter only needs an email address to work. B's extra fields sound reasonable, and personalizing is nice, but each one is more effort before people have seen a single email, so fewer sign up. If the team really uses names or companies, it can ask later, once people value the emails.",
      },
      {
        id: "f1-question-protocol",
        type: "choice",
        question: "A stakeholder wants to add “Annual household income” to a library card application. What should you do first?",
        options: [
          "Add it as an optional field so nobody is forced to answer it",
          "Ask who will use the answer, and whether the service works without it",
          "Add it with a dropdown of income bands so it's quicker to answer",
          "Put it at the end of the form so it doesn't put people off early",
        ],
        correct: 1,
        why: "If nobody can name a real use, the question shouldn't be there at all. Making it optional, quicker or later still asks for sensitive information with no purpose, and it adds length and doubt to every application.",
      },
      {
        id: "f1-spot-unneeded-question",
        type: "spot",
        question: "This form gives away a free accessibility checklist. Which question doesn't belong?",
        title: "Get the free checklist (PDF)",
        parts: [
          {
            id: "email",
            label: "Field labeled Email address",
            html: `<div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "name",
            label: "Field labeled First name (optional)",
            html: `<div class="mk-label">First name (optional)</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "dob",
            label: "Field labeled Date of birth",
            html: `<div class="mk-label">Date of birth</div><div class="mk-in">DD / MM / YYYY</div>`,
          },
          {
            id: "send",
            label: "Button: Send me the checklist",
            html: `<span class="mk-btn">Send me the checklist</span>`,
          },
        ],
        correct: "dob",
        why: "Nothing about sending a checklist needs a date of birth, and asking for it makes people wonder what you'll do with it. If nobody can say who uses an answer, the question should go. The email is needed, and the optional first name is clearly marked.",
      },
      {
        id: "f1-sort-needed",
        type: "sort",
        question: "A shop's checkout for an order delivered by post. Which questions are needed to complete the order, and which aren't?",
        groups: ["Needed for the order", "Not needed"],
        items: [
          { id: "address", text: "Delivery address", group: 0 },
          { id: "payment", text: "Card details", group: 0 },
          { id: "email", text: "Email address, for the receipt and delivery updates", group: 0 },
          { id: "dob", text: "Date of birth", group: 1 },
          { id: "gender", text: "Gender", group: 1 },
          { id: "heard", text: "How did you hear about us?", group: 1 },
        ],
        why: "Every question adds effort and makes some people give up, so ask only what this order needs: where to send it, how to pay, and where to send the receipt. Date of birth and gender don't help deliver a parcel, and “How did you hear about us?” serves the marketing team, not the customer. If a team needs that last one, it can be a skippable question after the order is placed.",
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
      manual("form-structure", "Structuring forms"),
      govuk("patterns/check-answers", "Check answers"),
      uswds("patterns/complete-a-complex-form", "Complete a complex form"),
    ],
    exercises: [
      {
        id: "f2-check-answers",
        type: "compare",
        question: "The last step of a visa application. Which ending helps people catch their mistakes?",
        a: `<div class="mk"><div class="mk-title">Your answers</div><div class="mk-row"><span class="mk-label">Name</span><span>Sofia Marín</span></div><div class="mk-row"><span class="mk-label">Date of birth</span><span>14 March 1990</span></div><div class="mk-row"><span class="mk-label">Passport number</span><span>502384917</span></div><div class="mk-muted">To change anything, start the application again.</div><div class="mk-row"><span class="mk-btn">Submit</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Check your answers</div><div class="mk-row"><span class="mk-label">Name</span><span>Sofia Marín</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-label">Date of birth</span><span>14 March 1990</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-label">Passport number</span><span>502384917</span><span class="mk-link">Change</span></div><div class="mk-row"><span class="mk-btn">Accept and send</span></div></div>`,
        describe: {
          a: "A page headed Your answers, listing Name: Sofia Marín; Date of birth: 14 March 1990; Passport number: 502384917, a note saying “To change anything, start the application again.”, and a Submit button.",
          b: "A page headed Check your answers, listing Name: Sofia Marín; Date of birth: 14 March 1990; Passport number: 502384917, each with a Change link, then an Accept and send button.",
        },
        correct: "b",
        why: "Both let people see their answers, but B also lets them fix one in place with a Change link. In A, spotting a typo in the passport number means starting the whole application again, so many people will submit the mistake rather than redo everything.",
      },
      {
        id: "f2-one-thing",
        type: "choice",
        question: "A benefits claim form has 40 questions on one page, and many apply only to some people. What's the best restructure?",
        options: [
          "Keep one page, but add a progress bar and section headings at the top",
          "Use one question or topic per page, and skip pages that don't apply",
          "Split it into two pages of 20 questions each, with a Save button on each",
          "Put each section in a collapsible accordion so the page looks shorter",
        ],
        correct: 1,
        why: "One thing per page keeps each step simple, and skipping means people only see questions that apply to them. A progress bar doesn't make 40 questions shorter, two pages of 20 keep all the same problems, and accordions hide questions people still have to find and answer.",
      },
      {
        id: "f2-spot-no-change-link",
        type: "spot",
        question: "On this check-your-answers page, which part stops people fixing a mistake?",
        title: "Check your answers",
        parts: [
          {
            id: "name",
            label: "Row: Name, Sofia Marín, with a Change link",
            html: `<div class="mk-row"><span class="mk-label">Name</span><span>Sofia Marín</span><span class="mk-link">Change</span></div>`,
          },
          {
            id: "dob",
            label: "Row: Date of birth, 14 March 1990, with a Change link",
            html: `<div class="mk-row"><span class="mk-label">Date of birth</span><span>14 March 1990</span><span class="mk-link">Change</span></div>`,
          },
          {
            id: "passport",
            label: "Row: Passport number, 502384917, with no Change link",
            html: `<div class="mk-row"><span class="mk-label">Passport number</span><span>502384917</span></div>`,
          },
          {
            id: "send",
            label: "Button: Accept and send",
            html: `<span class="mk-btn">Accept and send</span>`,
          },
        ],
        correct: "passport",
        why: "The passport number is the answer most likely to have a typo, and it's the only one people can't change from here. Every answer on a check-your-answers page needs a Change link back to its question. The other rows show how.",
      },
      {
        id: "f2-sort-together",
        type: "sort",
        question: "A visa application. Which of these belong together on one page, and which are separate questions that should get their own page?",
        groups: ["Belong together", "Separate questions"],
        items: [
          { id: "address", text: "The street, town and postcode of your home address", group: 0 },
          { id: "date", text: "The day, month and year of your date of birth", group: 0 },
          { id: "name", text: "Your given names and family name", group: 0 },
          { id: "travel", text: "“Have you been to this country before?” and “Do you have a criminal record?”", group: 1 },
          { id: "income", text: "“What's your yearly income?” and “What's your partner's nationality?”", group: 1 },
        ],
        why: "“One thing per page” means one question per page, and a question can need several fields, like the parts of an address, a date or a name. Unrelated questions should be split, so each page is quick to answer, errors are easier to show, and people can go back and change one answer without wading through others.",
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
        a: `<div class="mk"><div class="mk-label">Postcode</div><div class="mk-in" style="width:7em">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in" style="width:12em">&nbsp;</div><div class="mk-label">Security code</div><div class="mk-muted">3 or 4 digits, usually on the back of your card</div><div class="mk-in" style="width:4em">&nbsp;</div></div>`,
        b: `<div class="mk"><div class="mk-label">Postcode</div><div class="mk-in">&nbsp;</div><div class="mk-label">Phone number</div><div class="mk-in">&nbsp;</div><div class="mk-label">Security code</div><div class="mk-muted">3 or 4 digits, usually on the back of your card</div><div class="mk-in">&nbsp;</div></div>`,
        describe: {
          a: "Three fields of different widths: Postcode is short, Phone number is medium, and Security code, with the hint “3 or 4 digits, usually on the back of your card”, is very short.",
          b: "Three fields, Postcode, Phone number and Security code (with the hint “3 or 4 digits, usually on the back of your card”), all the same full width.",
        },
        correct: "a",
        why: "A sizes each field to its answer, so the field itself hints at what belongs there. In B every field is the same full width, so a 3- or 4-digit code gets as much room as a street address and the layout gives no clue about length.",
      },
      {
        id: "f3-hint-placement",
        type: "choice",
        question: "Where should a format hint like “For example, 27 3 2007” go?",
        options: [
          "Inside the field, as placeholder text that disappears when typing starts",
          "Between the label and the field, as visible, linked text",
          "In a tooltip behind an ⓘ icon placed right next to the label",
          "In the error message that appears when the format is wrong",
        ],
        correct: 1,
        why: "People read it before they type, it stays visible while they type, and linking it to the field means screen readers announce it too. Placeholder text disappears when typing starts, tooltips are often missed and awkward on touch screens, and an error message only helps after people have already got it wrong.",
      },
      {
        id: "f3-spot-wide-code",
        type: "spot",
        question: "Which field gives people the wrong clue about what to type?",
        title: "Payment",
        parts: [
          {
            id: "card",
            label: "Field labeled Card number, about 20 characters wide",
            html: `<div class="mk-label">Card number</div><div class="mk-in" style="width:14em">&nbsp;</div>`,
          },
          {
            id: "expiry",
            label: "Field labeled Expiry date, with the hint MM/YY, about 5 characters wide",
            html: `<div class="mk-label">Expiry date</div><div class="mk-muted">MM/YY</div><div class="mk-in" style="width:5em">&nbsp;</div>`,
          },
          {
            id: "code",
            label: "Field labeled Security code, with the hint 3 digits on the back of your card, stretching the full width of the form",
            html: `<div class="mk-label">Security code</div><div class="mk-muted">3 digits on the back of your card</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "pay",
            label: "Button: Pay $84.00",
            html: `<span class="mk-btn">Pay $84.00</span>`,
          },
        ],
        correct: "code",
        why: "A field as wide as the whole form suggests a long answer, but the security code is 3 digits. Sizing it to fit the answer gives people a quick visual clue. The card number and expiry fields are already sized to their content.",
      },
      {
        id: "f3-sort-width",
        type: "sort",
        question: "Field width hints at how long the answer is. Which fields should be narrow, and which full width?",
        groups: ["Narrow", "Full width"],
        items: [
          { id: "postcode", text: "Postcode", group: 0 },
          { id: "cvc", text: "Card security code", group: 0 },
          { id: "year", text: "Year of birth", group: 0 },
          { id: "street", text: "Street address", group: 1 },
          { id: "email", text: "Email address", group: 1 },
          { id: "details", text: "Tell us what happened", group: 1 },
        ],
        why: "A field sized to its answer is a silent hint: a short box says “a few characters”, a wide one says “a line or more”. Postcodes, security codes and years are short and fixed in length. Street and email addresses vary and can be long, and a description needs a large text area. Making everything full width throws that hint away.",
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
        b: `<div class="mk"><div class="mk-label">First name</div><div class="mk-in">Siobhan</div><div class="mk-label">Last name</div><div class="mk-in">Darcy</div><div class="mk-muted">Special characters were removed.</div><div class="mk-row"><span class="mk-btn">Continue</span></div></div>`,
        describe: {
          a: "One field labeled Full name, with the hint “As it's written on your passport”, containing Siobhán D'Arcy, and a Continue button.",
          b: "A First name field showing Siobhan and a Last name field showing Darcy, with the note “Special characters were removed.” and a Continue button.",
        },
        correct: "a",
        why: "A accepts her name exactly as she writes it and says which version is needed. B doesn't show an error, but it quietly changes her name to Siobhan Darcy, which is still wrong, can clash with her passport and bank records, and tells her the system can't handle her name.",
      },
      {
        id: "f4-autocomplete",
        type: "choice",
        question: "Your checkout asks for name, email and phone number. What helps people on phones most, for the least effort from your team?",
        options: [
          "Add autocomplete attributes and the right input types for each field",
          "Split the phone number into three fields: area code, prefix and line number",
          "Pre-fill the fields with example values that people can type over",
          "Add a Clear all button at the bottom so people can start again quickly",
        ],
        correct: 0,
        why: "Autocomplete lets the browser fill in details people have entered before, and input types bring up the right keyboard, such as a number pad for the phone. Splitting a phone number breaks pasting and international numbers, example values have to be deleted before typing, and a Clear all button only adds a way to lose work.",
      },
      {
        id: "f4-spot-name-rules",
        type: "spot",
        question: "Which part will reject some people's real names?",
        title: "Your details",
        parts: [
          {
            id: "given",
            label: "Field labeled Given names",
            html: `<div class="mk-label">Given names</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "family",
            label: "Field labeled Family name, with the hint Letters A to Z only, up to 12 characters",
            html: `<div class="mk-label">Family name</div><div class="mk-muted">Letters A to Z only, up to 12 characters</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "email",
            label: "Field labeled Email address",
            html: `<div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "next",
            label: "Button: Continue",
            html: `<span class="mk-btn">Continue</span>`,
          },
        ],
        correct: "family",
        why: "Many family names have accents, apostrophes, hyphens or spaces, like Díaz, O'Brien or Nguyen-Okafor, and plenty are longer than 12 letters. Rules like these tell people their own name is wrong. Accept any characters and allow long names. The other fields are fine.",
      },
      {
        id: "f4-sort-names",
        type: "sort",
        question: "Which ways of handling names work for real people, and which break for some of them?",
        groups: ["Works for real names", "Breaks for some people"],
        items: [
          { id: "full", text: "A single Full name field", group: 0 },
          { id: "accents", text: "Accepting accents, apostrophes and hyphens", group: 0 },
          { id: "call", text: "Asking “What should we call you?”", group: 0 },
          { id: "both", text: "Requiring both a first and a last name", group: 1 },
          { id: "short", text: "Rejecting names shorter than 3 letters", group: 1 },
          { id: "az", text: "Allowing only the letters A to Z", group: 1 },
        ],
        why: "Names vary hugely: some people have one name, some have very short names like Li or Ng, and many use accents, apostrophes or hyphens. One flexible field, and asking what to call someone, works for everyone. Mandatory first and last names, length limits and A-to-Z rules tell real people their own name is wrong.",
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
        describe: {
          a: "A Date of birth dropdown, “Select a date”, that opens a calendar showing the current month, October 2026.",
          b: "The question “What is your date of birth?” with the hint “For example, 27 3 1987” and three small boxes, Day, Month and Year, filled in as 14, 3 and 1990.",
        },
        correct: "b",
        why: "B lets people type a date they already know in a few keystrokes. A opens on the current month, so someone born in 1990 has to step back through hundreds of months or hunt for a hidden year menu.",
      },
      {
        id: "f5-picker-when",
        type: "choice",
        question: "When does a calendar date picker make the most sense?",
        options: [
          "A date of birth on an insurance quote form",
          "Picking a delivery day in the next two weeks",
          "The issue date printed on someone's passport",
          "Every date field in the product, so they're all consistent",
        ],
        correct: 1,
        why: "Calendars help when people choose a date near today and want to see the weekdays, like a delivery slot. Birth dates and document dates are already known, so typing them is quicker. A picker on every field for consistency makes the common case slower.",
      },
      {
        id: "f5-spot-dob-calendar",
        type: "spot",
        question: "Which date field makes people do the most work?",
        title: "Book a passport appointment",
        parts: [
          {
            id: "dob",
            label: "Field labeled Date of birth: a Select a date button that opens a calendar on today's month",
            html: `<div class="mk-label">Date of birth</div><div class="mk-in">Select a date ▾</div><div class="mk-muted">Opens a calendar on October 2026</div>`,
          },
          {
            id: "issued",
            label: "Question: When was your current passport issued? Answered with Day, Month and Year boxes",
            html: `<div class="mk-label">When was your current passport issued?</div><div class="mk-row"><span class="mk-in" style="width:3.2em">DD</span><span class="mk-in" style="width:3.2em">MM</span><span class="mk-in" style="width:4.6em">YYYY</span></div>`,
          },
          {
            id: "appointment",
            label: "Field labeled Appointment: a calendar showing the next two weeks, with weekdays",
            html: `<div class="mk-label">Appointment</div><div class="mk-in">Calendar · next 2 weeks · Mon to Fri</div>`,
          },
          {
            id: "book",
            label: "Button: Book appointment",
            html: `<span class="mk-btn">Book appointment</span>`,
          },
        ],
        correct: "dob",
        why: "Someone born in 1990 has to step back through hundreds of months to find their birthday, when typing it into day, month and year boxes would take seconds. The calendar is right for the appointment, a near-future date where weekdays matter, and the passport date already uses the boxes.",
      },
      {
        id: "f5-sort-date-input",
        type: "sort",
        question: "Which dates are easier to type, and which suit a calendar picker?",
        groups: ["Easier to type", "Suits a calendar"],
        items: [
          { id: "dob", text: "Your date of birth", group: 0 },
          { id: "passport", text: "The expiry date printed on your passport", group: 0 },
          { id: "started", text: "The date your current job started", group: 0 },
          { id: "hotel", text: "Check-in for a hotel stay next month", group: 1 },
          { id: "delivery", text: "A delivery day in the next two weeks", group: 1 },
        ],
        why: "When people already know a date, especially one far in the past or future, typing it is fastest; a calendar would make them click back through years. Calendars help when people are choosing a date and need to see days of the week, availability or the dates around it, like booking a stay or picking a delivery slot.",
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
        describe: {
          a: "The question “How urgent is this?” with a dropdown reading Select urgency, then a Continue button.",
          b: "The question “How urgent is this?” with three radio buttons: It stops me working; It slows me down; It's not urgent. Then a Continue button.",
        },
        correct: "b",
        why: "B shows all three answers at once, so people compare them and choose with a single click or tap. A hides three short options behind a menu, adding a step and hiding the very words people need to decide.",
      },
      {
        id: "f6-control-choice",
        type: "choice",
        question: "A form asks “Which devices do you use for work?” with the options laptop, desktop, tablet and phone. Which control fits?",
        options: [
          "Radio buttons, one for each device, in a single list",
          "Checkboxes, with the hint “Select all that apply”",
          "A dropdown listing the devices in alphabetical order",
          "Four separate yes-or-no questions, one on each page",
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
      {
        id: "f6-sort-control",
        type: "sort",
        question: "Each question has a handful of short answers. Which need radio buttons, and which need checkboxes?",
        groups: ["Radio buttons", "Checkboxes"],
        items: [
          { id: "speed", text: "Choose a delivery speed: standard, express or next day", group: 0 },
          { id: "days", text: "Which days are you available? Monday to Friday", group: 1 },
          { id: "payment", text: "How would you like to pay? Card, bank transfer or invoice", group: 0 },
          { id: "alerts", text: "Which updates do you want by email? Orders, offers, newsletters", group: 1 },
          { id: "terms", text: "I agree to the terms and conditions", group: 1 },
        ],
        why: "Radio buttons are for picking exactly one answer from a set, like a delivery speed or a payment method. Checkboxes are for picking any number, including none. A single statement people must agree to is also a checkbox: a lone radio button can't be unchecked once selected.",
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
        describe: {
          a: "Four fields. Full name, Email address and Company each have a red asterisk after the label. Phone number has none. Nothing explains the asterisks.",
          b: "Four fields labeled Full name, Email address, Phone number (optional) and Company, with no other markers.",
        },
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
      {
        id: "f7-spot-lone-asterisk",
        type: "spot",
        question: "Which part makes this form's rules unclear?",
        title: "Contact sales",
        parts: [
          {
            id: "name",
            label: "Field labeled Full name",
            html: `<div class="mk-label">Full name</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "email",
            label: "Field labeled Email address",
            html: `<div class="mk-label">Email address</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "phone",
            label: "Field labeled Phone number (optional)",
            html: `<div class="mk-label">Phone number (optional)</div><div class="mk-in">&nbsp;</div>`,
          },
          {
            id: "job",
            label: "Field labeled Job title, followed by a red asterisk. The asterisk isn't explained anywhere.",
            html: `<div class="mk-label">Job title <span class="mk-err">*</span></div><div class="mk-in">&nbsp;</div>`,
          },
        ],
        correct: "job",
        why: "The form marks optional fields in words, so everything else is required. Then one field has an unexplained red asterisk, which makes people wonder whether the other fields are optional after all, and relies on a symbol and color. The other three labels are clear.",
      },
      {
        id: "f7-sort-marking",
        type: "sort",
        question: "Which ways of showing required and optional fields are clear to everyone, and which are easy to miss or misread?",
        groups: ["Clear to everyone", "Easy to miss"],
        items: [
          { id: "optional", text: "The word “(optional)” after the label of the one field you can skip", group: 0 },
          { id: "note", text: "A line at the top saying all fields are required unless marked optional", group: 0 },
          { id: "asterisk", text: "A red asterisk with no explanation", group: 1 },
          { id: "bold", text: "Required fields shown only in bold", group: 1 },
          { id: "grey", text: "Optional fields shown only with lighter label text", group: 1 },
        ],
        why: "Words work for everyone, including screen reader users and people who don't know design shorthand. Bold, lighter text or a lone red asterisk all depend on noticing a visual difference and guessing what it means. Since most fields in a good form are required, marking the few optional ones in words is usually the clearest approach.",
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
        b: `<div class="mk"><div class="mk-label">Employee ID</div><div class="mk-err">Enter your employee ID</div><div class="mk-in err">&nbsp;</div><div class="mk-muted">The second problem is further down the page, out of view.</div></div>`,
        describe: {
          a: "A box at the top headed “There is a problem” with two links: Enter your employee ID; Date of the expense must be in the past. Below, the Employee ID field is outlined in red, with the same message above it.",
          b: "The Employee ID field, outlined in red, with the message “Enter your employee ID” above it. A note says the second problem is further down the page, out of view, and there's no summary at the top.",
        },
        correct: "a",
        why: "Both put clear messages next to the fields, but A also lists every problem at the top, with links straight to each. On a long form, B only shows the first problem, so people fix it, submit again, and only then discover the second one further down.",
      },
      {
        id: "f8-timing",
        type: "choice",
        question: "When should an email field show “Enter an email address in the correct format, like name@example.com”?",
        options: [
          "As soon as the person types the first character in the field",
          "When they submit, or at the earliest when they leave the field",
          "Never: let invalid addresses through and handle bounced emails later",
          "Only after the third failed attempt, to avoid nagging people",
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
      {
        id: "f8-sort-errors",
        type: "sort",
        question: "Which ways of handling form errors help people fix them, and which make it harder?",
        groups: ["Helps fix it", "Makes it harder"],
        items: [
          { id: "summary", text: "A list of errors at the top, each linking to its field", group: 0 },
          { id: "message", text: "A message next to the field saying what to change", group: 0 },
          { id: "password", text: "Password rules that tick off as you type", group: 0 },
          { id: "early", text: "“Email is invalid” appearing after you type the first letter", group: 1 },
          { id: "clear", text: "Clearing every field after one error", group: 1 },
          { id: "border", text: "A red border on the field, with no message", group: 1 },
        ],
        why: "People need to find each problem, know what to change and keep what they've typed. A linked summary, a specific message and live password rules all do that. Flagging an email as invalid before someone has finished typing it is distracting, wiping the form punishes them, and a red border alone doesn't say what's wrong. Live checking helps only when it shows progress, like password rules, rather than premature errors.",
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
