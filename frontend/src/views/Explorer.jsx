import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import FnBadge from '../components/FnBadge.jsx';

export default function Explorer() {
  const [tab, setTab] = useState('functions');
  const [sel, setSel] = useState(null);

  if (sel && tab === 'types') {
    const t = MBTI_TYPES[sel];
    return (
      <div style={S.page}><div style={S.container}>
        <button onClick={() => setSel(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ ...S.h1, fontSize: 'clamp(32px,10vw,44px)', letterSpacing: 'clamp(2px,2vw,8px)', marginBottom: 4 }}>{sel}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{t.name}</h2>
        </div>
        <div style={S.cardGold}><p style={S.body}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Cognitive Function Stack</h3>
          {t.stack.map((fn, i) => {
            const f = COG_FUNCTIONS[fn];
            return (
              <div key={fn} style={{ marginTop: i ? 16 : 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: G.textFaint, fontFamily: "'DM Mono',monospace", width: 28 }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                  <FnBadge fn={fn} size="md" />
                  <span style={{ fontSize: 13, color: G.textDim }}>{f.name}</span>
                </div>
                <p style={{ ...S.body, fontSize: 13, marginTop: 4, paddingLeft: 36 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
        {t.ennCorr && (
          <div style={S.card}>
            <h3 style={S.h3}>Enneagram Correlations</h3>
            <p style={{ ...S.body, marginTop: 4 }}>
              Commonly correlated types: {t.ennCorr.split(', ').map(e => <span key={e} style={{ ...S.tag, marginRight: 4 }}>Type {e}</span>)}
            </p>
          </div>
        )}
      </div></div>
    );
  }

  if (sel && tab === 'functions') {
    const f = COG_FUNCTIONS[sel];
    const usedBy = Object.entries(MBTI_TYPES).filter(([, v]) => v.stack.includes(sel));
    return (
      <div style={S.page}><div style={S.container}>
        <button onClick={() => setSel(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-block', padding: '10px 28px', borderRadius: 16, background: `${f.color}22`, border: `1px solid ${f.color}44` }}>
            <h1 style={{ fontFamily: "'DM Mono',monospace", fontSize: 'clamp(28px,8vw,36px)', color: f.color }}>{sel}</h1>
          </div>
          <h2 style={{ ...S.h2, marginTop: 12 }}>{f.name}</h2>
        </div>
        <div style={{ ...S.cardGold, borderColor: `${f.color}44` }}><p style={S.body}>{f.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Strengths</h3><p style={S.body}>{f.strengths}</p>
          <div style={S.divider} />
          <h3 style={S.h3}>Shadow / Pitfalls</h3><p style={S.body}>{f.shadow}</p>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Types Using {sel}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6, marginTop: 8 }}>
            {usedBy.map(([code, t]) => {
              const pos = t.stack.indexOf(sel);
              return (
                <button key={code} onClick={() => { setTab('types'); setSel(code); }} style={{ background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  <span style={S.mono}>{code}</span>
                  <span style={{ fontSize: 11, color: G.textFaint, marginLeft: 8 }}>{['Dominant', 'Auxiliary', 'Tertiary', 'Inferior'][pos]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div></div>
    );
  }

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>Function Explorer</h1>
        <p style={S.body}>Deep-dive into cognitive functions and type profiles</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['functions', 'types'].map(t => (
          <button key={t} onClick={() => { setTab(t); setSel(null); }} style={{ ...tab === t ? S.btn : S.btnOutline, padding: '8px 18px', fontSize: 13, textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'functions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {Object.entries(COG_FUNCTIONS).map(([key, f]) => (
            <button key={key} onClick={() => setSel(key)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: f.color, fontWeight: 500 }}>{key}</span>
              </div>
              <p style={{ fontSize: 12, color: G.textDim, lineHeight: 1.5 }}>{f.name}</p>
            </button>
          ))}
        </div>
      )}
      {tab === 'types' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {Object.entries(MBTI_TYPES).map(([code, t]) => (
            <button key={code} onClick={() => setSel(code)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={S.mono}>{code}</span>
              </div>
              <p style={{ fontSize: 12, color: G.textDim }}>{t.name}</p>
              <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
                {t.stack.map(fn => <FnBadge key={fn} fn={fn} />)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div></div>
  );
}
