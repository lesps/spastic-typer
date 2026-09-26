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

## [3.1]

### 3.1.0 — 2026-09-26

Closes the one exception 3.0.0 recorded. Every growth string in the app is now composed from the source document instead of authored, and "growth" has exactly one meaning.

- Changed: **the growth direction is derived, not stored.** `growthPathFor(ennType, wing, mbtiType, instStack)` in `utils/stack.js` composes it from three sourced axes: the fixation (Appendix C) sets the direction, the function at Gamble sets the registration channel, and the first instinct sets which substrate pressure has to come down first. The previous copy said growth comes from doing something; the source says it is a prediction being falsified, cannot be self-performed, and is registered rather than produced.
- Removed: `growthPath` from `combinationProfiles.js` and the per-wing files. It was 1,728 stored copies of 216 distinct strings and a second place for the growth copy to drift. `CombinedProfile` computes it at render. The monolith is 243 KB smaller than before this change rather than 847 KB larger, which is what storing the richer text would have cost.
- Changed: `ennBase.growthSummary` regenerated from Appendix C — 18 entries, 9 distinct, because the source calls wing the angular precision of a point on the circle rather than a separate variable, so it cannot change the direction.
- Changed: all 27 `subtypes.growthPath` entries regenerated as the fixation crossed with that instinct's substrate reduction.
- Changed: `instinctStackProfiles` `growth` → `underdeveloped`. The content stays — the least-attended instinct is standard instinctual-variant material and the app's own layer — but the source says nothing about developing a repressed instinct, so it is no longer presented as a growth path. Explorer labels it "Least attended"; the combined profile now says explicitly that it is distinct from the growth direction.
- Added: `scripts/splitCombinations.mjs`. The per-wing files were checked in as "auto-generated" with no generator in the repo, so they could not be kept in step with the monolith. This is that generator; run it after `generateCombinations.mjs`.
- Tests: `growth-direction.test.js` covers every type × wing × MBTI × instinct combination and asserts the direction is wing-invariant, names the right Gamble function and the first instinct's substrate, never the second's, and that no growth copy is instruction-shaped. `combined-growth.test.jsx` covers the rendered path.
- Fixed: **`guided-typer.test.jsx` was flaky**, failing three to six Enneagram-flow tests per run on a clean checkout several commits back. Two causes in its `answerUpTo` helper, both confirmed by measurement rather than inferred. First, it queried with `queryByRole`, which computes accessible names across the whole DOM on every call; a full Enneagram run took ~11.6s of the 15s timeout, so ordinary machine variance pushed it over. Querying the same Likert button by text takes ~0.7s. Second, a timed-out test's loop kept running after Vitest moved on and, because it queried the global `screen`, clicked the next test's buttons. That is why a trivial test failed in ~450ms after a long one timed out. The helper now binds to its own render and stops once that render is detached. A regression test reproduces the cascade with a DOM decoy: 69 stray clicks before the fix, none after. The file now runs in ~18s instead of 138–177s, passes 71 of 71 across repeated runs and under full CPU saturation, and the whole suite takes ~30s.
- Corrected: the first version of this PR blamed the flake on tests assuming the quiz never exits early. That was wrong. No confidence check runs until three full rounds have been presented — 9 questions for Instinct, 27 for Enneagram — so neither quiz can exit at question 2. Seeding the question order, tried first, addressed neither real cause.
- Docs: CLAUDE.md's adaptive-quiz thresholds had drifted from the code on every figure (≥2 answers and a 1.5 ratio, against ≥3 and 1.8, with no mention of the three-round floor). Corrected, along with the missing `typer_session` storage key, the suite's run time, and a Position Naming note left over from 3.0.0 that still described `POSITIONS[].brief` after that release deleted it.
- Known issue, pre-existing and untouched: `CombinedProfile.jsx` statically imports the 5 MB combination monolith while `GuidedTyper.jsx` lazy-loads the per-wing split, so the split currently saves nothing on the main bundle.

## [3.0]

- 3.0.0: the whole app brought onto `docs/specs/ct-consolidated.md`. Added the fixation-utility modulator, both thresholds on Anchor's drift, Gamble's three properties, the odd/even reporting signature, Appendix C personalization and substrate pressure, and a Reading tab carrying the coaching bands, diagnostic table, clinical sequence, failure modes and all fourteen falsifiers. Renamed the stack-inverse concept off "mirror", regenerated all 64 per-type shadow briefs, removed two unsourced stores of position meaning, corrected six crossing templates, and split Hunger Reaching from Flood forced-primary.

## [2.0]

### 2.0.0 — 2026-09-19

Major: the Stack view's content model is replaced. The app previously encoded the May 2026 CT Minimum Viable Framework, whose single mechanism was Critic write-back. The September 2026 consolidated document (`docs/specs/ct-consolidated.md`, now checked in) supersedes that suite in full, and where the two disagree the consolidated document is authoritative. This is a framework replacement rather than a content edit, which is why it takes a major version: the diagram gained causal edges, several positions mean something different from what the app said they meant, and the terminology guard changed shape.

- Changed: **the mechanism is adjacency corruption.** A shadow position's corrupted output becomes an ego position's input, and sustained corrupted input recalibrates the receiver; Critic write-back is the middle instance of that rule, not the whole of it. `data/stack.js` gains `MECHANISM`, and the ego→shadow and shadow→ego clauses are data rather than prose.
- Added: **two causal edges the diagram was missing.** `bleed` (Counter → Refuge, the threat-output contamination that opens at Level 3 and captures Refuge at 4) and `interrupt` (Gamble → Lead, the interrupt line that entrains Lead at 8). Edges now carry a `kind` — `nested` for the four dependency couplings, `corruption` for the three shadow→ego edges, `structural` for the gate, which is not a corruption edge. Active edges per level are re-keyed accordingly: bleed opens at 3 and carries through 4, write-back runs across 5 and 6, interrupt drives the Lead capture at 8, trigger drives Flood at 9.
- Fixed: **Flood is always-on background input, not an eruption.** The previous copy said it was quiet under ordinary conditions and surfaced only when everything else broke; the source says it runs all the time and becomes visible only when it surfaces through Gamble or takes over. Capture flips the direction of the override from away-from-danger to toward-fixation.
- Fixed: **Gamble's surfacings stay accurate.** Polarity corruption is in the comparator, not the signal, so a surfacing at Level 7 or 8 still contains the accurate discrepancy — the person cannot read it, but someone else can. The view no longer describes Gamble as unreliable or misfiring.
- Fixed: **Counter and Critic are proficient.** Both are Strong + Unvalued. Captured Counter is principled, symmetric defense applied to the fixation's territory; Critic does its job correctly throughout, and what changes is the data it samples.
- Fixed: **Refuge is the engine**, propulsion in active mode and restoration in rest mode, not only a retreat. The Level 3 output increase sourced from downtime is its early tell.
- Fixed: **the Level 6 gate flip validates the majority of Lead's outputs.** The previous copy described only the low-utility variant, where the gate rejects Lead, and presented it as the general case.
- Fixed: **equilibrium sits at Reality-testing with Gamble intact**, not around Maintenance, which the source retires by name.
- Fixed: **Level 1 is not a starting state.** It is reachable only by recovery, so it no longer carries a "Pre-colonization" band. `STAGE_BANDS` is the four stages; level 1's band is `null`.
- Changed: the health-level bridge states where the two scales diverge instead of disclaiming the mapping. The source generates the nine Riso-Hudson levels rather than borrowing them.
- Added: per-level Riso-Hudson name and band, capture kind (identification, immediate, accumulation) and the predicted transition sharpness, shown beside the narration. Four-stage data (`STAGES`), position roles (`ROLES`), and both pairing schemes (`NESTED_PAIRS`, `DOMAIN_PAIRS`) — the source calls confusing domain and nested pairs the most common contamination error, so the purpose panel now names both partners for the selected position.
- Added: level narration carries the rest of its source paragraph behind a **More** expander, and the falsifier where the source states one (levels 3, 7 and 9).
- Added: Counter threat output carries the Appendix B texture and the way that output contaminates Refuge, replacing the short form.
- Added: **mechanical provenance.** Every prose string in `data/stack.js` must be a verbatim substring of a checked-in source document. Normalisation strips markdown emphasis and cross-references but never wording or punctuation, so a paraphrase fails. Multi-sentence content is stored as arrays of individually verifiable sentences. This makes the repo's long-standing "do not paraphrase framework prose" rule enforceable rather than advisory.
- Changed: two deny-list patterns narrowed, because the consolidated document's own wording tripped them — `goes offline` rather than `offline` (the source says "Lead offline" for Flood forced-primary under extreme stress, a different claim from the retired one about a corrupted Anchor) and `opposing personality` rather than `opposing` (Beebe's term, while the source says "opposing attitude" throughout). Four newly retired terms added: maintenance ceiling, ego block, unimprovable, conversion window.
- Fixed: the `interrupt`, `sample` and `check` edge labels overlapped in the diagram, with sample and check reading as a single word. Separated, and the geometry test now requires a readable gap rather than mere non-intersection.
- Fixed: `StackView` read its deep-link query only on mount, so editing the hash or using browser back/forward between two `#/stack` links left the view unchanged. It now re-reads on `hashchange` and ignores malformed queries.
- Docs: `docs/specs/stack-view.md` carries a supersession note — its §3 terminology guard and §5 content are superseded, its §9 open items are closed, and the rest still describes the shipped view.
- Not yet aligned (tracked, not silently ignored): Explorer, Compare and `mbtiDetails.js` still carry the old Flood, Gamble, Counter and Critic descriptions; `mbtiStressFlow.js` conflates Hunger Reaching with Flood forced-primary; the growth copy across `combinationProfiles.js` and friends is instruction-shaped, which the source says is counterproductive. See CLAUDE.md.

## [1.6]

### 1.6.0 — 2026-09-13

- Added: **Stack** view at `#/stack`, a fourth navigation tab (Typer / Explorer / Compare / Stack). An inline-SVG diagram draws the eight positions (ego arc left, shadow arc right) and the six structural couplings — gate, write-back, sample, monitor, check, trigger — with Refuge → Critic → Anchor drawn as the load-bearing spine. Nodes and edges are tappable and keyboard-selectable. A colonization scrubber (levels 1–9) tints captured positions one per level in the spec's order, pulses the just-captured node, and lights that level's active edges; the write-back edge lights across levels 5–6. Level narration, the stage band, and the equilibrium caveat sit beside the scrubber. A purpose panel shows the selected position's native purpose and its purpose in the fixation's service as two blocks, the captured block inert until the scrubber passes that position's capture level and both kept visible afterwards. A 16-type selector (or "Positions only") puts each function on its node; Replay walks 1 → 9 at 1.2s per step and jumps to the end under `prefers-reduced-motion`. With both `typer_mbti` and `typer_enn` saved, a Personalize control badges Hunger with the fixation ("Type 4 installs here"), shows the Counter threat-output form for that stack, and bridges the current level to the Riso-Hudson tier text, flagged as an interpretive bridge. Malformed or missing storage degrades to the impersonal view.
- Added: `#/stack?type=ENFP&level=5` deep links. `App.setView(view, query)` now carries an optional query; `ComparePage` receives `setView`. Entry points: the Typer home screen and MBTI result screen ("See … in the Stack view"), and per-person links in Compare's Shadow Stack section.
- Added: `data/stack.js` (capture order, Augusta classification, purpose transformations, level narration, equilibrium caveat, Counter threat-output forms, edges, active edges per level, label templates) and `utils/stack.js` (capture state, label templating, query parsing, saved-result reading, diagram geometry). Content is transcribed from `docs/specs/stack-view.md`; a terminology deny-list test guards every exported string and both source files.
- Changed: the reduced-motion rule in `baseCSS` now disables animations as well as transitions; a `stack-pulse` keyframe is the only animation in the app.
- Product decision: this view makes the app visibly CT-branded (the May 2026 CT Minimum Viable Framework: colonization, capture, Critic write-back, Anchor corruption, gated Lead) rather than a neutral MBTI/Enneagram tool. That is deliberate, not an accident of the copy.
- Not included (needs owner content, do not infer): the Lead-utility × fixation matrix and a stakes slider — only five anchors are established (Te×3 high, Ni×4 high, Se×8 high, Fi×3 low, Se×5 low) and the remaining cells do not exist; fixation substrate/strategy/direction copy on the Hunger badge.
- Tests: new `stack-data.test.js`, `stack-logic.test.js`, `stack-view.test.jsx`; four-tab and `#/stack` routing tests; entry-point tests in `guided-typer.test.jsx` and `compare-page.test.jsx`.
- Docs: fixed drift — view line counts in CLAUDE.md and README were roughly half the real numbers, `data/levels.js` and five test files were undocumented, and the README structure tree was missing several data and util modules. Added `docs/specs/` and `docs/plans/`.

## [1.5]

- 1.5.0–1.5.1: Mental Model folded into Explorer (three tabs; `#/model` resolves to Explorer); Combined profile moved under Typer; Explorer MBTI tab grouped by quadrant with the Typing SOP; all hardcoded colors replaced with theme tokens (`success`, `warn`, `CENTER`, `SYSTEM`, `POS`, `alpha()`) guarded by `theme.test.js`; sticky Compare person bar with expand/collapse all; collapsible Explorer intros.

## [1.4]

### 1.4.1 — 2026-09-13

- Improved: Home screen shows each type once instead of three times — the status chip row is gone, the intro card hides once all three assessments are done, and the profile card has a single action row (Get Code, Export). Clear moved out of the profile card to a small link at the bottom of the page, still behind a confirmation.
- Improved: Each quiz card has an explicit, keyboard-reachable "Start …" button (the whole card remains tappable). Cards now start quizzes through `startQuiz`, so the seeded sequence path is used everywhere.
- Improved: Quiz screens carry a context header — assessment name, question number, and typical length ("Question 7 · typically 15–30 questions"). Vertical centering of the question card now applies at every width, not just phones.

### 1.4.0 — 2026-09-13

- Added: URL-hash routing. The active view now lives in the hash (`#/typer`, `#/explorer`, `#/model`, `#/compare?p1=…`), so refresh keeps your place, browser back/forward move between views, and every view is linkable. New `utils/route.js` (`parseHash`, `buildHash`).
- Fix: Shared Compare links opened on the Typer page; they now land directly on Compare with the people loaded. Share URLs are written as `#/compare?p1=…`; legacy `#p1=…` links still work.
- Fix: Opening a type detail in Explorer or Mental Model, switching tabs, or moving between views kept the previous scroll offset (Back button often off-screen). Views now reset to the top via `utils/scroll.js` (`useScrollToTop`).
- Improved: Navigation rebuilt as `AppNav` (replaces `BottomNav`). Every tab shows its label at all times (inactive tabs were icon-only glyphs), the bar is a `<nav aria-label="Primary">` landmark with `aria-current` on the active tab, and from 681px it becomes a top bar with a brand mark instead of a floating pill.
- Improved: Visible keyboard focus rings on buttons, links, inputs, and summaries; `prefers-reduced-motion` disables transitions. Page padding that clears the nav now comes from `--nav-pad-top` / `--nav-pad-bottom` CSS variables.
- Docs: CLAUDE.md nav table listed the wrong tab order and view id (`explore`); corrected. Navigation tests select tabs by `data-view` instead of glyph text.

## [1.3]

### 1.3.0 — 2026-03-22

- Added 8-position naming system (Lead, Anchor, Refuge, Hunger, Counter, Critic, Gamble, Flood) replacing Beebe/Jungian terminology
- Added shadow stack derivation utilities (`getShadowStack`, `getShadowMirror`, `getPositionCrossings`)
- Added unified position-crossing algorithm for MBTI comparison (ego↔ego, ego↔shadow, shadow↔shadow)
- Explorer: ego positions renamed from DOM/AUX/TER/INF to Lead/Anchor/Refuge/Hunger, shadow section expanded with position names and templates, position reference section added
- MentalModel: shadow stack insights added to type detail view
- ComparePage: position-crossing flags added to pairwise MBTI comparison, Full Shadow Pair callout for mirror types
- Rewrote all 64 shadow function descriptions in `mbtiDetails.js` to use new position naming and experiential tone

### 1.3.8 — 2026-03-27

- Removed: MBTI tips section ("Understanding [Type]'s Lead: [Fn]" cards) removed from Compare page pairwise analysis. These cards restated type-profile information already visible in the 8-position stack grid and were identical regardless of who the pair partner was. The MBTI section now flows: stack grid → MBTI Insights → Position Crossings → Cognitive Harmony.
- Improved: Enneagram tips cards (core fear, desire, stress/growth arrows) are now always-visible `<div>` cards instead of collapsed `<details>` elements. These 4-line reference cards surface motivational data not shown elsewhere on the Compare page and are compact enough to show without a click.

### 1.3.7 — 2026-03-27

- Fix: Same-MBTI crossing descriptions now substitute person names instead of returning raw template text (e.g. "Both Spencer and Myat lead with Ne" instead of "Both ENFP and ENFP lead with Ne"). Sequential regex replacement maps first type-code occurrence to pA's name and second to pB's name.
- Improved: ENN_TIPS and MBTI_TIPS cards are now collapsed by default using `<details>`/`<summary>` elements. These are generic type-reference cards; collapsing them by default reduces visual clutter and lets pair-specific analysis sections take precedence.
- Improved: When two people share the same Enneagram type, the two identical ENN_TIPS cards are merged into a single collapsed card with a "SHARED TYPE" tag instead of rendering duplicate content.
- Improved: When two people share the same MBTI type, the two identical MBTI_TIPS cards are merged into a single collapsed card with a "SHARED TYPE" tag.
- Improved: Growth & Stress section condenses to "SHARED GROWTH PATH" + "SHARED STRESS PATTERN" for same-Enneagram-type pairs, replacing 4 symmetric sub-sections (which contained identical directional information due to identical arrows).

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
