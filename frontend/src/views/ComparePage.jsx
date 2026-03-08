import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { ENN_TYPES, WING_DESC } from '../data/enneagram.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import FnBadge from '../components/FnBadge.jsx';
import { getEnnInteraction, getEnnTips, getInstinctKey, getWingDynamics, wingStrengthLabel, wingStrengthDesc, computeWingStrengthDelta } from '../utils/enneagram.js';
import { getMBTIInteraction, getMBTITips } from '../utils/mbti.js';
import { analyzeGroup } from '../utils/group.js';
import { apiLookupUser } from '../api.js';

const emptyPerson = (n) => ({ label: `Person ${n}`, ennType: null, ennWing: null, ennWingStrength: null, ennInstinct: null, mbti: null, ennScores: null });

export default function ComparePage({ user }) {
  const [persons, setPersons] = useState([emptyPerson(1), emptyPerson(2)]);
  const [editing, setEditing] = useState(null);
  const [expandedPairs, setExpandedPairs] = useState(new Set(['0-1']));

  const addPerson = () => {
    if (persons.length >= 6) return;
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

  const validPairs = [];
  for (let i = 0; i < persons.length; i++) for (let j = i + 1; j < persons.length; j++) {
    if ((persons[i].ennType || persons[i].mbti) && (persons[j].ennType || persons[j].mbti)) validPairs.push([i, j]);
  }

  const isPairExpanded = (i, j) => expandedPairs.has(pairKey(i, j));
  const readyCount = persons.filter(p => p.ennType || p.mbti).length;
  const hasResults = readyCount >= 2;
  const groupInsights = hasResults ? analyzeGroup(persons.filter(p => p.ennType || p.mbti)) : [];

  const PersonEditor = ({ idx, person, onDone }) => {
    const [mode, setMode] = useState('username');
    const [label, setLabel] = useState(person.label);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [usernameInput, setUsernameInput] = useState(idx === 0 && user ? user.username : '');
    const [usernameError, setUsernameError] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);

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
            next.ennType = d.coreType; next.ennWing = d.wing; next.ennInstinct = d.instinct;
            next.ennScores = d.scores; next.ennWingStrength = delta;
          }
          if (data.type === 'mbti' && data.resultData) next.mbti = data.resultData.result;
          return next;
        });
        setFileError('');
      } catch { setFileError('Could not parse file — use a backup .json from the Typer.'); }
    };

    const handleLoadByUsername = async () => {
      if (!usernameInput.trim()) return;
      setUsernameLoading(true); setUsernameError('');
      try {
        const profile = await apiLookupUser(usernameInput.trim());
        updatePerson(idx, p => ({
          ...p,
          label: profile.username,
          ennType: profile.enn_type || p.ennType,
          ennWing: profile.enn_wing || p.ennWing,
          ennInstinct: profile.enn_instinct || p.ennInstinct,
          ennWingStrength: profile.enn_wing_strength || p.ennWingStrength,
          mbti: profile.mbti_type || p.mbti,
        }));
        setLabel(profile.username);
        setUsernameError('');
      } catch (e) {
        setUsernameError(e.message || 'User not found');
      } finally { setUsernameLoading(false); }
    };

    const handleDone = () => { updatePerson(idx, p => ({ ...p, label })); onDone(); };

    return (
      <div style={{ ...S.cardGold, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ ...S.h3, marginBottom: 0 }}>Editing {person.label}</h3>
          {persons.length > 2 && <button onClick={() => removePerson(idx)} style={{ ...S.btnDanger, padding: '4px 10px', fontSize: 12 }}>Remove</button>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Name / Label</label>
          <input style={{ ...S.input, fontSize: 14 }} value={label} onChange={e => setLabel(e.target.value)} placeholder="Person's name" />
        </div>
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: G.bg3, borderRadius: 8, padding: 3 }}>
          {[{ id: 'username', label: 'By Username' }, { id: 'upload', label: 'Upload Backup' }, { id: 'manual', label: 'Manual Entry' }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ flex: 1, padding: '7px 8px', borderRadius: 6, border: 'none', background: mode === m.id ? G.bg2 : 'transparent', color: mode === m.id ? G.text : G.textDim, fontSize: 12, fontWeight: mode === m.id ? 500 : 400 }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'username' && (
          <div>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 10 }}>Enter a username to load their saved type profile.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...S.input, fontSize: 14, flex: 1 }} value={usernameInput} onChange={e => setUsernameInput(e.target.value)} placeholder="Username" onKeyDown={e => e.key === 'Enter' && handleLoadByUsername()} />
              <button onClick={handleLoadByUsername} disabled={usernameLoading} style={{ ...S.btn, padding: '10px 16px', fontSize: 13, opacity: usernameLoading ? 0.6 : 1 }}>
                {usernameLoading ? '...' : 'Load'}
              </button>
            </div>
            {usernameError && <p style={{ color: '#e85050', fontSize: 13, marginTop: 8 }}>{usernameError}</p>}
            {(person.ennType || person.mbti) && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: G.bg3, borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: G.textDim, marginBottom: 4 }}>Loaded:</p>
                {person.ennType && <p style={{ ...S.mono, fontSize: 13 }}>{person.ennType}w{person.ennWing || '?'}{person.ennInstinct ? ` ${person.ennInstinct.toUpperCase()}` : ''}</p>}
                {person.mbti && <p style={{ ...S.mono, fontSize: 13, marginTop: person.ennType ? 2 : 0 }}>{person.mbti}</p>}
              </div>
            )}
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
                {person.ennType && <p style={{ ...S.mono, fontSize: 13 }}>{person.ennType}w{person.ennWing || '?'}{person.ennInstinct ? ` ${person.ennInstinct.toUpperCase()}` : ''}</p>}
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
            </div>
            {person.ennType && (
              <div>
                <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Wing</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[adj1, adj2].map(w => (
                    <button key={w} onClick={() => updatePerson(idx, p => ({ ...p, ennWing: w, ennWingStrength: null }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${person.ennWing === w ? G.gold : G.border}`, background: person.ennWing === w ? G.goldDim : G.bg3, color: person.ennWing === w ? G.gold : G.textDim, fontSize: 13 }}>
                      {person.ennType}w{w}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {person.ennWing && (
              <div>
                <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Wing Strength</label>
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
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Instinctual Variant</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {['sp', 'sx', 'so'].map(i => (
                  <button key={i} onClick={() => updatePerson(idx, p => ({ ...p, ennInstinct: i }))} style={{ padding: '8px', borderRadius: 8, border: `1px solid ${person.ennInstinct === i ? G.gold : G.border}`, background: person.ennInstinct === i ? G.goldDim : G.bg3, color: person.ennInstinct === i ? G.gold : G.textDim, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
                    {i.toUpperCase()}
                  </button>
                ))}
              </div>
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
            </div>
          </div>
        )}

        <button style={{ ...S.btn, width: '100%', marginTop: 16 }} onClick={handleDone}>Done ✓</button>
      </div>
    );
  };

  const PairResults = ({ pA, pB }) => {
    const bothEnn = pA.ennType && pB.ennType;
    const bothMBTI = pA.mbti && pB.mbti;
    const ennDyn = bothEnn ? getEnnInteraction(pA.ennType, pB.ennType) : [];
    const ennT = bothEnn ? getEnnTips(pA.ennType, pB.ennType) : [];
    const mbtiRes = bothMBTI ? getMBTIInteraction(pA.mbti, pB.mbti) : null;
    const mbtiT = bothMBTI ? getMBTITips(pA.mbti, pB.mbti) : [];
    const instKey = (pA.ennInstinct && pB.ennInstinct) ? getInstinctKey(pA.ennInstinct, pB.ennInstinct) : null;
    const wingDyn = bothEnn ? getWingDynamics(pA, pB) : null;

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
            {instKey && (
              <div style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: '#30a888', borderLeftStyle: 'solid' }}>
                <h3 style={S.h3}>Instinct: {pA.ennInstinct?.toUpperCase()} × {pB.ennInstinct?.toUpperCase()}</h3>
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#50c878', fontSize: 14, marginTop: 1 }}>+</span><p style={S.body}>{instKey.bond}</p></div>
                  <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#e88050', fontSize: 14, marginTop: 1 }}>−</span><p style={S.body}>{instKey.tension}</p></div>
                </div>
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
        {bothMBTI && mbtiRes && (
          <>
            <div style={S.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr', gap: 4, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{pA.mbti}</p>
                  {mbtiRes.stack1.map((fn, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                      <FnBadge fn={fn} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingTop: 32 }}>
                  {mbtiRes.stack1.map((fn, i) => {
                    const fn2 = mbtiRes.stack2[i], match = fn === fn2, shared = mbtiRes.shared.includes(fn) || mbtiRes.shared.includes(fn2);
                    return (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: match ? 'rgba(80,200,120,0.1)' : 'transparent' }}>
                        <span style={{ fontSize: 9, color: match ? '#50c878' : shared ? G.gold : G.textFaint }}>{match ? '=' : shared ? '~' : '×'}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{pB.mbti}</p>
                  {mbtiRes.stack2.map((fn, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
                      <FnBadge fn={fn} />
                      <span style={{ fontSize: 9, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              {mbtiRes.shared.length > 0 && <p style={{ ...S.body, fontSize: 11, textAlign: 'center', marginTop: 10 }}>Shared: {mbtiRes.shared.map(f => <FnBadge key={f} fn={f} />)}</p>}
            </div>
            {mbtiRes.insights.map((ins, i) => (
              <div key={i} style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: ins.color || G.gold, borderLeftStyle: 'solid' }}>
                <h3 style={{ ...S.h3, color: ins.color || G.gold }}>{ins.label}</h3>
                <p style={S.body}>{ins.desc}</p>
              </div>
            ))}
            {mbtiT.map((tip, i) => (
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
        <p style={S.body}>Pairwise and group dynamics for 2–6 people</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {persons.map((p, i) => (
          <button key={i} onClick={() => setEditing(editing === i ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 20, border: `1px solid ${editing === i ? G.gold : G.border}`, background: editing === i ? G.goldDim : G.bg2, color: G.text, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{p.label}</span>
            {(p.ennType || p.mbti) && (
              <span style={{ ...S.mono, fontSize: 11, color: G.gold }}>
                {p.ennType ? `${p.ennType}w${p.ennWing || '?'}` : ''}{p.ennType && p.mbti ? ' · ' : ''}{p.mbti || ''}
              </span>
            )}
          </button>
        ))}
        {persons.length < 6 && editing === null && (
          <button onClick={addPerson} style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${G.border}`, background: G.bg3, color: G.textDim, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
        )}
      </div>
      {editing !== null && <PersonEditor key={editing} idx={editing} person={persons[editing]} onDone={() => setEditing(null)} />}
      {editing === null && !hasResults && (
        <div style={{ ...S.card, textAlign: 'center', padding: '28px 20px' }}>
          <p style={S.body}>Set at least two people to see analysis. Click a person chip above to get started.</p>
        </div>
      )}
      {editing === null && hasResults && (
        <>
          {groupInsights.length > 0 && (
            <>
              <h2 style={{ ...S.h2, marginBottom: 12 }}>Group Overview</h2>
              {groupInsights.map((ins, i) => (
                <div key={i} style={{ ...S.card, borderLeftWidth: 3, borderLeftColor: ins.color || G.gold, borderLeftStyle: 'solid' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, color: ins.color || G.gold }}>{ins.icon}</span>
                    <h3 style={{ ...S.h3, marginBottom: 0 }}>{ins.label}</h3>
                  </div>
                  <p style={S.body}>{ins.desc}</p>
                </div>
              ))}
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
                          <span style={{ ...S.mono, fontSize: 11, marginLeft: 10, color: expanded ? G.gold : G.textFaint }}>
                            {pA.ennType ? `${pA.ennType}w${pA.ennWing || '?'}` : ''}{pA.ennType && pA.mbti ? ' ' : ''}{pA.mbti || ''} vs {pB.ennType ? `${pB.ennType}w${pB.ennWing || '?'}` : ''}{pB.ennType && pB.mbti ? ' ' : ''}{pB.mbti || ''}
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
