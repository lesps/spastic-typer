import { G } from '../styles/theme.js';

export default function ProgressBar({ current, total }) {
  return (
    <div style={{ height: 3, background: G.border, borderRadius: 2, marginBottom: 20 }}>
      <div style={{ height: '100%', background: G.gold, borderRadius: 2, width: `${(current / total) * 100}%`, transition: 'width 0.3s' }} />
    </div>
  );
}
