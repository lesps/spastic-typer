import { G } from '../styles/theme.js';

export default function LikertScale({ value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginTop: 20 }}>
      {[-3, -2, -1, 0, 1, 2, 3].map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            width: 36, height: 36, borderRadius: '50%', border: `1px solid ${value === v ? G.gold : G.border}`,
            background: value === v ? G.gold : G.bg3,
            color: value === v ? G.bg : G.textDim,
            fontSize: 12, fontFamily: "'DM Mono',monospace",
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s',
          }}
        >
          {v > 0 ? `+${v}` : v}
        </button>
      ))}
    </div>
  );
}
