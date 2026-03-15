import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { ENN_TYPES, ENN_CENTER, ENN_ARROWS, WING_DESC, INSTINCT_COMPAT } from '../data/enneagram.js';
import FnBadge from '../components/FnBadge.jsx';
import { SUBTYPES } from '../data/subtypes.js';
import { LEVELS } from '../data/levels.js';
import { TYPE_INTERACTION_GRID } from '../data/typeInteractionGrid.js';
import { MBTI_DEVELOPMENT } from '../data/mbtiDevelopment.js';
import { MBTI_STRESS_FLOW } from '../data/mbtiStressFlow.js';
import { MBTI_FUNCTION_DETAILS } from '../data/mbtiDetails.js';
import { INSTINCT_STACK_PROFILES } from '../data/instinctStackProfiles.js';
import { INSTINCT_PAIR_DYNAMICS, instinctPairKey } from '../data/instinctPairDynamics.js';
import { ENN_MBTI_CORRELATION } from '../data/ennMbtiCorrelation.js';
import { INTEGRATION_NARRATIVES } from '../data/integrationNarratives.js';

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
  { key: 'profiles', label: 'Profiles' },
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

        {/* Subtypes */}
        {['SP', 'SX', 'SO'].some(i => SUBTYPES[`${n}_${i}`]) && (
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Instinct Subtypes</h3>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 14, color: G.textFaint }}>Every Enneagram type expresses differently depending on the dominant instinctual drive. These subtypes often look like different types entirely.</p>
            {['SP', 'SX', 'SO'].map(inst => {
              const sub = SUBTYPES[`${n}_${inst}`];
              if (!sub) return null;
              return (
                <div key={inst} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ ...S.tag, background: G.goldDim, color: G.gold }}>{inst}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: G.text }}>{sub.name}</span>
                    {sub.nickname && <span style={{ fontSize: 11, color: G.textFaint, fontStyle: 'italic' }}>{sub.nickname}</span>}
                  </div>
                  <p style={{ ...S.body, fontSize: 13, marginBottom: 8 }}>{sub.description}</p>
                  {sub.keyTraits && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                      {sub.keyTraits.map((t, i) => <span key={i} style={{ fontSize: 11, color: G.textDim, background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 6, padding: '2px 8px' }}>{t}</span>)}
                    </div>
                  )}
                  {sub.blindSpot && <p style={{ ...S.body, fontSize: 12, color: '#e88050', marginBottom: 4 }}>Blind spot: {sub.blindSpot}</p>}
                  {sub.growthPath && <p style={{ ...S.body, fontSize: 12, color: '#50c878' }}>Growth: {sub.growthPath}</p>}
                </div>
              );
            })}
          </div>
        )}

        {/* Levels of Development */}
        {LEVELS[n] && (
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Levels of Development</h3>
            {[
              { key: 'healthy', color: '#50c878', label: 'Healthy (Levels 1–3)' },
              { key: 'average', color: G.gold, label: 'Average (Levels 4–6)' },
              { key: 'unhealthy', color: '#e88050', label: 'Unhealthy (Levels 7–9)' },
            ].map(({ key, color, label }) => {
              const level = LEVELS[n][key];
              if (!level) return null;
              return (
                <div key={key} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color, fontFamily: "'DM Mono',monospace" }}>{label}</span>
                    {level.title && <span style={{ fontSize: 13, fontWeight: 500, color: G.text }}>— {level.title}</span>}
                  </div>
                  <p style={{ ...S.body, fontSize: 13, marginBottom: 6, paddingLeft: 16 }}>{level.description}</p>
                  {level.behaviors && (
                    <div style={{ paddingLeft: 16 }}>
                      {level.behaviors.map((b, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                          <span style={{ color, fontSize: 11, flexShrink: 0, marginTop: 3 }}>·</span>
                          <p style={{ ...S.body, fontSize: 12 }}>{b}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Type Interaction Quick Reference */}
        <div style={S.card}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>Type {n} With Every Other Type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5,6,7,8,9].filter(x => x !== n).map(other => {
              const key = [n, other].sort().join('_');
              const entry = TYPE_INTERACTION_GRID[key];
              if (!entry) return null;
              return (
                <div key={other} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: G.bg3, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{entry.emoji || '◆'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ ...S.mono, fontSize: 12 }}>Type {n} × {other}</span>
                      <span style={{ fontSize: 12, color: G.gold }}>{entry.label}</span>
                    </div>
                    <p style={{ ...S.body, fontSize: 12 }}>{entry.quickTake}</p>
                  </div>
                </div>
              );
            })}
          </div>
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

        {/* Stack Profiles for this dominant instinct */}
        {(() => {
          const domKey = sel.toUpperCase();
          const dominantStacks = Object.keys(INSTINCT_STACK_PROFILES).filter(k => k.startsWith(domKey + '/'));
          if (!dominantStacks.length) return null;
          return (
            <div style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: 12 }}>{domKey}-Dominant Stack Profiles</h3>
              <p style={{ ...S.body, fontSize: 13, marginBottom: 14, color: G.textFaint }}>
                The dominant drive appears in two stack orderings, depending on which secondary drive follows. Each creates a distinct expression of the same core energy.
              </p>
              {dominantStacks.map(stackKey => {
                const profile = INSTINCT_STACK_PROFILES[stackKey];
                if (!profile) return null;
                return (
                  <div key={stackKey} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${G.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ ...S.mono, fontSize: 14, color: G.gold }}>{stackKey}</span>
                      {profile.name && <span style={{ fontSize: 12, color: G.textDim, fontStyle: 'italic' }}>{profile.name}</span>}
                    </div>
                    {profile.coreMotivation && <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}><strong style={{ color: G.text }}>Motivation:</strong> {profile.coreMotivation}</p>}
                    {profile.worldview && <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}><strong style={{ color: G.text }}>Worldview:</strong> {profile.worldview}</p>}
                    {profile.inRelationships && <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}><strong style={{ color: G.text }}>In relationships:</strong> {profile.inRelationships}</p>}
                    {profile.atWork && <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}><strong style={{ color: G.text }}>At work:</strong> {profile.atWork}</p>}
                    {profile.blindSpot && <p style={{ ...S.body, fontSize: 12, color: '#e88050', marginBottom: 4 }}>Blind spot: {profile.blindSpot}</p>}
                    {profile.growth && <p style={{ ...S.body, fontSize: 12, color: '#50c878' }}>Growth: {profile.growth}</p>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Pairwise Dynamics (from INSTINCT_PAIR_DYNAMICS) */}
        {(() => {
          const domKey = sel.toUpperCase();
          const refStack = Object.keys(INSTINCT_STACK_PROFILES).find(k => k.startsWith(domKey + '/'));
          if (!refStack) return null;
          const allStacks = Object.keys(INSTINCT_STACK_PROFILES);
          const pairEntries = allStacks.filter(s => s !== refStack).map(otherStack => {
            const key = instinctPairKey(refStack, otherStack);
            return { otherStack, entry: INSTINCT_PAIR_DYNAMICS[key] };
          }).filter(x => x.entry);
          if (!pairEntries.length) return null;
          const chemColor = { high: '#50c878', medium: G.gold, variable: '#5090d0', low: '#e88050' };
          return (
            <div style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>Stack Pairing Dynamics</h3>
              <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginBottom: 14 }}>From the {refStack} perspective, dynamics with each other stack ordering.</p>
              {pairEntries.map(({ otherStack, entry }) => (
                <div key={otherStack} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ ...S.mono, fontSize: 12 }}>{refStack} × {otherStack}</span>
                    {entry.label && <span style={{ fontSize: 11, color: G.gold }}>{entry.label}</span>}
                    {entry.compatibility && (
                      <span style={{ fontSize: 10, color: chemColor[entry.compatibility] || G.textDim, background: G.bg3, borderRadius: 4, padding: '1px 6px', marginLeft: 'auto' }}>{entry.compatibility}</span>
                    )}
                  </div>
                  {entry.dynamic && <p style={{ ...S.body, fontSize: 12, marginBottom: 4 }}>{entry.dynamic}</p>}
                  {entry.strength && <p style={{ fontSize: 12, color: '#50c878', marginBottom: 2 }}>+ {entry.strength}</p>}
                  {entry.challenge && <p style={{ fontSize: 12, color: '#e88050', marginBottom: 4 }}>- {entry.challenge}</p>}
                  {entry.tip && <p style={{ fontSize: 11, color: G.textFaint, fontStyle: 'italic' }}>{entry.tip}</p>}
                </div>
              ))}
            </div>
          );
        })()}

        <h3 style={{ ...S.h3, marginTop: 24, marginBottom: 12 }}>Drive Compatibility (Basic)</h3>
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

        {/* Cognitive Function Deep Dive */}
        {MBTI_FUNCTION_DETAILS[sel] && (() => {
          const d = MBTI_FUNCTION_DETAILS[sel];
          const t2 = MBTI_TYPES[sel];
          const positions = [
            { key: 'dominant', label: 'DOM', color: G.gold },
            { key: 'auxiliary', label: 'AUX', color: '#5090d0' },
            { key: 'tertiary', label: 'TER', color: '#30a888' },
            { key: 'inferior', label: 'INF', color: '#e88050' },
          ];
          const shadows = [
            { key: 'shadow5', label: 'SH5' },
            { key: 'shadow6', label: 'SH6' },
            { key: 'shadow7', label: 'SH7' },
            { key: 'shadow8', label: 'SH8' },
          ];
          return (
            <div style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>Function Deep Dive</h3>
              <p style={{ ...S.body, fontSize: 13, color: G.textFaint, marginBottom: 16 }}>How each cognitive function manifests specifically in the {sel}.</p>
              {positions.map(({ key, label, color }) => {
                const fn = d[key];
                if (!fn) return null;
                return (
                  <div key={key} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${G.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color, fontFamily: "'DM Mono',monospace", width: 28 }}>{label}</span>
                      <FnBadge fn={fn.function} size="md" />
                      <span style={{ fontSize: 12, color: G.textDim }}>{fn.title}</span>
                    </div>
                    <p style={{ ...S.body, fontSize: 13, marginBottom: 8, paddingLeft: 36 }}>{fn.inThisType}</p>
                    <div style={{ paddingLeft: 36, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 140, padding: '8px 10px', borderRadius: 6, background: 'rgba(80,200,120,0.06)', border: '1px solid rgba(80,200,120,0.15)' }}>
                        <p style={{ fontSize: 10, color: '#50c878', marginBottom: 4 }}>Healthy</p>
                        <p style={{ ...S.body, fontSize: 12 }}>{fn.healthyExpression}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 140, padding: '8px 10px', borderRadius: 6, background: 'rgba(232,128,80,0.06)', border: '1px solid rgba(232,128,80,0.15)' }}>
                        <p style={{ fontSize: 10, color: '#e88050', marginBottom: 4 }}>Unhealthy</p>
                        <p style={{ ...S.body, fontSize: 12 }}>{fn.unhealthyExpression}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>SHADOW FUNCTIONS (5–8)</p>
                {shadows.map(({ key, label }) => {
                  const sh = d[key];
                  if (!sh) return null;
                  return (
                    <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 10, color: G.textFaint, fontFamily: "'DM Mono',monospace", width: 28, flexShrink: 0, marginTop: 2 }}>{label}</span>
                      <FnBadge fn={sh.function} />
                      <p style={{ ...S.body, fontSize: 12, color: G.textFaint }}>{sh.brief}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Development Trajectory */}
        {MBTI_DEVELOPMENT[sel] && (
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Development Trajectory</h3>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 14, color: G.textFaint }}>How this type tends to develop across the lifespan as the function stack matures.</p>
            {[
              { key: 'childhood', label: 'Childhood', color: '#5090d0' },
              { key: 'adolescence', label: 'Adolescence', color: '#7070c0' },
              { key: 'youngAdult', label: 'Young Adult', color: G.gold },
              { key: 'midlife', label: 'Midlife', color: '#50c878' },
              { key: 'maturity', label: 'Maturity', color: '#30a888' },
            ].map(({ key, label, color }) => {
              const stage = MBTI_DEVELOPMENT[sel][key];
              if (!stage) return null;
              return (
                <div key={key} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
                  <span style={{ fontSize: 11, color, fontFamily: "'DM Mono',monospace", display: 'block', marginBottom: 4 }}>{label}</span>
                  <p style={{ ...S.body, fontSize: 13 }}>{stage}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Stress & Flow Profile */}
        {MBTI_STRESS_FLOW[sel] && (
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Stress & Flow Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {MBTI_STRESS_FLOW[sel].inFlow && (
                <div style={{ background: 'rgba(80,200,120,0.06)', border: '1px solid rgba(80,200,120,0.2)', borderRadius: 8, padding: '12px 10px' }}>
                  <p style={{ fontSize: 12, color: '#50c878', marginBottom: 6, fontWeight: 500 }}>In Flow</p>
                  <p style={{ ...S.body, fontSize: 12, marginBottom: 8 }}>{MBTI_STRESS_FLOW[sel].inFlow.description}</p>
                  {MBTI_STRESS_FLOW[sel].inFlow.triggers && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {MBTI_STRESS_FLOW[sel].inFlow.triggers.map((trigger, i) => (
                        <span key={i} style={{ fontSize: 10, color: '#50c878', background: 'rgba(80,200,120,0.1)', borderRadius: 4, padding: '2px 6px' }}>{trigger}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {MBTI_STRESS_FLOW[sel].underStress && (
                <div style={{ background: 'rgba(232,128,80,0.06)', border: '1px solid rgba(232,128,80,0.2)', borderRadius: 8, padding: '12px 10px' }}>
                  <p style={{ fontSize: 12, color: '#e88050', marginBottom: 6, fontWeight: 500 }}>Under Stress</p>
                  <p style={{ ...S.body, fontSize: 12, marginBottom: 8 }}>{MBTI_STRESS_FLOW[sel].underStress.description}</p>
                  {MBTI_STRESS_FLOW[sel].underStress.triggers && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {MBTI_STRESS_FLOW[sel].underStress.triggers.map((trigger, i) => (
                        <span key={i} style={{ fontSize: 10, color: '#e88050', background: 'rgba(232,128,80,0.08)', borderRadius: 4, padding: '2px 6px' }}>{trigger}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {MBTI_STRESS_FLOW[sel].underStress?.recoveryPath && (
              <div style={{ padding: '8px 12px', background: G.bg3, borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 4 }}>Recovery path</p>
                <p style={{ ...S.body, fontSize: 12 }}>{MBTI_STRESS_FLOW[sel].underStress.recoveryPath}</p>
              </div>
            )}
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

          {/* Enneagram × MBTI Correlation Matrix */}
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 4 }}>Enneagram × MBTI Correlation</h3>
            <p style={{ ...S.body, fontSize: 13, color: G.textFaint, marginBottom: 16 }}>
              Research-based correlations between Enneagram types and common MBTI types. These reflect population tendencies, not fixed rules — any combination is possible.
            </p>
            {Object.entries(ENN_MBTI_CORRELATION).map(([ennType, corr]) => (
              <div key={ennType} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${G.border}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: G.goldDim, border: `1px solid ${G.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, color: G.gold, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{ennType}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    {corr.common && corr.common.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: '#50c878', marginRight: 8 }}>Common</span>
                        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 3 }}>
                          {corr.common.map(m => <span key={m} style={{ ...S.tag, fontSize: 10, background: 'rgba(80,200,120,0.08)', color: '#50c878', border: '1px solid rgba(80,200,120,0.25)' }}>{m}</span>)}
                        </span>
                      </div>
                    )}
                    {corr.uncommon && corr.uncommon.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: G.textFaint, marginRight: 8 }}>Uncommon</span>
                        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 3 }}>
                          {corr.uncommon.map(m => <span key={m} style={{ ...S.tag, fontSize: 10, background: G.bg3, color: G.textDim }}>{m}</span>)}
                        </span>
                      </div>
                    )}
                    {corr.note && <p style={{ ...S.body, fontSize: 12, color: G.textFaint, fontStyle: 'italic' }}>{corr.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Integration Narratives */}
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 4 }}>Deep Integration Profiles</h3>
            <p style={{ ...S.body, fontSize: 13, color: G.textFaint, marginBottom: 16 }}>
              How specific Enneagram × MBTI pairings create qualitatively distinct personalities — and how the instinct stack further differentiates them.
            </p>
            {Object.entries(INTEGRATION_NARRATIVES).map(([key, narr]) => (
              <div key={key} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${G.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ ...S.mono, fontSize: 12, color: G.gold, background: G.goldDim, border: `1px solid ${G.goldBorder}`, padding: '2px 8px', borderRadius: 6 }}>{key.replace('_', ' / ')}</span>
                  <h4 style={{ fontSize: 14, color: G.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, margin: 0 }}>{narr.title}</h4>
                </div>
                <p style={{ ...S.body, fontSize: 13, marginBottom: 12, lineHeight: 1.75 }}>{narr.narrative}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {[['SP', narr.withSP], ['SX', narr.withSX], ['SO', narr.withSO]].map(([inst, text]) => text && (
                    <div key={inst} style={{ flex: 1, minWidth: 160, padding: '8px 10px', borderRadius: 6, background: G.bg3, border: `1px solid ${G.border}` }}>
                      <p style={{ fontSize: 10, color: '#30a888', marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>{inst}-DOMINANT</p>
                      <p style={{ ...S.body, fontSize: 12 }}>{text}</p>
                    </div>
                  ))}
                </div>
                {narr.typingNotes && (
                  <p style={{ ...S.body, fontSize: 12, color: G.textFaint, fontStyle: 'italic' }}>Typing notes: {narr.typingNotes}</p>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: G.textFaint, textAlign: 'center', marginTop: 24, marginBottom: 8, lineHeight: 1.7 }}>
            The framework for integrating these three systems draws on ideas developed by Saleh Vallander in{' '}
            <em>The Enneagram, the Myers-Briggs, and the Brain</em>.
          </p>
        </>
      )}

      {/* ── Profiles tab ── */}
      {tab === 'profiles' && <ProfilesTab />}
    </div></div>
  );
}

// Generate full list of all 1,728 combination keys upfront (no data loading needed)
const WINGS = ['1w9','1w2','2w1','2w3','3w2','3w4','4w3','4w5','5w4','5w6','6w5','6w7','7w6','7w8','8w7','8w9','9w8','9w1'];
const ALL_MBTI = ['INTJ','INTP','INFJ','INFP','ISTJ','ISTP','ISFJ','ISFP','ENTJ','ENTP','ENFJ','ENFP','ESTJ','ESTP','ESFJ','ESFP'];
const ALL_STACKS = ['SXSPSO','SXSOPS','SPSXSO','SPSOXS','SOSXSP','SOSPSX'];
const ALL_KEYS = [];
WINGS.forEach(w => ALL_MBTI.forEach(m => ALL_STACKS.forEach(s => ALL_KEYS.push(`${w}_${m}_${s}`))));

function ProfilesTab() {
  const [search, setSearch] = useState('');
  const [ennFilter, setEnnFilter] = useState('');
  const [mbtiFilter, setMbtiFilter] = useState('');
  const [instFilter, setInstFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const openProfile = (key) => {
    setLoadingProfile(true);
    const parts = key.split('_');
    const wingKey = parts[0];
    const mbtiType = parts[1];
    const instStack = parts[2];
    const ennType = parseInt(wingKey[0]);
    const wing = parseInt(wingKey[2]);
    const stackStr = instStack.toLowerCase();
    const instStackFormatted = [stackStr.slice(0,2), stackStr.slice(2,4), stackStr.slice(4,6)].join('/').toUpperCase();
    import('../data/combinations/index.js').then(mod =>
      mod.getCombinationProfile(ennType, wing, mbtiType, instStackFormatted)
    ).then(profile => {
      setSelected(profile ? { key, ...profile } : { key, code: key });
      setLoadingProfile(false);
    }).catch(() => {
      setSelected({ key, code: key });
      setLoadingProfile(false);
    });
  };

  const fieldStyle = { fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: G.text, margin: 0, lineHeight: 1.6 };

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${G.border}`, background: 'transparent', color: G.textDim, fontSize: 13, marginBottom: 16, cursor: 'pointer' }}>← Back to Profiles</button>
        <div style={{ padding: '14px 16px', borderRadius: 10, background: G.goldDim, border: `1px solid ${G.goldBorder}`, marginBottom: 16 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: G.gold }}>{selected.code || selected.key}</span>
          {selected.archetypeName && <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600, color: G.text, margin: '6px 0 2px' }}>{selected.archetypeName}</h3>}
          {selected.tagline && <p style={{ ...fieldStyle, fontSize: 13, color: G.textDim, fontStyle: 'italic' }}>{selected.tagline}</p>}
        </div>
        {selected.portrait && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={fieldStyle}>{selected.portrait}</p></div>}
        {selected.uniqueSignature && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>UNIQUE SIGNATURE</p><p style={fieldStyle}>{selected.uniqueSignature}</p></div>}
        {selected.strengths?.length > 0 && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: '#50c878', marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>STRENGTHS</p>{selected.strengths.map((s, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: '#50c878', fontSize: 12, flexShrink: 0 }}>+</span><p style={{ ...fieldStyle, fontSize: 13 }}>{s}</p></div>)}</div>}
        {selected.growthEdges?.length > 0 && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: '#e88050', marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>GROWTH EDGES</p>{selected.growthEdges.map((e, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: '#e88050', fontSize: 12, flexShrink: 0 }}>→</span><p style={{ ...fieldStyle, fontSize: 13 }}>{e}</p></div>)}</div>}
        {selected.inRelationships && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>IN RELATIONSHIPS</p><p style={fieldStyle}>{selected.inRelationships}</p></div>}
        {selected.atWork && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>AT WORK</p><p style={fieldStyle}>{selected.atWork}</p></div>}
        {selected.underStress && <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(232,128,80,0.06)', border: `1px solid rgba(232,128,80,0.2)`, marginBottom: 12 }}><p style={{ fontSize: 11, color: '#e88050', marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>UNDER STRESS</p><p style={fieldStyle}>{selected.underStress}</p></div>}
        {selected.growthPath && <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(80,200,120,0.06)', border: `1px solid rgba(80,200,120,0.2)`, marginBottom: 12 }}><p style={{ fontSize: 11, color: '#50c878', marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>GROWTH PATH</p><p style={fieldStyle}>{selected.growthPath}</p></div>}
        {selected.communicationTips?.length > 0 && <div style={{ padding: '14px 16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}><p style={{ fontSize: 11, color: G.textFaint, marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>COMMUNICATION TIPS</p>{selected.communicationTips.map((t, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: G.gold, fontSize: 12, flexShrink: 0 }}>·</span><p style={{ ...fieldStyle, fontSize: 13 }}>{t}</p></div>)}</div>}
        {!selected.portrait && <div style={{ padding: '16px', borderRadius: 10, background: G.bg3, border: `1px solid ${G.border}`, textAlign: 'center' }}><p style={{ ...fieldStyle, fontSize: 13, color: G.textFaint }}>Detailed profile not available for this combination.</p></div>}
      </div>
    );
  }

  const q = search.toLowerCase();
  const filtered = ALL_KEYS.filter(k => {
    if (ennFilter && !k.startsWith(ennFilter + 'w')) return false;
    if (mbtiFilter && !k.includes('_' + mbtiFilter + '_')) return false;
    if (instFilter && !k.toLowerCase().includes(instFilter)) return false;
    if (q && !k.toLowerCase().includes(q)) return false;
    return true;
  }).slice(0, 60);

  return (
    <div>
      <div style={{ padding: '12px 14px', borderRadius: 10, background: G.goldDim, border: `1px solid ${G.goldBorder}`, marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: G.text, marginBottom: 4 }}>1,728 Combination Profiles</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: G.textDim, margin: 0 }}>Every Enneagram type × wing × MBTI type × instinct stack combination. Profiles load on demand.</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code (e.g. 4w5_INFP)…" style={{ flex: 2, minWidth: 160, padding: '8px 12px', borderRadius: 8, border: `1px solid ${G.border}`, background: G.bg3, color: G.text, fontSize: 13, outline: 'none' }} />
        <select value={ennFilter} onChange={e => setEnnFilter(e.target.value)} style={{ flex: 1, minWidth: 90, padding: '8px 10px', borderRadius: 8, border: `1px solid ${G.border}`, background: G.bg3, color: G.text, fontSize: 13 }}>
          <option value="">All Enn</option>
          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={String(n)}>Type {n}</option>)}
        </select>
        <select value={mbtiFilter} onChange={e => setMbtiFilter(e.target.value)} style={{ flex: 1, minWidth: 90, padding: '8px 10px', borderRadius: 8, border: `1px solid ${G.border}`, background: G.bg3, color: G.text, fontSize: 13 }}>
          <option value="">All MBTI</option>
          {ALL_MBTI.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={instFilter} onChange={e => setInstFilter(e.target.value)} style={{ flex: 1, minWidth: 90, padding: '8px 10px', borderRadius: 8, border: `1px solid ${G.border}`, background: G.bg3, color: G.text, fontSize: 13 }}>
          <option value="">All Inst</option>
          {['sp','sx','so'].map(i => <option key={i} value={i}>{i.toUpperCase()}-dom</option>)}
        </select>
      </div>
      {loadingProfile && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: G.textFaint, textAlign: 'center', padding: '24px 0' }}>Loading profile…</p>}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: G.textFaint, marginBottom: 10 }}>Showing {filtered.length} of {ALL_KEYS.length} combinations{filtered.length === 60 ? ' (first 60 — refine filters to narrow)' : ''}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.map(k => (
          <button key={k} onClick={() => openProfile(k)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${G.border}`, background: G.bg3, color: G.text, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: G.gold, flexShrink: 0 }}>{k}</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: G.textFaint }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
