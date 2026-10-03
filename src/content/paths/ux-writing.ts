import type { License, Lesson, LearningPath, Source } from "../types";

// Lesson text is original. GOV.UK content is Open Government Licence v3.0 and USWDS is public domain /
// CC0 (checked 2026-10-02); NN/g, Material Design, Digital.gov and W3C are summarized and linked.
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
const uiWriting: Source = {
  title: "GOV.UK Service Manual: Writing for user interfaces",
  url: "https://www.gov.uk/service-manual/design/writing-for-user-interfaces",
  license: OGL,
};
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

const btn = (text: string, cls = "") => `<span class="mk-btn${cls ? " " + cls : ""}">${text}</span>`;

const lessons: Lesson[] = [
  {
    id: "w1",
    code: "W1",
    title: "Plain, familiar words",
    subtitle: "Say it the way your users would",
    minutes: 5,
    skills: ["language"],
    body: [
      "Interface text has one job: help someone get something done. Plain language means picking the shortest common word that's still accurate, writing in the active voice, and using the terms your customers use rather than the ones your team uses in meetings. “Sign in” works better than “Authenticate”, and “Your order is on its way” works better than “Shipment status: dispatched to carrier”.",
      "Plain language isn't dumbing down. Experts like it too, because it lets them scan and act quickly, especially when they're busy, stressed or on a phone. Put the most important words first, cut words that don't change the meaning, and when you need a specialist term, use the one your audience would type into a search box.",
    ],
    practice: [
      "Swap internal or technical terms for the words customers use. Support calls and search logs show you what those are.",
      "Lead with the point: the outcome or action first, details after.",
      "Use the active voice and speak to people as “you”.",
      "Read the text out loud. If you'd never say it to a person, rewrite it.",
    ],
    fieldExercise:
      "Pick one screen in your product and list every term a new customer might not know. Then check your support tickets for the words customers use instead.",
    sources: [
      { title: "Digital.gov: Plain language guide", url: "https://digital.gov/guides/plain-language/" },
      nng("plain-language-experts", "Plain Language Is for Everyone, Even Experts"),
      uiWriting,
    ],
    exercises: [
      {
        id: "w1-refund-status",
        type: "compare",
        question: "A customer checks on a refund. Which status message tells them what they need to know?",
        a: `<div class="mk"><div class="mk-title">Refund</div><div class="mk-muted">Status: RFND_PENDING_SETTLEMENT. Disbursement will be initiated upon reconciliation.</div></div>`,
        b: `<div class="mk"><div class="mk-title">Refund</div><div>We've approved your refund of $42.00.</div><div class="mk-muted">It should reach your card in 3 to 5 business days.</div></div>`,
        describe: {
          a: "A Refund card showing the status RFND_PENDING_SETTLEMENT and the sentence “Disbursement will be initiated upon reconciliation.”",
          b: "A Refund card saying “We've approved your refund of $42.00.” and, below, “It should reach your card in 3 to 5 business days.”",
        },
        correct: "b",
        why: "B says what happened and when the money will arrive, in the customer's own words. A shows an internal status code and accounting terms, so the customer can't tell whether the refund was approved or when to expect it, and is likely to contact support to find out.",
      },
      {
        id: "w1-experts",
        type: "choice",
        question: "Your product is used by tax accountants. A teammate says plain language isn't needed because the users are experts. What's the best response?",
        options: [
          "Experts benefit too: they scan faster, and they still get the precise terms where the meaning depends on them",
          "Agree, and write in formal technical language so the product feels professional",
          "Add a glossary page and leave the interface text as it is",
          "Cut every label down to a single word so there's less to read",
        ],
        correct: 0,
        why: "Plain language helps everyone read faster, and experts are often the busiest readers. It doesn't mean dropping the exact tax terms they rely on, just not wrapping them in needless jargon. A glossary sends people away from their task, and one-word labels lose meaning.",
      },
      {
        id: "w1-spot-internal-term",
        type: "spot",
        question: "Which part uses words customers wouldn't use?",
        title: "Your subscription",
        parts: [
          { id: "plan", label: "Text: Plan: Team, 12 seats", html: `<div>Plan: Team, 12 seats</div>` },
          { id: "renew", label: "Text: Renews on 1 November 2026", html: `<div class="mk-muted">Renews on 1 November 2026</div>` },
          { id: "sku", label: "Text: Entitlement SKU TM-12-ANN is provisioned", html: `<div class="mk-muted">Entitlement SKU TM-12-ANN is provisioned</div>` },
          { id: "change", label: "Button: Change plan", html: btn("Change plan") },
        ],
        correct: "sku",
        why: "“Entitlement SKU” and “provisioned” are billing-system terms. A customer would say something like “Your plan is active”. The plan name, the renewal date and the Change plan button all use everyday words.",
      },
    ],
  },
  {
    id: "w2",
    code: "W2",
    title: "Buttons and links that say what they do",
    subtitle: "Label the action, not the click",
    minutes: 5,
    skills: ["language", "conventions"],
    body: [
      "A button label is a promise about what happens next. The most useful labels start with a verb and name what it acts on: “Send invoice”, “Save draft”, “Delete 3 files”. Generic labels such as “Submit”, “OK” or “Continue” make people read the whole screen to work out what they're about to trigger.",
      "Links work the same way. “Click here” and “Learn more” mean nothing out of context, which matters for anyone scanning and for screen reader users, who often jump through a list of links. Make link text describe where it goes, keep labels short, and use the same label for the same action everywhere in the product.",
    ],
    practice: [
      "Start buttons with a verb, and add the object when it isn't obvious: “Download report”, not “Download”.",
      "Avoid Submit, OK and Yes when a more specific verb fits.",
      "Write link text that makes sense on its own, like “View your invoices”, never “click here”.",
      "Give each action one name across the product. If it's “Archive” in one place, don't call it “Move to storage” in another.",
    ],
    fieldExercise:
      "List every button label in one flow of your product. Mark the ones that would still make sense if they were the only words on the screen.",
    sources: [
      govuk("components/button", "Button"),
      uswds("components/button", "Button"),
      understanding("link-purpose-in-context", "Link Purpose (In Context)"),
    ],
    exercises: [
      {
        id: "w2-submit-label",
        type: "compare",
        question: "The last step of a job application. Which button tells applicants what will happen?",
        a: `<div class="mk"><div class="mk-title">Check your application</div><div class="mk-muted">Senior product designer · Dublin</div><div class="mk-row">${btn("Submit")}</div></div>`,
        b: `<div class="mk"><div class="mk-title">Check your application</div><div class="mk-muted">Senior product designer · Dublin</div><div class="mk-row">${btn("Send application")}</div></div>`,
        describe: {
          a: "A Check your application page for Senior product designer, Dublin, ending with a button labeled Submit.",
          b: "A Check your application page for Senior product designer, Dublin, ending with a button labeled Send application.",
        },
        correct: "b",
        why: "“Send application” says exactly what the button does, so applicants know this is the point of no return. “Submit” is generic: it could just as well save progress or move to another step, so some people hesitate and others press it before they're ready.",
      },
      {
        id: "w2-link-text",
        type: "choice",
        question: "A help page says: “To change your billing details, click here.” What's the best fix for the link?",
        options: [
          "Make “Change your billing details” the link text",
          "Make “click here” bold so it stands out more",
          "Add an arrow icon after “click here”",
          "Replace “click here” with “Learn more”",
        ],
        correct: 0,
        why: "Link text that names the destination makes sense when people scan the page or hear a list of links, and it's a bigger target too. Bolding or adding an icon to “click here” still doesn't say where it goes, and “Learn more” has the same problem.",
      },
      {
        id: "w2-spot-vague",
        type: "spot",
        question: "Which control's label doesn't say what it does?",
        title: "Invoice INV-2041",
        parts: [
          { id: "amount", label: "Text: Amount due $1,200, due 15 October", html: `<div>Amount due <b>$1,200</b>, due 15 October</div>` },
          { id: "pay", label: "Button: Pay invoice", html: btn("Pay invoice") },
          { id: "pdf", label: "Link: Download PDF", html: `<span class="mk-link">Download PDF</span>` },
          { id: "proceed", label: "Button: Proceed", html: btn("Proceed", "sec") },
        ],
        correct: "proceed",
        why: "“Proceed” doesn't say what happens: it could send a reminder, mark the invoice as paid or open another page. A label like “Send reminder” would. “Pay invoice” and “Download PDF” both name the action and what it acts on.",
      },
    ],
  },
  {
    id: "w3",
    code: "W3",
    title: "Error messages that help people recover",
    subtitle: "Explain the problem and the way out",
    minutes: 5,
    skills: ["language", "errors"],
    body: [
      "A useful error message answers two questions: what went wrong, and what can I do about it? “Enter a date in the past” helps far more than “Invalid date”, and “Error 422” helps nobody. Be specific to the situation, show the message next to the problem, and keep what the person typed so they can fix it instead of starting again.",
      "Tone matters most when something has gone wrong. Don't blame people (“You entered an illegal value”), don't joke, and don't pile on apologies. If the problem is on your side, say so plainly, and tell people whether their work is safe and what to try next.",
    ],
    practice: [
      "Describe the problem in the person's terms, not the system's: “That card has expired”, not “Payment declined (code 54)”.",
      "Say how to fix it, with an example when the format is the issue.",
      "Avoid words like invalid, illegal, forbidden and failed.",
      "When it's your fault, own it and say what happens next: “We couldn't save your changes. Check your connection and try again.”",
    ],
    fieldExercise:
      "Ask your support team or check your logs for the five errors people hit most. Rewrite each so it says what happened and what to do next.",
    sources: [
      govuk("components/error-message", "Error message"),
      nng("error-message-guidelines", "Error-Message Guidelines"),
      understanding("error-suggestion", "Error Suggestion"),
    ],
    exercises: [
      {
        id: "w3-date-error",
        type: "compare",
        question: "Someone's leave request has a start date after the end date. Which message helps them fix it?",
        a: `<div class="mk"><div class="mk-err">Validation failed: date range invalid.</div><div class="mk-label">Start date</div><div class="mk-in err">14/11/2026</div><div class="mk-label">End date</div><div class="mk-in">10/11/2026</div></div>`,
        b: `<div class="mk"><div class="mk-label">Start date</div><div class="mk-in">14/11/2026</div><div class="mk-label">End date</div><div class="mk-err">End date must be the same as or after the start date</div><div class="mk-in err">10/11/2026</div></div>`,
        describe: {
          a: "Start date 14/11/2026 and end date 10/11/2026. A red message at the top says “Validation failed: date range invalid.” The start date field is outlined in red.",
          b: "Start date 14/11/2026 and end date 10/11/2026. Above the end date field, which is outlined in red, a message says “End date must be the same as or after the start date”.",
        },
        correct: "b",
        why: "B points to the field to change and says what a valid answer looks like, in plain words. A uses system language, sits away from the problem and highlights the start date, so people may change the wrong field and still not know what's expected.",
      },
      {
        id: "w3-server-error",
        type: "choice",
        question: "A file upload fails because your servers are down. Which message is best?",
        options: [
          "We couldn't upload your file because of a problem on our side. Your other files are safe. Try again in a few minutes.",
          "Upload failed. Please check your file and try again.",
          "Oops! Something went wrong.",
          "Error 503: Service Unavailable",
        ],
        correct: 0,
        why: "The best message admits the problem is on your side, reassures people about their work and says what to do next. “Check your file” wrongly suggests the person caused it, “Oops!” gives no details or next step, and a status code means nothing to most people.",
      },
      {
        id: "w3-spot-blame",
        type: "spot",
        question: "Which message blames the person instead of helping them?",
        title: "Create an account",
        parts: [
          { id: "email", label: "Field labeled Email address, containing priya@example.com", html: `<div class="mk-label">Email address</div><div class="mk-in">priya@example.com</div>` },
          { id: "hint", label: "Hint: Use at least 12 characters", html: `<div class="mk-label">Password</div><div class="mk-muted">Use at least 12 characters</div>` },
          { id: "error", label: "Error above the password field: You entered an illegal password.", html: `<div class="mk-err">You entered an illegal password.</div><div class="mk-in err">••••••</div>` },
          { id: "create", label: "Button: Create account", html: btn("Create account") },
        ],
        correct: "error",
        why: "“You entered an illegal password” blames the person and doesn't say what's needed. “Your password needs at least 12 characters” would tell them exactly how to fix it. The email field, the hint and the button are fine.",
      },
    ],
  },
  {
    id: "w4",
    code: "W4",
    title: "Empty states",
    subtitle: "Turn nothing into a next step",
    minutes: 4,
    skills: ["feedback", "language"],
    body: [
      "An empty state is what people see when there's nothing to show: a new account with no projects, a cleared inbox, a search with no results. It's tempting to leave these blank or write “No data”, but they're often someone's first look at a feature, and the moment they're most likely to get stuck.",
      "A helpful empty state says why it's empty and what to do next. On first use, explain what will appear here and offer the action that fills it. For a search with no results, repeat what was searched for and suggest a way forward, like checking the spelling or clearing filters. When people have finished everything, such as an empty to-do list, a short note that they're done is enough.",
    ],
    practice: [
      "Never leave a blank area or a bare “No data”.",
      "Say what will appear here and how to add the first item, with a button for it.",
      "For no results, show the search term and any active filters, and offer to clear them.",
      "Keep it short: one sentence and one action is usually enough.",
    ],
    fieldExercise:
      "Make a brand-new test account in your product and screenshot every empty screen. For each, write down what a new customer would do next.",
    sources: [nng("empty-state-interface-design", "Designing Empty States in Complex Applications"), uiWriting],
    exercises: [
      {
        id: "w4-first-project",
        type: "compare",
        question: "A new user opens the Projects page for the first time. Which screen helps them get started?",
        a: `<div class="mk"><div class="mk-title">Projects</div><div class="mk-muted">No data</div></div>`,
        b: `<div class="mk"><div class="mk-title">Projects</div><div>You don't have any projects yet.</div><div class="mk-muted">Projects keep your team's tasks, files and deadlines in one place.</div><div class="mk-row">${btn("Create a project")}</div></div>`,
        describe: {
          a: "A Projects page with the words “No data” and nothing else.",
          b: "A Projects page saying “You don't have any projects yet.”, a line explaining that projects keep a team's tasks, files and deadlines in one place, and a Create a project button.",
        },
        correct: "b",
        why: "B explains what the page is for and offers the one action that fills it, so a new user knows what to do. A's “No data” looks like an error or a page that failed to load, and leaves people guessing.",
      },
      {
        id: "w4-no-results",
        type: "choice",
        question: "A search for “invioce” in a finance app finds nothing. What should the empty state include?",
        options: [
          "The search term, a suggestion to check the spelling or try “invoice”, and a way to clear any filters",
          "A friendly illustration and the words “Nothing here!”",
          "A list of all invoices instead, without saying the search found nothing",
          "A red error message saying the search failed",
        ],
        correct: 0,
        why: "Repeating the search term helps people spot the typo, and the suggestions give them a way forward. An illustration alone doesn't help them recover, silently showing everything hides that nothing matched, and a red error suggests something broke when it didn't.",
      },
      {
        id: "w4-spot-dead-end",
        type: "spot",
        question: "Which part leaves people without a way forward?",
        title: "Support tickets",
        parts: [
          { id: "heading", label: "Heading: No tickets yet", html: `<div class="mk-title">No tickets yet</div>` },
          { id: "explain", label: "Text: Tickets your customers send to support@yourcompany.com will appear here.", html: `<div>Tickets your customers send to support@yourcompany.com will appear here.</div>` },
          { id: "status", label: "Text: Your support email isn't connected yet.", html: `<div class="mk-muted">Your support email isn't connected yet.</div>` },
          { id: "button", label: "Button: Dismiss", html: btn("Dismiss", "sec") },
        ],
        correct: "button",
        why: "The screen explains why it's empty, but the only action is Dismiss, which hides the message without fixing anything. A button such as “Connect your support email” would give people the next step. The heading and both lines of text are clear.",
      },
    ],
  },
  {
    id: "w5",
    code: "W5",
    title: "Confirmation dialogs",
    subtitle: "Ask a real question, name the real answers",
    minutes: 5,
    skills: ["errors", "language"],
    body: [
      "A confirmation dialog interrupts people to check they mean it, so save it for actions that are hard to undo, like deleting a project or sending a payment. If dialogs appear for everything, people learn to click through them without reading. For actions that can be reversed, an undo option is usually kinder.",
      "When you do ask, make the dialog stand on its own. The title should be a specific question (“Delete the Apollo website project?”), the text should say what will happen (“This removes its 214 files for everyone”), and the buttons should name the outcomes, such as “Delete project” and “Keep project”, rather than “Yes” and “No”.",
    ],
    practice: [
      "Only confirm actions that are destructive, costly or hard to undo.",
      "Name the specific thing in the title: which project, which file, how many items.",
      "Say what will happen, including anything that can't be recovered.",
      "Label buttons with the action they take, and give the destructive one a distinct style.",
    ],
    fieldExercise:
      "Find every confirmation dialog in your product. For each, ask whether it could be an undo instead. If not, check its buttons make sense without reading the rest of the dialog.",
    sources: [
      nng("confirmation-dialog", "Confirmation Dialogs Can Prevent User Errors (If Not Overused)"),
      { title: "Material Design 3: Dialogs", url: "https://m3.material.io/components/dialogs/guidelines" },
    ],
    exercises: [
      {
        id: "w5-yes-no",
        type: "compare",
        question: "Which dialog lets people answer without rereading it?",
        a: `<div class="mk"><div class="mk-title">Are you sure?</div><div class="mk-muted">This action cannot be undone.</div><div class="mk-row">${btn("No", "sec")}${btn("Yes")}</div></div>`,
        b: `<div class="mk"><div class="mk-title">Delete “Q3 budget.xlsx”?</div><div class="mk-muted">It will be removed for everyone on the team and can't be recovered.</div><div class="mk-row">${btn("Keep file", "sec")}${btn("Delete file", "danger")}</div></div>`,
        describe: {
          a: "A dialog titled “Are you sure?” with the text “This action cannot be undone.” and two buttons, No and Yes.",
          b: "A dialog titled “Delete Q3 budget.xlsx?” saying the file will be removed for everyone on the team and can't be recovered, with two buttons: Keep file, and a red Delete file.",
        },
        correct: "b",
        why: "B names the file, says what deleting it means, and labels each button with its outcome. A could be about anything, and Yes and No only make sense if you remember the question, which people skimming a dialog often don't.",
      },
      {
        id: "w5-when",
        type: "choice",
        question: "Which action most needs a confirmation dialog?",
        options: [
          "Permanently deleting a shared workspace and all its files",
          "Archiving an email that can be restored from the Archive folder",
          "Changing a filter on a dashboard",
          "Marking a task as done",
        ],
        correct: 0,
        why: "Deleting a shared workspace is permanent and affects other people, so a deliberate pause is worth it. The other actions are frequent and easy to reverse, so confirming them would slow people down and teach them to click through dialogs without reading.",
      },
      {
        id: "w5-spot-cancel",
        type: "spot",
        question: "Which part makes this dialog easy to misread?",
        title: "Cancel your subscription?",
        parts: [
          { id: "loss", label: "Text: You'll lose access to premium reports on 31 October.", html: `<div>You'll lose access to premium reports on 31 October.</div>` },
          { id: "kept", label: "Text: Your data will be kept for 90 days.", html: `<div class="mk-muted">Your data will be kept for 90 days.</div>` },
          { id: "cancel", label: "Button: Cancel", html: btn("Cancel", "sec") },
          { id: "confirm", label: "Button: Cancel subscription", html: btn("Cancel subscription", "danger") },
        ],
        correct: "cancel",
        why: "In a dialog about cancelling, a button labeled just “Cancel” is ambiguous: does it cancel the subscription or close the dialog? “Keep subscription” removes the doubt. The two lines of text and the Cancel subscription button say clearly what will happen.",
      },
    ],
  },
  {
    id: "w6",
    code: "W6",
    title: "Success and status messages",
    subtitle: "Confirm what happened and what's next",
    minutes: 5,
    skills: ["feedback"],
    body: [
      "After people act, they need to know it worked. A good success message names what happened in specific terms, like “Invoice INV-2041 sent to Northwind Supply”, rather than a bare “Success!”, so people can check it was the right thing. For bigger tasks, such as an order or an application, also say what happens next and when, and give a reference number they can quote.",
      "Match the message to the moment. A quick action needs only a brief note near where people are looking. A finished process deserves its own page. Don't celebrate routine actions, and make sure status updates reach screen reader users too, not just people who can see them appear.",
    ],
    practice: [
      "Say what happened and to what: “3 files moved to Archive”.",
      "After a multi-step task, say what happens next, when, and whether people need to do anything.",
      "Give a reference number for anything people may need to follow up on.",
      "Announce status messages to screen readers, for example with a live region, without moving focus.",
    ],
    fieldExercise:
      "Do the three most common tasks in your product. Write down the exact message you see after each, and check it says what happened and what happens next.",
    sources: [
      govuk("patterns/confirmation-pages", "Confirmation pages"),
      nng("indicators-validations-notifications", "Indicators, Validations, and Notifications"),
      understanding("status-messages", "Status Messages"),
    ],
    exercises: [
      {
        id: "w6-payment-done",
        type: "compare",
        question: "Someone has just paid their electricity bill. Which confirmation is more useful?",
        a: `<div class="mk"><div class="mk-big">Success!</div><div class="mk-row">${btn("Done")}</div></div>`,
        b: `<div class="mk"><div class="mk-title">Payment received</div><div>You paid $86.40 for your October bill.</div><div class="mk-muted">Reference: PAY-55120. We've emailed you a receipt.</div><div class="mk-row">${btn("Back to your account")}</div></div>`,
        describe: {
          a: "A screen with the word “Success!” in large text and a Done button.",
          b: "A screen titled Payment received: “You paid $86.40 for your October bill.”, the reference PAY-55120, a note that a receipt was emailed, and a Back to your account button.",
        },
        correct: "b",
        why: "B confirms the amount and which bill, gives a reference to quote if anything goes wrong, and says a receipt is on its way. A only says that something succeeded, so people can't check it was the right payment and may keep the page open as proof.",
      },
      {
        id: "w6-rename",
        type: "choice",
        question: "Someone renames a file. How should the app confirm it?",
        options: [
          "Show the new name in place, with a brief message such as “Renamed to Q3 summary.pdf”",
          "Open a full-page confirmation with a Continue button",
          "Show nothing, because renaming is a small action",
          "Send an email confirming the change",
        ],
        correct: 0,
        why: "A small, quick action needs a small, quick confirmation where people are already looking. A full page interrupts them for something trivial, showing nothing leaves them unsure it worked, and an email is out of proportion and clutters their inbox.",
      },
      {
        id: "w6-spot-generic",
        type: "spot",
        question: "Which message doesn't say what happened?",
        title: "Team members",
        parts: [
          { id: "ana", label: "Row: Ana Silva, Admin", html: `<div class="mk-row"><span>Ana Silva</span><span class="mk-pill">Admin</span></div>` },
          { id: "ben", label: "Row: Ben Okafor, Editor", html: `<div class="mk-row"><span>Ben Okafor</span><span class="mk-pill">Editor</span></div>` },
          { id: "toast", label: "Message at the bottom: Action completed successfully.", html: `<div class="mk-toast"><span>Action completed successfully.</span></div>` },
          { id: "invite", label: "Button: Invite people", html: btn("Invite people") },
        ],
        correct: "toast",
        why: "“Action completed successfully” doesn't say which action or what changed, so after a few edits people can't tell which one it means. “Ben Okafor is now an Editor” would. The member rows and the Invite people button are clear.",
      },
    ],
  },
  {
    id: "w7",
    code: "W7",
    title: "Voice and tone",
    subtitle: "One personality, adjusted to the moment",
    minutes: 5,
    skills: ["language"],
    body: [
      "Voice is your product's personality, and it stays the same everywhere: friendly and direct, say, or calm and precise. Tone is how that voice adjusts to the situation, the way you'd talk differently to a friend celebrating a new job and a friend who's just lost their wallet.",
      "Match the tone to how people feel in that moment. Finishing a milestone can be warm. Errors, payment problems and anything about security call for calm, plain, serious words, with no jokes or exclamation marks. Write down a few voice principles, with examples, so everyone on the team writes like the same product.",
    ],
    practice: [
      "Pick three or four words that describe your voice, with a do and a don't example for each.",
      "Dial playfulness down as the stakes or stress go up: errors, money, security and lost work.",
      "Avoid humor that depends on wordplay or culture. It often doesn't translate.",
      "Read new text next to existing screens to check it sounds like the same product.",
    ],
    fieldExercise:
      "Collect ten messages from different parts of your product. Do they sound like one product? Mark any that would feel wrong to someone having a bad day.",
    sources: [
      nng("tone-of-voice-dimensions", "The Four Dimensions of Tone of Voice"),
      { title: "Material Design 3: UX writing best practices", url: "https://m3.material.io/foundations/content-design/style-guide/ux-writing-best-practices" },
    ],
    exercises: [
      {
        id: "w7-locked-account",
        type: "compare",
        question: "Someone's account was locked after too many sign-in attempts. Which message has the right tone?",
        a: `<div class="mk"><div class="mk-title">Whoa there, speedy!</div><div class="mk-muted">Too many tries. Take a breather and come back later!</div></div>`,
        b: `<div class="mk"><div class="mk-title">Your account is locked for 30 minutes</div><div class="mk-muted">This happens after 5 incorrect passwords, to protect your account. You can reset your password now instead.</div><div class="mk-row">${btn("Reset password")}</div></div>`,
        describe: {
          a: "A message titled “Whoa there, speedy!” saying “Too many tries. Take a breather and come back later!”",
          b: "A message titled “Your account is locked for 30 minutes”, explaining this happens after 5 incorrect passwords to protect the account and that the password can be reset now, with a Reset password button.",
        },
        correct: "b",
        why: "A locked account is stressful and might mean someone is trying to break in, so B stays calm, explains why it happened and how long it lasts, and offers a way back in. A's jokey tone feels dismissive in that moment, and it doesn't say how long to wait or what else to do.",
      },
      {
        id: "w7-voice-vs-tone",
        type: "choice",
        question: "What's the difference between voice and tone?",
        options: [
          "Voice is the product's consistent personality; tone adapts that personality to the situation",
          "Voice is for spoken interfaces and tone is for written ones",
          "Voice is what marketing writes and tone is what designers write",
          "There's no difference: they mean the same thing",
        ],
        correct: 0,
        why: "Voice stays steady so the product feels like one thing, while tone shifts with the moment: warmer for a milestone, more serious for an error. The distinction isn't about spoken versus written text, or about which team does the writing.",
      },
      {
        id: "w7-spot-tone",
        type: "spot",
        question: "Which message's tone doesn't fit the moment?",
        title: "Billing",
        parts: [
          { id: "card", label: "Row: Visa ending 4242, expires 08/27", html: `<div class="mk-row"><span>Visa ending 4242</span><span class="mk-muted">Expires 08/27</span></div>` },
          { id: "next", label: "Text: Your next payment of $49 is due on 1 November.", html: `<div class="mk-muted">Your next payment of $49 is due on 1 November.</div>` },
          { id: "alert", label: "Alert: Your last payment bounced lol. Fix it or say bye to your files!", html: `<div class="mk-err">Your last payment bounced lol. Fix it or say bye to your files!</div>` },
          { id: "update", label: "Button: Update card", html: btn("Update card") },
        ],
        correct: "alert",
        why: "A failed payment that could cost someone their files is a serious moment, and slang plus a jokey threat feels careless and a little hostile. A calm message would say the payment didn't go through, when access would stop, and how to fix it. The card details, due date and button are fine.",
      },
    ],
  },
  {
    id: "w8",
    code: "W8",
    title: "Writing for scanning",
    subtitle: "Headings, labels and front-loaded text",
    minutes: 5,
    skills: ["language", "conventions"],
    body: [
      "People rarely read interface text word by word. They scan headings, the first words of lines and anything bold, hunting for what they need. Front-loading puts the words that carry the meaning first: “Billing: update your card” scans faster than “If you'd like to make changes to your card, go to Billing”.",
      "Headings and labels are signposts, so make them descriptive rather than clever. “Change your delivery address” helps; “Moving house?” makes people stop and decode it. And give each thing one name throughout the product: if it's a “workspace” in the menu, it shouldn't be a “team” in settings and an “organization” in emails.",
    ],
    practice: [
      "Start headings, list items and links with the words people are scanning for.",
      "Make headings describe what's below them, not tease it.",
      "Keep a short glossary of product terms and use each one consistently, including in emails.",
      "Break long text into short sections with headings, and use lists for steps and options.",
    ],
    fieldExercise:
      "On one of your help pages, read only the headings and the first two words of each line. Could someone find what they need from those alone?",
    sources: [
      nng("microcontent-how-to-write-headlines-page-titles-and-subject-lines", "Microcontent: A Few Small Words Have a Mega Impact"),
      nng("f-shaped-pattern-reading-web-content", "F-Shaped Pattern of Reading on the Web"),
      understanding("headings-and-labels", "Headings and Labels"),
    ],
    exercises: [
      {
        id: "w8-export-heading",
        type: "compare",
        question: "A settings page has a section for exporting data. Which heading helps people find it?",
        a: `<div class="mk"><div class="mk-title">Take it with you</div><div class="mk-muted">Download a copy of your projects, tasks and comments.</div></div>`,
        b: `<div class="mk"><div class="mk-title">Export your data</div><div class="mk-muted">Download a copy of your projects, tasks and comments.</div></div>`,
        describe: {
          a: "A settings section headed “Take it with you”, with the text “Download a copy of your projects, tasks and comments.”",
          b: "A settings section headed “Export your data”, with the text “Download a copy of your projects, tasks and comments.”",
        },
        correct: "b",
        why: "“Export your data” uses the words people look for when they scan settings or search help, so they find it straight away. “Take it with you” is clever, but it doesn't say what the section is, so people skimming the headings pass right by it.",
      },
      {
        id: "w8-one-name",
        type: "choice",
        question: "The menu says “Workspaces”, the settings page says “Teams”, and invitation emails say “Organizations”, all for the same thing. What's the main problem?",
        options: [
          "People wonder whether these are three different things, and help searches for one term miss the others",
          "The words are too long to fit in the menu",
          "Nothing, as long as each page is consistent within itself",
          "Only the email needs fixing, because it's outside the app",
        ],
        correct: 0,
        why: "Different names suggest different things, so people hesitate, look for features that don't exist, and can't find help written with another term. Picking one name and using it everywhere, emails included, fixes it. Length isn't the issue, and consistency within each page isn't enough.",
      },
      {
        id: "w8-spot-buried",
        type: "spot",
        question: "Which help topic hides its key words at the end?",
        title: "Help topics",
        parts: [
          { id: "reset", label: "Link: Reset your password", html: `<span class="mk-link">Reset your password</span>` },
          { id: "email", label: "Link: Change your email address", html: `<span class="mk-link">Change your email address</span>` },
          { id: "transfer", label: "Link: In some situations, such as when you've changed jobs, you may want to transfer ownership", html: `<span class="mk-link">In some situations, such as when you've changed jobs, you may want to transfer ownership</span>` },
          { id: "invoices", label: "Link: Download invoices", html: `<span class="mk-link">Download invoices</span>` },
        ],
        correct: "transfer",
        why: "People scanning a list read the first few words of each item, and this one starts with “In some situations”, so the important words, “transfer ownership”, come last. “Transfer ownership of your account” would scan like the others, which all lead with the action.",
      },
    ],
  },
];

export const uxWritingPath: LearningPath = {
  id: "ux-writing",
  title: "UX writing and microcopy",
  description: "Plain words, button labels, error messages, empty states, confirmations, success messages, tone and scannable text.",
  status: "live",
  lessons,
};
