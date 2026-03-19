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
body,html{background:#08080c;color:#f0ede8;font-family:'DM Sans',sans-serif;min-height:100vh}
::selection{background:rgba(232,184,75,0.15)}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(232,184,75,0.3);border-radius:3px}
button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer}
input,textarea{-webkit-appearance:none;appearance:none}
@media(max-width:680px){
  .qpage{display:flex;flex-direction:column}
  .qbody{flex:1;display:flex;flex-direction:column;justify-content:center}
  .qcard{padding:20px 22px!important}
}
`;
