import { useState } from 'react';
import { useScrollToTop } from '../utils/scroll.js';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { parseHash } from '../utils/route.js';
import { parseStackQuery, readSavedTypes } from '../utils/stack.js';

const TYPE_CODES = Object.keys(MBTI_TYPES);

function initialType() {
  const { type } = parseStackQuery(parseHash(window.location.hash).query);
  return type ?? readSavedTypes().mbti ?? '';
}

export default function StackView() {
  const [type, setType] = useState(initialType);
  useScrollToTop();

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
    </div></div>
  );
}
