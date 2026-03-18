import { ENN_TYPES, ENN_ARROWS, ENN_CENTER } from '../data/enneagram.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';

// ─── Shared directive builder ──────────────────────────────────────────────

const INST_LABELS = { sp: 'Self-Preservation', sx: 'Sexual (One-to-One)', so: 'Social' };
const INST_DIRECTIVES = {
  sp: 'Frame advice in terms of stability, health, and resource management. They think in terms of security first.',
  sx: 'Depth and intensity matter. Superficiality disengages them — go one-on-one, be direct, be real.',
  so: 'Social context is salient. Reference group impact, belonging, and shared meaning.',
};

function buildPersonDirectives(ennType, wing, mbtiCode, instStack) {
  let out = '';
  const ennT = ennType != null ? ENN_TYPES[ennType] : null;
  const mbtiT = mbtiCode ? MBTI_TYPES[mbtiCode] : null;
  const arrows = ennType != null ? ENN_ARROWS[ennType] : null;
  const center = ennType != null ? ENN_CENTER[ennType] : null;

  // § Cognitive Style
  if (mbtiT) {
    const [dom, aux, , inf] = mbtiT.stack.map(fn => ({ fn, ...COG_FUNCTIONS[fn] }));
    const isExtroverted = dom.fn[1] === 'e';
    out += `### Cognitive Style\n\n`;
    out += `Dominant function is **${dom.fn}** (${dom.name}): ${dom.desc} `;
    out += `Auxiliary is **${aux.fn}** (${aux.name}): ${aux.desc}\n\n`;
    out += isExtroverted
      ? `Lead with external engagement — they process by doing and talking. Match their pace.\n\n`
      : `Give them room to process internally before expecting a response. Don't rush.\n\n`;
    if (inf?.shadow) {
      out += `Inferior **${inf.fn}** (${inf.name}) is their stress point. ${inf.shadow} Avoid patterns that activate this.\n\n`;
    }
  }

  // § Motivation & Core Drive
  if (ennT) {
    const centerNote = center === 'heart'
      ? 'Heart-center type — identity and image are core. Acknowledge who they are, not just what they do.'
      : center === 'gut'
      ? 'Gut-center type — autonomy and instinct are core. Respect their agency; don\'t over-explain or over-manage.'
      : 'Head-center type — security and certainty are core. Reduce ambiguity; give them frameworks to reason with.';
    out += `### Motivation & Core Drive\n\n`;
    out += `**Type ${ennType}${wing ? `w${wing}` : ''} — ${ennT.name}.** Core motivation: ${ennT.desire}. Core fear: ${ennT.fear}.\n\n`;
    out += `${centerNote}\n\n`;
    out += `Frame feedback as insight, not judgment. Never imply ${ennT.fear.toLowerCase()} — this activates their defensive pattern.\n\n`;
  }

  // § Communication Preferences
  if (mbtiCode) {
    const isE = mbtiCode[0] === 'E', isN = mbtiCode[1] === 'N';
    const isT = mbtiCode[2] === 'T', isJ = mbtiCode[3] === 'J';
    out += `### Communication Preferences\n\n`;
    out += `- **Pace:** ${isE ? 'Think out loud with them — rapid back-and-forth is energizing.' : 'Don\'t rush. They need time to process; silence is reflection, not disengagement.'}\n`;
    out += `- **Abstraction:** ${isN ? 'Comfortable with metaphor, pattern, and big-picture framing. Don\'t over-concretize.' : 'Anchor everything in concrete examples and practical specifics. Avoid vague abstractions.'}\n`;
    out += `- **Decision lens:** ${isT ? 'Lead with logic and objective evidence. Values-based appeals feel manipulative to them.' : 'Lead with human impact and values. Cold logic without context feels tone-deaf.'}\n`;
    out += `- **Structure:** ${isJ ? 'Provide clear structure, agendas, and closure. Open loops create friction.' : 'Allow iterative exploration. Premature closure feels constraining — keep options open.'}\n`;
    if (center) {
      out += `- **Emotional register:** ${center === 'heart' ? 'Acknowledge feelings and identity before jumping to solutions.' : center === 'gut' ? 'Be direct and respect their autonomy. Skip emotional preamble.' : 'Allow space for analysis before pressing for decisions.'}\n`;
    }
    out += '\n';
  }

  // § Under Stress
  if (arrows && ennT) {
    const stressT = ENN_TYPES[arrows.stress];
    out += `### Under Stress\n\n`;
    out += `Stress arrow moves toward **Type ${arrows.stress} (${stressT.name})** patterns. Watch for: ${stressT.fear.toLowerCase()}-driven behavior, signs of ${stressT.name.toLowerCase()} disintegration.\n\n`;
    const stressResponse = center === 'heart'
      ? 'Respond by affirming their value and effort — not their output.'
      : center === 'gut'
      ? 'Respond by giving them control over something concrete, even small.'
      : 'Respond by reducing uncertainty — give clear next steps, not open questions.';
    out += `${stressResponse}\n\n`;
  }

  // § Growth Edge
  if (arrows && ennT) {
    const growthT = ENN_TYPES[arrows.growth];
    out += `### Growth Edge\n\n`;
    out += `Growth arrow moves toward **Type ${arrows.growth} (${growthT.name})** qualities: ${growthT.desire.toLowerCase()}.\n\n`;
    out += `Gently encourage ${growthT.name} strengths when appropriate — don't force it, but create openings for it.\n\n`;
  }

  // § Instinctual Priorities
  if (instStack?.length) {
    out += `### Instinctual Priorities\n\n`;
    out += `Drive stack: **${instStack.map(i => i.toUpperCase()).join('/')}**\n\n`;
    out += `- **Primary (${instStack[0].toUpperCase()} — ${INST_LABELS[instStack[0]]}):** ${INST_DIRECTIVES[instStack[0]]}\n`;
    if (instStack[1]) out += `- **Secondary (${instStack[1].toUpperCase()} — ${INST_LABELS[instStack[1]]}):** Present but not dominant.\n`;
    if (instStack[2]) out += `- **Repressed (${instStack[2].toUpperCase()} — ${INST_LABELS[instStack[2]]}):** Don't lead with this domain — it's where they have least bandwidth.\n`;
    out += '\n';
  }

  return out;
}

// ─── Individual system prompt ───────────────────────────────────────────────

export function generateSystemPrompt(ennResult, mbtiResult) {
  let out = `You are assisting this person. Use the following profile to calibrate your responses.\n\n`;

  const instStack = ennResult?.instinctStack
    || (ennResult?.instScores ? Object.entries(ennResult.instScores).sort((a, b) => b[1] - a[1]).map(([k]) => k) : null);

  out += buildPersonDirectives(
    ennResult?.coreType ?? null,
    ennResult?.wing ?? null,
    mbtiResult?.result ?? null,
    instStack,
  );

  return out.trimEnd();
}

// ─── Group / compare system prompt ─────────────────────────────────────────

export function generateCompareSystemPrompt(persons) {
  let out = `You are assisting a group of ${persons.length} ${persons.length === 1 ? 'person' : 'people'}. Use the profiles below to calibrate how you respond to each person.\n\n`;

  persons.forEach(p => {
    out += `---\n\n## ${p.label}\n\n`;
    out += buildPersonDirectives(p.ennType, p.ennWing, p.mbti, p.instinctStack);
  });

  return out.trimEnd();
}

// ─── Utility ────────────────────────────────────────────────────────────────

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
