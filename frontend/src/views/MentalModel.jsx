import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { ENN_TYPES, ENN_CENTER, ENN_ARROWS, ENN_HARMONIC, WING_DESC, INSTINCT_COMPAT } from '../data/enneagram.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { SOP_STEPS, QUADRANTS } from '../data/sop.js';
import FnBadge from '../components/FnBadge.jsx';
import { computeArchetypeName } from '../utils/archetype.js';
import { COMBINATION_PROFILES } from '../data/combinationProfiles.js';
import { INTEGRATION_NARRATIVES } from '../data/integrationNarratives.js';

function readLS(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }

const CENTER_COLOR = { gut: '#e07040', heart: '#c060a0', head: '#5090d0' };
const INSTINCT_META = {
  sp: {
    label: 'Self-Preservation',
    desc: 'Focused on physical security, health, comfort, and resource management. SP-dominant individuals are tuned into personal well-being, stability, and concrete needs. They tend to be practical, grounded, and careful about their environment.',
    dominant: 'Primary driver: ensuring safety, health, and material stability. This shapes nearly every decision — relationships, career, and daily habits are filtered through the lens of personal security.',
    secondary: 'A significant support drive: SP concerns influence choices, but intensity and social connection also play a meaningful role.',
    repressed: 'Blind spot: personal needs and self-care are often neglected in favor of other drives. May push physical limits or ignore warning signs.',
  },
  sx: {
    label: 'Sexual / One-to-One',
    desc: 'Drawn to intensity, depth, and transformative one-on-one connection. SX-dominant individuals crave electric, all-in experiences — in relationships, work, ideas, and creative pursuits. They tend toward obsession and magnetism.',
    dominant: 'Primary driver: seeking intensity and deep connection. This person is drawn to experiences and relationships that feel alive, electric, and transformative — anything less can feel hollow.',
    secondary: 'A significant support drive: SX energy adds depth and chemistry to connections, but security or social belonging also plays a meaningful role.',
    repressed: 'Blind spot: one-on-one intimacy and intensity may be unconsciously avoided or undervalued. Deeper bonds may be harder to form than the person realizes.',
  },
  so: {
    label: 'Social',
    desc: 'Attuned to group dynamics, belonging, social roles, and contribution to something larger. SO-dominant individuals are oriented toward community, hierarchy, and their place within the group. They often act with awareness of how they are perceived.',
    dominant: 'Primary driver: belonging, contribution, and social awareness. This person filters experience through the group — their role, standing, and impact on others are constant background concerns.',
    secondary: 'A significant support drive: social awareness and contribution matter, but personal security or one-on-one chemistry are also significant.',
    repressed: 'Blind spot: social connection and group dynamics may be undervalued. This person may unintentionally neglect community ties or appear disconnected from social context.',
  },
};

const MODEL_TABS = [
  { key: 'mbti', label: 'MBTI' },
  { key: 'enneagram', label: 'Enneagram' },
  { key: 'instinct', label: 'Instinct Stack' },
  { key: 'combined', label: 'Combined' },
];

export default function MentalModel({ setView = () => {}, initialTab = 'mbti' }) {
  const [tab, setTab] = useState(initialTab);
  const [selType, setSelType] = useState(null);
  const [selEnn, setSelEnn] = useState(null);
  const [showSOP, setShowSOP] = useState(false);

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  const TabBar = () => (
    <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: G.bg3, borderRadius: 10, padding: 4 }}>
      {MODEL_TABS.map(t => (
        <button key={t.key} onClick={() => { setTab(t.key); setSelType(null); setSelEnn(null); }}
          style={{ flex: 1, padding: '8px 4px', borderRadius: 7, fontSize: 12, fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? G.bg2 : 'transparent',
            color: tab === t.key ? G.gold : G.textDim,
            border: tab === t.key ? `1px solid ${G.goldBorder}` : '1px solid transparent' }}>
          {t.label}
        </button>
      ))}
    </div>
  );

  // ── MBTI type detail ──────────────────────────────────────────────────────────
  if (tab === 'mbti' && selType) {
    const t = MBTI_TYPES[selType];
    return (
      <div style={S.page}><div style={S.container}>
        <TabBar />
        <button onClick={() => setSelType(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ ...S.h1, fontSize: 'clamp(28px,9vw,40px)', letterSpacing: 'clamp(2px,2vw,8px)', marginBottom: 4 }}>{selType}</h1>
          <h2 style={S.h2}>{t.name}</h2>
        </div>
        <div style={S.cardGold}><p style={S.body}>{t.desc}</p></div>
        <div style={S.card}>
          <h3 style={S.h3}>Cognitive Stack</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {t.stack.map((fn, i) => (
              <div key={fn} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 10, color: G.textFaint, display: 'block', marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                <FnBadge fn={fn} size="md" />
              </div>
            ))}
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
      </div></div>
    );
  }

  // ── Enneagram type detail ─────────────────────────────────────────────────────
  if (tab === 'enneagram' && selEnn !== null) {
    const n = selEnn;
    const t = ENN_TYPES[n];
    const arrows = ENN_ARROWS[n];
    const center = ENN_CENTER[n];
    const wingA = n === 1 ? 9 : n - 1;
    const wingB = n === 9 ? 1 : n + 1;
    return (
      <div style={S.page}><div style={S.container}>
        <TabBar />
        <button onClick={() => setSelEnn(null)} style={{ ...S.btnOutline, marginBottom: 16, padding: '8px 14px', fontSize: 13 }}>← Back</button>
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
          <div style={{ marginTop: 8 }}>
            <div style={{ marginBottom: 12 }}>
              <p style={{ ...S.mono, fontSize: 13, color: G.gold, marginBottom: 4 }}>{n}w{wingA}</p>
              <p style={S.body}>{WING_DESC[`${n}w${wingA}`]}</p>
            </div>
            <div style={S.divider} />
            <div style={{ marginTop: 12 }}>
              <p style={{ ...S.mono, fontSize: 13, color: G.gold, marginBottom: 4 }}>{n}w{wingB}</p>
              <p style={S.body}>{WING_DESC[`${n}w${wingB}`]}</p>
            </div>
          </div>
        </div>
      </div></div>
    );
  }

  // ── Main layout with tab content ──────────────────────────────────────────────
  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>Mental Model</h1>
        <p style={S.body}>Explore all three personality systems</p>
      </div>
      <TabBar />

      {/* ── MBTI Tab ── */}
      {tab === 'mbti' && (
        <>
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
        </>
      )}

      {/* ── Enneagram Tab ── */}
      {tab === 'enneagram' && (
        <>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 16 }}>Select a type to explore its description, core fear and desire, movement lines, and wing variations.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => {
              const center = ENN_CENTER[n];
              const color = CENTER_COLOR[center];
              return (
                <button key={n} onClick={() => setSelEnn(n)}
                  style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 10, padding: '14px 8px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ ...S.mono, fontSize: 20, color, marginBottom: 4 }}>{n}</div>
                  <div style={{ fontSize: 11, color: G.textDim, lineHeight: 1.3 }}>{ENN_TYPES[n].name.replace('The ', '')}</div>
                </button>
              );
            })}
          </div>
          <div style={{ ...S.card, padding: '12px 16px' }}>
            <h3 style={{ ...S.h3, marginBottom: 8 }}>Centers of Intelligence</h3>
            {[['gut', 'Gut (Instinctive)', '1, 8, 9 — driven by anger, body-based knowing, and autonomy.'],
              ['heart', 'Heart (Feeling)', '2, 3, 4 — driven by shame, relational awareness, and identity.'],
              ['head', 'Head (Thinking)', '5, 6, 7 — driven by fear, mental frameworks, and future planning.']].map(([key, label, desc]) => (
              <div key={key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: CENTER_COLOR[key], flexShrink: 0, marginTop: 4 }} />
                <div>
                  <p style={{ fontSize: 13, color: G.text, fontWeight: 500, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12, color: G.textDim }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Instinct Stack Tab ── */}
      {tab === 'instinct' && (
        <>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 16 }}>The three instinctual drives are ranked in a stack — your dominant drive shapes most of your behavior, your secondary supports it, and your repressed drive is your blind spot.</p>
          {['sp', 'sx', 'so'].map(inst => {
            const m = INSTINCT_META[inst];
            return (
              <div key={inst} style={S.card}>
                <h3 style={{ ...S.h3, marginBottom: 4 }}>{inst.toUpperCase()} — {m.label}</h3>
                <p style={{ ...S.body, marginBottom: 14 }}>{m.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['Dominant', m.dominant], ['Secondary', m.secondary], ['Repressed', m.repressed]].map(([role, text]) => (
                    <div key={role} style={{ background: G.bg3, borderRadius: 8, padding: '10px 12px' }}>
                      <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>{role}</p>
                      <p style={{ fontSize: 13, color: G.textDim, lineHeight: 1.5 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Stack Compatibility</h3>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 14 }}>How dominant instincts interact when two people's stacks meet:</p>
            {Object.entries(INSTINCT_COMPAT).map(([pair, data]) => {
              const [a, b] = pair.split('-');
              return (
                <div key={pair} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
                  <p style={{ ...S.mono, fontSize: 13, color: G.gold, marginBottom: 6 }}>{a.toUpperCase()} + {b.toUpperCase()}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ background: 'rgba(100,200,100,0.06)', borderRadius: 7, padding: '8px 12px', border: '1px solid rgba(100,200,100,0.15)' }}>
                      <p style={{ fontSize: 11, color: 'rgba(100,200,100,0.8)', marginBottom: 2 }}>Bond</p>
                      <p style={{ fontSize: 13, color: G.textDim }}>{data.bond}</p>
                    </div>
                    <div style={{ background: 'rgba(232,160,80,0.06)', borderRadius: 7, padding: '8px 12px', border: '1px solid rgba(232,160,80,0.15)' }}>
                      <p style={{ fontSize: 11, color: 'rgba(232,160,80,0.8)', marginBottom: 2 }}>Tension</p>
                      <p style={{ fontSize: 13, color: G.textDim }}>{data.tension}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Combined Tab ── */}
      {tab === 'combined' && <CombinedView setView={setView} />}

    </div></div>
  );
}

function CombinedView({ setView }) {
  const enn = readLS('typer_enn');
  const mbti = readLS('typer_mbti');
  const inst = readLS('typer_inst');

  const doneCount = [enn, mbti, inst].filter(Boolean).length;

  if (doneCount === 0) {
    return (
      <div style={{ ...S.cardGold, textAlign: 'center', padding: '32px 24px' }}>
        <h3 style={{ ...S.h3, marginBottom: 12 }}>Your Combined Profile</h3>
        <p style={{ ...S.body, marginBottom: 20 }}>Complete all three assessments — Enneagram, MBTI, and Instinct Stack — to unlock your integrated personality summary.</p>
        <button onClick={() => setView('typer')} style={S.btn}>Start Assessments →</button>
      </div>
    );
  }

  if (doneCount < 3) {
    const missing = [];
    if (!enn) missing.push('Enneagram');
    if (!mbti) missing.push('MBTI');
    if (!inst) missing.push('Instinct Stack');
    return (
      <div style={S.card}>
        <h3 style={{ ...S.h3, marginBottom: 12 }}>Your Combined Profile</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {enn && <span style={{ ...S.tag, background: 'rgba(100,200,100,0.1)', color: 'rgba(100,200,100,0.9)', border: '1px solid rgba(100,200,100,0.2)' }}>✓ {enn.display}</span>}
          {mbti && <span style={{ ...S.tag, background: 'rgba(100,200,100,0.1)', color: 'rgba(100,200,100,0.9)', border: '1px solid rgba(100,200,100,0.2)' }}>✓ {mbti.result}</span>}
          {inst && <span style={{ ...S.tag, background: 'rgba(100,200,100,0.1)', color: 'rgba(100,200,100,0.9)', border: '1px solid rgba(100,200,100,0.2)' }}>✓ {inst.instinctStack.map(i => i.toUpperCase()).join('/')}</span>}
        </div>
        <p style={{ ...S.body, marginBottom: 20 }}>
          Complete <strong style={{ color: G.text }}>{missing.join(' and ')}</strong> to unlock your full combined profile.
        </p>
        <button onClick={() => setView('typer')} style={S.btn}>Continue Assessments →</button>
      </div>
    );
  }

  // All 3 complete
  const coreType = enn.coreType;
  const mbtiResult = mbti.result;
  const dominantInst = inst.instinctStack[0];
  const archetypeName = computeArchetypeName(coreType, mbtiResult, dominantInst);
  const mbtiType = MBTI_TYPES[mbtiResult];
  const ennType = ENN_TYPES[coreType];
  const instStack = inst.instinctStack;

  // COMBINATION_PROFILES lookup
  const instKey = instStack.map(i => i.toUpperCase()).join('');
  const combKey = `${coreType}w${enn.wing}_${mbtiResult}_${instKey}`;
  const combo = COMBINATION_PROFILES[combKey] ?? null;
  const narrative = INTEGRATION_NARRATIVES[`${coreType}_${mbtiResult}`] ?? null;

  // Derived data for rich sections
  const mbtiStack = mbtiType?.stack || [];
  const domFnKey = mbtiStack[0];
  const auxFnKey = mbtiStack[1];
  const infFnKey = mbtiStack[3];
  const domFn = COG_FUNCTIONS[domFnKey] || {};
  const infFn = COG_FUNCTIONS[infFnKey] || {};
  const center = ENN_CENTER[coreType];
  const harmonic = ENN_HARMONIC[coreType];
  const growth = ENN_ARROWS[coreType]?.growth;
  const stress = ENN_ARROWS[coreType]?.stress;
  const isE = mbtiResult[0] === 'E';
  const domChar = domFnKey ? domFnKey[0] : '';

  // Check MBTI-Enneagram correlation alignment
  const corrTypes = mbtiType?.ennCorr?.split(', ').map(Number) || [];
  const isAligned = corrTypes.includes(coreType);

  const strengths = combo?.strengths?.length
    ? combo.strengths
    : [
        ...(domFn.strengths ? domFn.strengths.split(',').slice(0, 3).map(s => s.trim()) : []),
        `Motivated by: ${ennType?.desire?.toLowerCase()}`,
      ];

  const challenges = combo?.growthEdges?.length
    ? combo.growthEdges
    : [
        ...(infFn.shadow ? infFn.shadow.split(',').slice(0, 2).map(s => s.trim()) : []),
        `Core anxiety: ${ennType?.fear?.toLowerCase()}`,
        stress ? `Under stress: drawn toward Type ${stress} (${ENN_TYPES[stress]?.name}) patterns` : null,
      ].filter(Boolean);

  const centerInteraction = (() => {
    if (center === 'heart' && domChar === 'F') return 'Heart center + Feeling-dominant processing: emotional intelligence and identity awareness are your superpower — and your most tender vulnerability.';
    if (center === 'heart' && domChar === 'T') return 'Cross-system tension: Heart center (identity-focused) + Thinking-dominant processing — you may use logic as a buffer for deeper identity concerns, or analyze your way through emotional situations.';
    if (center === 'heart' && domChar === 'N') return 'Heart center + Intuition-dominant processing: you perceive meaning and identity through pattern and vision — a creatively rich but sometimes destabilizing combination.';
    if (center === 'head' && domChar === 'N') return 'Head center + Intuition-dominant processing: pattern recognition and strategic foresight are natural strengths, though anxious thought-spirals are an occupational hazard.';
    if (center === 'head' && domChar === 'T') return 'Head center + Thinking-dominant processing: analytical precision and strategic clarity are your strengths, but anxiety can manifest as hyper-analysis and decision paralysis.';
    if (center === 'head' && domChar === 'F') return 'Cross-system tension: Head center (fear-oriented) + Feeling-dominant processing — interpersonal warmth and fear-based vigilance create a complex, caring-but-anxious combination.';
    if (center === 'gut' && domChar === 'S') return 'Gut center + Sensing-dominant processing: grounded, present, and action-oriented — you trust what you can see, touch, and do.';
    if (center === 'gut' && domChar === 'N') return 'Gut center (instinct and action) + Intuition-dominant processing: you see big-picture patterns and are driven to act on them — the gap between vision and execution can create friction.';
    if (center === 'gut' && domChar === 'T') return 'Gut center + Thinking-dominant processing: decisive, systematic, and action-ready — you act from instinct and back it with logic.';
    if (center === 'gut' && domChar === 'F') return 'Gut center (body-based instinct) + Feeling-dominant processing: deep empathy combined with gut-level reactions — a powerful advocate, but prone to reactivity under pressure.';
    return null;
  })();

  const harmonicNote = harmonic === 'competency'
    ? 'You navigate conflict through competence and logic — focusing on what is correct and well-executed rather than what feels right.'
    : harmonic === 'reactive'
      ? 'You navigate conflict reactively — expressing your inner state directly and expecting emotional honesty in return, which can feel intense to those with different conflict styles.'
      : 'You navigate conflict through positive reframing — seeking silver linings or sidestepping tension to preserve harmony and connection.';

  const instMbtiNote = (() => {
    if (dominantInst === 'so' && isE) return 'Social-dominant drive + Extraverted processing: unusually strong group attunement — you naturally read and shape the room.';
    if (dominantInst === 'so' && !isE) return 'Social-dominant drive with Introverted processing: you care deeply about group belonging while needing solitude to recharge — a quietly observant social navigator.';
    if (dominantInst === 'sx' && isE) return 'Sexual/One-to-One dominant + Extraverted energy: magnetic intensity — you bring full presence to connections and light up in meaningful engagement.';
    if (dominantInst === 'sx' && !isE) return 'Sexual/One-to-One dominant + Introverted processing: deeply selective and intense in close bonds, private by default — few connections, but transformative ones.';
    if (dominantInst === 'sp' && isE) return 'Self-Preservation dominant + Extraverted energy: you engage the world actively while always keeping one eye on personal stability and resource management.';
    if (dominantInst === 'sp' && !isE) return 'Self-Preservation dominant + Introverted processing: deeply self-sufficient and resource-conscious — you build a secure inner world before venturing out.';
    return null;
  })();

  // Instinct coloring prose
  const INST_COLORING = {
    sp: 'a grounded, security-conscious lens — channeling both MBTI and Enneagram traits through practical concerns, material stability, and careful self-preservation.',
    sx: 'an intense, one-on-one lens — bringing passionate depth, magnetic focus, and a hunger for transformative experiences to every expression of this type combination.',
    so: 'a community-aware lens — expressing these traits through social consciousness, group participation, and a desire to contribute to something larger than oneself.',
  };

  const sectionStyle = { marginTop: 16, paddingTop: 16, borderTop: `1px solid ${G.goldBorder}` };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: G.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 };
  const itemStyle = { fontSize: 13, color: G.textDim, marginBottom: 4, lineHeight: 1.5 };

  return (
    <>
      <div style={{ ...S.cardGold, textAlign: 'center', padding: '28px 20px', marginBottom: 16 }}>
        {archetypeName && (
          <p style={{ fontSize: 13, color: G.gold, marginBottom: 8, fontFamily: "'DM Mono',monospace", letterSpacing: 2, textTransform: 'uppercase' }}>Your Archetype</p>
        )}
        {archetypeName && (
          <h1 style={{ ...S.h1, fontSize: 'clamp(20px,6vw,30px)', letterSpacing: 1, marginBottom: 16 }}>{archetypeName}</h1>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ ...S.tag, fontSize: 14, padding: '6px 14px' }}>{enn.display}</span>
          <span style={{ ...S.tag, fontSize: 14, padding: '6px 14px' }}>{mbtiResult}</span>
          <span style={{ ...S.tag, fontSize: 14, padding: '6px 14px' }}>{instStack.map(i => i.toUpperCase()).join('/')}</span>
        </div>
      </div>

      {/* Who You Are — portrait from COMBINATION_PROFILES */}
      {combo?.portrait && (
        <div style={S.card}>
          <h3 style={S.h3}>Who You Are</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{combo.portrait}</p>
        </div>
      )}

      {/* Wing */}
      {WING_DESC[enn.display] && (
        <div style={S.card}>
          <h3 style={S.h3}>Wing — {enn.display}</h3>
          <p style={{ ...S.body, marginTop: 8 }}>{WING_DESC[enn.display]}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <p style={labelStyle}>Core Fear</p>
              <p style={itemStyle}>{ennType?.fear}</p>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <p style={labelStyle}>Core Desire</p>
              <p style={itemStyle}>{ennType?.desire}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cognitive Stack */}
      <div style={S.card}>
        <h3 style={S.h3}>Cognitive Stack — {mbtiResult}</h3>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {mbtiStack.map((fn, i) => (
            <div key={fn} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 10, color: G.textFaint, display: 'block', marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
              <FnBadge fn={fn} size="md" />
            </div>
          ))}
        </div>
        {domFn.desc && <p style={{ ...S.body, marginTop: 10 }}>{domFn.desc}</p>}
      </div>

      {/* Enneagram + MBTI correlation */}
      <div style={S.card}>
        <h3 style={S.h3}>Enneagram + MBTI</h3>
        <div style={{ marginTop: 10 }}>
          <p style={S.body}>
            As a <strong style={{ color: G.text }}>{mbtiResult} ({mbtiType?.name})</strong> with an Enneagram core of <strong style={{ color: G.text }}>Type {coreType} ({ennType?.name})</strong>:
          </p>
          {isAligned ? (
            <p style={{ ...S.body, marginTop: 10 }}>
              This is a <strong style={{ color: G.gold }}>high-correlation pairing</strong> — Type {coreType} frequently appears in {mbtiResult} profiles. Your Enneagram core amplifies the characteristic motivations of your MBTI type: {ennType?.desire?.toLowerCase()} aligns with the natural drive of {mbtiResult} cognitive processing.
            </p>
          ) : (
            <p style={{ ...S.body, marginTop: 10 }}>
              This is a <strong style={{ color: G.gold }}>cross-typical pairing</strong> — Type {coreType} is less commonly reported in {mbtiResult} profiles (common correlations: Types {mbtiType?.ennCorr}). This combination often produces a distinctive tension: the Enneagram's core drive of <em>{ennType?.desire?.toLowerCase()}</em> can cut against or add unexpected depth to the typical {mbtiResult} expression.
            </p>
          )}
        </div>
      </div>

      {/* Instinct Coloring */}
      <div style={S.card}>
        <h3 style={S.h3}>Instinct Coloring</h3>
        <p style={{ ...S.body, marginTop: 10 }}>
          The <strong style={{ color: G.text }}>{dominantInst.toUpperCase()} ({INSTINCT_META[dominantInst]?.label})</strong> instinct as your dominant drive means this type combination expresses through {INST_COLORING[dominantInst]}
        </p>
        {instStack[2] && (
          <p style={{ ...S.body, marginTop: 10, color: G.textDim }}>
            Your repressed instinct — <strong style={{ color: G.textDim }}>{instStack[2].toUpperCase()} ({INSTINCT_META[instStack[2]]?.label})</strong> — is the area where this profile's blind spots tend to appear. Growth often comes from developing awareness in this domain.
          </p>
        )}
      </div>

      {/* Strengths & Challenges */}
      <div style={S.card}>
        <h3 style={S.h3}>Strengths</h3>
        <div style={{ marginTop: 8 }}>
          {strengths.map((s, i) => <p key={i} style={itemStyle}>· {s}</p>)}
        </div>
        <div style={sectionStyle}>
          <p style={labelStyle}>Growth Edges</p>
          {challenges.map((c, i) => <p key={i} style={itemStyle}>· {c}</p>)}
        </div>
      </div>

      {/* In Relationships / At Work / Under Stress / Growth Path */}
      {combo?.inRelationships && (
        <div style={S.card}>
          <h3 style={S.h3}>In Relationships</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{combo.inRelationships}</p>
        </div>
      )}
      {combo?.atWork && (
        <div style={S.card}>
          <h3 style={S.h3}>At Work</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{combo.atWork}</p>
        </div>
      )}
      {combo?.stressBehavior && (
        <div style={S.card}>
          <h3 style={S.h3}>Under Stress</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{combo.stressBehavior}</p>
        </div>
      )}
      {combo?.growthPath && (
        <div style={S.card}>
          <h3 style={S.h3}>Growth Path</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{combo.growthPath}</p>
          {combo.notes?.map((note, i) => (
            <p key={i} style={{ ...S.body, fontSize: 12, color: G.textFaint, fontStyle: 'italic', marginTop: 8 }}>{note}</p>
          ))}
        </div>
      )}

      {/* Integration Narrative */}
      {narrative && (
        <div style={S.card}>
          <h3 style={S.h3}>{narrative.title}</h3>
          <p style={{ ...S.body, marginTop: 8, lineHeight: 1.75 }}>{narrative.narrative}</p>
          {narrative.typingNotes && (
            <p style={{ ...S.body, fontSize: 12, color: G.textFaint, fontStyle: 'italic', marginTop: 10 }}>Typing notes: {narrative.typingNotes}</p>
          )}
        </div>
      )}

      {/* System Interactions */}
      <div style={S.card}>
        <h3 style={S.h3}>System Interactions</h3>
        <div style={{ marginTop: 8 }}>
          {centerInteraction && <p style={itemStyle}>· {centerInteraction}</p>}
          {instMbtiNote && <p style={{ ...itemStyle, marginTop: 6 }}>· {instMbtiNote}</p>}
          <p style={{ ...itemStyle, marginTop: 6 }}>· Conflict style: {harmonicNote}</p>
        </div>
      </div>

      {/* Growth Edge */}
      <div style={S.card}>
        <h3 style={S.h3}>Growth Edge</h3>
        <div style={{ marginTop: 8 }}>
          {growth && <p style={itemStyle}>· Working toward Type {growth} qualities — {ENN_TYPES[growth]?.name}</p>}
          {auxFnKey && <p style={{ ...itemStyle, marginTop: 6 }}>· Developing your {auxFnKey} ({COG_FUNCTIONS[auxFnKey]?.name}) supports this direction</p>}
          {stress && <p style={{ ...itemStyle, marginTop: 6, color: G.textFaint }}>· Under stress, Type {stress} ({ENN_TYPES[stress]?.name}) patterns emerge — notice and return to center</p>}
        </div>
      </div>

      <button onClick={() => setView('typer')} style={{ ...S.btnOutline, width: '100%', marginTop: 8 }}>
        ← Back to My Tests
      </button>
    </>
  );
}
