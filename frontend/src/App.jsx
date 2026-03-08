import { useState } from 'react';
import { baseCSS } from './styles/theme.js';
import BottomNav from './components/BottomNav.jsx';
import AuthView from './views/AuthView.jsx';
import GuidedTyper from './views/GuidedTyper.jsx';
import Explorer from './views/Explorer.jsx';
import MentalModel from './views/MentalModel.jsx';
import ComparePage from './views/ComparePage.jsx';
import ProfileView from './views/ProfileView.jsx';
import LookupView from './views/LookupView.jsx';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('ps_token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ps_user') || 'null'); } catch { return null; }
  });
  const [view, setView] = useState('typer');

  const handleLogin = (tok, u) => {
    setToken(tok);
    setUser(u);
    setView('typer');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return (
      <>
        <style>{baseCSS}</style>
        <AuthView onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <style>{baseCSS}</style>
      {view === 'typer' && <GuidedTyper token={token} />}
      {view === 'explorer' && <Explorer />}
      {view === 'model' && <MentalModel />}
      {view === 'compare' && <ComparePage user={user} />}
      {view === 'lookup' && <LookupView setView={setView} />}
      {view === 'profile' && <ProfileView token={token} user={user} onLogout={handleLogout} setView={setView} />}
      <BottomNav view={view} setView={setView} />
    </>
  );
}
