import { ENN_TYPES, ENN_ARROWS, ENN_CENTER, ENN_HARMONIC } from '../data/enneagram.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { WING_DESC } from '../data/enneagram.js';

export function generateExportMarkdown(ennResult, mbtiResult) {
  const now = new Date().toISOString().split('T')[0];
  let md = `# Personality Profile\n\n`;
  md += `> **Context for AI assistants:** Structured personality typing data. Use to calibrate communication style and anticipate reasoning patterns.\n`;
  md += `> Exported: ${now}\n\n---\n\n`;

  if (ennResult) {
    const core = ennResult.coreType, t = ENN_TYPES[core];
    const wKey = `${core}w${ennResult.wing}`;
    const arrows = ENN_ARROWS[core], center = ENN_CENTER[core], harmonic = ENN_HARMONIC[core];
    md += `## Enneagram\n\n**Result:** ${ennResult.display}\n\n`;
    md += `### Core Type: ${core} — ${t.name}\n\n${t.desc}\n\n`;
    md += `- **Core Fear:** ${t.fear}\n- **Core Desire:** ${t.desire}\n`;
    md += `- **Center:** ${center.charAt(0).toUpperCase() + center.slice(1)} — ${center === 'gut' ? 'instinct, anger, autonomy' : center === 'heart' ? 'emotion, image, identity' : 'thinking, fear, security'}\n`;
    md += `- **Harmonic Group:** ${harmonic.charAt(0).toUpperCase() + harmonic.slice(1)}\n`;
    md += `- **Growth Arrow:** → Type ${arrows.growth} (${ENN_TYPES[arrows.growth].name})\n`;
    md += `- **Stress Arrow:** → Type ${arrows.stress} (${ENN_TYPES[arrows.stress].name})\n\n`;
    md += `### Wing: ${wKey}\n\n${WING_DESC[wKey] || ''}\n\n`;
    const instStack = ennResult.instinctStack || (ennResult.instScores ? Object.entries(ennResult.instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k) : null);
    const instLabels = { sp: 'Self-Preservation', sx: 'Sexual (One-to-One)', so: 'Social' };
    const instDescs = { sp: 'Primary focus on physical security, health, comfort, and resource management.', sx: 'Primary focus on intensity, chemistry, and transformative one-on-one connection.', so: 'Primary focus on group belonging, social roles, and contribution.' };
    if (instStack) {
      md += `### Instinctual Drive Stack: ${instStack.map(i => i.toUpperCase()).join('/')}\n\n`;
      instStack.forEach((inst, i) => {
        md += `${['**Dominant**', '**Secondary**', '**Repressed**'][i]} — **${inst.toUpperCase()} · ${instLabels[inst]}:** ${instDescs[inst]}\n\n`;
      });
    }
    if (ennResult.scores) {
      const sorted = Object.entries(ennResult.scores).sort((a, b) => b[1] - a[1]);
      md += `### Assessment Scores\n\n| Type | Score | Name |\n|------|-------|------|\n`;
      sorted.forEach(([tp, sc]) => { md += `| ${parseInt(tp) === ennResult.coreType ? '**' : ''}${tp}${parseInt(tp) === ennResult.coreType ? '**' : ''} | ${sc > 0 ? '+' : ''}${sc} | ${ENN_TYPES[parseInt(tp)]?.name} |\n`; });
      md += `\n*Scores: agreement with type-specific statements on -3 to +3 scale.*\n\n`;
    }
    md += `---\n\n`;
  }

  if (mbtiResult) {
    const code = mbtiResult.result, t = MBTI_TYPES[code], scores = mbtiResult.scores;
    md += `## MBTI / Cognitive Functions\n\n**Result:** ${code}\n\n`;
    if (t) {
      md += `### ${code} — ${t.name}\n\n${t.desc}\n\n`;
      md += `### Cognitive Function Stack\n\n`;
      t.stack.forEach((fn, i) => {
        const f = COG_FUNCTIONS[fn];
        const pos = ['**Dominant (Hero)**', '**Auxiliary (Parent)**', '**Tertiary (Child)**', '**Inferior (Aspiration)**'][i];
        md += `${i + 1}. ${pos} — **${fn}** (${f.name})\n   ${f.desc}\n\n`;
      });
      md += `### Practical Implications\n\n`;
      md += `- **Dominant ${t.stack[0]}** is this person's natural mode.\n`;
      md += `- **Auxiliary ${t.stack[1]}** is their supporting function.\n`;
      md += `- **Inferior ${t.stack[3]}** (${COG_FUNCTIONS[t.stack[3]].name}) is their growth edge and stress point.\n`;
      if (t.ennCorr) md += `- **Common Enneagram correlations:** Types ${t.ennCorr}\n`;
      md += '\n';
    }
    if (scores) {
      md += `### Dimension Scores\n\n| Dimension | A | B | Preference |\n|-----------|---|---|------------|\n`;
      [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']].forEach(([a, b]) => {
        const sa = scores[a] || 0, sb = scores[b] || 0, pref = sa >= sb ? a : b;
        const clarity = sa + sb > 0 ? Math.round(Math.abs(sa - sb) / (sa + sb) * 100) : 0;
        md += `| ${a}/${b} | ${sa} | ${sb} | **${pref}** (${clarity}% clarity)\n`;
      });
      md += `\n*Low clarity (< 30%) suggests a near-even split on that dimension.*\n\n`;
    }
    md += `---\n\n`;
  }

  if (ennResult && mbtiResult) {
    const ennCore = ennResult.coreType, mbtiCode = mbtiResult.result;
    const t = MBTI_TYPES[mbtiCode], ennT = ENN_TYPES[ennCore];
    const center = ENN_CENTER[ennCore], instStack2 = ennResult.instinctStack, inst = instStack2?.[0] || ennResult.instinct;
    const isE = mbtiCode[0] === 'E', isN = mbtiCode[1] === 'N', isT = mbtiCode[2] === 'T', isJ = mbtiCode[3] === 'J';
    const instDisplay = instStack2 ? instStack2.map(i => i.toUpperCase()).join('/') : (ennResult.instinct?.toUpperCase() || '');
    md += `## Cross-System Synthesis\n\n**Combined Profile:** ${ennResult.coreType}w${ennResult.wing} ${instDisplay} + ${mbtiCode}\n\n`;
    md += `The Enneagram ${ennCore} (${ennT.name}) describes *why* this person is motivated. The ${mbtiCode} (${t?.name}) describes *how* they process and act.\n\n`;
    md += `### Communication Preferences\n\n`;
    md += `- **Pace:** ${isE ? 'Thinks out loud; rapid back-and-forth.' : 'Needs time to process; don\'t rush responses.'}\n`;
    md += `- **Abstraction:** ${isN ? 'Comfortable with metaphor and big-picture framing.' : 'Prefers concrete examples and practical specifics.'}\n`;
    md += `- **Decision lens:** ${isT ? 'Responds to logic and objective evidence.' : 'Responds to values-based framing and human impact.'}\n`;
    md += `- **Structure:** ${isJ ? 'Appreciates closure and clear agendas.' : 'Appreciates flexibility and iterative exploration.'}\n`;
    md += `- **Emotional register:** ${center === 'heart' ? 'Acknowledge feelings before solutions.' : center === 'gut' ? 'Respect agency and directness.' : 'Allow space for analysis before decisions.'}\n`;
    md += `- **Instinctual focus:** ${inst === 'sp' ? 'Frame advice in terms of security and practicality.' : inst === 'sx' ? 'Depth matters — superficiality will disengage them.' : 'Social context and group impact are salient.'}\n\n`;
    md += `### Tips for AI\n\n`;
    md += `1. Lead with ${t?.stack[0][1] === 'e' ? 'external structure and action' : 'internal depth and conceptual precision'}.\n`;
    md += `2. Respect their drive to ${ennT.desire.toLowerCase()}.\n`;
    md += `3. Avoid implying ${ennT.fear.toLowerCase()}.\n`;
    md += `4. Under stress: watch for Type ${ENN_ARROWS[ennCore].stress} (${ENN_TYPES[ENN_ARROWS[ennCore].stress].name}) patterns.\n`;
    md += `5. Growth edge: Type ${ENN_ARROWS[ennCore].growth} (${ENN_TYPES[ENN_ARROWS[ennCore].growth].name}) qualities.\n\n`;
  }

  md += `*Generated by Personality Suite.*`;
  return md;
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
