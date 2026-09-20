import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollToTop } from '../utils/scroll.js';
import { G, FC, POS, alpha } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { POSITIONS } from '../data/shadow.js';
import { LEVELS as HEALTH_LEVELS } from '../data/levels.js';
import {
  EDGES, EQUILIBRIUM_CAVEAT, LEVEL_NARRATION, PURPOSES, CLASSIFICATION, LABEL_TEMPLATES,
  ROLES, STAGES, MECHANISM, CORRESPONDENCE_NOTE,
  UTILITY, UTILITY_DIAGNOSTIC, THRESHOLDS, GAMBLE_PROPERTIES, GAMBLE_SUMMONABILITY, ODD_EVEN,
  FIXATION_NOTES, SUBSTRATE_ROLES, SUBSTRATE_NOTE, SUBSTRATE_TARGET, GROWTH_MECHANISM,
} from '../data/stack.js';
import { parseHash } from '../utils/route.js';
import { getFullStack } from '../utils/shadow.js';
import {
  parseStackQuery, readSavedTypes, captureState, captureLevelOf, positionLabel, fnAtPositionLabel,
  fillTemplate, tierForLevel, counterThreatOutput, nestedPartner, domainPartner,
  substrateFor, fixationFor, MIN_LEVEL, MAX_LEVEL,
} from '../utils/stack.js';
import StackDiagram from '../components/StackDiagram.jsx';
import FnBadge from '../components/FnBadge.jsx';

const TYPE_CODES = Object.keys(MBTI_TYPES);
const REPLAY_STEP_MS = 1200;
const nameOf = (pos) => POSITIONS[pos - 1].name;
const join = (sentences) => sentences.join(' ');

// jsdom has no matchMedia; treat its absence as "no preference".
function prefersReducedMotion() {
  try { return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
}

function initialState() {
  const { type, level } = parseStackQuery(parseHash(window.location.hash).query);
  const saved = readSavedTypes();
  return { type: type ?? saved.mbti ?? '', level: level ?? MIN_LEVEL, saved };
}

export default function StackView() {
  const [init] = useState(initialState);
  const [type, setType] = useState(init.type);
  const [level, setLevelState] = useState(init.level);
  const [selected, setSelected] = useState({ kind: 'node', id: 1 });
  const [personalized, setPersonalized] = useState(false);
  const [utility, setUtility] = useState('');
  const [replaying, setReplaying] = useState(false);
  const timer = useRef(null);
  useScrollToTop();

  const stopReplay = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setReplaying(false);
  }, []);
  useEffect(() => stopReplay, [stopReplay]);

  const setLevel = (l) => { stopReplay(); setLevelState(l); };

  // The query is re-read on hashchange, so back/forward between two stack deep
  // links and hand-edited hashes both land on the right type and level.
  useEffect(() => {
    const onHash = () => {
      const { type: t, level: lv } = parseStackQuery(parseHash(window.location.hash).query);
      if (t != null) { setType(t); setPersonalized(false); }
      if (lv != null) { stopReplay(); setLevelState(lv); }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [stopReplay]);

  const startReplay = () => {
    stopReplay();
    if (prefersReducedMotion()) { setLevelState(MAX_LEVEL); return; }
    setLevelState(MIN_LEVEL);
    setReplaying(true);
    timer.current = setInterval(() => {
      setLevelState(prev => {
        if (prev >= MAX_LEVEL) { stopReplay(); return prev; }
        return prev + 1;
      });
    }, REPLAY_STEP_MS);
  };

  const canPersonalize = init.saved.mbti != null && init.saved.enn != null;
  const fixationType = personalized && canPersonalize ? init.saved.enn : null;
  const personalize = () => { setType(init.saved.mbti); setPersonalized(true); };

  const stack = type ? getFullStack(type) : null;
  const state = captureState(level);
  const narration = LEVEL_NARRATION[state.level];
  const levelLabel = state.justCaptured == null
    ? `Level ${state.level} · ${state.rh} · no position captured`
    : `Level ${state.level} · ${state.band} · captures ${nameOf(state.justCaptured)} (Position ${state.justCaptured})`;
  const counter = counterThreatOutput(type);
  const fixation = fixationType ? fixationFor(fixationType) : null;
  const substrate = personalized ? substrateFor(init.saved.inst) : null;
  const bridge = fixationType ? HEALTH_LEVELS[fixationType]?.[tierForLevel(state.level)] : null;

  const util = utility ? UTILITY[utility] : null;
  const oddEven = state.justCaptured == null || state.level === 2
    ? null
    : ODD_EVEN.odd.levels.includes(state.level) ? ODD_EVEN.odd : ODD_EVEN.even;

  // Gamble degrades on three axes at different rates, so "is Gamble gone yet"
  // has three answers at most levels rather than one.
  const gambleState = GAMBLE_PROPERTIES.map(p => ({
    ...p,
    started: state.level >= p.from,
    done: p.degrades === 'discrete' && state.level >= p.from,
  }));

  const selPos = selected?.kind === 'node' ? selected.id : null;
  const selFn = selPos ? stack?.[selPos - 1]?.fn ?? null : null;
  const selColor = selPos ? (selFn && FC[selFn] ? FC[selFn] : POS[selPos]) : G.gold;
  const selCapLevel = selPos ? captureLevelOf(selPos) : null;
  const selCaptured = selPos ? state.level >= selCapLevel : false;

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <h1 style={S.h1}>Stack</h1>
        <p style={{ ...S.body, marginTop: 6 }}>
          The eight positions, the couplings between them, and how each one's purpose changes as colonization reaches it.
        </p>
      </div>

      <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <label htmlFor="stack-type" style={{ ...S.mono, fontSize: 12 }}>Type</label>
        <select
          id="stack-type"
          aria-label="MBTI type"
          value={type}
          onChange={e => { setType(e.target.value); setPersonalized(false); }}
          style={{ ...S.input, width: 'auto', minWidth: 160, padding: '8px 12px', fontSize: 14 }}
        >
          <option value="">Positions only</option>
          {TYPE_CODES.map(code => <option key={code} value={code}>{code} — {MBTI_TYPES[code].name}</option>)}
        </select>
        {canPersonalize && (
          personalized ? (
            <button type="button" onClick={() => setPersonalized(false)} style={{ ...S.btnOutline, padding: '7px 12px', fontSize: 12 }}>
              Back to the impersonal view
            </button>
          ) : (
            <button type="button" onClick={personalize} style={{ ...S.btn, padding: '7px 12px', fontSize: 12 }}>
              Personalize for {init.saved.mbti} · Type {init.saved.enn}{init.saved.inst ? ` · ${init.saved.inst.toUpperCase()}` : ''}
            </button>
          )
        )}
        <span style={{ fontSize: 12, color: G.textFaint, flexBasis: '100%' }}>
          {type ? 'Every node carries its function for this type.' : 'Pick a type to see which function sits at each position.'}
        </span>
      </div>

      <div style={{ ...S.card, padding: '14px 10px 10px' }}>
        <StackDiagram stack={stack} level={state.level} selected={selected} onSelect={setSelected} fixationType={fixationType} />
        <p style={{ fontSize: 11, color: G.textFaint, textAlign: 'center', marginTop: 8 }}>
          Tap a position or a coupling to read it. Heavier lines are the load-bearing pair: Refuge → Critic → Anchor.
        </p>
      </div>

      <div style={S.cardGold}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h3 style={{ ...S.h3, marginBottom: 0 }}>Colonization</h3>
          <span data-testid="stack-level-label" style={{ ...S.mono, fontSize: 12 }}>{levelLabel}</span>
        </div>
        <input
          type="range"
          aria-label="Health level"
          min={MIN_LEVEL}
          max={MAX_LEVEL}
          step={1}
          value={state.level}
          onChange={e => setLevel(Number(e.target.value))}
          style={{ width: '100%', accentColor: G.gold, margin: '6px 0 4px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: G.textFaint, fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>
          {Array.from({ length: MAX_LEVEL }, (_, i) => <span key={i}>{i + 1}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {replaying
            ? <button type="button" onClick={stopReplay} style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12 }}>Cancel replay</button>
            : <button type="button" onClick={startReplay} style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12 }}>Replay 1 → 9</button>}
          <span style={{ fontSize: 11, color: G.textFaint, alignSelf: 'center' }}>About 1.2s per level. A walk through the sequence, not a forecast.</span>
        </div>
        <div data-testid="stack-narration" style={{ padding: '10px 12px', borderRadius: 8, background: alpha(G.gold, 0.06), border: `1px solid ${alpha(G.gold, 0.15)}`, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <p style={{ ...S.mono, fontSize: 11 }}>Level <span>{narration.title}</span></p>
            {state.kind && (
              <span data-testid="stack-capture-kind" style={{ ...S.mono, fontSize: 10, color: G.textFaint }}>
                {state.kind} capture · {state.transition} transition
              </span>
            )}
          </div>
          <p style={{ ...S.body, fontSize: 13 }}>{join(narration.text)}</p>
          {narration.more.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: 'pointer', fontSize: 11, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>More</summary>
              <p data-testid="stack-narration-more" style={{ ...S.body, fontSize: 13, marginTop: 6 }}>{join(narration.more)}</p>
            </details>
          )}
          {oddEven && (
            <p data-testid="stack-odd-even" style={{ fontSize: 12, color: G.textDim, marginTop: 8 }}>
              <span style={{ ...S.mono, fontSize: 10, color: G.textFaint }}>{oddEven.arc.toUpperCase()} CAPTURE </span>
              Reported as {oddEven.reported} — {oddEven.example}.
            </p>
          )}
          {narration.falsifier && (
            <p data-testid="stack-falsifier" style={{ fontSize: 12, color: G.textDim, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${alpha(G.gold, 0.15)}` }}>
              <span style={{ ...S.mono, fontSize: 10, color: G.warn }}>FALSIFIER </span>
              {narration.falsifier}
            </p>
          )}
        </div>
        {bridge && (
          <div data-testid="stack-bridge" style={{ padding: '10px 12px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}`, marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 6 }}>
              {fillTemplate(LABEL_TEMPLATES.bridgeNote, { type: fixationType })} {CORRESPONDENCE_NOTE[1]}
            </p>
            <p style={{ ...S.mono, fontSize: 12, marginBottom: 2 }}>{bridge.range} · {bridge.title}</p>
            <p style={{ ...S.body, fontSize: 13 }}>{bridge.description}</p>
          </div>
        )}
        <p data-testid="stack-caveat" style={{ ...S.body, fontSize: 12, color: G.textFaint }}>{join(EQUILIBRIUM_CAVEAT)}</p>
      </div>

      <div style={S.card} data-testid="stack-thresholds">
        <h3 style={S.h3}>Anchor drift</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>
          {LEVEL_NARRATION[6].text[0]} Two discrete crossings sit on that drift, which is why 6 and 7 are separate levels.
        </p>
        {THRESHOLDS.map(t => {
          const crossed = state.level >= t.level;
          return (
            <div
              key={t.id}
              data-testid={`stack-threshold-${t.id}`}
              data-crossed={crossed ? 'true' : 'false'}
              style={{
                padding: '10px 12px', borderRadius: 8, marginBottom: 8,
                background: crossed ? alpha(G.warn, 0.08) : G.bg3,
                border: `1px solid ${crossed ? alpha(G.warn, 0.35) : G.border}`,
                opacity: crossed ? 1 : 0.55, transition: 'opacity .3s, background .3s',
              }}
            >
              <p style={{ ...S.mono, fontSize: 11, color: crossed ? G.warn : G.textFaint, marginBottom: 4 }}>
                {t.name} · Level {t.level} {crossed ? '· crossed' : ''}
              </p>
              <p style={{ ...S.body, fontSize: 13 }}>{t.detail}</p>
            </div>
          );
        })}
        <p style={{ fontSize: 12, color: G.textFaint }}>{THRESHOLDS[1].why}.</p>
      </div>

      <div style={S.card} data-testid="stack-gamble">
        <h3 style={S.h3}>Gamble</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>
          Three properties, degrading at different rates. Only polarity is discrete, which is why surprise becomes rare before it becomes absent.
        </p>
        {gambleState.map(p => (
          <div
            key={p.id}
            data-testid={`stack-gamble-${p.id}`}
            data-started={p.started ? 'true' : 'false'}
            style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${G.border}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ ...S.mono, fontSize: 12, color: p.started ? G.warn : G.textDim }}>{p.name}</span>
              <span style={{ ...S.mono, fontSize: 10, color: G.textFaint }}>
                {p.degrades === 'discrete' ? `discrete · Level ${p.from}` : `gradient · from Level ${p.from}`}
              </span>
            </div>
            <p style={{ ...S.body, fontSize: 12, color: G.textDim, marginBottom: 4 }}>{p.what}</p>
            <p style={{ ...S.body, fontSize: 13 }}>{p.detail.join(' ')}</p>
            {p.trainable && <p style={{ fontSize: 12, color: G.success, marginTop: 4 }}>{p.trainable}</p>}
          </div>
        ))}
        <p style={{ fontSize: 12, color: G.textFaint }}>{GAMBLE_SUMMONABILITY}</p>
      </div>

      <div style={S.card} data-testid="stack-utility">
        <h3 style={S.h3}>Fixation utility for Lead</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 10 }}>
          The single surface modulator, running on the same mechanism. It sets how the descent looks from outside and where it settles.
        </p>
        <p style={{ ...S.mono, fontSize: 12, color: G.textDim, marginBottom: 8 }}>{UTILITY_DIAGNOSTIC.question}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {UTILITY_DIAGNOSTIC.rows.map(row => (
            <button
              key={row.utility}
              type="button"
              data-testid={`stack-utility-${row.utility}`}
              aria-pressed={utility === row.utility}
              onClick={() => setUtility(utility === row.utility ? '' : row.utility)}
              style={{
                ...(utility === row.utility ? S.btn : S.btnOutline),
                padding: '7px 12px', fontSize: 12, textAlign: 'left',
              }}
            >
              {row.stakes}
            </button>
          ))}
        </div>
        {util ? (
          <div data-testid="stack-utility-detail">
            <p style={{ ...S.mono, fontSize: 12, color: G.gold, marginBottom: 6 }}>{util.label} — {util.summary}</p>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 8 }}>{util.detail.join(' ')}</p>
            {util.gap && (
              <p style={{ fontSize: 12, color: G.textFaint }}>
                Predicted lag between the two thresholds: {util.gap}.
              </p>
            )}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: G.textFaint }}>{UTILITY_DIAGNOSTIC.nowhere}</p>
        )}
      </div>

      {selected?.kind === 'edge' && (() => {
        const e = EDGES.find(x => x.id === selected.id);
        return (
          <div style={S.card} data-testid="stack-edge-detail">
            <h3 style={S.h3}>{e.label}</h3>
            <p style={{ ...S.mono, fontSize: 12, marginBottom: 6 }}>
              {nameOf(e.from)} → {nameOf(e.to)} · {e.kind} edge
            </p>
            <p style={S.body}>{e.meaning}</p>
            {e.kind === 'corruption' && (
              <p style={{ ...S.body, fontSize: 12, color: G.textFaint, marginTop: 8 }}>{MECHANISM.statement}</p>
            )}
          </div>
        );
      })()}

      {selPos && (
        <div style={{ ...S.card, borderColor: alpha(selColor, 0.4) }} data-testid="stack-purpose">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{ ...S.h3, marginBottom: 0, color: selColor }}>{positionLabel(selPos, selCapLevel)}</h3>
            {selFn && <FnBadge fn={selFn} />}
          </div>
          {selFn && <p style={{ ...S.mono, fontSize: 12, color: G.textDim, marginBottom: 4 }}>{fnAtPositionLabel(selFn, selPos)}</p>}
          <p style={{ fontSize: 11, color: G.textFaint, marginBottom: 8 }}>{CLASSIFICATION[selPos]} · {ROLES[selPos]}</p>
          <p data-testid="stack-pairs" style={{ fontSize: 11, color: G.textFaint, marginBottom: 12, fontFamily: "'DM Mono',monospace" }}>
            Nested partner: {nameOf(nestedPartner(selPos))} (Position {nestedPartner(selPos)}) · Domain partner: {nameOf(domainPartner(selPos))} (Position {domainPartner(selPos)})
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            <div data-testid="stack-purpose-native" style={{ padding: '10px 12px', borderRadius: 8, background: alpha(selColor, 0.08), border: `1px solid ${alpha(selColor, 0.3)}` }}>
              <p style={{ ...S.mono, fontSize: 11, color: selColor, marginBottom: 6 }}>Native purpose</p>
              <p style={{ ...S.body, fontSize: 13 }}>{join(PURPOSES[selPos].native)}</p>
            </div>
            <div
              data-testid="stack-purpose-captured"
              data-state={selCaptured ? 'active' : 'inert'}
              style={{
                padding: '10px 12px', borderRadius: 8,
                background: selCaptured ? alpha(G.warn, 0.08) : G.bg3,
                border: `1px solid ${selCaptured ? alpha(G.warn, 0.35) : G.border}`,
                opacity: selCaptured ? 1 : 0.5,
                transition: 'opacity .3s, background .3s, border-color .3s',
              }}
            >
              <p style={{ ...S.mono, fontSize: 11, color: selCaptured ? G.warn : G.textFaint, marginBottom: 6 }}>
                In the fixation's service · {fillTemplate(LABEL_TEMPLATES.capturedAt, { level: selCapLevel })}
              </p>
              <p style={{ ...S.body, fontSize: 13 }}>{join(PURPOSES[selPos].captured)}</p>
            </div>
          </div>
        </div>
      )}

      {fixation && (
        <div style={S.cardGold} data-testid="stack-fixation">
          <h3 style={S.h3}>Type {fixation.type} at Hunger</h3>
          <p style={{ ...S.mono, fontSize: 11, color: G.textFaint, marginBottom: 8 }}>Scarcity model</p>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>{fixation.scarcity}</p>
          <p style={{ ...S.mono, fontSize: 11, color: G.textFaint, marginBottom: 6 }}>Counter's threat output is oriented toward</p>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>{fixation.threat}</p>
          <div data-testid="stack-growth" style={{ padding: '10px 12px', borderRadius: 8, background: alpha(G.success, 0.07), border: `1px solid ${alpha(G.success, 0.25)}` }}>
            <p style={{ ...S.mono, fontSize: 11, color: G.success, marginBottom: 6 }}>
              What that threat says will not arrive · direction {fixation.growth}
            </p>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 8 }}>{fixation.falsifies}</p>
            <p style={{ fontSize: 12, color: G.textFaint }}>{GROWTH_MECHANISM[3]}</p>
          </div>
          <p style={{ fontSize: 12, color: G.textFaint, marginTop: 12 }}>
            {FIXATION_NOTES.revision} {FIXATION_NOTES.invariance}
          </p>
        </div>
      )}

      {substrate && (
        <div style={S.card} data-testid="stack-substrate">
          <h3 style={S.h3}>Substrate pressure · {substrate.instinct.toUpperCase()}</h3>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 10 }}>{SUBSTRATE_NOTE}</p>
          <p style={{ ...S.mono, fontSize: 11, color: G.textFaint, marginBottom: 4 }}>Threat register</p>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>{substrate.register}</p>
          <p style={{ ...S.mono, fontSize: 11, color: G.textFaint, marginBottom: 4 }}>Three roles</p>
          <ul style={{ ...S.body, fontSize: 13, marginBottom: 12, paddingLeft: 18 }}>
            {SUBSTRATE_ROLES.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
          </ul>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: G.bg3, border: `1px solid ${G.border}` }}>
            <p style={{ ...S.mono, fontSize: 11, color: G.textFaint, marginBottom: 6 }}>Pressure reduction</p>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}>{substrate.reduction}</p>
            <p style={{ fontSize: 12, color: G.textFaint }}>{SUBSTRATE_TARGET}</p>
          </div>
        </div>
      )}

      {counter && (
        <div style={S.card} data-testid="stack-counter-form">
          <h3 style={S.h3}>Counter threat output</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ ...S.mono, fontSize: 12 }}>Counter</span><FnBadge fn={counter.fn} />
          </div>
          <p style={{ ...S.body, fontSize: 13, marginBottom: 6 }}>{counter.texture}</p>
          <p style={{ ...S.body, fontSize: 12, color: G.textFaint }}>Into Refuge: {counter.contamination}</p>
        </div>
      )}
    </div></div>
  );
}
