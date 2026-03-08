import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, ENN_QUESTIONS, INSTINCT_QS, WING_DESC } from '../data/enneagram.js';
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

export default function GuidedTyper() {
  const [phase, setPhase] = useState('choose');
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [instAnswers, setInstAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [exportData, setExportData] = useState(null);

  const scoreEnneagram = () => {
    const scores = {};
    for (let t = 1; t <= 9; t++) scores[t] = 0;
    ENN_QUESTIONS.forEach((q, i) => { if (answers[i] !== undefined) scores[q.type] += answers[i] * q.pole; });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const core = parseInt(sorted[0][0]);
    const instScores = { sp: 0, sx: 0, so: 0 };
    INSTINCT_QS.forEach((q, i) => { if (instAnswers[i] !== undefined) instScores[q.inst] += instAnswers[i]; });
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

  const handleEnnAnswer = (v) => {
    const na = { ...answers, [qi]: v };
    setAnswers(na);
    setTimeout(() => {
      if (qi < 26) setQi(qi + 1);
      else { setPhase('enn-inst'); setQi(0); }
    }, 150);
  };

  const handleInstAnswer = (v) => {
    const ni = { ...instAnswers, [qi]: v };
    setInstAnswers(ni);
    setTimeout(() => {
      if (qi < 5) setQi(qi + 1);
      else { setResult(scoreEnneagram()); setPhase('enn-result'); }
    }, 150);
  };

  const handleMBTIAnswer = (opt) => {
    const nm = { ...mbtiAnswers, [qi]: opt };
    setMbtiAnswers(nm);
    setTimeout(() => {
      if (qi < 19) setQi(qi + 1);
      else { setResult(scoreMBTI()); setPhase('mbti-result'); }
    }, 150);
  };

  const reset = () => { setPhase('choose'); setQi(0); setAnswers({}); setInstAnswers({}); setMbtiAnswers({}); setResult(null); setExportData(null); };

  const handleExport = (type) => {
    const isEnn = type === 'enneagram';
    const md = generateExportMarkdown(isEnn ? result : null, isEnn ? null : result);
    const backup = isEnn
      ? { type: 'enneagram', result: result.display, resultData: result, exportedAt: new Date().toISOString() }
      : { type: 'mbti', result: result.result, resultData: result, exportedAt: new Date().toISOString() };
    setExportData({ markdown: md, backup });
  };

  if (phase === 'choose') return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 20 }}>
        <h1 style={{ ...S.h1, fontSize: 32, marginBottom: 4 }}>Guided Typer</h1>
        <p style={S.body}>Discover your personality type through structured assessment</p>
      </div>
      <div style={{ ...S.cardGold, cursor: 'pointer' }} onClick={() => { setPhase('enn'); setQi(0); setAnswers({}); }}>
        <h3 style={S.h3}>Enneagram</h3>
        <h2 style={S.h2}>Core Type + Wing + Instinct Stack</h2>
        <p style={{ ...S.body, marginTop: 8 }}>27 Likert-scale questions identify your core type and wing, followed by 6 questions to determine your full instinctual drive stack (dominant → secondary → repressed).</p>
        <div style={{ marginTop: 12 }}><span style={S.tag}>~5 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>33 questions</span></div>
      </div>
      <div style={{ ...S.cardGold, cursor: 'pointer' }} onClick={() => { setPhase('mbti'); setQi(0); setMbtiAnswers({}); }}>
        <h3 style={S.h3}>MBTI</h3>
        <h2 style={S.h2}>Cognitive Function Stack</h2>
        <p style={{ ...S.body, marginTop: 8 }}>20 binary-choice questions across four dimensions. Results include full cognitive stack analysis.</p>
        <div style={{ marginTop: 12 }}><span style={S.tag}>~3 min</span> <span style={{ ...S.tag, marginLeft: 4 }}>20 questions</span></div>
      </div>
    </div></div>
  );

  if (phase === 'enn') {
    const q = ENN_QUESTIONS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={27} />
        <div style={{ ...S.card, marginTop: 20 }}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of 27</p>
          <p style={{ ...S.body, fontSize: 16, color: G.text, lineHeight: 1.7 }}>{q.text}</p>
          <LikertScale value={answers[qi]} onChange={handleEnnAnswer} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Disagree</span>
            <span style={{ fontSize: 11, color: G.textFaint }}>Strongly Agree</span>
          </div>
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
      </div></div>
    );
  }

  if (phase === 'enn-inst') {
    const q = INSTINCT_QS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={6} />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={S.h3}>Instinctual Drive Stack</h3>
          <p style={{ ...S.body, fontSize: 13 }}>These 6 questions determine the ordering of your three instinctual drives</p>
        </div>
        <div style={S.card}>
          <p style={{ ...S.mono, marginBottom: 6 }}>Question {qi + 1} of 6</p>
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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={reset}>← Take Another Assessment</button>
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}
      </div></div>
    );
  }

  if (phase === 'mbti') {
    const q = MBTI_QUESTIONS[qi];
    return (
      <div style={S.page}><div style={S.container}>
        <ProgressBar current={qi + 1} total={20} />
        <div style={{ ...S.card, marginTop: 20 }}>
          <p style={{ ...S.mono, marginBottom: 12 }}>Question {qi + 1} of 20 · {q.dim}</p>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 16 }}>Which resonates more with you?</p>
          {['a', 'b'].map(opt => (
            <button key={opt} onClick={() => handleMBTIAnswer(opt)} style={{ width: '100%', textAlign: 'left', background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 10, padding: '14px 16px', fontSize: 14, color: G.text, marginBottom: 8, lineHeight: 1.6 }}>
              {opt === 'a' ? q.a : q.b}
            </button>
          ))}
        </div>
        {qi > 0 && <button onClick={() => setQi(qi - 1)} style={{ ...S.btnOutline, marginTop: 8 }}>← Previous</button>}
      </div></div>
    );
  }

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
        <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={reset}>← Take Another Assessment</button>
        {exportData && <ExportModal markdown={exportData.markdown} backup={exportData.backup} onClose={() => setExportData(null)} />}
      </div></div>
    );
  }

  return null;
}
