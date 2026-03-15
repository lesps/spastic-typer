/**
 * group-analysis.test.js
 * Tests for the new group analysis functions in utils/group.js.
 */
import { describe, it, expect } from 'vitest';
import {
  getCenterDistribution,
  getHarmonicDistribution,
  getHornevianDistribution,
  getTemperamentDistribution,
  getCognitiveCoverage,
  getInstinctGroupChemistry,
  getTeamArchetype,
} from '../utils/group.js';

// Helpers
function makePerson(ennType, mbti, instinctStack, label = 'P') {
  return { ennType, mbti, instinctStack, label };
}

const BALANCED_TEAM = [
  makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'), // gut, compliant, SJ
  makePerson(2, 'ENFJ', ['sx', 'sp', 'so'], 'B'), // heart, compliant, NF
  makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'C'), // head, withdrawn, NT
  makePerson(7, 'ENTP', ['so', 'sp', 'sx'], 'D'), // head, assertive, NT
];

const GUT_TEAM = [
  makePerson(8, 'ENTJ', ['sp', 'sx', 'so'], 'A'),
  makePerson(9, 'INFP', ['sp', 'so', 'sx'], 'B'),
  makePerson(1, 'ISTJ', ['sp', 'sx', 'so'], 'C'),
];

const SP_TEAM = [
  makePerson(1, 'ISTJ', ['sp', 'sx', 'so'], 'A'),
  makePerson(5, 'INTP', ['sp', 'so', 'sx'], 'B'),
  makePerson(9, 'INFP', ['sp', 'sx', 'so'], 'C'),
];

// ─────────────────────────────────────────────────────────
// getCenterDistribution
// ─────────────────────────────────────────────────────────
describe('getCenterDistribution', () => {
  it('returns an object with dist, total, and analysis', () => {
    const result = getCenterDistribution(BALANCED_TEAM);
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('analysis');
    expect(typeof result.analysis).toBe('string');
  });

  it('total matches person count', () => {
    const result = getCenterDistribution(BALANCED_TEAM);
    expect(result.total).toBe(BALANCED_TEAM.length);
  });

  it('counts gut center correctly for GUT_TEAM', () => {
    const result = getCenterDistribution(GUT_TEAM);
    expect(result.dist.gut).toBe(3);
    expect(result.dist.heart).toBe(0);
    expect(result.dist.head).toBe(0);
  });

  it('identifies dominant center for gut-heavy team', () => {
    const result = getCenterDistribution(GUT_TEAM);
    expect(result.dominant).toBe('gut');
  });

  it('handles empty array gracefully', () => {
    expect(() => getCenterDistribution([])).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// getHarmonicDistribution
// ─────────────────────────────────────────────────────────
describe('getHarmonicDistribution', () => {
  it('returns dist, total, and analysis', () => {
    const result = getHarmonicDistribution(BALANCED_TEAM);
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('analysis');
  });

  it('dist has competency, positive, reactive keys', () => {
    const result = getHarmonicDistribution(BALANCED_TEAM);
    expect(result.dist).toHaveProperty('competency');
    expect(result.dist).toHaveProperty('positive');
    expect(result.dist).toHaveProperty('reactive');
  });

  it('counts sum to total', () => {
    const result = getHarmonicDistribution(BALANCED_TEAM);
    const sum = result.dist.competency + result.dist.positive + result.dist.reactive;
    expect(sum).toBe(result.total);
  });
});

// ─────────────────────────────────────────────────────────
// getHornevianDistribution
// ─────────────────────────────────────────────────────────
describe('getHornevianDistribution', () => {
  it('returns dist, total, and analysis', () => {
    const result = getHornevianDistribution(BALANCED_TEAM);
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('analysis');
  });

  it('dist has assertive, compliant, withdrawn keys', () => {
    const result = getHornevianDistribution(BALANCED_TEAM);
    expect(result.dist).toHaveProperty('assertive');
    expect(result.dist).toHaveProperty('compliant');
    expect(result.dist).toHaveProperty('withdrawn');
  });

  it('type 8 is assertive, type 1 is compliant, type 5 is withdrawn', () => {
    // Need 2+ persons for the function to return non-null
    const mixed = [
      makePerson(8, 'ENTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(1, 'ISTJ', ['sp', 'sx', 'so'], 'B'),
      makePerson(5, 'INTP', ['sp', 'sx', 'so'], 'C'),
    ];
    const result = getHornevianDistribution(mixed);
    expect(result).not.toBeNull();
    expect(result.dist.assertive).toBe(1); // type 8
    expect(result.dist.compliant).toBe(1); // type 1
    expect(result.dist.withdrawn).toBe(1); // type 5
  });
});

// ─────────────────────────────────────────────────────────
// getTemperamentDistribution
// ─────────────────────────────────────────────────────────
describe('getTemperamentDistribution', () => {
  it('returns dist, total, and analysis', () => {
    const result = getTemperamentDistribution(BALANCED_TEAM);
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('analysis');
  });

  it('dist has NT, NF, SJ, SP keys', () => {
    const result = getTemperamentDistribution(BALANCED_TEAM);
    expect(result.dist).toHaveProperty('NT');
    expect(result.dist).toHaveProperty('NF');
    expect(result.dist).toHaveProperty('SJ');
    expect(result.dist).toHaveProperty('SP');
  });

  it('INTJ and ENTP count as NT', () => {
    const ntTeam = [
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A'),
      makePerson(7, 'ENTP', ['so', 'sp', 'sx'], 'B'),
    ];
    const result = getTemperamentDistribution(ntTeam);
    expect(result.dist.NT).toBe(2);
  });

  it('ENFJ counts as NF (with 2+ members)', () => {
    const nfTeam = [
      makePerson(2, 'ENFJ', ['sx', 'sp', 'so'], 'A'),
      makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'B'),
    ];
    const result = getTemperamentDistribution(nfTeam);
    expect(result).not.toBeNull();
    expect(result.dist.NF).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────
// getCognitiveCoverage
// ─────────────────────────────────────────────────────────
describe('getCognitiveCoverage', () => {
  it('returns wellCovered, represented, underrepresented, and analysis', () => {
    const result = getCognitiveCoverage(BALANCED_TEAM);
    expect(result).toHaveProperty('wellCovered');
    expect(result).toHaveProperty('represented');
    expect(result).toHaveProperty('underrepresented');
    expect(result).toHaveProperty('analysis');
  });

  it('returns arrays for coverage tiers', () => {
    const result = getCognitiveCoverage(BALANCED_TEAM);
    expect(Array.isArray(result.wellCovered)).toBe(true);
    expect(Array.isArray(result.represented)).toBe(true);
    expect(Array.isArray(result.underrepresented)).toBe(true);
  });

  it('all 8 functions are categorized (wellCovered + represented + underrepresented = 8)', () => {
    const result = getCognitiveCoverage(BALANCED_TEAM);
    const total = result.wellCovered.length + result.represented.length + result.underrepresented.length;
    expect(total).toBe(8);
  });

  it('no function appears in more than one coverage tier', () => {
    const result = getCognitiveCoverage(BALANCED_TEAM);
    const all = [...result.wellCovered, ...result.represented, ...result.underrepresented];
    const unique = new Set(all);
    expect(unique.size).toBe(all.length);
  });
});

// ─────────────────────────────────────────────────────────
// getInstinctGroupChemistry
// ─────────────────────────────────────────────────────────
describe('getInstinctGroupChemistry', () => {
  it('returns dist, cohesionScore, groupEnergy, and conflictRisk', () => {
    const result = getInstinctGroupChemistry(SP_TEAM);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('dist');
    expect(result).toHaveProperty('cohesionScore');
    expect(result).toHaveProperty('groupEnergy');
    expect(result).toHaveProperty('conflictRisk');
  });

  it('cohesionScore is between 0 and 100', () => {
    const result = getInstinctGroupChemistry(BALANCED_TEAM);
    expect(result.cohesionScore).toBeGreaterThanOrEqual(0);
    expect(result.cohesionScore).toBeLessThanOrEqual(100);
  });

  it('dist sums to number of persons', () => {
    const result = getInstinctGroupChemistry(BALANCED_TEAM);
    const sum = Object.values(result.dist).reduce((a, b) => a + b, 0);
    expect(sum).toBe(BALANCED_TEAM.length);
  });

  it('all-SP team has dist.SP equal to team size', () => {
    const result = getInstinctGroupChemistry(SP_TEAM);
    expect(result.dist.SP).toBe(SP_TEAM.length);
  });

  it('returns null for fewer than 2 persons with instinct data', () => {
    const single = [makePerson(1, 'INTJ', ['sp', 'sx', 'so'], 'A')];
    expect(getInstinctGroupChemistry(single)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────
// getTeamArchetype
// ─────────────────────────────────────────────────────────
describe('getTeamArchetype', () => {
  it('returns an object with name and description', () => {
    const result = getTeamArchetype(BALANCED_TEAM);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(typeof result.name).toBe('string');
    expect(typeof result.description).toBe('string');
  });

  it('name is non-empty', () => {
    const result = getTeamArchetype(GUT_TEAM);
    expect(result.name.trim().length).toBeGreaterThan(0);
  });

  it('returns a valid archetype for all-gut SP team', () => {
    const result = getTeamArchetype(GUT_TEAM);
    expect(typeof result.name).toBe('string');
  });
});
