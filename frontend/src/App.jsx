import { useState, useEffect, useCallback } from 'react';
import { baseCSS } from './styles/theme.js';
import { parseHash, buildHash } from './utils/route.js';
import { useScrollToTop } from './utils/scroll.js';
import AppNav from './components/AppNav.jsx';
import GuidedTyper from './views/GuidedTyper.jsx';
import Explorer from './views/Explorer.jsx';
import ComparePage from './views/ComparePage.jsx';

export default function App() {
  const [view, setViewState] = useState(() => parseHash(window.location.hash).view);
  const [explorerTab, setExplorerTab] = useState('enneagram');
  const [explorerSel, setExplorerSel] = useState(null);

  // Navigation writes the hash; the hashchange listener keeps `view` in sync with it,
  // so browser back/forward and shared links all land on the right view.
  const setView = useCallback((next) => {
    setViewState(next);
    if (parseHash(window.location.hash).view !== next) window.location.hash = buildHash(next);
  }, []);

  // Rewrite legacy hashes (#/model, #p1=…) to their canonical form without adding a history entry.
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const { view: v, query } = parseHash(hash);
    const canonical = buildHash(v, query);
    if (hash !== canonical) window.history.replaceState(null, '', canonical);
  }, []);

  useEffect(() => {
    const onHashChange = () => setViewState(parseHash(window.location.hash).view);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useScrollToTop(view);

  return (
    <>
      <style>{baseCSS}</style>
      <main>
        {view === 'typer'    && <GuidedTyper setView={setView} setExplorerTab={setExplorerTab} setExplorerSel={setExplorerSel} />}
        {view === 'explorer' && <Explorer initialTab={explorerTab} initialSel={explorerSel} />}
        {view === 'compare'  && <ComparePage />}
      </main>
      <AppNav view={view} setView={setView} />
    </>
  );
}
