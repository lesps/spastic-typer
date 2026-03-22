import { describe, it, expect } from 'vitest';
import { MBTI_TYPES } from '../data/mbti.js';
import { POSITIONS, CROSSING_MATRIX, SHADOW_TEMPLATES } from '../data/shadow.js';
import {
  flipAttitude,
  getShadowStack,
  getFullStack,
  getShadowType,
  getShadowMirror,
  getPositionCrossings,
  instantiateTemplate,
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
      expect(SHADOW_TEMPLATES[pos]).toBeDefined();
      expect(typeof SHADOW_TEMPLATES[pos]).toBe('string');
      expect(SHADOW_TEMPLATES[pos].length).toBeGreaterThan(50);
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

describe('shadow — getShadowMirror', () => {
  it('ENFP shadow mirror is INFJ', () => {
    expect(getShadowMirror('ENFP')).toBe('INFJ');
  });

  it('INFJ shadow mirror is ENFP', () => {
    expect(getShadowMirror('INFJ')).toBe('ENFP');
  });

  it('shadow mirror is symmetric', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      const mirror = getShadowMirror(code);
      expect(mirror).not.toBeNull();
      expect(getShadowMirror(mirror)).toBe(code);
    });
  });

  it('returns null for invalid type', () => {
    expect(getShadowMirror('XXXX')).toBeNull();
  });
});

describe('shadow — structural invariant', () => {
  it('shadow stack of type A equals ego stack of shadow mirror of A', () => {
    Object.keys(MBTI_TYPES).forEach(code => {
      const shadowStack = getShadowStack(code);
      const mirror = getShadowMirror(code);
      const mirrorEgoStack = MBTI_TYPES[mirror].stack;
      expect(shadowStack).toEqual(mirrorEgoStack);
    });
  });
});

describe('shadow — getPositionCrossings', () => {
  it('detects ENFP/INFJ as full shadow pair', () => {
    const result = getPositionCrossings('ENFP', 'INFJ');
    expect(result.isFullShadowPair).toBe(true);
    expect(result.shadowPairNarrative).toBeTruthy();
  });

  it('ENFP/ISTJ is NOT a full shadow pair', () => {
    const result = getPositionCrossings('ENFP', 'ISTJ');
    expect(result.isFullShadowPair).toBe(false);
    expect(result.shadowPairNarrative).toBeNull();
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

describe('shadow — instantiateTemplate', () => {
  it('replaces {fn} placeholder', () => {
    const result = instantiateTemplate(5, 'Ni');
    expect(result).toContain('Ni');
    expect(result).not.toContain('{fn}');
  });

  it('replaces {fnName} placeholder', () => {
    const result = instantiateTemplate(5, 'Ni');
    expect(result).not.toContain('{fnName}');
  });

  it('returns empty string for invalid position', () => {
    expect(instantiateTemplate(99, 'Ne')).toBe('');
  });

  it('returns non-empty string for all shadow positions', () => {
    [5, 6, 7, 8].forEach(pos => {
      expect(instantiateTemplate(pos, 'Ne').length).toBeGreaterThan(0);
    });
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
