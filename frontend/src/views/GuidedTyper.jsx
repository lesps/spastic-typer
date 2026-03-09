import { useState, useEffect } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, ENN_BANK, INSTINCT_BANK, WING_DESC, ENN_DISAMBIG } from '../data/enneagram.js';
import { MBTI_BANK, MBTI_TYPES } from '../data/mbti.js';
import LikertScale from '../components/LikertScale.jsx';
import FnBadge from '../components/FnBadge.jsx';
import ExportModal from '../components/ExportModal.jsx';
import { generateExportMarkdown } from '../utils/export.js';
import { computeWingStrengthDelta, wingStrengthLabel, wingStrengthDesc } from '../utils/enneagram.js';
import { computeArchetypeName } from '../utils/archetype.js';
import { encodeProfileCode, decodeProfileCode } from '../utils/share.js';

const INSTINCT_LABELS = { sp: 'Self-Preservation', sx: 'Sexual (One-to-One)', so: 'Social' };
const INSTINCT_DESC = {
  sp: 'Focused on physical security, health, comfort, and resource management.',
  sx: 'Focused on intensity, chemistry, and transformative one-on-one connection.',
  so: 'Focused on group belonging, social roles, and contribution.',
};

// --- localStorage helpers ---
const LS = { enn: 'typer_enn', mbti: 'typer_mbti', inst: 'typer_inst' };
function readLS(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
function writeLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function clearLS(key) { try { localStorage.removeItem(key); } catch {} }

// --- Adaptive question selection ---
/** Fisher-Yates in-place shuffle. Returns the array. */
export function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a fair interleaved question sequence from a bank.
 * Each category gets one question per round before any category gets a second.
 * Questions within each category are independently shuffled first.
 * Questions within each round are shuffled to prevent pattern detection.
 *
 * @param {Array} bank - Array of question objects
 * @param {Function} getCategory - Extracts the category key from a question
 * @returns {Array} Ordered sequence of questions for the session
 */
export function buildFairSequence(bank, getCategory) {
  const byCategory = {};
  bank.forEach(q => {
    const cat = getCategory(q);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  });
  // Shuffle each category's pool independently
  Object.values(byCategory).forEach(pool => shuffleArray(pool));
  // Round-robin interleaving: one from each category per round
  const categories = Object.values(byCategory);
  const maxRounds = Math.max(...categories.map(p => p.length));
  const seq = [];
  for (let r = 0; r < maxRounds; r++) {
    const roundItems = categories
      .filter(pool => pool[r] !== undefined)
      .map(pool => pool[r]);
    shuffleArray(roundItems); // randomize within each round
    seq.push(...roundItems);
  }
  return seq;
}

// --- Confidence thresholds ---
const MBTI_MIN_PER_DIM = 2;       // minimum questions before a dim can be settled
const MBTI_CONFIDENCE_RATIO = 1.5; // |rawSum| / count must exceed this

const ENN_MIN_PER_TYPE = 2;        // minimum questions per type before confidence check
const ENN_GAP_THRESHOLD = 4;       // top type must lead 2nd type by this many points

const INST_MIN_PER_INST = 2;       // minimum questions per instinct before confidence check
const INST_GAP_THRESHOLD = 3;      // each adjacent pair in the ranking must differ by this much

/** Returns true if a given MBTI dimension is settled given the current answers and sequence. */
export function isMBTIDimConfident(dim, answers, sequence, upToIndex) {
  let rawSum = 0, count = 0;
  for (let i = 0; i <= upToIndex; i++) {
    if (sequence[i]?.dim === dim && answers[i] !== undefined) {
      rawSum += answers[i];
      count++;
    }
  }
  if (count < MBTI_MIN_PER_DIM) return false;
  return Math.abs(rawSum) / count >= MBTI_CONFIDENCE_RATIO;
}

/** Returns true when all four MBTI dimensions are settled. */
export function allMBTIDimsConfident(answers, sequence, upToIndex) {
  return ['EI', 'SN', 'TF', 'JP'].every(dim => isMBTIDimConfident(dim, answers, sequence, upToIndex));
}

/** Returns true when the Enneagram top type leads the 2nd by enough points. */
export function isEnnConfident(answers, sequence, upToIndex) {
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
  const scores = { sp: 0, sx: 0, so: 0 };
  const counts = { sp: 0, sx: 0, so: 0 };
  for (let i = 0; i <= upToIndex; i++) {
    const q = sequence[i];
    if (q && answers[i] !== undefined) {
      scores[q.inst] += answers[i];
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
 * BUG FIX: raw sum is shifted by count*3 so that neutral (0) answers produce a tie,
 * and positive answers correctly produce the pole letter.
 */
export function scoreMBTI(answers, sequence) {
  const scFinal = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const DIMS = { EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'] };
  ['EI', 'SN', 'TF', 'JP'].forEach(dim => {
    const [pos, neg] = DIMS[dim];
    let rawSum = 0, count = 0;
    sequence.forEach((q, i) => {
      if (q.dim === dim && answers[i] !== undefined) {
        rawSum += answers[i];
        count++;
      }
    });
    if (count === 0) { scFinal[pos] = 0; scFinal[neg] = 0; return; }
    // Shift so that rawSum=0 (neutral) produces equal scores,
    // rawSum>0 (agree with pole) produces higher pos score.
    const shifted = rawSum + count * 3;
    scFinal[pos] = shifted;
    scFinal[neg] = count * 6 - shifted;
  });
  const r = (scFinal.E >= scFinal.I ? 'E' : 'I') +
            (scFinal.S >= scFinal.N ? 'S' : 'N') +
            (scFinal.T >= scFinal.F ? 'T' : 'F') +
            (scFinal.J >= scFinal.P ? 'J' : 'P');
  return { result: r, scores: scFinal };
}

export function scoreEnneagram(answers, sequence, branchAnswers, disambigPair) {
  const scores = {};
  for (let t = 1; t <= 9; t++) scores[t] = 0;
  sequence.forEach((q, i) => {
    if (answers[i] !== undefined) scores[q.type] += answers[i] * q.pole;
  });
  if (branchAnswers && disambigPair && ENN_DISAMBIG[disambigPair]) {
    ENN_DISAMBIG[disambigPair].forEach((q, i) => {
      if (branchAnswers[i] !== undefined) scores[q.favors] = (scores[q.favors] || 0) + branchAnswers[i];
    });
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const core = parseInt(sorted[0][0]);
  const w1 = core === 1 ? 9 : core - 1, w2 = core === 9 ? 1 : core + 1;
  const wing = (scores[w1] || 0) >= (scores[w2] || 0) ? w1 : w2;
  const delta = computeWingStrengthDelta(core, wing, scores);
  return { coreType: core, wing, scores, wingStrengthDelta: delta, display: `${core}w${wing}` };
}

export function scoreInstinct(answers, sequence) {
  const instScores = { sp: 0, sx: 0, so: 0 };
  sequence.forEach((q, i) => {
    if (answers[i] !== undefined) instScores[q.inst] += answers[i];
  });
  const instinctStack = Object.entries(instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  return { instinctStack, instScores };
}

export default function GuidedTyper({ setView = () => {}, setExplorerTab = () => {}, setQuizProgress = () => {} }) {
  const goToExplorer = (tab) => { setExplorerTab(tab); setView('explorer'); };
  const [phase, setPhase] = useState('choose');
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [instAnswers, setInstAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [branchAnswers, setBranchAnswers] = useState({});
  const [disambigPair, setDisambigPair] = useState(null);
  const [result, setResult] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [profileCode, setProfileCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadSuccess, setLoadSuccess] = useState('');
  // Adaptive question sequences (generated fresh per test session)
  const [mbtiSeq, setMbtiSeq] = useState([]);
  const [ennSeq, setEnnSeq] = useState([]);
  const [instSeq, setInstSeq] = useState([]);
  const [saved, setSaved] = useState(() => ({
    enn: readLS(LS.enn),
    mbti: readLS(LS.mbti),
    inst: readLS(LS.inst),
  }));
  const [confirmClear, setConfirmClear] = useState(false);

  // --- Quiz progress tracking ---
  useEffect(() => {
    if (phase === 'enn' && ennSeq.length > 0) {
      setQuizProgress({ current: qi + 1, total: ennSeq.length });
    } else if (phase === 'enn-disambig' && disambigPair && ENN_DISAMBIG[disambigPair]) {
      setQuizProgress({ current: qi + 1, total: ENN_DISAMBIG[disambigPair].length });
    } else if (phase === 'instinct' && instSeq.length > 0) {
      setQuizProgress({ current: qi + 1, total: instSeq.length });
    } else if (phase === 'mbti' && mbtiSeq.length > 0) {
      setQuizProgress({ current: qi + 1, total: mbtiSeq.length });
    } else {
      setQuizProgress(null);
    }
  }, [phase, qi, ennSeq.length, instSeq.length, mbtiSeq.length, disambigPair]);

  // --- Next incomplete quiz helper ---
  function nextIncompleteQuiz(sv, justCompleted) {
    return ['enn', 'mbti', 'inst'].find(k => k !== justCompleted && !sv[k]) || null;
  }

  const QUIZ_LABEL = { enn: 'Enneagram', mbti: 'MBTI', inst: 'Instinct Stack' };

  const startQuiz = (quiz) => {
    if (quiz === 'enn') {
      const seq = buildFairSequence(ENN_BANK, q => q.type);
      setEnnSeq(seq); setPhase('enn'); setQi(0); setAnswers({}); setBranchAnswers({}); setDisambigPair(null);
    } else if (quiz === 'mbti') {
      const seq = buildFairSequence(MBTI_BANK, q => q.dim);
      setMbtiSeq(seq); setPhase('mbti'); setQi(0); setMbtiAnswers({});
    } else if (quiz === 'inst') {
      const seq = buildFairSequence(INSTINCT_BANK, q => q.inst);
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
        if (gap <= 3) {
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

  const handleInstAloneAnswer = (v) => {
    const ni = { ...instAnswers, [qi]: v };
    setInstAnswers(ni);
    setTimeout(() => {
      const nextQi = qi + 1;
      const confident = isInstConfident(ni, instSeq, qi);
      const exhausted = nextQi >= instSeq.length;
      if (!confident && !exhausted) {
        setQi(nextQi);
      } else {
        const r = scoreInstinct(ni, instSeq);
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.inst, backup);
        setSaved(s => ({ ...s, inst: backup }));
        setResult(r);
        setPhase('inst-result');
      }
    }, 150);
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
      } else {
        const r = scoreMBTI(nm, mbtiSeq);
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.mbti, backup);
        setSaved(s => ({ ...s, mbti: backup }));
        setResult(r);
        setPhase('mbti-result');
      }
    }, 150);
  };

  // --- Retake / reset ---
  const reset = () => {
    setPhase('choose'); setQi(0); setAnswers({}); setInstAnswers({}); setMbtiAnswers({});
    setBranchAnswers({}); setDisambigPair(null); setResult(null); setExportData(null);
    setMbtiSeq([]); setEnnSeq([]); setInstSeq([]);
  };
  const retakeEnn = () => {
    clearLS(LS.enn); setSaved(s => ({ ...s, enn: null }));
    const seq = buildFairSequence(ENN_BANK, q => q.type);
    setEnnSeq(seq);
    setPhase('enn'); setQi(0); setAnswers({}); setBranchAnswers({}); setDisambigPair(null);
  };
  const retakeMBTI = () => {
    clearLS(LS.mbti); setSaved(s => ({ ...s, mbti: null }));
    const seq = buildFairSequence(MBTI_BANK, q => q.dim);
    setMbtiSeq(seq);
    setPhase('mbti'); setQi(0); setMbtiAnswers({});
  };
  const retakeInst = () => {
    clearLS(LS.inst); setSaved(s => ({ ...s, inst: null }));
    const seq = buildFairSequence(INSTINCT_BANK, q => q.inst);
    setInstSeq(seq);
    setPhase('instinct'); setQi(0); setInstAnswers({});
  };

  const handleClearAll = () => {
    clearLS(LS.enn); clearLS(LS.mbti); clearLS(LS.inst);
    setSaved({ enn: null, mbti: null, inst: null });
    setConfirmClear(false);
  };

  const handleExportAll = () => {
    const md = generateExportMarkdown(saved.enn, saved.mbti);
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
    const decoded = decodeProfileCode(loadCode);
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
                {archetypeName && <p style={{ fontSize: 13, color: G.gold, marginBottom: 4, fontStyle: 'italic' }}>{archetypeName}</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {saved.enn && <span style={S.tag}>{saved.enn.display}</span>}
                  {saved.mbti && <span style={S.tag}>{saved.mbti.result}</span>}
                  {saved.inst && <span style={S.tag}>{saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/')}</span>}
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
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
                <span style={{ ...S.body, marginLeft: 8 }}>{sc > 0 ? '+' : ''}{sc}</span>
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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('enneagram')}>Learn more on the Explorer tab →</button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
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
                <span style={{ fontSize: 11, color: G.textFaint }}>{instScores[inst]}</span>
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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('instinct')}>Learn more on the Explorer tab →</button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {qi > 0 ? <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button> : <span />}
              <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8 }}>Cancel</button>
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
                    <span style={{ ...S.mono, color: sa >= sb ? G.gold : G.textDim }}>{a} ({sa})</span>
                    <span style={{ ...S.mono, color: sb > sa ? G.gold : G.textDim }}>{b} ({sb})</span>
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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => goToExplorer('mbti')}>Learn more on the Explorer tab →</button>
      </div></div>
    );
  }

  return null;
}
