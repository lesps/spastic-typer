import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { ENN_TYPES, ENN_CENTER, ENN_ARROWS, WING_DESC, INSTINCT_COMPAT } from '../data/enneagram.js';
import FnBadge from '../components/FnBadge.jsx';

const INSTINCT_META = {
  sp: { label: 'Self-Preservation', desc: 'Focused on physical security, health, comfort, and resource management.' },
  sx: { label: 'Sexual / One-to-One', desc: 'Drawn to intensity, depth, and transformative one-on-one connection.' },
  so: { label: 'Social', desc: 'Attuned to group dynamics, social roles, and a sense of belonging and contribution.' },
};

const CENTER_COLOR = { gut: '#e07040', heart: '#c060a0', head: '#5090d0' };

export default function Explorer() {
  const [tab, setTab] = useState('enneagram');
  const [sel, setSel] = useState(null);

  // ── Enneagram detail ──────────────────────────────────────────────────────
  if (sel && tab === 'enneagram') {
    const n = Number(sel);
    const t = ENN_TYPES[n];
    const arrows = ENN_ARROWS[n];
    const center = ENN_CENTER[n];
    const wingA = n === 1 ? 9 : n - 1;
    const wingB = n === 9 ? 1 : n + 1;
    return (
      <div style={S.page}><div style={S.container}>
        <button onClick={() => setSel(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ ...S.h1, fontSize: 'clamp(32px,10vw,44px)', letterSpacing: 'clamp(2px,2vw,8px)', marginBottom: 4 }}>Type {n}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{t.name}</h2>
          <span style={{ ...S.tag, background: `${CENTER_COLOR[center]}22`, color: CENTER_COLOR[center], border: `1px solid ${CENTER_COLOR[center]}44`, marginTop: 8, display: 'inline-block' }}>{center} center</span>
        </div>
        <div style={S.cardGold}><p style={S.body}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Core Fear</h3>
          <p style={S.body}>{t.fear}</p>
          <div style={S.divider} />
          <h3 style={S.h3}>Core Desire</h3>
          <p style={S.body}>{t.desire}</p>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Movement Lines</h3>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <div style={{ flex: 1, background: G.bg3, borderRadius: 8, padding: '10px 14px' }}>
              <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4 }}>Growth →</p>
              <p style={{ ...S.mono, fontSize: 16 }}>Type {arrows.growth}</p>
              <p style={{ fontSize: 12, color: G.textDim, marginTop: 2 }}>{ENN_TYPES[arrows.growth].name}</p>
            </div>
            <div style={{ flex: 1, background: G.bg3, borderRadius: 8, padding: '10px 14px' }}>
              <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4 }}>Stress →</p>
              <p style={{ ...S.mono, fontSize: 16 }}>Type {arrows.stress}</p>
              <p style={{ fontSize: 12, color: G.textDim, marginTop: 2 }}>{ENN_TYPES[arrows.stress].name}</p>
            </div>
          </div>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Wings</h3>
          {[`${n}w${wingA}`, `${n}w${wingB}`].map(w => WING_DESC[w] && (
            <div key={w} style={{ marginTop: 12 }}>
              <span style={{ ...S.mono, fontSize: 14 }}>{w}</span>
              <p style={{ ...S.body, fontSize: 13, marginTop: 4 }}>{WING_DESC[w]}</p>
            </div>
          ))}
        </div>
      </div></div>
    );
  }

  // ── Instinct detail ───────────────────────────────────────────────────────
  if (sel && tab === 'instinct') {
    const meta = INSTINCT_META[sel];
    const pairs = Object.entries(INSTINCT_COMPAT).filter(([key]) => key.includes(sel));
    return (
      <div style={S.page}><div style={S.container}>
        <button onClick={() => setSel(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ ...S.h1, fontSize: 'clamp(28px,8vw,38px)', letterSpacing: 'clamp(1px,1vw,4px)', marginBottom: 4 }}>{sel.toUpperCase()}</h1>
          <h2 style={{ ...S.h2, marginTop: 4 }}>{meta.label}</h2>
        </div>
        <div style={S.cardGold}><p style={S.body}>{meta.desc}</p></div>
        <h3 style={{ ...S.h3, marginTop: 24, marginBottom: 12 }}>Pairing Dynamics</h3>
        {pairs.map(([key, val]) => (
          <div key={key} style={{ ...S.card, marginBottom: 12 }}>
            <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{key}</p>
            <p style={{ fontSize: 12, color: '#6abf69', marginBottom: 4 }}>Bond — {val.bond}</p>
            <p style={{ fontSize: 12, color: '#e07878' }}>Tension — {val.tension}</p>
          </div>
        ))}
      </div></div>
    );
  }

  // ── MBTI detail ───────────────────────────────────────────────────────────
  if (sel && tab === 'mbti') {
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

  // ── List views ────────────────────────────────────────────────────────────
  const TABS = [
    { key: 'enneagram', label: 'Enneagram' },
    { key: 'instinct', label: 'Instinct' },
    { key: 'mbti', label: 'MBTI' },
  ];

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>Explorer</h1>
        <p style={S.body}>Deep-dive into personality systems</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => { setTab(key); setSel(null); }} style={{ ...tab === key ? S.btn : S.btnOutline, padding: '8px 18px', fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'enneagram' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {Object.entries(ENN_TYPES).map(([num, t]) => {
            const center = ENN_CENTER[Number(num)];
            return (
              <button key={num} onClick={() => setSel(num)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '14px 12px', textAlign: 'left' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, color: CENTER_COLOR[center], fontWeight: 500, marginBottom: 4 }}>{num}</div>
                <p style={{ fontSize: 11, color: G.textDim, lineHeight: 1.4 }}>{t.name}</p>
                <span style={{ fontSize: 10, color: CENTER_COLOR[center], opacity: 0.8 }}>{center}</span>
              </button>
            );
          })}
        </div>
      )}

      {tab === 'instinct' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {Object.entries(INSTINCT_META).map(([key, meta]) => (
            <button key={key} onClick={() => setSel(key)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '16px 18px', textAlign: 'left' }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: G.accent, fontWeight: 500, marginBottom: 6 }}>{key.toUpperCase()}</div>
              <p style={{ fontSize: 13, color: G.textDim, marginBottom: 2 }}>{meta.label}</p>
              <p style={{ fontSize: 12, color: G.textFaint, lineHeight: 1.5 }}>{meta.desc}</p>
            </button>
          ))}
        </div>
      )}

      {tab === 'mbti' && (
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
