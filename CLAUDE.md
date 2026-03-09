# CLAUDE.md — spastic-typer

Comprehensive guide for AI assistants working on this codebase.

---

## Project Overview

**spastic-typer** is a personality assessment and comparison web app covering three systems:

- **Enneagram** — 9 core types with wings, wing strength, and instinct stacks (SP/SX/SO)
- **MBTI** — 16 types using 7-point Likert scales and cognitive function stacks
- **Instinct Stack** — standalone SP/SX/SO drive ordering assessment

Users complete adaptive quizzes, get detailed profiles, and can analyze compatibility/dynamics between 2–6 people on the Compare page.

**Deployed to:** GitHub Pages at `/spastic-typer/`
**Stack:** React 18 + Vite 6 + Vitest. No router, no UI library, no backend.

---

## Repository Layout

```
spastic-typer/
├── frontend/               # All application code lives here
│   ├── src/
│   │   ├── main.jsx        # React entry point
│   │   ├── App.jsx         # View switcher (no router — state-based)
│   │   ├── components/     # Small reusable UI pieces
│   │   ├── views/          # Page-level components (~2,100 LOC)
│   │   ├── data/           # Static reference data & pre-computed lookups
│   │   ├── utils/          # Pure business-logic helpers
│   │   ├── styles/         # Theme tokens and reusable style objects
│   │   └── test/           # Vitest + React Testing Library test suites
│   ├── vite.config.js
│   └── package.json
├── scripts/
│   └── generatePairs.mjs   # One-off script — regenerates pairLookup.js
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages CI/CD
└── CLAUDE.md               # This file
```

---

## Key Files

### Views (`src/views/`)

| File | LOC | Purpose |
|------|-----|---------|
| `GuidedTyper.jsx` | ~785 | All three quiz flows + choose screen + share/export |
| `ComparePage.jsx` | ~607 | Pairwise & group dynamics analysis |
| `Explorer.jsx` | ~334 | Reference tool for cognitive functions and MBTI types |
| `MentalModel.jsx` | ~406 | Quadrant maps, enneagram circle, typing methodology SOP |

### Components (`src/components/`)

| File | Purpose |
|------|---------|
| `BottomNav.jsx` | Four-tab navigation (Typer / Compare / Explore / Model) |
| `LikertScale.jsx` | 7-point scale widget (−3 to +3) used in all quizzes |
| `ProgressBar.jsx` | Thin quiz progress indicator |
| `FnBadge.jsx` | Color-coded cognitive function badge (Ne, Ni, Se…) |
| `ExportModal.jsx` | JSON / Markdown profile export dialog |

### Data (`src/data/`)

| File | LOC | Contents |
|------|-----|----------|
| `enneagram.js` | 195 | `ENN_TYPES`, `ENN_BANK` (45 q), `INSTINCT_BANK` (15 q), `WING_DESC`, `ENN_ARROWS`, `ENN_CENTER`, `ENN_HARMONIC`, `INSTINCT_COMPAT` |
| `mbti.js` | 64 | `MBTI_BANK` (32 q), `MBTI_TYPES` (16 entries with cognitive stacks) |
| `cognitive.js` | 10 | `COG_FUNCTIONS` — 8 Jungian functions with color, desc, strengths, shadow |
| `pairLookup.js` | ~6,973 | Pre-computed `ENN_DYNAMICS`, `MBTI_INSIGHTS`, `INSTINCT_STACK_DYNAMICS` for all type pairs. **Do not hand-edit** — regenerate via `scripts/generatePairs.mjs` |
| `sop.js` | 33 | `SOP_STEPS` (typing methodology), `QUADRANTS` (MBTI 4-quadrant grid) |

### Utils (`src/utils/`)

| File | Key exports |
|------|-------------|
| `enneagram.js` | `computeWingStrengthDelta`, `wingStrengthLabel`, `getWingDynamics`, `getInstinctStackInteraction`, `getEnnInteraction` |
| `mbti.js` | `getMBTIInteraction`, `getMBTITips` |
| `export.js` | `generateExportMarkdown` (full profile report + AI context notes) |
| `archetype.js` | `computeArchetypeName` (Enneagram + MBTI combo name) |
| `group.js` | `analyzeGroup` (patterns for 3+ people) |

### Styles (`src/styles/`)

- `theme.js` — exports `G` (color tokens) and `FC` (cognitive function colors), plus global CSS string injected at startup
- `styles.js` — reusable style objects (card, button, badge, etc.)

**Always use `G.*` and `FC.*` tokens. Never hardcode hex values.**

---

## Development Workflow

### Setup

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173/spastic-typer/
```

### Commands

```bash
npm test             # Run full test suite once (Vitest)
npm run test:watch   # Watch mode — re-runs on file save
npm run build        # Production build → frontend/dist/
npm run preview      # Preview production build locally
```

### Deployment

Push to `master` or `main` → GitHub Actions builds and deploys to GitHub Pages automatically.

---

## Test-Driven Development

### Philosophy

This project uses TDD as its primary quality gate. **Write or update tests before (or alongside) code changes.** The test suite covers:

1. **Unit tests** — pure scoring logic, no React (`scoring.test.js`)
2. **Integration tests** — rendered component flows (`guided-typer.test.jsx`, `compare-page.test.jsx`, `navigation.test.jsx`)

### Test File Locations

All tests live in `frontend/src/test/`:

| File | What it covers |
|------|---------------|
| `scoring.test.js` | All three scoring algorithms, `buildFairSequence`, `shuffleArray`, question bank data integrity. ~140 individual `it()` assertions. |
| `guided-typer.test.jsx` | Quiz flows (start, advance, adaptive exit, disambiguation), choose screen state, share/export gating, localStorage persistence, retake behavior |
| `compare-page.test.jsx` | Editor tabs, URL/file/manual entry, instinct reordering, save button |
| `navigation.test.jsx` | Bottom nav tab switching |

### Exported Test Helpers (from `GuidedTyper.jsx`)

These pure functions are exported specifically for unit testing — keep them exported:

```js
scoreMBTI(answers, seq)          // → { result, scores }
scoreEnneagram(answers, seq, branchAnswers, branchKey)  // → { coreType, wing, scores, display }
scoreInstinct(answers, seq)      // → { instinctStack, instScores }
buildFairSequence(bank, keyFn)   // → shuffled question array, one per category per round
shuffleArray(arr)                // in-place Fisher-Yates, returns same array
isMBTIDimConfident(dim, answers, seq, currentIdx)
allMBTIDimsConfident(answers, seq, currentIdx)
isEnnConfident(answers, seq, currentIdx)
isInstConfident(answers, seq, currentIdx)
```

### TDD Rules

- **Before adding/changing quiz logic:** write a failing test in `scoring.test.js` that asserts the expected scoring behavior, then make it pass.
- **Before changing UI flows:** write a failing test in the relevant `*.test.jsx` file using React Testing Library, then make it pass.
- **Bug regressions:** every bug fix must be accompanied by a test that would have caught it. See the "scale calibration (bug regression)" suite in `scoring.test.js` as the canonical example.
- **Data integrity:** if you modify `ENN_BANK`, `MBTI_BANK`, or `INSTINCT_BANK`, the data integrity test suites at the bottom of `scoring.test.js` will catch structural issues automatically.
- **Run tests before committing:** `npm test` must pass with zero failures.

### Test Output

Run `npm test` from inside `frontend/`. Expected output format:

```
 ✓ src/test/scoring.test.js (XX tests)
 ✓ src/test/guided-typer.test.jsx (XX tests)
 ✓ src/test/compare-page.test.jsx (XX tests)
 ✓ src/test/navigation.test.jsx (XX tests)

 Test Files  4 passed (4)
 Tests       XX passed (XX)
```

A failing test suite blocks merging. Fix the root cause — do not skip or suppress tests.

### Writing New Tests

Follow these conventions:

```js
// scoring.test.js — pure unit, no React
import { describe, it, expect } from 'vitest';

describe('featureName — description of scenario', () => {
  it('does X when Y', () => {
    // Arrange
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const answers = mbtiAnswersAll(seq, 3);
    // Act
    const { result } = scoreMBTI(answers, seq);
    // Assert
    expect(result[0]).toBe('E');
  });
});
```

```jsx
// *.test.jsx — React Testing Library
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => localStorage.clear());

it('shows X after doing Y', async () => {
  render(<ComponentUnderTest />);
  fireEvent.click(screen.getByRole('button', { name: /label/i }));
  expect(screen.getByText(/expected text/i)).toBeInTheDocument();
});
```

Use `vi.useFakeTimers()` / `vi.useRealTimers()` in `beforeEach`/`afterEach` for any test that triggers the quiz's 150–200ms answer-advance delay.

---

## Core Conventions

### No Router

App.jsx holds a `view` state string. Navigation is done by calling `setView('compare')` etc. Do not add React Router.

### Styling

All CSS is inline via JavaScript objects. Never add a `.css` file or a UI library.

```js
// Good
<div style={{ background: G.bg2, color: G.text, border: `1px solid ${G.goldBorder}` }}>

// Bad
<div className="card">
```

Reusable patterns belong in `src/styles/styles.js`. One-off local styles stay inline in the component.

### localStorage Keys

| Key | Contents |
|-----|----------|
| `typer_enn` | `{ coreType, wing, wingStrengthDelta, instinctStack, display, scores }` |
| `typer_mbti` | `{ result, scores }` |
| `typer_inst` | `{ instinctStack, instScores }` |

Always parse with `JSON.parse(localStorage.getItem(key))` and guard for `null`.

### Share URL Format

Profile data is encoded as a URL hash fragment:

```
#p1=4w5:strong:sx/sp/so:INFP&p2=8w9:moderate:sp/so/sx:ENTJ
```

Parsing/encoding logic lives in `ComparePage.jsx`.

### Pre-computed Pair Data

`pairLookup.js` is machine-generated. To update it:

```bash
node scripts/generatePairs.mjs
```

Do not hand-edit this file. Changes to dynamics logic go in `scripts/generatePairs.mjs` first, then regenerate.

### Question Banks

Each bank has a fixed structure enforced by tests:

| Bank | Questions | Groups | Per group |
|------|-----------|--------|-----------|
| `MBTI_BANK` | 32 | 4 dims (EI/SN/TF/JP) | 8 each |
| `ENN_BANK` | 45 | 9 types | 5 each |
| `INSTINCT_BANK` | 15 | 3 instincts (sp/sx/so) | 5 each |

All pole values must be consistent (MBTI: `'E'/'S'/'T'/'J'`; Enneagram: `1`; Instinct: implicit from `inst` field). Run `npm test` after any bank changes.

### Adaptive Quiz Logic

Both MBTI and Enneagram quizzes use early-exit confidence checks:

- `isMBTIDimConfident`: requires ≥2 answers for the dim and `|rawSum|/count ≥ 1.5`
- `allMBTIDimsConfident`: all 4 dims confident
- `isEnnConfident`: requires ≥2 answers per type and gap between top-2 types exceeds threshold
- `isInstConfident`: requires ≥2 answers per instinct and both adjacent gaps exceed threshold

**Do not lower thresholds** without a corresponding regression test showing that result accuracy is preserved.

---

## Architecture Notes

### View Switching

```
App.jsx
  └─ BottomNav (setView callback)
  └─ {view === 'typer'}   → <GuidedTyper />
  └─ {view === 'compare'} → <ComparePage />
  └─ {view === 'explore'} → <Explorer />
  └─ {view === 'model'}   → <MentalModel />
```

### Data Flow in GuidedTyper

```
Quiz card click
  → sets quizMode ('enn' | 'mbti' | 'inst')
  → buildFairSequence(bank, keyFn) creates shuffled question sequence
  → user answers stored in answers{} map: { questionIndex: value }
  → on each answer: confidence check → either advance or show result
  → on result: scoreXxx() → write to localStorage → return to choose screen
```

### Data Flow in ComparePage

```
Entry method (URL hash | file upload | manual form)
  → parse to profiles[] array
  → for each pair: getEnnInteraction() + getMBTIInteraction() + getInstinctStackInteraction()
  → render dynamics cards per pair
  → if 3+ profiles: analyzeGroup()
```

---

## Common Pitfalls

- **Don't hardcode question counts.** Use `buildFairSequence` and let the bank size determine the count.
- **Don't skip `localStorage.clear()` in test `beforeEach`.** Tests that read localStorage state can bleed into each other.
- **Don't remove exported scoring functions** from `GuidedTyper.jsx` — `scoring.test.js` imports them directly.
- **Mobile safe areas.** The app targets mobile-first. Use `env(safe-area-inset-*)` in padding/margin for bottom-nav-adjacent elements.
- **Wing wrap-around.** Type 1's wings are 9 and 2; type 9's wings are 8 and 1. See the wing wrap tests in `scoring.test.js`.
- **Disambiguation.** When top-2 Enneagram types are within threshold after bank exhaustion, a `branchKey` (e.g. `'4-5'`) triggers additional clarifying questions. This path is covered in tests — preserve it.

---

## Adding a Feature — Checklist

1. **Write a failing test** that describes the expected behavior.
2. Implement the feature.
3. Run `npm test` — all tests green.
4. If you touched a question bank, verify data integrity tests still pass.
5. If you added a new exported function from `GuidedTyper.jsx`, add a corresponding unit test in `scoring.test.js`.
6. Commit with a clear message describing the change.
