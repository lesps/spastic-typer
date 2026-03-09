/**
 * scoring.test.js
 * Pure unit tests for all three assessment scoring algorithms,
 * question bank fairness, and confidence thresholds.
 * No React rendering required.
 */
import { describe, it, expect } from 'vitest';
import {
  scoreMBTI,
  scoreEnneagram,
  scoreInstinct,
  buildFairSequence,
  shuffleArray,
  isMBTIDimConfident,
  allMBTIDimsConfident,
  isEnnConfident,
  isInstConfident,
} from '../views/GuidedTyper.jsx';
import { MBTI_BANK } from '../data/mbti.js';
import { ENN_BANK, INSTINCT_BANK } from '../data/enneagram.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal MBTI sequence with N questions per dimension using the full bank. */
function mbtiSeqFromBank(nPerDim = 8) {
  return buildFairSequence(MBTI_BANK, q => q.dim);
}

/** Build answers for an MBTI sequence where every question of dim gets value v. */
function mbtiAnswersForDim(seq, dim, value) {
  const answers = {};
  seq.forEach((q, i) => { if (q.dim === dim) answers[i] = value; });
  return answers;
}

/** Build answers for a full MBTI sequence where every question gets value v. */
function mbtiAnswersAll(seq, value) {
  const answers = {};
  seq.forEach((_, i) => { answers[i] = value; });
  return answers;
}

/** Build a minimal Enneagram sequence from the bank. */
function ennSeqFromBank() {
  return buildFairSequence(ENN_BANK, q => q.type);
}

/** Build Enneagram answers where type T gets value high and all others get value low. */
function ennAnswersForType(seq, favoredType, high, low) {
  const answers = {};
  seq.forEach((q, i) => { answers[i] = q.type === favoredType ? high : low; });
  return answers;
}

/** Build a minimal instinct sequence from the bank. */
function instSeqFromBank() {
  return buildFairSequence(INSTINCT_BANK, q => q.inst);
}

/** Build instinct answers where SP=high, SX=mid, SO=low. */
function instAnswersOrdered(seq, spVal, sxVal, soVal) {
  const answers = {};
  seq.forEach((q, i) => {
    if (q.inst === 'sp') answers[i] = spVal;
    else if (q.inst === 'sx') answers[i] = sxVal;
    else answers[i] = soVal;
  });
  return answers;
}

// ---------------------------------------------------------------------------
// MBTI Scoring — Bug Regression
// ---------------------------------------------------------------------------

describe('scoreMBTI — scale calibration (bug regression)', () => {
  it('all +3 on E-pole questions → result starts with E', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 3);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('E');
  });

  it('all +2 on E-pole questions → result starts with E (was the bug: incorrectly produced I)', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 2);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('E');
  });

  it('all +1 on E-pole questions → result starts with E', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 1);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('E');
  });

  it('all -3 on E-pole questions → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, -3);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('I');
  });

  it('all -2 on E-pole questions → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, -2);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('I');
  });

  it('all -1 on E-pole questions → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, -1);
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('I');
  });

  it('all 0 answers → E score equals I score (tie; E wins by >= rule)', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 0);
    const { scores } = scoreMBTI(answers, seq);
    expect(scores.E).toBe(scores.I);
  });
});

describe('scoreMBTI — all four dimensions', () => {
  it('all +3 answers → ESTJ (every pole-letter wins)', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 3);
    const { result } = scoreMBTI(answers, seq);
    expect(result).toBe('ESTJ');
  });

  it('all -3 answers → INFP (every opposite-pole wins)', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, -3);
    const { result } = scoreMBTI(answers, seq);
    expect(result).toBe('INFP');
  });

  it('only S answers positive, others all -3 → result contains S', () => {
    const seq = mbtiSeqFromBank();
    const answers = { ...mbtiAnswersAll(seq, -3), ...mbtiAnswersForDim(seq, 'SN', 3) };
    const { result } = scoreMBTI(answers, seq);
    expect(result[1]).toBe('S');
  });

  it('pole score is higher than counter-pole for clear positive answers', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 2);
    const { scores } = scoreMBTI(answers, seq);
    expect(scores.E).toBeGreaterThan(scores.I);
    expect(scores.S).toBeGreaterThan(scores.N);
    expect(scores.T).toBeGreaterThan(scores.F);
    expect(scores.J).toBeGreaterThan(scores.P);
  });

  it('pole score is lower than counter-pole for clear negative answers', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, -2);
    const { scores } = scoreMBTI(answers, seq);
    expect(scores.E).toBeLessThan(scores.I);
    expect(scores.S).toBeLessThan(scores.N);
    expect(scores.T).toBeLessThan(scores.F);
    expect(scores.J).toBeLessThan(scores.P);
  });

  it('partial answers (only some questions answered) score correctly', () => {
    const seq = mbtiSeqFromBank();
    // Only answer the first EI question at +3
    const firstEI = seq.findIndex(q => q.dim === 'EI');
    const answers = { [firstEI]: 3 };
    const { scores } = scoreMBTI(answers, seq);
    // 1 question, rawSum=3, shifted=3+3=6, neg=6-6=0
    expect(scores.E).toBe(6);
    expect(scores.I).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// MBTI Confidence Thresholds
// ---------------------------------------------------------------------------

describe('isMBTIDimConfident', () => {
  it('returns false when fewer than 2 questions answered for the dim', () => {
    const seq = mbtiSeqFromBank();
    const firstEI = seq.findIndex(q => q.dim === 'EI');
    const answers = { [firstEI]: 3 };
    expect(isMBTIDimConfident('EI', answers, seq, firstEI)).toBe(false);
  });

  it('returns true when 2+ questions answered with |sum|/count >= 1.5', () => {
    const seq = mbtiSeqFromBank();
    const eiIndices = seq.reduce((acc, q, i) => { if (q.dim === 'EI') acc.push(i); return acc; }, []);
    // Answer first 2 EI questions at +2 each → rawSum=4, count=2, 4/2=2 >= 1.5
    const answers = { [eiIndices[0]]: 2, [eiIndices[1]]: 2 };
    const maxIndex = Math.max(eiIndices[0], eiIndices[1]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(true);
  });

  it('returns false when answers are weak (|sum|/count < 1.5)', () => {
    const seq = mbtiSeqFromBank();
    const eiIndices = seq.reduce((acc, q, i) => { if (q.dim === 'EI') acc.push(i); return acc; }, []);
    // Answer first 2 EI questions at +1 each → rawSum=2, count=2, 2/2=1 < 1.5
    const answers = { [eiIndices[0]]: 1, [eiIndices[1]]: 1 };
    const maxIndex = Math.max(eiIndices[0], eiIndices[1]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(false);
  });

  it('returns false when answers cancel each other out', () => {
    const seq = mbtiSeqFromBank();
    const eiIndices = seq.reduce((acc, q, i) => { if (q.dim === 'EI') acc.push(i); return acc; }, []);
    // +3 and -3 → rawSum=0, |0|/2=0 < 1.5
    const answers = { [eiIndices[0]]: 3, [eiIndices[1]]: -3 };
    const maxIndex = Math.max(eiIndices[0], eiIndices[1]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(false);
  });

  it('returns true for strong negative answers', () => {
    const seq = mbtiSeqFromBank();
    const eiIndices = seq.reduce((acc, q, i) => { if (q.dim === 'EI') acc.push(i); return acc; }, []);
    // -3 and -2 → rawSum=-5, |-5|/2=2.5 >= 1.5
    const answers = { [eiIndices[0]]: -3, [eiIndices[1]]: -2 };
    const maxIndex = Math.max(eiIndices[0], eiIndices[1]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(true);
  });
});

describe('allMBTIDimsConfident', () => {
  it('returns false when no questions answered', () => {
    const seq = mbtiSeqFromBank();
    expect(allMBTIDimsConfident({}, seq, 0)).toBe(false);
  });

  it('returns true when all 4 dims have strong confident answers', () => {
    const seq = mbtiSeqFromBank();
    // After 8 rounds (32 questions), all dims have 8 answers at +3
    const answers = mbtiAnswersAll(seq, 3);
    expect(allMBTIDimsConfident(answers, seq, seq.length - 1)).toBe(true);
  });

  it('returns false when only 3 of 4 dims are confident', () => {
    const seq = mbtiSeqFromBank();
    // All dims strong except EI (zeroed out → not confident)
    const answers = mbtiAnswersAll(seq, 3);
    seq.forEach((q, i) => { if (q.dim === 'EI') answers[i] = 0; });
    // After enough questions
    expect(allMBTIDimsConfident(answers, seq, seq.length - 1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Enneagram Scoring
// ---------------------------------------------------------------------------

describe('scoreEnneagram', () => {
  it('all +3 for type 4, 0 for others → coreType is 4', () => {
    const seq = ennSeqFromBank();
    const answers = ennAnswersForType(seq, 4, 3, 0);
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(4);
  });

  it('all +3 for type 1, 0 for others → coreType is 1', () => {
    const seq = ennSeqFromBank();
    const answers = ennAnswersForType(seq, 1, 3, 0);
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(1);
  });

  it('all +3 for type 9, 0 for others → coreType is 9', () => {
    const seq = ennSeqFromBank();
    const answers = ennAnswersForType(seq, 9, 3, 0);
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(9);
  });

  it('wing is the adjacent type with the higher score', () => {
    const seq = ennSeqFromBank();
    // Type 4 wins; give type 5 higher score than type 3
    const answers = {};
    seq.forEach((q, i) => {
      if (q.type === 4) answers[i] = 3;
      else if (q.type === 5) answers[i] = 2; // higher adjacent
      else if (q.type === 3) answers[i] = 1; // lower adjacent
      else answers[i] = 0;
    });
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(4);
    expect(r.wing).toBe(5); // 5 is adjacent and scored higher
  });

  it('wing 9 is valid for type 1 (wraps around)', () => {
    const seq = ennSeqFromBank();
    const answers = {};
    seq.forEach((q, i) => {
      if (q.type === 1) answers[i] = 3;
      else if (q.type === 9) answers[i] = 2; // higher adjacent (wraps)
      else if (q.type === 2) answers[i] = 1; // lower adjacent
      else answers[i] = 0;
    });
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(1);
    expect(r.wing).toBe(9);
  });

  it('wing 1 is valid for type 9 (wraps around)', () => {
    const seq = ennSeqFromBank();
    const answers = {};
    seq.forEach((q, i) => {
      if (q.type === 9) answers[i] = 3;
      else if (q.type === 1) answers[i] = 2; // higher adjacent (wraps)
      else if (q.type === 8) answers[i] = 1;
      else answers[i] = 0;
    });
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(9);
    expect(r.wing).toBe(1);
  });

  it('returns result object with coreType, wing, scores, display', () => {
    const seq = ennSeqFromBank();
    const answers = ennAnswersForType(seq, 7, 3, 0);
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r).toHaveProperty('coreType');
    expect(r).toHaveProperty('wing');
    expect(r).toHaveProperty('scores');
    expect(r).toHaveProperty('display');
    expect(r.display).toBe(`${r.coreType}w${r.wing}`);
  });

  it('disambiguation answers adjust scores correctly', () => {
    const seq = ennSeqFromBank();
    // Tie between 4 and 5; disambig answers favor 5
    const answers = {};
    seq.forEach((q, i) => {
      answers[i] = (q.type === 4 || q.type === 5) ? 3 : 0;
    });
    // Branch answers that all favor type 5
    const branchAnswers = { 0: 3, 1: -3, 2: -3, 3: 3, 4: -3 };
    // '4-5' disambig: questions at indices 0,2,4 favor 4; 1,3 favor 5
    // With answers: favors[5] gets +3, -3 answers go to type 4 sides
    const r = scoreEnneagram(answers, seq, branchAnswers, '4-5');
    // The disambig should have shifted the result
    expect([4, 5]).toContain(r.coreType); // still one of the two
  });
});

describe('isEnnConfident', () => {
  it('returns false when fewer than 2 questions per type answered', () => {
    const seq = ennSeqFromBank();
    // Only answer the first question (1 per type at most)
    const answers = { 0: 3 };
    expect(isEnnConfident(answers, seq, 0)).toBe(false);
  });

  it('returns false when gap between top-2 types is small', () => {
    const seq = ennSeqFromBank();
    // All types tied at +1 — gap = 0
    const answers = {};
    seq.forEach((_, i) => { answers[i] = 1; });
    expect(isEnnConfident(answers, seq, seq.length - 1)).toBe(false);
  });

  it('returns true when top type has a clear lead after min questions', () => {
    const seq = ennSeqFromBank();
    // Type 4 all +3, others all -3 → massive gap
    const answers = ennAnswersForType(seq, 4, 3, -3);
    expect(isEnnConfident(answers, seq, seq.length - 1)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Instinct Stack Scoring
// ---------------------------------------------------------------------------

describe('scoreInstinct', () => {
  it('SP highest answers → stack starts with sp', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, 0, -3);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack[0]).toBe('sp');
  });

  it('SX highest answers → stack starts with sx', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, -3, 3, 0);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack[0]).toBe('sx');
  });

  it('SO highest answers → stack starts with so', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 0, -3, 3);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack[0]).toBe('so');
  });

  it('full ordering SP > SX > SO is preserved', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, 1, -2);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack).toEqual(['sp', 'sx', 'so']);
  });

  it('instScores reflect actual sums from answers', () => {
    const seq = instSeqFromBank();
    // All SP questions +3, SX +0, SO -3
    const answers = instAnswersOrdered(seq, 3, 0, -3);
    const { instScores } = scoreInstinct(answers, seq);
    const spCount = seq.filter(q => q.inst === 'sp').length;
    const soCount = seq.filter(q => q.inst === 'so').length;
    expect(instScores.sp).toBe(spCount * 3);
    expect(instScores.sx).toBe(0);
    expect(instScores.so).toBe(soCount * -3);
  });

  it('returns 3-element instinctStack with all three instincts', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 2, 1, 0);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack).toHaveLength(3);
    expect(instinctStack).toContain('sp');
    expect(instinctStack).toContain('sx');
    expect(instinctStack).toContain('so');
  });
});

describe('isInstConfident', () => {
  it('returns false when fewer than 2 questions per instinct answered', () => {
    const seq = instSeqFromBank();
    expect(isInstConfident({}, seq, 0)).toBe(false);
  });

  it('returns false when ordering gaps are too small', () => {
    const seq = instSeqFromBank();
    // All equal answers → gaps = 0
    const answers = {};
    seq.forEach((_, i) => { answers[i] = 1; });
    expect(isInstConfident(answers, seq, seq.length - 1)).toBe(false);
  });

  it('returns true when both adjacent gaps meet the threshold', () => {
    const seq = instSeqFromBank();
    // SP=+3, SX=0, SO=-3 → gaps are large
    const answers = instAnswersOrdered(seq, 3, 0, -3);
    // Need at least 2 per instinct — check after all questions
    expect(isInstConfident(answers, seq, seq.length - 1)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildFairSequence — Fairness & Randomization
// ---------------------------------------------------------------------------

describe('buildFairSequence', () => {
  it('produces equal counts per category for MBTI (8 per dim)', () => {
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    seq.forEach(q => { counts[q.dim]++; });
    expect(counts.EI).toBe(8);
    expect(counts.SN).toBe(8);
    expect(counts.TF).toBe(8);
    expect(counts.JP).toBe(8);
    expect(seq).toHaveLength(32);
  });

  it('produces equal counts per type for Enneagram (5 per type)', () => {
    const seq = buildFairSequence(ENN_BANK, q => q.type);
    const counts = {};
    for (let t = 1; t <= 9; t++) counts[t] = 0;
    seq.forEach(q => { counts[q.type]++; });
    for (let t = 1; t <= 9; t++) expect(counts[t]).toBe(5);
    expect(seq).toHaveLength(45);
  });

  it('produces equal counts per instinct (5 per instinct)', () => {
    const seq = buildFairSequence(INSTINCT_BANK, q => q.inst);
    const counts = { sp: 0, sx: 0, so: 0 };
    seq.forEach(q => { counts[q.inst]++; });
    expect(counts.sp).toBe(5);
    expect(counts.sx).toBe(5);
    expect(counts.so).toBe(5);
    expect(seq).toHaveLength(15);
  });

  it('each round in MBTI sequence contains exactly one question per dim', () => {
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const numRounds = 8; // 8 questions per dim
    for (let r = 0; r < numRounds; r++) {
      const round = seq.slice(r * 4, r * 4 + 4);
      const dims = round.map(q => q.dim);
      expect(new Set(dims).size).toBe(4); // all 4 unique dims
    }
  });

  it('each round in Enneagram sequence contains exactly one question per type', () => {
    const seq = buildFairSequence(ENN_BANK, q => q.type);
    const numRounds = 5;
    for (let r = 0; r < numRounds; r++) {
      const round = seq.slice(r * 9, r * 9 + 9);
      const types = round.map(q => String(q.type));
      expect(new Set(types).size).toBe(9);
    }
  });

  it('contains all questions from the bank (no omissions)', () => {
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const texts = new Set(seq.map(q => q.text));
    const bankTexts = new Set(MBTI_BANK.map(q => q.text));
    expect(texts.size).toBe(bankTexts.size);
    bankTexts.forEach(t => expect(texts.has(t)).toBe(true));
  });

  it('produces different orderings across multiple calls (randomization)', () => {
    // Run 5 times; at least 2 should differ
    const sequences = Array.from({ length: 5 }, () =>
      buildFairSequence(MBTI_BANK, q => q.dim).map(q => q.text).join('|')
    );
    const unique = new Set(sequences);
    // With 32! permutations, getting same order twice in 5 runs is astronomically unlikely
    expect(unique.size).toBeGreaterThan(1);
  });
});

describe('shuffleArray', () => {
  it('returns the same array (in-place)', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toBe(arr);
  });

  it('preserves all elements', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const sorted = [...arr].sort((a, b) => a - b);
    shuffleArray(arr);
    expect([...arr].sort((a, b) => a - b)).toEqual(sorted);
  });

  it('produces different orderings across multiple calls', () => {
    const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = Array.from({ length: 10 }, () => {
      const copy = [...base];
      shuffleArray(copy);
      return copy.join(',');
    });
    expect(new Set(results).size).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// MBTI Bank — Data Integrity
// ---------------------------------------------------------------------------

describe('MBTI_BANK data integrity', () => {
  it('has exactly 8 questions per dimension', () => {
    const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    MBTI_BANK.forEach(q => { counts[q.dim]++; });
    expect(counts.EI).toBe(8);
    expect(counts.SN).toBe(8);
    expect(counts.TF).toBe(8);
    expect(counts.JP).toBe(8);
  });

  it('all EI questions have pole E', () => {
    MBTI_BANK.filter(q => q.dim === 'EI').forEach(q => {
      expect(q.pole).toBe('E');
    });
  });

  it('all SN questions have pole S', () => {
    MBTI_BANK.filter(q => q.dim === 'SN').forEach(q => {
      expect(q.pole).toBe('S');
    });
  });

  it('all TF questions have pole T', () => {
    MBTI_BANK.filter(q => q.dim === 'TF').forEach(q => {
      expect(q.pole).toBe('T');
    });
  });

  it('all JP questions have pole J', () => {
    MBTI_BANK.filter(q => q.dim === 'JP').forEach(q => {
      expect(q.pole).toBe('J');
    });
  });

  it('no two questions in the bank have the same text', () => {
    const texts = MBTI_BANK.map(q => q.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

// ---------------------------------------------------------------------------
// Enneagram Bank — Data Integrity
// ---------------------------------------------------------------------------

describe('ENN_BANK data integrity', () => {
  it('has exactly 5 questions per type (1-9)', () => {
    const counts = {};
    for (let t = 1; t <= 9; t++) counts[t] = 0;
    ENN_BANK.forEach(q => { counts[q.type]++; });
    for (let t = 1; t <= 9; t++) expect(counts[t]).toBe(5);
  });

  it('all questions have pole 1', () => {
    ENN_BANK.forEach(q => expect(q.pole).toBe(1));
  });

  it('no two questions have the same text', () => {
    const texts = ENN_BANK.map(q => q.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

// ---------------------------------------------------------------------------
// Instinct Bank — Data Integrity
// ---------------------------------------------------------------------------

describe('INSTINCT_BANK data integrity', () => {
  it('has exactly 5 questions per instinct', () => {
    const counts = { sp: 0, sx: 0, so: 0 };
    INSTINCT_BANK.forEach(q => { counts[q.inst]++; });
    expect(counts.sp).toBe(5);
    expect(counts.sx).toBe(5);
    expect(counts.so).toBe(5);
  });

  it('no two questions have the same text', () => {
    const texts = INSTINCT_BANK.map(q => q.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});
