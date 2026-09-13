import { G, hexToRgb } from '../styles/theme.js';

// Linearly interpolate from the gold token to the success token by certainty (0–1)
export function certaintyColor(certainty) {
  const from = hexToRgb(G.gold), to = hexToRgb(G.success);
  const [r, g, b] = from.map((v, i) => Math.round(v + (to[i] - v) * certainty));
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
