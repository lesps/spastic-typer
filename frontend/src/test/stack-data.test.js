import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as STACK from '../data/stack.js';
import { POSITIONS } from '../data/shadow.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { positionLabel } from '../utils/stack.js';

const {
  SOURCE_DOCS, STAGE_BANDS, MECHANISM, NESTED_PAIRS, DOMAIN_PAIRS, PAIR_NOTES, ROLES,
  CAPTURE_ORDER, CLASSIFICATION, STAGES, PURPOSES, LEVEL_NARRATION, EQUILIBRIUM_CAVEAT,
  CORRESPONDENCE_NOTE, COUNTER_THREAT_OUTPUT, EDGES, ACTIVE_EDGES, LABEL_TEMPLATES,
  UTILITY, UTILITY_DIAGNOSTIC, UTILITY_ANCHORS, THRESHOLDS, GAMBLE_PROPERTIES,
  GAMBLE_SUMMONABILITY, ODD_EVEN,
} = STACK;

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const POS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];
const REPO = join(__dirname, '..', '..', '..');
const nameOf = (pos) => POSITIONS[pos - 1].name;
const arcOf = (pos) => POSITIONS[pos - 1].arc;

/**
 * Provenance. Every prose string in data/stack.js must be a verbatim substring
 * of a checked-in source document. Normalisation strips markdown emphasis and
 * cross-references that point at sections the reader cannot see; it does NOT
 * touch wording or punctuation, so a paraphrase still fails.
 */
const normalize = (s) => s
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .replace(/\s*\((?:§|Part |Appendix )[^)]*\)/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const CORPUS = normalize(SOURCE_DOCS.map(rel => readFileSync(join(REPO, rel), 'utf8')).join('\n'));

// Chrome: names things, makes no framework claim. The one exempt export.
const EXEMPT = new Set(['SOURCE_DOCS', 'LABEL_TEMPLATES']);

const collectStrings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(v => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => collectStrings(v, out));
  return out;
};

describe('stack data — provenance (no authored framework prose)', () => {
  it('reads both source documents', () => {
    expect(SOURCE_DOCS).toEqual(['docs/specs/ct-consolidated.md', 'docs/specs/stack-view.md']);
    expect(CORPUS.length).toBeGreaterThan(20000);
  });

  it('sources every prose string from a checked-in source document', () => {
    const offenders = [];
    for (const [name, value] of Object.entries(STACK)) {
      if (EXEMPT.has(name)) continue;
      for (const s of collectStrings(value)) {
        // Prose has spaces; ids and enum values ('sharp', 'gateFlip', 'Healthy')
        // do not. Checking everything else is stricter than a length cutoff.
        if (!/\s/.test(s)) continue;
        if (!CORPUS.includes(normalize(s))) offenders.push(`${name}: ${s.slice(0, 90)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('names every non-exempt export, so a new one forces a provenance decision', () => {
    expect(Object.keys(STACK).filter(k => EXEMPT.has(k)).sort()).toEqual(['LABEL_TEMPLATES', 'SOURCE_DOCS']);
  });

  it('rejects a paraphrase of a real sentence', () => {
    expect(CORPUS.includes(normalize('Critic samples the pattern of Refuge and updates the standard held by Anchor'))).toBe(false);
  });
});

describe('stack data — capture order', () => {
  it('covers levels 1–9 and nothing else', () => {
    expect(Object.keys(CAPTURE_ORDER).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
  });

  it('captures nothing at level 1 and gives it no stage', () => {
    expect(CAPTURE_ORDER[1].pos).toBeNull();
    expect(CAPTURE_ORDER[1].band).toBeNull();
    expect(CAPTURE_ORDER[1].kind).toBeNull();
  });

  it('captures positions in the order Hunger, Counter, Refuge, Critic, Anchor, Gamble, Lead, Flood', () => {
    expect(LEVELS.slice(1).map(l => CAPTURE_ORDER[l].pos)).toEqual([4, 5, 3, 6, 2, 7, 1, 8]);
  });

  it('alternates ego and shadow arcs from level 2', () => {
    expect(LEVELS.slice(1).map(l => arcOf(CAPTURE_ORDER[l].pos)))
      .toEqual(['ego', 'shadow', 'ego', 'shadow', 'ego', 'shadow', 'ego', 'shadow']);
  });

  it('assigns the four stage bands over levels 2–9', () => {
    expect(LEVELS.slice(1).map(l => CAPTURE_ORDER[l].band)).toEqual([
      'Boundary', 'Boundary', 'Maintenance', 'Maintenance',
      'Reality-testing', 'Reality-testing', 'Terminal', 'Terminal',
    ]);
    for (const l of LEVELS.slice(1)) expect(STAGE_BANDS).toContain(CAPTURE_ORDER[l].band);
  });

  it('captures every position exactly once', () => {
    expect(LEVELS.slice(1).map(l => CAPTURE_ORDER[l].pos).sort((a, b) => a - b)).toEqual(POS_NUMS);
  });

  it('marks Counter and Gamble immediate, Hunger identification, the rest accumulation', () => {
    const kinds = Object.fromEntries(LEVELS.slice(1).map(l => [l, CAPTURE_ORDER[l].kind]));
    expect(kinds).toEqual({
      2: 'identification', 3: 'immediate', 4: 'accumulation', 5: 'accumulation',
      6: 'accumulation', 7: 'immediate', 8: 'accumulation', 9: 'accumulation',
    });
  });

  it('predicts sharp transitions at 2, 3, 6 and 7 and slow ones at 4, 5, 8 and 9', () => {
    expect(LEVELS.slice(1).map(l => CAPTURE_ORDER[l].transition))
      .toEqual(['sharp', 'sharp', 'slow', 'slow', 'sharp', 'sharp', 'slow', 'slow']);
  });

  it('carries the Riso-Hudson name and band for every level', () => {
    expect(LEVELS.map(l => CAPTURE_ORDER[l].rh)).toEqual([
      'Liberation', 'Psychological Capacity', 'Social Value', 'Imbalance / Social Role',
      'Interpersonal Control', 'Overcompensation', 'Violation',
      'Delusion and Compulsion', 'Pathological Destructiveness',
    ]);
    expect(LEVELS.map(l => CAPTURE_ORDER[l].rhBand)).toEqual(
      ['Healthy', 'Healthy', 'Healthy', 'Average', 'Average', 'Average', 'Unhealthy', 'Unhealthy', 'Unhealthy'],
    );
  });
});

describe('stack data — the two pairings', () => {
  it('keeps nested and domain pairs distinct', () => {
    expect(NESTED_PAIRS).toEqual([[1, 8], [2, 7], [3, 6], [4, 5]]);
    expect(DOMAIN_PAIRS).toEqual([[1, 5], [2, 6], [3, 7], [4, 8]]);
    for (const [a, b] of NESTED_PAIRS) expect(DOMAIN_PAIRS).not.toContainEqual([a, b]);
  });

  it('pairs every position exactly once in each scheme', () => {
    for (const pairs of [NESTED_PAIRS, DOMAIN_PAIRS]) {
      expect(pairs.flat().sort((a, b) => a - b)).toEqual(POS_NUMS);
    }
  });

  it('pairs each ego position with a shadow position in both schemes', () => {
    for (const pairs of [NESTED_PAIRS, DOMAIN_PAIRS]) {
      for (const [a, b] of pairs) expect([arcOf(a), arcOf(b)].sort()).toEqual(['ego', 'shadow']);
    }
  });

  it('explains both pairings', () => {
    expect(PAIR_NOTES.domain.length).toBeGreaterThan(0);
    expect(PAIR_NOTES.nested.length).toBeGreaterThan(0);
  });
});

describe('stack data — mechanism', () => {
  it('states adjacency corruption rather than write-back alone', () => {
    expect(MECHANISM.statement).toMatch(/shadow position's corrupted output becomes an ego position's input/);
    expect(MECHANISM.egoToShadow).toMatch(/Hunger→Counter/);
    expect(MECHANISM.shadowToEgo).toMatch(/Counter\(5\)→Refuge\(3\)/);
    expect(MECHANISM.closure).toMatch(/position 0, which does not exist/);
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

describe('stack data — roles', () => {
  it('gives every position its role', () => {
    expect(Object.keys(ROLES).map(Number).sort((a, b) => a - b)).toEqual(POS_NUMS);
    for (const pos of POS_NUMS) expect(ROLES[pos].length).toBeGreaterThan(20);
  });

  it('describes Refuge as the engine and Flood as always-on', () => {
    expect(ROLES[3]).toMatch(/forward motion in active mode, restoration in rest mode/);
    expect(ROLES[8]).toMatch(/always-on background input/);
  });
});

describe('stack data — the four stages', () => {
  it('is one stage per nested pair, in capture order', () => {
    expect(STAGES).toHaveLength(4);
    expect(STAGES.map(s => s.name)).toEqual(STAGE_BANDS);
    for (const s of STAGES) {
      expect(NESTED_PAIRS).toContainEqual([...s.positions].sort((a, b) => a - b));
      expect(s.lost.length).toBeGreaterThan(10);
    }
  });

  it('covers levels 2–9 with no gaps or overlaps', () => {
    expect(STAGES.flatMap(s => s.levels)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('seals each stage at the levels where its two positions are captured', () => {
    for (const s of STAGES) {
      const captured = s.levels.map(l => CAPTURE_ORDER[l].pos).sort((a, b) => a - b);
      expect(captured).toEqual([...s.positions].sort((a, b) => a - b));
    }
  });
});

describe('stack data — purposes', () => {
  it('has native and captured prose for all 8 positions', () => {
    expect(Object.keys(PURPOSES).map(Number).sort((a, b) => a - b)).toEqual(POS_NUMS);
    for (const pos of POS_NUMS) {
      expect(PURPOSES[pos].native.length, `native ${pos}`).toBeGreaterThan(0);
      expect(PURPOSES[pos].captured.length, `captured ${pos}`).toBeGreaterThan(0);
      // 'Not corruption.' is the shortest sentence the source actually gives.
      for (const s of [...PURPOSES[pos].native, ...PURPOSES[pos].captured]) {
        expect(s.length).toBeGreaterThan(10);
      }
    }
  });

  it('describes Refuge natively as an engine, not only as rest', () => {
    expect(PURPOSES[3].native.join(' ')).toMatch(/forward motion/);
  });

  it('describes Flood natively as always-on rather than as an eruption', () => {
    expect(PURPOSES[8].native.join(' ')).toMatch(/Flood is not an eruption; it runs all the time/);
  });

  it('keeps captured Gamble accurate in signal and wrong only in comparator', () => {
    expect(PURPOSES[7].captured.join(' ')).toMatch(/still contains the accurate discrepancy/);
  });

  it('keeps captured Counter proficient', () => {
    expect(PURPOSES[5].captured.join(' ')).toMatch(/proficient defense/);
  });

  it('states the Level 6 gate flip as validating Lead rather than only rejecting it', () => {
    expect(LEVEL_NARRATION[6].text.join(' ')).toMatch(/validates the majority of Lead's outputs/);
  });
});

describe('stack data — level narration', () => {
  it('has an entry for every level', () => {
    expect(Object.keys(LEVEL_NARRATION).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
  });

  it('titles levels 2–9 with the captured position name', () => {
    expect(LEVEL_NARRATION[1].title).toBe('1');
    for (const l of LEVELS.slice(1)) {
      expect(LEVEL_NARRATION[l].title).toBe(`${l} · ${nameOf(CAPTURE_ORDER[l].pos)}`);
    }
  });

  it('carries panel text and expander text as verbatim sentence arrays', () => {
    for (const l of LEVELS) {
      expect(Array.isArray(LEVEL_NARRATION[l].text)).toBe(true);
      expect(LEVEL_NARRATION[l].text.length).toBeGreaterThan(0);
      expect(Array.isArray(LEVEL_NARRATION[l].more)).toBe(true);
    }
  });

  it('carries the falsifier where the source states one', () => {
    for (const l of [3, 7, 9]) expect(LEVEL_NARRATION[l].falsifier).toBeTruthy();
    for (const l of [1, 2, 4, 5, 6, 8]) expect(LEVEL_NARRATION[l].falsifier).toBeNull();
  });

  it('does not present level 1 as a starting state', () => {
    expect(LEVEL_NARRATION[1].more.join(' ')).toMatch(/not a developmental state anyone starts in/);
  });
});

describe('stack data — equilibrium caveat', () => {
  it('reads level as a state and places equilibrium at Reality-testing', () => {
    expect(EQUILIBRIUM_CAVEAT.join(' ')).toMatch(/Operating level is a state, not a trait/);
    expect(EQUILIBRIUM_CAVEAT.join(' ')).toMatch(/Equilibrium stabilizes at Reality-testing with Gamble intact/);
  });

  it('does not place equilibrium at Maintenance', () => {
    expect(EQUILIBRIUM_CAVEAT.join(' ')).not.toMatch(/stabilizes around Maintenance/);
  });
});

describe('stack data — Riso-Hudson correspondence', () => {
  it('treats the levels as generated rather than merely analogous', () => {
    expect(CORRESPONDENCE_NOTE.join(' ')).toMatch(/generated output rather than borrowed description/);
  });
});

describe('stack data — Counter threat output', () => {
  it('is keyed by exactly the eight cognitive functions', () => {
    expect(Object.keys(COUNTER_THREAT_OUTPUT).sort()).toEqual(Object.keys(COG_FUNCTIONS).sort());
  });

  it('carries a threat texture and a Refuge contamination for each', () => {
    for (const [fn, v] of Object.entries(COUNTER_THREAT_OUTPUT)) {
      expect(v.texture.length, `${fn} texture`).toBeGreaterThan(20);
      expect(v.contamination.length, `${fn} contamination`).toBeGreaterThan(10);
    }
  });

  it('carries the source textures', () => {
    expect(COUNTER_THREAT_OUTPUT.Ni.texture).toMatch(/^Convergent trajectory:/);
    expect(COUNTER_THREAT_OUTPUT.Te.texture).toMatch(/^Evidentiary failure assessment:/);
    expect(COUNTER_THREAT_OUTPUT.Se.contamination).toBe('Hypervigilance to cues during rest');
  });
});

describe('stack data — edges', () => {
  it('has eight uniquely identified edges', () => {
    expect(EDGES).toHaveLength(8);
    expect(new Set(EDGES.map(e => e.id)).size).toBe(8);
  });

  it('draws the four nested couplings, the three corruption edges, and the gate', () => {
    const byId = Object.fromEntries(EDGES.map(e => [e.id, [e.from, e.to]]));
    expect(byId).toEqual({
      monitor: [4, 5], sample: [3, 6], check: [2, 7], trigger: [1, 8],
      bleed: [5, 3], writeback: [6, 2], interrupt: [7, 1], gate: [2, 1],
    });
    const kinds = Object.fromEntries(EDGES.map(e => [e.id, e.kind]));
    expect(kinds).toEqual({
      monitor: 'nested', sample: 'nested', check: 'nested', trigger: 'nested',
      bleed: 'corruption', writeback: 'corruption', interrupt: 'corruption', gate: 'structural',
    });
  });

  it('runs every nested edge from an ego position to its nested partner', () => {
    for (const e of EDGES.filter(x => x.kind === 'nested')) {
      expect(arcOf(e.from)).toBe('ego');
      expect(NESTED_PAIRS).toContainEqual([e.from, e.to].sort((a, b) => a - b));
    }
  });

  it('runs every corruption edge from a shadow position one step outward from its nested partner', () => {
    const nestedPartner = (pos) => NESTED_PAIRS.flatMap(([a, b]) => (a === pos ? [b] : b === pos ? [a] : []))[0];
    for (const e of EDGES.filter(x => x.kind === 'corruption')) {
      expect(arcOf(e.from)).toBe('shadow');
      expect(arcOf(e.to)).toBe('ego');
      expect(e.to).toBe(nestedPartner(e.from) - 1);
    }
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
    expect(EDGES.filter(e => e.weight === 'spine').map(e => e.id).sort()).toEqual(['sample', 'writeback']);
  });
});

describe('stack data — active edges per level', () => {
  it('has keys 1–9 that only reference known edge ids', () => {
    expect(Object.keys(ACTIVE_EDGES).map(Number).sort((a, b) => a - b)).toEqual(LEVELS);
    const ids = new Set(EDGES.map(e => e.id));
    for (const l of LEVELS) for (const id of ACTIVE_EDGES[l]) expect(ids.has(id), `${l}:${id}`).toBe(true);
  });

  it('opens the bleed edge at level 3 and carries it through the Refuge capture at 4', () => {
    expect(ACTIVE_EDGES[3]).toContain('bleed');
    expect(ACTIVE_EDGES[4]).toContain('bleed');
  });

  it('lights write-back across levels 5 and 6', () => {
    expect(ACTIVE_EDGES[5]).toContain('writeback');
    expect(ACTIVE_EDGES[6]).toContain('writeback');
  });

  it('lights the interrupt line at the Lead capture and the trigger line at the Flood capture', () => {
    expect(ACTIVE_EDGES[8]).toEqual(['interrupt']);
    expect(ACTIVE_EDGES[9]).toEqual(['trigger']);
    expect(ACTIVE_EDGES[1]).toEqual([]);
  });

  it('uses every edge at some level except the structural gate, which is not a corruption edge', () => {
    const used = new Set(LEVELS.flatMap(l => ACTIVE_EDGES[l]));
    for (const e of EDGES) expect(used.has(e.id), e.id).toBe(true);
  });
});

describe('stack data — fixation utility for Lead', () => {
  it('offers exactly the three utility configurations', () => {
    expect(Object.keys(UTILITY).sort()).toEqual(['high', 'low', 'mixed']);
  });

  it('maps each to the stakes the diagnostic reads off', () => {
    expect(UTILITY_DIAGNOSTIC.rows.map(r => r.utility)).toEqual(['high', 'mixed', 'low']);
    for (const row of UTILITY_DIAGNOSTIC.rows) {
      expect(UTILITY[row.utility].stakes).toBe(row.stakes);
    }
    expect(UTILITY_DIAGNOSTIC.nowhere).toMatch(/extreme corruption or typing error/);
  });

  it('puts low-utility equilibrium at Reality-testing with Gamble intact', () => {
    expect(UTILITY.low.detail.join(' ')).toMatch(/Equilibrium stabilizes at Reality-testing with Gamble intact/);
  });

  it('has high utility deploy Lead across all stakes rather than compressing it', () => {
    expect(UTILITY.high.detail.join(' ')).toMatch(/deployed in fixation service across all stakes/);
    expect(UTILITY.high.detail.join(' ')).toMatch(/Counter operation is minimal/);
  });

  it('predicts a wide 6→7 gap at high utility and a narrow one at low', () => {
    expect(UTILITY.high.gap).toMatch(/gap is wide/);
    expect(UTILITY.low.gap).toMatch(/gap is narrow/);
    expect(UTILITY.mixed.gap).toBeNull();
  });

  it('stores only the five committed anchor cells and does not infer the rest', () => {
    expect(UTILITY_ANCHORS).toHaveLength(5);
    expect(UTILITY_ANCHORS.filter(a => a.utility === 'high').map(a => `${a.fn}x${a.type}`))
      .toEqual(['Tex3', 'Nix4', 'Sex8']);
    expect(UTILITY_ANCHORS.filter(a => a.utility === 'low').map(a => `${a.fn}x${a.type}`))
      .toEqual(['Fix3', 'Sex5']);
    // Every anchor is about the function at Lead; the source commits to no other position.
    for (const a of UTILITY_ANCHORS) expect(a.position).toBe(1);
  });
});

describe('stack data — the two thresholds on Anchor drift', () => {
  it('is the gate flip at 6 and discrepancy inversion at 7, in that order', () => {
    expect(THRESHOLDS.map(t => [t.name, t.level])).toEqual([
      ['gate flip', 6], ['discrepancy inversion', 7],
    ]);
  });

  it('explains why the second threshold is higher than the first', () => {
    expect(THRESHOLDS[1].why).toMatch(/expensive to read as wrong/);
  });

  it('lands each threshold on the level whose position it captures', () => {
    expect(CAPTURE_ORDER[THRESHOLDS[0].level].pos).toBe(2); // Anchor
    expect(CAPTURE_ORDER[THRESHOLDS[1].level].pos).toBe(7); // Gamble
  });
});

describe('stack data — Gamble\'s three properties', () => {
  it('has exactly sensitivity, lens and polarity', () => {
    expect(GAMBLE_PROPERTIES.map(p => p.id)).toEqual(['sensitivity', 'lens', 'polarity']);
  });

  it('degrades sensitivity and lens as gradients from level 4, polarity discretely at 7', () => {
    const by = Object.fromEntries(GAMBLE_PROPERTIES.map(p => [p.id, p]));
    expect([by.sensitivity.degrades, by.sensitivity.from]).toEqual(['gradient', 4]);
    expect([by.lens.degrades, by.lens.from]).toEqual(['gradient', 4]);
    expect([by.polarity.degrades, by.polarity.from]).toEqual(['discrete', 7]);
  });

  it('keeps the signal accurate even once the comparator has inverted', () => {
    const polarity = GAMBLE_PROPERTIES.find(p => p.id === 'polarity');
    expect(polarity.detail.join(' ')).toMatch(/still contains the accurate discrepancy/);
    expect(polarity.detail.join(' ')).toMatch(/Someone else can/);
  });

  it('keeps sensitivity trainable while directability is not', () => {
    const sensitivity = GAMBLE_PROPERTIES.find(p => p.id === 'sensitivity');
    expect(sensitivity.trainable).toMatch(/trainable in both directions/);
    expect(GAMBLE_SUMMONABILITY).toMatch(/the background channel cannot be queried/);
  });
});

describe('stack data — the odd/even signature', () => {
  it('splits shadow captures from ego captures', () => {
    expect(ODD_EVEN.odd.levels).toEqual([3, 5, 7, 9]);
    expect(ODD_EVEN.even.levels).toEqual([4, 6, 8]);
    expect(ODD_EVEN.odd.arc).toBe('shadow');
    expect(ODD_EVEN.even.arc).toBe('ego');
  });

  it('matches the arc each level actually captures', () => {
    for (const l of ODD_EVEN.odd.levels) expect(arcOf(CAPTURE_ORDER[l].pos)).toBe('shadow');
    for (const l of ODD_EVEN.even.levels) expect(arcOf(CAPTURE_ORDER[l].pos)).toBe('ego');
  });

  it('predicts world-referential narration for odd levels and self-referential for even', () => {
    expect(ODD_EVEN.odd.reported).toBe('the world changing');
    expect(ODD_EVEN.even.reported).toBe('the self changing');
    expect(ODD_EVEN.falsifier).toMatch(/uniformly self-referential or uniformly world-referential/);
  });

  it('omits level 2, which is identification rather than a capture', () => {
    expect([...ODD_EVEN.odd.levels, ...ODD_EVEN.even.levels]).not.toContain(2);
  });
});

describe('stack data — label templates', () => {
  it('exposes the placeholders the util substitutes', () => {
    expect(LABEL_TEMPLATES.positionLevel).toContain('{pos}');
    expect(LABEL_TEMPLATES.positionLevel).toContain('{level}');
    expect(LABEL_TEMPLATES.fnAtPosition).toContain('{fn}');
    expect(LABEL_TEMPLATES.hungerBadge).toContain('{type}');
    expect(LABEL_TEMPLATES.levelLine).toContain('{rh}');
  });
});

describe('stack data — level ≠ position labelling', () => {
  it('renders Position 6 · captured at Level 5 with both numbers distinct', () => {
    expect(positionLabel(6, 5)).toMatch(/Position 6/);
    expect(positionLabel(6, 5)).toMatch(/Level 5/);
    expect(positionLabel(2, 6)).toMatch(/Position 2 · Anchor · captured at Level 6/);
  });
});

/**
 * Terminology guard. Two patterns are deliberately narrower than they look:
 * `goes offline` rather than `offline`, because the source uses "Lead offline"
 * for Flood forced-primary under extreme stress, which is a different claim from
 * the retired "Lead goes offline under a corrupted Anchor"; and `opposing
 * personality` rather than `opposing`, because Beebe's term is Opposing
 * Personality while the source says "opposing attitude" throughout.
 */
describe('stack data — terminology deny-list', () => {
  const DENY = [
    /\bexile\b/i, /substituting/i, /goes offline/i, /firewall/i, /kamikaze/i,
    /conversion window/i, /maintenance ceiling/i, /ego block/i, /unimprovable/i,
    // Beebe terms are a standing repo convention
    /opposing personality/i, /critical parent/i, /trickster/i, /\bdemon\b/i,
  ];

  it('no exported string in data/stack.js uses a denied term', () => {
    const strings = collectStrings(STACK);
    expect(strings.length).toBeGreaterThan(40);
    expect(strings.filter(s => DENY.some(rx => rx.test(s)))).toEqual([]);
  });

  it.each(['data/stack.js', 'utils/stack.js'])('%s source (including comments) has no denied term', (rel) => {
    const src = readFileSync(join(__dirname, '..', rel), 'utf8');
    const offenders = src.split('\n')
      .map((line, n) => ({ line, n: n + 1 }))
      .filter(({ line }) => DENY.some(rx => rx.test(line)))
      .map(({ line, n }) => `${n}: ${line.trim().slice(0, 100)}`);
    expect(offenders).toEqual([]);
  });

  it('never says Lead goes offline in the same breath as a corrupted Anchor', () => {
    const offenders = collectStrings(STACK)
      .filter(s => /Anchor/.test(s) && /Lead/.test(s) && /offline/i.test(s));
    expect(offenders).toEqual([]);
  });

  it('still allows the source wording the narrowed patterns exist to permit', () => {
    expect(DENY.some(rx => rx.test('carry the same base functions in opposing attitude'))).toBe(false);
    expect(DENY.some(rx => rx.test('Flood forced-primary (extreme stress, Lead offline)'))).toBe(false);
    expect(DENY.some(rx => rx.test('the Opposing Personality'))).toBe(true);
    expect(DENY.some(rx => rx.test('Lead goes offline'))).toBe(true);
  });
});
