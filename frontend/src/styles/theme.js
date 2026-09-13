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
};

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
  .nav-shell{top:0;bottom:auto;padding:10px 16px;border-top:none;border-bottom:1px solid}
  .nav-brand{display:block}
  .nav-tabs{flex:0 0 auto;margin-left:auto}
  .nav-btn{flex:0 0 auto;padding:7px 16px}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
::selection{background:rgba(232,184,75,0.15)}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(232,184,75,0.3);border-radius:3px}
button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer}
input,textarea{-webkit-appearance:none;appearance:none}
details>summary{list-style:none}
details>summary::-webkit-details-marker{display:none}
.qpage{display:flex;flex-direction:column}
.qbody{flex:1;display:flex;flex-direction:column;justify-content:center}
@media(max-width:680px){
  .qcard{padding:20px 22px!important}
}
`;
