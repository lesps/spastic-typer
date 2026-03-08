import { useState } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { ENN_TYPES, WING_DESC } from '../data/enneagram.js';
import FnBadge from '../components/FnBadge.jsx';
import { apiLookupUser } from '../api.js';

export default function LookupView({ setView }) {
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setProfile(null);
    try {
      const data = await apiLookupUser(input.trim());
      setProfile(data);
    } catch (e) {
      setError(e.message || 'User not found');
    } finally { setLoading(false); }
  };

  const handleAddToCompare = () => {
    if (!profile) return;
    sessionStorage.setItem('ps_compare_import', JSON.stringify(profile));
    setView('compare');
  };

  const ennT = profile?.enn_type ? ENN_TYPES[profile.enn_type] : null;
  const mbtiT = profile?.mbti_type ? MBTI_TYPES[profile.mbti_type] : null;
  const wKey = profile?.enn_type && profile?.enn_wing ? `${profile.enn_type}w${profile.enn_wing}` : null;
  const hasProfile = profile && (profile.enn_type || profile.mbti_type);

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
        <h1 style={S.h1}>User Lookup</h1>
        <p style={S.body}>Find anyone's type profile by username</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          placeholder="Enter a username..."
          autoComplete="off"
        />
        <button onClick={handleLookup} disabled={loading} style={{ ...S.btn, padding: '10px 20px', opacity: loading ? 0.7 : 1 }}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{ ...S.card, borderColor: 'rgba(232,80,80,0.3)', textAlign: 'center', padding: 20 }}>
          <p style={{ color: '#e85050', fontSize: 14 }}>{error}</p>
        </div>
      )}

      {profile && !hasProfile && (
        <div style={{ ...S.card, textAlign: 'center', padding: 24 }}>
          <p style={{ ...S.mono, fontSize: 14, marginBottom: 8 }}>@{profile.username}</p>
          <p style={{ ...S.body, fontSize: 13 }}>This user hasn't set a type profile yet.</p>
        </div>
      )}

      {profile && hasProfile && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p style={{ ...S.mono, fontSize: 14, color: G.gold }}>@{profile.username}</p>
          </div>

          {ennT && (
            <div style={S.card}>
              <h3 style={S.h3}>Enneagram</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={{ ...S.mono, fontSize: 20 }}>{profile.enn_type}w{profile.enn_wing || '?'}</span>
                {profile.enn_instinct && <span style={S.tag}>{profile.enn_instinct.toUpperCase()}</span>}
                {profile.enn_wing_strength && <span style={{ fontSize: 12, color: G.textFaint }}>{profile.enn_wing_strength}</span>}
              </div>
              <p style={{ ...S.body, fontWeight: 500, color: G.text, marginBottom: 4 }}>{ennT.name}</p>
              <p style={{ ...S.body, fontSize: 13 }}>{ennT.desc}</p>
              <div style={S.divider} />
              <h3 style={S.h3}>Core Fear</h3><p style={{ ...S.body, fontSize: 13 }}>{ennT.fear}</p>
              <div style={S.divider} />
              <h3 style={S.h3}>Core Desire</h3><p style={{ ...S.body, fontSize: 13 }}>{ennT.desire}</p>
              {wKey && WING_DESC[wKey] && (
                <>
                  <div style={S.divider} />
                  <h3 style={S.h3}>Wing: {wKey}</h3>
                  <p style={{ ...S.body, fontSize: 13 }}>{WING_DESC[wKey]}</p>
                </>
              )}
            </div>
          )}

          {mbtiT && (
            <div style={S.card}>
              <h3 style={S.h3}>MBTI</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={{ ...S.mono, fontSize: 20 }}>{profile.mbti_type}</span>
                <span style={{ fontSize: 14, color: G.textDim }}>{mbtiT.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {mbtiT.stack.map((fn, i) => (
                  <div key={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 9, color: G.textFaint, fontFamily: "'DM Mono',monospace" }}>{['DOM', 'AUX', 'TER', 'INF'][i]}</span>
                    <FnBadge fn={fn} size="md" />
                  </div>
                ))}
              </div>
              <p style={{ ...S.body, fontSize: 13 }}>{mbtiT.desc}</p>
            </div>
          )}

          <button onClick={handleAddToCompare} style={{ ...S.btn, width: '100%', marginTop: 8 }}>
            Add to Compare
          </button>
        </>
      )}
    </div></div>
  );
}
