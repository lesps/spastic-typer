import { G } from '../styles/theme.js';

const NAV_ITEMS = [
  { id: 'typer', label: 'Typer', icon: '✦' },
  { id: 'explorer', label: 'Explorer', icon: '◆' },
  { id: 'model', label: 'Model', icon: '♦' },
  { id: 'compare', label: 'Compare', icon: '⟷' },
  { id: 'lookup', label: 'Lookup', icon: '↗' },
  { id: 'profile', label: 'Profile', icon: '▸' },
];

export default function BottomNav({ view, setView }) {
  return (
    <div style={{
      position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 4, background: G.bg2,
      border: `1px solid ${G.border}`, borderRadius: 20,
      padding: '6px 8px', maxWidth: 'calc(100vw - 24px)',
    }}>
      {NAV_ITEMS.map(i => (
        <button
          key={i.id}
          onClick={() => setView(i.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: view === i.id ? '6px 14px' : '6px 10px',
            borderRadius: 14, border: 'none',
            background: view === i.id ? G.gold : 'transparent',
            color: view === i.id ? G.bg : G.textDim,
            fontSize: 13, fontWeight: view === i.id ? 600 : 400,
            fontFamily: "'DM Sans',sans-serif",
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 14 }}>{i.icon}</span>
          {view === i.id && <span>{i.label}</span>}
        </button>
      ))}
    </div>
  );
}
