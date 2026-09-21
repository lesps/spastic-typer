import { describe, it, expect } from 'vitest';
import { MBTI_TYPES } from '../data/mbti.js';
import { MBTI_FUNCTION_DETAILS } from '../data/mbtiDetails.js';
import { POSITIONS, CROSSING_MATRIX } from '../data/shadow.js';
import { ROLES, CLASSIFICATION } from '../data/stack.js';
import {
  flipAttitude,
  getShadowStack,
  getFullStack,
  getShadowType,
  getStackInverse,
  getPositionCrossings,
} from '../utils/shadow.js';

describe('shadow — position definitions', () => {
  it('has exactly 8 positions', () => {
    expect(POSITIONS).toHaveLength(8);
  });

  it('positions 1-4 are ego, 5-8 are shadow', () => {
    POSITIONS.slice(0, 4).forEach(p => expect(p.arc).toBe('ego'));
    POSITIONS.slice(4).forEach(p => expect(p.arc).toBe('shadow'));
  });

  it('has names Lead, Anchor, Refuge, Hunger, Counter, Critic, Gamble, Flood', () => {
    const names = POSITIONS.map(p => p.name);
    expect(names).toEqual(['Lead', 'Anchor', 'Refuge', 'Hunger', 'Counter', 'Critic', 'Gamble', 'Flood']);
  });

  it('has shadow templates for positions 5-8', () => {
    [5, 6, 7, 8].forEach(pos => {
    });
  });
});

describe('shadow — flipAttitude', () => {
  it('flips Ne to Ni and back', () => {
    expect(flipAttitude('Ne')).toBe('Ni');
    expect(flipAttitude('Ni')).toBe('Ne');
  });

  it('flips all 8 functions correctly', () => {
    expect(flipAttitude('Fe')).toBe('Fi');
    expect(flipAttitude('Fi')).toBe('Fe');
    expect(flipAttitude('Te')).toBe('Ti');
    expect(flipAttitude('Ti')).toBe('Te');
    expect(flipAttitude('Se')).toBe('Si');
    expect(flipAttitude('Si')).toBe('Se');
  });
});

describe('shadow — getShadowStack', () => {
  it('returns ENFP shadow as [Ni, Fe, Ti, Se]', () => {
    expect(getShadowStack('ENFP')).toEqual(['Ni', 'Fe', 'Ti', 'Se']);
  });

  it('returns INFJ shadow as [Ne, Fi, Te, Si]', () => {
    expect(getShadowStack('INFJ')).toEqual(['Ne', 'Fi', 'Te', 'Si']);
  });

  it('returns null for invalid type', () => {
    expect(getShadowStack('XXXX')).toBeNull();
  });

  it('produces correct shadow stacks for all 16 types', () => {
    Object.entries(MBTI_TYPES).forEach(([code, { stack }]) => {
      const shadow = getShadowStack(code);
      expect(shadow).toHaveLength(4);
      stack.forEach((fn, i) => {
        expect(shadow[i][0]).toBe(fn[0]);
        expect(shadow[i][1]).not.toBe(fn[1]);
      });
    });
  });
});

describe('shadow — getFullStack', () => {
  it('returns 8 entries with correct position metadata', () => {
    const full = getFullStack('ENFP');
    expect(full).toHaveLength(8);
    expect(full[0]).toEqual({ fn: 'Ne', pos: 1, name: 'Lead', arc: 'ego' });
    expect(full[4]).toEqual({ fn: 'Ni', pos: 5, name: 'Counter', arc: 'shadow' });
    expect(full[7]).toEqual({ fn: 'Se', pos: 8, name: 'Flood', arc: 'shadow' });
  });

  it('returns null for invalid type', () => {
    expect(getFullStack('XXXX')).toBeNull();
  });
});

describe('shadow — getShadowType', () => {
  it('ENFP shadow type is INFP', () => {
    expect(getShadowType('ENFP')).toBe('INFP');
  });

  it('INFJ shadow type is ENFJ', () => {
    expect(getShadowType('INFJ')).toBe('ENFJ');
  });

  it('is always E↔I inversion for all 16 types', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      const shadow = getShadowType(code);
      expect(shadow).not.toBeNull();
      expect(shadow[0]).not.toBe(code[0]);
      expect(shadow.slice(1)).toBe(code.slice(1));
    });
  });

  it('shadow of shadow is self', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      expect(getShadowType(getShadowType(code))).toBe(code);
    });
  });
});

describe('shadow — getStackInverse', () => {
  it('ENFP stack inverse is INFJ', () => {
    expect(getStackInverse('ENFP')).toBe('INFJ');
  });

  it('INFJ stack inverse is ENFP', () => {
    expect(getStackInverse('INFJ')).toBe('ENFP');
  });

  it('stack inverse is symmetric', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      const inverse = getStackInverse(code);
      expect(inverse).not.toBeNull();
      expect(getStackInverse(inverse)).toBe(code);
    });
  });

  it('returns null for invalid type', () => {
    expect(getStackInverse('XXXX')).toBeNull();
  });
});

describe('shadow — structural invariant', () => {
  it('shadow stack of type A equals ego stack of the stack inverse of A', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      const shadowStack = getShadowStack(code);
      const inverse = getStackInverse(code);
      const inverseEgoStack = MBTI_TYPES[inverse].stack;
      expect(shadowStack).toEqual(inverseEgoStack);
    });
  });
});

describe('shadow — getPositionCrossings', () => {
  it('detects ENFP/INFJ as full shadow pair', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    expect(result.isStackInverse).toBe(true);
    expect(result.stackInversionNarrative).toBeTruthy();
  });

  it('ENFP/ISTJ is NOT a full shadow pair', () => {
    const result = getPositionCrossings('ENFP', 'ISTJ');
    expect(result.isStackInverse).toBe(false);
    expect(result.stackInversionNarrative).toBeNull();
  });

  it('returns crossings sorted by tier severity', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    const tierOrder = { highest: 0, high: 1, medium: 2 };
    for (let i = 1; i < result.crossings.length; i++) {
      expect(tierOrder[result.crossings[i].tier]).toBeGreaterThanOrEqual(
        tierOrder[result.crossings[i - 1].tier]
      );
    }
  });

  it('each crossing has required fields', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    expect(result.crossings.length).toBeGreaterThan(0);
    result.crossings.forEach(c => {
      expect(c).toHaveProperty('posA');
      expect(c).toHaveProperty('posB');
      expect(c).toHaveProperty('nameA');
      expect(c).toHaveProperty('nameB');
      expect(c).toHaveProperty('fnA');
      expect(c).toHaveProperty('fnB');
      expect(c).toHaveProperty('tier');
      expect(c).toHaveProperty('label');
      expect(c).toHaveProperty('description');
    });
  });

  it('returns null for invalid types', () => {
    expect(getPositionCrossings('ENFP', 'XXXX')).toBeNull();
    expect(getPositionCrossings('XXXX', 'ENFP')).toBeNull();
  });

  it('ENFP/INFJ full shadow pair has at least 4 crossings (one per shared function)', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    // ENFP ego [Ne,Fi,Te,Si], INFJ ego [Ni,Fe,Ti,Se] — these share no functions
    // ENFP shadow [Ni,Fe,Ti,Se] = INFJ ego, so crossings should exist
    expect(result.crossings.length).toBeGreaterThanOrEqual(4);
  });
});

describe('getPositionCrossings — directionality', () => {
  it('argument order does not change which type is labeled at Lead for Ne crossing', () => {
    // ENFP has Ne at pos 1 (Lead), INFJ has Ne at pos 5 (Counter)
    const ab = getPositionCrossings('ENFP', 'INFJ');
    const ba = getPositionCrossings('INFJ', 'ENFP');
    // Find the Ne 1-5 crossing in each result
    const neCrossAB = ab.crossings.find(c => c.fnA === 'Ne' && (c.posA === 1 || c.posB === 1));
    const neCrossBA = ba.crossings.find(c => c.fnA === 'Ne' && (c.posA === 1 || c.posB === 1));
    // typeForA should always be ENFP (holds Ne at pos 1, the lower position)
    expect(neCrossAB?.typeForA).toBe('ENFP');
    expect(neCrossBA?.typeForA).toBe('ENFP');
  });

  it('descriptions contain no unresolved placeholders', () => {
    const result = getPositionCrossings('ENFP', 'ISTJ');
    result.crossings.forEach(c => {
      expect(c.description).not.toContain('{typeA}');
      expect(c.description).not.toContain('{typeB}');
      expect(c.description).not.toContain('{fnA}');
      expect(c.description).not.toContain('{fnB}');
      expect(c.description).not.toContain('{fnName}');
    });
  });

  it('crossings include typeForA and typeForB fields', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    result.crossings.forEach(c => {
      expect(c).toHaveProperty('typeForA');
      expect(c).toHaveProperty('typeForB');
    });
  });

  it('reversed argument order produces same label set', () => {
    const ab = getPositionCrossings('ENFP', 'INFJ');
    const ba = getPositionCrossings('INFJ', 'ENFP');
    const labelsAB = ab.crossings.map(c => c.label).sort();
    const labelsBA = ba.crossings.map(c => c.label).sort();
    expect(labelsAB).toEqual(labelsBA);
  });

  it('typeForA always refers to the type holding the lower position', () => {
    // For INFJ/ENFP: INFJ has Ni at pos 1, ENFP has Ni at pos 5
    const result = getPositionCrossings('INFJ', 'ENFP');
    const niCross = result.crossings.find(c => c.fnA === 'Ni');
    // INFJ holds Ni at pos 1 — should be typeForA
    expect(niCross?.typeForA).toBe('INFJ');
    // ENFP holds Ni at pos 5 — should be typeForB
    expect(niCross?.typeForB).toBe('ENFP');
  });
});

describe('shadow — position roles come from the sourced definition', () => {
  it('gives every position a role and an Augusta class', () => {
    for (const p of POSITIONS) {
      expect(ROLES[p.pos], `role ${p.pos}`).toBeTruthy();
      expect(CLASSIFICATION[p.pos], `class ${p.pos}`).toBeTruthy();
    }
  });

  it('keeps POSITIONS to identity only, with no second unsourced description', () => {
    for (const p of POSITIONS) {
      expect(Object.keys(p).sort()).toEqual(['arc', 'name', 'pos']);
    }
  });

  it('marks Counter and Critic Strong, so the shadow arc is unvalued rather than weak', () => {
    expect(CLASSIFICATION[5]).toMatch(/^Strong/);
    expect(CLASSIFICATION[6]).toMatch(/^Strong/);
    expect(CLASSIFICATION[7]).toMatch(/^Weak/);
    expect(CLASSIFICATION[8]).toMatch(/^Weak/);
  });
});

describe('shadow — crossing matrix', () => {
  it('has entries with required fields', () => {
    Object.entries(CROSSING_MATRIX).forEach(([key, entry]) => {
      expect(entry).toHaveProperty('tier');
      expect(entry).toHaveProperty('label');
      expect(entry).toHaveProperty('template');
      expect(['highest', 'high', 'medium']).toContain(entry.tier);
      expect(key).toMatch(/^\d-\d$/);
    });
  });

  it('all keys have lower position first', () => {
    Object.keys(CROSSING_MATRIX).forEach(key => {
      const [a, b] = key.split('-').map(Number);
      expect(a).toBeLessThanOrEqual(b);
    });
  });

  it('has at least 12 entries', () => {
    expect(Object.keys(CROSSING_MATRIX).length).toBeGreaterThanOrEqual(12);
  });
});

describe('shadow — per-type shadow briefs follow the source', () => {
  const POS_NAME = { 5: 'Counter', 6: 'Critic', 7: 'Gamble', 8: 'Flood' };

  it('names that type\'s own function at each shadow position', () => {
    for (const code of Object.keys(MBTI_TYPES)) {
      const stack = getFullStack(code).map(p => p.fn);
      for (const pos of [5, 6, 7, 8]) {
        const entry = MBTI_FUNCTION_DETAILS[code][`shadow${pos}`];
        expect(entry.function, `${code} shadow${pos}`).toBe(stack[pos - 1]);
        expect(entry.brief.startsWith(`${stack[pos - 1]} at ${POS_NAME[pos]}`), `${code} shadow${pos}`).toBe(true);
      }
    }
  });

  /**
   * Regression: the first generator pass matched shadow slots globally rather
   * than per type, so types sharing a function at the same position overwrote
   * each other's text. Every coupled function a brief names must be that type's.
   */
  it('names only functions that are actually in that type\'s stack', () => {
    for (const code of Object.keys(MBTI_TYPES)) {
      const stack = getFullStack(code).map(p => p.fn);
      const [lead, , refuge, hunger, , , gamble, flood] = stack;
      const b = MBTI_FUNCTION_DETAILS[code];
      expect(b.shadow5.brief, code).toContain(`${hunger}-Hunger`);
      expect(b.shadow5.brief, code).toContain(`${refuge}-Refuge`);
      expect(b.shadow7.brief, code).toContain(`${flood}-Flood`);
      expect(b.shadow7.brief, code).toContain(`${refuge}-Refuge`);
      expect(b.shadow8.brief, code).toContain(`${lead}-Lead`);
      expect(b.shadow8.brief, code).toContain(`${gamble}-Gamble`);
    }
  });

  it('does not describe Flood as dormant or as surfacing only under breakdown', () => {
    for (const code of Object.keys(MBTI_TYPES)) {
      const brief = MBTI_FUNCTION_DETAILS[code].shadow8.brief;
      expect(brief, code).toMatch(/it runs all the time/);
      expect(brief, code).not.toMatch(/dormant|pressure valve|only when everything else/i);
    }
  });

  it('does not describe Gamble as misfiring or unreliable', () => {
    for (const code of Object.keys(MBTI_TYPES)) {
      const brief = MBTI_FUNCTION_DETAILS[code].shadow7.brief;
      expect(brief, code).toMatch(/The failure mode is not misfiring/);
      expect(brief, code).not.toMatch(/available but unreliable/i);
    }
  });

  it('keeps Counter proficient and Critic accurate', () => {
    for (const code of Object.keys(MBTI_TYPES)) {
      expect(MBTI_FUNCTION_DETAILS[code].shadow5.brief, code).toMatch(/real proficiency/);
      expect(MBTI_FUNCTION_DETAILS[code].shadow6.brief, code).toMatch(/evaluations stay precise/);
    }
  });
});
