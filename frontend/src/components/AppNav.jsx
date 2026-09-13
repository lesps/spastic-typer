import { G } from '../styles/theme.js';

export const NAV_ITEMS = [
  { id: 'typer',    label: 'Typer' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'compare',  label: 'Compare' },
];

// Fixed bottom tab bar on phones; fixed top bar with a brand mark from 681px up.
// Positioning lives in baseCSS (.nav-*) because it is breakpoint-dependent; colors stay inline.
export default function AppNav({ view, setView }) {
  return (
    <nav aria-label="Primary" className="nav-shell" style={{ background: G.bg2, borderColor: G.border }}>
      <div className="nav-inner">
        <span className="nav-brand" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: G.text }}>
          Spastic<span style={{ color: G.gold }}> · </span>Typer
        </span>
        <div className="nav-tabs" style={{ background: G.bg3, border: `1px solid ${G.border}` }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className="nav-btn"
                data-view={item.id}
                aria-current={active ? 'page' : undefined}
                onClick={() => setView(item.id)}
                style={{
                  background: active ? G.gold : 'transparent',
                  color: active ? G.bg : G.textDim,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
