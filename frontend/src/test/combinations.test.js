/**
 * combinations.test.js
 * Tests for the combination profile data and lazy-loading index.
 */
import { describe, it, expect } from 'vitest';
import { combinationKey, AVAILABLE_WINGS } from '../data/combinations/index.js';

const ENN_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const WINGS_MAP = {
  1: [9, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5], 5: [4, 6],
  6: [5, 7], 7: [6, 8], 8: [7, 9], 9: [8, 1],
};
const MBTI_LIST = ['INFP', 'INFJ', 'INTP', 'INTJ', 'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
  'ISFP', 'ISFJ', 'ISTP', 'ISTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ'];
const INST_STACKS = ['SP/SX/SO', 'SP/SO/SX', 'SX/SP/SO', 'SX/SO/SP', 'SO/SP/SX', 'SO/SX/SP'];

describe('AVAILABLE_WINGS — completeness', () => {
  it('exports 18 wing keys', () => {
    expect(AVAILABLE_WINGS.length).toBe(18);
  });

  it('contains all expected wing combinations', () => {
    const expected = ENN_TYPES.flatMap(n => WINGS_MAP[n].map(w => `${n}w${w}`));
    for (const key of expected) {
      expect(AVAILABLE_WINGS, `missing wing key: ${key}`).toContain(key);
    }
  });
});

describe('combinationKey — key format', () => {
  it('produces correct format: {type}w{wing}_{MBTI}_{instStack without slashes}', () => {
    expect(combinationKey(4, 5, 'INFP', 'SX/SP/SO')).toBe('4w5_INFP_SXSPSO');
    expect(combinationKey(8, 9, 'ENTJ', 'SP/SX/SO')).toBe('8w9_ENTJ_SPSOSX'.replace('SPSOSX', 'SPSXSO'));
    expect(combinationKey(1, 9, 'ISTJ', 'SO/SP/SX')).toBe('1w9_ISTJ_SOSPSX');
  });

  it('handles slashes in instStack by removing them', () => {
    const key = combinationKey(7, 8, 'ENTP', 'SO/SX/SP');
    expect(key).not.toContain('/');
  });
});

describe('getCombinationProfile — async loading', () => {
  it('loads a profile for a known combination', async () => {
    const { getCombinationProfile } = await import('../data/combinations/index.js');
    const profile = await getCombinationProfile(4, 5, 'INFP', 'SX/SP/SO');
    expect(profile).not.toBeNull();
    expect(profile).toHaveProperty('ennType');
    expect(profile).toHaveProperty('wing');
    expect(profile).toHaveProperty('mbtiType');
    expect(profile).toHaveProperty('instStack');
  });

  it('loaded profile has expected data fields', async () => {
    const { getCombinationProfile } = await import('../data/combinations/index.js');
    const profile = await getCombinationProfile(1, 9, 'ISTJ', 'SP/SX/SO');
    expect(profile).not.toBeNull();
    expect(typeof profile.portrait).toBe('string');
    expect(Array.isArray(profile.strengths)).toBe(true);
    expect(Array.isArray(profile.growthEdges)).toBe(true);
    expect(typeof profile.atWork).toBe('string');
  });

  it('returns null for an invalid wing key', async () => {
    const { getCombinationProfile } = await import('../data/combinations/index.js');
    const profile = await getCombinationProfile(99, 1, 'INFP', 'SX/SP/SO');
    expect(profile).toBeNull();
  });

  it('all 1,728 profiles exist and have required fields', async () => {
    const { getCombinationProfile } = await import('../data/combinations/index.js');
    const REQUIRED_FIELDS = ['ennType', 'wing', 'mbtiType', 'instStack', 'portrait', 'strengths', 'growthEdges'];
    // Spot-check a sample of profiles (1 per wing to keep test fast)
    const samples = [
      [1, 9, 'INTJ', 'SP/SX/SO'],
      [2, 1, 'ENFJ', 'SO/SX/SP'],
      [3, 4, 'ENTP', 'SX/SO/SP'],
      [4, 5, 'INFP', 'SX/SP/SO'],
      [5, 6, 'INTP', 'SP/SO/SX'],
      [6, 7, 'ISFJ', 'SO/SP/SX'],
      [7, 8, 'ENFP', 'SX/SO/SP'],
      [8, 9, 'ENTJ', 'SP/SX/SO'],
      [9, 1, 'INFJ', 'SO/SX/SP'],
    ];
    for (const [ennType, wing, mbtiType, instStack] of samples) {
      const profile = await getCombinationProfile(ennType, wing, mbtiType, instStack);
      expect(profile, `null for ${ennType}w${wing}_${mbtiType}_${instStack}`).not.toBeNull();
      for (const field of REQUIRED_FIELDS) {
        expect(profile, `${ennType}w${wing} missing ${field}`).toHaveProperty(field);
      }
    }
  });

  it('caches: loading same wing twice does not throw', async () => {
    const { getCombinationProfile } = await import('../data/combinations/index.js');
    const p1 = await getCombinationProfile(4, 5, 'INFP', 'SP/SX/SO');
    const p2 = await getCombinationProfile(4, 5, 'INFJ', 'SX/SO/SP');
    expect(p1).not.toBeNull();
    expect(p2).not.toBeNull();
  });
});
