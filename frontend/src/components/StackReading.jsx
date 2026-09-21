import { G, POS, alpha } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import {
  COACHING_BANDS, DIAGNOSTIC, DIAGNOSTIC_NOTES, ACTIVATIONS, CLINICAL_SEQUENCE,
  CLINICAL_ORDER, FAILURE_MODES, TYPING_ERRORS, TEST_SET, TEST_SET_NOTE, STAGES,
} from '../data/stack.js';
import { POSITIONS } from '../data/shadow.js';

const MONO = "'DM Mono',monospace";
const nameOf = (pos) => POSITIONS[pos - 1].name;

// A band's levels are contiguous, so render them as a range rather than a list.
const levelRange = (levels) => (levels.length === 1
  ? `Level ${levels[0]}`
  : `Levels ${levels[0]}–${levels[levels.length - 1]}`);

/**
 * The reading half of the framework: how to infer a level from behaviour, and
 * what to do about it. Level-aware — the band and diagnostic rows matching the
 * scrubber's current level are highlighted, so the model and the reading stay
 * tied together rather than being two unrelated reference tables.
 */
export default function StackReading({ level = 1 }) {
  return (
    <>
      <div style={S.card} data-testid="reading-bands">
        <h3 style={S.h3}>Coaching bands</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>
          An overlay on the four stages that tracks Lead's status, which is why Reality-testing splits into two bands where the stage is one.
        </p>
        {COACHING_BANDS.map(b => {
          const here = b.levels.includes(level);
          const stage = STAGES.find(s => s.name === b.stage);
          return (
            <div
              key={b.id}
              data-testid={`reading-band-${b.id}`}
              data-current={here ? 'true' : 'false'}
              style={{
                padding: '10px 12px', borderRadius: 8, marginBottom: 8,
                background: here ? alpha(G.gold, 0.08) : G.bg3,
                border: `1px solid ${here ? alpha(G.gold, 0.35) : G.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: here ? G.gold : G.textDim }}>
                  {b.name} · {levelRange(b.levels)}
                </span>
                {stage && <span style={{ fontFamily: MONO, fontSize: 10, color: G.textFaint }}>{stage.pair}</span>}
              </div>
              <p style={{ ...S.body, fontSize: 13, marginBottom: 4 }}>{b.state}</p>
              <p style={{ ...S.body, fontSize: 13, color: here ? G.text : G.textDim }}>{b.approach}</p>
              <p style={{ fontSize: 12, color: G.textFaint, marginTop: 4 }}>{b.detail.join(' ')}</p>
            </div>
          );
        })}
      </div>

      <div style={S.card} data-testid="reading-diagnostic">
        <h3 style={S.h3}>Reading level from behaviour</h3>
        <p style={{ fontSize: 12, color: G.textFaint, marginBottom: 12 }}>{DIAGNOSTIC_NOTES.join(' ')}</p>
        {DIAGNOSTIC.map((d, i) => (
          <div
            key={i}
            data-testid="reading-diagnostic-row"
            data-level={d.level}
            style={{ padding: '8px 0', borderBottom: i < DIAGNOSTIC.length - 1 ? `1px solid ${G.border}` : 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <p style={{ ...S.body, fontSize: 13, flex: '1 1 220px' }}>{d.observation}</p>
              <span style={{ fontFamily: MONO, fontSize: 12, color: G.gold, whiteSpace: 'nowrap' }}>{d.level}</span>
            </div>
            <p style={{ fontSize: 11, color: G.textFaint, marginTop: 2 }}>{d.confidence}</p>
          </div>
        ))}
      </div>

      <div style={S.card} data-testid="reading-activations">
        <h3 style={S.h3}>Three activations</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>Visible in conversation, and each one names a position.</p>
        {ACTIVATIONS.map(a => (
          <div key={a.id} data-testid={`reading-activation-${a.id}`} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${POS[a.position]}` }}>
            <p style={{ fontFamily: MONO, fontSize: 12, color: POS[a.position], marginBottom: 2 }}>
              {a.name} · {nameOf(a.position)} (Position {a.position})
            </p>
            <p style={{ ...S.body, fontSize: 13 }}>{a.what}</p>
            <p style={{ ...S.body, fontSize: 12, color: G.textFaint }}>{a.advice}</p>
          </div>
        ))}
      </div>

      <div style={S.card} data-testid="reading-typing-errors">
        <h3 style={S.h3}>Typing errors the mechanism predicts</h3>
        {TYPING_ERRORS.map((t, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <p style={{ ...S.body, fontSize: 13 }}>{t.error}.</p>
            <p style={{ fontSize: 12, color: G.success }}>{t.check}.</p>
          </div>
        ))}
      </div>

      <div style={S.cardGold} data-testid="reading-clinical">
        <h3 style={S.h3}>Running the mechanism in reverse</h3>
        {CLINICAL_SEQUENCE.map(c => (
          <div key={c.step} data-testid={`reading-step-${c.step}`} style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, color: G.gold, marginBottom: 2 }}>{c.step}. {c.name}</p>
            <p style={{ ...S.body, fontSize: 13 }}>{c.detail}</p>
            <p style={{ fontSize: 12, color: G.textFaint }}>{c.note}</p>
          </div>
        ))}
        <p style={{ ...S.body, fontSize: 12, color: G.textFaint, paddingTop: 8, borderTop: `1px solid ${alpha(G.gold, 0.2)}` }}>{CLINICAL_ORDER}</p>
      </div>

      <div style={S.card} data-testid="reading-failure-modes">
        <h3 style={S.h3}>Two failure modes of premature growth work</h3>
        {FAILURE_MODES.map(f => (
          <div key={f.id} data-testid={`reading-failure-${f.id}`} style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: alpha(G.warn, 0.06), border: `1px solid ${alpha(G.warn, 0.2)}` }}>
            <p style={{ fontFamily: MONO, fontSize: 12, color: G.warn, marginBottom: 4 }}>{f.name} · Levels {f.levels}</p>
            <p style={{ ...S.body, fontSize: 13, marginBottom: 4 }}>{f.why} {f.detail}.</p>
            <p style={{ fontSize: 12, color: G.success }}>Correction: {f.correction}.</p>
          </div>
        ))}
      </div>

      <div style={S.card} data-testid="reading-test-set">
        <h3 style={S.h3}>How this could be wrong</h3>
        <p style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>
          Each is stated so that one clean observation decides it.
        </p>
        <ol style={{ ...S.body, fontSize: 13, paddingLeft: 20, marginBottom: 12 }}>
          {TEST_SET.map(t => (
            <li key={t.n} style={{ marginBottom: 6 }}>
              <strong style={{ color: G.text }}>{t.name}.</strong> {t.claim}
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 12, color: G.textFaint }}>{TEST_SET_NOTE}</p>
      </div>
    </>
  );
}
