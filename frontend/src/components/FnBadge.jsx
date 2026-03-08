import { FC, G } from '../styles/theme.js';

export default function FnBadge({ fn, size = 'sm' }) {
  const c = FC[fn] || G.gold;
  const sz = size === 'sm' ? { padding: '3px 8px', fontSize: 11 } : { padding: '5px 12px', fontSize: 13 };
  return (
    <span style={{ ...sz, background: `${c}22`, color: c, borderRadius: 12, fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>
      {fn}
    </span>
  );
}
