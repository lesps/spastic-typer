import { useState } from 'react';
import { useScrollToTop } from '../utils/scroll.js';
import { G, alpha } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { POSITIONS } from '../data/shadow.js';
import { EDGES, EQUILIBRIUM_CAVEAT, LEVEL_NARRATION } from '../data/stack.js';
import { parseHash } from '../utils/route.js';
import { getFullStack } from '../utils/shadow.js';
import { parseStackQuery, readSavedTypes, captureState, positionLabel, MIN_LEVEL, MAX_LEVEL } from '../utils/stack.js';
import StackDiagram from '../components/StackDiagram.jsx';

const TYPE_CODES = Object.keys(MBTI_TYPES);
const nameOf = (pos) => POSITIONS[pos - 1].name;

function initialState() {
  const { type, level } = parseStackQuery(parseHash(window.location.hash).query);
  return { type: type ?? readSavedTypes().mbti ?? '', level: level ?? MIN_LEVEL };
}

export default function StackView() {
  const [init] = useState(initialState);
  const [type, setType] = useState(init.type);
  const [level, setLevel] = useState(init.level);
  const [selected, setSelected] = useState({ kind: 'node', id: 1 });
  useScrollToTop();

  const stack = type ? getFullStack(type) : null;
  const state = captureState(level);
  const narration = LEVEL_NARRATION[state.level];
  const levelLabel = state.justCaptured == null
    ? `Level ${state.level} · ${state.band} · nothing captured`
    : `Level ${state.level} · ${state.band} · captures ${nameOf(state.justCaptured)} (Position ${state.justCaptured})`;

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
          onChange={e => setType(e.target.value)}
          style={{ ...S.input, width: 'auto', minWidth: 160, padding: '8px 12px', fontSize: 14 }}
        >
          <option value="">Positions only</option>
          {TYPE_CODES.map(code => <option key={code} value={code}>{code} — {MBTI_TYPES[code].name}</option>)}
        </select>
        <span style={{ fontSize: 12, color: G.textFaint }}>
          {type ? 'Every node carries its function for this type.' : 'Pick a type to see which function sits at each position.'}
        </span>
      </div>

      <div style={{ ...S.card, padding: '14px 10px 10px' }}>
        <StackDiagram stack={stack} level={state.level} selected={selected} onSelect={setSelected} />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: G.textFaint, fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>
          {Array.from({ length: MAX_LEVEL }, (_, i) => <span key={i}>{i + 1}</span>)}
        </div>
        <div data-testid="stack-narration" style={{ padding: '10px 12px', borderRadius: 8, background: alpha(G.gold, 0.06), border: `1px solid ${alpha(G.gold, 0.15)}`, marginBottom: 12 }}>
          <p style={{ ...S.mono, fontSize: 11, marginBottom: 4 }}>Level <span>{narration.title}</span></p>
          <p style={{ ...S.body, fontSize: 13 }}>{narration.text}</p>
        </div>
        <p style={{ ...S.body, fontSize: 12, color: G.textFaint }}>{EQUILIBRIUM_CAVEAT}</p>
      </div>

      {selected?.kind === 'edge' && (() => {
        const e = EDGES.find(x => x.id === selected.id);
        return (
          <div style={S.card} data-testid="stack-edge-detail">
            <h3 style={S.h3}>{e.label}</h3>
            <p style={{ ...S.mono, fontSize: 12, marginBottom: 6 }}>{nameOf(e.from)} → {nameOf(e.to)}</p>
            <p style={S.body}>{e.meaning}</p>
          </div>
        );
      })()}

      {selected?.kind === 'node' && (
        <div style={S.card}>
          <h3 style={S.h3}>{positionLabel(selected.id)}</h3>
          <p style={S.body}>{POSITIONS[selected.id - 1].brief}</p>
        </div>
      )}
    </div></div>
  );
}
