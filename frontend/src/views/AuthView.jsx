import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { apiLogin, apiRegister } from '../api.js';

export default function AuthView({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = tab === 'login'
        ? await apiLogin(username, password)
        : await apiRegister(username, password);
      localStorage.setItem('ps_token', data.token);
      localStorage.setItem('ps_user', JSON.stringify({ username: data.username }));
      onLogin(data.token, { username: data.username });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: G.text, marginBottom: 8 }}>
            Personality Suite
          </h1>
          <p style={{ ...S.body, fontSize: 15 }}>Type yourself. Understand others.</p>
        </div>
        <div style={{ ...S.card, padding: '24px' }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: G.bg3, borderRadius: 10, padding: 4 }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: tab === t ? G.bg2 : 'transparent', color: tab === t ? G.text : G.textDim, fontSize: 14, fontWeight: tab === t ? 500 : 400, fontFamily: "'DM Sans',sans-serif", textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Username</label>
              <input
                style={S.input}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="3–30 chars, letters/numbers/_"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 6 }}>Password</label>
              <input
                style={S.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={tab === 'register' ? 'At least 8 characters' : 'Your password'}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                required
              />
            </div>
            {error && <p style={{ color: '#e85050', fontSize: 13, lineHeight: 1.5 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...S.btn, width: '100%', padding: '12px', fontSize: 15, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? '...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
        <p style={{ ...S.body, textAlign: 'center', marginTop: 16, fontSize: 12 }}>
          Discover your MBTI & Enneagram type. Save and share your profile.
        </p>
      </div>
    </div>
  );
}
