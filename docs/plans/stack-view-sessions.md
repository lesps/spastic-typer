# Stack view — implementation plan

Plan for `docs/specs/stack-view.md` (the owner's spec, checked in verbatim). Five
self-contained sessions, each sized for a single Claude Code (Sonnet 4.6) pass. Every
session re-reads `CLAUDE.md` and the spec; none depends on reading another session's
notes, only on the code the earlier session left behind (each lists what to verify).

Branch: `claude/stack-navigation-view-xhyksj`. Baseline on 2026-09-13: 13 test files,
532 tests green, `npm test` takes ~140s (the quiz-flow tests are slow; that is normal).

---

## 1. Spec §2 re-verified — corrections that change the work

| Spec says | Repo actually has | Consequence |
|---|---|---|
| Ships as 1.5.0, current 1.4.1 | `package.json` is **1.5.1**; CHANGELOG already has `## [1.5]` with 1.5.0 and 1.5.1 | Ship as **1.6.0**: open `## [1.6]`, compress the 1.5 patch list to one line per the CHANGELOG rules |
| Fifth tab; `VIEWS = ['typer','explorer','model','compare']` | `VIEWS = ['typer','explorer','compare']`; `model` is a `LEGACY_VIEWS` alias to Explorer (1.5.0 folded it in) | Stack is the **fourth** tab. `navigation.test.jsx` has a "has exactly three tabs" test that must become four. Spec text saying "fifth" / "existing four" means "new" / "existing three" |
| `.nav-btn` is `flex:1; font-size:13px` | Confirmed, plus `white-space:nowrap; padding:8px 6px` on phones | Four labels at 360px: 4 × (~55px text + 12px padding) fits inside the ~310px tab strip. Verify in Chromium (session 2), not just by arithmetic |
| `baseCSS` honors `prefers-reduced-motion` | It only sets `transition:none` — no `animation:none` | Add `animation:none!important` to that block when the pulse keyframe is added |
| `POSITIONS` has `brief` | Confirmed. `SHADOW_TEMPLATES` covers positions 5–8 only | New position content lives in a new module, not in `shadow.js` |
| `data/levels.js` exports `LEVELS` | Confirmed: `LEVELS[type].{healthy,average,unhealthy}` each with `range`, `title`, `description`, `behaviors` | Level→tier bridge is `1–3 → healthy`, `4–6 → average`, `7–9 → unhealthy` |
| `ComparePage` receives no nav props | Confirmed: `export default function ComparePage()` | Thread `setView` from `App.jsx` |
| Everything else in §2 | Confirmed (`getFullStack`, `instantiateTemplate`, `FnBadge`, `G`/`FC`, `useScrollToTop`, storage keys) | — |

Pre-existing doc drift found on the way (fix in session 5, note in CHANGELOG):
`CLAUDE.md` view LOC column (GuidedTyper ~785 → 1363, ComparePage ~607 → 1176, Explorer
~820 → 841); `README.md` says Explorer ~334 LOC and lists three tabs in the architecture
sketch; both files' test-file tables omit `cognitive-harmony`, `combinations`,
`group-analysis`, `group`, `subtypes` test files.

---

## 2. Decisions taken on the spec's open questions

These are defaults chosen so the sessions can run unattended. Each is reversible in one
place. Owner can overrule any of them before session 1 starts.

1. **Function-naming in captured copy (spec §6 "your Te stops…" vs §3 "do not paraphrase").**
   §5.2 prose has no `{fn}` slots and rewriting it into second person would be authoring.
   Resolution: the §5.2 sentences ship verbatim. The function is named in a generated
   *header line* on every block and node, produced from a small set of templates that are
   labels, not framework claims: `'{fn} · Position {pos} {name} · captured at Level {level}'`
   and `'{fnName} ({fn}) at {name}'`. These live in the new data module with `{fn}` /
   `{fnName}` placeholders so `instantiateTemplate`-style substitution is reused.
   Acceptance criterion 5 (ENFP Refuge → Te) is asserted against that header. If the owner
   wants the prose itself to read "your Te…", they supply templated sentences; slot them
   into `PURPOSES[pos].captured` and nothing else changes.
2. **Edge explanation copy** is the §4 "meaning" column verbatim plus the endpoints
   (`Anchor → Lead`). No further text exists; do not write any.
3. **Stack deep-link query.** `#/stack?type=ENFP&level=5`. `type` is validated against
   `MBTI_TYPES` and `level` clamped to 1–9; anything else falls back to `typer_mbti`, then
   to positions-only. This is what the GuidedTyper and Compare entry points emit, and it
   makes every state shareable. `App.setView(next, query?)` gains an optional query argument.
4. **Hunger badge** ships as `Type {n} installs here` only (spec §9). No substrate copy.
5. **Lead-utility matrix** is out. Session 5 records it under CHANGELOG "Not included" and
   in CLAUDE.md so nobody infers the missing cells later.
6. **CT branding** goes into the 1.6.0 CHANGELOG entry as a deliberate product decision.
7. **Selected type is not persisted** to localStorage. The view reads `typer_mbti` on mount;
   nothing new is written. No new storage key, so the CLAUDE.md table gains no row.
8. **Replay uses `setInterval` at 1200ms**, cleared on cancel/unmount/scrub. Reduced motion
   is detected with `window.matchMedia` guarded for absence (jsdom has none).

---

## 3. Target architecture

```
frontend/src/
  data/stack.js              NEW  all Stack content + edge table + capture order (strings only, no logic)
  utils/stack.js             NEW  pure helpers: capture state, geometry, template substitution, query parsing
  components/StackDiagram.jsx NEW  inline-SVG diagram (nodes, edges, hit paths, data- attributes)
  views/StackView.jsx        NEW  page: type selector, scrubber, caveat, narration, purpose panel, replay, personalization
  utils/route.js             EDIT VIEWS gains 'stack'
  components/AppNav.jsx      EDIT NAV_ITEMS gains { id:'stack', label:'Stack' } (4th)
  App.jsx                    EDIT render StackView; setView(next, query); pass setView to ComparePage
  views/GuidedTyper.jsx      EDIT MBTI result screen link → stack?type=…
  views/ComparePage.jsx      EDIT Shadow Stack section link(s) → stack?type=…
  styles/theme.js            EDIT @keyframes stack-pulse + reduced-motion animation:none
  test/stack-data.test.js    NEW  integrity + deny-list
  test/stack-logic.test.js   NEW  capture state (table-driven 1–9), geometry, query parsing, templates
  test/stack-view.test.jsx   NEW  view behaviour
  test/navigation.test.jsx   EDIT 4 tabs, #/stack routing
  test/route.test.js         EDIT 'stack' in VIEWS, query passthrough
  test/guided-typer.test.jsx EDIT MBTI-result entry point
  test/compare-page.test.jsx EDIT Shadow Stack entry point
```

### 3.1 `data/stack.js` — exported shapes (content transcribed from spec §4–§5)

```js
export const STAGE_BANDS = ['Pre-colonization', 'Boundary', 'Maintenance', 'Reality-testing', 'Terminal'];

// index = level 1..9; level 1 captures nothing
export const CAPTURE_ORDER = {
  1: { pos: null, band: 'Pre-colonization' },
  2: { pos: 4, band: 'Boundary' },        3: { pos: 5, band: 'Boundary' },
  4: { pos: 3, band: 'Maintenance' },     5: { pos: 6, band: 'Maintenance' },
  6: { pos: 2, band: 'Reality-testing' }, 7: { pos: 7, band: 'Reality-testing' },
  8: { pos: 1, band: 'Terminal' },        9: { pos: 8, band: 'Terminal' },
};

// Augusta classification, keyed by position
export const CLASSIFICATION = { 1:'Strong + Valued', 2:'Strong + Valued', 3:'Weak + Valued', 4:'Weak + Valued',
                                5:'Strong + Unvalued', 6:'Strong + Unvalued', 7:'Weak + Unvalued', 8:'Weak + Unvalued' };

// §5.2 verbatim. No placeholders in these strings (see plan §2.1).
export const PURPOSES = { 1: { native: '…', captured: '…' }, /* … 8 */ };

// §5.3 verbatim, keyed by level. `title` is the bold label ('1', '2 · Hunger', …).
export const LEVEL_NARRATION = { 1: { title: '1', text: '…' }, /* … 9 */ };

export const EQUILIBRIUM_CAVEAT = '…';           // §5.4 first paragraph, verbatim

export const COUNTER_THREAT_OUTPUT = { Ni: 'convergent trajectory certainty', /* … all 8 */ };

// §4 edge table. `meaning` verbatim. `weight` marks the load-bearing spine.
export const EDGES = [
  { id: 'gate',      from: 2, to: 1, label: 'gate',       meaning: '…', weight: 'normal' },
  { id: 'writeback', from: 6, to: 2, label: 'write-back', meaning: '…', weight: 'spine'  },
  { id: 'sample',    from: 3, to: 6, label: 'sample',     meaning: '…', weight: 'spine'  },
  { id: 'monitor',   from: 4, to: 5, label: 'monitor',    meaning: '…', weight: 'normal' },
  { id: 'check',     from: 2, to: 7, label: 'check',      meaning: '…', weight: 'normal' },
  { id: 'trigger',   from: 1, to: 8, label: 'trigger',    meaning: '…', weight: 'normal' },
];

// §6 scrubber "suggested active edges"
export const ACTIVE_EDGES = { 1: [], 2: [], 3: ['monitor'], 4: [], 5: ['sample','writeback'],
                              6: ['writeback','gate'], 7: ['check'], 8: ['gate'], 9: ['trigger'] };

// Label templates (plan §2.1). {fn} {fnName} {pos} {name} {level} placeholders.
export const LABEL_TEMPLATES = {
  positionOnly:  'Position {pos} · {name}',
  positionLevel: 'Position {pos} · captured at Level {level}',
  fnAtPosition:  '{fnName} ({fn}) at {name}',
  hungerBadge:   'Type {type} installs here',
  bridgeNote:    '…one sentence flagging LEVELS text as an interpretive bridge, not an equivalence…',
};
```

The `bridgeNote` sentence is the only line of copy not in the spec. Keep it to one neutral
sentence such as `Riso-Hudson tier language for your Enneagram type, offered as an
interpretive bridge — the two scales are not equivalent.` It is UI chrome, not framework prose.

### 3.2 `utils/stack.js` — pure helpers

```js
captureLevelOf(pos)           → 2..9            (inverse of CAPTURE_ORDER)
capturedAt(level)             → number[]        positions captured at levels 2..level, in capture order; [] at 1
captureState(level)           → { level, band, justCaptured: pos|null, captured: number[], activeEdges: string[] }
isCaptured(pos, level)        → boolean
fillTemplate(str, vars)       → replaces {fn} {fnName} {pos} {name} {level} {type}; missing keys left intact
positionLabel(pos, level?)    → 'Position 6 · captured at Level 5'
tierForLevel(level)           → 'healthy' | 'average' | 'unhealthy'
parseStackQuery(query)        → { type: 'ENFP'|null, level: 1..9|null }    (validates against MBTI_TYPES)
readSavedTypes()              → { mbti: 'ENFP'|null, enn: 4|null }          (never throws; malformed → null)
counterThreatOutput(type)     → { fn, form } | null   (uses getFullStack(type)[4])

stackLayout(opts?)            → { viewBox: [0,0,360,560],
                                  nodes: { [pos]: { pos, x, y, w, h, cx, cy, col: 'ego'|'shadow', row: 0..3 } },
                                  edges: [{ id, from, to, d, labelX, labelY, weight }] }
```

Geometry (starting point — adjust if a screenshot reads badly, but keep the invariants):

- Node `w=130 h=72`. Ego column `x=16`, shadow column `x=214`, so the channel between
  columns is `x∈[146,214]`. Rows `y = 24, 156, 288, 420`. Ego 1→4 top→bottom on the left,
  shadow 5→8 top→bottom on the right.
- `gate` is a short vertical in the ego column: Anchor top-centre → Lead bottom-centre.
- `writeback` is horizontal on row 2: Critic left-mid → Anchor right-mid, offset 12 units
  above the row centre; `check` leaves Anchor's right edge 12 units below centre, and
  `sample` arrives at Critic's left edge 12 units below centre, so the two attachments on
  each node don't share a point.
- `sample`, `check`, `monitor`, `trigger` are cubic Béziers with horizontal tangents that
  stay inside the channel. They cross each other — that is acceptable. They must not enter
  any node rectangle.
- Invariants the geometry test asserts: all 8 nodes present; ego `x` < shadow `x`; rows
  strictly increasing within each column; no two node rects overlap; every edge's start and
  end points lie on the boundary of its `from` / `to` node; sampling each Bézier at
  t=0.05…0.95 yields no point strictly inside any node rect; `writeback` and `sample` carry
  `weight:'spine'`.

### 3.3 `components/StackDiagram.jsx`

Props: `{ type|null, level, selected: {kind:'node'|'edge', id}|null, onSelect, fixationType|null }`.

- `<svg viewBox="0 0 360 560" width="100%" role="group" aria-label="Eight-position stack diagram">`.
- Each node is a `<g role="button" tabIndex=0 aria-label=… data-pos data-captured data-just-captured data-selected data-fn>`
  with a `<rect>` and text: `{pos} {NAME}` line, function badge line (when `type`), and the
  classification line. Enter/Space call `onSelect`. Node stroke uses `FC[fn]` when a type is
  set, `POS[pos]` otherwise. Captured tint = `alpha(colour, 0.22)` fill; just-captured adds
  `className="stack-pulse"`.
- Each edge renders three paths: the visible stroke, an arrowhead marker, and a transparent
  hit path (`stroke-width:22`, `pointer-events:stroke`, `role="button" tabIndex=0 aria-label="write-back: Critic to Anchor" data-edge data-active`).
  Spine edges use `stroke-width:3.5` and `G.gold`; others `2` and `G.textDim`; active edges
  switch to full-opacity function/gold colour.
- Edge label `<text>` at `labelX/labelY` with a `G.bg` halo (paint-order stroke) so it stays readable over crossings.
- Hunger node gets a small badge text `Type 4 installs here` when `fixationType` is set.

### 3.4 `views/StackView.jsx`

Sections top to bottom (mobile), all inside `S.page`/`S.container`:

1. Heading `Stack` (h1) + one-line intro (from spec §1 sentence 1 is fine: this is chrome).
2. Type selector: `<select aria-label="MBTI type">` with `Positions only` + 16 types.
   Initial value: `parseStackQuery(hash).type ?? readSavedTypes().mbti ?? null`.
3. Personalize bar (only when both saved types exist and the user hasn't dismissed it):
   `Personalize for ENFP · Type 4` button → sets type, fixationType, shows Counter form.
4. Diagram.
5. Scrubber card: `<input type="range" min=1 max=9 aria-label="Health level">`, label line
   `Level 5 · Maintenance · captures Critic (Position 6)`, `Replay` / `Cancel` button, the
   §5.4 caveat as an always-rendered paragraph directly under the range (no collapse, no
   toggle), and the §5.3 narration for the current level. Personalized: the `LEVELS[enn][tier]`
   title + description beneath, prefixed by the bridge note.
6. Purpose panel for the selected node (default selection: position 1): two blocks in a
   `display:grid; gridTemplateColumns: repeat(auto-fit, minmax(240px, 1fr))` so they sit
   side by side ≥ ~520px and stack on phones. Header line per block uses `LABEL_TEMPLATES`.
   Captured block has `data-state="inert"|"active"`; inert = `opacity:0.45` with the label
   `Captured at Level N`, never hidden. Edge selection replaces the panel with the edge's
   `meaning` and endpoints.
7. Counter threat-output line (personalized or whenever a type is set): `Counter (Ni): convergent trajectory certainty`.

`useScrollToTop()` on mount only (there are no sub-tabs). Level and selection changes must
not scroll.

---

## 4. Sessions

Conventions for every session: work on branch `claude/stack-navigation-view-xhyksj`;
read `CLAUDE.md` and `docs/specs/stack-view.md` first; write the failing test before the
code; never hardcode colours (`theme.test.js` will fail the suite); no Beebe terms, no
deny-list terms anywhere in new code or comments; commit with a descriptive message;
`cd frontend && npm test && npm run build` green before the commit; push with
`git push -u origin claude/stack-navigation-view-xhyksj`.

### Session 1 — Content module and pure logic

**Context.** Nothing Stack-related exists yet. `data/shadow.js` has `POSITIONS`
(pos/name/arc/brief). `utils/shadow.js` has `getFullStack(type)` and `instantiateTemplate`.
`data/mbti.js` has `MBTI_TYPES`. This session adds the content and logic layers only; no
React.

**Do.**
1. Create `frontend/src/test/stack-data.test.js`:
   - `CAPTURE_ORDER` has keys 1–9; level 1 `pos` is null; levels 2–9 positions are exactly
     `[4,5,3,6,2,7,1,8]` in that order; arcs alternate ego/shadow (derive arc from
     `POSITIONS`); bands match spec §5.1 per level.
   - `CLASSIFICATION` maps 1–2, 3–4, 5–6, 7–8 to the four Augusta labels.
   - `PURPOSES` has 8 entries each with non-empty `native` and `captured`.
   - `LEVEL_NARRATION` has 9 entries; titles for 2–9 name the captured position
     (`'5 · Critic'`).
   - `EDGES`: 6 unique ids matching spec §4; `from`/`to` in 1–8 and exactly as tabled;
     `writeback` and `sample` are `spine`.
   - `ACTIVE_EDGES` has keys 1–9 and every id it references exists in `EDGES`.
   - `COUNTER_THREAT_OUTPUT` has exactly the 8 function keys of `COG_FUNCTIONS`.
   - **Deny-list test** (spec §7.10): walk every export of `data/stack.js` recursively,
     collect every string, and assert none matches
     `/\bexile\b/i, /substituting/i, /offline/i, /firewall/i, /kamikaze/i`, plus the Beebe
     terms `/\bopposing\b/i, /critical parent/i, /trickster/i, /\bdemon\b/i`. Also scan the
     raw source text of `data/stack.js` and `utils/stack.js` (via `readFileSync`, the way
     `theme.test.js` does) so comments are covered.
   - Level ≠ position: `positionLabel(6, 5)` returns a string containing both `Position 6`
     and `Level 5`, and `positionLabel(2, 6)` contains `Position 2` and `Level 6`.
2. Create `frontend/src/test/stack-logic.test.js`:
   - Table-driven over levels 1–9: `captureState(l).captured` equals the expected cumulative
     list; `justCaptured` equals `CAPTURE_ORDER[l].pos`; sets are strictly nested (`l` ⊂ `l+1`);
     level 1 is empty; `activeEdges` equals `ACTIVE_EDGES[l]`.
   - `captureLevelOf` inverts `CAPTURE_ORDER` for all 8 positions.
   - `tierForLevel`: 1–3 healthy, 4–6 average, 7–9 unhealthy.
   - `fillTemplate` substitutes all placeholders and leaves unknown ones intact.
   - `parseStackQuery`: `'type=ENFP&level=5'` → `{type:'ENFP', level:5}`; bad type → null;
     level 0/10/'x' → null; empty → both null.
   - `readSavedTypes`: absent → nulls; malformed JSON → nulls, no throw; valid → values.
   - `counterThreatOutput('ENFP')` → `{ fn:'Ni', form: 'convergent trajectory certainty' }`.
   - `stackLayout()` invariants from plan §3.2 (no overlap, ordering, endpoints on node
     boundary, Bézier samples outside all rects, spine weights). Implement a tiny
     `bezierPoint(p0,p1,p2,p3,t)` in the test or export it from the util.
3. Create `frontend/src/data/stack.js` and `frontend/src/utils/stack.js` to make the tests pass.
   Transcribe §5.1–§5.5 and §4 strings verbatim from `docs/specs/stack-view.md`.
   Copy the spec's exact punctuation, including em-dashes and italics markers removed
   (`*gated*` becomes `gated`).

**Definition of done.** Both new test files green; `npm test` 100% green; no React files
touched; `git grep -niE 'exile|substituting|offline|firewall|kamikaze|opposing|trickster|demon|critical parent' frontend/src/data/stack.js frontend/src/utils/stack.js` returns nothing.

**Verify.** `cd frontend && npm test -- stack && npm test && npm run build`.

### Session 2 — Route, nav, view shell, entry points, version bump

**Context.** `data/stack.js` and `utils/stack.js` exist (verify:
`ls frontend/src/data/stack.js frontend/src/utils/stack.js`). Routing is
`utils/route.js` (`VIEWS`, `parseHash`, `buildHash`); nav is `components/AppNav.jsx`
(`NAV_ITEMS`, three tabs, `data-view`, `aria-current`); `App.jsx` renders views by `view`
string and passes `setView` to `GuidedTyper` only. `navigation.test.jsx` asserts exactly
three tabs today.

**Do.**
1. Tests first:
   - `route.test.js`: `VIEWS` contains `'stack'`; `parseHash('#/stack?type=ENFP&level=5')`
     → `{view:'stack', query:'type=ENFP&level=5'}`; `buildHash('stack','type=ENFP')` →
     `'#/stack?type=ENFP'`.
   - `navigation.test.jsx`: four tabs, in order Typer/Explorer/Compare/Stack; clicking
     `button[data-view="stack"]` shows `heading Stack` level 1 and writes `#/stack`;
     booting with `#/stack` lands on Stack; `hashchange` to `#/stack` switches;
     `aria-current` moves; `window.scrollTo` called on switch.
   - `guided-typer.test.jsx`: on the MBTI result screen a link/button named
     `/see .* in the stack/i` (or similar) calls `setView('stack', 'type=XXXX')` with the
     result type (follow the existing "deep-links to the MBTI type" test pattern).
   - `compare-page.test.jsx`: with two MBTI-typed people, the Shadow Stack section renders
     one entry point per person that calls the `setView` prop with `('stack', 'type=…')`.
   - `stack-view.test.jsx` (first tests only): renders `heading Stack`; renders the type
     `<select>` defaulting to `Positions only` with empty storage, to the saved type with
     valid `typer_mbti`, and to `Positions only` with malformed `typer_mbti`; honours
     `#/stack?type=INTJ`.
2. Implement: add `'stack'` to `VIEWS`; add `{ id:'stack', label:'Stack' }` to `NAV_ITEMS`;
   `App.setView(next, query = '')` writes `buildHash(next, query)` when it differs from the
   current hash; render `<StackView />` for `view === 'stack'`; pass `setView` to
   `ComparePage`; add the two entry points. `StackView.jsx` at this stage: heading, intro
   line, type selector, `useScrollToTop()`. No diagram yet.
3. Bump `frontend/package.json` to `1.6.0`. In `CHANGELOG.md` compress the `## [1.5]` patch
   entries into one summary line and open `## [1.6]` / `### 1.6.0 — <date>` with a first
   bullet for the new view (session 5 completes the entry).
4. Nav width check: `npm run build && npm run preview` then a Playwright script from the
   scratchpad (`chromium` at `/opt/pw-browsers/chromium`, viewport 360×740) that screenshots
   the nav and asserts `scrollWidth === clientWidth` on `.nav-tabs` and that each
   `.nav-btn` has a single line (`getBoundingClientRect().height` < 40). If a label wraps,
   reduce `.nav-btn` padding to `8px 4px` inside the `@media(max-width:680px)` block. Do
   not go icon-only.

**Definition of done.** `#/stack` reachable by tab, hash, back/forward, refresh; entry
points wired; 360px nav screenshot clean; `npm test` green; build clean; package at 1.6.0.

**Verify.** `cd frontend && npm test && npm run build`; Playwright nav check as above.

### Session 3 — Diagram and scrubber

**Context.** `StackView.jsx` exists with heading and type selector; `utils/stack.js` exports
`stackLayout`, `captureState`, `isCaptured`; `data/stack.js` exports `EDGES`,
`ACTIVE_EDGES`, `CLASSIFICATION`, `EQUILIBRIUM_CAVEAT`, `LEVEL_NARRATION`. `POS` and `FC`
colour maps and `alpha()` live in `styles/theme.js`. `baseCSS` there is the only place for
keyframes and breakpoint rules.

**Do.**
1. Tests first, in `stack-view.test.jsx` (render `<StackView />` directly; `localStorage.clear()`
   and `window.location.hash=''` in `beforeEach`):
   - 8 elements `[data-pos]` and 6 `[data-edge]` render; each has an accessible name
     (`getAllByRole('button', { name: /critic/i })` etc.).
   - Range input `aria-label` "Health level" exists with min 1, max 9, default 1.
   - Table-driven 1–9: after `fireEvent.change(range, {target:{value:l}})`, the set of
     `[data-captured="true"]` positions equals `captureState(l).captured`;
     `[data-just-captured="true"]` is the just-captured node or absent at level 1;
     `[data-active="true"]` edges equal `ACTIVE_EDGES[l]`.
   - Scrubber label text contains `Level 5`, `Maintenance`, and `Critic`, and the
     `Position 6 · captured at Level 5` pattern (assert with a regex that the two numbers
     differ).
   - The caveat paragraph (`EQUILIBRIUM_CAVEAT` first sentence) is in the document at every
     level (loop 1–9).
   - Narration text for the current level matches `LEVEL_NARRATION[l].text`.
   - Clicking a node sets `data-selected="true"` on it; pressing Enter/Space on a focused
     node or edge selects it; clicking an edge shows its `meaning` text.
   - With type `ENFP` selected, node 3 has `data-fn="Te"` and node 5 `data-fn="Ni"`;
     with positions only, no `data-fn`.
2. Implement `components/StackDiagram.jsx` per plan §3.3 and wire it into `StackView` with
   the scrubber card (range, label line, caveat, narration). Add to `baseCSS`:
   `@keyframes stack-pulse{…}` (scale/opacity on the rect via `transform-box:fill-box;
   transform-origin:center`), `.stack-pulse{animation:stack-pulse 1.1s ease-out 2}`, and
   `animation:none!important` inside the existing reduced-motion block. Edge hit paths are
   transparent strokes of width 22.
3. Screenshot at 360×740 and ~900px wide via Playwright; confirm the write-back edge is
   visibly the heaviest stroke and reads as the highlighted pair at L5 and L6. Adjust
   `stackLayout` coordinates if labels collide, then re-run the geometry test.

**Definition of done.** All diagram/scrubber tests green; screenshots reviewed; `theme.test.js`
still green (no literals in the new component); build clean.

**Verify.** `cd frontend && npm test -- stack && npm test && npm run build`.

### Session 4 — Purpose panel, replay, personalization

**Context.** `StackView` renders type selector, `StackDiagram`, scrubber, caveat, narration;
node/edge selection state exists (`selected`). `data/stack.js` has `PURPOSES`,
`LABEL_TEMPLATES`, `COUNTER_THREAT_OUTPUT`; `utils/stack.js` has `fillTemplate`,
`positionLabel`, `captureLevelOf`, `tierForLevel`, `readSavedTypes`, `counterThreatOutput`.
`data/levels.js` exports `LEVELS[ennType].{healthy,average,unhealthy}` with `title`,
`description`. `getFullStack(type)` in `utils/shadow.js`.

**Do.**
1. Tests first (`stack-view.test.jsx`; use `vi.useFakeTimers()` for replay):
   - Default selection is position 1; panel shows `PURPOSES[1].native` and `PURPOSES[1].captured`
     both in the document; captured block `data-state="inert"` at level 1..7 and `"active"`
     at 8 and 9 (table-driven via `captureLevelOf`). Repeat for position 6 (inert ≤4,
     active ≥5) — this pins the level/position collision.
   - Both blocks remain in the DOM after activation (never replaced).
   - Header line with `ENFP` selected and position 3 selected contains `Te`; position 5
     contains `Ni`; with positions only it contains `Refuge` and no function abbreviation.
   - Header line contains `Position 6` and `captured at Level 5` for position 6.
   - Replay: click `Replay`; advance timers 1200ms × 8; range value reaches 9; `Cancel`
     mid-way stops advancement; unmount clears the interval (no act warnings). With
     `window.matchMedia` mocked to `matches:true` for reduced motion, clicking `Replay`
     jumps straight to 9.
   - Personalization: with valid `typer_mbti` + `typer_enn` in storage a `Personalize`
     control appears; activating it sets the select to the saved type, Hunger node shows
     `Type 4 installs here`, Counter line shows `Ni` and `convergent trajectory certainty`,
     and the `LEVELS[4][tier]` title for the current level is shown with the bridge note.
     With only one key present, or malformed JSON in either, no control appears and nothing
     throws.
2. Implement per plan §3.4 items 3, 5 (replay + LEVELS bridge), 6, 7.

**Definition of done.** Acceptance criteria 4, 5, 6, 8, 9 each have at least one test; all
green; build clean.

**Verify.** `cd frontend && npm test -- stack && npm test && npm run build`.

### Session 5 — Documentation, drift fixes, final acceptance pass

**Context.** The Stack view is complete on the branch. `CHANGELOG.md` has a `## [1.6]` /
`1.6.0` section with a first bullet. `package.json` is 1.6.0. Three docs must describe the
shipped code: `README.md`, `CHANGELOG.md`, `CLAUDE.md`.

**Do.**
1. `CHANGELOG.md` 1.6.0 entry: the Stack view (what it teaches, scrubber, purpose panel,
   personalization, entry points, `#/stack?type=&level=` deep link); the fourth tab;
   `App.setView(view, query)`; `ComparePage` now receives `setView`; new tests; **the
   deliberate CT-branding decision** (spec §9); **Not included:** Lead-utility matrix
   (anchors known: Te×3 high, Ni×4 high, Se×8 high, Fi×3 low, Se×5 low — remaining cells
   are not to be inferred) and fixation substrate copy for the Hunger badge; doc-drift fixes
   from plan §1.
2. `CLAUDE.md`: Project Overview (four views); Views table (+`StackView.jsx`, and correct
   the LOC column for all four existing views); Components (+`StackDiagram.jsx`); Data
   (+`stack.js`, and `levels.js` which is currently undocumented); Utils (+`stack.js`;
   `route.js` line mentions `stack`); Styles (`stack-pulse` keyframe, reduced-motion covers
   animations); Test file table (+`stack-data`, `stack-logic`, `stack-view`, and the five
   already-missing files); No Router section (`#/stack`, `setView(view, query)`); View
   Switching diagram; a Core Conventions entry "Stack terminology guard" pointing at the
   deny-list test and the level ≠ position rule; a Common Pitfall for `matchMedia` absence
   in jsdom. Wherever the spec is referenced, cite `docs/specs/stack-view.md`.
3. `README.md`: Features gets a `### Stack` section; architecture sketch shows four views
   and `ComparePage setView`; project structure gains `docs/`, `data/stack.js`,
   `utils/stack.js`, `components/StackDiagram.jsx`, `views/StackView.jsx`; fix Explorer LOC
   and the test-file list.
4. Final acceptance pass against spec §7 items 1–11: run each in the browser via Playwright
   at 360px and 900px (tab, hash, back/forward, refresh; tap a node and an edge; scrub 1→9;
   reduced-motion emulation `page.emulateMedia({reducedMotion:'reduce'})` then Replay;
   corrupt `localStorage.typer_mbti='{'` then load `#/stack`). Fix anything that fails,
   with a regression test.

**Definition of done.** `git grep -n "1.5.1\|three tabs\|Three tabs" README.md CLAUDE.md`
shows nothing stale; every table in CLAUDE.md names a file that exists; `npm test` green;
`npm run build` clean; branch pushed.

**Verify.** `cd frontend && npm test && npm run build`; `git status` clean after commit.

---

## 5. Out of scope (recorded so it is not rediscovered)

- Lead-utility × fixation matrix and the stakes slider (spec §9). Needs an owner-supplied
  8×9 matrix with rationale per cell.
- Substrate / strategy / direction copy on the Hunger badge.
- Persisting the Stack view's selected type or level.
- Any Explorer or Compare redesign around the new position content. Existing
  `SHADOW_TEMPLATES` copy in Explorer's MBTI detail is left untouched; only a link is added
  from Compare.
