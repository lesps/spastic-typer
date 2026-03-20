import { useState, useEffect } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, ENN_BANK, INSTINCT_BANK, INSTINCT_DISAMBIG, WING_DESC, ENN_DISAMBIG, ENN_ARROWS, ENN_CENTER, ENN_HARMONIC } from '../data/enneagram.js';
import { MBTI_BANK, MBTI_TYPES, MBTI_DISAMBIG } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import LikertScale from '../components/LikertScale.jsx';
import ProgressBar, { certaintyColor } from '../components/ProgressBar.jsx';
import FnBadge from '../components/FnBadge.jsx';
import ExportModal from '../components/ExportModal.jsx';
import { generateSystemPrompt } from '../utils/export.js';
import { computeWingStrengthDelta, wingStrengthLabel, wingStrengthDesc, effectiveWingScore } from '../utils/enneagram.js';
import { computeArchetypeName } from '../utils/archetype.js';
import { encodeProfileCode, decodeProfileCode } from '../utils/share.js';

const INSTINCT_LABELS = { sp: 'Self-Preservation', sx: 'Sexual (One-to-One)', so: 'Social' };
const INSTINCT_DESC = {
  sp: 'Focused on physical security, health, comfort, and resource management.',
  sx: 'Focused on intensity, chemistry, and transformative one-on-one connection.',
  so: 'Focused on group belonging, social roles, and contribution.',
};

// --- localStorage helpers ---
const LS = { enn: 'typer_enn', mbti: 'typer_mbti', inst: 'typer_inst', session: 'typer_session' };
function readLS(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
function writeLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function clearLS(key) { try { localStorage.removeItem(key); } catch {} }

// Phases where a quiz is actively in progress (session should be saved/restored)
const ACTIVE_PHASES = ['enn', 'mbti', 'instinct', 'enn-disambig'];

// --- Adaptive question selection ---
/**
 * Mulberry32 — a simple seeded 32-bit PRNG.
 * Returns a function that produces the next pseudo-random float in [0, 1).
 * Same seed always produces the same sequence.
 */
export function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates in-place shuffle. Returns the array. */
export function shuffleArray(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a fair interleaved question sequence from a bank.
 * Each category gets one question per round before any category gets a second.
 * Questions within each category are independently shuffled first.
 * Category positions within each round rotate using a Latin Square pattern
 * to eliminate order-effect bias across rounds.
 *
 * @param {Array} bank - Array of question objects
 * @param {Function} getCategory - Extracts the category key from a question
 * @param {Function} rng - Random number generator (default: Math.random)
 * @returns {Array} Ordered sequence of questions for the session
 */
export function buildFairSequence(bank, getCategory, rng = Math.random) {
  const byCategory = {};
  bank.forEach(q => {
    const cat = getCategory(q);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  });
  // Shuffle each category's pool independently
  Object.values(byCategory).forEach(pool => shuffleArray(pool, rng));

  // Latin Square rotation: each category rotates position across rounds.
  // Round 0 uses a random permutation as the base ordering.
  // Each subsequent round rotates by one step, so every category occupies
  // every position once across N rounds (where N = number of categories).
  const categoryKeys = Object.keys(byCategory);
  const maxRounds = Math.max(...Object.values(byCategory).map(p => p.length));

  // Generate base permutation: random ordering of category indices
  const baseOrder = categoryKeys.map((_, i) => i);
  shuffleArray(baseOrder, rng);

  const seq = [];
  for (let r = 0; r < maxRounds; r++) {
    // Rotate the base ordering by r positions
    const n = categoryKeys.length;
    const roundOrder = baseOrder.map((_, idx) => baseOrder[(idx + r) % n]);

    const roundItems = roundOrder
      .map(catIdx => {
        const pool = byCategory[categoryKeys[catIdx]];
        return pool[r]; // may be undefined if this category has fewer questions
      })
      .filter(q => q !== undefined);

    seq.push(...roundItems);
  }
  return seq;
}

// --- Confidence thresholds ---
const MBTI_MIN_PER_DIM = 3;        // minimum questions before a dim can be settled
const MBTI_CONFIDENCE_RATIO = 1.8; // |rawSum| / count must exceed this

const ENN_MIN_PER_TYPE = 3;        // minimum questions per type before confidence check
const ENN_GAP_THRESHOLD = 5;       // top type must lead 2nd type by this many points (raw scores)
const ENN_SCORE_GAP_THRESHOLD = 2; // gap used for confidence label on result (acquiescence-corrected scores)

const INST_MIN_PER_INST = 3;       // minimum questions per instinct before confidence check
const INST_GAP_THRESHOLD = 3;      // each adjacent pair in the ranking must differ by this much (raw scores)
const INST_SCORE_GAP_THRESHOLD = 1; // gap used for confidence label on result (acquiescence-corrected scores)

const MIN_COMPLETE_ROUNDS = 3;     // confidence checks disabled until 3 full rounds are complete

/** Returns true if a given MBTI dimension is settled given the current answers and sequence. */
export function isMBTIDimConfident(dim, answers, sequence, upToIndex) {
  // allMBTIDimsConfident enforces the MIN_COMPLETE_ROUNDS floor before calling this
  let rawSum = 0, count = 0;
  for (let i = 0; i <= upToIndex; i++) {
    if (sequence[i]?.dim === dim && answers[i] !== undefined) {
      rawSum += answers[i] * (sequence[i].direction ?? 1);
      count++;
    }
  }
  if (count < MBTI_MIN_PER_DIM) return false;
  return Math.abs(rawSum) / count >= MBTI_CONFIDENCE_RATIO;
}

/** Returns true when all four MBTI dimensions are settled. */
export function allMBTIDimsConfident(answers, sequence, upToIndex) {
  // Don't check confidence until MIN_COMPLETE_ROUNDS full rounds have been presented.
  // A "round" for MBTI is 4 questions (one per dimension).
  if (upToIndex < 4 * MIN_COMPLETE_ROUNDS - 1) return false;
  return ['EI', 'SN', 'TF', 'JP'].every(dim => isMBTIDimConfident(dim, answers, sequence, upToIndex));
}

/** Returns true when the Enneagram top type leads the 2nd by enough points. */
export function isEnnConfident(answers, sequence, upToIndex) {
  // Don't check confidence until MIN_COMPLETE_ROUNDS full rounds have been presented.
  // A "round" for Enneagram is 9 questions (one per type).
  if (upToIndex < 9 * MIN_COMPLETE_ROUNDS - 1) return false;

  const scores = {};
  const counts = {};
  for (let t = 1; t <= 9; t++) { scores[t] = 0; counts[t] = 0; }
  for (let i = 0; i <= upToIndex; i++) {
    const q = sequence[i];
    if (q && answers[i] !== undefined) {
      scores[q.type] += answers[i] * q.pole;
      counts[q.type]++;
    }
  }
  if (Object.values(counts).some(c => c < ENN_MIN_PER_TYPE)) return false;
  const sorted = Object.values(scores).sort((a, b) => b - a);
  return sorted[0] - sorted[1] >= ENN_GAP_THRESHOLD;
}

/** Returns true when the instinct ordering is clear enough to stop. */
export function isInstConfident(answers, sequence, upToIndex) {
  // Don't check confidence until MIN_COMPLETE_ROUNDS full rounds have been presented.
  // A "round" for instinct is 3 questions (one per instinct).
  if (upToIndex < 3 * MIN_COMPLETE_ROUNDS - 1) return false;

  const scores = { sp: 0, sx: 0, so: 0 };
  const counts = { sp: 0, sx: 0, so: 0 };
  for (let i = 0; i <= upToIndex; i++) {
    const q = sequence[i];
    if (q && answers[i] !== undefined) {
      scores[q.inst] += answers[i] * (q.pole ?? 1);
      counts[q.inst]++;
    }
  }
  if (Object.values(counts).some(c => c < INST_MIN_PER_INST)) return false;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return (sorted[0][1] - sorted[1][1] >= INST_GAP_THRESHOLD) &&
         (sorted[1][1] - sorted[2][1] >= INST_GAP_THRESHOLD);
}

// --- Scoring ---
/**
 * Score MBTI dimensions from a sequence + answers.
 * Applies acquiescence correction (mean-centering) to remove response bias.
 * BUG FIX: raw sum is shifted by count*3 so that neutral (0) answers produce a tie,
 * and positive answers correctly produce the pole letter.
 */
export function scoreMBTI(answers, sequence) {
  // Acquiescence correction: compute respondent mean and subtract it
  const allVals = [];
  sequence.forEach((q, i) => { if (answers[i] !== undefined) allVals.push(answers[i]); });
  const respMean = allVals.length > 0 ? allVals.reduce((a, b) => a + b, 0) / allVals.length : 0;

  const scFinal = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const DIMS = { EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'] };
  ['EI', 'SN', 'TF', 'JP'].forEach(dim => {
    const [pos, neg] = DIMS[dim];
    let rawSum = 0, count = 0;
    sequence.forEach((q, i) => {
      if (q.dim === dim && answers[i] !== undefined) {
        rawSum += (answers[i] - respMean) * (q.direction ?? 1);
        count++;
      }
    });
    if (count === 0) { scFinal[pos] = 0; scFinal[neg] = 0; return; }
    // Shift so that rawSum=0 (neutral) produces equal scores,
    // rawSum>0 (agree with positive pole) produces higher pos score.
    const shifted = rawSum + count * 3;
    scFinal[pos] = shifted;
    scFinal[neg] = count * 6 - shifted;
  });
  const margins = ['EI', 'SN', 'TF', 'JP'].map(dim => {
    const [a, b] = [dim[0], dim[1]];
    return Math.abs(scFinal[a] - scFinal[b]);
  });
  const minMargin = Math.min(...margins);
  const confidence = minMargin >= 10 ? 'high' : minMargin >= 4 ? 'moderate' : 'close';
  const r = (scFinal.E >= scFinal.I ? 'E' : 'I') +
            (scFinal.S >= scFinal.N ? 'S' : 'N') +
            (scFinal.T >= scFinal.F ? 'T' : 'F') +
            (scFinal.J >= scFinal.P ? 'J' : 'P');
  return { result: r, scores: scFinal, confidence };
}

export function scoreEnneagram(answers, sequence, branchAnswers, disambigPair) {
  // Acquiescence correction: compute respondent mean and subtract it
  const allVals = [];
  sequence.forEach((q, i) => { if (answers[i] !== undefined) allVals.push(answers[i]); });
  const respMean = allVals.length > 0 ? allVals.reduce((a, b) => a + b, 0) / allVals.length : 0;

  const scores = {};
  for (let t = 1; t <= 9; t++) scores[t] = 0;
  sequence.forEach((q, i) => {
    if (answers[i] !== undefined) scores[q.type] += (answers[i] - respMean) * q.pole;
  });
  if (branchAnswers && disambigPair && ENN_DISAMBIG[disambigPair]) {
    const DISAMBIG_WEIGHT = 0.6;
    ENN_DISAMBIG[disambigPair].forEach((q, i) => {
      if (branchAnswers[i] !== undefined) scores[q.favors] = (scores[q.favors] || 0) + branchAnswers[i] * DISAMBIG_WEIGHT;
    });
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const core = parseInt(sorted[0][0]);
  const w1 = core === 1 ? 9 : core - 1, w2 = core === 9 ? 1 : core + 1;
  const wing = effectiveWingScore(w1, scores) >= effectiveWingScore(w2, scores) ? w1 : w2;
  const delta = computeWingStrengthDelta(core, wing, scores);
  const gap = sorted[0][1] - sorted[1][1];
  const confidence = gap >= ENN_SCORE_GAP_THRESHOLD * 1.5 ? 'high' : gap >= ENN_SCORE_GAP_THRESHOLD ? 'moderate' : 'close';
  return { coreType: core, wing, scores, wingStrengthDelta: delta, display: `${core}w${wing}`, confidence };
}

export function scoreInstinct(answers, sequence, disambigAnswers = {}, disambigSeq = []) {
  // Acquiescence correction: compute respondent mean and subtract it
  const allVals = [];
  sequence.forEach((q, i) => { if (answers[i] !== undefined) allVals.push(answers[i]); });
  const respMean = allVals.length > 0 ? allVals.reduce((a, b) => a + b, 0) / allVals.length : 0;

  const instScores = { sp: 0, sx: 0, so: 0 };
  sequence.forEach((q, i) => {
    if (answers[i] !== undefined) instScores[q.inst] += (answers[i] - respMean) * (q.pole ?? 1);
  });
  disambigSeq.forEach((q, i) => {
    if (disambigAnswers[i] !== undefined) {
      const v = disambigAnswers[i];
      instScores[q.favors] += v;
      instScores[q.opponent] -= v;
    }
  });
  const instinctStack = Object.entries(instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const sortedInst = Object.entries(instScores).sort((a, b) => b[1] - a[1]);
  const gap1 = sortedInst[0][1] - sortedInst[1][1];
  const gap2 = sortedInst[1][1] - sortedInst[2][1];
  const minGap = Math.min(gap1, gap2);
  const confidence = minGap >= INST_SCORE_GAP_THRESHOLD * 1.5 ? 'high' : minGap >= INST_SCORE_GAP_THRESHOLD ? 'moderate' : 'close';
  return { instinctStack, instScores, confidence };
}

export default function GuidedTyper({ setView = () => {}, setExplorerTab = () => {}, setExplorerSel = () => {}, setModelTab = () => {} }) {
  const goToExplorer = (tab, sel = null) => { setExplorerTab(tab); setExplorerSel(sel); setView('explorer'); };
  // Restore in-progress quiz session from localStorage if available
  const [phase, setPhase] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? s.phase : 'choose';
  });
  const [qi, setQi] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.qi ?? 0) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.answers ?? {}) : {};
  });
  const [instAnswers, setInstAnswers] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.instAnswers ?? {}) : {};
  });
  const [mbtiAnswers, setMbtiAnswers] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.mbtiAnswers ?? {}) : {};
  });
  const [branchAnswers, setBranchAnswers] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.branchAnswers ?? {}) : {};
  });
  const [disambigPair, setDisambigPair] = useState(() => {
    const s = readLS(LS.session);
    return (s && ACTIVE_PHASES.includes(s.phase)) ? (s.disambigPair ?? null) : null;
  });
  // Instinct disambiguation state
  const [instDisambigPair, setInstDisambigPair] = useState(null);
  const [instDisambigSeq, setInstDisambigSeq] = useState([]);
  const [instDisambigAnswers, setInstDisambigAnswers] = useState({});
  const [instDisambigQi, setInstDisambigQi] = useState(0);
  // MBTI disambiguation state
  const [mbtiDisambigSeq, setMbtiDisambigSeq] = useState([]);
  const [mbtiDisambigAnswers, setMbtiDisambigAnswers] = useState({});
  const [mbtiDisambigQi, setMbtiDisambigQi] = useState(0);
  const [result, setResult] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [profileCode, setProfileCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadSuccess, setLoadSuccess] = useState('');
  // Adaptive question sequences — restored from session or generated fresh
  const [mbtiSeq, setMbtiSeq] = useState(() => {
    const s = readLS(LS.session);
    return (s?.mbtiSeqIds?.length) ? s.mbtiSeqIds.map(i => MBTI_BANK[i]) : [];
  });
  const [ennSeq, setEnnSeq] = useState(() => {
    const s = readLS(LS.session);
    return (s?.ennSeqIds?.length) ? s.ennSeqIds.map(i => ENN_BANK[i]) : [];
  });
  const [instSeq, setInstSeq] = useState(() => {
    const s = readLS(LS.session);
    return (s?.instSeqIds?.length) ? s.instSeqIds.map(i => INSTINCT_BANK[i]) : [];
  });
  const [saved, setSaved] = useState(() => ({
    enn: readLS(LS.enn),
    mbti: readLS(LS.mbti),
    inst: readLS(LS.inst),
  }));
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [combinationProfile, setCombinationProfile] = useState(null);

  // --- Load combination profile when all 3 assessments complete ---
  useEffect(() => {
    const { enn, mbti, inst } = saved;
    if (!enn || !mbti || !inst) { setCombinationProfile(null); return; }
    import('../data/combinations/index.js').then(({ getCombinationProfile: load }) => {
      const instStackStr = (inst.instinctStack || []).map(s => s.toUpperCase()).join('/');
      load(enn.coreType, enn.wing, mbti.result, instStackStr).then(p => setCombinationProfile(p));
    }).catch(() => setCombinationProfile(null));
  }, [saved.enn?.display, saved.mbti?.result, saved.inst?.instinctStack?.join()]);


  // --- Session persistence — save/restore mid-quiz state across tab switches ---
  useEffect(() => {
    if (!ACTIVE_PHASES.includes(phase)) {
      clearLS(LS.session);
      return;
    }
    writeLS(LS.session, {
      phase, qi, answers, mbtiAnswers, instAnswers, branchAnswers, disambigPair,
      ennSeqIds: ennSeq.map(q => ENN_BANK.indexOf(q)),
      mbtiSeqIds: mbtiSeq.map(q => MBTI_BANK.indexOf(q)),
      instSeqIds: instSeq.map(q => INSTINCT_BANK.indexOf(q)),
    });
  }, [phase, qi, answers, mbtiAnswers, instAnswers, branchAnswers, disambigPair, ennSeq, mbtiSeq, instSeq]);

  // --- Next incomplete quiz helper ---
  function nextIncompleteQuiz(sv, justCompleted) {
    return ['enn', 'mbti', 'inst'].find(k => k !== justCompleted && !sv[k]) || null;
  }

  const QUIZ_LABEL = { enn: 'Enneagram', mbti: 'MBTI', inst: 'Instinct Stack' };

  const startQuiz = (quiz) => {
    const seed = Math.floor(Math.random() * 0xFFFFFFFF);
    const rng = mulberry32(seed);
    if (quiz === 'enn') {
      const seq = buildFairSequence(ENN_BANK, q => q.type, rng);
      setEnnSeq(seq); setPhase('enn'); setQi(0); setAnswers({}); setBranchAnswers({}); setDisambigPair(null);
    } else if (quiz === 'mbti') {
      const seq = buildFairSequence(MBTI_BANK, q => q.dim, rng);
      setMbtiSeq(seq); setPhase('mbti'); setQi(0); setMbtiAnswers({});
    } else if (quiz === 'inst') {
      const seq = buildFairSequence(INSTINCT_BANK, q => q.inst, rng);
      setInstSeq(seq); setPhase('instinct'); setQi(0); setInstAnswers({});
    }
  };

  // --- Answer handlers ---
  const handleEnnAnswer = (v) => {
    const na = { ...answers, [qi]: v };
    setAnswers(na);
    setTimeout(() => {
      const nextQi = qi + 1;
      const confident = isEnnConfident(na, ennSeq, qi);
      const exhausted = nextQi >= ennSeq.length;
      if (!confident && !exhausted) {
        setQi(nextQi);
      } else {
        // Check if disambiguation needed (top-2 too close after bank)
        const baseScores = {};
        for (let t = 1; t <= 9; t++) baseScores[t] = 0;
        ennSeq.forEach((q, i) => { if (na[i] !== undefined) baseScores[q.type] += na[i] * q.pole; });
        const sorted = Object.entries(baseScores).sort((a, b) => b[1] - a[1]);
        const gap = sorted[0][1] - sorted[1][1];
        if (gap < ENN_GAP_THRESHOLD) {
          const t1 = parseInt(sorted[0][0]), t2 = parseInt(sorted[1][0]);
          const pairKey = `${Math.min(t1, t2)}-${Math.max(t1, t2)}`;
          if (ENN_DISAMBIG[pairKey]) {
            setDisambigPair(pairKey);
            setBranchAnswers({});
            setQi(0);
            setPhase('enn-disambig');
            return;
          }
        }
        const r = scoreEnneagram(na, ennSeq, branchAnswers, disambigPair);
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.enn, backup);
        setSaved(s => ({ ...s, enn: backup }));
        setResult(r);
        setPhase('enn-result');
      }
    }, 150);
  };

  const handleDisambigAnswer = (v) => {
    const nb = { ...branchAnswers, [qi]: v };
    setBranchAnswers(nb);
    const total = ENN_DISAMBIG[disambigPair].length;
    setTimeout(() => {
      if (qi < total - 1) setQi(qi + 1);
      else {
        const r = scoreEnneagram(answers, ennSeq, nb, disambigPair);
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.enn, backup);
        setSaved(s => ({ ...s, enn: backup }));
        setResult(r);
        setPhase('enn-result');
      }
    }, 150);
  };

  const finishInstinct = (mainAnswers, dAnswers = {}, dSeq = []) => {
    const r = scoreInstinct(mainAnswers, instSeq, dAnswers, dSeq);
    const backup = { ...r, exportedAt: new Date().toISOString() };
    writeLS(LS.inst, backup);
    setSaved(s => ({ ...s, inst: backup }));
    setResult(r);
    setPhase('inst-result');
  };

  const handleInstAloneAnswer = (v) => {
    const ni = { ...instAnswers, [qi]: v };
    setInstAnswers(ni);
    setTimeout(() => {
      const nextQi = qi + 1;
      const confident = isInstConfident(ni, instSeq, qi);
      const exhausted = nextQi >= instSeq.length;
      if (!confident && !exhausted) {
        setQi(nextQi);
      } else if (confident) {
        finishInstinct(ni);
      } else {
        // Bank exhausted but not confident — try pair disambiguation
        const instScores = { sp: 0, sx: 0, so: 0 };
        instSeq.forEach((q, i) => { if (ni[i] !== undefined) instScores[q.inst] += ni[i]; });
        const sorted = Object.entries(instScores).sort((a, b) => b[1] - a[1]);
        const CANONICAL = ['sp', 'so', 'sx'];
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i][1] - sorted[i + 1][1] < INST_GAP_THRESHOLD) {
            const [a, b2] = [sorted[i][0], sorted[i + 1][0]].sort(
              (x, y) => CANONICAL.indexOf(x) - CANONICAL.indexOf(y)
            );
            const pairKey = `${a}-${b2}`;
            if (INSTINCT_DISAMBIG[pairKey]) {
              const raw = INSTINCT_DISAMBIG[pairKey];
              const seq = shuffleArray(raw.map(q => ({
                ...q,
                opponent: q.favors === a ? b2 : a,
              })));
              setInstDisambigPair(pairKey);
              setInstDisambigSeq(seq);
              setInstDisambigAnswers({});
              setInstDisambigQi(0);
              setPhase('inst-disambig');
              return;
            }
            break;
          }
        }
        finishInstinct(ni);
      }
    }, 150);
  };

  const handleInstDisambigAnswer = (v) => {
    const ni = { ...instDisambigAnswers, [instDisambigQi]: v };
    setInstDisambigAnswers(ni);
    setTimeout(() => {
      const nextQi = instDisambigQi + 1;
      const r = scoreInstinct(instAnswers, instSeq, ni, instDisambigSeq);
      const sorted = Object.entries(r.instScores).sort((a, b) => b[1] - a[1]);
      const nowConfident =
        sorted[0][1] - sorted[1][1] >= INST_GAP_THRESHOLD &&
        sorted[1][1] - sorted[2][1] >= INST_GAP_THRESHOLD;
      const exhausted = nextQi >= instDisambigSeq.length;
      if (nowConfident || exhausted) {
        finishInstinct(instAnswers, ni, instDisambigSeq);
      } else {
        setInstDisambigQi(nextQi);
      }
    }, 150);
  };

  const finishMBTI = (mainAnswers, dAnswers = {}, dSeq = []) => {
    const combinedSeq = [...mbtiSeq, ...dSeq];
    const combinedAnswers = { ...mainAnswers };
    Object.entries(dAnswers).forEach(([i, val]) => {
      combinedAnswers[mbtiSeq.length + parseInt(i)] = val;
    });
    const r = scoreMBTI(combinedAnswers, combinedSeq);
    const backup = { ...r, exportedAt: new Date().toISOString() };
    writeLS(LS.mbti, backup);
    setSaved(s => ({ ...s, mbti: backup }));
    setResult(r);
    setPhase('mbti-result');
  };

  const handleMBTIAnswer = (v) => {
    const nm = { ...mbtiAnswers, [qi]: v };
    setMbtiAnswers(nm);
    setTimeout(() => {
      const nextQi = qi + 1;
      const confident = allMBTIDimsConfident(nm, mbtiSeq, qi);
      const exhausted = nextQi >= mbtiSeq.length;
      if (!confident && !exhausted) {
        setQi(nextQi);
      } else if (confident) {
        finishMBTI(nm);
      } else {
        // Bank exhausted — check for unconfident dims and disambiguate
        const DIMS = ['EI', 'SN', 'TF', 'JP'];
        const weakDims = DIMS.filter(d => !isMBTIDimConfident(d, nm, mbtiSeq, qi));
        if (weakDims.length > 0) {
          const rawSeq = weakDims.flatMap(d => (MBTI_DISAMBIG[d] || []).map(q => ({ ...q })));
          const seq = shuffleArray(rawSeq);
          setMbtiDisambigSeq(seq);
          setMbtiDisambigAnswers({});
          setMbtiDisambigQi(0);
          setPhase('mbti-disambig');
          return;
        }
        finishMBTI(nm);
      }
    }, 150);
  };

  const handleMBTIDisambigAnswer = (v) => {
    const ni = { ...mbtiDisambigAnswers, [mbtiDisambigQi]: v };
    setMbtiDisambigAnswers(ni);
    setTimeout(() => {
      const nextQi = mbtiDisambigQi + 1;
      const combinedSeq = [...mbtiSeq, ...mbtiDisambigSeq];
      const combinedAnswers = { ...mbtiAnswers };
      Object.entries(ni).forEach(([i, val]) => {
        combinedAnswers[mbtiSeq.length + parseInt(i)] = val;
      });
      const nowConfident = allMBTIDimsConfident(combinedAnswers, combinedSeq, combinedSeq.length - 1);
      const exhausted = nextQi >= mbtiDisambigSeq.length;
      if (nowConfident || exhausted) {
        finishMBTI(mbtiAnswers, ni, mbtiDisambigSeq);
      } else {
        setMbtiDisambigQi(nextQi);
      }
    }, 150);
  };

  // --- Retake / reset ---
  const reset = () => {
    clearLS(LS.session);
    setPhase('choose'); setQi(0); setAnswers({}); setInstAnswers({}); setMbtiAnswers({});
    setBranchAnswers({}); setDisambigPair(null); setResult(null); setExportData(null);
    setMbtiSeq([]); setEnnSeq([]); setInstSeq([]); setConfirmCancel(false);
    setInstDisambigPair(null); setInstDisambigSeq([]); setInstDisambigAnswers({}); setInstDisambigQi(0);
    setMbtiDisambigSeq([]); setMbtiDisambigAnswers({}); setMbtiDisambigQi(0);
  };
  const retakeEnn = () => {
    clearLS(LS.enn); clearLS(LS.session); setSaved(s => ({ ...s, enn: null }));
    const seed = Math.floor(Math.random() * 0xFFFFFFFF);
    const seq = buildFairSequence(ENN_BANK, q => q.type, mulberry32(seed));
    setEnnSeq(seq);
    setPhase('enn'); setQi(0); setAnswers({}); setBranchAnswers({}); setDisambigPair(null);
  };
  const retakeMBTI = () => {
    clearLS(LS.mbti); clearLS(LS.session); setSaved(s => ({ ...s, mbti: null }));
    const seed = Math.floor(Math.random() * 0xFFFFFFFF);
    const seq = buildFairSequence(MBTI_BANK, q => q.dim, mulberry32(seed));
    setMbtiSeq(seq);
    setPhase('mbti'); setQi(0); setMbtiAnswers({});
    setMbtiDisambigSeq([]); setMbtiDisambigAnswers({}); setMbtiDisambigQi(0);
  };
  const retakeInst = () => {
    clearLS(LS.inst); clearLS(LS.session); setSaved(s => ({ ...s, inst: null }));
    const seed = Math.floor(Math.random() * 0xFFFFFFFF);
    const seq = buildFairSequence(INSTINCT_BANK, q => q.inst, mulberry32(seed));
    setInstSeq(seq);
    setPhase('instinct'); setQi(0); setInstAnswers({});
    setInstDisambigPair(null); setInstDisambigSeq([]); setInstDisambigAnswers({}); setInstDisambigQi(0);
  };

  const handleClearAll = () => {
    clearLS(LS.enn); clearLS(LS.mbti); clearLS(LS.inst); clearLS(LS.session);
    setSaved({ enn: null, mbti: null, inst: null });
    setConfirmClear(false);
  };

  const handleExportAll = () => {
    const md = generateSystemPrompt(saved.enn, saved.mbti);
    const backup = { type: 'full-profile', exportedAt: new Date().toISOString(), enneagram: saved.enn, mbti: saved.mbti, instinct: saved.inst };
    setExportData({ markdown: md, backup });
  };

  // --- Profile code ---
  const handleGenerateCode = () => {
    const code = encodeProfileCode(saved.enn, saved.mbti, saved.inst);
    if (!code) return;
    setProfileCode(code);
    navigator.clipboard?.writeText(code).then(() => {
      setCodeMsg('Copied!');
      setTimeout(() => setCodeMsg(''), 3000);
    }).catch(() => {
      setCodeMsg('');
    });
  };

  const handleLoadCode = () => {
    setLoadError('');
    setLoadSuccess('');
    const decoded = decodeProfileCode(loadCode.trim());
    if (!decoded) {
      setLoadError('Invalid code — check for typos and try again.');
      return;
    }
    const ts = new Date().toISOString();
    const newEnn = { ...decoded.enn, exportedAt: ts };
    const newMbti = { ...decoded.mbti, exportedAt: ts };
    const newInst = { ...decoded.inst, exportedAt: ts };
    writeLS(LS.enn, newEnn);
    writeLS(LS.mbti, newMbti);
    writeLS(LS.inst, newInst);
    setSaved({ enn: newEnn, mbti: newMbti, inst: newInst });
    setLoadCode('');
    setLoadSuccess('Profile loaded!');
    setTimeout(() => setLoadSuccess(''), 3000);
  };

  // --- Choose screen ---
  if (phase === 'choose') {
    const doneCount = [saved.enn, saved.mbti, saved.inst].filter(Boolean).length;
    const hasAny = doneCount > 0;
    const allDone = doneCount === 3;
    const archetypeName = allDone ? computeArchetypeName(saved.enn?.coreType, saved.mbti?.result, saved.inst?.instinctStack?.[0]) : null;
    return (
      <div style={S.page}><div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 20 }}>
          <h1 style={{ ...S.h1, fontSize: 32, marginBottom: 4 }}>Guided Typer</h1>
          <p style={S.body}>Discover your personality type through structured assessment</p>
        </div>

        <div style={{ ...S.card, marginBottom: 20, padding: '14px 16px' }}>
          <p style={{ ...S.body, fontSize: 13, lineHeight: 1.7 }}>
            Take all three assessments to build your full personality profile. Complete all three to unlock your <strong style={{ color: G.text }}>Profile Code</strong> (share it with others or load it in the Compare tab) and the <strong style={{ color: G.text }}>Export</strong> button.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ key: 'enn', label: 'Enneagram', val: saved.enn?.display }, { key: 'mbti', label: 'MBTI', val: saved.mbti?.result }, { key: 'inst', label: 'Instinct Stack', val: saved.inst ? saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/') : null }].map(({ key, label, val }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: val ? G.goldDim : G.bg3, border: `1px solid ${val ? G.goldBorder : G.border}` }}>
              <span style={{ fontSize: 12, color: val ? G.gold : G.textFaint }}>{val ? '✓' : '○'}</span>
              <span style={{ fontSize: 12, color: val ? G.text : G.textFaint }}>{val || label}</span>
            </div>
          ))}
        </div>

        {hasAny && (
          <div style={{ ...S.cardGold, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ ...S.h3, marginBottom: 4 }}>Your Profile</h3>
                {archetypeName && (
                  <button
                    aria-label="View combined profile in Mental Model"
                    onClick={() => { setModelTab('combined'); setView('model'); }}
                    style={{ fontSize: 13, color: G.gold, marginBottom: 4, fontStyle: 'italic', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textAlign: 'left' }}
                  >{archetypeName}</button>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {saved.enn && (
                    <button
                      aria-label={`Explore Enneagram type ${saved.enn.coreType} on Explorer`}
                      onClick={() => goToExplorer('enneagram', saved.enn.coreType)}
                      style={{ ...S.tag, cursor: 'pointer', background: 'transparent' }}
                    >{saved.enn.display} →</button>
                  )}
                  {saved.mbti && (
                    <button
                      aria-label={`Explore MBTI type ${saved.mbti.result} on Explorer`}
                      onClick={() => goToExplorer('mbti', saved.mbti.result)}
                      style={{ ...S.tag, cursor: 'pointer', background: 'transparent' }}
                    >{saved.mbti.result} →</button>
                  )}
                  {saved.inst && (
                    <button
                      aria-label="Explore instinct stack on Explorer"
                      onClick={() => goToExplorer('instinct', saved.inst.instinctStack?.[0])}
                      style={{ ...S.tag, cursor: 'pointer', background: 'transparent' }}
                    >{saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/')} →</button>
                  )}
                </div>
                {!allDone && (
                  <p style={{ fontSize: 11, color: G.textFaint, marginTop: 6 }}>
                    {doneCount}/3 complete — finish all three to unlock Profile Code and Export
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
                {allDone && (<>
                  <button onClick={handleExportAll} style={{ ...S.btnOutline, whiteSpace: 'nowrap', padding: '8px 14px', fontSize: 13 }}>Export</button>
                  <button onClick={handleGenerateCode} style={{ ...S.btn, whiteSpace: 'nowrap' }}>Get Code</button>
                </>)}
                <button onClick={() => setConfirmClear(true)} style={{ ...S.btnDanger, whiteSpace: 'nowrap', padding: '8px 14px', fontSize: 13 }}>Clear</button>
              </div>
            </div>
            {profileCode && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code
                    onClick={handleGenerateCode}
                    style={{
                      fontFamily: "'DM Mono',monospace", fontSize: 18, letterSpacing: 2,
                      color: G.gold, background: G.bg3, border: `1px solid ${G.goldBorder}`,
                      borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                      userSelect: 'all',
                    }}
                  >{profileCode}</code>
                  {codeMsg && <span style={{ fontSize: 12, color: G.gold }}>{codeMsg}</span>}
                </div>
                <p style={{ fontSize: 11, color: G.textFaint, marginTop: 4 }}>Click to copy · paste this code to load your profile in Compare or share it with others</p>
              </div>
            )}
            {confirmClear && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: G.bg3, borderRadius: 8, border: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 13, color: G.text, marginBottom: 8 }}>Clear all saved results? This cannot be undone.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleClearAll} style={{ ...S.btnDanger, padding: '6px 14px', fontSize: 12 }}>Yes, clear all</button>
                  <button onClick={() => setConfirmClear(false)} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12 }}>Cancel</button>
                </div>
              </div>
            )}
            {allDone && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${G.goldBorder}` }}>
                <button
                  onClick={() => { setModelTab('combined'); setView('model'); }}
                  style={{ ...S.btnOutline, width: '100%', fontSize: 13 }}
                >View full combined profile in Mental Model →</button>
              </div>
            )}
          </div>
        )}
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}

        {/* Quiz cards */}
        <div style={{ ...S.cardGold, cursor: saved.enn ? 'default' : 'pointer' }} onClick={saved.enn ? undefined : () => {
          const seq = buildFairSequence(ENN_BANK, q => q.type);
          setEnnSeq(seq); setPhase('enn'); setQi(0); setAnswers({}); setBranchAnswers({}); setDisambigPair(null);
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={S.h3}>Enneagram</h3>
              <h2 style={S.h2}>Core Type + Wing</h2>
              {saved.enn ? (
                <div style={{ marginTop: 8 }}>
                  <span style={{ ...S.tag, marginRight: 6 }}>{saved.enn.display}</span>
                  <span style={{ fontSize: 12, color: G.textDim }}>{ENN_TYPES[saved.enn.coreType]?.name}</span>
                </div>
              ) : (
                <>
                  <p style={{ ...S.body, marginTop: 8 }}>Adaptive assessment — questions continue until your type is clear. Typically 15–30 questions.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~5 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>adaptive</span></div>
                </>
              )}
            </div>
            {saved.enn && (
              <button onClick={(e) => { e.stopPropagation(); retakeEnn(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

        <div style={{ ...S.cardGold, cursor: saved.mbti ? 'default' : 'pointer' }} onClick={saved.mbti ? undefined : () => {
          const seq = buildFairSequence(MBTI_BANK, q => q.dim);
          setMbtiSeq(seq); setPhase('mbti'); setQi(0); setMbtiAnswers({});
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={S.h3}>MBTI</h3>
              <h2 style={S.h2}>Cognitive Function Stack</h2>
              {saved.mbti ? (
                <div style={{ marginTop: 8 }}>
                  <span style={{ ...S.tag, marginRight: 6 }}>{saved.mbti.result}</span>
                  <span style={{ fontSize: 12, color: G.textDim }}>{MBTI_TYPES[saved.mbti.result]?.name}</span>
                </div>
              ) : (
                <>
                  <p style={{ ...S.body, marginTop: 8 }}>Adaptive assessment across four dimensions — ends early when each dimension is clear. Typically 8–20 questions.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~4 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>adaptive</span></div>
                </>
              )}
            </div>
            {saved.mbti && (
              <button onClick={(e) => { e.stopPropagation(); retakeMBTI(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

        <div style={{ ...S.cardGold, cursor: saved.inst ? 'default' : 'pointer' }} onClick={saved.inst ? undefined : () => {
          const seq = buildFairSequence(INSTINCT_BANK, q => q.inst);
          setInstSeq(seq); setPhase('instinct'); setQi(0); setInstAnswers({});
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={S.h3}>Instinct Stack</h3>
              <h2 style={S.h2}>SP · SX · SO Drive Ordering</h2>
              {saved.inst ? (
                <div style={{ marginTop: 8 }}>
                  <span style={{ ...S.tag, marginRight: 6 }}>{saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/')}</span>
                  <span style={{ fontSize: 12, color: G.textDim }}>{INSTINCT_LABELS[saved.inst.instinctStack?.[0]]} dominant</span>
                </div>
              ) : (
                <>
                  <p style={{ ...S.body, marginTop: 8 }}>Adaptive assessment of your three instinctual drives — ends when their ordering is clear. Typically 6–15 questions.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~2 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>adaptive</span></div>
                </>
              )}
            </div>
            {saved.inst && (
              <button onClick={(e) => { e.stopPropagation(); retakeInst(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

        {/* Load Profile */}
        <div style={{ ...S.card, marginTop: 8, padding: '14px 16px' }}>
          <h3 style={{ ...S.h3, marginBottom: 8 }}>Load a shared profile</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={loadCode}
              onChange={e => { setLoadCode(e.target.value); setLoadError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLoadCode()}
              placeholder="e.g. 453xpo-INFP"
              maxLength={11}
              style={{
                flex: 1, fontFamily: "'DM Mono',monospace", fontSize: 14,
                background: G.bg3, color: G.text, border: `1px solid ${G.border}`,
                borderRadius: 8, padding: '8px 12px', outline: 'none',
                letterSpacing: 1,
              }}
            />
            <button onClick={handleLoadCode} style={{ ...S.btn, whiteSpace: 'nowrap', padding: '8px 16px' }}>Load</button>
          </div>
          {loadError && <p style={{ fontSize: 12, color: '#e87050', marginTop: 6 }}>{loadError}</p>}
          {loadSuccess && <p style={{ fontSize: 12, color: G.gold, marginTop: 6 }}>{loadSuccess}</p>}
        </div>

      </div></div>
    );
  }

  // --- Enneagram questions ---
  if (phase === 'enn' && ennSeq.length > 0) {
    const q = ennSeq[qi];
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1}</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={answers[qi]} onChange={handleEnnAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            {(() => {
              const sc = {};
              for (let t = 1; t <= 9; t++) sc[t] = 0;
              for (let i = 0; i <= qi; i++) {
                const q = ennSeq[i];
                if (q && answers[i] !== undefined) sc[q.type] += answers[i] * q.pole;
              }
              const sv = Object.values(sc).sort((a, b) => b - a);
              const ennCertainty = Math.min(1, Math.max(0, (sv[0] - sv[1]) / ENN_GAP_THRESHOLD));
              return <ProgressBar current={qi + 1} total={ennSeq.length} certainty={ennCertainty} />;
            })()}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              {!confirmCancel
                ? <button onClick={() => setConfirmCancel(true)} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setConfirmCancel(false)} style={{ ...S.btnOutline, marginTop: 8 }}>Keep going</button>
                    <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, color: '#e85050', borderColor: '#e85050' }}>Yes, cancel</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Disambiguation (branching) questions ---
  if (phase === 'enn-disambig' && disambigPair) {
    const questions = ENN_DISAMBIG[disambigPair];
    const q = questions[qi];
    const [t1, t2] = disambigPair.split('-').map(Number);
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h3 style={S.h3}>Clarifying Questions</h3>
              <p style={{ ...S.body, fontSize: 13 }}>Your top results for Type {t1} and Type {t2} are very close. These questions help distinguish them.</p>
            </div>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of {questions.length}</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={branchAnswers[qi]} onChange={handleDisambigAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            <ProgressBar current={qi + 1} total={questions.length} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              <button onClick={() => {
                const r = scoreEnneagram(answers, ennSeq, branchAnswers, disambigPair);
                const backup = { ...r, exportedAt: new Date().toISOString() };
                writeLS(LS.enn, backup); setSaved(s => ({ ...s, enn: backup })); setResult(r); setPhase('enn-result');
              }} style={{ ...S.btnOutline, marginTop: 8 }}>Skip →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Enneagram result ---
  if (phase === 'enn-result' && result) {
    const t = ENN_TYPES[result.coreType];
    const wKey = `${result.coreType}w${result.wing}`;
    return (
      <div style={S.page}><div style={S.container}>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
          <p style={{ ...S.mono, fontSize: 12, marginBottom: 8 }}>Your Enneagram Result</p>
          <h1 style={{ ...S.h1, fontSize: 'clamp(28px,9vw,44px)', marginBottom: 4 }}>{result.display}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{t.name}</h2>
          {result.confidence && (
            <p style={{ ...S.mono, fontSize: 11, color: result.confidence === 'high' ? '#50c878' : result.confidence === 'moderate' ? G.gold : '#e88050', marginTop: 4 }}>
              {result.confidence === 'high' ? '● High confidence' : result.confidence === 'moderate' ? '● Moderate confidence' : '● Close result — consider exploring adjacent types'}
            </p>
          )}
        </div>
        <div style={S.cardGold}><p style={{ ...S.body, fontSize: 15 }}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Core Fear</h3><p style={S.body}>{t.fear}</p>
          <div style={S.divider} />
          <h3 style={S.h3}>Core Desire</h3><p style={S.body}>{t.desire}</p>
          <div style={S.divider} />
          <h3 style={S.h3}>Wing</h3><p style={S.body}>{WING_DESC[wKey]}</p>
          {result.wingStrengthDelta !== null && result.wingStrengthDelta !== undefined && (<>
            <div style={S.divider} />
            <h3 style={S.h3}>Wing Strength</h3>
            <p style={S.body}>{wingStrengthDesc(result.wingStrengthDelta)}</p>
          </>)}
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Type Scores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 8 }}>
            {Object.entries(result.scores).sort((a, b) => b[1] - a[1]).map(([tp, sc]) => (
              <div key={tp} style={{ background: parseInt(tp) === result.coreType ? G.goldDim : G.bg3, border: `1px solid ${parseInt(tp) === result.coreType ? G.goldBorder : G.border}`, borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center' }}>
                <span style={S.mono}>{tp}</span>
                <span style={{ ...S.body, marginLeft: 8 }}>{sc > 0 ? '+' : ''}{sc.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={reset}>← Back to Assessments</button>
          {nextIncompleteQuiz(saved, 'enn') && (
            <button style={{ ...S.btn, flex: 1 }} onClick={() => { reset(); startQuiz(nextIncompleteQuiz(saved, 'enn')); }}>
              Start {QUIZ_LABEL[nextIncompleteQuiz(saved, 'enn')]} →
            </button>
          )}
        </div>
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('enneagram', result.coreType)}>Learn more on the Explorer tab →</button>
      </div></div>
    );
  }

  // --- Standalone instinct questions ---
  if (phase === 'instinct' && instSeq.length > 0) {
    const q = instSeq[qi];
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h3 style={S.h3}>Instinct Stack Assessment</h3>
              <p style={{ ...S.body, fontSize: 13 }}>Rate each statement — the assessment ends when your drive ordering becomes clear.</p>
            </div>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1}</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={instAnswers[qi]} onChange={handleInstAloneAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            {(() => {
              const isc = { sp: 0, sx: 0, so: 0 };
              const icnt = { sp: 0, sx: 0, so: 0 };
              const itotal = { sp: 0, sx: 0, so: 0 };
              instSeq.forEach(q => { if (itotal[q.inst] !== undefined) itotal[q.inst]++; });
              for (let i = 0; i <= qi; i++) {
                const q = instSeq[i];
                if (q && instAnswers[i] !== undefined) {
                  isc[q.inst] += instAnswers[i] * (q.pole ?? 1);
                  icnt[q.inst]++;
                }
              }
              const isorted = Object.entries(isc).sort((a, b) => b[1] - a[1]);
              const gap1 = isorted[0][1] - isorted[1][1];
              const gap2 = isorted[1][1] - isorted[2][1];
              const minCount = Math.min(icnt.sp, icnt.sx, icnt.so);
              const minProgress = Math.min(1, minCount / INST_MIN_PER_INST);
              const gapProgress = Math.min(1, Math.max(0, Math.min(gap1, gap2) / INST_GAP_THRESHOLD));
              const overallCertainty = minProgress * gapProgress;
              const color = certaintyColor(overallCertainty);
              return (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, marginBottom: 20 }}>
                  {['sp', 'sx', 'so'].map(inst => {
                    const fillPct = itotal[inst] > 0 ? (icnt[inst] / itotal[inst]) * 100 : 0;
                    return (
                      <div key={inst} style={{ flex: 1, position: 'relative' }}>
                        <div style={{ height: 3, borderRadius: 2, background: G.border }}>
                          <div style={{ height: '100%', borderRadius: 2, background: color, width: `${fillPct}%`, transition: 'width 0.3s, background 0.4s' }} />
                        </div>
                        <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: overallCertainty >= 1 ? '#50c878' : G.textFaint, fontFamily: "'DM Mono',monospace", transition: 'color 0.4s', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{inst}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              {!confirmCancel
                ? <button onClick={() => setConfirmCancel(true)} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setConfirmCancel(false)} style={{ ...S.btnOutline, marginTop: 8 }}>Keep going</button>
                    <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, color: '#e85050', borderColor: '#e85050' }}>Yes, cancel</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Instinct disambiguation questions ---
  if (phase === 'inst-disambig' && instDisambigSeq.length > 0) {
    const q = instDisambigSeq[instDisambigQi];
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h3 style={S.h3}>Instinct Stack Assessment</h3>
              <p style={{ ...S.body, fontSize: 13 }}>A few more targeted questions to clarify your drive ordering.</p>
            </div>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {instDisambigQi + 1}</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={instDisambigAnswers[instDisambigQi]} onChange={handleInstDisambigAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            <ProgressBar current={instDisambigQi + 1} total={instDisambigSeq.length} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {instDisambigQi > 0
                ? <button onClick={() => setInstDisambigQi(instDisambigQi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>
                : <span />}
              {!confirmCancel
                ? <button onClick={() => setConfirmCancel(true)} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setConfirmCancel(false)} style={{ ...S.btnOutline, marginTop: 8 }}>Keep going</button>
                    <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, color: '#e85050', borderColor: '#e85050' }}>Yes, cancel</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Standalone instinct result ---
  if (phase === 'inst-result' && result) {
    const stack = result.instinctStack || [];
    const instScores = result.instScores || {};
    const maxScore = Math.max(...Object.values(instScores));
    return (
      <div style={S.page}><div style={S.container}>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
          <p style={{ ...S.mono, fontSize: 12, marginBottom: 8 }}>Your Instinct Stack Result</p>
          <h1 style={{ ...S.h1, fontSize: 'clamp(28px,9vw,44px)', marginBottom: 4 }}>{stack.map(i => i.toUpperCase()).join(' / ')}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{INSTINCT_LABELS[stack[0]]} dominant</h2>
          {result.confidence && (
            <p style={{ ...S.mono, fontSize: 11, color: result.confidence === 'high' ? '#50c878' : result.confidence === 'moderate' ? G.gold : '#e88050', marginTop: 4 }}>
              {result.confidence === 'high' ? '● High confidence' : result.confidence === 'moderate' ? '● Moderate confidence' : '● Close result — consider exploring adjacent types'}
            </p>
          )}
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Drive Breakdown</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 16 }}>
            {stack.map((inst, i) => (
              <div key={inst} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: i === 0 ? G.goldDim : G.bg3, border: `1px solid ${i === 0 ? G.goldBorder : G.border}`, textAlign: 'center' }}>
                <div style={{ ...S.mono, fontSize: 13, color: i === 0 ? G.gold : G.textDim, marginBottom: 4 }}>{inst.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: G.textFaint }}>{['Dominant', 'Secondary', 'Repressed'][i]}</div>
              </div>
            ))}
          </div>
          {stack.map((inst, i) => (
            <div key={inst} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ ...S.mono, fontSize: 12, color: i === 0 ? G.gold : G.textDim }}>{inst.toUpperCase()} — {INSTINCT_LABELS[inst]}</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>{instScores[inst].toFixed(2)}</span>
              </div>
              <div style={{ height: 4, background: G.border, borderRadius: 2 }}>
                <div style={{ height: '100%', background: i === 0 ? G.gold : G.border, borderRadius: 2, width: `${maxScore > 0 ? Math.round((instScores[inst] / maxScore) * 100) : 0}%`, transition: 'width 0.4s', opacity: i === 0 ? 1 : 0.5 }} />
              </div>
              <p style={{ ...S.body, fontSize: 13, marginTop: 6, color: i === 2 ? G.textFaint : G.textDim }}>{INSTINCT_DESC[inst]}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={reset}>← Back to Assessments</button>
          {nextIncompleteQuiz(saved, 'inst') && (
            <button style={{ ...S.btn, flex: 1 }} onClick={() => { reset(); startQuiz(nextIncompleteQuiz(saved, 'inst')); }}>
              Start {QUIZ_LABEL[nextIncompleteQuiz(saved, 'inst')]} →
            </button>
          )}
        </div>
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('instinct', result.instinctStack?.[0])}>Learn more on the Explorer tab →</button>
      </div></div>
    );
  }

  // --- MBTI questions ---
  if (phase === 'mbti' && mbtiSeq.length > 0) {
    const q = mbtiSeq[qi];
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1}</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={mbtiAnswers[qi]} onChange={handleMBTIAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            {(() => {
              const dimData = {};
              ['EI', 'SN', 'TF', 'JP'].forEach(d => { dimData[d] = { rawSum: 0, count: 0, total: 0 }; });
              mbtiSeq.forEach(q => { if (dimData[q.dim]) dimData[q.dim].total++; });
              for (let i = 0; i <= qi; i++) {
                const q = mbtiSeq[i];
                if (q && mbtiAnswers[i] !== undefined) {
                  dimData[q.dim].rawSum += mbtiAnswers[i] * (q.direction ?? 1);
                  dimData[q.dim].count++;
                }
              }
              return (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, marginBottom: 20 }}>
                  {['EI', 'SN', 'TF', 'JP'].map(dim => {
                    const { rawSum, count, total } = dimData[dim];
                    const fillPct = total > 0 ? (count / total) * 100 : 0;
                    const minProgress = Math.min(1, count / MBTI_MIN_PER_DIM);
                    const ratioProgress = count > 0 ? Math.min(1, Math.abs(rawSum) / count / MBTI_CONFIDENCE_RATIO) : 0;
                    const certainty = minProgress * ratioProgress;
                    const color = certaintyColor(certainty);
                    return (
                      <div key={dim} style={{ flex: 1, position: 'relative' }}>
                        <div style={{ height: 3, borderRadius: 2, background: G.border }}>
                          <div style={{ height: '100%', borderRadius: 2, background: color, width: `${fillPct}%`, transition: 'width 0.3s, background 0.4s' }} />
                        </div>
                        <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: certainty >= 1 ? '#50c878' : G.textFaint, fontFamily: "'DM Mono',monospace", transition: 'color 0.4s', whiteSpace: 'nowrap' }}>{dim}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              {!confirmCancel
                ? <button onClick={() => setConfirmCancel(true)} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setConfirmCancel(false)} style={{ ...S.btnOutline, marginTop: 8 }}>Keep going</button>
                    <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, color: '#e85050', borderColor: '#e85050' }}>Yes, cancel</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MBTI disambiguation questions ---
  if (phase === 'mbti-disambig' && mbtiDisambigSeq.length > 0) {
    const q = mbtiDisambigSeq[mbtiDisambigQi];
    return (
      <div style={S.page} className="qpage">
        <div className="qbody">
          <div style={S.container}>
            <div style={S.card} className="qcard">
              <p style={{ ...S.mono, marginBottom: 6 }}>Question {mbtiDisambigQi + 1}</p>
              <p style={{ ...S.body, fontSize: 13, color: G.textFaint, marginBottom: 8 }}>A few more targeted questions to clarify your type.</p>
              <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
              <LikertScale value={mbtiDisambigAnswers[mbtiDisambigQi]} onChange={handleMBTIDisambigAnswer} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
              </div>
            </div>
            <ProgressBar current={mbtiDisambigQi + 1} total={mbtiDisambigSeq.length} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {mbtiDisambigQi > 0
                ? <button onClick={() => setMbtiDisambigQi(mbtiDisambigQi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>
                : <span />}
              {!confirmCancel
                ? <button onClick={() => setConfirmCancel(true)} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setConfirmCancel(false)} style={{ ...S.btnOutline, marginTop: 8 }}>Keep going</button>
                    <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, color: '#e85050', borderColor: '#e85050' }}>Yes, cancel</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MBTI result ---
  if (phase === 'mbti-result' && result) {
    const t = MBTI_TYPES[result.result];
    return (
      <div style={S.page}><div style={S.container}>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
          <p style={{ ...S.mono, fontSize: 12, marginBottom: 8 }}>Your MBTI Result</p>
          <h1 style={{ ...S.h1, fontSize: 'clamp(36px,12vw,56px)', letterSpacing: 'clamp(2px,2vw,8px)', marginBottom: 4 }}>{result.result}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{t.name}</h2>
          {result.confidence && (
            <p style={{ ...S.mono, fontSize: 11, color: result.confidence === 'high' ? '#50c878' : result.confidence === 'moderate' ? G.gold : '#e88050', marginTop: 4 }}>
              {result.confidence === 'high' ? '● High confidence' : result.confidence === 'moderate' ? '● Moderate confidence' : '● Close result — consider exploring adjacent types'}
            </p>
          )}
        </div>
        <div style={S.cardGold}><p style={{ ...S.body, fontSize: 15 }}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Cognitive Stack</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {t.stack.map((fn, i) => (
              <div key={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                <FnBadge fn={fn} size="md" />
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Dimension Scores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {['EI', 'SN', 'TF', 'JP'].map(dim => {
              const a = dim[0], b = dim[1], sa = result.scores[a], sb = result.scores[b];
              const pct = sa + sb > 0 ? Math.round((sa / (sa + sb)) * 100) : 50;
              return (
                <div key={dim} style={{ ...S.card, marginBottom: 0, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ ...S.mono, color: sa >= sb ? G.gold : G.textDim }}>{a} ({(+sa).toFixed(2)})</span>
                    <span style={{ ...S.mono, color: sb > sa ? G.gold : G.textDim }}>{b} ({(+sb).toFixed(2)})</span>
                  </div>
                  <div style={{ height: 4, background: G.border, borderRadius: 2 }}>
                    <div style={{ height: '100%', background: G.gold, borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {t.ennCorr && (
          <div style={S.card}>
            <h3 style={S.h3}>Common Enneagram Correlations</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {t.ennCorr.split(', ').map(e => <span key={e} style={S.tag}>Type {e}</span>)}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={reset}>← Back to Assessments</button>
          {nextIncompleteQuiz(saved, 'mbti') && (
            <button style={{ ...S.btn, flex: 1 }} onClick={() => { reset(); startQuiz(nextIncompleteQuiz(saved, 'mbti')); }}>
              Start {QUIZ_LABEL[nextIncompleteQuiz(saved, 'mbti')]} →
            </button>
          )}
        </div>
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('mbti', result.result)}>Learn more on the Explorer tab →</button>
      </div></div>
    );
  }

  return null;
}
