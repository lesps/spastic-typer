import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, ENN_QUESTIONS, INSTINCT_QS, WING_DESC, ENN_DISAMBIG } from '../data/enneagram.js';
import { MBTI_QUESTIONS, MBTI_TYPES } from '../data/mbti.js';
import LikertScale from '../components/LikertScale.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import FnBadge from '../components/FnBadge.jsx';
import ExportModal from '../components/ExportModal.jsx';
import { generateExportMarkdown } from '../utils/export.js';
import { computeWingStrengthDelta } from '../utils/enneagram.js';

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

export default function GuidedTyper() {
  const [phase, setPhase] = useState('choose');
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [instAnswers, setInstAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [branchAnswers, setBranchAnswers] = useState({});
  const [disambigPair, setDisambigPair] = useState(null);
  const [result, setResult] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [shareMsg, setShareMsg] = useState('');
  const [saved, setSaved] = useState(() => ({
    enn: readLS(LS.enn),
    mbti: readLS(LS.mbti),
    inst: readLS(LS.inst),
  }));

  // --- Scoring ---
  const scoreEnneagram = (finalInstAnswers, finalBranchAnswers, finalDisambigPair) => {
    const scores = {};
    for (let t = 1; t <= 9; t++) scores[t] = 0;
    ENN_QUESTIONS.forEach((q, i) => { if (answers[i] !== undefined) scores[q.type] += answers[i] * q.pole; });
    if (finalBranchAnswers && finalDisambigPair && ENN_DISAMBIG[finalDisambigPair]) {
      ENN_DISAMBIG[finalDisambigPair].forEach((q, i) => {
        if (finalBranchAnswers[i] !== undefined) scores[q.favors] = (scores[q.favors] || 0) + finalBranchAnswers[i];
      });
    }
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const core = parseInt(sorted[0][0]);
    const instScores = { sp: 0, sx: 0, so: 0 };
    INSTINCT_QS.forEach((q, i) => { if (finalInstAnswers[i] !== undefined) instScores[q.inst] += finalInstAnswers[i]; });
    const instinctStack = Object.entries(instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
    const w1 = core === 1 ? 9 : core - 1, w2 = core === 9 ? 1 : core + 1;
    const wing = (scores[w1] || 0) >= (scores[w2] || 0) ? w1 : w2;
    const delta = computeWingStrengthDelta(core, wing, scores);
    const stackStr = instinctStack.map(i => i.toUpperCase()).join('/');
    return { coreType: core, wing, instinctStack, scores, instScores, wingStrengthDelta: delta, display: `${core}w${wing} ${stackStr}` };
  };

  const scoreMBTI = () => {
    const sc = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    MBTI_QUESTIONS.forEach((q, i) => {
      if (mbtiAnswers[i] === 'a') sc[q.dim[0]]++;
      else if (mbtiAnswers[i] === 'b') sc[q.dim[1]]++;
    });
    const r = (sc.E >= sc.I ? 'E' : 'I') + (sc.S >= sc.N ? 'S' : 'N') + (sc.T >= sc.F ? 'T' : 'F') + (sc.J >= sc.P ? 'J' : 'P');
    return { result: r, scores: sc };
  };

  const scoreInstinct = (finalInstAnswers) => {
    const instScores = { sp: 0, sx: 0, so: 0 };
    INSTINCT_QS.forEach((q, i) => { if (finalInstAnswers[i] !== undefined) instScores[q.inst] += finalInstAnswers[i]; });
    const instinctStack = Object.entries(instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
    return { instinctStack, instScores };
  };

  // --- Answer handlers ---
  const handleEnnAnswer = (v) => {
    const na = { ...answers, [qi]: v };
    setAnswers(na);
    setTimeout(() => {
      if (qi < ENN_QUESTIONS.length - 1) {
        setQi(qi + 1);
      } else {
        // Check if branching is needed
        const baseScores = {};
        for (let t = 1; t <= 9; t++) baseScores[t] = 0;
        ENN_QUESTIONS.forEach((q, i) => { if (na[i] !== undefined) baseScores[q.type] += na[i] * q.pole; });
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
        setPhase('enn-inst');
        setQi(0);
      }
    }, 150);
  };

  const handleDisambigAnswer = (v) => {
    const nb = { ...branchAnswers, [qi]: v };
    setBranchAnswers(nb);
    const total = ENN_DISAMBIG[disambigPair].length;
    setTimeout(() => {
      if (qi < total - 1) setQi(qi + 1);
      else { setPhase('enn-inst'); setQi(0); }
    }, 150);
  };

  const handleInstAnswer = (v) => {
    const ni = { ...instAnswers, [qi]: v };
    setInstAnswers(ni);
    setTimeout(() => {
      if (qi < INSTINCT_QS.length - 1) setQi(qi + 1);
      else {
        const r = scoreEnneagram(ni, branchAnswers, disambigPair);
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
      if (qi < INSTINCT_QS.length - 1) setQi(qi + 1);
      else {
        const r = scoreInstinct(ni);
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.inst, backup);
        setSaved(s => ({ ...s, inst: backup }));
        setResult(r);
        setPhase('inst-result');
      }
    }, 150);
  };

  const handleMBTIAnswer = (opt) => {
    const nm = { ...mbtiAnswers, [qi]: opt };
    setMbtiAnswers(nm);
    setTimeout(() => {
      if (qi < MBTI_QUESTIONS.length - 1) setQi(qi + 1);
      else {
        const r = scoreMBTI();
        const backup = { ...r, exportedAt: new Date().toISOString() };
        writeLS(LS.mbti, backup);
        setSaved(s => ({ ...s, mbti: backup }));
        setResult(r);
        setPhase('mbti-result');
      }
    }, 150);
  };

  // --- Retake / reset ---
  const reset = () => { setPhase('choose'); setQi(0); setAnswers({}); setInstAnswers({}); setMbtiAnswers({}); setBranchAnswers({}); setDisambigPair(null); setResult(null); setExportData(null); };
  const retakeEnn = () => { clearLS(LS.enn); setSaved(s => ({ ...s, enn: null })); setPhase('enn'); setQi(0); setAnswers({}); setInstAnswers({}); setBranchAnswers({}); setDisambigPair(null); };
  const retakeMBTI = () => { clearLS(LS.mbti); setSaved(s => ({ ...s, mbti: null })); setPhase('mbti'); setQi(0); setMbtiAnswers({}); };
  const retakeInst = () => { clearLS(LS.inst); setSaved(s => ({ ...s, inst: null })); setPhase('instinct'); setQi(0); setInstAnswers({}); };

  const handleExport = (type) => {
    const isEnn = type === 'enneagram';
    const md = generateExportMarkdown(isEnn ? result : null, isEnn ? null : result);
    const backup = isEnn
      ? { type: 'enneagram', result: result.display, resultData: result, exportedAt: new Date().toISOString() }
      : { type: 'mbti', result: result.result, resultData: result, exportedAt: new Date().toISOString() };
    setExportData({ markdown: md, backup });
  };

  const handleExportAll = () => {
    const md = generateExportMarkdown(saved.enn, saved.mbti);
    const backup = { type: 'full-profile', exportedAt: new Date().toISOString(), enneagram: saved.enn, mbti: saved.mbti, instinct: saved.inst };
    setExportData({ markdown: md, backup });
  };

  // --- Share URL ---
  const handleShare = () => {
    const enn = saved.enn;
    const mbti = saved.mbti;
    const inst = saved.inst;
    const ennPart = enn ? `${enn.coreType}w${enn.wing}` : '';
    const strength = enn ? (enn.wingStrengthDelta || '') : '';
    const stack = inst ? inst.instinctStack : (enn ? enn.instinctStack : null);
    const stackPart = stack ? stack.join('/') : '';
    const mbtiPart = mbti ? mbti.result : '';
    const encoded = encodeURIComponent([ennPart, strength, stackPart, mbtiPart].join(':'));
    const url = `${window.location.origin}${window.location.pathname}#p1=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg('Profile link copied!');
      setTimeout(() => setShareMsg(''), 3000);
    }).catch(() => {
      setShareMsg('Copy this URL: ' + url);
      setTimeout(() => setShareMsg(''), 8000);
    });
  };

  // --- Choose screen ---
  if (phase === 'choose') {
    const doneCount = [saved.enn, saved.mbti, saved.inst].filter(Boolean).length;
    const hasAny = doneCount > 0;
    const allDone = doneCount === 3;
    return (
      <div style={S.page}><div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 20 }}>
          <h1 style={{ ...S.h1, fontSize: 32, marginBottom: 4 }}>Guided Typer</h1>
          <p style={S.body}>Discover your personality type through structured assessment</p>
        </div>

        {/* Intro */}
        <div style={{ ...S.card, marginBottom: 20, padding: '14px 16px' }}>
          <p style={{ ...S.body, fontSize: 13, lineHeight: 1.7 }}>
            Take all three assessments to build your full personality profile. Complete all three to unlock your <strong style={{ color: G.text }}>Share Link</strong> (use it to load your profile in the Compare tab) and the <strong style={{ color: G.text }}>Export</strong> button. Individual quiz results can be exported from their own result screens at any time.
          </p>
        </div>

        {/* Completeness indicator */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ key: 'enn', label: 'Enneagram', val: saved.enn?.display }, { key: 'mbti', label: 'MBTI', val: saved.mbti?.result }, { key: 'inst', label: 'Instinct Stack', val: saved.inst ? saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/') : null }].map(({ key, label, val }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: val ? G.goldDim : G.bg3, border: `1px solid ${val ? G.goldBorder : G.border}` }}>
              <span style={{ fontSize: 12, color: val ? G.gold : G.textFaint }}>{val ? '✓' : '○'}</span>
              <span style={{ fontSize: 12, color: val ? G.text : G.textFaint }}>{val || label}</span>
            </div>
          ))}
        </div>

        {/* Share / export profile card */}
        {hasAny && (
          <div style={{ ...S.cardGold, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ ...S.h3, marginBottom: 4 }}>Your Profile</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {saved.enn && <span style={S.tag}>{saved.enn.display}</span>}
                  {saved.mbti && <span style={S.tag}>{saved.mbti.result}</span>}
                  {saved.inst && !saved.enn && <span style={S.tag}>{saved.inst.instinctStack?.map(i => i.toUpperCase()).join('/')}</span>}
                </div>
                {!allDone && (
                  <p style={{ fontSize: 11, color: G.textFaint, marginTop: 6 }}>
                    {doneCount}/3 complete — finish all three to unlock Share Link and Export
                  </p>
                )}
              </div>
              {allDone && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={handleExportAll} style={{ ...S.btnOutline, whiteSpace: 'nowrap', padding: '8px 14px', fontSize: 13 }}>Export</button>
                  <button onClick={handleShare} style={{ ...S.btn, whiteSpace: 'nowrap' }}>Share Profile</button>
                </div>
              )}
            </div>
            {shareMsg && <p style={{ fontSize: 12, color: G.gold, marginTop: 8 }}>{shareMsg}</p>}
          </div>
        )}
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}

        {/* Quiz cards */}
        <div style={{ ...S.cardGold, cursor: saved.enn ? 'default' : 'pointer' }} onClick={saved.enn ? undefined : () => { setPhase('enn'); setQi(0); setAnswers({}); setInstAnswers({}); setBranchAnswers({}); setDisambigPair(null); }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={S.h3}>Enneagram</h3>
              <h2 style={S.h2}>Core Type + Wing + Instinct Stack</h2>
              {saved.enn ? (
                <div style={{ marginTop: 8 }}>
                  <span style={{ ...S.tag, marginRight: 6 }}>{saved.enn.display}</span>
                  <span style={{ fontSize: 12, color: G.textDim }}>{ENN_TYPES[saved.enn.coreType]?.name}</span>
                </div>
              ) : (
                <>
                  <p style={{ ...S.body, marginTop: 8 }}>{ENN_QUESTIONS.length} type questions + {INSTINCT_QS.length} instinct questions. Adaptive follow-up may be shown if your top types are close.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~7 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>{ENN_QUESTIONS.length + INSTINCT_QS.length}+ questions</span></div>
                </>
              )}
            </div>
            {saved.enn && (
              <button onClick={(e) => { e.stopPropagation(); retakeEnn(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

        <div style={{ ...S.cardGold, cursor: saved.mbti ? 'default' : 'pointer' }} onClick={saved.mbti ? undefined : () => { setPhase('mbti'); setQi(0); setMbtiAnswers({}); }}>
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
                  <p style={{ ...S.body, marginTop: 8 }}>20 binary-choice questions across four dimensions. Results include full cognitive stack analysis.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~3 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>20 questions</span></div>
                </>
              )}
            </div>
            {saved.mbti && (
              <button onClick={(e) => { e.stopPropagation(); retakeMBTI(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

        <div style={{ ...S.cardGold, cursor: saved.inst ? 'default' : 'pointer' }} onClick={saved.inst ? undefined : () => { setPhase('instinct'); setQi(0); setInstAnswers({}); }}>
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
                  <p style={{ ...S.body, marginTop: 8 }}>{INSTINCT_QS.length} focused questions on your three instinctual drives — independent of your core type. Useful on its own or alongside Enneagram.</p>
                  <div style={{ marginTop: 12 }}><span style={S.tag}>~2 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>{INSTINCT_QS.length} questions</span></div>
                </>
              )}
            </div>
            {saved.inst && (
              <button onClick={(e) => { e.stopPropagation(); retakeInst(); }} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>Retake</button>
            )}
          </div>
        </div>

      </div></div>
    );
  }

  // --- Enneagram questions ---
  if (phase === 'enn') {
    const q = ENN_QUESTIONS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={ENN_QUESTIONS.length} />
        <div style={{ ...S.card, marginTop: 20 }}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of {ENN_QUESTIONS.length}</p>
          <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
          <LikertScale value={answers[qi]} onChange={handleEnnAnswer} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
          </div>
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
        <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, float: 'right' }}>Cancel</button>
      </div></div>
    );
  }

  // --- Disambiguation (branching) questions ---
  if (phase === 'enn-disambig' && disambigPair) {
    const questions = ENN_DISAMBIG[disambigPair];
    const q = questions[qi];
    const [t1, t2] = disambigPair.split('-').map(Number);
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={questions.length} />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={S.h3}>Clarifying Questions</h3>
          <p style={{ ...S.body, fontSize: 13 }}>Your top results for Type {t1} and Type {t2} are very close. These questions help distinguish them.</p>
        </div>
        <div style={S.card}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of {questions.length}</p>
          <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
          <LikertScale value={branchAnswers[qi]} onChange={handleDisambigAnswer} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
          </div>
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
        <button onClick={() => { setPhase('enn-inst'); setQi(0); }} style={{ ...S.btnOutline, marginTop: 8, float: 'right' }}>Skip →</button>
      </div></div>
    );
  }

  // --- Instinct questions (as part of enneagram quiz) ---
  if (phase === 'enn-inst') {
    const q = INSTINCT_QS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={INSTINCT_QS.length} />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={S.h3}>Instinctual Drive Stack</h3>
          <p style={{ ...S.body, fontSize: 13 }}>{INSTINCT_QS.length} questions to determine the ordering of your three instinctual drives</p>
        </div>
        <div style={S.card}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of {INSTINCT_QS.length}</p>
          <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
          <LikertScale value={instAnswers[qi]} onChange={handleInstAnswer} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
          </div>
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
      </div></div>
    );
  }

  // --- Enneagram result ---
  if (phase === 'enn-result' && result) {
    const t = ENN_TYPES[result.coreType];
    const wKey = `${result.coreType}w${result.wing}`;
    const stack = result.instinctStack || [];
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
          <div style={S.divider} />
          <h3 style={S.h3}>Instinctual Drive Stack</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 12 }}>
            {stack.map((inst, i) => (
              <div key={inst} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: i === 0 ? G.goldDim : G.bg3, border: `1px solid ${i === 0 ? G.goldBorder : G.border}`, textAlign: 'center' }}>
                <div style={{ ...S.mono, fontSize: 13, color: i === 0 ? G.gold : G.textDim, marginBottom: 4 }}>{inst.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: G.textFaint }}>{['Dominant', 'Secondary', 'Repressed'][i]}</div>
              </div>
            ))}
          </div>
          {stack.map((inst, i) => (
            <p key={inst} style={{ ...S.body, fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: i === 0 ? G.gold : G.textDim, fontFamily: "'DM Mono',monospace" }}>{inst.toUpperCase()} — </span>
              <span style={{ color: i === 2 ? G.textFaint : G.textDim }}>{INSTINCT_LABELS[inst]}: </span>
              {INSTINCT_DESC[inst]}
            </p>
          ))}
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
          <button style={{ ...S.btn, flex: 1 }} onClick={() => handleExport('enneagram')}>Export</button>
        </div>
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={reset}>← Back to Assessments</button>
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}
      </div></div>
    );
  }

  // --- Standalone instinct questions ---
  if (phase === 'instinct') {
    const q = INSTINCT_QS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={INSTINCT_QS.length} />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={S.h3}>Instinct Stack Assessment</h3>
          <p style={{ ...S.body, fontSize: 13 }}>{INSTINCT_QS.length} questions to determine the ordering of your SP, SX, and SO drives</p>
        </div>
        <div style={S.card}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of {INSTINCT_QS.length}</p>
          <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
          <LikertScale value={instAnswers[qi]} onChange={handleInstAloneAnswer} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
          </div>
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
        <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, float: 'right' }}>Cancel</button>
      </div></div>
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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={reset}>← Back to Assessments</button>
      </div></div>
    );
  }

  // --- MBTI questions ---
  if (phase === 'mbti') {
    const q = MBTI_QUESTIONS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={MBTI_QUESTIONS.length} />
        <div style={{ ...S.card, marginTop: 20 }}>
          <p style={{ ...S.mono, marginBottom: 12 }}>Question {qi + 1} of {MBTI_QUESTIONS.length} · {q.dim}</p>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 16 }}>Which resonates more with you?</p>
          {['a', 'b'].map(opt => (
            <button key={opt} onClick={() => handleMBTIAnswer(opt)} style={{ width: '100%', textAlign: 'left', background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 10, padding: '14px 16px', fontSize: 14, color: G.text, marginBottom: 8, lineHeight: 1.6 }}>
              {opt === 'a' ? q.a : q.b}
            </button>
          ))}
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
        <button onClick={reset} style={{ ...S.btnOutline, marginTop: 8, float: 'right' }}>Cancel</button>
      </div></div>
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
          <button style={{ ...S.btn, flex: 1 }} onClick={() => handleExport('mbti')}>Export</button>
        </div>
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={reset}>← Back to Assessments</button>
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}
      </div></div>
    );
  }

  return null;
}
