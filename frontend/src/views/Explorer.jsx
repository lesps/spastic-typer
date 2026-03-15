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

const TABS = [
  { key: 'enneagram', label: 'Enneagram' },
  { key: 'mbti', label: 'MBTI' },
  { key: 'instinct', label: 'Instinct' },
  { key: 'integration', label: 'Integration' },
];

export default function Explorer({ initialTab = 'enneagram', initialSel = null }) {
  const [tab, setTab] = useState(initialTab);
  const [sel, setSel] = useState(initialSel);

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <div style={{ background: 'rgba(80,200,120,0.06)', border: `1px solid rgba(80,200,120,0.2)`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#50c878' }}>↗</span>
                <p style={{ fontSize: 11, color: '#50c878' }}>Growth → Type {arrows.growth} · {ENN_TYPES[arrows.growth].name}</p>
              </div>
              <p style={{ ...S.body, fontSize: 13 }}>At their best, Type {n} moves toward Type {arrows.growth}'s qualities — oriented toward: {ENN_TYPES[arrows.growth].desire.toLowerCase()}.</p>
            </div>
            <div style={{ background: 'rgba(232,128,80,0.06)', border: `1px solid rgba(232,128,80,0.2)`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#e88050' }}>↘</span>
                <p style={{ fontSize: 11, color: '#e88050' }}>Stress → Type {arrows.stress} · {ENN_TYPES[arrows.stress].name}</p>
              </div>
              <p style={{ ...S.body, fontSize: 13 }}>Under stress, Type {n} regresses toward Type {arrows.stress}'s patterns — driven by the fear: {ENN_TYPES[arrows.stress].fear.toLowerCase()}.</p>
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
        {pairs.map(([key, val]) => {
          const [a, b] = key.split('-').map(s => s.toUpperCase());
          return (
            <div key={key} style={{ ...S.card, marginBottom: 12 }}>
              <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>{a} × {b}</p>
              <p style={{ fontSize: 12, color: '#6abf69', marginBottom: 4 }}>Bond — {val.bond}</p>
              <p style={{ fontSize: 12, color: '#e07878' }}>Tension — {val.tension}</p>
            </div>
          );
        })}
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
            const isDom = i === 0;
            const isInf = i === 3;
            return (
              <div key={fn} style={{ marginTop: i ? 16 : 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: G.textFaint, fontFamily: "'DM Mono',monospace", width: 28 }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                  <FnBadge fn={fn} size="md" />
                  <span style={{ fontSize: 13, color: G.textDim }}>{f.name}</span>
                </div>
                <p style={{ ...S.body, fontSize: 13, marginTop: 4, paddingLeft: 36 }}>{f.desc}</p>
                {isDom && (
                  <div style={{ marginTop: 6, paddingLeft: 36 }}>
                    <p style={{ fontSize: 11, color: '#50c878', marginBottom: 4 }}>Strengths</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {f.strengths.split(', ').map((s, si) => (
                        <span key={si} style={{ fontSize: 11, color: G.textDim, background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 6, padding: '2px 7px' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {isInf && (
                  <div style={{ marginTop: 6, paddingLeft: 36 }}>
                    <p style={{ fontSize: 11, color: '#e88050', marginBottom: 4 }}>Shadow — watch for under stress</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {f.shadow.split(', ').map((s, si) => (
                        <span key={si} style={{ fontSize: 11, color: G.textDim, background: 'rgba(232,128,80,0.08)', border: `1px solid rgba(232,128,80,0.2)`, borderRadius: 6, padding: '2px 7px' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={S.card}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>Cognitive Axes</h3>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>Each type's four functions form two interlocked axes. The dominant and inferior share a cognitive family (both Perceiving or both Judging); the auxiliary and tertiary form the other pair.</p>
          {[
            { label: 'Lead axis', fns: [t.stack[0], t.stack[3]], note: 'dominant ↔ blind spot' },
            { label: 'Support axis', fns: [t.stack[1], t.stack[2]], note: 'auxiliary ↔ tertiary' },
          ].map(({ label, fns, note }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 12px', background: G.bg3, borderRadius: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6 }}>{label} — {note}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FnBadge fn={fns[0]} />
                  <span style={{ fontSize: 12, color: G.textFaint }}>↔</span>
                  <FnBadge fn={fns[1]} />
                </div>
              </div>
            </div>
          ))}
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
  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>Explorer</h1>
        <p style={S.body}>Deep-dive into personality systems</p>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => { setTab(key); setSel(null); }} style={{ ...tab === key ? S.btn : S.btnOutline, padding: '8px 16px', fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Enneagram tab ── */}
      {tab === 'enneagram' && (
        <>
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ ...S.h3, marginBottom: 8 }}>The Enneagram</h3>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              The Enneagram describes nine distinct personality structures, each organized around a core fear and the strategies that develop in response to it. The nine types are grouped into three centers of intelligence — Gut (8, 9, 1), Heart (2, 3, 4), and Head (5, 6, 7) — reflecting whether a type's habitual reactivity runs through the body, emotion, or thinking.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              Where most personality frameworks describe stable traits, the Enneagram is fundamentally motivational: it maps the emotional terrain a person is working from, not just the behaviors visible from the outside. Two people can behave identically on the surface while being driven by entirely different fears — one craving control to avoid vulnerability (Type 8), the other doing the same to avoid being wrong (Type 1).
            </p>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              Each type also has a <strong style={{ color: G.text }}>wing</strong> — an adjacent type that shades its expression — and <strong style={{ color: G.text }}>movement lines</strong> to two other types, describing how the type shifts under stress and during growth. Select a type below to explore these dynamics.
            </p>
          </div>
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
        </>
      )}

      {/* ── MBTI tab ── */}
      {tab === 'mbti' && (
        <>
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ ...S.h3, marginBottom: 8 }}>Myers-Briggs Type Indicator</h3>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              The MBTI describes sixteen personality types based on four dimensions: Extraversion/Introversion (E/I), Sensing/Intuition (S/N), Thinking/Feeling (T/F), and Judging/Perceiving (J/P). Beneath these four letters lies a more nuanced structure: each type has a characteristic stack of four <strong style={{ color: G.text }}>cognitive functions</strong> — mental processes that govern how information is gathered and decisions are made.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              The dominant function shapes a person's central way of engaging with the world; the auxiliary supports it; the tertiary and inferior sit in the background, often emerging under stress. An INFJ leads with Introverted Intuition (deep, internal pattern recognition), supported by Extraverted Feeling (attunement to relational harmony). An ENTP leads with Extraverted Intuition (rapid idea generation and connection-making), backed by Introverted Thinking (internal logical frameworks).
            </p>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              Where the Enneagram maps emotional motivation, MBTI maps the cognitive style through which a person pursues any goal or manages any experience. Two people with the same Enneagram type can think and communicate very differently based on their cognitive stack. Select a type below to explore its function stack.
            </p>
          </div>
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
        </>
      )}

      {/* ── Instinct tab ── */}
      {tab === 'instinct' && (
        <>
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ ...S.h3, marginBottom: 8 }}>Instinctual Drives</h3>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              The three Instinctual Drives — Self-Preservation (SP), Sexual/One-to-One (SX), and Social (SO) — describe the biological survival priorities that shape how an Enneagram type expresses itself in practice. Every person carries all three drives, but they are ordered by priority. The dominant drive receives the most energy and attention; the repressed drive is often the source of blind spots.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 12 }}>
              Unlike the Enneagram's fear-based motivation, the drives are oriented toward approach: what you most naturally move toward and protect. An SP-dominant person is fundamentally organized around security, health, and stability — they tend to their resources before attending to other needs. An SX-dominant person is pulled toward intensity and deep one-to-one bonds, often feeling most alive in the magnetic field of powerful chemistry. An SO-dominant person is attuned to their position and role within groups, motivated by belonging, recognition, and contributing to something larger than themselves.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              The drive stack adds a crucial dimension to any Enneagram type. Two Type 2s can look entirely different depending on whether their dominant drive is SX (deeply focused, intense warmth for a chosen few) or SO (broadly giving, concerned with social contribution and collective harmony). Select a drive below to explore pairing dynamics.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {Object.entries(INSTINCT_META).map(([key, meta]) => (
              <button key={key} onClick={() => setSel(key)} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '16px 18px', textAlign: 'left' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: G.gold, fontWeight: 500, marginBottom: 6 }}>{key.toUpperCase()}</div>
                <p style={{ fontSize: 13, color: G.textDim, marginBottom: 2 }}>{meta.label}</p>
                <p style={{ fontSize: 12, color: G.textFaint, lineHeight: 1.5 }}>{meta.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Integration tab ── */}
      {tab === 'integration' && (
        <>
          <div style={{ ...S.cardGold, marginBottom: 16 }}>
            <h3 style={{ ...S.h3, marginBottom: 8 }}>Three Lenses, One Person</h3>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              No single personality system captures a complete human being. The Enneagram, MBTI, and Instinctual Drives each illuminate a different dimension of the self — and the richest picture emerges when all three are read together. Each system is doing something the others cannot: one maps emotion and reactivity, one maps cognition and strategy, one maps biological drive and approach motivation.
            </p>
          </div>

          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 16 }}>What Each System Describes</h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ ...S.tag, background: 'rgba(192,96,160,0.15)', color: '#c060a0', border: '1px solid rgba(192,96,160,0.3)', fontSize: 11 }}>Enneagram</span>
                <span style={{ fontSize: 12, color: G.textDim }}>Emotional core · Avoidance motivation</span>
              </div>
              <p style={{ ...S.body, lineHeight: 1.75 }}>
                The nine types describe the emotional structure of the personality — specifically, the core fear each person is organized around and the defensive patterns that form in response to it. A Type 4 fears being ordinary and without authentic selfhood. A Type 6 fears being without support or guidance. A Type 8 fears being controlled or betrayed. These fears are not chosen; they are the emotional atmosphere a person inhabits. The Enneagram tells us what someone is <em>moving away from</em> — the reactive, self-protective dimension of behavior that persists even when they're not aware of it.
              </p>
            </div>

            <div style={{ height: 1, background: G.border, marginBottom: 20 }} />

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ ...S.tag, background: 'rgba(80,144,208,0.15)', color: '#5090d0', border: '1px solid rgba(80,144,208,0.3)', fontSize: 11 }}>MBTI</span>
                <span style={{ fontSize: 12, color: G.textDim }}>Cognitive architecture · Strategy</span>
              </div>
              <p style={{ ...S.body, lineHeight: 1.75 }}>
                Myers-Briggs maps the mind's operating system — how a person naturally perceives information and makes decisions. An Introverted Intuitive builds internal maps of meaning and pattern before engaging outwardly. An Extraverted Thinker organizes the external world through logic and structure. These cognitive preferences are largely independent of what a person is emotionally trying to do; they describe <em>how</em> someone processes experience, not why. MBTI acts as the strategic layer of personality: the architecture through which someone pursues any goal and manages any emotional terrain. Two people with identical Enneagram types can think and communicate in radically different ways depending on their cognitive stack.
              </p>
            </div>

            <div style={{ height: 1, background: G.border, marginBottom: 20 }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ ...S.tag, background: 'rgba(48,168,136,0.15)', color: '#30a888', border: '1px solid rgba(48,168,136,0.3)', fontSize: 11 }}>Instinct</span>
                <span style={{ fontSize: 12, color: G.textDim }}>Biological drive · Approach motivation</span>
              </div>
              <p style={{ ...S.body, lineHeight: 1.75 }}>
                The Instinctual Drives describe the survival agenda each person is most organized around — not through fear, but through magnetism. Where the Enneagram maps what you run from, the drives map what you run toward. SP-dominant people are naturally oriented toward security, health, and resource management; they attend to their material footing before anything else. SX-dominant people are drawn toward intensity and transformative connection; they feel most alive at the edge of deep bonds and powerful chemistry. SO-dominant people are wired for group belonging and social contribution; status, recognition, and collective identity carry real weight. The drives powerfully shape how an Enneagram type expresses itself in daily life, often accounting for why two people of the same type can seem so different.
              </p>
            </div>
          </div>

          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>How the Systems Interact</h3>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              Consider two people who are both Social Sixes. Both are anxiety-aware, responsibility-minded, and oriented toward community. But one is an INFP — private, values-driven, expressing their Six-ness through quiet loyalty and a deeply held internal moral code — while the other is an ENFJ — warm, charismatic, channeling the same Six energy into leadership and group cohesion. The underlying fear of being without support is the same; the expression is shaped entirely by the cognitive layer.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              Or take two INFJs: both are pattern-seeking, empathic, and future-oriented in their thinking. But one is a Type 4, motivated by the fear of being ordinary, always seeking depth and authenticity in experience. The other is a Type 2, motivated by the fear of being unloved, organizing their empathy around helping and giving. The cognitive style is the same; the emotional engine underneath is completely different.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              The drives add a third layer of nuance. An extraverted Social-dominant person actively gathers people around them, initiates events, builds networks. An introverted Social-dominant person carries the same need for belonging and contribution — equally strong — but prefers to be sought out, to occupy a meaningful role within groups rather than leading the charge into them. The drive is identical; the expression is filtered through the E/I axis.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              Similarly, a Type 2 with SX dominant channels warmth and care intensely into a small circle of chosen people — the bond with each matters deeply, almost magnetically. A Type 2 with SO dominant diffuses that same warmth across their entire social world — they want to be there for everyone, to be the person people turn to. Both are Twos, both are giving — but the texture of the giving is entirely different.
            </p>
          </div>

          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Why Single Systems Mislead</h3>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              When personality systems are used in isolation, they tend to absorb characteristics that actually belong to a different layer. The Enneagram gets stretched to explain cognitive tendencies it wasn't designed to capture. MBTI gets stretched to explain emotional motivations it can't account for.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              Type Fives, for example, are often described as analytical and prone to tracing everything back to first principles — but this is not the Enneagram doing the work. That depth of analysis is the signature of Introverted Thinking, an MBTI cognitive function. Many Fives happen to be Introverted Thinking types, so the correlation feels clean — but a Five who leads with Introverted Feeling will look and think quite differently, and will be misread if that distinction isn't made.
            </p>
            <p style={{ ...S.body, lineHeight: 1.75, marginBottom: 16 }}>
              Common confusions that arise from using systems separately include: a Type 9 with dominant Introverted Feeling being misidentified as a Type 4 (the aesthetic depth and emotional richness come from the Fi function, not the type); someone with a powerful Social instinct being assumed to be an Extraverted Feeling type (the attunement to others is drive-based, not function-based); the Seven's idea-generating energy being conflated with Extraverted Intuition (the Seven seeks stimulation to avoid pain — Ne users are just naturally wired toward possibility, regardless of what they fear).
            </p>
            <p style={{ ...S.body, lineHeight: 1.75 }}>
              Used together, the three systems resolve these ambiguities. A full profile — Enneagram type, MBTI type, and instinct stack — offers a description precise enough to account for individuals, not just categories.
            </p>
          </div>

          <p style={{ fontSize: 11, color: G.textFaint, textAlign: 'center', marginTop: 24, marginBottom: 8, lineHeight: 1.7 }}>
            The framework for integrating these three systems draws on ideas developed by Saleh Vallander in{' '}
            <em>The Enneagram, the Myers-Briggs, and the Brain</em>.
          </p>
        </>
      )}
    </div></div>
  );
}
