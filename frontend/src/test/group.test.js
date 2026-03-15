/**
 * group.test.js
 * Unit tests for analyzeGroup and new group analysis exports.
 */
import { describe, it, expect } from 'vitest';
import {
  analyzeGroup,
  getCenterDistribution,
  getHarmonicDistribution,
  getHornevianDistribution,
  getTemperamentDistribution,
  getCognitiveCoverage,
  getInstinctGroupChemistry,
  getTeamArchetype,
} from '../utils/group.js';

// Helpers — minimal person objects that satisfy analyzeGroup's filter predicates

function makePerson(ennType, mbti, instinctStack, label = 'P') {
  return { ennType, mbti, instinctStack, label };
}

// ---------------------------------------------------------------------------
// Bug 2: "X-Dominant Group" should NOT fire on tied center counts
// ---------------------------------------------------------------------------

describe('analyzeGroup — center dominance insight', () => {
  it('does NOT show a Dominant insight when two different centers are tied 1-1', () => {
    // Type 1 = gut, Type 5 = head → tied 1-1
    const result = analyzeGroup([
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(5, 'INTP', ['sx', 'sp', 'so'], 'B'),
    ]);
    const dominantInsight = result.find(r => /\w+-Dominant Group/.test(r.label ?? ''));
    expect(dominantInsight).toBeUndefined();
  });

  it('does NOT show a Dominant insight when four people split evenly 2-2 across centers', () => {
    // 2 gut (8, 9) + 2 head (5, 6) → tied 2-2
    const result = analyzeGroup([
      makePerson(8, 'ENTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(9, 'INFP', ['sx', 'sp', 'so'], 'B'),
      makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'C'),
      makePerson(6, 'ISFJ', ['so', 'sp', 'sx'], 'D'),
    ]);
    const dominantInsight = result.find(r => /\w+-Dominant Group/.test(r.label ?? ''));
    expect(dominantInsight).toBeUndefined();
  });

  it('DOES show Gut-Dominant when gut has a clear majority (2 vs 1)', () => {
    // 2 gut (8, 1) + 1 head (5)
    const result = analyzeGroup([
      makePerson(8, 'ENTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(1, 'ISTJ', ['sx', 'sp', 'so'], 'B'),
      makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'C'),
    ]);
    const dominantInsight = result.find(r => /Gut-Dominant/i.test(r.label ?? ''));
    expect(dominantInsight).toBeDefined();
  });

  it('DOES show Single Center: All Gut when all are gut types', () => {
    const result = analyzeGroup([
      makePerson(8, 'ENTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(1, 'INTJ', ['sx', 'sp', 'so'], 'B'),
    ]);
    const singleCenter = result.find(r => /Single Center.*Gut/i.test(r.label ?? ''));
    expect(singleCenter).toBeDefined();
  });

  it('DOES show Balanced Center Spread when all three centers are present', () => {
    const result = analyzeGroup([
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),  // gut
      makePerson(2, 'ENFJ', ['sx', 'sp', 'so'], 'B'),  // heart
      makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'C'),  // head
    ]);
    const balanced = result.find(r => /Balanced Center Spread/i.test(r.label ?? ''));
    expect(balanced).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Bug 3: Instinct group insight must use instinctStack, not ennInstinct
// ---------------------------------------------------------------------------

describe('analyzeGroup — instinct group insight', () => {
  it('fires "All SP Instinct" insight when all members have SP as dominant', () => {
    const result = analyzeGroup([
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(5, 'INFJ', ['sp', 'so', 'sx'], 'B'),
      makePerson(9, 'ISFP', ['sp', 'sx', 'so'], 'C'),
    ]);
    const spInsight = result.find(r => /All SP/i.test(r.label ?? ''));
    expect(spInsight).toBeDefined();
  });

  it('fires "All SX Instinct" insight when all members have SX as dominant', () => {
    const result = analyzeGroup([
      makePerson(4, 'INFP', ['sx', 'sp', 'so'], 'A'),
      makePerson(8, 'ENTJ', ['sx', 'so', 'sp'], 'B'),
    ]);
    const sxInsight = result.find(r => /All SX/i.test(r.label ?? ''));
    expect(sxInsight).toBeDefined();
  });

  it('does NOT fire instinct group insight when dominants differ', () => {
    const result = analyzeGroup([
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(4, 'INFP', ['sx', 'sp', 'so'], 'B'),
    ]);
    const instInsight = result.find(r => /All (SP|SX|SO) Instinct/i.test(r.label ?? ''));
    expect(instInsight).toBeUndefined();
  });
});

describe('new group exports — smoke tests', () => {
  const team = [
    makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),
    makePerson(2, 'ENFJ', ['sx', 'sp', 'so'], 'B'),
    makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'C'),
  ];

  it('getCenterDistribution exports and runs without error', () => {
    const result = getCenterDistribution(team);
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('total');
    expect(result.total).toBe(3);
  });

  it('getHarmonicDistribution exports and runs without error', () => {
    const result = getHarmonicDistribution(team);
    expect(result).toHaveProperty('dist');
  });

  it('getHornevianDistribution exports and runs without error', () => {
    const result = getHornevianDistribution(team);
    expect(result).toHaveProperty('dist');
  });

  it('getTemperamentDistribution exports and runs without error', () => {
    const result = getTemperamentDistribution(team);
    expect(result).toHaveProperty('dist');
  });

  it('getCognitiveCoverage exports and runs without error', () => {
    const result = getCognitiveCoverage(team);
    expect(result).toHaveProperty('wellCovered');
    expect(result).toHaveProperty('underrepresented');
  });

  it('getInstinctGroupChemistry exports and runs without error', () => {
    const result = getInstinctGroupChemistry(team);
    expect(result).toHaveProperty('cohesionScore');
  });

  it('getTeamArchetype exports and runs without error', () => {
    const result = getTeamArchetype(team);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
  });
});
