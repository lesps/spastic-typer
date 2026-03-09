import { G } from '../styles/theme.js';

const NAV_ITEMS = [
  { id: 'typer',    label: 'Typer',    icon: '✦' },
  { id: 'explorer', label: 'Explorer', icon: '◆' },
  { id: 'model',    label: 'Model',    icon: '♦' },
  { id: 'compare',  label: 'Compare',  icon: '⟷' },
];

// SVG circular progress wheel for mobile, shown between Explorer and Model buttons.
function ProgressWheel({ current, total }) {
  const r = 11;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? current / total : 0;
  const dash = circ * pct;
  return (
    <svg
      className="qt-progress-wheel"
      width={28} height={28}
      style={{ flexShrink: 0 }}
      viewBox="0 0 28 28"
    >
      {/* Track */}
      <circle cx={14} cy={14} r={r} fill="none" stroke={G.border} strokeWidth={3} />
      {/* Arc — starts from top (rotated -90deg) */}
      <circle
        cx={14} cy={14} r={r}
        fill="none"
        stroke={G.gold}
        strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 14 14)"
        style={{ transition: 'stroke-dasharray 0.3s' }}
      />
    </svg>
  );
}

export default function BottomNav({ view, setView, quizProgress }) {
  const pct = quizProgress ? (quizProgress.current / quizProgress.total) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', bottom: 'calc(12px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6,
      maxWidth: 'calc(100vw - 24px)',
    }}>
      {/* Desktop progress bar — hidden on mobile via .qt-progress-bar CSS class */}
      {quizProgress && (
        <div
          className="qt-progress-bar"
          style={{ height: 3, background: G.border, borderRadius: 2 }}
        >
          <div style={{
            height: '100%', background: G.gold, borderRadius: 2,
            width: `${pct}%`, transition: 'width 0.3s',
          }} />
        </div>
      )}

      {/* Nav buttons row */}
      <div style={{
        display: 'flex', gap: 4, background: G.bg2,
        border: `1px solid ${G.border}`, borderRadius: 20,
        padding: '6px 8px',
      }}>
        {NAV_ITEMS.map((item, idx) => (
          <>
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: view === item.id ? '6px 14px' : '6px 10px',
                borderRadius: 14, border: 'none',
                background: view === item.id ? G.gold : 'transparent',
                color: view === item.id ? G.bg : G.textDim,
                fontSize: 13, fontWeight: view === item.id ? 600 : 400,
                fontFamily: "'DM Sans',sans-serif",
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {view === item.id && <span>{item.label}</span>}
            </button>
            {/* Mobile progress wheel — inserted between Explorer (idx 1) and Model (idx 2) */}
            {idx === 1 && quizProgress && (
              <ProgressWheel current={quizProgress.current} total={quizProgress.total} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
