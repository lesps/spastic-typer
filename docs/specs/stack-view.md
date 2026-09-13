# spastic-typer — "Stack" navigation view

> Owner-supplied spec, checked in verbatim so implementation sessions can transcribe §5
> content without paraphrase. Corrections to §2 (verified against the repo on 2026-09-13)
> are recorded in `docs/plans/stack-view-sessions.md` §1, not edited here.

**Spec, not a work plan.** Sequence, commit boundaries, and file-by-file ordering are yours to decide. What follows is the objective, the hard constraints, the content that must not be invented, and the acceptance criteria. Ships as version **1.5.0** (current: 1.4.1).

---

## 1. Objective

Add a fifth top-level navigation view, **Stack**, at `#/stack`. It teaches three things, in this order of importance:

1. **What the eight positions are** and how they relate — not as a list, as a diagram with the couplings drawn.
2. **How colonization progresses** — one position captured per Riso-Hudson level, alternating ego and shadow arcs, driven by a scrubber the user moves.
3. **How each function's purpose changes when the fixation reaches it.** This is the payload. Every other element exists to set it up. A user should come away able to say what their Critic does natively and what it does in the fixation's service, and why the difference is hard to notice from inside.

The existing Explorer and Compare surfaces describe functions and positions statically. Nothing in the app currently shows the *mechanism* — that Critic samples Refuge, writes back to Anchor, and that a drifted Anchor gates Lead. That mechanism is nearly impossible to convey in prose and close to self-explanatory as an animated diagram. That gap is the reason this view exists.

---

## 2. Repository facts you can rely on

Verified against `main` at spec time. Re-verify anything you depend on.

- React 18 + Vite 6 + Vitest. App code in `frontend/`. No router, no UI library, no CSS files, no backend. `CLAUDE.md` is authoritative on conventions — read it first.
- **Routing:** `utils/route.js` exports `VIEWS = ['typer','explorer','model','compare']`, `DEFAULT_VIEW`, `parseHash`, `buildHash`. `App.jsx` holds `view` state synced to the hash via a `hashchange` listener.
- **Nav:** `components/AppNav.jsx` exports `NAV_ITEMS` and renders a bottom tab bar (top bar with brand mark from 681px). Tabs carry `data-view` and `aria-current`. Layout rules live in `baseCSS` in `styles/theme.js`; colors stay inline. `.nav-btn` is `flex:1; font-size:13px`.
- **Position model already exists:** `data/shadow.js` exports `POSITIONS` (`pos`, `name`, `arc`, `brief`) — Lead, Anchor, Refuge, Hunger (ego 1–4), Counter, Critic, Gamble, Flood (shadow 5–8) — and `SHADOW_TEMPLATES`, per-position strings using `{fn}` / `{fnName}` placeholders.
- **Stack derivation:** `utils/shadow.js` exports `getFullStack(mbtiType)` → `[{fn, pos, name, arc}]` for positions 1–8 (shadow = attitude-flipped ego), and `instantiateTemplate(pos, fn)` for the placeholder substitution. Reuse both rather than reimplementing.
- **Functions:** `data/cognitive.js` exports `COG_FUNCTIONS` (name, abbr, color, desc). `components/FnBadge.jsx` renders a colored badge. `styles/theme.js` exports `G` (UI tokens) and `FC` (function colors).
- **Health levels:** `data/levels.js` exports `LEVELS`, Riso-Hudson tier descriptions per Enneagram type (`healthy` 1–3, `average` 4–6, `unhealthy` 7–9).
- **Persistence:** `typer_mbti` → `{ result, scores }`; `typer_enn` → `{ coreType, wing, wingStrengthDelta, instinctStack, display, scores }`; `typer_inst`. Always guard `null` and malformed JSON.
- **Scroll:** `utils/scroll.js` exports `useScrollToTop(...deps)` — every view uses it on tab/selection state.

---

## 3. Non-negotiables

### Terminology guard

The content model is the May 2026 CT Minimum Viable Framework. In UI copy, data strings, and code comments:

- **Never:** exile, ego block exile, Substituting state, exile firewall, kamikaze Anchor, conversion window, "goes offline", compressed-vs-degraded as two mechanisms.
- **Always:** colonization, capture, Critic write-back, Anchor corruption, *gated* (Lead is gated, never offline), Counter-dominant operation, utility-driven equilibrium, Anchor recalibration.
- **One mechanism only:** Critic samples Refuge → writes back to Anchor → Anchor's standard drifts → Anchor's gate rejects Lead's native output in fixation-hot contexts. Do not introduce additional cascades or pathways. If copy seems to require one, stop and ask.
- Never use Beebe terminology (Opposing, Critical Parent, Trickster, Demon) — a standing repo convention.
- **All framework prose in §5 is transcribed from source documents. Do not paraphrase it into new claims and do not fill gaps by inference.** Where the spec gives no content, the content does not exist yet — ask.

### Level ≠ position

Riso-Hudson levels (1–9) and stack positions (1–8) are different numbering systems, and they collide: **Critic is position 6, captured at level 5. Anchor is position 2, captured at level 6.** Any surface showing both must label them (`Position 6 · captured at Level 5`). This is a tested requirement, not a style note.

### Engineering

- TDD is the quality gate: failing test first, then implementation. Tests live in `frontend/src/test/`.
- Inline style objects only. Always `G.*` / `FC.*` / `COG_FUNCTIONS[fn].color`. Never hardcode hex. Keyframes and breakpoint rules go in `baseCSS`, which already honors `prefers-reduced-motion`.
- Mobile-first. Nav clearance comes from `--nav-pad-top` / `--nav-pad-bottom`; never hardcode it.
- Docs are deliverables: `CHANGELOG.md` under a new `## [1.5]`, `CLAUDE.md` tables (views, components, data, utils, tests, routing, localStorage), `README.md` features. Document what IS. Fix and note any pre-existing drift you hit.
- Verification: `cd frontend && npm test && npm run build` — zero failures, clean build.

---

## 4. Target layout

Two columns, ego arc descending on the left, shadow arc descending on the right, with the structural couplings drawn between them. Rendered as inline SVG in a responsive `viewBox` (~360×560 logical units, mobile-first) — not HTML boxes with absolute positioning.

```
            EGO ARC                                SHADOW ARC
   ┌─────────────────────┐                 ┌─────────────────────┐
   │  1  LEAD            │◀───── gate ─────│                     │
   │     Strong+Valued   │─────────────────┼──▶  8  FLOOD        │
   └─────────────────────┘    trigger      │        Weak+Unval.  │
              ▲                            └─────────────────────┘
              │ gate
   ┌─────────────────────┐                 ┌─────────────────────┐
   │  2  ANCHOR          │◀══ write-back ══│  6  CRITIC          │
   │     Strong+Valued   │                 │     Strong+Unval.   │
   └─────────────────────┘                 └─────────────────────┘
              │                                       ▲
              │ check                                 ║ sample
              ▼                                       ║
   ┌─────────────────────┐                 ┌─────────────────────┐
   │  7  GAMBLE          │                 │  3  REFUGE          │
   │     Weak+Unvalued   │                 │     Weak+Valued     │
   └─────────────────────┘                 └─────────────────────┘

   ┌─────────────────────┐                 ┌─────────────────────┐
   │  4  HUNGER          │───── monitor ──▶│  5  COUNTER         │
   │     Weak+Valued     │                 │     Strong+Unval.   │
   └─────────────────────┘                 └─────────────────────┘

   ══ = the load-bearing edge. Refuge ──sample──▶ Critic ══write-back══▶ Anchor
        is the causal spine of the whole framework: heavier stroke, higher
        contrast, and the pair that lights up as the scrubber crosses L4→L6.
```

The ASCII arrangement above shows *relationships*, not final coordinates — place nodes so that ego 1→4 descends the left column and shadow 5→8 descends the right, and route edges as curves that don't cross node bodies. Extract the geometry into a pure, testable helper so node/edge placement can be asserted without rendering.

**Edges** (`from → to` are position numbers):

| id | edge | meaning |
|---|---|---|
| `gate` | 2 → 1 | Anchor's standard validates Lead's output for execution |
| `writeback` | 6 → 2 | Critic continuously updates Anchor's evaluative standard |
| `sample` | 3 → 6 | Refuge's unguarded output is Critic's primary calibration data |
| `monitor` | 4 → 5 | Counter watches Hunger's striving and fires when it's blocked |
| `check` | 2 → 7 | Gamble tests against Anchor's standard |
| `trigger` | 1 → 8 | Flood's triggers arrive pre-filtered through Lead |

---

## 5. Content (transcribe; do not author)

### 5.1 Capture order

One position per level, alternating arcs. Level 1 is free operation.

| Level | Position captured | Arc | Stage band |
|---|---|---|---|
| 1 | — | — | Pre-colonization |
| 2 | Hunger (4) | ego | Boundary |
| 3 | Counter (5) | shadow | Boundary |
| 4 | Refuge (3) | ego | Maintenance |
| 5 | Critic (6) | shadow | Maintenance |
| 6 | Anchor (2) | ego | Reality-testing |
| 7 | Gamble (7) | shadow | Reality-testing |
| 8 | Lead (1) | ego | Terminal |
| 9 | Flood (8) | shadow | Terminal |

Augusta classification by position: 1–2 Strong + Valued, 3–4 Weak + Valued, 5–6 Strong + Unvalued, 7–8 Weak + Unvalued.

### 5.2 Purpose transformation — the payload

| Pos | Native purpose | In the fixation's service |
|---|---|---|
| 1 Lead | Primary perception. Fluent, generative, effortless when ungated — the mode you orient through before you choose to. | Perception itself is pre-filtered. Disconfirming information isn't argued with; it isn't registered. Before capture, under a corrupted Anchor, Lead is *gated* rather than captured: its native output fails validation in fixation-hot contexts and runs only where the gate relaxes. |
| 2 Anchor | The evaluative standard, and the validation gate Lead's output passes through. A competing close condition — something that can declare a thing done, good enough, or not worth pursuing. | Still stabilizing, but stabilizing one thing obsessively, in the fixation's service. The self treats the drifted standard as sovereign because Valued means it feels like its own. The tell is asymmetry: healthy Anchor stabilizes across domains. |
| 3 Refuge | Decompression. The least curated output you produce, which is exactly what makes it the highest-quality calibration data available to Critic. | Downtime turns fixation-shaped — taste and preference in unstructured time move first. This is the pivot: the calibration source is now corrupted, so write-back starts running on bad data. |
| 4 Hunger | The constitutive gap. The longing, structurally unfillable, most exposed. | Not captured but identified-with: the fixation installs here as the most available answer to the gap. The longing stays intact; the fixation misdirects what it reaches toward. |
| 5 Counter | Strong but unvalued proficiency. Fires when motivated striving is blocked, completes, and recedes. | Defends the fixation's striving rather than the person's, and has no off state when it runs as identity — thought feels like it's always answering something, even alone. |
| 6 Critic | The auditor, and Anchor's update mechanism. Precise background evaluation against a standard that isn't fixation-shaped. | Target selection becomes fixation-shaped while the evaluations stay accurate. Unvalued means the redirect goes unnoticed. Write-back now writes fixation-shaped updates into Anchor. |
| 7 Gamble | The emergency brake. Episodic reality-check against Anchor's standard, dismissed even when it's right. | The check now tests against the corrupted standard. The system becomes unfalsifiable from inside — no remaining internal mechanism can catch the fixation. |
| 8 Flood | Involuntary override. Quiet under ordinary conditions; its triggers arrive filtered through Lead. | Erupts in the fixation's service rather than the organism's. Adds eruption to a system that's already closed. |

### 5.3 Level narration

- **1** — Free operation. Every position does its own job; nothing runs in the fixation's service.
- **2 · Hunger** — The fixation installs at the gap. This is identification, not capture: the longing is intact, but what it reaches toward is now the fixation's answer.
- **3 · Counter** — Counter begins defending the fixation's striving rather than the person's. It still fires only under threat; what counts as threat has been redefined.
- **4 · Refuge** — Unstructured time turns fixation-shaped. This is the pivot: Refuge is Critic's calibration source, so from here the data feeding the loop is corrupted. The fixation is visible in leisure long before it's visible in deliberate behavior — the most reliable early read.
- **5 · Critic** — Critic samples corrupted Refuge output and writes fixation-shaped updates into Anchor's standard. The conscience doesn't change sides by choice; it changes sides by doing its job correctly against bad data.
- **6 · Anchor** — The standard has drifted far enough that Anchor's gate starts rejecting Lead's native output in fixation-hot contexts. The self trusts the drifted standard because it feels like its own.
- **7 · Gamble** — The last reality-check now tests against the corrupted standard. Nothing internal can falsify the fixation anymore.
- **8 · Lead** — Terminal onset, and structurally forced: with all three checking layers captured, nothing stands between the fixation and Lead. Perception is pre-filtered.
- **9 · Flood** — Eruption added to a system that's already closed. Intense but episodic; level 8 is quieter and more total.

### 5.4 Equilibrium caveat (must be persistently visible near the scrubber)

The sequence is a gradient, not a schedule. Most stacks settle at an equilibrium depth rather than running to level 9. Where the fixation finds the Lead function useful, colonization extends deeper and the person presents as integrated with their fixation. Where it doesn't, it commonly stabilizes around Maintenance — further capture buys the fixation nothing — and the person presents as compressed, with Counter carrying the high-stakes load. Depth is set by that utility and by substrate pressure, not by elapsed time.

Do not present the scrubber in a way that implies everyone progresses to 9, and do not let it read as a severity score.

### 5.5 Counter threat-output forms (keyed by function)

Ni → convergent trajectory certainty · Ne → proliferating threat scenarios · Fi → worth and authenticity verdict · Fe → relational damage assessment · Ti → logical necessity construction · Te → outcome-failure ledger · Si → precedent-based inevitability · Se → immediate-environment threat read.

---

## 6. Behavior

**Type selection.** 16-type selector plus a "positions only" mode. Defaults to the saved `typer_mbti` result when present. With a type selected, every node carries its function (`getFullStack`, `FnBadge`, function-colored), and captured-state copy names the function — "your Te stops…" reads differently from "Refuge stops…". Reuse the `{fn}` / `{fnName}` template convention already in `shadow.js` so `instantiateTemplate` does the substitution.

**Diagram interaction.** Nodes and edges are both selectable, by tap and by keyboard (Enter/Space, focus-visible, `aria-label`). Node selection opens position detail; edge selection explains the coupling. Fat transparent hit paths on edges — they must be tappable on a phone.

**Scrubber.** Range input across levels 1–9, labelled with level, stage band, and the position captured there. Moving it drives the diagram: captured nodes tint, the just-captured node pulses, and the active edges for that level highlight. Suggested active edges: L3 `monitor`; L5 `sample` + `writeback`; L6 `writeback` + `gate`; L7 `check`; L8 `gate`; L9 `trigger`. The write-back edge lighting up across L5–L6 is the centerpiece — if it doesn't read at a glance, the view has failed its main job.

**Purpose panel.** For the selected position, native and captured purposes shown as two labelled blocks — side by side on wide screens, stacked on phones. The captured block is visually inert until the scrubber passes that position's capture level, then activates. Once passed, both states show together: the comparison *is* the lesson, so never replace one with the other.

**Replay.** An optional animated walk from level 1 to 9 at roughly 1.2s per step, cancellable. Under `prefers-reduced-motion`, skip the animation and jump to the end state.

**Personalization.** When both `typer_mbti` and `typer_enn` exist, offer to personalize: set the type, badge Hunger with the fixation ("Type 4 installs here"), show the Counter threat-output form for that stack's Counter function. Optionally cross-link the current level to `LEVELS[coreType]` tier text so the structural sequence lands against health-level language the user already knows — flag this as an interpretive bridge in the copy rather than presenting the two as equivalent. Missing or malformed storage degrades silently to the impersonal view.

**Entry points.** Deep links from GuidedTyper's MBTI result screen and from ComparePage's Shadow Stack section. `ComparePage` currently receives no navigation props — thread `setView` through `App.jsx`.

**Nav capacity.** A fifth tab shares the phone-width bar. Verify at 360px that no label wraps or truncates; if it does, trim `.nav-btn` padding or font size inside the phone breakpoint. Do not fall back to icon-only tabs — 1.4.0 deliberately removed those.

---

## 7. Acceptance criteria

1. `#/stack` is a linkable fifth view; hash routing, `aria-current`, back/forward, and refresh all behave like the existing four. Nav labels fit at 360px.
2. The diagram renders all 8 positions and all 6 edges; every node and edge is selectable by tap and keyboard and produces an explanation.
3. Capture order matches §5.1 exactly at every level; captured sets are cumulative and strictly nested; level 1 captures nothing.
4. The purpose panel shows native and captured text per §5.2, with captured inert until its capture level is passed, and both visible after.
5. With a type selected, captured copy names that stack's actual function at that position (ENFP Refuge → Te, ENFP Counter → Ni).
6. Every surface showing both numbering systems labels them; `Position 6 · captured at Level 5` renders as distinct numbers.
7. The equilibrium caveat is persistently visible alongside the scrubber.
8. Reduced-motion path works; no animation-dependent content.
9. Missing, absent, or malformed localStorage never throws and never blocks the view.
10. A test asserts the terminology deny-list (`/\bexile\b/i`, `/substituting/i`, `/offline/i`, `/firewall/i`, `/kamikaze/i`) across every exported string in the new data module. Keep this test — it guards future edits, not just this one.
11. `npm test` green, `npm run build` clean, CHANGELOG/CLAUDE.md/README updated and accurate to shipped code.

---

## 8. Testing expectations

Pure logic — capture state per level, geometry/layout — must be unit-testable without rendering and covered table-driven across all nine levels. Data integrity (field completeness, key counts, classification mapping, edge endpoints in range, unique ids) gets its own suite. View behavior uses React Testing Library following existing conventions: `localStorage.clear()` in `beforeEach`, nav selection by `data-view` inside the Primary landmark, `window.scrollTo` already stubbed in `src/test/setup.js`. Expose `data-` attributes on diagram nodes for state assertions rather than testing against styles.

---

## 9. Open items — ask, don't infer

- **Fixation utility for Lead.** The framework's surface modulator (whether a given Lead function is useful to a given fixation) would make a strong follow-on feature — a stakes slider showing execution handing off from Lead to Counter as the gate closes. It needs a committed 8 functions × 9 types matrix with a rationale per cell, which does not exist in the repo. Only these anchors are established: Te×3 high, Ni×4 high, Se×8 high, Fi×3 low, Se×5 low. **Do not infer the remaining cells.** Leave the feature out and note it.
- **Fixation substrate/strategy/direction copy** for the personalized Hunger badge is not in this spec. Ship the badge without it unless the owner supplies the text.
- This view makes the app visibly CT-branded rather than a neutral MBTI/Enneagram tool. That's a deliberate product decision — record it in the CHANGELOG entry so it isn't rediscovered later as an accident.
