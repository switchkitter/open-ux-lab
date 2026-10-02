# Open UX Lab

Free UX practice: short lessons, then exercises where you pick the better design and see why. Built from trusted public sources, with original writing and art.

Includes four learning paths (usability heuristics, accessibility, form design and Laws of UX), spaced review, a skill map, optional cross-device sync, and an installable app that works offline.

## Getting started

Requires Node.js 20 or newer.

Live site: https://openuxlab.com

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm test` | Run unit and content tests |
| `npm run typecheck` | Check types |
| `npm run build` | Production build into `dist/` |

## Adding content

Lessons live in `src/content/paths/`. Read `CONTENT_GUIDELINES.md` before writing a lesson, then run `npm test` to check it.

## Working with Claude Code

`CLAUDE.md` describes the project, its rules and conventions. Claude Code reads it automatically when you start a session in this folder.

## License

- Code: [MIT](LICENSE)
- Lesson content in `src/content/`: [CC BY 4.0](LICENSE-CONTENT). Credit "Open UX Lab" with a link to this repository.

Linked sources (W3C, GOV.UK, USWDS, NN/g and others) stay under their owners' terms. The in-app **Sources and credits** page (`#/credits`) lists every source, license, font and library.
