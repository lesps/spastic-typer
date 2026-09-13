export const G = {
  bg: '#08080c',
  bg2: '#0f0f15',
  bg3: '#16161e',
  gold: '#e8b84b',
  goldDim: 'rgba(232,184,75,0.15)',
  goldBorder: 'rgba(232,184,75,0.3)',
  text: '#f0ede8',
  textDim: 'rgba(240,237,232,0.55)',
  textFaint: 'rgba(240,237,232,0.3)',
  border: 'rgba(255,255,255,0.08)',
  // Semantic accents
  success: '#50c878',
  warn: '#e88050',
  danger: '#e85050',
  dangerSoft: '#e88080',
  info: '#5090d0',
  infoSoft: '#60a0d0',
  plum: '#b850c0',
  amber: '#e8a030',
  indigo: '#7070c0',
  overlay: 'rgba(0,0,0,0.8)',
  bgHover: 'rgba(255,255,255,0.02)',
};

// Enneagram centers of intelligence
export const CENTER = { gut: '#e07040', heart: '#c060a0', head: '#5090d0' };
// One accent per personality system (Integration tab, system tags)
export const SYSTEM = { enneagram: '#c060a0', mbti: '#5090d0', instinct: '#30a888' };
// 8-position stack: ego arc 1–4, shadow arc 5–8
export const POS = { 1: G.gold, 2: '#5090d0', 3: '#30a888', 4: '#e88050', 5: '#c06050', 6: '#a05070', 7: '#806080', 8: '#605070' };

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
// alpha(G.success, 0.2) → 'rgba(80,200,120,0.2)'
export function alpha(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

export const FC = {
  Ne: '#e8a030',
  Ni: '#c45a10',
  Se: '#30a888',
  Si: '#1a7860',
  Te: '#4a88d8',
  Ti: '#2055b0',
  Fe: '#b850c0',
  Fi: '#7830a0',
};

export const baseCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--nav-pad-bottom:calc(64px + env(safe-area-inset-bottom));--nav-pad-top:max(16px,env(safe-area-inset-top))}
body,html{background:#08080c;color:#f0ede8;font-family:'DM Sans',sans-serif;min-height:100vh}
button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:2px solid rgba(232,184,75,0.8);outline-offset:2px}
.nav-shell{position:fixed;left:0;right:0;bottom:0;z-index:50;padding:8px 12px calc(8px + env(safe-area-inset-bottom));border-top:1px solid}
.nav-inner{max-width:680px;margin:0 auto;display:flex;align-items:center;gap:12px}
.nav-brand{display:none;white-space:nowrap}
.nav-tabs{display:flex;gap:4px;flex:1;padding:4px;border-radius:14px}
.nav-btn{flex:1;border:none;border-radius:10px;padding:8px 6px;font-size:13px;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:background .15s,color .15s}
@media(min-width:681px){
  :root{--nav-pad-bottom:40px;--nav-pad-top:76px}
  .person-bar{position:sticky;top:60px;z-index:5}
  .nav-shell{top:0;bottom:auto;padding:10px 16px;border-top:none;border-bottom:1px solid}
  .nav-brand{display:block}
  .nav-tabs{flex:0 0 auto;margin-left:auto}
  .nav-btn{flex:0 0 auto;padding:7px 16px}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
::selection{background:rgba(232,184,75,0.15)}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(232,184,75,0.3);border-radius:3px}
button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer}
input,textarea{-webkit-appearance:none;appearance:none}
details>summary{list-style:none}
details>summary::-webkit-details-marker{display:none}
.intro-chev{display:inline-block;transition:transform .15s}
details[open] .intro-chev{transform:rotate(90deg)}
@keyframes stack-pulse{0%{stroke-width:2;filter:brightness(1)}40%{stroke-width:5;filter:brightness(1.6)}100%{stroke-width:2;filter:brightness(1)}}
.stack-pulse{animation:stack-pulse 1.1s ease-out 2}
.qpage{display:flex;flex-direction:column}
.qbody{flex:1;display:flex;flex-direction:column;justify-content:center}
@media(max-width:680px){
  .qcard{padding:20px 22px!important}
}
`;
