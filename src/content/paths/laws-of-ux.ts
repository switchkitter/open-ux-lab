import type { Lesson, LearningPath, Source } from "../types";

// Laws of UX and NN/g are summarize-and-link only: all text and examples here are original.
const lawsOfUx = (slug: string, title: string): Source => ({ title: `Laws of UX: ${title}`, url: `https://lawsofux.com/${slug}/` });
const nng = (path: string, title: string): Source => ({ title: `NN/g: ${title}`, url: `https://www.nngroup.com/${path}/` });

const lessons: Lesson[] = [
  {
    id: "l1",
    code: "L1",
    title: "Jakob's Law",
    subtitle: "People expect your product to work like the ones they already use",
    minutes: 4,
    body: [
      "People spend most of their time in other products, not yours. Every site and app they use teaches them where the cart lives, what a magnifying glass means and how a date field behaves. When your product follows those habits, people can use what they already know. When it breaks them, they have to learn something new just to get started.",
      "This doesn't mean copying competitors pixel for pixel. Follow conventions for the basics people rely on, such as navigation, search, forms and checkout, and save your originality for places where it really helps the task. If you must change a familiar pattern, make the new one easy to discover, and give people time to adjust.",
    ],
    practice: [
      "Put common elements where people look for them, such as search at the top and the account menu in the top corner.",
      "Use standard icons for their standard meanings, and don't give a familiar icon a new job.",
      "Before replacing a familiar pattern, test the new one with people who know the old one.",
      "When a redesign changes something people use daily, let them try the new version before it becomes the only one.",
    ],
    fieldExercise:
      "Compare your product's header, search and account menu with three tools your users use every day. Note every place where yours puts a common element somewhere unexpected.",
    sources: [lawsOfUx("jakobs-law", "Jakob's Law"), nng("videos/jakobs-law-internet-ux", "Jakob's Law of Internet User Experience (video)")],
    exercises: [
      {
        id: "l1-cart-location",
        type: "compare",
        question: "An online office supplies store. In which design will shoppers find their cart faster?",
        a: `<div class="mk"><div class="mk-row"><b>Deskly</b><span class="mk-in">Search products</span><span class="mk-link">Account</span><span class="mk-link">Cart (3)</span></div><div class="mk-muted">Paper · Ink and toner · Desk accessories</div></div>`,
        b: `<div class="mk"><div class="mk-row"><b>Deskly</b><span class="mk-in">Search products</span><span class="mk-link">Account</span></div><div class="mk-muted">Paper · Ink and toner · Desk accessories</div><div class="mk-muted">My order list (3 items) is in the left sidebar under Categories</div></div>`,
        correct: "a",
        why: "A puts the cart in the header and calls it a cart, like almost every online store. B renames it and moves it into a sidebar, so shoppers who learned the convention elsewhere have to hunt for it, and some will think their items are gone.",
      },
      {
        id: "l1-new-pattern",
        type: "choice",
        question: "Your team wants to replace the standard checkbox filters in your app with a new drag-to-sort control because it looks more modern. What does Jakob's Law suggest?",
        options: [
          "Ship it, because novelty makes the product memorable",
          "Keep the familiar pattern unless the new one solves a real problem, and test any change with existing users",
          "Ship it with a tutorial overlay the first time people see it",
          "Let each team choose its own filter pattern",
        ],
        correct: 1,
        why: "People already know how checkbox filters work from other products, so a replacement has to be worth the learning it demands. A tutorial overlay admits the new control isn't self-explanatory and is often dismissed unread, and letting each team choose breaks consistency inside your own product.",
      },
    ],
  },
  {
    id: "l2",
    code: "L2",
    title: "Fitts's Law",
    subtitle: "Big and close is easy to hit",
    minutes: 4,
    body: [
      "The time it takes to point at something depends on how far away it is and how big it is. A large button near where your pointer or thumb already is takes a moment to hit. A small link across the screen takes longer and is easier to miss.",
      "This shapes where actions go and how big they are. Put the main action close to the content it acts on, make frequent targets large, and give small controls a clickable area bigger than their visible size. The same law works in reverse: a destructive action that's harder to hit by accident is often a good thing.",
    ],
    practice: [
      "Make primary and frequent actions large. Where it makes sense, make the whole row or card clickable.",
      "Place actions next to what they act on, such as the submit button right after the last field.",
      "Keep destructive actions away from frequent ones, so speed doesn't turn into mistakes.",
      "On phones, put frequent actions where a thumb can reach them easily.",
    ],
    fieldExercise:
      "Pick the most frequent action in your product. Measure its target size and how far it is from where people are looking just before they use it.",
    sources: [lawsOfUx("fittss-law", "Fitts's Law"), nng("articles/fitts-law", "Fitts's Law and Its Applications in UX")],
    exercises: [
      {
        id: "l2-row-target",
        type: "compare",
        question: "In an expense list, people open a row to see its details dozens of times a day. Which design makes that easier?",
        a: `<div class="mk"><div class="mk-row"><span>Taxi to airport · $46.20</span><span class="mk-link">View</span></div><div class="mk-row"><span>Team lunch · $128.00</span><span class="mk-link">View</span></div><div class="mk-row"><span>Hotel, 2 nights · $389.00</span><span class="mk-link">View</span></div></div>`,
        b: `<div class="mk"><div class="mk-cell">Taxi to airport · $46.20 ›</div><div class="mk-cell">Team lunch · $128.00 ›</div><div class="mk-cell">Hotel, 2 nights · $389.00 ›</div><div class="mk-muted">The whole row opens the expense</div></div>`,
        correct: "b",
        why: "In B the whole row is the target, so it's large and already under the pointer wherever people are reading. A makes them move to a small View link for every row, which is slower and easier to miss.",
      },
      {
        id: "l2-destructive",
        type: "choice",
        question: "A dialog has “Delete project” and “Cancel” buttons. People rarely mean to delete a project. How should Fitts's Law shape the design?",
        options: [
          "Make Delete the biggest, most prominent button so people can find it",
          "Make Cancel the easy, prominent target, and keep Delete clearly labeled but less prominent",
          "Make both buttons tiny so nobody clicks either by accident",
          "Put Delete in a screen corner, where it's fastest to reach",
        ],
        correct: 1,
        why: "Fitts's Law tells you how to make a target easy to hit, so it also tells you how to make one a little harder. The safe, common choice should be the easy target, and the destructive one should be findable but not where a quick click lands. Tiny buttons slow everyone down, and a corner makes Delete faster to hit by accident.",
      },
    ],
  },
  {
    id: "l3",
    code: "L3",
    title: "Hick's Law",
    subtitle: "More choices, slower decisions",
    minutes: 4,
    body: [
      "The more options people have, and the harder they are to tell apart, the longer it takes to choose. Each extra option adds a little time, and a screen full of similar choices can stall people completely, or lead them to choose nothing at all.",
      "Hick's Law applies most to simple choices among options people understand, such as picking from a menu. The fix is not always fewer options; often it's fewer options at once. Recommend a choice, group options into categories, and show advanced settings only when people ask for them.",
    ],
    practice: [
      "Remove options people rarely choose, or move them behind a “More options” step.",
      "Recommend a default or the most popular choice when one fits most people.",
      "Split long lists into categories people recognize.",
      "Don't oversimplify: hiding an option people need costs them more time than showing it.",
    ],
    fieldExercise:
      "Count the choices on your product's main screen that compete for the first click. Mark which ones most people actually use.",
    sources: [
      lawsOfUx("hicks-law", "Hick's Law"),
      lawsOfUx("choice-overload", "Choice Overload"),
      nng("articles/simplicity-vs-choice", "Simplicity Wins over Abundance of Choice"),
    ],
    exercises: [
      {
        id: "l3-plan-picker",
        type: "compare",
        question: "A team chat app shows its pricing plans. Which helps people choose faster?",
        a: `<div class="mk"><div class="mk-grid"><div class="mk-cell"><b>Starter</b>$4</div><div class="mk-cell"><b>Basic</b>$6</div><div class="mk-cell"><b>Plus</b>$8</div><div class="mk-cell"><b>Pro</b>$10</div><div class="mk-cell"><b>Business</b>$13</div><div class="mk-cell"><b>Business+</b>$15</div></div><div class="mk-muted">Per person per month</div></div>`,
        b: `<div class="mk"><div class="mk-grid"><div class="mk-cell"><b>Free</b>Up to 10 people</div><div class="mk-cell"><b>Team</b>$8 per person <span class="mk-pill">Most popular</span></div><div class="mk-cell"><b>Enterprise</b>Talk to sales</div></div></div>`,
        correct: "b",
        why: "B offers three clearly different plans and marks the one most teams pick, so people can decide quickly. A's six plans differ in small ways that are hard to compare, so people take longer, second-guess themselves or leave to think about it.",
      },
      {
        id: "l3-export-settings",
        type: "choice",
        question: "A photo editor's export dialog shows 25 settings at once. Most people only ever change the file format. What's the best fix?",
        options: [
          "Remove every setting except file format",
          "Show file format with a sensible default, and put the other settings behind “More options”",
          "Sort the 25 settings alphabetically",
          "Split the settings across five tabs of five settings each",
        ],
        correct: 1,
        why: "Showing only the setting most people change makes the common case quick, and the rest stay one click away for people who need them. Removing them hurts experts, sorting doesn't reduce the number of decisions, and tabs spread the same 25 choices out and add navigation on top.",
      },
    ],
  },
  {
    id: "l4",
    code: "L4",
    title: "Miller's Law and chunking",
    subtitle: "Memory is small, so group things",
    minutes: 5,
    body: [
      "In 1956, the psychologist George Miller observed that people can hold about seven items, give or take two, in short-term memory. Later research suggests the real limit is nearer four meaningful chunks. Either way, working memory is small, and everything people must remember while using your product takes up some of it.",
      "The number is often misused to claim menus should have at most seven items. Menus stay on screen, so people don't need to remember them. The useful lesson is chunking: grouping information into meaningful units. A phone number split into groups, or a long form split into sections, is far easier to read, check and remember than one long unbroken run.",
    ],
    practice: [
      "Show long numbers and codes in groups: 4111 1111 1111 1111, not 4111111111111111.",
      "Don't make people carry information from one screen to the next. Show it where they need it.",
      "Break long content into short sections with clear headings.",
      "Don't cut a useful menu to seven items just because of the number.",
    ],
    fieldExercise:
      "Find a place in your product where people must copy or remember a code, number or setting from one screen to use on another. Sketch how you could show it where it's needed instead.",
    sources: [
      lawsOfUx("millers-law", "Miller's Law"),
      lawsOfUx("chunking", "Chunking"),
      nng("articles/short-term-memory-and-web-usability", "Short-Term Memory and Web Usability"),
      nng("articles/chunking", "How Chunking Helps Content Processing"),
    ],
    exercises: [
      {
        id: "l4-reference-code",
        type: "compare",
        question: "A customer has to read their booking reference to a support agent over the phone. Which version is easier?",
        a: `<div class="mk"><div class="mk-label">Your booking reference</div><div class="mk-big">QX7 K2M 9PL</div></div>`,
        b: `<div class="mk"><div class="mk-label">Your booking reference</div><div class="mk-big">QX7K2M9PL</div></div>`,
        correct: "a",
        why: "In A the reference is split into three chunks of three, so it's easy to read aloud, hold in mind and check. In B the same nine characters run together, so people lose their place and mix characters up.",
      },
      {
        id: "l4-menu-myth",
        type: "choice",
        question: "A reviewer says your app's 11-item side navigation breaks Miller's Law and must be cut to 7. What's the best response?",
        options: [
          "Agree, and remove the four least-used items",
          "Explain that a visible menu doesn't rely on memory, then check that the items are clearly named and sensibly grouped",
          "Split it into two menus of five and six items",
          "Hide the navigation behind a menu icon so it doesn't count",
        ],
        correct: 1,
        why: "People recognize items in a visible menu rather than remembering them, so Miller's number doesn't set a limit. What matters is whether the menu is easy to scan: clear names and sensible groups. Cutting useful items, splitting the menu arbitrarily or hiding it all make navigation harder.",
      },
    ],
  },
  {
    id: "l5",
    code: "L5",
    title: "Proximity and common region",
    subtitle: "Grouping without words",
    minutes: 4,
    body: [
      "People see things that sit close together as related, and things inside the same boundary as a group. These two principles from Gestalt psychology, proximity and common region, are among the strongest tools in layout: they tell people what belongs with what before they read a word.",
      "They also cause many layout bugs. A label sitting halfway between two fields is ambiguous, and a button placed nearer the wrong section seems to belong to it. Spacing is information, not decoration, so make the space between groups clearly larger than the space within them.",
    ],
    practice: [
      "Keep each label closer to its own field than to the field above it.",
      "Use more space between groups than inside them, so the grouping is obvious.",
      "Use cards or background panels to group related content, but don't box every element.",
      "Place actions next to the content they affect.",
    ],
    fieldExercise:
      "Blur a screenshot of one of your product's screens, or squint at it. Write down the groups you see, then check that they match what actually belongs together.",
    sources: [
      lawsOfUx("law-of-proximity", "Law of Proximity"),
      lawsOfUx("law-of-common-region", "Law of Common Region"),
      nng("articles/gestalt-proximity", "Proximity Principle in Visual Design"),
      nng("articles/common-region", "The Principle of Common Region"),
    ],
    exercises: [
      {
        id: "l5-label-spacing",
        type: "compare",
        question: "Which form makes it clearer which label belongs to which field?",
        a: `<div class="mk" style="gap:14px"><div class="mk-label">Street address</div><div class="mk-in">&nbsp;</div><div class="mk-label">City</div><div class="mk-in">&nbsp;</div><div class="mk-label">Postal code</div><div class="mk-in">&nbsp;</div></div>`,
        b: `<div class="mk" style="gap:16px"><div style="display:grid;gap:3px"><div class="mk-label">Street address</div><div class="mk-in">&nbsp;</div></div><div style="display:grid;gap:3px"><div class="mk-label">City</div><div class="mk-in">&nbsp;</div></div><div style="display:grid;gap:3px"><div class="mk-label">Postal code</div><div class="mk-in">&nbsp;</div></div></div>`,
        correct: "b",
        why: "In B each label sits tight against its own field, with more space before the next pair, so each pair reads as one unit. In A every gap is the same, so each label floats halfway between two fields and people have to work out which one it describes.",
      },
      {
        id: "l5-save-placement",
        type: "choice",
        question: "A settings page has two sections, Profile and Notifications, each with its own fields. One Save button sits in the space between them. What's the problem?",
        options: [
          "The button should be a different color",
          "Its position makes it unclear which section it saves. Put a Save button inside each section, or one at the end that clearly saves everything",
          "Save buttons should always be at the top of the page",
          "There's no problem, as long as it saves both sections",
        ],
        correct: 1,
        why: "Because the button sits between the two groups, people can't tell which one it belongs to, and some will leave changes unsaved. Putting it inside the section it acts on, or clearly at the end of everything, makes the relationship obvious. A new color doesn't fix an unclear relationship, and saving both only helps if people can tell that it does.",
      },
    ],
  },
  {
    id: "l6",
    code: "L6",
    title: "The Von Restorff effect",
    subtitle: "What stands out gets noticed",
    minutes: 4,
    body: [
      "When one item looks different from everything around it, people notice it and remember it. That's why a single highlighted plan on a pricing page, or one bold button at the end of a form, draws the eye.",
      "The effect only works when the difference is rare. If everything is bold, colorful or moving, nothing stands out and the page just feels noisy. The difference also shouldn't rely on color alone: people who can't see the color need another cue, such as a label, size or position.",
    ],
    practice: [
      "Give each screen one primary action that looks different from everything else.",
      "Highlight sparingly. If more than one or two things are emphasized, nothing is.",
      "Pair color with another cue, such as a label, an icon or heavier text.",
      "Avoid motion for emphasis unless it's essential, and respect people's reduced-motion settings.",
    ],
    fieldExercise:
      "Show a colleague a screenshot of one screen for five seconds and ask what they noticed first. Check whether that's what you want people to do first.",
    sources: [
      lawsOfUx("von-restorff-effect", "Von Restorff Effect"),
      { title: "WCAG 2.2 Understanding: Use of Color", url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" },
    ],
    exercises: [
      {
        id: "l6-primary-action",
        type: "compare",
        question: "An article editor has three actions. Which version makes the main next step clearest?",
        a: `<div class="mk"><div class="mk-title">Quarterly update: new office opening</div><div class="mk-muted">Last saved 2 minutes ago</div><div class="mk-row"><span class="mk-btn sec">Save draft</span><span class="mk-btn sec">Preview</span><span class="mk-btn">Publish</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">Quarterly update: new office opening</div><div class="mk-muted">Last saved 2 minutes ago</div><div class="mk-row"><span class="mk-btn">Save draft</span><span class="mk-btn">Preview</span><span class="mk-btn">Publish</span></div></div>`,
        correct: "a",
        why: "In A one button stands out, so people see the main action at a glance while the others stay available. In B all three compete equally, so people have to read and weigh each one, and the most important action gets no help.",
      },
      {
        id: "l6-too-many-highlights",
        type: "choice",
        question: "A dashboard shows 12 cards, and the team made 8 of them red with “!” badges to get attention. What's most likely to happen?",
        options: [
          "People will pay attention to all 8 cards",
          "The highlights cancel each other out, and the one truly urgent card gets lost",
          "People will feel well informed",
          "Nothing, except for people with color blindness",
        ],
        correct: 1,
        why: "Emphasis works by contrast with what's around it. When most cards shout, none of them stands out, and people learn to ignore the red. Keep the strong treatment for the few items that need action now.",
      },
    ],
  },
  {
    id: "l7",
    code: "L7",
    title: "The peak-end rule",
    subtitle: "People remember the high points and the ending",
    minutes: 4,
    body: [
      "People don't judge an experience by averaging every moment. They remember it mostly by its most intense point, good or bad, and by how it ended. A smooth checkout with a confusing error on the last step can be remembered as a bad experience, even though most of it went well.",
      "For design, this means finding the moments that matter most and making them great, and fixing the worst moments first, because bad peaks stay with people longest. Endings deserve special care: a clear confirmation, a sense of having finished, and an obvious next step.",
    ],
    practice: [
      "Map the journey and mark its high and low points, using research or support tickets.",
      "Fix the most frustrating moment before polishing the average ones.",
      "End every flow with a confirmation that says what happened and what comes next.",
      "Add moments of delight only where they don't slow people down.",
    ],
    fieldExercise:
      "Read the last screen of three key flows in your product. For each one, note whether it confirms what happened and offers a clear next step.",
    sources: [lawsOfUx("peak-end-rule", "Peak-End Rule"), nng("articles/peak-end-rule", "The Peak–End Rule: How Impressions Become Memories")],
    exercises: [
      {
        id: "l7-confirmation",
        type: "compare",
        question: "The last screen after someone books a car service. Which ending leaves a better impression?",
        a: `<div class="mk"><div class="mk-title">Request submitted.</div><div class="mk-row"><span class="mk-btn">OK</span></div></div>`,
        b: `<div class="mk"><div class="mk-title">You're booked for Tuesday 14 October at 9:00 AM</div><div>Northside Auto, 21 Mill Road</div><div class="mk-muted">We've emailed your confirmation. You can change or cancel up to 24 hours before.</div><div class="mk-row"><span class="mk-btn">Add to calendar</span><span class="mk-btn sec">View booking</span></div></div>`,
        correct: "b",
        why: "B confirms exactly what was booked, says what happens next and offers useful next steps, so the experience ends on a confident note. A leaves people unsure whether the booking worked and what to do now, and that doubt colors their memory of the whole flow.",
      },
      {
        id: "l7-fix-the-low",
        type: "choice",
        question: "Research shows most of your onboarding goes well, but connecting a bank account fails for 1 in 5 people and is very frustrating. You have time for one improvement. Which should it be?",
        options: [
          "Add a celebration animation at the end of onboarding",
          "Fix the bank connection step",
          "Polish the illustrations on the welcome screen",
          "Shorten the terms and conditions",
        ],
        correct: 1,
        why: "The failing bank connection is the low point people will remember and judge the whole product by. A nicer ending or prettier welcome screen can't make up for a moment where one in five people gets stuck.",
      },
    ],
  },
  {
    id: "l8",
    code: "L8",
    title: "Tesler's Law",
    subtitle: "Complexity has to live somewhere",
    minutes: 4,
    body: [
      "Every task has some complexity that can't be removed: a payment needs an amount and a recipient, a flight search needs a destination and a date. Larry Tesler argued that the real question is who deals with that complexity: the people using the product, or the people building it.",
      "Good design moves as much of it as possible onto the system, with sensible defaults, automatic formatting and information the product already knows. But it doesn't pretend complexity away. Oversimplifying can hide what people need to make a decision, which just moves the complexity somewhere worse.",
    ],
    practice: [
      "Fill in what the system already knows, such as location, currency or recent choices.",
      "Accept input in any reasonable format and clean it up yourself.",
      "Choose defaults that suit most people, and make them easy to change.",
      "Don't hide essential details, such as fees or terms, to make a screen look simpler.",
    ],
    fieldExercise:
      "Pick one form and mark every field the system could fill in or work out itself. Estimate how much typing that would save the people who use it.",
    sources: [lawsOfUx("teslers-law", "Tesler's Law"), nng("videos/teslers-law", "Tesler's Law: Shift Complexity to Simplify UX (video)")],
    exercises: [
      {
        id: "l8-currency",
        type: "compare",
        question: "A travel expense form for a company based in Ireland. An employee paid for a taxi in London. Which design handles the complexity better?",
        a: `<div class="mk"><div class="mk-row"><span><span class="mk-label">Amount</span><span class="mk-in" style="display:block;width:6em">84.50</span></span><span><span class="mk-label">Currency</span><span class="mk-in" style="display:block">GBP ▾</span></span></div><div class="mk-muted">€99.12 at the rate on 3 October 2026. Converted for you.</div></div>`,
        b: `<div class="mk"><div class="mk-row"><span><span class="mk-label">Amount</span><span class="mk-in" style="display:block;width:6em">84.50</span></span><span><span class="mk-label">Currency</span><span class="mk-in" style="display:block">GBP ▾</span></span></div><div class="mk-label">Exchange rate to EUR</div><div class="mk-in">&nbsp;</div><div class="mk-muted">Look up the rate on the date of purchase.</div></div>`,
        correct: "a",
        why: "In A the system does the currency conversion, which it can do reliably, and shows the result so people can check it. B pushes the same unavoidable work onto every employee, who must find the right rate and type it in, with plenty of room for mistakes.",
      },
      {
        id: "l8-hidden-fees",
        type: "choice",
        question: "To make checkout look simpler, a team wants to hide shipping costs until the final confirmation step. What does Tesler's Law suggest?",
        options: [
          "Good idea, because fewer numbers mean less complexity",
          "Shipping cost is part of the decision, so show it early and simplify the screen in other ways",
          "Hide it, but add a tooltip saying shipping is extra",
          "Show it only to people who ask about it",
        ],
        correct: 1,
        why: "Hiding the cost doesn't remove the complexity; it moves it to the last step, where it surprises people and makes them abandon their carts. Simplify what can be simplified, but keep essential information visible. A tooltip or an on-request answer still hides it from most people.",
      },
    ],
  },
];

export const lawsOfUxPath: LearningPath = {
  id: "laws-of-ux",
  title: "Laws of UX",
  description: "Jakob's, Fitts's, Hick's and Miller's laws, Gestalt grouping and other psychology principles.",
  status: "live",
  lessons,
};
