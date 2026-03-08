import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { SOP_STEPS, QUADRANTS } from '../data/sop.js';
import FnBadge from '../components/FnBadge.jsx';

export default function MentalModel() {
  const [selType, setSelType] = useState(null);
  const [showSOP, setShowSOP] = useState(false);

  if (selType) {
    const t = MBTI_TYPES[selType];
    return (
      <div style={S.page}><div style={S.container}>
        <button onClick={() => setSelType(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ ...S.h1, fontSize: 'clamp(28px,9vw,40px)', letterSpacing: 'clamp(2px,2vw,8px)', marginBottom: 4 }}>{selType}</h1>
          <h2 style={S.h2}>{t.name}</h2>
        </div>
        <div style={S.cardGold}><p style={S.body}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Stack</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {t.stack.map((fn, i) => (
              <div key={fn} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 10, color: G.textFaint, display: 'block', marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                <FnBadge fn={fn} size="md" />
              </div>
            ))}
          </div>
        </div>
      </div></div>
    );
  }

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>Mental Model</h1>
        <p style={S.body}>Quadrant map and typing methodology</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {Object.entries(QUADRANTS).map(([key, q]) => (
          <div key={key} style={S.card}>
            <h3 style={{ ...S.h3, fontSize: 13 }}>{q.label}</h3>
            <p style={{ ...S.body, fontSize: 12, marginBottom: 10 }}>{q.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {q.types.map(t => (
                <button key={t} onClick={() => setSelType(t)} style={{ background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 8, padding: '8px', fontSize: 13, color: G.gold, fontFamily: "'DM Mono',monospace" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setShowSOP(!showSOP)} style={{ ...S.btnOutline, width: '100%', marginBottom: 16 }}>
        {showSOP ? 'Hide' : 'Show'} 4-Step Typing SOP
      </button>
      {showSOP && (
        <div>
          {SOP_STEPS.map((step, i) => (
            <div key={i} style={S.card}>
              <h3 style={S.h3}>{step.title}</h3>
              <p style={{ ...S.body, color: G.text, marginBottom: 10 }}>{step.q}</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {step.opts.map((o, j) => (
                  <span key={j} style={{ ...S.tag, fontSize: 12 }}>{o}</span>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(232,80,80,0.05)', border: '1px solid rgba(232,80,80,0.15)' }}>
                <p style={{ fontSize: 12, color: '#e88080', fontWeight: 500, marginBottom: 2 }}>Common Pitfall</p>
                <p style={{ fontSize: 13, color: G.textDim, lineHeight: 1.5 }}>{step.pitfall}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></div>
  );
}
