import { G } from '../styles/theme.js';

// Linearly interpolate between gold (#e8b84b) and green (#50c878) by certainty (0–1)
function certaintyColor(certainty) {
  const r = Math.round(0xe8 + (0x50 - 0xe8) * certainty);
  const g = Math.round(0xb8 + (0xc8 - 0xb8) * certainty);
  const b = Math.round(0x4b + (0x78 - 0x4b) * certainty);
  return `rgb(${r},${g},${b})`;
}

export default function ProgressBar({ current, total, certainty = 0 }) {
  return (
    <div style={{ height: 3, background: G.border, borderRadius: 2, marginTop: 8, marginBottom: 20 }}>
      <div style={{
        height: '100%',
        background: certaintyColor(certainty),
        borderRadius: 2,
        width: `${(current / total) * 100}%`,
        transition: 'width 0.3s, background 0.4s',
      }} />
    </div>
  );
}
