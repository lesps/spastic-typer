import { useState, useEffect } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { ENN_TYPES, WING_DESC } from '../data/enneagram.js';
import FnBadge from '../components/FnBadge.jsx';
import { apiGetMyProfile, apiUpdateProfile } from '../api.js';

export default function ProfileView({ token, user, onLogout, setView }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [draft, setDraft] = useState({});

  useEffect(() => {
    apiGetMyProfile(token).then(p => {
      setProfile(p);
      setDraft({
        mbti_type: p.mbti_type || '',
        enn_type: p.enn_type || '',
        enn_wing: p.enn_wing || '',
        enn_instinct: p.enn_instinct || '',
        enn_wing_strength: p.enn_wing_strength || '',
      });
    }).catch(() => {});
  }, [token]);

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const payload = {};
      if (draft.mbti_type) payload.mbti_type = draft.mbti_type || null;
      if (draft.enn_type) payload.enn_type = parseInt(draft.enn_type) || null;
      if (draft.enn_wing) payload.enn_wing = parseInt(draft.enn_wing) || null;
      if (draft.enn_instinct) payload.enn_instinct = draft.enn_instinct || null;
      if (draft.enn_wing_strength) payload.enn_wing_strength = draft.enn_wing_strength || null;
      const updated = await apiUpdateProfile(token, payload);
      setProfile(updated);
      setEditing(false);
      setSaveMsg('✓ Saved');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg(`Error: ${e.message}`);
    } finally { setSaving(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('ps_token');
    localStorage.removeItem('ps_user');
    onLogout();
  };

  const ennT = profile?.enn_type ? ENN_TYPES[profile.enn_type] : null;
  const mbtiT = profile?.mbti_type ? MBTI_TYPES[profile.mbti_type] : null;
  const wKey = profile?.enn_type && profile?.enn_wing ? `${profile.enn_type}w${profile.enn_wing}` : null;

  const adjWing1 = draft.enn_type ? (parseInt(draft.enn_type) === 1 ? 9 : parseInt(draft.enn_type) - 1) : null;
  const adjWing2 = draft.enn_type ? (parseInt(draft.enn_type) === 9 ? 1 : parseInt(draft.enn_type) + 1) : null;

  return (
    <div style={S.page}><div style={S.container}>
      <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ ...S.h1, marginBottom: 4 }}>My Profile</h1>
          <p style={{ ...S.mono, fontSize: 12 }}>@{user.username}</p>
        </div>
        <button onClick={handleLogout} style={{ ...S.btnDanger, padding: '8px 14px', fontSize: 12 }}>Logout</button>
      </div>

      {!profile && <div style={{ ...S.card, textAlign: 'center', padding: 24 }}><p style={S.body}>Loading...</p></div>}

      {profile && !editing && (
        <>
          {!profile.enn_type && !profile.mbti_type ? (
            <div style={{ ...S.cardGold, textAlign: 'center', padding: 24 }}>
              <p style={{ ...S.body, marginBottom: 12 }}>No type profile set yet.</p>
              <p style={{ ...S.body, fontSize: 13 }}>Take a quiz in the Typer tab and save your result, or manually set your types below.</p>
              <button onClick={() => setEditing(true)} style={{ ...S.btn, marginTop: 16, padding: '10px 24px' }}>Set My Types</button>
            </div>
          ) : (
            <>
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
                  {wKey && WING_DESC[wKey] && (
                    <>
                      <div style={S.divider} />
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
            </>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setEditing(true)} style={{ ...S.btnOutline, flex: 1 }}>Edit Types</button>
            <button onClick={() => setView('lookup')} style={{ ...S.btnOutline, flex: 1 }}>Look Up Others</button>
          </div>
          {saveMsg && <p style={{ ...S.body, color: '#50c878', textAlign: 'center', marginTop: 8 }}>{saveMsg}</p>}
        </>
      )}

      {profile && editing && (
        <div style={S.card}>
          <h3 style={{ ...S.h3, marginBottom: 16 }}>Edit Types</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 8 }}>Enneagram Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => (
                <button key={t} onClick={() => setDraft(d => ({ ...d, enn_type: String(t), enn_wing: '', enn_wing_strength: '' }))} style={{ padding: '8px 4px', borderRadius: 8, border: `1px solid ${String(draft.enn_type) === String(t) ? G.gold : G.border}`, background: String(draft.enn_type) === String(t) ? G.goldDim : G.bg3, color: String(draft.enn_type) === String(t) ? G.gold : G.textDim, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {draft.enn_type && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 8 }}>Wing</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[adjWing1, adjWing2].map(w => w && (
                  <button key={w} onClick={() => setDraft(d => ({ ...d, enn_wing: String(w) }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${String(draft.enn_wing) === String(w) ? G.gold : G.border}`, background: String(draft.enn_wing) === String(w) ? G.goldDim : G.bg3, color: String(draft.enn_wing) === String(w) ? G.gold : G.textDim, fontSize: 13 }}>
                    {draft.enn_type}w{w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {draft.enn_wing && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 8 }}>Wing Strength</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['balanced', 'moderate', 'strong'].map(s => (
                  <button key={s} onClick={() => setDraft(d => ({ ...d, enn_wing_strength: s }))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${draft.enn_wing_strength === s ? G.gold : G.border}`, background: draft.enn_wing_strength === s ? G.goldDim : G.bg3, color: draft.enn_wing_strength === s ? G.gold : G.textDim, fontSize: 12, textTransform: 'capitalize' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 8 }}>Instinctual Variant</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {['sp', 'sx', 'so'].map(i => (
                <button key={i} onClick={() => setDraft(d => ({ ...d, enn_instinct: i }))} style={{ padding: '8px', borderRadius: 8, border: `1px solid ${draft.enn_instinct === i ? G.gold : G.border}`, background: draft.enn_instinct === i ? G.goldDim : G.bg3, color: draft.enn_instinct === i ? G.gold : G.textDim, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
                  {i.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: G.textDim, display: 'block', marginBottom: 8 }}>MBTI Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
              {Object.keys(MBTI_TYPES).map(t => (
                <button key={t} onClick={() => setDraft(d => ({ ...d, mbti_type: t }))} style={{ padding: '7px 4px', borderRadius: 8, border: `1px solid ${draft.mbti_type === t ? G.gold : G.border}`, background: draft.mbti_type === t ? G.goldDim : G.bg3, color: draft.mbti_type === t ? G.gold : G.textDim, fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {saveMsg && <p style={{ color: saveMsg.startsWith('✓') ? '#50c878' : '#e85050', fontSize: 13, marginBottom: 10 }}>{saveMsg}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{ ...S.btn, flex: 1, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setSaveMsg(''); }} style={{ ...S.btnOutline, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}
    </div></div>
  );
}
