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

## [1.1]

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
