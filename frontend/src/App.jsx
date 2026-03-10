import { useState } from 'react';
import { baseCSS } from './styles/theme.js';
import BottomNav from './components/BottomNav.jsx';
import GuidedTyper from './views/GuidedTyper.jsx';
import Explorer from './views/Explorer.jsx';
import MentalModel from './views/MentalModel.jsx';
import ComparePage from './views/ComparePage.jsx';

export default function App() {
  const [view, setView] = useState('typer');
  const [explorerTab, setExplorerTab] = useState('enneagram');
  const [explorerSel, setExplorerSel] = useState(null);
  const [quizProgress, setQuizProgress] = useState(null);

  return (
    <>
      <style>{baseCSS}</style>
      {view === 'typer'    && <GuidedTyper setView={setView} setExplorerTab={setExplorerTab} setExplorerSel={setExplorerSel} setQuizProgress={setQuizProgress} />}
      {view === 'explorer' && <Explorer initialTab={explorerTab} initialSel={explorerSel} />}
      {view === 'model'    && <MentalModel setView={setView} />}
      {view === 'compare'  && <ComparePage />}
      <BottomNav view={view} setView={setView} quizProgress={quizProgress} />
    </>
  );
}
