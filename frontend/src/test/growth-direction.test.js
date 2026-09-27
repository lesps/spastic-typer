import { describe, it, expect } from 'vitest';
import { growthPathFor } from '../utils/stack.js';
import { FIXATION, SUBSTRATE } from '../data/stack.js';
import { ENN_BASE } from '../data/ennBase.js';
import { SUBTYPES } from '../data/subtypes.js';
import { INSTINCT_STACK_PROFILES } from '../data/instinctStackProfiles.js';
import { COMBINATION_PROFILES } from '../data/combinationProfiles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { getFullStack } from '../utils/shadow.js';

const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INSTINCTS = ['SP', 'SX', 'SO'];
const STACKS = ['SP/SX/SO', 'SP/SO/SX', 'SX/SP/SO', 'SX/SO/SP', 'SO/SP/SX', 'SO/SX/SP'];

/**
 * The growth direction is the experience Counter's threat output says will not
 * arrive. It is set by the fixation alone, cannot be self-performed, and is
 * registered rather than produced. These tests pin all three, because the copy
 * they replaced said the opposite: that growth is something you go and do.
 */
describe('growth direction — sourced from the fixation, not authored per cell', () => {
  it('derives a path for every type, wing, MBTI type and instinct stack', () => {
    for (const t of TYPES) {
      for (const wing of [((t + 7) % 9) + 1, (t % 9) + 1]) {
        if (!ENN_BASE[`${t}w${wing}`]) continue;
        for (const mbti of Object.keys(MBTI_TYPES)) {
          for (const stack of STACKS) {
            expect(growthPathFor(t, wing, mbti, stack).length, `${t}w${wing} ${mbti} ${stack}`).toBeGreaterThan(200);
          }
        }
      }
    }
  });

  it('names the falsification target the fixation actually predicts against', () => {
    for (const t of TYPES) {
      const wing = Object.keys(ENN_BASE).find(k => k.startsWith(`${t}w`)).split('w')[1];
      const path = growthPathFor(t, wing, 'ENFP', 'SP/SX/SO');
      expect(path, `type ${t}`).toContain(FIXATION[t].threat);
      expect(path, `type ${t}`).toContain(FIXATION[t].falsifies);
    }
  });

  it('is identical for both wings of a type, since wing is angular precision only', () => {
    for (const t of TYPES) {
      const wings = Object.keys(ENN_BASE).filter(k => k.startsWith(`${t}w`)).map(k => k.split('w')[1]);
      expect(wings).toHaveLength(2);
      const [a, b] = wings.map(w => growthPathFor(t, w, 'INTJ', 'SO/SP/SX'));
      expect(a, `type ${t}`).toBe(b);
    }
  });

  it('names the function at Gamble as the registration channel', () => {
    for (const mbti of Object.keys(MBTI_TYPES)) {
      const gamble = getFullStack(mbti)[6].fn;
      expect(growthPathFor(4, 5, mbti, 'SX/SP/SO'), mbti).toContain(`${gamble} at Gamble`);
    }
  });

  it('names the first instinct\'s substrate pressure, not the second or third', () => {
    for (const stack of STACKS) {
      const [first, second] = stack.split('/');
      const path = growthPathFor(6, 7, 'ISFJ', stack);
      expect(path, stack).toContain(`with ${first} first`);
      expect(path, stack).toContain(SUBSTRATE[first.toLowerCase()].register);
      expect(path, stack).not.toContain(SUBSTRATE[second.toLowerCase()].register);
    }
  });

  it('always states that sourcing is external and performing it is the fixation', () => {
    for (const t of TYPES) {
      const wing = Object.keys(ENN_BASE).find(k => k.startsWith(`${t}w`)).split('w')[1];
      const path = growthPathFor(t, wing, 'ESTP', 'SO/SX/SP');
      expect(path, `type ${t}`).toMatch(/Sourcing must be external/);
      expect(path, `type ${t}`).toMatch(/performing the direction deliberately is the fixation operating/);
    }
  });

  it('returns an empty string rather than throwing on unknown input', () => {
    expect(growthPathFor(99, 1, 'ENFP', 'SP/SX/SO')).toBe('');
    expect(growthPathFor(4, 5, 'NOPE', 'SP/SX/SO')).toMatch(/^Counter's threat output says/);
    expect(growthPathFor(4, 5, 'ENFP', null)).toMatch(/^Counter's threat output says/);
    expect(growthPathFor(null, null, null, null)).toBe('');
  });
});

describe('growth direction — nothing stores what is derivable', () => {
  it('keeps growthPath off the generated combination profiles', () => {
    const vals = Object.values(COMBINATION_PROFILES);
    expect(vals).toHaveLength(1728);
    expect(vals.some(p => 'growthPath' in p)).toBe(false);
  });

  it('has one direction per type in ennBase, shared by both wings', () => {
    const summaries = Object.values(ENN_BASE).map(b => b.growthSummary);
    expect(summaries).toHaveLength(18);
    expect(new Set(summaries).size).toBe(9);
  });
});

describe('growth direction — subtypes cross the fixation with the instinct', () => {
  it('has a distinct path for all 27 type × instinct cells', () => {
    const paths = Object.values(SUBTYPES).map(s => s.growthPath);
    expect(paths).toHaveLength(27);
    expect(new Set(paths).size).toBe(27);
  });

  it('carries the fixation\'s falsification target and the instinct\'s reduction', () => {
    for (const t of TYPES) {
      for (const inst of INSTINCTS) {
        const path = SUBTYPES[`${t}_${inst}`].growthPath;
        expect(path, `${t}_${inst}`).toContain(FIXATION[t].falsifies);
        expect(path, `${t}_${inst}`).toContain(SUBSTRATE[inst.toLowerCase()].reduction);
      }
    }
  });
});

/**
 * "Growth" now has exactly one meaning in this app. The repressed instinct is
 * kept as the app's own instinctual-variant layer, but not under that word.
 */
describe('growth direction — the word has one meaning', () => {
  it('renamed the repressed-instinct field off "growth"', () => {
    const vals = Object.values(INSTINCT_STACK_PROFILES);
    expect(vals).toHaveLength(6);
    expect(vals.every(v => typeof v.underdeveloped === 'string' && v.underdeveloped.length > 20)).toBe(true);
    expect(vals.some(v => 'growth' in v)).toBe(false);
  });

  it('no longer tells anyone that growth comes from doing something', () => {
    const instructionish = /growth (?:comes|arrives|happens|begins) (?:from|when|with)/i;
    for (const [k, v] of Object.entries(ENN_BASE)) {
      expect(v.growthSummary, k).not.toMatch(instructionish);
    }
    for (const [k, v] of Object.entries(SUBTYPES)) {
      expect(v.growthPath, k).not.toMatch(instructionish);
    }
  });
});
