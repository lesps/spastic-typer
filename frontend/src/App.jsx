import { useState } from 'react';
import { baseCSS } from './styles/theme.js';
import BottomNav from './components/BottomNav.jsx';
import GuidedTyper from './views/GuidedTyper.jsx';
import Explorer from './views/Explorer.jsx';
import MentalModel from './views/MentalModel.jsx';
import ComparePage from './views/ComparePage.jsx';

export default function App() {
  const [view, setView] = useState('typer');

  return (
    <>
      <style>{baseCSS}</style>
      {view === 'typer'    && <GuidedTyper />}
      {view === 'explorer' && <Explorer />}
      {view === 'model'    && <MentalModel />}
      {view === 'compare'  && <ComparePage />}
      <BottomNav view={view} setView={setView} />
    </>
  );
}
