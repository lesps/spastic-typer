import { G } from './theme.js';

export const S = {
  page: { minHeight: '100vh', background: G.bg, paddingBottom: 'calc(80px + env(safe-area-inset-bottom))', paddingTop: 'max(16px, env(safe-area-inset-top))' },
  container: { maxWidth: 680, margin: '0 auto', padding: '0 16px' },
  card: { background: G.bg2, border: `1px solid ${G.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 },
  cardGold: { background: G.bg2, border: `1px solid ${G.goldBorder}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 },
  h1: { fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: G.text, marginBottom: 8 },
  h2: { fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: G.text, marginBottom: 8 },
  h3: { fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: G.gold, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  body: { fontSize: 14, lineHeight: 1.65, color: G.textDim },
  mono: { fontFamily: "'DM Mono',monospace", color: G.gold, fontSize: 13 },
  btn: { background: G.gold, color: G.bg, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnOutline: { background: 'transparent', color: G.gold, border: `1px solid ${G.goldBorder}`, borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  btnDanger: { background: 'transparent', color: '#e85050', border: '1px solid rgba(232,80,80,0.3)', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  input: { background: G.bg3, border: `1px solid ${G.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 16, color: G.text, width: '100%', outline: 'none' },
  tag: { display: 'inline-block', background: G.goldDim, color: G.gold, borderRadius: 20, padding: '4px 10px', fontFamily: "'DM Mono',monospace", fontSize: 11 },
  divider: { height: 1, background: G.border, margin: '14px 0' },
};
