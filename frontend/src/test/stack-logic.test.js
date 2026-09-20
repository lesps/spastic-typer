import { describe, it, expect, beforeEach } from 'vitest';
import {
  captureLevelOf, capturedAt, captureState, isCaptured, fillTemplate, positionLabel,
  tierForLevel, parseStackQuery, readSavedTypes, counterThreatOutput, stackLayout, bezierPoint,
  stageForLevel, sealedStages, nestedPartner, domainPartner, substrateFor, fixationFor,
} from '../utils/stack.js';
import { CAPTURE_ORDER, ACTIVE_EDGES, EDGES, STAGES } from '../data/stack.js';
import { ENN_ARROWS } from '../data/enneagram.js';

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const EXPECTED_CAPTURED = {
  1: [],
  2: [4],
  3: [4, 5],
  4: [4, 5, 3],
  5: [4, 5, 3, 6],
  6: [4, 5, 3, 6, 2],
  7: [4, 5, 3, 6, 2, 7],
  8: [4, 5, 3, 6, 2, 7, 1],
  9: [4, 5, 3, 6, 2, 7, 1, 8],
};

describe('captureState — table-driven across levels 1–9', () => {
  it.each(LEVELS)('level %i', (l) => {
    const s = captureState(l);
    expect(s.level).toBe(l);
    expect(s.captured).toEqual(EXPECTED_CAPTURED[l]);
    expect(s.justCaptured).toBe(CAPTURE_ORDER[l].pos);
    expect(s.band).toBe(CAPTURE_ORDER[l].band);
    expect(s.kind).toBe(CAPTURE_ORDER[l].kind);
    expect(s.transition).toBe(CAPTURE_ORDER[l].transition);
    expect(s.rh).toBe(CAPTURE_ORDER[l].rh);
    expect(s.rhBand).toBe(CAPTURE_ORDER[l].rhBand);
    expect(s.activeEdges).toEqual(ACTIVE_EDGES[l]);
    expect(capturedAt(l)).toEqual(EXPECTED_CAPTURED[l]);
  });

  it('captured sets are cumulative and strictly nested', () => {
    for (let l = 1; l < 9; l++) {
      const a = capturedAt(l), b = capturedAt(l + 1);
      expect(b.slice(0, a.length)).toEqual(a);
      expect(b.length).toBe(a.length + 1);
    }
  });

  it('level 1 captures nothing', () => {
    expect(capturedAt(1)).toEqual([]);
    expect(captureState(1).justCaptured).toBeNull();
  });

  it('clamps out-of-range levels', () => {
    expect(captureState(0).level).toBe(1);
    expect(captureState(42).level).toBe(9);
    expect(captureState('5').level).toBe(5);
    expect(captureState(NaN).level).toBe(1);
  });
});

describe('captureLevelOf / isCaptured', () => {
  it('inverts the capture order for all eight positions', () => {
    for (const l of LEVELS.slice(1)) expect(captureLevelOf(CAPTURE_ORDER[l].pos)).toBe(l);
  });
  it('pins the level/position collision', () => {
    expect(captureLevelOf(6)).toBe(5); // Critic: position 6, level 5
    expect(captureLevelOf(2)).toBe(6); // Anchor: position 2, level 6
  });
  it('isCaptured is true from the capture level onward', () => {
    expect(isCaptured(6, 4)).toBe(false);
    expect(isCaptured(6, 5)).toBe(true);
    expect(isCaptured(6, 9)).toBe(true);
    expect(isCaptured(8, 8)).toBe(false);
    expect(isCaptured(8, 9)).toBe(true);
  });
});

describe('tierForLevel', () => {
  it('maps Riso-Hudson levels to the three LEVELS tiers', () => {
    expect([1, 2, 3].map(tierForLevel)).toEqual(['healthy', 'healthy', 'healthy']);
    expect([4, 5, 6].map(tierForLevel)).toEqual(['average', 'average', 'average']);
    expect([7, 8, 9].map(tierForLevel)).toEqual(['unhealthy', 'unhealthy', 'unhealthy']);
  });
});

describe('fillTemplate / positionLabel', () => {
  it('substitutes every placeholder it is given', () => {
    expect(fillTemplate('{fnName} ({fn}) at {name} · Position {pos} · Level {level} · Type {type}',
      { fn: 'Te', fnName: 'Extraverted Thinking', name: 'Refuge', pos: 3, level: 4, type: 4 }))
      .toBe('Extraverted Thinking (Te) at Refuge · Position 3 · Level 4 · Type 4');
  });
  it('leaves unknown placeholders intact', () => {
    expect(fillTemplate('{fn} and {mystery}', { fn: 'Ni' })).toBe('Ni and {mystery}');
  });
  it('positionLabel without a level names only the position', () => {
    expect(positionLabel(6)).toBe('Position 6 · Critic');
  });
  it('positionLabel with a level labels both numbering systems', () => {
    expect(positionLabel(6, 5)).toBe('Position 6 · Critic · captured at Level 5');
  });
});

describe('parseStackQuery', () => {
  it('reads a valid type and level', () => {
    expect(parseStackQuery('type=ENFP&level=5')).toEqual({ type: 'ENFP', level: 5 });
  });
  it('accepts lower-case types', () => {
    expect(parseStackQuery('type=intj')).toEqual({ type: 'INTJ', level: null });
  });
  it('rejects unknown types and out-of-range levels', () => {
    expect(parseStackQuery('type=ABCD&level=0')).toEqual({ type: null, level: null });
    expect(parseStackQuery('level=10')).toEqual({ type: null, level: null });
    expect(parseStackQuery('level=x')).toEqual({ type: null, level: null });
  });
  it('handles empty and malformed input', () => {
    expect(parseStackQuery('')).toEqual({ type: null, level: null });
    expect(parseStackQuery(undefined)).toEqual({ type: null, level: null });
    expect(parseStackQuery('&&=&type')).toEqual({ type: null, level: null });
  });
});

describe('readSavedTypes', () => {
  beforeEach(() => localStorage.clear());

  it('returns nulls when nothing is saved', () => {
    expect(readSavedTypes()).toEqual({ mbti: null, enn: null, inst: null });
  });
  it('returns the saved MBTI and Enneagram core type', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: 4, wing: 5 }));
    expect(readSavedTypes()).toEqual({ mbti: 'ENFP', enn: 4, inst: null });
  });
  it('reads the first instinct from the standalone instinct result', () => {
    localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: ['sx', 'sp', 'so'] }));
    expect(readSavedTypes().inst).toBe('sx');
  });
  it('falls back to the instinct stack on the Enneagram result', () => {
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: 9, instinctStack: ['so', 'sp', 'sx'] }));
    expect(readSavedTypes().inst).toBe('so');
  });
  it('prefers the standalone instinct result when both are present', () => {
    localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: ['sp', 'so', 'sx'] }));
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: 9, instinctStack: ['sx', 'sp', 'so'] }));
    expect(readSavedTypes().inst).toBe('sp');
  });
  it('never throws on malformed JSON or wrong shapes', () => {
    localStorage.setItem('typer_mbti', '{');
    localStorage.setItem('typer_enn', '"nope"');
    localStorage.setItem('typer_inst', '[[[');
    expect(readSavedTypes()).toEqual({ mbti: null, enn: null, inst: null });
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'XXXX' }));
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: 12 }));
    localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: ['nope', 'sp'] }));
    expect(readSavedTypes()).toEqual({ mbti: null, enn: null, inst: null });
    localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: 'sp' }));
    expect(readSavedTypes().inst).toBeNull();
  });
});

describe('substrateFor / fixationFor', () => {
  it('returns the substrate profile for each instinct, case-insensitively', () => {
    expect(substrateFor('sp').territory).toMatch(/material stability/);
    expect(substrateFor('SO').register).toMatch(/in front of the room/);
    expect(substrateFor('sx').register).toMatch(/bond rupture/);
  });

  it('returns the scarcity model, threat and growth direction for each type', () => {
    for (let t = 1; t <= 9; t++) {
      const f = fixationFor(t);
      expect(f.scarcity.length).toBeGreaterThan(20);
      expect(f.threat.length).toBeGreaterThan(20);
      expect(f.falsifies.length).toBeGreaterThan(20);
    }
    expect(fixationFor(3).growth).toBe(6);
    expect(fixationFor(9).falsifies).toMatch(/assertion deepening connection/);
  });

  it('matches the growth arrows the Enneagram data already uses', () => {
    for (let t = 1; t <= 9; t++) expect(fixationFor(t).growth).toBe(ENN_ARROWS[t].growth);
  });

  it('returns null for unknown input', () => {
    expect(substrateFor('zz')).toBeNull();
    expect(substrateFor(null)).toBeNull();
    expect(fixationFor(0)).toBeNull();
    expect(fixationFor('x')).toBeNull();
  });
});

describe('counterThreatOutput', () => {
  it('names the Counter function and its threat-output form', () => {
    expect(counterThreatOutput('ENFP')).toEqual({
      fn: 'Ni',
      texture: 'Convergent trajectory: one inevitable path to the feared outcome, with felt certainty',
      contamination: 'Chronic anticipatory dread with a specific trajectory',
    });
    expect(counterThreatOutput('ISTJ')).toEqual({
      fn: 'Se',
      texture: 'Immediate environmental scan: somatic vigilance for present danger cues',
      contamination: 'Hypervigilance to cues during rest',
    });
  });
  it('returns null for an unknown type', () => {
    expect(counterThreatOutput('NOPE')).toBeNull();
    expect(counterThreatOutput(null)).toBeNull();
  });
});

describe('stackLayout — edge label legibility', () => {
  // Approximate text metrics for the 9px mono labels the diagram renders.
  const CHAR_W = 7;
  const LINE_H = 11;
  const PAD = 6;
  const box = (e) => {
    const w = e.label.length * CHAR_W;
    const x = e.labelAnchor === 'start' ? e.labelX : e.labelAnchor === 'end' ? e.labelX - w : e.labelX - w / 2;
    return { x1: x - PAD, x2: x + w + PAD, y1: e.labelY - LINE_H / 2, y2: e.labelY + LINE_H / 2 };
  };

  it('keeps a readable gap between every pair of edge labels', () => {
    const edges = stackLayout().edges;
    const overlaps = [];
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const a = box(edges[i]);
        const b = box(edges[j]);
        if (a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2) {
          overlaps.push(`${edges[i].id} ↔ ${edges[j].id}`);
        }
      }
    }
    expect(overlaps).toEqual([]);
  });
});

describe('stackLayout — geometry invariants', () => {
  const layout = stackLayout();
  const { nodes, edges, viewBox } = layout;
  const rects = Object.values(nodes);
  const inside = (p, r, pad = 0) =>
    p.x > r.x + pad && p.x < r.x + r.w - pad && p.y > r.y + pad && p.y < r.y + r.h - pad;
  const onBoundary = (p, r, tol = 0.01) => {
    const withinX = p.x >= r.x - tol && p.x <= r.x + r.w + tol;
    const withinY = p.y >= r.y - tol && p.y <= r.y + r.h + tol;
    const onVert = Math.abs(p.x - r.x) <= tol || Math.abs(p.x - (r.x + r.w)) <= tol;
    const onHoriz = Math.abs(p.y - r.y) <= tol || Math.abs(p.y - (r.y + r.h)) <= tol;
    return withinX && withinY && (onVert || onHoriz);
  };

  it('has a portrait viewBox and all eight nodes', () => {
    expect(viewBox).toEqual([0, 0, 360, 512]);
    expect(Object.keys(nodes).map(Number).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('places the ego arc in the left column and the shadow arc in the right, each descending', () => {
    for (const pos of [1, 2, 3, 4]) expect(nodes[pos].col).toBe('ego');
    for (const pos of [5, 6, 7, 8]) expect(nodes[pos].col).toBe('shadow');
    const egoX = new Set([1, 2, 3, 4].map(p => nodes[p].x));
    const shadowX = new Set([5, 6, 7, 8].map(p => nodes[p].x));
    expect(egoX.size).toBe(1);
    expect(shadowX.size).toBe(1);
    expect([...egoX][0]).toBeLessThan([...shadowX][0]);
    for (const [a, b] of [[1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8]]) expect(nodes[a].y).toBeLessThan(nodes[b].y);
  });

  it('keeps every node inside the viewBox with no overlaps', () => {
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(0); expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(viewBox[2]); expect(r.y + r.h).toBeLessThanOrEqual(viewBox[3]);
      expect(r.cx).toBeCloseTo(r.x + r.w / 2); expect(r.cy).toBeCloseTo(r.y + r.h / 2);
    }
    for (const a of rects) for (const b of rects) {
      if (a === b) continue;
      const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
      expect(overlap, `${a.pos} overlaps ${b.pos}`).toBe(false);
    }
  });

  it('routes every spec edge, starting and ending on its node boundaries', () => {
    expect(edges.map(e => e.id).sort()).toEqual(EDGES.map(e => e.id).sort());
    for (const e of edges) {
      const spec = EDGES.find(s => s.id === e.id);
      expect(e.from).toBe(spec.from); expect(e.to).toBe(spec.to);
      expect(e.weight).toBe(spec.weight);
      expect(onBoundary(e.p0, nodes[e.from]), `${e.id} start`).toBe(true);
      expect(onBoundary(e.p3, nodes[e.to]), `${e.id} end`).toBe(true);
      expect(e.d).toMatch(/^M [\d.]+ [\d.]+ C /);
      expect(typeof e.labelX).toBe('number'); expect(typeof e.labelY).toBe('number');
    }
  });

  it('never passes an edge through a node body', () => {
    for (const e of edges) {
      for (let t = 0.05; t < 0.96; t += 0.05) {
        const p = bezierPoint(e.p0, e.p1, e.p2, e.p3, t);
        for (const r of rects) expect(inside(p, r, 0.5), `${e.id} at t=${t.toFixed(2)} inside ${r.pos}`).toBe(false);
      }
    }
  });

  it('keeps edge labels off the node bodies', () => {
    for (const e of edges) for (const r of rects) {
      expect(inside({ x: e.labelX, y: e.labelY }, r), `${e.id} label inside ${r.pos}`).toBe(false);
    }
  });
});
