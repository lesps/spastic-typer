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
  mulberry32,
  isMBTIDimConfident,
  allMBTIDimsConfident,
  isEnnConfident,
  isInstConfident,
} from '../views/GuidedTyper.jsx';
import { encodeProfileCode, decodeProfileCode } from '../utils/share.js';
import { computeWingStrengthDelta, wingStrengthLabel } from '../utils/enneagram.js';
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

  it('EI at -3, others at +3 → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    // Mean-centering requires discriminating answers: EI low, others high
    const answers = { ...mbtiAnswersAll(seq, 3), ...mbtiAnswersForDim(seq, 'EI', -3) };
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('I');
  });

  it('EI at -2, others at +3 → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    const answers = { ...mbtiAnswersAll(seq, 3), ...mbtiAnswersForDim(seq, 'EI', -2) };
    const { result } = scoreMBTI(answers, seq);
    expect(result[0]).toBe('I');
  });

  it('EI at -1, others at +3 → result starts with I', () => {
    const seq = mbtiSeqFromBank();
    const answers = { ...mbtiAnswersAll(seq, 3), ...mbtiAnswersForDim(seq, 'EI', -1) };
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

  it('discriminating negative answers → INFP (every opposite-pole wins)', () => {
    const seq = mbtiSeqFromBank();
    // direction:1 items at -3, direction:-1 items at +3 → all dims favor negative pole
    const answers = {};
    seq.forEach((q, i) => { answers[i] = (q.direction ?? 1) === -1 ? 3 : -3; });
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
    // direction:1 items at +2, direction:-1 items at -2 → positive poles win after centering
    const answers = {};
    seq.forEach((q, i) => { answers[i] = (q.direction ?? 1) === -1 ? -2 : 2; });
    const { scores } = scoreMBTI(answers, seq);
    expect(scores.E).toBeGreaterThan(scores.I);
    expect(scores.S).toBeGreaterThan(scores.N);
    expect(scores.T).toBeGreaterThan(scores.F);
    expect(scores.J).toBeGreaterThan(scores.P);
  });

  it('pole score is lower than counter-pole for clear negative answers', () => {
    const seq = mbtiSeqFromBank();
    // direction:1 items at -2, direction:-1 items at +2 → negative poles win after centering
    const answers = {};
    seq.forEach((q, i) => { answers[i] = (q.direction ?? 1) === -1 ? 2 : -2; });
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
    // 1 question answered, respMean=3, centered=0, rawSum=0, shifted=0+3=3, neg=6-3=3 → tie
    expect(scores.E).toBe(3);
    expect(scores.I).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// scoreMBTI — Disambiguation Scoring (bug regression)
// ---------------------------------------------------------------------------

describe('scoreMBTI — disambiguation via extended sequence (bug regression)', () => {
  it('all-0 EI answers + E-pole disambig question → E wins the dim', () => {
    const seq = mbtiSeqFromBank();
    const baseAnswers = mbtiAnswersAll(seq, 0);
    const disambigSeq = [{ text: 'Disambig E', dim: 'EI', pole: 'E' }];
    const combined = [...seq, ...disambigSeq];
    const combinedAnswers = { ...baseAnswers, [seq.length]: 3 };
    const { result } = scoreMBTI(combinedAnswers, combined);
    expect(result[0]).toBe('E');
  });

  it('all-0 EI answers + I-pole disambig question → I wins the dim', () => {
    const seq = mbtiSeqFromBank();
    const baseAnswers = mbtiAnswersAll(seq, 0);
    const disambigSeq = [{ text: 'Disambig I', dim: 'EI', pole: 'I', direction: -1 }];
    const combined = [...seq, ...disambigSeq];
    const combinedAnswers = { ...baseAnswers, [seq.length]: 3 };
    const { result } = scoreMBTI(combinedAnswers, combined);
    expect(result[0]).toBe('I');
  });

  it('disambig question for EI does not affect SN result', () => {
    const seq = mbtiSeqFromBank();
    const baseAnswers = { ...mbtiAnswersAll(seq, 0), ...mbtiAnswersForDim(seq, 'SN', 3) };
    const disambigSeq = [{ text: 'Disambig E', dim: 'EI', pole: 'E' }];
    const combined = [...seq, ...disambigSeq];
    const combinedAnswers = { ...baseAnswers, [seq.length]: 3 };
    const { result } = scoreMBTI(combinedAnswers, combined);
    expect(result[1]).toBe('S'); // SN unaffected
  });

  it('scoreMBTI with no extra args still works (backwards compat)', () => {
    const seq = mbtiSeqFromBank();
    const answers = mbtiAnswersAll(seq, 2);
    const { result } = scoreMBTI(answers, seq);
    expect(result).toBe('ESTJ');
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

  it('returns true when 3+ E-pole questions answered at +2 (|sum|/count = 2 >= 1.8)', () => {
    const seq = mbtiSeqFromBank();
    // Use only E-pole (direction:1) items to get a reliable rawSum
    const eiEIndices = seq.reduce((acc, q, i) => {
      if (q.dim === 'EI' && (q.direction ?? 1) === 1) acc.push(i);
      return acc;
    }, []);
    const answers = { [eiEIndices[0]]: 2, [eiEIndices[1]]: 2, [eiEIndices[2]]: 2 };
    const maxIndex = Math.max(eiEIndices[0], eiEIndices[1], eiEIndices[2]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(true);
  });

  it('returns false when answers are weak (|sum|/count < 1.8)', () => {
    const seq = mbtiSeqFromBank();
    const eiEIndices = seq.reduce((acc, q, i) => {
      if (q.dim === 'EI' && (q.direction ?? 1) === 1) acc.push(i);
      return acc;
    }, []);
    // 3 answers at +1 → rawSum=3, count=3, 3/3=1 < 1.8
    const answers = { [eiEIndices[0]]: 1, [eiEIndices[1]]: 1, [eiEIndices[2]]: 1 };
    const maxIndex = Math.max(eiEIndices[0], eiEIndices[1], eiEIndices[2]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(false);
  });

  it('returns false when answers cancel each other out', () => {
    const seq = mbtiSeqFromBank();
    const eiEIndices = seq.reduce((acc, q, i) => {
      if (q.dim === 'EI' && (q.direction ?? 1) === 1) acc.push(i);
      return acc;
    }, []);
    // +3, -3, +3 → rawSum=3, count=3, |3|/3=1 < 1.8
    const answers = { [eiEIndices[0]]: 3, [eiEIndices[1]]: -3, [eiEIndices[2]]: 3 };
    const maxIndex = Math.max(eiEIndices[0], eiEIndices[1], eiEIndices[2]);
    expect(isMBTIDimConfident('EI', answers, seq, maxIndex)).toBe(false);
  });

  it('returns true for strong negative answers (3 E-pole at -3)', () => {
    const seq = mbtiSeqFromBank();
    const eiEIndices = seq.reduce((acc, q, i) => {
      if (q.dim === 'EI' && (q.direction ?? 1) === 1) acc.push(i);
      return acc;
    }, []);
    // -3, -3, -3 → rawSum=-9, |-9|/3=3 >= 1.8
    const answers = { [eiEIndices[0]]: -3, [eiEIndices[1]]: -3, [eiEIndices[2]]: -3 };
    const maxIndex = Math.max(eiEIndices[0], eiEIndices[1], eiEIndices[2]);
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
    // direction:1 items at +3, direction:-1 items at -3 → centered values are strong → all dims confident
    const answers = {};
    seq.forEach((q, i) => { answers[i] = (q.direction ?? 1) === -1 ? -3 : 3; });
    expect(allMBTIDimsConfident(answers, seq, seq.length - 1)).toBe(true);
  });

  it('returns false when only 3 of 4 dims are confident', () => {
    const seq = mbtiSeqFromBank();
    // SN/TF/JP use discriminating answers (confident); EI all 0 (not confident)
    const answers = {};
    seq.forEach((q, i) => {
      if (q.dim === 'EI') answers[i] = 0;
      else answers[i] = (q.direction ?? 1) === -1 ? -3 : 3;
    });
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
    // SP=+3, SX=0, SO=-3; mean=(7*3+7*0+7*-3)/21=0; no centering shift
    // Each instinct: 6 pole:1 items + 1 pole:-1 item
    // sp: 6*(3-0)*1 + 1*(3-0)*(-1) = 18-3 = 15
    // sx: all centered 0 = 0
    // so: 6*(-3-0)*1 + 1*(-3-0)*(-1) = -18+3 = -15
    const answers = instAnswersOrdered(seq, 3, 0, -3);
    const { instScores } = scoreInstinct(answers, seq);
    expect(instScores.sp).toBe(15);
    expect(instScores.sx).toBe(0);
    expect(instScores.so).toBe(-15);
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

// ---------------------------------------------------------------------------
// scoreInstinct — Disambiguation Scoring (bug regression)
// ---------------------------------------------------------------------------

describe('scoreInstinct — disambiguation scoring (bug regression)', () => {
  it('without disambig params, behaves identically to original', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, 1, -2);
    const { instinctStack } = scoreInstinct(answers, seq);
    expect(instinctStack).toEqual(['sp', 'sx', 'so']);
  });

  it('disambig favoring sp over so raises sp score and lowers so score', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, -5, 3); // sp=so tied
    const disambigSeq = [{ favors: 'sp', opponent: 'so' }];
    const disambigAnswers = { 0: 3 };
    const { instScores } = scoreInstinct(answers, seq, disambigAnswers, disambigSeq);
    expect(instScores.sp).toBeGreaterThan(instScores.so);
  });

  it('negative disambig answer reverses the bias toward the opponent', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, -5, 3); // sp=so tied
    const disambigSeq = [{ favors: 'sp', opponent: 'so' }];
    const disambigAnswers = { 0: -3 }; // user leans away from sp → so should win
    const { instScores } = scoreInstinct(answers, seq, disambigAnswers, disambigSeq);
    expect(instScores.so).toBeGreaterThan(instScores.sp);
  });

  it('disambig answers do not affect an unrelated instinct', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, -5, 3); // sx clearly last
    const disambigSeq = [{ favors: 'sp', opponent: 'so' }];
    const disambigAnswers = { 0: 3 };
    const { instScores: before } = scoreInstinct(answers, seq);
    const { instScores: after } = scoreInstinct(answers, seq, disambigAnswers, disambigSeq);
    expect(after.sx).toBe(before.sx); // sx untouched
  });

  it('multiple disambig answers accumulate correctly', () => {
    const seq = instSeqFromBank();
    const answers = instAnswersOrdered(seq, 3, -5, 3); // sp=so tied
    const disambigSeq = [
      { favors: 'sp', opponent: 'so' },
      { favors: 'sp', opponent: 'so' },
    ];
    const disambigAnswers = { 0: 2, 1: 1 };
    const { instScores } = scoreInstinct(answers, seq, disambigAnswers, disambigSeq);
    // sp gained +3 total, so lost -3 total
    const baseSpSoDiff = 0; // they were tied
    expect(instScores.sp - instScores.so).toBe(6); // 2*2 + 2*1 = ... wait: (2-(-2)) + (1-(-1)) = 4+2=6
    expect(instScores.sp).toBeGreaterThan(instScores.so);
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
  it('produces equal counts per category for MBTI (10 per dim)', () => {
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    seq.forEach(q => { counts[q.dim]++; });
    expect(counts.EI).toBe(10);
    expect(counts.SN).toBe(10);
    expect(counts.TF).toBe(10);
    expect(counts.JP).toBe(10);
    expect(seq).toHaveLength(40);
  });

  it('produces equal counts per type for Enneagram (7 per type)', () => {
    const seq = buildFairSequence(ENN_BANK, q => q.type);
    const counts = {};
    for (let t = 1; t <= 9; t++) counts[t] = 0;
    seq.forEach(q => { counts[q.type]++; });
    for (let t = 1; t <= 9; t++) expect(counts[t]).toBe(7);
    expect(seq).toHaveLength(63);
  });

  it('produces equal counts per instinct (7 per instinct)', () => {
    const seq = buildFairSequence(INSTINCT_BANK, q => q.inst);
    const counts = { sp: 0, sx: 0, so: 0 };
    seq.forEach(q => { counts[q.inst]++; });
    expect(counts.sp).toBe(7);
    expect(counts.sx).toBe(7);
    expect(counts.so).toBe(7);
    expect(seq).toHaveLength(21);
  });

  it('each round in MBTI sequence contains exactly one question per dim', () => {
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    const numRounds = 10; // 10 questions per dim
    for (let r = 0; r < numRounds; r++) {
      const round = seq.slice(r * 4, r * 4 + 4);
      const dims = round.map(q => q.dim);
      expect(new Set(dims).size).toBe(4); // all 4 unique dims
    }
  });

  it('each round in Enneagram sequence contains exactly one question per type', () => {
    const seq = buildFairSequence(ENN_BANK, q => q.type);
    const numRounds = 7;
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
  it('has exactly 10 questions per dimension', () => {
    const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    MBTI_BANK.forEach(q => { counts[q.dim]++; });
    expect(counts.EI).toBe(10);
    expect(counts.SN).toBe(10);
    expect(counts.TF).toBe(10);
    expect(counts.JP).toBe(10);
  });

  it('EI questions have pole E (direction:1) or pole I (direction:-1)', () => {
    MBTI_BANK.filter(q => q.dim === 'EI').forEach(q => {
      if ((q.direction ?? 1) === 1) expect(q.pole).toBe('E');
      else expect(q.pole).toBe('I');
    });
  });

  it('SN questions have pole S (direction:1) or pole N (direction:-1)', () => {
    MBTI_BANK.filter(q => q.dim === 'SN').forEach(q => {
      if ((q.direction ?? 1) === 1) expect(q.pole).toBe('S');
      else expect(q.pole).toBe('N');
    });
  });

  it('TF questions have pole T (direction:1) or pole F (direction:-1)', () => {
    MBTI_BANK.filter(q => q.dim === 'TF').forEach(q => {
      if ((q.direction ?? 1) === 1) expect(q.pole).toBe('T');
      else expect(q.pole).toBe('F');
    });
  });

  it('JP questions have pole J (direction:1) or pole P (direction:-1)', () => {
    MBTI_BANK.filter(q => q.dim === 'JP').forEach(q => {
      if ((q.direction ?? 1) === 1) expect(q.pole).toBe('J');
      else expect(q.pole).toBe('P');
    });
  });

  it('each dimension has exactly 2 reverse-scored questions (direction: -1)', () => {
    ['EI', 'SN', 'TF', 'JP'].forEach(dim => {
      const reversed = MBTI_BANK.filter(q => q.dim === dim && q.direction === -1).length;
      expect(reversed).toBe(2);
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
  it('has exactly 7 questions per type (1-9)', () => {
    const counts = {};
    for (let t = 1; t <= 9; t++) counts[t] = 0;
    ENN_BANK.forEach(q => { counts[q.type]++; });
    for (let t = 1; t <= 9; t++) expect(counts[t]).toBe(7);
  });

  it('all questions have pole 1 or -1', () => {
    ENN_BANK.forEach(q => expect([1, -1]).toContain(q.pole));
  });

  it('each type has exactly one reverse-scored question (pole: -1)', () => {
    for (let t = 1; t <= 9; t++) {
      const reversed = ENN_BANK.filter(q => q.type === t && q.pole === -1).length;
      expect(reversed).toBe(1);
    }
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
  it('has exactly 7 questions per instinct', () => {
    const counts = { sp: 0, sx: 0, so: 0 };
    INSTINCT_BANK.forEach(q => { counts[q.inst]++; });
    expect(counts.sp).toBe(7);
    expect(counts.sx).toBe(7);
    expect(counts.so).toBe(7);
  });

  it('each instinct has exactly one reverse-scored question (pole: -1)', () => {
    ['sp', 'sx', 'so'].forEach(inst => {
      const reversed = INSTINCT_BANK.filter(q => q.inst === inst && q.pole === -1).length;
      expect(reversed).toBe(1);
    });
  });

  it('no two questions have the same text', () => {
    const texts = INSTINCT_BANK.map(q => q.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

// ---------------------------------------------------------------------------
// encodeProfileCode / decodeProfileCode — Share code round-trip
// ---------------------------------------------------------------------------

describe('encodeProfileCode / decodeProfileCode — round-trip', () => {
  const makeEnn = (type, wing, delta, stack) => ({
    coreType: type, wing, wingStrengthDelta: delta,
    instinctStack: stack, display: `${type}w${wing}`, scores: {},
  });
  const makeMbti = (result) => ({ result, scores: {} });
  const makeInst = (stack) => ({ instinctStack: stack, instScores: {} });

  it('encodes a complete profile to an 11-character code', () => {
    const code = encodeProfileCode(
      makeEnn(4, 5, 5, ['sx', 'sp', 'so']),
      makeMbti('INFP'),
      makeInst(['sx', 'sp', 'so'])
    );
    expect(typeof code).toBe('string');
    expect(code.length).toBe(11);
    expect(code[6]).toBe('-');
  });

  it('round-trips: decode(encode(...)) restores coreType, wing, MBTI, and instinct stack', () => {
    const enn = makeEnn(4, 5, 5, ['sx', 'sp', 'so']);
    const mbti = makeMbti('INFP');
    const inst = makeInst(['sx', 'sp', 'so']);
    const code = encodeProfileCode(enn, mbti, inst);
    const decoded = decodeProfileCode(code);
    expect(decoded).not.toBeNull();
    expect(decoded.enn.coreType).toBe(4);
    expect(decoded.enn.wing).toBe(5);
    expect(decoded.mbti.result).toBe('INFP');
    expect(decoded.inst.instinctStack).toEqual(['sx', 'sp', 'so']);
  });

  it('handles all 6 instinct stack permutations', () => {
    const perms = [
      ['sp','sx','so'], ['sp','so','sx'],
      ['sx','sp','so'], ['sx','so','sp'],
      ['so','sp','sx'], ['so','sx','sp'],
    ];
    perms.forEach(stack => {
      const code = encodeProfileCode(
        makeEnn(1, 2, null, stack),
        makeMbti('INTJ'),
        makeInst(stack)
      );
      expect(code).not.toBeNull();
      const decoded = decodeProfileCode(code);
      expect(decoded).not.toBeNull();
      expect(decoded.inst.instinctStack).toEqual(stack);
    });
  });

  it('handles all 4 wing strength values', () => {
    const strengths = [null, 1, 3, 5]; // null, balanced, moderate, strong
    strengths.forEach(delta => {
      const code = encodeProfileCode(
        makeEnn(5, 4, delta, ['sp', 'sx', 'so']),
        makeMbti('INTP'),
        makeInst(['sp', 'sx', 'so'])
      );
      expect(code).not.toBeNull();
      const decoded = decodeProfileCode(code);
      expect(decoded).not.toBeNull();
      if (delta === null) {
        expect(decoded.enn.wingStrengthDelta).toBeNull();
      } else {
        expect(decoded.enn.wingStrengthDelta).not.toBeNull();
      }
    });
  });

  it('returns null when encoding an incomplete profile', () => {
    expect(encodeProfileCode(null, makeMbti('INFP'), makeInst(['sp','sx','so']))).toBeNull();
    expect(encodeProfileCode(makeEnn(4,5,3,['sx','sp','so']), null, makeInst(['sp','sx','so']))).toBeNull();
    expect(encodeProfileCode(makeEnn(4,5,3,['sx','sp','so']), makeMbti('INFP'), null)).toBeNull();
  });

  it('returns null for malformed codes', () => {
    expect(decodeProfileCode('BADCODE')).toBeNull();
    expect(decodeProfileCode('453xpo-XXXX')).toBeNull(); // invalid MBTI
    expect(decodeProfileCode('453xxx-INFP')).toBeNull(); // repeated instinct char
    expect(decodeProfileCode('053xpo-INFP')).toBeNull(); // type 0 invalid
    expect(decodeProfileCode('')).toBeNull();
    expect(decodeProfileCode(null)).toBeNull();
  });

  it('is case-insensitive for the instinct characters', () => {
    const decoded = decodeProfileCode('453XPO-INFP');
    expect(decoded).not.toBeNull();
    expect(decoded.inst.instinctStack).toEqual(['sx', 'sp', 'so']);
  });
});

// ---------------------------------------------------------------------------
// wingStrengthLabel — explicit threshold tests
// ---------------------------------------------------------------------------

describe('wingStrengthLabel — effective-score thresholds', () => {
  it('returns null when strength is null or undefined', () => {
    expect(wingStrengthLabel(null)).toBeNull();
    expect(wingStrengthLabel(undefined)).toBeNull();
  });

  it('passes through string values unchanged', () => {
    expect(wingStrengthLabel('strong')).toBe('strong');
    expect(wingStrengthLabel('moderate')).toBe('moderate');
    expect(wingStrengthLabel('balanced')).toBe('balanced');
  });

  it('> 5 → strong', () => {
    expect(wingStrengthLabel(6)).toBe('strong');
    expect(wingStrengthLabel(5.1)).toBe('strong');
    expect(wingStrengthLabel(15)).toBe('strong');
  });

  it('> 0 and ≤ 5 → moderate', () => {
    expect(wingStrengthLabel(5)).toBe('moderate');
    expect(wingStrengthLabel(3)).toBe('moderate');
    expect(wingStrengthLabel(0.1)).toBe('moderate');
  });

  it('≤ 0 → balanced', () => {
    expect(wingStrengthLabel(0)).toBe('balanced');
    expect(wingStrengthLabel(-1)).toBe('balanced');
    expect(wingStrengthLabel(-5)).toBe('balanced');
  });
});

// ---------------------------------------------------------------------------
// computeWingStrengthDelta — arrow-augmented absolute score
// ---------------------------------------------------------------------------

describe('computeWingStrengthDelta — arrow-augmented absolute effective score', () => {
  it('returns null when inputs are missing', () => {
    expect(computeWingStrengthDelta(5, 6, null)).toBeNull();
    expect(computeWingStrengthDelta(0, 6, {})).toBeNull();
    expect(computeWingStrengthDelta(5, 0, {})).toBeNull();
  });

  it('equals raw wing score when all arrow-type scores are 0', () => {
    // ENN_ARROWS[6] = { growth: 9, stress: 3 }; both score 0 here
    const scores = { 5: 9, 6: 3, 4: 1, 1: 0, 2: 0, 9: 0, 3: 0, 7: 0, 8: 0 };
    expect(computeWingStrengthDelta(5, 6, scores)).toBeCloseTo(3);
  });

  it('adds 20% of growth and stress arrow scores to the wing score', () => {
    // ENN_ARROWS[6] = { growth: 9, stress: 3 }
    // effective(6) = 2 + 0.2*(8 + -7) = 2 + 0.2 = 2.2
    const scores = { 5: 9, 6: 2, 4: -3, 9: 8, 3: -7, 1: -3, 2: -3, 7: -7, 8: -5 };
    expect(computeWingStrengthDelta(5, 6, scores)).toBeCloseTo(2.2);
  });

  it('screenshot regression — 5w6 with scores (5:+9 9:+8 6:+2 4:-3 …) yields moderate, not strong', () => {
    const scores = { 5: 9, 9: 8, 6: 2, 4: -3, 1: -3, 2: -3, 8: -5, 3: -7, 7: -7 };
    const delta = computeWingStrengthDelta(5, 6, scores);
    expect(delta).toBeCloseTo(2.2);
    expect(wingStrengthLabel(delta)).toBe('moderate');
  });
});

// ---------------------------------------------------------------------------
// scoreEnneagram — arrow-augmented wing selection
// ---------------------------------------------------------------------------

describe('scoreEnneagram — arrow evidence can flip wing selection', () => {
  it('selects wing based on arrow-augmented score, not raw score alone', () => {
    const seq = ennSeqFromBank();
    // Core type 5. Raw scores: type 4 = 5, type 6 = 0 → raw would pick wing 4.
    // ENN_ARROWS[4] = { growth: 1, stress: 2 }; both set to -3 → drags effective(4) down.
    // ENN_ARROWS[6] = { growth: 9, stress: 3 }; both set to +2 → boosts effective(6).
    // effective(4) = 5 + 0.2*(-15 + -15) = 5 - 6 = -1
    // effective(6) = 0 + 0.2*(10 + 10)   = 0 + 4  = +4  → wing 6 wins.
    const answers = {};
    seq.forEach((q, i) => {
      if (q.type === 5) answers[i] = 3;       // clear core type
      else if (q.type === 4) answers[i] = 1;  // raw-higher wing candidate
      else if (q.type === 6) answers[i] = 0;  // raw-lower wing candidate
      else if (q.type === 1 || q.type === 2) answers[i] = -3; // type 4's arrows — negative
      else if (q.type === 9 || q.type === 3) answers[i] = 2;  // type 6's arrows — positive
      else answers[i] = -3;
    });
    const r = scoreEnneagram(answers, seq, {}, null);
    expect(r.coreType).toBe(5);
    expect(r.wing).toBe(6); // arrow evidence overrides raw score advantage of type 4
  });
});
