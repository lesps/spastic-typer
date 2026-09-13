import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as STACK from '../data/stack.js';
import { POSITIONS } from '../data/shadow.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { positionLabel } from '../utils/stack.js';

const {
  STAGE_BANDS, CAPTURE_ORDER, CLASSIFICATION, PURPOSES, LEVEL_NARRATION,
  EQUILIBRIUM_CAVEAT, COUNTER_THREAT_OUTPUT, EDGES, ACTIVE_EDGES, LABEL_TEMPLATES,
} = STACK;

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const POS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];
const nameOf = (pos) => POSITIONS[pos - 1].name;
const arcOf = (pos) => POSITIONS[pos - 1].arc;

describe('stack data — capture order (spec §5.1)', () => {
  it('covers levels 1–9 and nothing else', () => {
    expect(Object.keys(CAPTURE_ORDER).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
  });

  it('captures nothing at level 1', () => {
    expect(CAPTURE_ORDER[1].pos).toBeNull();
    expect(CAPTURE_ORDER[1].band).toBe('Pre-colonization');
  });

  it('captures positions in the order Hunger, Counter, Refuge, Critic, Anchor, Gamble, Lead, Flood', () => {
    expect(LEVELS.slice(1).map(l => CAPTURE_ORDER[l].pos)).toEqual([4, 5, 3, 6, 2, 7, 1, 8]);
  });

  it('alternates ego and shadow arcs from level 2', () => {
    const arcs = LEVELS.slice(1).map(l => arcOf(CAPTURE_ORDER[l].pos));
    expect(arcs).toEqual(['ego', 'shadow', 'ego', 'shadow', 'ego', 'shadow', 'ego', 'shadow']);
  });

  it('assigns the stage bands from the spec table', () => {
    const bands = LEVELS.map(l => CAPTURE_ORDER[l].band);
    expect(bands).toEqual([
      'Pre-colonization', 'Boundary', 'Boundary', 'Maintenance', 'Maintenance',
      'Reality-testing', 'Reality-testing', 'Terminal', 'Terminal',
    ]);
    for (const b of bands) expect(STAGE_BANDS).toContain(b);
  });

  it('captures every position exactly once', () => {
    const captured = LEVELS.slice(1).map(l => CAPTURE_ORDER[l].pos).sort((a, b) => a - b);
    expect(captured).toEqual(POS_NUMS);
  });
});

describe('stack data — Augusta classification', () => {
  it('maps positions 1–2, 3–4, 5–6, 7–8 to the four classes', () => {
    expect(CLASSIFICATION).toEqual({
      1: 'Strong + Valued', 2: 'Strong + Valued',
      3: 'Weak + Valued', 4: 'Weak + Valued',
      5: 'Strong + Unvalued', 6: 'Strong + Unvalued',
      7: 'Weak + Unvalued', 8: 'Weak + Unvalued',
    });
  });
});

describe('stack data — purposes (spec §5.2)', () => {
  it('has a native and captured purpose for all 8 positions', () => {
    expect(Object.keys(PURPOSES).map(Number).sort((a, b) => a - b)).toEqual(POS_NUMS);
    for (const pos of POS_NUMS) {
      expect(PURPOSES[pos].native.length, `native ${pos}`).toBeGreaterThan(20);
      expect(PURPOSES[pos].captured.length, `captured ${pos}`).toBeGreaterThan(20);
    }
  });

  it('keeps the spec wording for the payload rows', () => {
    expect(PURPOSES[6].native).toMatch(/^The auditor, and Anchor's update mechanism\./);
    expect(PURPOSES[6].captured).toMatch(/Write-back now writes fixation-shaped updates into Anchor\.$/);
    expect(PURPOSES[1].captured).toMatch(/Lead is gated rather than captured/);
  });
});

describe('stack data — level narration (spec §5.3)', () => {
  it('has an entry for every level', () => {
    expect(Object.keys(LEVEL_NARRATION).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
  });

  it('titles levels 2–9 with the captured position name', () => {
    expect(LEVEL_NARRATION[1].title).toBe('1');
    for (const l of LEVELS.slice(1)) {
      expect(LEVEL_NARRATION[l].title).toBe(`${l} · ${nameOf(CAPTURE_ORDER[l].pos)}`);
      expect(LEVEL_NARRATION[l].text.length).toBeGreaterThan(20);
    }
  });
});

describe('stack data — equilibrium caveat (spec §5.4)', () => {
  it('is the gradient-not-a-schedule paragraph', () => {
    expect(EQUILIBRIUM_CAVEAT).toMatch(/^The sequence is a gradient, not a schedule\./);
    expect(EQUILIBRIUM_CAVEAT).toMatch(/not by elapsed time\.$/);
  });
});

describe('stack data — Counter threat-output forms (spec §5.5)', () => {
  it('is keyed by exactly the eight cognitive functions', () => {
    expect(Object.keys(COUNTER_THREAT_OUTPUT).sort()).toEqual(Object.keys(COG_FUNCTIONS).sort());
  });
  it('carries the spec forms', () => {
    expect(COUNTER_THREAT_OUTPUT.Ni).toBe('convergent trajectory certainty');
    expect(COUNTER_THREAT_OUTPUT.Te).toBe('outcome-failure ledger');
    expect(COUNTER_THREAT_OUTPUT.Se).toBe('immediate-environment threat read');
  });
});

describe('stack data — edges (spec §4)', () => {
  it('has six uniquely identified edges', () => {
    expect(EDGES).toHaveLength(6);
    expect(new Set(EDGES.map(e => e.id)).size).toBe(6);
  });

  it('matches the spec endpoints', () => {
    const byId = Object.fromEntries(EDGES.map(e => [e.id, [e.from, e.to]]));
    expect(byId).toEqual({
      gate: [2, 1], writeback: [6, 2], sample: [3, 6],
      monitor: [4, 5], check: [2, 7], trigger: [1, 8],
    });
  });

  it('keeps every endpoint in 1–8 and carries a label and meaning', () => {
    for (const e of EDGES) {
      expect(e.from).toBeGreaterThanOrEqual(1); expect(e.from).toBeLessThanOrEqual(8);
      expect(e.to).toBeGreaterThanOrEqual(1);   expect(e.to).toBeLessThanOrEqual(8);
      expect(e.from).not.toBe(e.to);
      expect(e.label).toBeTruthy();
      expect(e.meaning.length).toBeGreaterThan(10);
    }
  });

  it('marks sample and write-back as the load-bearing spine', () => {
    const spine = EDGES.filter(e => e.weight === 'spine').map(e => e.id).sort();
    expect(spine).toEqual(['sample', 'writeback']);
  });
});

describe('stack data — active edges per level (spec §6)', () => {
  it('has keys 1–9 that only reference known edge ids', () => {
    expect(Object.keys(ACTIVE_EDGES).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
    const ids = new Set(EDGES.map(e => e.id));
    for (const l of LEVELS) for (const id of ACTIVE_EDGES[l]) expect(ids.has(id), `${l}:${id}`).toBe(true);
  });
  it('lights write-back across levels 5 and 6', () => {
    expect(ACTIVE_EDGES[5]).toContain('writeback');
    expect(ACTIVE_EDGES[6]).toContain('writeback');
    expect(ACTIVE_EDGES[1]).toEqual([]);
  });
});

describe('stack data — label templates', () => {
  it('exposes the placeholders the util substitutes', () => {
    expect(LABEL_TEMPLATES.positionLevel).toContain('{pos}');
    expect(LABEL_TEMPLATES.positionLevel).toContain('{level}');
    expect(LABEL_TEMPLATES.fnAtPosition).toContain('{fn}');
    expect(LABEL_TEMPLATES.hungerBadge).toContain('{type}');
  });
});

describe('stack data — level ≠ position labelling', () => {
  it('renders Position 6 · captured at Level 5 with both numbers distinct', () => {
    const label = positionLabel(6, 5);
    expect(label).toMatch(/Position 6/);
    expect(label).toMatch(/Level 5/);
    expect(positionLabel(2, 6)).toMatch(/Position 2 · Anchor · captured at Level 6/);
  });
});

// Terminology guard (spec §3, §7.10). Guards future edits, not just this one.
describe('stack data — terminology deny-list', () => {
  const DENY = [
    /\bexile\b/i, /substituting/i, /offline/i, /firewall/i, /kamikaze/i, /conversion window/i,
    // Beebe terms are a standing repo convention
    /\bopposing\b/i, /critical parent/i, /trickster/i, /\bdemon\b/i,
  ];

  const collectStrings = (value, out = []) => {
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(v => collectStrings(v, out));
    else if (value && typeof value === 'object') Object.values(value).forEach(v => collectStrings(v, out));
    return out;
  };

  it('no exported string in data/stack.js uses a denied term', () => {
    const strings = collectStrings(STACK);
    expect(strings.length).toBeGreaterThan(40);
    const offenders = strings.filter(s => DENY.some(rx => rx.test(s)));
    expect(offenders).toEqual([]);
  });

  it.each(['data/stack.js', 'utils/stack.js'])('%s source (including comments) has no denied term', (rel) => {
    const src = readFileSync(join(__dirname, '..', rel), 'utf8');
    const offenders = src.split('\n')
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => DENY.some(rx => rx.test(line)))
      .map(({ line, n }) => `${n}: ${line.trim().slice(0, 100)}`);
    expect(offenders).toEqual([]);
  });
});
