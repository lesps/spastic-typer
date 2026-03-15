import { useState, useEffect } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, WING_DESC } from '../data/enneagram.js';

import { MBTI_TYPES } from '../data/mbti.js';
import { ENN_DYNAMICS, ENN_TIPS, MBTI_INSIGHTS, MBTI_TIPS, INSTINCT_STACK_DYNAMICS } from '../data/pairLookup.js';
import FnBadge from '../components/FnBadge.jsx';
import { getWingDynamics, wingStrengthLabel, wingStrengthDesc, computeWingStrengthDelta } from '../utils/enneagram.js';
import { computeArchetypeName } from '../utils/archetype.js';
import { analyzeGroup, getCenterDistribution, getHarmonicDistribution, getHornevianDistribution, getTemperamentDistribution, getCognitiveCoverage, getInstinctGroupChemistry, getTeamArchetype } from '../utils/group.js';
import { getCommunicationMatrix, getGrowthStressInteraction, getCognitiveHarmony, getInstinctDepthAnalysisSync } from '../utils/compare.js';
import { decodeProfileCode } from '../utils/share.js';

const INSTINCT_LABELS = { sp: 'SP', sx: 'SX', so: 'SO' };
const LS_COMPARE = 'compare_persons';

const emptyPerson = (n) => ({ label: `Person ${n}`, ennType: null, ennWing: null, ennWingStrength: null, instinctStack: null, mbti: null, ennScores: null });

// --- URL encoding helpers ---
// Profile code format: 453xpo-INFP (11 characters — see utils/share.js)
function encodePersons(persons) {
  return persons.map((p, i) => {
    const parts = [
      p.ennType ? `${p.ennType}w${p.ennWing || '?'}` : '',
      p.ennWingStrength || '',
      p.instinctStack ? p.instinctStack.join('/') : '',
      p.mbti || '',
    ];
    return `p${i + 1}=${encodeURIComponent(parts.join(':'))}`;
  }).join('&');
}

function decodePersons(hash) {
  if (!hash) return null;
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const parts = raw.split('&');
  return parts.map((part, i) => {
    const [, encoded] = part.split('=');
    if (!encoded) return emptyPerson(i + 1);
    const [ennStr, wingStr, instStr, mbti] = decodeURIComponent(encoded).split(':');
    const p = emptyPerson(i + 1);
    if (ennStr && ennStr !== 'w?') {
      const m = ennStr.match(/^(\d)w(\d)$/);
      if (m) { p.ennType = parseInt(m[1]); p.ennWing = parseInt(m[2]); }
    }
    if (wingStr) p.ennWingStrength = wingStr;
    if (instStr) p.instinctStack = instStr.split('/').filter(Boolean);
    if (mbti && MBTI_TYPES[mbti]) p.mbti = mbti;
    return p;
  });
}

// --- Lookup helpers ---
function ennKey(c1, c2) {
  c1 = parseInt(c1); c2 = parseInt(c2);
  return `${Math.min(c1, c2)}-${Math.max(c1, c2)}`;
}
function mbtiKey(t1, t2) { return [t1, t2].sort().join('-'); }
function stackKey(sA, sB) { return [sA.join('/'), sB.join('/')].sort().join('|'); }

function readLS(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }

// --- PersonEditor: defined at module scope to prevent remount on parent re-render ---
function PersonEditor({ idx, person, personsCount, updatePerson, removePerson, onDone }) {
  const [mode, setMode] = useState('code');
  const [label, setLabel] = useState(person.label);
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [instOrder, setInstOrder] = useState(person.instinctStack || ['sp', 'sx', 'so']);
  const [includeInstinct, setIncludeInstinct] = useState(true);

  // Own profile from localStorage (for "Add My Profile" shortcut)
  const myEnn = readLS('typer_enn');
  const myMbti = readLS('typer_mbti');
  const myInst = readLS('typer_inst');
  const hasOwnProfile = !!(myEnn?.coreType && myMbti?.result && myInst?.instinctStack);

  const handleAddMyProfile = () => {
    setInstOrder(myInst.instinctStack);
    updatePerson(idx, p => ({
      ...p, label,
      ennType: myEnn.coreType,
      ennWing: myEnn.wing,
      ennWingStrength: myEnn.wingStrengthDelta,
      instinctStack: myInst.instinctStack,
      mbti: myMbti.result,
      ennScores: null,
    }));
  };

  const adj1 = person.ennType ? (person.ennType === 1 ? 9 : person.ennType - 1) : null;
  const adj2 = person.ennType ? (person.ennType === 9 ? 1 : person.ennType + 1) : null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      updatePerson(idx, p => {
        const next = { ...p, label };
        if (data.type === 'enneagram' && data.resultData) {
          const d = data.resultData;
          const delta = computeWingStrengthDelta(d.coreType, d.wing, d.scores);
          next.ennType = d.coreType;
          next.ennWing = d.wing;
          // Support both instinctStack array (new) and legacy instinct string
          next.instinctStack = d.instinctStack || (d.instinct ? [d.instinct, ...(['sp', 'sx', 'so'].filter(i => i !== d.instinct))] : null);
          next.ennScores = d.scores;
          next.ennWingStrength = delta;
        }
        if (data.type === 'mbti' && data.resultData) next.mbti = data.resultData.result;
        return next;
      });
      setFileError('');
    } catch { setFileError('Could not parse file — use a backup .json from the Typer.'); }
  };

  const handleLoadByCode = () => {
    if (!codeInput.trim()) return;
    setCodeError('');
    const decoded = decodeProfileCode(codeInput.trim());
    if (!decoded) { setCodeError('Invalid code — check for typos.'); return; }
    setInstOrder(decoded.enn.instinctStack);
    setCodeInput('');
    updatePerson(idx, p => ({
      ...p, label,
      ennType: decoded.enn.coreType,
      ennWing: decoded.enn.wing,
      ennWingStrength: decoded.enn.wingStrengthDelta,
      instinctStack: decoded.enn.instinctStack,
      mbti: decoded.mbti.result,
      ennScores: null,
    }));
  };

  const isComplete = mode !== 'manual' || !!(person.ennType && person.mbti && (includeInstinct ? instOrder.length === 3 : true));

  const handleDone = () => {
    updatePerson(idx, p => ({ ...p, label, instinctStack: includeInstinct ? instOrder : null }));
    onDone();
  };

  const moveInstinct = (from, to) => {
    const next = [...instOrder];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setInstOrder(next);
  };

  return (
    <div style={{ ...S.cardGold, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...S.h3, marginBottom: 0 }}>Editing {person.label}</h3>
        {personsCount > 2 && <button onClick={() => removePerson(idx)} style={{ ...S.btnDanger, padding: '4px 10px', fontSize: 12 }}>Remove</button>}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Name / Label</label>
        <input style={{ ...S.input, fontSize: 14 }} value={label} onChange={e => setLabel(e.target.value)} placeholder="Person's name" />
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: G.bg3, borderRadius: 8, padding: 3 }}>
        {[{ id: 'code', label: 'By Code' }, { id: 'upload', label: 'Upload Backup' }, { id: 'manual', label: 'Manual Entry' }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ flex: 1, padding: '7px 8px', borderRadius: 6, border: 'none', background: mode === m.id ? G.bg2 : 'transparent', color: mode === m.id ? G.text : G.textDim, fontSize: 12, fontWeight: mode === m.id ? 500 : 400 }}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'code' && (
        <div>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 10 }}>Enter an 11-character profile code (e.g. 453xpo-INFP) shared from someone's Typer tab.</p>
          {hasOwnProfile && (
            <button
              onClick={handleAddMyProfile}
              style={{ ...S.btnOutline, width: '100%', marginBottom: 10, fontSize: 13, padding: '10px 16px' }}
            >
              + Add My Profile
            </button>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...S.input, fontSize: 13, flex: 1 }} value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="e.g. 453xpo-INFP" maxLength={11} onKeyDown={e => e.key === 'Enter' && handleLoadByCode()} />
            <button onClick={handleLoadByCode} style={{ ...S.btn, padding: '10px 16px', fontSize: 13 }}>Load</button>
          </div>
          {codeError && <p style={{ color: '#e85050', fontSize: 13, marginTop: 8 }}>{codeError}</p>}
          {(person.ennType || person.mbti) && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: G.bg3, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: G.textDim, marginBottom: 4 }}>Loaded:</p>
              {person.ennType && <p style={{ ...S.mono, fontSize: 13 }}>{person.ennType}w{person.ennWing || '?'}{person.instinctStack ? ` ${person.instinctStack.map(i => i.toUpperCase()).join('/')}` : ''}</p>}
              {person.mbti && <p style={{ ...S.mono, fontSize: 13, marginTop: person.ennType ? 2 : 0 }}>{person.mbti}</p>}
            </div>
          )}
          <p style={{ ...S.body, fontSize: 12, marginTop: 12, color: G.textFaint }}>Get a code from the Typer tab after completing all three assessments.</p>
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 10 }}>Upload a <strong style={{ color: G.text }}>.json</strong> backup downloaded from the Typer.</p>
          <label style={{ display: 'block', padding: '14px', borderRadius: 10, border: `2px dashed ${G.goldBorder}`, textAlign: 'center', cursor: 'pointer', background: G.bg3 }}>
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            <span style={{ ...S.mono, fontSize: 12 }}>{fileName || 'Choose .json file'}</span>
            <p style={{ fontSize: 11, color: G.textFaint, marginTop: 4 }}>Click to browse</p>
          </label>
          {fileError && <p style={{ color: '#e85050', fontSize: 13, marginTop: 8 }}>{fileError}</p>}
          {(person.ennType || person.mbti) && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: G.bg3, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: G.textDim, marginBottom: 4 }}>Loaded:</p>
              {person.ennType && <p style={{ ...S.mono, fontSize: 13 }}>{person.ennType}w{person.ennWing || '?'}{person.instinctStack ? ` ${person.instinctStack.map(i => i.toUpperCase()).join('/')}` : ''}</p>}
              {person.mbti && <p style={{ ...S.mono, fontSize: 13, marginTop: person.ennType ? 2 : 0 }}>{person.mbti}</p>}
            </div>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Enneagram Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => (
                <button key={t} onClick={() => updatePerson(idx, p => ({ ...p, ennType: t, ennWing: null, ennWingStrength: null }))} style={{ padding: '8px 4px', borderRadius: 8, border: `1px solid ${person.ennType === t ? G.gold : G.border}`, background: person.ennType === t ? G.goldDim : G.bg3, color: person.ennType === t ? G.gold : G.textDim, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
                  {t}
                </button>
              ))}
            </div>
            {person.ennType ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <p style={{ fontSize: 12, color: G.textDim, margin: 0 }}>
                  Type {person.ennType} — <span style={{ color: G.text }}>{ENN_TYPES[person.ennType].name}</span>
                  <span style={{ color: G.textFaint, marginLeft: 6 }}>{ENN_TYPES[person.ennType].fear}</span>
                </p>
                <button onClick={() => updatePerson(idx, p => ({ ...p, ennType: null, ennWing: null, ennWingStrength: null }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.textFaint, fontSize: 13, padding: '0 4px' }}>× clear</button>
              </div>
            ) : (
              <p style={{ fontSize: 11, color: G.textFaint, marginTop: 5 }}>Don't know your type? Take the Enneagram quiz in the Typer tab.</p>
            )}
          </div>
          {person.ennType && (
            <div>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Wing <span style={{ color: G.textFaint, fontWeight: 400 }}>(optional)</span></label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[adj1, adj2].map(w => (
                  <button key={w} onClick={() => updatePerson(idx, p => ({ ...p, ennWing: w, ennWingStrength: null }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${person.ennWing === w ? G.gold : G.border}`, background: person.ennWing === w ? G.goldDim : G.bg3, color: person.ennWing === w ? G.gold : G.textDim, fontSize: 13 }}>
                    {person.ennType}w{w}
                  </button>
                ))}
                {person.ennWing && <button onClick={() => updatePerson(idx, p => ({ ...p, ennWing: null, ennWingStrength: null }))} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${G.border}`, background: 'transparent', color: G.textFaint, fontSize: 12 }}>×</button>}
              </div>
              {person.ennWing && <p style={{ fontSize: 11, color: G.textFaint, marginTop: 4 }}>{WING_DESC[`${person.ennType}w${person.ennWing}`]?.split('—')[0].trim()}</p>}
            </div>
          )}
          {person.ennWing && (
            <div>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Wing Strength <span style={{ color: G.textFaint, fontWeight: 400 }}>(optional)</span></label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ id: 'balanced', label: 'Balanced' }, { id: 'moderate', label: 'Moderate' }, { id: 'strong', label: 'Strong' }].map(s => (
                  <button key={s.id} onClick={() => updatePerson(idx, p => ({ ...p, ennWingStrength: s.id }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${person.ennWingStrength === s.id ? G.gold : G.border}`, background: person.ennWingStrength === s.id ? G.goldDim : G.bg3, color: person.ennWingStrength === s.id ? G.gold : G.textDim, fontSize: 12 }}>
                    {s.label}
                  </button>
                ))}
              </div>
              {person.ennWingStrength && <p style={{ fontSize: 11, color: G.textFaint, marginTop: 4 }}>{wingStrengthDesc(person.ennWingStrength)}</p>}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: G.textDim }}>Instinct Stack</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: G.textFaint, cursor: 'pointer' }}>
                <input type="checkbox" checked={includeInstinct} onChange={e => setIncludeInstinct(e.target.checked)} />
                Include
              </label>
            </div>
            {!includeInstinct && <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6 }}>Instinct stack will not be included in the comparison.</p>}
            {includeInstinct && instOrder.map((inst, i) => (
              <div key={inst} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '8px 12px', background: i === 0 ? G.goldDim : G.bg3, border: `1px solid ${i === 0 ? G.goldBorder : G.border}`, borderRadius: 8 }}>
                <span style={{ ...S.mono, fontSize: 13, color: i === 0 ? G.gold : G.textDim, minWidth: 28 }}>{inst.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: G.textFaint, flex: 1 }}>{['Dominant', 'Secondary', 'Repressed'][i]}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {i > 0 && <button onClick={() => moveInstinct(i, i - 1)} style={{ padding: '2px 8px', borderRadius: 6, border: `1px solid ${G.border}`, background: 'transparent', color: G.textDim, fontSize: 14 }}>↑</button>}
                  {i < 2 && <button onClick={() => moveInstinct(i, i + 1)} style={{ padding: '2px 8px', borderRadius: 6, border: `1px solid ${G.border}`, background: 'transparent', color: G.textDim, fontSize: 14 }}>↓</button>}
                </div>
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>MBTI Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
              {Object.keys(MBTI_TYPES).map(t => (
                <button key={t} onClick={() => updatePerson(idx, p => ({ ...p, mbti: t }))} style={{ padding: '7px 4px', borderRadius: 8, border: `1px solid ${person.mbti === t ? G.gold : G.border}`, background: person.mbti === t ? G.goldDim : G.bg3, color: person.mbti === t ? G.gold : G.textDim, fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
                  {t}
                </button>
              ))}
            </div>
            {person.mbti ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <p style={{ fontSize: 12, color: G.textDim, margin: 0 }}>
                  {person.mbti} — <span style={{ color: G.text }}>{MBTI_TYPES[person.mbti]?.name}</span>
                </p>
                <button onClick={() => updatePerson(idx, p => ({ ...p, mbti: null }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.textFaint, fontSize: 13, padding: '0 4px' }}>× clear</button>
              </div>
            ) : (
              <p style={{ fontSize: 11, color: G.textFaint, marginTop: 5 }}>Don't know your type? Take the MBTI quiz in the Typer tab.</p>
            )}
          </div>
        </div>
      )}

      {!isComplete && mode === 'manual' && (
        <p style={{ fontSize: 11, color: G.textFaint, marginTop: 12, textAlign: 'center' }}>
          Select an Enneagram type, MBTI type, and instinct stack to continue.
        </p>
      )}
      <button style={{ ...S.btn, width: '100%', marginTop: 8, opacity: isComplete ? 1 : 0.4 }} onClick={isComplete ? handleDone : undefined}>Done ✓</button>
    </div>
  );
}

export default function ComparePage() {
  const [persons, setPersons] = useState(() => {
    const decoded = decodePersons(window.location.hash);
    if (decoded && decoded.length >= 2) return decoded;
    try {
      const stored = localStorage.getItem(LS_COMPARE);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [emptyPerson(1), emptyPerson(2)];
  });
  const [editing, setEditing] = useState(null);
  const [expandedPairs, setExpandedPairs] = useState(new Set(['0-1']));
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    try { localStorage.setItem(LS_COMPARE, JSON.stringify(persons)); } catch {}
  }, [persons]);

  const addPerson = () => {
    if (persons.length >= 12) return;
    setPersons(prev => [...prev, emptyPerson(prev.length + 1)]);
  };

  const removePerson = (idx) => {
    if (persons.length <= 2) return;
    setPersons(prev => prev.filter((_, i) => i !== idx));
    if (editing === idx) setEditing(null);
    else if (editing !== null && editing > idx) setEditing(editing - 1);
  };

  const updatePerson = (idx, updater) => setPersons(prev => prev.map((p, i) => i === idx ? updater(p) : p));

  const pairKey = (i, j) => `${i}-${j}`;
  const togglePair = (i, j) => {
    const k = pairKey(i, j);
    setExpandedPairs(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  };

  const isPersonComplete = (p) => !!(p.ennType && p.mbti && p.instinctStack);

  const validPairs = [];
  for (let i = 0; i < persons.length; i++) for (let j = i + 1; j < persons.length; j++) {
    if (isPersonComplete(persons[i]) && isPersonComplete(persons[j])) validPairs.push([i, j]);
  }

  const isPairExpanded = (i, j) => expandedPairs.has(pairKey(i, j));
  const readyCount = persons.filter(isPersonComplete).length;
  const hasResults = readyCount >= 2;
  // Group overview is only meaningful for 3+ people — pairwise analysis covers the 2-person case fully.
  const completedPersons = persons.filter(isPersonComplete);
  const groupInsights = readyCount >= 3 ? analyzeGroup(completedPersons) : [];
  const teamArchetype = readyCount >= 3 ? getTeamArchetype(completedPersons) : null;
  const centerDist = readyCount >= 3 ? getCenterDistribution(completedPersons) : null;
  const harmonicDist = readyCount >= 3 ? getHarmonicDistribution(completedPersons) : null;
  const hornevianDist = readyCount >= 3 ? getHornevianDistribution(completedPersons) : null;
  const temperamentDist = readyCount >= 3 ? getTemperamentDistribution(completedPersons) : null;
  const cognitiveCoverage = readyCount >= 3 ? getCognitiveCoverage(completedPersons) : null;
  const instinctChemistry = readyCount >= 3 ? getInstinctGroupChemistry(completedPersons) : null;

  const handleShare = () => {
    const hash = '#' + encodePersons(persons);
    const url = window.location.origin + window.location.pathname + hash;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 3000);
    }).catch(() => {
      window.location.hash = encodePersons(persons);
      setShareMsg('Hash updated — copy URL from address bar');
      setTimeout(() => setShareMsg(''), 5000);
    });
  };

  const PairResults = ({ pA, pB }) => {
    const bothEnn = pA.ennType && pB.ennType;
    const bothMBTI = pA.mbti && pB.mbti;
    const commMatrix = getCommunicationMatrix(pA, pB);
    const growthStress = bothEnn ? getGrowthStressInteraction(pA, pB) : null;
    const cogHarmony = bothMBTI ? getCognitiveHarmony(pA.mbti, pB.mbti) : null;
    const instDepth = getInstinctDepthAnalysisSync(pA.instinctStack, pB.instinctStack);

    // Enneagram lookups
    const ennDyn = bothEnn ? (ENN_DYNAMICS[ennKey(pA.ennType, pB.ennType)] || []) : [];
    const ennT = bothEnn ? (ENN_TIPS[ennKey(pA.ennType, pB.ennType)] || []) : [];
    const wingDyn = bothEnn ? getWingDynamics(pA, pB) : null;

    // Instinct stack lookup
    const stackA = pA.instinctStack, stackB = pB.instinctStack;
    const instStackDyn = (stackA?.length === 3 && stackB?.length === 3)
      ? (INSTINCT_STACK_DYNAMICS[stackKey(stackA, stackB)] || null)
      : null;

    // MBTI lookups
    const mbtiKey2 = bothMBTI ? mbtiKey(pA.mbti, pB.mbti) : null;
    const mbtiInsights = mbtiKey2 ? (MBTI_INSIGHTS[mbtiKey2] || []) : [];
    const mbtiTips = mbtiKey2 ? (MBTI_TIPS[mbtiKey2] || []) : [];
    const mbtiStacks = bothMBTI ? { stack1: MBTI_TYPES[pA.mbti]?.stack, stack2: MBTI_TYPES[pB.mbti]?.stack } : null;
    const shared = mbtiStacks ? mbtiStacks.stack1.filter(f => mbtiStacks.stack2.includes(f)) : [];

    return (
      <div>
        {bothEnn && (
          <>
            {ennDyn.map((d, i) => (
              <div key={i} style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: d.color || G.gold, borderLeftStyle: 'solid' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16, color: d.color || G.gold }}>{d.icon}</span>
                  <h3 style={{ ...S.h3, marginBottom: 0 }}>{d.label}</h3>
                </div>
                <p style={S.body}>{d.desc}</p>
              </div>
            ))}
            {wingDyn && (
              <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#e8a030', borderLeftStyle: 'solid' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#e8a030' }}>↕</span>
                  <h3 style={{ ...S.h3, marginBottom: 0 }}>Wing Dynamics</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  {pA.ennWing && <div style={{ padding: '4px 10px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}` }}><span style={{ ...S.mono, fontSize: 12 }}>{pA.ennType}w{pA.ennWing}</span>{pA.ennWingStrength && <span style={{ fontSize: 11, color: G.textFaint, marginLeft: 6 }}>{wingStrengthLabel(pA.ennWingStrength)}</span>}</div>}
                  {pB.ennWing && <div style={{ padding: '4px 10px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}` }}><span style={{ ...S.mono, fontSize: 12 }}>{pB.ennType}w{pB.ennWing}</span>{pB.ennWingStrength && <span style={{ fontSize: 11, color: G.textFaint, marginLeft: 6 }}>{wingStrengthLabel(pB.ennWingStrength)}</span>}</div>}
                </div>
                {wingDyn.map((note, i) => <p key={i} style={{ ...S.body, marginBottom: 6 }}>{note}</p>)}
              </div>
            )}
            {instStackDyn && (
              <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#30a888', borderLeftStyle: 'solid' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: '#30a888' }}>⟳</span>
                  <h3 style={{ ...S.h3, marginBottom: 0 }}>Instinct Stack Dynamics</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {stackA && <div style={{ padding: '4px 10px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}` }}><span style={{ ...S.mono, fontSize: 12, color: G.gold }}>{stackA.map(i => i.toUpperCase()).join('/')}</span></div>}
                  {stackB && <div style={{ padding: '4px 10px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}` }}><span style={{ ...S.mono, fontSize: 12, color: G.gold }}>{stackB.map(i => i.toUpperCase()).join('/')}</span></div>}
                </div>
                {instStackDyn.map((note, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <p style={{ ...S.mono, fontSize: 12, color: note.tier === 'dominant' ? G.gold : note.tier === 'alignment' ? '#4a88d8' : note.tier === 'repressed' ? '#e88050' : G.textDim, marginBottom: 4 }}>{note.label}</p>
                    {note.note && <p style={S.body}>{note.note}</p>}
                    {note.bond && <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: '#50c878', fontSize: 14, marginTop: 1 }}>+</span><p style={S.body}>{note.bond}</p></div>}
                    {note.tension && <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#e88050', fontSize: 14, marginTop: 1 }}>−</span><p style={S.body}>{note.tension}</p></div>}
                  </div>
                ))}
              </div>
            )}
            {ennT.map((tip, i) => (
              <div key={i} style={{ ...S.card, background: i === 0 ? 'rgba(96,160,208,0.05)' : 'rgba(176,80,192,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ ...S.tag, background: i === 0 ? 'rgba(96,160,208,0.15)' : 'rgba(176,80,192,0.15)', color: i === 0 ? '#60a0d0' : '#b850c0', fontSize: 10 }}>{tip.for}</span>
                  <h3 style={{ ...S.h3, marginBottom: 0, color: i === 0 ? '#60a0d0' : '#b850c0' }}>{tip.label}</h3>
                </div>
                {tip.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: G.textFaint, fontSize: 12, fontFamily: "'DM Mono',monospace", flexShrink: 0, marginTop: 2 }}>{j + 1}.</span>
                    <p style={{ ...S.body, fontSize: 14 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
        {bothMBTI && mbtiStacks && (
          <>
            <div style={S.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr', gap: 4, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{pA.mbti}</p>
                  {mbtiStacks.stack1.map((fn, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                      <FnBadge fn={fn} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingTop: 32 }}>
                  {mbtiStacks.stack1.map((fn, i) => {
                    const fn2 = mbtiStacks.stack2[i], match = fn === fn2, isShared = shared.includes(fn) || shared.includes(fn2);
                    return (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: match ? 'rgba(80,200,120,0.1)' : 'transparent' }}>
                        <span style={{ fontSize: 9, color: match ? '#50c878' : isShared ? G.gold : G.textFaint }}>{match ? '=' : isShared ? '~' : '×'}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{pB.mbti}</p>
                  {mbtiStacks.stack2.map((fn, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
                      <FnBadge fn={fn} />
                      <span style={{ fontSize: 9, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: '#50c878', fontFamily: "'DM Mono',monospace" }}><span style={{ fontWeight: 600 }}>=</span> same function</span>
                <span style={{ fontSize: 10, color: G.gold, fontFamily: "'DM Mono',monospace" }}><span style={{ fontWeight: 600 }}>~</span> shared in stack</span>
                <span style={{ fontSize: 10, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}><span style={{ fontWeight: 600 }}>×</span> not shared</span>
              </div>
              {shared.length > 0 && <p style={{ ...S.body, fontSize: 11, textAlign: 'center', marginTop: 8 }}>Shared functions: {shared.map(f => <FnBadge key={f} fn={f} />)}</p>}
            </div>
            {mbtiInsights.map((ins, i) => (
              <div key={i} style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: ins.color || G.gold, borderLeftStyle: 'solid' }}>
                <h3 style={{ ...S.h3, color: ins.color || G.gold }}>{ins.label}</h3>
                <p style={S.body}>{ins.desc}</p>
              </div>
            ))}
            {mbtiTips.map((tip, i) => (
              <div key={i} style={{ ...S.card, background: i === 0 ? 'rgba(96,160,208,0.05)' : 'rgba(176,80,192,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ ...S.tag, background: i === 0 ? 'rgba(96,160,208,0.15)' : 'rgba(176,80,192,0.15)', color: i === 0 ? '#60a0d0' : '#b850c0', fontSize: 10 }}>{tip.for}</span>
                  <h3 style={{ ...S.h3, marginBottom: 0, color: i === 0 ? '#60a0d0' : '#b850c0' }}>{tip.label}</h3>
                </div>
                {tip.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: G.textFaint, fontSize: 12, fontFamily: "'DM Mono',monospace", flexShrink: 0, marginTop: 2 }}>{j + 1}.</span>
                    <p style={{ ...S.body, fontSize: 14 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
        {/* Cognitive Harmony Score */}
        {cogHarmony && (
          <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#4a88d8', borderLeftStyle: 'solid' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#4a88d8' }}>◎</span>
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Cognitive Harmony</h3>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 64, height: 6, borderRadius: 3, background: G.bg3, overflow: 'hidden' }}>
                  <div style={{ width: `${cogHarmony.score}%`, height: '100%', borderRadius: 3, background: cogHarmony.score >= 75 ? '#50c878' : cogHarmony.score >= 55 ? G.gold : '#e88050' }} />
                </div>
                <span style={{ ...S.mono, fontSize: 12, color: cogHarmony.score >= 75 ? '#50c878' : cogHarmony.score >= 55 ? G.gold : '#e88050' }}>{cogHarmony.score}</span>
              </div>
            </div>
            <p style={{ ...S.body, marginBottom: 10 }}>{cogHarmony.narrative}</p>
            {cogHarmony.strengthsAsTeam.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                {cogHarmony.strengthsAsTeam.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#50c878', fontSize: 12, flexShrink: 0 }}>+</span>
                    <p style={{ ...S.body, fontSize: 13 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}
            {cogHarmony.blindSpots.length > 0 && (
              <p style={{ ...S.body, fontSize: 12, color: G.textFaint }}>Functions absent from both top-4 stacks: {cogHarmony.blindSpots.join(', ')}</p>
            )}
          </div>
        )}

        {/* Communication Style Matrix */}
        {(commMatrix.conflictStyle.dynamic || commMatrix.decisionMaking.dynamic || commMatrix.emotionalExpression.dynamic) && (
          <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#b850c0', borderLeftStyle: 'solid' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#b850c0' }}>⇄</span>
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Communication Style</h3>
            </div>
            {commMatrix.emotionalExpression.dynamic && (
              <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>MODALITY</p>
                <p style={{ ...S.body, fontSize: 13 }}>{commMatrix.emotionalExpression.dynamic}</p>
              </div>
            )}
            {commMatrix.conflictStyle.dynamic && (
              <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>CONFLICT</p>
                <p style={{ ...S.body, fontSize: 13 }}>{commMatrix.conflictStyle.dynamic}</p>
              </div>
            )}
            {commMatrix.decisionMaking.dynamic && (
              <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>DECISIONS</p>
                <p style={{ ...S.body, fontSize: 13 }}>{commMatrix.decisionMaking.dynamic}</p>
              </div>
            )}
            {commMatrix.energyManagement.dynamic && (
              <div style={{ marginBottom: commMatrix.tips.length > 0 ? 8 : 0, paddingBottom: commMatrix.tips.length > 0 ? 8 : 0, borderBottom: commMatrix.tips.length > 0 ? `1px solid ${G.border}` : 'none' }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>INSTINCT PRIORITY</p>
                <p style={{ ...S.body, fontSize: 13 }}>{commMatrix.energyManagement.dynamic}</p>
              </div>
            )}
            {commMatrix.tips.length > 0 && (
              <div>
                {commMatrix.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span style={{ color: G.gold, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                    <p style={{ ...S.body, fontSize: 13 }}>{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Growth & Stress Interaction */}
        {growthStress && (
          <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#e88050', borderLeftStyle: 'solid' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#e88050' }}>↕</span>
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Growth & Stress Dynamics</h3>
            </div>
            {[
              { label: `${pA.label} → ${pB.label} (growth)`, text: growthStress.aGrowthImpactOnB, color: '#50c878' },
              { label: `${pA.label} → ${pB.label} (stress)`, text: growthStress.aStressImpactOnB, color: '#e88050' },
              { label: `${pB.label} → ${pA.label} (growth)`, text: growthStress.bGrowthImpactOnA, color: '#50c878' },
              { label: `${pB.label} → ${pA.label} (stress)`, text: growthStress.bStressImpactOnA, color: '#e88050' },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < 3 ? `1px solid ${G.border}` : 'none' }}>
                <p style={{ fontSize: 11, color: row.color, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>{row.label.toUpperCase()}</p>
                <p style={{ ...S.body, fontSize: 13 }}>{row.text}</p>
              </div>
            ))}
            {growthStress.sharedGrowthPath && (
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'rgba(80,200,120,0.08)', border: `1px solid rgba(80,200,120,0.2)`, marginBottom: 8 }}>
                <p style={{ ...S.body, fontSize: 13, color: '#50c878' }}>{growthStress.sharedGrowthPath}</p>
              </div>
            )}
            <p style={{ ...S.body, fontSize: 12, color: G.textFaint, fontStyle: 'italic' }}>{growthStress.potentialFriction}</p>
          </div>
        )}

        {/* Instinct Depth Analysis */}
        {instDepth && (
          <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#30a888', borderLeftStyle: 'solid' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#30a888' }}>◈</span>
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Instinct Depth Analysis</h3>
              <span style={{ marginLeft: 'auto', ...S.tag, fontSize: 10, background: instDepth.overallChemistry === 'high' ? 'rgba(80,200,120,0.12)' : instDepth.overallChemistry === 'medium' ? 'rgba(228,160,48,0.12)' : 'rgba(232,128,80,0.12)', color: instDepth.overallChemistry === 'high' ? '#50c878' : instDepth.overallChemistry === 'medium' ? G.gold : '#e88050', border: `1px solid ${instDepth.overallChemistry === 'high' ? 'rgba(80,200,120,0.3)' : instDepth.overallChemistry === 'medium' ? G.goldBorder : 'rgba(232,128,80,0.3)'}` }}>{instDepth.overallChemistry} chemistry</span>
            </div>
            <p style={{ ...S.body, marginBottom: 10 }}>{instDepth.dominantDynamic.narrative}</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120, padding: '8px 10px', borderRadius: 6, background: G.bg3, border: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 10, color: G.textFaint, marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>ATTRACTION</p>
                <p style={{ ...S.body, fontSize: 12 }}>{instDepth.dominantDynamic.attraction}</p>
              </div>
              <div style={{ flex: 1, minWidth: 120, padding: '8px 10px', borderRadius: 6, background: G.bg3, border: `1px solid ${G.border}` }}>
                <p style={{ fontSize: 10, color: G.textFaint, marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>FRICTION</p>
                <p style={{ ...S.body, fontSize: 12 }}>{instDepth.dominantDynamic.friction}</p>
              </div>
            </div>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 8 }}><span style={{ color: G.textDim }}>Secondary bridge: </span>{instDepth.secondaryBridge}</p>
            {instDepth.blindSpotAnalysis.sharedBlindSpot && (
              <div style={{ padding: '8px 10px', borderRadius: 6, background: 'rgba(232,128,80,0.08)', border: `1px solid rgba(232,128,80,0.2)`, marginBottom: 8 }}>
                <p style={{ ...S.body, fontSize: 13, color: '#e88050' }}>{instDepth.blindSpotAnalysis.sharedBlindSpot}</p>
              </div>
            )}
            {instDepth.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ color: '#30a888', fontSize: 12, flexShrink: 0 }}>→</span>
                <p style={{ ...S.body, fontSize: 13 }}>{tip}</p>
              </div>
            ))}
          </div>
        )}

        {!bothEnn && !bothMBTI && (
          <div style={{ ...S.card, padding: '16px', textAlign: 'center' }}>
            <p style={{ ...S.body, fontSize: 13 }}>Enter the same system for both people to see interaction analysis.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
        <h1 style={S.h1}>Compare</h1>
        <p style={S.body}>Pairwise and group dynamics for 2–12 people</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {persons.map((p, i) => {
          const archetype = computeArchetypeName(p.ennType, p.mbti, p.instinctStack?.[0]);
          return (
            <button key={i} onClick={() => setEditing(editing === i ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 20, border: `1px solid ${editing === i ? G.gold : G.border}`, background: editing === i ? G.goldDim : G.bg2, color: G.text, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{p.label}</span>
              {archetype ? (
                <span style={{ fontSize: 11, color: G.gold, fontStyle: 'italic' }}>{archetype}</span>
              ) : (p.ennType || p.mbti) && (
                <span style={{ ...S.mono, fontSize: 11, color: G.gold }}>
                  {p.ennType ? `${p.ennType}w${p.ennWing || '?'}` : ''}{p.instinctStack ? ` ${p.instinctStack.map(i => i.toUpperCase()).join('/')}` : ''}{p.ennType && p.mbti ? ' · ' : ''}{p.mbti || ''}
                </span>
              )}
            </button>
          );
        })}
        {persons.length < 12 && editing === null && (
          <button onClick={addPerson} style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${G.border}`, background: G.bg3, color: G.textDim, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
        )}
        {editing === null && readyCount >= 1 && (
          <button onClick={handleShare} style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12, borderRadius: 20, marginLeft: 'auto' }}>
            ⟷ Share
          </button>
        )}
      </div>
      {shareMsg && <p style={{ ...S.body, fontSize: 12, color: G.gold, marginBottom: 8, textAlign: 'center' }}>{shareMsg}</p>}
      {editing !== null && (
        <PersonEditor
          key={editing}
          idx={editing}
          person={persons[editing]}
          personsCount={persons.length}
          updatePerson={updatePerson}
          removePerson={removePerson}
          onDone={() => setEditing(null)}
        />
      )}
      {editing === null && !hasResults && (
        <div style={{ ...S.card, textAlign: 'center', padding: '28px 20px' }}>
          <p style={S.body}>Complete all three systems for at least two people to see analysis. Click a person chip above to get started.</p>
          <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginTop: 8 }}>Each person needs an Enneagram type, MBTI type, and instinct stack.</p>
        </div>
      )}
      {editing === null && hasResults && (
        <>
          {groupInsights.length > 0 && (
            <>
              <h2 style={{ ...S.h2, marginBottom: 12 }}>Group Overview</h2>

              {/* Team Archetype */}
              {teamArchetype && (
                <div style={{ ...S.cardGold, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, color: G.gold }}>⬡</span>
                    <h3 style={{ ...S.h3, marginBottom: 0, color: G.gold }}>{teamArchetype.name}</h3>
                  </div>
                  <p style={{ ...S.body }}>{teamArchetype.description}</p>
                </div>
              )}

              {/* Pattern insights from analyzeGroup */}
              {groupInsights.map((ins, i) => (
                <div key={i} style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: ins.color || G.gold, borderLeftStyle: 'solid' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, color: ins.color || G.gold }}>{ins.icon}</span>
                    <h3 style={{ ...S.h3, marginBottom: 0 }}>{ins.label}</h3>
                  </div>
                  <p style={S.body}>{ins.desc}</p>
                </div>
              ))}

              {/* Enneagram Center Distribution */}
              {centerDist && (
                <div style={S.card}>
                  <h3 style={{ ...S.h3, marginBottom: 10 }}>Center Distribution</h3>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[['gut', '#e88050'], ['heart', '#b850c0'], ['head', '#4a88d8']].map(([c, color]) => (
                      <div key={c} style={{ flex: 1, minWidth: 80, padding: '8px 10px', borderRadius: 8, background: G.bg3, border: `1px solid ${centerDist.dist[c] > 0 ? color : G.border}`, textAlign: 'center' }}>
                        <p style={{ ...S.mono, fontSize: 12, color: centerDist.dist[c] > 0 ? color : G.textFaint, marginBottom: 2 }}>{c.toUpperCase()}</p>
                        <p style={{ fontSize: 18, fontWeight: 600, color: centerDist.dist[c] > 0 ? color : G.textFaint, marginBottom: 0 }}>{centerDist.pct[c]}%</p>
                        <p style={{ fontSize: 10, color: G.textFaint }}>{centerDist.dist[c]} / {centerDist.total}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ ...S.body, fontSize: 13 }}>{centerDist.analysis}</p>
                  {centerDist.blindSpots.length > 0 && (
                    <p style={{ ...S.body, fontSize: 12, color: '#e88050', marginTop: 6 }}>Blind spots: {centerDist.blindSpots.join('; ')}</p>
                  )}
                </div>
              )}

              {/* Harmonic & Hornevian side by side */}
              {(harmonicDist || hornevianDist) && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {harmonicDist && (
                    <div style={{ ...S.card, flex: 1, minWidth: 180 }}>
                      <h3 style={{ ...S.h3, marginBottom: 8, fontSize: 13 }}>Harmonic Groups</h3>
                      {Object.entries(harmonicDist.dist).map(([h, count]) => (
                        <div key={h} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: count > 0 ? G.text : G.textFaint }}>{h.charAt(0).toUpperCase() + h.slice(1)}</span>
                          <span style={{ ...S.mono, fontSize: 12, color: count > 0 ? G.gold : G.textFaint }}>{count}</span>
                        </div>
                      ))}
                      <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginTop: 6 }}>{harmonicDist.analysis}</p>
                    </div>
                  )}
                  {hornevianDist && (
                    <div style={{ ...S.card, flex: 1, minWidth: 180 }}>
                      <h3 style={{ ...S.h3, marginBottom: 8, fontSize: 13 }}>Hornevian Groups</h3>
                      {Object.entries(hornevianDist.dist).map(([h, count]) => (
                        <div key={h} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: count > 0 ? G.text : G.textFaint }}>{h.charAt(0).toUpperCase() + h.slice(1)}</span>
                          <span style={{ ...S.mono, fontSize: 12, color: count > 0 ? G.gold : G.textFaint }}>{count}</span>
                        </div>
                      ))}
                      <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginTop: 6 }}>{hornevianDist.analysis}</p>
                    </div>
                  )}
                </div>
              )}

              {/* MBTI Temperament Distribution */}
              {temperamentDist && (
                <div style={S.card}>
                  <h3 style={{ ...S.h3, marginBottom: 10 }}>Keirsey Temperaments</h3>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {['NT', 'NF', 'SJ', 'SP'].map(t => (
                      <div key={t} style={{ flex: 1, minWidth: 60, padding: '8px 6px', borderRadius: 8, background: G.bg3, border: `1px solid ${temperamentDist.dist[t] > 0 ? G.gold : G.border}`, textAlign: 'center' }}>
                        <p style={{ ...S.mono, fontSize: 13, color: temperamentDist.dist[t] > 0 ? G.gold : G.textFaint, marginBottom: 0, fontWeight: 600 }}>{t}</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: temperamentDist.dist[t] > 0 ? G.text : G.textFaint, marginBottom: 0 }}>{temperamentDist.dist[t]}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ ...S.body, fontSize: 13 }}>{temperamentDist.analysis}</p>
                </div>
              )}

              {/* Cognitive Function Coverage */}
              {cognitiveCoverage && (
                <div style={S.card}>
                  <h3 style={{ ...S.h3, marginBottom: 8 }}>Cognitive Function Coverage</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {['Fi', 'Fe', 'Ti', 'Te', 'Ni', 'Ne', 'Si', 'Se'].map(fn => {
                      const isCovered = cognitiveCoverage.wellCovered.includes(fn);
                      const isRep = cognitiveCoverage.represented.includes(fn);
                      return (
                        <div key={fn} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${isCovered ? '#50c878' : isRep ? G.goldBorder : G.border}`, background: isCovered ? 'rgba(80,200,120,0.1)' : isRep ? G.goldDim : G.bg3 }}>
                          <span style={{ ...S.mono, fontSize: 12, color: isCovered ? '#50c878' : isRep ? G.gold : G.textFaint }}>{fn}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: '#50c878' }}>■ well-covered</span>
                    <span style={{ fontSize: 10, color: G.gold }}>■ represented</span>
                    <span style={{ fontSize: 10, color: G.textFaint }}>■ absent</span>
                  </div>
                  <p style={{ ...S.body, fontSize: 13 }}>{cognitiveCoverage.analysis}</p>
                  {cognitiveCoverage.recommendation !== 'No specific gaps to address.' && (
                    <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginTop: 4 }}>{cognitiveCoverage.recommendation}</p>
                  )}
                </div>
              )}

              {/* Instinct Group Chemistry */}
              {instinctChemistry && (
                <div style={S.card}>
                  <h3 style={{ ...S.h3, marginBottom: 10 }}>Instinct Group Chemistry</h3>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {['SP', 'SX', 'SO'].map(inst => (
                      <div key={inst} style={{ flex: 1, padding: '8px 6px', borderRadius: 8, background: G.bg3, border: `1px solid ${instinctChemistry.dist[inst] > 0 ? '#30a888' : G.border}`, textAlign: 'center' }}>
                        <p style={{ ...S.mono, fontSize: 13, color: instinctChemistry.dist[inst] > 0 ? '#30a888' : G.textFaint, marginBottom: 0, fontWeight: 600 }}>{inst}</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: instinctChemistry.dist[inst] > 0 ? G.text : G.textFaint, marginBottom: 0 }}>{instinctChemistry.pct[inst]}%</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}>{instinctChemistry.groupEnergy}</p>
                  {instinctChemistry.conflictRisk && (
                    <p style={{ ...S.body, fontSize: 12, color: '#e88050' }}>{instinctChemistry.conflictRisk}</p>
                  )}
                </div>
              )}

              {/* Compatibility Heatmap for 4+ people */}
              {readyCount >= 4 && (() => {
                const cp = completedPersons;
                const scores = cp.map((pA, i) => cp.map((pB, j) => {
                  if (i === j) return null;
                  if (!pA.mbti || !pB.mbti) return null;
                  return getCognitiveHarmony(pA.mbti, pB.mbti)?.score ?? null;
                }));
                const scoreToColor = (s) => {
                  if (s === null) return G.bg3;
                  if (s >= 75) return 'rgba(80,200,120,0.25)';
                  if (s >= 55) return 'rgba(228,160,48,0.25)';
                  return 'rgba(232,128,80,0.25)';
                };
                return (
                  <div style={S.card}>
                    <h3 style={{ ...S.h3, marginBottom: 10 }}>Cognitive Compatibility Heatmap</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ borderCollapse: 'collapse', fontSize: 11, fontFamily: "'DM Mono',monospace", minWidth: '100%' }}>
                        <thead>
                          <tr>
                            <td style={{ width: 60 }} />
                            {cp.map((p, j) => (
                              <td key={j} style={{ padding: '4px 6px', textAlign: 'center', color: G.textFaint, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.label}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {cp.map((pA, i) => (
                            <tr key={i}>
                              <td style={{ padding: '4px 6px', color: G.textFaint, whiteSpace: 'nowrap', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{pA.label}</td>
                              {cp.map((pB, j) => {
                                const s = scores[i][j];
                                return (
                                  <td key={j} style={{ padding: '4px 6px', textAlign: 'center', borderRadius: 4, background: i === j ? G.bg3 : scoreToColor(s), color: i === j ? G.textFaint : (s !== null ? G.text : G.textFaint), fontWeight: i !== j && s !== null ? 500 : 400 }}>
                                    {i === j ? '—' : s !== null ? s : '·'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: '#50c878' }}>■ ≥75 high</span>
                      <span style={{ fontSize: 10, color: G.gold }}>■ 55–74 moderate</span>
                      <span style={{ fontSize: 10, color: '#e88050' }}>■ &lt;55 low</span>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
          {validPairs.length > 0 && (
            <>
              <h2 style={{ ...S.h2, marginTop: validPairs.length > 1 ? 24 : 8, marginBottom: 12 }}>
                {validPairs.length === 1 ? 'Pairwise Analysis' : `Pairwise Analysis (${validPairs.length} pairs)`}
              </h2>
              {validPairs.map(([i, j]) => {
                const pA = persons[i], pB = persons[j];
                const expanded = isPairExpanded(i, j);
                return (
                  <div key={pairKey(i, j)} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    {validPairs.length > 1 && (
                      <button onClick={() => togglePair(i, j)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: G.text }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500 }}>
                          {pA.label} × {pB.label}
                          <span style={{ fontSize: 11, marginLeft: 10, color: expanded ? G.gold : G.textFaint, fontStyle: 'italic' }}>
                            {computeArchetypeName(pA.ennType, pA.mbti, pA.instinctStack?.[0]) || `${pA.ennType ? `${pA.ennType}w${pA.ennWing || '?'}` : ''}${pA.mbti ? ` ${pA.mbti}` : ''}`}
                            {' vs '}
                            {computeArchetypeName(pB.ennType, pB.mbti, pB.instinctStack?.[0]) || `${pB.ennType ? `${pB.ennType}w${pB.ennWing || '?'}` : ''}${pB.mbti ? ` ${pB.mbti}` : ''}`}
                          </span>
                        </span>
                        <span style={{ color: expanded ? G.gold : G.textFaint, fontSize: 16 }}>{expanded ? '−' : '+'}</span>
                      </button>
                    )}
                    {(expanded || validPairs.length === 1) && (
                      <div style={validPairs.length > 1 ? { padding: '0 12px 12px' } : { padding: '16px 18px' }}>
                        <PairResults pA={pA} pB={pB} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div></div>
  );
}
