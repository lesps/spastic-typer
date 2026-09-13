import { useState, useEffect, useCallback } from 'react';
import { baseCSS } from './styles/theme.js';
import { parseHash, buildHash } from './utils/route.js';
import { useScrollToTop } from './utils/scroll.js';
import AppNav from './components/AppNav.jsx';
import GuidedTyper from './views/GuidedTyper.jsx';
import Explorer from './views/Explorer.jsx';
import MentalModel from './views/MentalModel.jsx';
import ComparePage from './views/ComparePage.jsx';

export default function App() {
  const [view, setViewState] = useState(() => parseHash(window.location.hash).view);
  const [explorerTab, setExplorerTab] = useState('enneagram');
  const [explorerSel, setExplorerSel] = useState(null);
  const [modelTab, setModelTab] = useState('mbti');

  // Navigation writes the hash; the hashchange listener keeps `view` in sync with it,
  // so browser back/forward and shared links all land on the right view.
  const setView = useCallback((next) => {
    setViewState(next);
    if (parseHash(window.location.hash).view !== next) window.location.hash = buildHash(next);
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
        {view === 'typer'    && <GuidedTyper setView={setView} setExplorerTab={setExplorerTab} setExplorerSel={setExplorerSel} setModelTab={setModelTab} />}
        {view === 'explorer' && <Explorer initialTab={explorerTab} initialSel={explorerSel} />}
        {view === 'model'    && <MentalModel setView={setView} initialTab={modelTab} />}
        {view === 'compare'  && <ComparePage />}
      </main>
      <AppNav view={view} setView={setView} />
    </>
  );
}
