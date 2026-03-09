import { G } from '../styles/theme.js';

const NAV_ITEMS = [
  { id: 'typer',    label: 'Typer',    icon: '✏' },
  { id: 'explorer', label: 'Explorer', icon: '◎' },
  { id: 'model',    label: 'Model',    icon: '⊕' },
  { id: 'compare',  label: 'Compare',  icon: '⟷' },
];

export default function BottomNav({ view, setView, quizProgress }) {
  const pct = quizProgress ? (quizProgress.current / quizProgress.total) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', bottom: 'calc(12px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6,
      maxWidth: 'calc(100vw - 24px)',
    }}>
      {/* Progress bar — thin gold line above the nav pill on all screen sizes */}
      {quizProgress && (
        <button
          className="qt-progress-bar"
          onClick={() => setView('typer')}
          aria-label="Return to active quiz"
          style={{ height: 3, background: G.border, borderRadius: 2, border: 'none', padding: 0, cursor: 'pointer', display: 'block', width: '100%' }}
        >
          <div style={{
            height: '100%', background: G.gold, borderRadius: 2,
            width: `${pct}%`, transition: 'width 0.3s',
          }} />
        </button>
      )}

      {/* Nav buttons row */}
      <div style={{
        display: 'flex', gap: 4, background: G.bg2,
        border: `1px solid ${G.border}`, borderRadius: 20,
        padding: '6px 8px',
      }}>
        {NAV_ITEMS.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
