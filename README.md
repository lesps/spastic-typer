# spastic-typer

A personality assessment and comparison tool for Enneagram, MBTI, and Instinct Stack typing.

## Features

### Guided Typer
Structured quizzes across three systems:
- **Enneagram** — 27 questions scoring all 9 types + adaptive branching when top results are close + 9 instinct drive questions. Returns core type, wing, wing strength, and instinct stack (e.g. `4w5 SX/SP/SO`).
- **MBTI** — 20 binary-choice questions across four dimensions. Returns a 4-letter type with full cognitive function stack breakdown.
- **Instinct Stack** — 9 focused questions to rank your SP, SX, and SO drives independently.

Complete all three to unlock your **Share Link** and **Export** button. The share link encodes your full profile into a URL that can be loaded directly into the Compare tab.

### Compare
Pairwise and group dynamics analysis for 2–6 people. Load profiles via:
- Paste a share URL
- Upload a `.json` backup exported from the Typer
- Manual entry (Enneagram type/wing/strength, instinct stack, MBTI)

Shows Enneagram interaction dynamics, wing dynamics, instinct stack compatibility, and MBTI cognitive function overlap. Supports group overview insights when 3+ people are loaded.

### Function Explorer
Reference tool for the 8 Jungian cognitive functions (Ne, Ni, Se, Si, Te, Ti, Fe, Fi) and all 16 MBTI types with their full cognitive stacks.

### Mental Model
A quadrant map of all 16 MBTI types and a 4-step typing methodology (SOP) with common pitfalls.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Inline CSS via JS objects (custom gold/dark theme) |
| Routing | None — single-page view switching via state |
| Data | Static JS files in `src/data/` (~7 000-line pair lookup table) |
| Persistence | `localStorage` (keys: `typer_enn`, `typer_mbti`, `typer_inst`) |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
cd frontend
npm install
npm run dev        # starts Vite dev server at http://localhost:5173/spastic-typer/
```

## Running Tests

```bash
cd frontend
npm test           # run all tests once
npm run test:watch # run in watch mode during development
```

Tests live in `frontend/src/test/` and cover:
- **navigation.test.jsx** — bottom nav tab switching
- **guided-typer.test.jsx** — choose screen, quiz start flows, share/export gating
- **compare-page.test.jsx** — editor tabs, instinct stack reorder, manual entry save

## Building for Production

```bash
cd frontend
npm run build      # outputs to frontend/dist/
npm run preview    # preview the production build locally
```

The app is configured for deployment to GitHub Pages under the `/spastic-typer/` base path (set in `vite.config.js`).

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                   # Root component, view switcher
│   ├── views/
│   │   ├── GuidedTyper.jsx       # Quiz flows + choose screen
│   │   ├── ComparePage.jsx       # Profile comparison
│   │   ├── Explorer.jsx          # Cognitive function reference
│   │   └── MentalModel.jsx       # Quadrant map + SOP
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── ExportModal.jsx
│   │   ├── FnBadge.jsx
│   │   ├── LikertScale.jsx
│   │   └── ProgressBar.jsx
│   ├── data/
│   │   ├── enneagram.js          # Type definitions, questions, disambig
│   │   ├── mbti.js               # MBTI types + questions
│   │   ├── cognitive.js          # Cognitive function definitions
│   │   ├── pairLookup.js         # Pre-computed pair dynamics (~7 000 lines)
│   │   └── sop.js                # Typing methodology
│   ├── styles/
│   │   ├── theme.js              # Color tokens (gold/dark palette)
│   │   └── styles.js             # Reusable style objects
│   ├── utils/
│   │   ├── enneagram.js          # Wing strength, dynamics helpers
│   │   ├── mbti.js               # MBTI utilities
│   │   ├── export.js             # Markdown generation, JSON download
│   │   └── group.js              # Group-level insight analysis
│   └── test/
│       ├── setup.js
│       ├── navigation.test.jsx
│       ├── guided-typer.test.jsx
│       └── compare-page.test.jsx
└── vite.config.js
```
