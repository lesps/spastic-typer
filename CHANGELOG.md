# Changelog

All notable changes are documented here. Follows [progressive compression versioning](#versioning-rules).

---

## Versioning Rules

Format: `X.Y.Z` (Major.Minor.Patch)

- **Patch (Z):** bug fixes, test additions, copy/style tweaks that don't add or remove behavior
- **Minor (Y):** new features, views, components, significant refactors, new tooling
- **Major (X):** breaking changes, major architectural overhauls, stack replacements

**Progressive compression:** While Y is unchanged, maintain a list of individual Z entries. When Y increments, compress all Z entries for the old minor into a single summary line. When X increments, compress all Y summaries into a block.

---

## [1.3]

### 1.3.0 — 2026-03-22

- Added 8-position naming system (Lead, Anchor, Refuge, Hunger, Counter, Critic, Gamble, Flood) replacing Beebe/Jungian terminology
- Added shadow stack derivation utilities (`getShadowStack`, `getShadowMirror`, `getPositionCrossings`)
- Added unified position-crossing algorithm for MBTI comparison (ego↔ego, ego↔shadow, shadow↔shadow)
- Explorer: ego positions renamed from DOM/AUX/TER/INF to Lead/Anchor/Refuge/Hunger, shadow section expanded with position names and templates, position reference section added
- MentalModel: shadow stack insights added to type detail view
- ComparePage: position-crossing flags added to pairwise MBTI comparison, Full Shadow Pair callout for mirror types
- Rewrote all 64 shadow function descriptions in `mbtiDetails.js` to use new position naming and experiential tone

### 1.3.6 — 2026-03-26

- Fix: MBTI tip Person A/B direction bug — 54 of 120 different-type tip pairs were swapped, telling each person about their own type instead of the other person's. Root cause: `generatePairs.mjs` called `getMBTITips(t1, t2)` in insertion order but stored results under alphabetically-sorted keys. Fixed by passing types in canonical key order (`canonA, canonB`).
- Fix: Instinct stack tip direction bug — 6 of 9 pairs with Person A/B labels were swapped for the same reason. Fixed by deriving `canonA`/`canonB` from sorted `keyParts` before calling `getInstinctStackInteraction`.
- Fix: Grammar error in `getEnnTips()` — `"They need to feel " + desire.replace('to ', '')` produced malformed strings like "They need to feel be good and have integrity". Fixed to `"They need " + desire` (e.g. "They need to be good and have integrity").
- Regenerated `pairLookup.js` with all three fixes applied.

### 1.3.5 — 2026-03-25

- Improved: Compare page consolidates "Instinct Stack Dynamics" and "Instinct Depth Analysis" into a single "Instinct Dynamics" section. The merged section preserves all unique content: chemistry tag and tips (from runtime analysis), dominant narrative with attraction/friction boxes, stack alignment note and secondary match notes (from pairLookup), secondary bridge, and shared blind spot. Eliminates duplicate coverage of dominant pairing and blind spot concepts that previously appeared at two different scroll positions.

### 1.3.4 — 2026-03-25

- Improved: `getCognitiveHarmony()` now accounts for shadow-position interactions. Ego↔shadow and shadow↔shadow function overlaps are scored at reduced weight (30% and 15% of equivalent ego interactions respectively), shifting scores by at most ±8 points from the ego-only baseline. Full shadow pairs (e.g. ENFP × INFJ) and Lead↔Flood asymmetries are flagged in `strengthsAsTeam`. Blind spots label updated from "Functions absent from both top-4 stacks" to "Shadow-only functions (reactive, not fluent)" to reflect that every function appears somewhere in the 8-position stack.

### 1.3.3 — 2026-03-25

- Fix: Position crossing directionality bug — `{typeA}` in crossing templates now always refers to the type holding the **lower** position number, not the first argument to `getPositionCrossings()`. Added `typeForA`/`typeForB` metadata fields to each crossing object. `getPositionCrossings('INFJ', 'ENFP')` and `('ENFP', 'INFJ')` now produce correctly attributed descriptions in both orderings.
- Improved: Position crossing descriptions now show person names (e.g. "Alice's Lead") instead of MBTI codes when person labels are available. Same-type pairs retain MBTI codes to avoid ambiguity.
- Added: 6 new `CROSSING_MATRIX` entries covering previously missing position pairs: Shared Anchor (2-2), Shared Refuge (3-3), Anchor ↔ Counter (2-5), Anchor ↔ Critic (2-6, high tier), Refuge ↔ Critic (3-6), Refuge ↔ Gamble (3-7).
- Improved: Medium-tier crossings in the Compare page now collapse behind a `▶ N medium-tier crossings` toggle, keeping the highest/high-tier crossings always visible and preventing the section from becoming overwhelming for dissimilar or full-shadow type pairs.

### 1.3.2 — 2026-03-25

- Fix: Compare page pairwise analysis now substitutes actual person names (e.g. "Spencer", "Wife") for all "Person A"/"Person B" placeholders in `ENN_TIPS`, `MBTI_TIPS`, and `INSTINCT_STACK_DYNAMICS` rendered text. Canonical key ordering (lower Enneagram type / alphabetical MBTI / alphabetical instinct stack string) is used to map "Person A"/"Person B" to the correct person label, fixing a position-swap accuracy bug where tips could be attributed to the wrong person. `getGrowthStressInteraction()`, `deriveInstinctDepthAnalysis()`, and `getInstinctDepthAnalysisSync()` in `utils/compare.js` updated to accept `nameA`/`nameB` parameters; `substituteNames()` helper added to `ComparePage.jsx`.

### 1.3.1 — 2026-03-25

- Improved: Compare page MBTI function stack grid now displays all 8 positions (Lead → Flood) using `getFullStack()`, replacing the 4-position ego-only view with outdated DOM/AUX/TER/INF labels. Shadow arc (positions 5–8) is visually separated by a "SHADOW" divider and rendered at reduced opacity. Match indicators (=, ~, ×) cover all 8 rows; shared-function logic remains ego-only for cognitive relevance.

## [1.2]

### 1.2.5 — 2026-03-18

- Added: **Export for AI** button on the Compare page — generates a structured multi-person Markdown profile (summary table + per-person Enneagram/MBTI/Instinct detail) and opens it in the existing `ExportModal` for one-click copy into any AI assistant. `generateCompareMarkdown` added to `utils/export.js`; `ExportModal` updated to make the `backup` prop optional (single-column layout when omitted).

### 1.2.4 — 2026-03-17

- Fix: Instinct Stack quiz now asks targeted pair-specific clarifying questions when the main 15-question bank is exhausted and two instincts are still tied, preventing arbitrary ordering in the result. `INSTINCT_DISAMBIG` data added to `enneagram.js`; `scoreInstinct` updated to accept optional `disambigAnswers` and `disambigSeq` parameters; new `inst-disambig` phase added to `GuidedTyper`.
- Fix: MBTI quiz now asks targeted dimension-specific clarifying questions when the main 32-question bank is exhausted and any dimension is insufficiently differentiated, preventing the silent E/S/T/J tie-breaker from producing misleading results. `MBTI_DISAMBIG` data added to `mbti.js`; `scoreMBTI` and `isMBTIDimConfident` updated to support `direction: -1` on opposite-pole questions; new `mbti-disambig` phase added to `GuidedTyper`.

### 1.2.3 — 2026-03-17

- Improved: Enneagram wing strength now uses an arrow-augmented absolute endorsement score instead of a raw difference between the two adjacent type scores. `computeWingStrengthDelta` returns `effectiveWingScore(wing, scores) = scores[wing] + 0.2*(scores[growth] + scores[stress])`, preventing false "strong" labels when both wing candidates score negatively and incorporating integration/stress arrow type evidence. `wingStrengthLabel` thresholds recalibrated accordingly (strong > 6, moderate > 1, balanced ≤ 1). Wing *selection* in `scoreEnneagram` also updated to use effective scores so arrow evidence can influence which adjacent type becomes the wing.

### 1.2.2 — 2026-03-17

- Removed: Profiles browse tab from Explorer view; combination profiles now surface exclusively on the GuidedTyper choose screen (after completing all three assessments) or when loading a profile code in the Typer

### 1.2.1 — 2026-03-15

- Fixed: Group Overview pattern insights now split into three labeled subsections (ENNEAGRAM / INSTINCT STACK / MBTI) instead of a flat mixed list, eliminating confusion from shared "thinking/feeling" vocabulary across systems; instinct stack insight moved from the Enneagram block into its own section; `analyzeGroup` now returns `{ ennInsights, mbtiInsights, instinctInsights }` instead of a flat array; updated `group.test.js` to assert correct return shape and per-system routing

### 1.2.0 — 2026-03-15

**Content Expansion: Compare Page Analytics, Explorer Deep-Dive Content, and 1,728 Combination Profiles**

- Added: 10 new static data files — `subtypes.js` (27 Enneagram instinct subtypes), `levels.js` (9-type levels of development), `instinctStackProfiles.js` (6 full stack ordering profiles), `instinctPairDynamics.js` (21 stack pairwise dynamics), `groupArchetypes.js` (team archetype matching), `typeInteractionGrid.js` (36 type-pair interactions), `mbtiDevelopment.js` (16-type developmental trajectories), `mbtiStressFlow.js` (16-type stress and flow profiles), `ennMbtiCorrelation.js` (9-type MBTI correlation data)
- Added: `src/utils/compare.js` — four pairwise analytics functions: `getCommunicationMatrix`, `getGrowthStressInteraction`, `getCognitiveHarmony` (scored 0–100 with complementary function detection), `getInstinctDepthAnalysisSync`
- Added: 7 new group analytics exports in `src/utils/group.js` — center, harmonic, Hornevian, and temperament distributions; cognitive function coverage; instinct chemistry with cohesion score; team archetype matching
- Added: `ENN_HORNEVIAN` to `enneagram.js`; `MBTI_TEMPERAMENT` to `mbti.js`
- Enhanced: Compare page pairwise results now include Communication Style, Growth & Stress Interaction, Cognitive Harmony Score, and Instinct Depth Analysis sections
- Enhanced: Compare page group analysis now shows Team Archetype, Center/Harmonic/Hornevian/Temperament distribution bars, Cognitive Function Coverage, and Instinct Group Chemistry
- Enhanced: Explorer Enneagram detail view now shows Instinct Subtypes, Levels of Development, and Type Interaction Quick Reference for every type
- Enhanced: Explorer MBTI detail view now shows Development Trajectory (5 life stages) and Stress & Flow Profile
- Enhanced: Explorer Instinct detail view now shows full stack profiles and pairwise dynamics for the dominant instinct
- Enhanced: Explorer Integration tab now shows Enneagram × MBTI Correlation Matrix for all 9 types
- Added: 1,728-combination profile system — `ennBase.js`, `mbtiModifiers.js`, `instModifiers.js`, `crossRules.js` composable layers; `scripts/generateCombinations.mjs` generator; lazy-loaded split into 18 wing-specific chunks via `src/data/combinations/`; Three-System Profile section in GuidedTyper choose screen
- Added: 4 new test files — `subtypes.test.js`, `group-analysis.test.js`, `cognitive-harmony.test.js`, `combinations.test.js` (381 tests total)

---

## [1.1]

### 1.1.1 — 2026-03-10

- Fixed: code loading on Compare page corrupted the instinct stack — `handleLoadByCode` now syncs local `instOrder` state so clicking Done no longer overwrites the decoded instinct stack with the default
- Fixed: `handleLoadCode` in GuidedTyper now trims whitespace before passing to `decodeProfileCode`, preventing false "Invalid code" errors on copy-paste with trailing space
- Added: "Add My Profile" quick button in Compare page PersonEditor — appears in By Code mode when own profile exists in localStorage, loads all fields without needing to type a code
- Added: person limit on Compare page raised from 6 to 12 (up to 66 pairs, fully collapsible)
- Added: Explorer deep-link from profile card — type tags in the choose-screen profile card are now clickable buttons that navigate to the specific type detail page in Explorer; "Learn more on the Explorer tab →" buttons on quiz result screens now jump directly to the relevant type entry
- Added: rich profile card synthesis section — when all three assessments are complete, the profile card expands to show Strengths, Challenges, System Interactions (center/function harmony, instinct/MBTI note, conflict style), and Growth Edge, all derived from the combined Enneagram + MBTI + Instinct data
- Added: `localStorage.clear()` to compare-page test beforeEach to prevent state leakage between tests; added 16 new tests covering all five changes

### 1.1.0 — 2026-03-09

- Added: comprehensive README documenting all features, architecture, data flow, and development process
- Added: CHANGELOG (this file) with progressive compression versioning and full retroactive history
- Changed: CLAUDE.md — added Documentation Maintenance section with explicit update triggers and versioning rules

---

## [1.0] — compressed when 1.1.0 was released

- **1.0.0** — Added comprehensive CLAUDE.md AI assistant guide covering TDD principles, full codebase map, core conventions, common pitfalls, and feature checklist; established mobile quiz-card vertical centering

---

## [0.x] — compressed when 1.0.0 was released

- **0.9** — Test suite repairs (pre-existing navigation and compare-page failures); updated MBTI test assertions to reflect dimension badge removal; quiz card vertical centering on mobile
- **0.8** — Quiz UX overhaul: localStorage persistence across sessions, wing-strength delta calculation and labels, MBTI indicators, clear-results button
- **0.7** — Mobile layout: safe-area insets for home-bar clearance, 44 px minimum touch targets throughout
- **0.6** — Adaptive testing: fixed MBTI 7-point Likert scale scoring bug; added confidence-based early exit for all three quizzes; expanded unit test coverage to ~140 assertions in `scoring.test.js`
- **0.5** — MBTI Likert scale replaced binary questions; added Mental Model view (MBTI quadrant map, Enneagram circle, instinct stack detail, combined profile, 4-step SOP)
- **0.4** — Explorer overhaul: consolidated tabs into Enneagram / MBTI / Instinct / Integration; archetype naming utility (`computeArchetypeName`); required all three systems for Compare entry; deep-links from quiz result screens to Explorer type detail
- **0.3** — React Testing Library integration tests for quiz flows, editor, and navigation; expanded branching and standalone instinct-flow tests; fixed editor save bugs
- **0.2** — Core feature set: quiz result persistence to localStorage, Enneagram disambiguation branching, share-URL encoding/decoding, JSON backup and restore, standalone Instinct Stack quiz, manual Compare entry form
- **0.1** — Initial release: Enneagram + MBTI quizzes, pairwise Compare dynamics (~7,000-line pre-computed pair lookup), Function Explorer, GitHub Pages deployment
