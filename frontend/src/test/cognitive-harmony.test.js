/**
 * cognitive-harmony.test.js
 * Tests for getCognitiveHarmony in utils/compare.js.
 */
import { describe, it, expect } from 'vitest';
import { getCognitiveHarmony } from '../utils/compare.js';

describe('getCognitiveHarmony — return shape', () => {
  it('returns an object with score, sharedFunctions, complementaryPairs, blindSpots, strengthsAsTeam, narrative', () => {
    const result = getCognitiveHarmony('INFP', 'INTJ');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('sharedFunctions');
    expect(result).toHaveProperty('complementaryPairs');
    expect(result).toHaveProperty('blindSpots');
    expect(result).toHaveProperty('strengthsAsTeam');
    expect(result).toHaveProperty('narrative');
  });

  it('score is a number between 0 and 100', () => {
    const result = getCognitiveHarmony('INFP', 'INTJ');
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('sharedFunctions is an array', () => {
    const { sharedFunctions } = getCognitiveHarmony('INFP', 'INTJ');
    expect(Array.isArray(sharedFunctions)).toBe(true);
  });

  it('complementaryPairs is an array', () => {
    const { complementaryPairs } = getCognitiveHarmony('ENFJ', 'INFP');
    expect(Array.isArray(complementaryPairs)).toBe(true);
  });

  it('narrative is a non-empty string', () => {
    const { narrative } = getCognitiveHarmony('ENTJ', 'INTP');
    expect(typeof narrative).toBe('string');
    expect(narrative.trim().length).toBeGreaterThan(0);
  });
});

describe('getCognitiveHarmony — scoring logic', () => {
  it('same type scores below 100 due to same-dominant penalty', () => {
    // Same dominant means no complementary dynamics, penalty applied
    const { score } = getCognitiveHarmony('INFP', 'INFP');
    expect(score).toBeLessThan(100);
  });

  it('complementary pair INFP+INTJ scores decently (shared Fi/Ne/Si, complementary Te/Fi)', () => {
    // INFP: Fi Ne Si Te
    // INTJ: Ni Te Fi Se
    // Shared: Fi (pos 1 vs 3), Ne (pos 2 — not shared with INTJ)
    const { score } = getCognitiveHarmony('INFP', 'INTJ');
    expect(score).toBeGreaterThan(20);
  });

  it('ENFJ+INFP have high score (golden pair)', () => {
    // ENFJ: Fe Ni Se Ti — INFP: Fi Ne Si Te
    // Strong complementary: Fe↔Ti overlap, Ne/Si shared
    const { score } = getCognitiveHarmony('ENFJ', 'INFP');
    expect(score).toBeGreaterThan(40);
  });

  it('INFP and ENFP share all 4 functions so score is high', () => {
    // INFP: Fi Ne Si Te — ENFP: Ne Fi Te Si
    // They share all 4 functions, score should be high
    const { score } = getCognitiveHarmony('INFP', 'ENFP');
    expect(score).toBeGreaterThan(50);
  });

  it('symmetry: getCognitiveHarmony(A, B) score equals getCognitiveHarmony(B, A) score', () => {
    const ab = getCognitiveHarmony('INFJ', 'ENTP');
    const ba = getCognitiveHarmony('ENTP', 'INFJ');
    expect(ab.score).toBe(ba.score);
  });

  it('complementaryPairs captures Fi↔Te when INFP pairs with ISTJ', () => {
    // INFP: Fi/Ne/Si/Te — ISTJ: Si/Te/Fi/Ne
    // INFP dom (Fi) and ISTJ aux (Te) form a complementary pair
    // complementaryPairs are objects { a, b, dynamic }
    const { complementaryPairs } = getCognitiveHarmony('INFP', 'ISTJ');
    const hasFiTe = complementaryPairs.some(p =>
      (p.a === 'Fi' && p.b === 'Te') || (p.a === 'Te' && p.b === 'Fi')
    );
    expect(hasFiTe).toBe(true);
  });
});

describe('getCognitiveHarmony — edge cases', () => {
  it('handles unknown MBTI type gracefully (no throw)', () => {
    expect(() => getCognitiveHarmony('XXXX', 'INFP')).not.toThrow();
  });

  it('handles both unknown types gracefully (returns null)', () => {
    const result = getCognitiveHarmony('XXXX', 'YYYY');
    expect(result).toBeNull();
  });

  it('score is integer or float, not NaN', () => {
    const { score } = getCognitiveHarmony('ISTP', 'ENFJ');
    expect(isNaN(score)).toBe(false);
  });
});
