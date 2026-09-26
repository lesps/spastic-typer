# CLAUDE.md — spastic-typer

Comprehensive guide for AI assistants working on this codebase.

---

## Project Overview

**spastic-typer** is a personality assessment and comparison web app covering three systems:

- **Enneagram** — 9 core types with wings, wing strength, and instinct stacks (SP/SX/SO)
- **MBTI** — 16 types using 7-point Likert scales and cognitive function stacks
- **Instinct Stack** — standalone SP/SX/SO drive ordering assessment

Users complete adaptive quizzes, get detailed profiles, analyze compatibility/dynamics between 2–6 people on the Compare page, and explore the eight-position stack model (positions, couplings, and how colonization changes each function's purpose) on the Stack page. Four top-level views: Typer, Explorer, Compare, Stack.

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
│   │   ├── views/          # Page-level components (~3,900 LOC)
│   │   ├── data/           # Static reference data & pre-computed lookups
│   │   ├── utils/          # Pure business-logic helpers
│   │   ├── styles/         # Theme tokens and reusable style objects
│   │   └── test/           # Vitest + React Testing Library test suites
│   ├── vite.config.js
│   └── package.json
├── scripts/
│   ├── generatePairs.mjs       # Regenerates pairLookup.js
│   ├── generateCombinations.mjs # Regenerates combinationProfiles.js
│   └── splitCombinations.mjs    # Splits it into data/combinations/*.js for lazy loading
├── docs/
│   ├── specs/              # Owner-supplied feature specs, checked in verbatim (stack-view.md)
│   └── plans/              # Session-by-session implementation plans (stack-view-sessions.md)
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages CI/CD
├── CHANGELOG.md            # Versioned release history
├── README.md               # Public-facing project documentation
└── CLAUDE.md               # This file
```

---

## Key Files

### Views (`src/views/`)

| File | LOC | Purpose |
|------|-----|---------|
| `GuidedTyper.jsx` | ~1,375 | All three quiz flows + choose screen + share/export; links into Explorer and Stack |
| `ComparePage.jsx` | ~1,185 | Pairwise & group dynamics analysis; receives `setView` for its Stack links |
| `Explorer.jsx` | ~860 | Reference tool: Enneagram, MBTI (quadrant grid, position reference, typing SOP), Instinct, Integration |
| `CombinedProfile.jsx` | ~315 | Integrated profile from all three saved results; rendered by `GuidedTyper` in its `combined` phase |
| `StackView.jsx` | ~440 | Stack page: type selector, `StackDiagram`, colonization scrubber (levels 1–9) with narration, More expander, falsifier, capture kind and the equilibrium caveat, purpose panel (native vs. captured, plus role and both pairings), Replay, personalization from saved results, Counter threat-output form. Two tabs: **Model** (diagram, scrubber, purposes, Anchor drift, Gamble, utility) and **Reading** (renders `StackReading`). Reads `#/stack?type=…&level=…` on mount **and on `hashchange`**. |

### Components (`src/components/`)

| File | Purpose |
|------|---------|
| `AppNav.jsx` | Primary navigation (Typer / Explorer / Compare / Stack). Bottom tab bar on phones, top bar from 681px. Writes the view into the URL hash. |
| `StackReading.jsx` | The Reading tab of the Stack view: coaching bands (highlighted against the current level), diagnostic table, the three activations, predicted typing errors, clinical sequence, failure modes, and the test set. Takes `level`. |
| `StackDiagram.jsx` | Inline-SVG diagram of the 8 positions and 8 couplings (4 nested, 3 corruption, 1 structural gate). Nodes/edges are `role="button"`, keyboard-activatable, and expose `data-pos`, `data-edge`, `data-fn`, `data-captured`, `data-just-captured`, `data-active`, `data-selected` for tests. Geometry comes from `stackLayout()` in `utils/stack.js`. |
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
| `shadow.js` | ~140 | `POSITIONS` (identity only: pos, name, arc), `CROSSING_MATRIX`, `STACK_INVERSION_NARRATIVE` — 8-position naming and the unified comparison algorithm. What a position *does* lives in `ROLES` in `stack.js`. |
| `levels.js` | ~300 | `LEVELS[ennType].{healthy,average,unhealthy}` — Riso-Hudson tier `range`, `title`, `description`, `behaviors` per Enneagram type |
| `stack.js` | ~745 | Stack view content, sourced verbatim from `SOURCE_DOCS`: `MECHANISM`, `STAGE_BANDS`, `STAGES`, `CAPTURE_ORDER` (level → position, capture kind, transition sharpness, Riso-Hudson name and band), `CLASSIFICATION` (Augusta), `ROLES`, `NESTED_PAIRS` / `DOMAIN_PAIRS` / `PAIR_NOTES`, `PURPOSES`, `LEVEL_NARRATION` (text / more / falsifier), `EQUILIBRIUM_CAVEAT`, `CORRESPONDENCE_NOTE`, `COUNTER_THREAT_OUTPUT`, `EDGES`, `ACTIVE_EDGES`, `LABEL_TEMPLATES`; **modulators** `UTILITY` / `UTILITY_DIAGNOSTIC` / `UTILITY_ANCHORS`, `THRESHOLDS`, `GAMBLE_PROPERTIES`, `ODD_EVEN`, `STRESS_EVENTS`; **personalization** `FIXATION` (Appendix C), `SUBSTRATE`, `GROWTH_MECHANISM`; **reading** `COACHING_BANDS`, `DIAGNOSTIC`, `ACTIVATIONS`, `TYPING_ERRORS`, `CLINICAL_SEQUENCE`, `FAILURE_MODES`, `TEST_SET`. Strings only; guarded by the provenance and deny-list tests. |
| Others | — | `combinationProfiles.js` + `combinations/`, `crossRules.js`, `ennBase.js`, `ennMbtiCorrelation.js`, `groupArchetypes.js`, `instModifiers.js`, `instinctPairDynamics.js`, `instinctStackProfiles.js`, `integrationNarratives.js`, `mbtiDetails.js`, `mbtiDevelopment.js`, `mbtiModifiers.js`, `mbtiStressFlow.js`, `subtypes.js`, `typeInteractionGrid.js` — reference content for Explorer, Compare, and the combined profile |

### Utils (`src/utils/`)

| File | Key exports |
|------|-------------|
| `enneagram.js` | `computeWingStrengthDelta`, `wingStrengthLabel`, `getWingDynamics`, `getInstinctStackInteraction`, `getEnnInteraction` |
| `mbti.js` | `getMBTIInteraction`, `getMBTITips` |
| `export.js` | `generateExportMarkdown` (full profile report + AI context notes) |
| `archetype.js` | `computeArchetypeName` (Enneagram + MBTI combo name) |
| `group.js` | `analyzeGroup` (patterns for 3+ people) |
| `shadow.js` | `flipAttitude`, `getShadowStack`, `getFullStack`, `getShadowType`, `getStackInverse`, `getPositionCrossings` |
| `route.js` | `parseHash`, `buildHash`, `VIEWS` (`typer`, `explorer`, `compare`, `stack`), `DEFAULT_VIEW` — URL-hash ↔ view mapping (accepts legacy `#p1=…` links; `#/model` → Explorer) |
| `stack.js` | `captureState(level)`, `capturedAt`, `captureLevelOf`, `isCaptured`, `tierForLevel`, `stageForLevel`, `sealedStages`, `nestedPartner`, `domainPartner`, `substrateFor`, `fixationFor`, `growthPathFor`, `fillTemplate`, `positionLabel(pos, level?)`, `fnAtPositionLabel`, `parseStackQuery`, `readSavedTypes`, `counterThreatOutput`, `stackLayout()`, `bezierPoint`, `MIN_LEVEL` / `MAX_LEVEL` — pure Stack-view logic and diagram geometry |
| `compare.js`, `share.js` | Compare-page analyses (`getCognitiveHarmony`, …) and profile-code encode/decode |
| `scroll.js` | `scrollToTop`, `useScrollToTop(...deps)` — resets scroll when a view, tab, or detail selection changes |

### Styles (`src/styles/`)

- `theme.js` — exports `G` (base + semantic color tokens: `success`, `warn`, `danger`, `dangerSoft`, `info`, `infoSoft`, `plum`, `amber`, `indigo`, `overlay`, `bgHover`), `FC` (cognitive function colors), `CENTER` (gut/heart/head), `SYSTEM` (enneagram/mbti/instinct accents), `POS` (8-position stack colors), and the helpers `hexToRgb(hex)` / `alpha(hex, a)` for translucent variants. Also the global CSS string injected at startup — the only place breakpoint-dependent rules and keyframes live (`.nav-*` layout, `.qpage` quiz centering, `--nav-pad-*` variables, `.person-bar` sticky rule, `.intro-chev`, the `stack-pulse` keyframe). The `prefers-reduced-motion` block disables both transitions and animations.
- `styles.js` — reusable style objects (card, button, badge, etc.)

**Always use `G.*`, `FC.*`, `CENTER.*`, `SYSTEM.*`, `POS[n]` tokens; use `alpha(token, a)` instead of a literal `rgba(...)`. Never hardcode hex or rgba values** — `theme.test.js` scans every view and component and fails on any literal.

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
| `guided-typer.test.jsx` | Quiz flows (start, advance, adaptive exit, disambiguation), choose screen state, combined-profile phase, share/export gating, localStorage persistence, retake behavior |
| `compare-page.test.jsx` | Editor tabs, URL/file/manual entry, instinct reordering, save button, share links, sticky person bar, expand/collapse all pairs |
| `navigation.test.jsx` | Nav landmark and labels, `aria-current`, hash routing (boot from hash, legacy share links, hashchange), scroll reset |
| `route.test.js` | `parseHash` / `buildHash`, legacy view aliases |
| `explorer.test.jsx` | MBTI quadrant grid, typing SOP toggle, type detail open/back, collapsible tab intros |
| `theme.test.js` | `hexToRgb` / `alpha`, semantic tokens present, and a lint-style guard that no view or component contains a hex or rgba literal |
| `shadow.test.js` | Shadow stack derivation, position definitions, crossing algorithm, structural invariants, and the per-type shadow briefs (every function a brief names belongs to that type's stack; no retired claims about Flood, Gamble, Counter or Critic) |
| `stack-data.test.js` | **Provenance** (every prose string is a verbatim substring of a source document, and a paraphrase of a real sentence fails), `data/stack.js` integrity (capture order, capture kinds, transition profile, Riso-Hudson names, stages, roles, both pairings, purposes, narration, edge kinds and endpoints, active edges), level ≠ position labelling, and the **terminology deny-list** including the two deliberate narrowings |
| `stack-logic.test.js` | Table-driven `captureState` across levels 1–9 (cumulative, strictly nested, empty at 1), `captureLevelOf`, stage helpers, nested/domain partners, templating, `parseStackQuery`, `readSavedTypes`, `counterThreatOutput`, and `stackLayout` geometry invariants (no edge crosses a node body; no two edge labels collide) |
| `stack-reading.test.jsx` | Model/Reading tab switching, coaching bands tracking the scrubber (including level 6 being the Reality-testing stage but the Maintenance band), diagnostic rows, activations, clinical sequence, failure modes, the test set |
| `stack-view.test.jsx` | Stack page: type selection and deep links (on mount **and** on `hashchange`), diagram `data-` state per level, scrubber label/caveat/narration/More/falsifier/capture kind, tap and keyboard selection, purpose panel inert/active and both pairings, Replay with fake timers and reduced motion, personalization (fixation + substrate) and malformed storage, the utility selector, both Anchor thresholds, Gamble's three properties, the odd/even tag |
| `cognitive-harmony.test.js`, `group.test.js`, `group-analysis.test.js` | Compare-page analyses: `getCognitiveHarmony`, `analyzeGroup`, distribution helpers |
| `combinations.test.js`, `subtypes.test.js` | Combined-profile loading and subtype data integrity |
| `growth-direction.test.js` | `growthPathFor` across every type × wing × MBTI × instinct stack; that the direction comes from the fixation, is wing-invariant, names the Gamble function and the first instinct's substrate; that nothing stores what is derivable; and that no growth copy is instruction-shaped |
| `combined-growth.test.jsx` | The combined profile renders the derived growth path and varies it by stack and instinct; the repressed instinct stays separate from the growth direction |

### Exported Test Helpers (from `GuidedTyper.jsx`)

These pure functions are exported specifically for unit testing — keep them exported:

```js
scoreMBTI(answers, seq)          // → { result, scores }  (seq may include MBTI_DISAMBIG questions with direction: -1)
scoreEnneagram(answers, seq, branchAnswers, branchKey)  // → { coreType, wing, scores, display }
scoreInstinct(answers, seq, disambigAnswers?, disambigSeq?)  // → { instinctStack, instScores }
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
 ✓ src/test/stack-view.test.jsx (XX tests)
 …

 Test Files  16 passed (16)
 Tests       XXX passed (XXX)
```

The full run takes a couple of minutes; the quiz-flow suites in `guided-typer.test.jsx` are the slow part.

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

### Position Naming

The 8-function stack uses a custom naming system: Lead, Anchor, Refuge, Hunger (ego arc 1–4) and Counter, Critic, Gamble, Flood (shadow arc 5–8). Never use Beebe model terminology (Opposing Personality, Critical Parent, Trickster, Demon) in UI copy or code comments.

`POSITIONS` in `data/shadow.js` holds the names and arcs. Its `brief` strings predate the consolidated document and are **not** aligned with it — Stack surfaces use `ROLES` from `data/stack.js` instead, which is sourced. Do not reach for `brief` in new Stack work.

**Two pairings, kept distinct.** Confusing them is the most common contamination error, so both are data (`NESTED_PAIRS`, `DOMAIN_PAIRS` in `data/stack.js`; `nestedPartner`, `domainPartner` in `utils/stack.js`):

| Pairing | Positions | What it is |
|---|---|---|
| **Nested** | 1–8, 2–7, 3–6, 4–5 | Dependency coupling. Each shadow position reads its nested partner's output. The colonization sequence runs on these. "Mirror partner" means nested partner. |
| **Domain** | 1–5, 2–6, 3–7, 4–8 | Same base function in opposing attitudes. One territory, two access profiles. Colonization must capture both members to seal a domain. |

**"Mirror" is reserved for the nested partner.** The type whose ego stack *is* another type's shadow stack is the **stack inverse** (`getStackInverse`, `STACK_INVERSION_NARRATIVE`, Compare's "Full Stack Inversion"). Calling that a mirror is the domain/nested confusion above.

**"Growth" has exactly one meaning.** The growth direction is the experience Counter's threat output says will not arrive (`FIXATION[type].falsifies`, Appendix C). It is set by the fixation alone, cannot be self-performed, and is registered rather than produced. Nothing else in the app may use the word:

- `growthPathFor(ennType, wing, mbtiType, instStack)` in `utils/stack.js` composes the per-cell text from three sourced axes — the fixation, the function at Gamble (registration channel), and the first instinct (substrate pressure). **It is derived, never stored.** `combinationProfiles.js` deliberately has no `growthPath` field: storing it meant 1,728 copies of 216 distinct strings and a second place to drift.
- Wing does not change the direction. The source calls wing the angular precision of a point on the circle, not a separate variable, so both wings of a type share one `growthSummary` in `ennBase.js` (18 entries, 9 distinct).
- The least-attended instinct is `underdeveloped` in `instinctStackProfiles.js`, not `growth`. It is the app's own instinctual-variant layer; the source says nothing about developing a repressed instinct, so it is not presented as a growth path.

**Two stress events, not one.** `STRESS_EVENTS` keeps them apart: Hunger Reaching at moderate stress is the inferior grip; Flood forced-primary at extreme stress is the background channel becoming the only input. Same domain pair, different events. Copy describing one must say which.

### Stack Terminology Guard

The Stack view's content model is **`docs/specs/ct-consolidated.md`** (The Cognitive Thumbprint, September 2026). It supersedes the May 2026 CT Minimum Viable Framework in full, including most of `docs/specs/stack-view.md`; where the two disagree, the consolidated document is correct. Where it is silent, the content does not exist — do not fill gaps by inference.

The mechanism is **adjacency corruption**: a shadow position's corrupted output becomes an ego position's input, and sustained corrupted input recalibrates the receiver. Each ego position corrupts its nested partner; each shadow position corrupts the ego position one step *outward* from its nested partner, which is why the sequence runs 4, 5, 3, 6, 2, 7, 1, 8 and closes at Flood. **Critic write-back is one instance of that rule, not the whole mechanism** — "write-back" names the Critic→Anchor edge only.

**Provenance is mechanical, not advisory.** Every prose string in `data/stack.js` must be a verbatim substring of a document listed in `SOURCE_DOCS`. `stack-data.test.js` normalises markdown emphasis and cross-references out of both sides and then asserts containment; it does not touch wording or punctuation, so a paraphrase fails. Consequences:

- Store multi-sentence content as **arrays of individually verifiable sentences**; the view joins them. Do not merge two source sentences into one string.
- **Never add or remove punctuation** to make a fragment read better. Several strings end without a period because the source table cell does.
- Selecting a subset of sentences is allowed. Editing one is not.
- `LABEL_TEMPLATES` and `SOURCE_DOCS` are the only exempt exports, and a test asserts that list is exactly those two, so a new export forces a provenance decision.

The deny-list in the same file fails on exile / substituting / goes offline / firewall / kamikaze / conversion window / maintenance ceiling / ego block / unimprovable, and on Beebe terms. **Two patterns are deliberately narrower than they look, and must stay that way:** `goes offline` rather than `offline`, because the source writes "Lead offline" for Flood forced-primary under extreme stress, which is a different claim from the retired one about a corrupted Anchor; and `opposing personality` rather than `opposing`, because that is Beebe's term while the source says "opposing attitude" throughout. A test pins both narrowings with the wording they exist to permit.

**Level ≠ position.** Riso-Hudson levels (1–9) and stack positions (1–8) collide (Critic is position 6, captured at level 5; Anchor is position 2, captured at level 6). Any surface showing both must label them — use `positionLabel(pos, level)` (`Position 6 · Critic · captured at Level 5`).

### No Router

App.jsx holds a `view` state string that mirrors the URL hash (`#/typer`, `#/explorer`, `#/compare?p1=…`, `#/stack?type=ENFP&level=5`; the retired `#/model` resolves to Explorer). Navigation is done by calling `setView('compare')` etc.; `setView(view, query?)` writes the hash (with the optional query for deep links) and a `hashchange` listener keeps `view` in sync, so browser back/forward, refresh, and shared links all resolve to the right view. Parsing lives in `utils/route.js`; each view reads its own query (`ComparePage` decodes people, `StackView` uses `parseStackQuery`). Do not add React Router.

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

Profile data is encoded as the query part of the Compare view's hash:

```
#/compare?p1=4w5:strong:sx/sp/so:INFP&p2=8w9:moderate:sp/so/sx:ENTJ
```

Legacy links without the view prefix (`#p1=…&p2=…`) still route to Compare. Person encoding/decoding lives in `ComparePage.jsx`; view/query splitting lives in `utils/route.js`.

### Generated Combination Data

`combinationProfiles.js` and `data/combinations/*.js` are both machine-generated and hold the same 1,728 profiles — the monolith and its lazy-loaded per-wing split. Regenerate both, in order, after changing `ennBase.js`, the modifiers, or the cross rules:

```bash
node scripts/generateCombinations.mjs
node scripts/splitCombinations.mjs
```

The wing files were previously checked in as "auto-generated" with no generator in the repo, so they could not be kept in step; `splitCombinations.mjs` is that missing generator. Do not hand-edit either store.

`CombinedProfile.jsx` still imports the 5 MB monolith statically while `GuidedTyper.jsx` lazy-loads the split — so the split does not currently save anything on the main bundle. Untouched here, but worth fixing.

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
App.jsx  (view ⇄ window.location.hash via utils/route.js)
  └─ <main>
       {view === 'typer'}    → <GuidedTyper />
       {view === 'explorer'} → <Explorer />
       {view === 'compare'}  → <ComparePage setView />
       {view === 'stack'}    → <StackView />
  └─ AppNav (setView callback; aria-current marks the active tab)
```

Every view calls `useScrollToTop(...)` on its own tab/selection state so detail pages open at the top.

`GuidedTyper` owns a `combined` phase that renders `CombinedProfile` (the integrated write-up of all three saved results). There is no separate "Model" view: the MBTI quadrant grid and the 4-step typing SOP live in Explorer's MBTI tab.

### Data Flow in StackView

```
mount → parseStackQuery(hash query) ?? readSavedTypes().mbti ?? positions-only
  → type → getFullStack(type) puts a function on every node
  → level (range input, Replay interval, ?level=, or a later hashchange) → captureState(level)
       → StackDiagram tints captured nodes, pulses justCaptured, lights activeEdges
       → narration + more + falsifier + capture kind + stage band + caveat;
         personalized: LEVELS[enn][tierForLevel(level)]
  → selected node/edge → purpose panel (PURPOSES[pos] native + captured, captured inert until captureLevelOf(pos))
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
- **Mobile safe areas.** The app targets mobile-first. Use `env(safe-area-inset-*)` in padding/margin for nav-adjacent elements. Page padding that clears the nav comes from the `--nav-pad-top` / `--nav-pad-bottom` CSS variables (set in `theme.js`), which flip when the nav moves to the top at 681px — do not hardcode nav clearance.
- **`window.scrollTo` in tests.** jsdom does not implement scrolling; `src/test/setup.js` stubs it with `vi.fn()`. Call `window.scrollTo.mockClear()` before asserting on it.
- **`window.matchMedia` in tests.** jsdom does not implement it. Code that checks `prefers-reduced-motion` must guard for its absence (see `prefersReducedMotion()` in `StackView.jsx`); tests that need it mock `window.matchMedia` and restore it afterwards.
- **Stack diagram tests assert `data-` attributes, not styles.** Query `[data-pos]`, `[data-edge]`, `data-captured`, `data-active`, `data-selected` on the SVG groups.
- **Stack prose is not editable.** Adding a sentence to `data/stack.js` means finding it in a source document first. If it is not there, it does not exist yet — ask rather than writing it. Smoothing punctuation or merging two sentences into one string both fail the provenance test.
- **Per-type content generated across all 16 stacks must be scoped per type.** The shadow briefs in `mbtiDetails.js` are generated by applying the source's per-position account to each type's stack. A generator that matches `shadow7: { function: 'Te'` globally will overwrite every type sharing that function at that position. `shadow.test.js` asserts every function a brief names belongs to that type's stack; keep it.
- **Prose strings must carry exactly the punctuation the source gives them.** Truncating a sentence just before its period makes joined sentences run together on the page; adding a period to a string the JSX already punctuates shows a double stop. Fix by extending or trimming the *selection*, never by editing wording. `stack-data.test.js` asserts both directions.
- **New edges need a `ROUTES` entry and non-colliding label coordinates.** The eight edges share a narrow channel between the two columns; two geometry tests guard it, one for node bodies and one for label legibility. Verify in a browser as well — the label collision that shipped in 1.6.0 passed every test that existed at the time.
- **`guided-typer.test.jsx` is flaky, and it is almost certainly not your change.** The quiz builds its sequence with unseeded `shuffleArray`, so question order differs per run and the adaptive confidence check exits at different points. Between three and six Enneagram-flow tests fail per run, mostly on the 15s timeout. Reproducible on a clean checkout several commits back. Re-run before assuming a change caused it.

  Seeding `Math.random` in the suite does make it deterministic — and then it fails *every* run, because some tests assume the quiz does not exit early and the adaptive exit legitimately fires before question 2. So the real defect is in the tests' assumptions, not only in the ordering. Fixing it means reworking those assertions to tolerate an early exit, plus a longer timeout for the flows that walk all 70 questions (the file takes ~3 minutes). Do not paper over it by hunting for a seed that happens to pass.
- **Nav tests select by `data-view`.** Tab labels also appear as page headings, so tests find nav buttons via `button[data-view="…"]` inside the `Primary` navigation landmark rather than by text.
- **Wing wrap-around.** Type 1's wings are 9 and 2; type 9's wings are 8 and 1. See the wing wrap tests in `scoring.test.js`.
- **Disambiguation.** When top-2 Enneagram types are within threshold after bank exhaustion, a `branchKey` (e.g. `'4-5'`) triggers additional clarifying questions. This path is covered in tests — preserve it.
- **Instinct disambig pair key format.** `INSTINCT_DISAMBIG` keys are always in canonical order: `'sp-so'`, `'sp-sx'`, `'so-sx'`. Each disambig question has a `favors` field and an `opponent` field (added at sequence-creation time from the pair key). Do not hand-edit this structure.
- **MBTI disambig direction field.** `MBTI_DISAMBIG` questions that favor the negative pole (I/N/F/P) carry `direction: -1`. Both `scoreMBTI` and `isMBTIDimConfident` multiply the raw answer by `q.direction ?? 1`. Omitting `direction` on existing bank questions is safe — they default to 1. Do not remove the `direction` field from disambiguation questions.

---

## Adding a Feature — Checklist

1. **Write a failing test** that describes the expected behavior.
2. Implement the feature.
3. Run `npm test` — all tests green.
4. If you touched a question bank, verify data integrity tests still pass.
5. If you added a new exported function from `GuidedTyper.jsx`, add a corresponding unit test in `scoring.test.js`.
6. Commit with a clear message describing the change.
7. **Update `CHANGELOG.md`** with the change under the current `[X.Y]` section.
8. **If the change affects the public interface, architecture, or conventions**, update `README.md` and/or `CLAUDE.md` accordingly.

---

## Documentation Maintenance

Three files must be kept in sync with the codebase at all times:

| File | Purpose |
|------|---------|
| `README.md` | Public-facing project documentation for developers and users |
| `CHANGELOG.md` | Versioned release history with progressive compression |
| `CLAUDE.md` | AI assistant guide and authoritative codebase reference (this file) |

### When to update `README.md`

- A new feature, view, or component is added or removed
- The tech stack, deployment target, or live URL changes
- The project structure changes (new directories, renamed files, etc.)
- Development commands change

### When to update `CHANGELOG.md`

Every merged PR that changes user-facing behavior or developer-facing APIs must add an entry. Follow the **progressive compression** rules:

- **Same Y (patch releases):** add a bullet under the current `[X.Y]` block listing the change
- **Y increments (new minor release):** compress the previous `[X.Y]` patch list into a single summary line, then open a new `[X.Y+1]` section
- **X increments (new major release):** compress all prior `[X.Y]` summaries into a `[X.x]` block, then open `[X+1.0]`

Version numbering guidance:
- **Patch (Z):** bug fixes, test additions, copy/style tweaks that don't add or remove behavior
- **Minor (Y):** new features, new views/components, significant refactors, new tooling
- **Major (X):** breaking changes, major architectural overhauls, stack replacements

### Known documentation and content drift

None. As of 3.1.0 every growth string in the app is composed from the source document rather than authored, so there is nothing left on this list. If something lands here again, record what is stale and what would be needed to fix it, rather than leaving it to be rediscovered.

### When to update `CLAUDE.md`

- A new exported function is added to `GuidedTyper.jsx` — update the Exported Test Helpers table
- A new data file, util, component, or view is added — update the relevant Key Files table
- A new `localStorage` key is introduced — update the localStorage Keys table
- A new convention is established — add to Core Conventions
- A new common pitfall is discovered — add to Common Pitfalls
- The TDD checklist or test file list changes
