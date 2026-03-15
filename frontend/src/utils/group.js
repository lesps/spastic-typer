import { ENN_CENTER, ENN_HARMONIC, ENN_ARROWS } from '../data/enneagram.js';
import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { G } from '../styles/theme.js';

export function analyzeGroup(persons) {
  const insights = [];
  const ep = persons.filter(p => p.ennType);
  const mp = persons.filter(p => p.mbti);

  if (ep.length >= 2) {
    const cc = { gut: 0, heart: 0, head: 0 };
    ep.forEach(p => { cc[ENN_CENTER[p.ennType]]++; });
    const activeCenters = Object.entries(cc).filter(([, v]) => v > 0);
    if (activeCenters.length === 1) {
      const [ctr] = activeCenters[0];
      const concern = ctr === 'gut' ? 'anger, autonomy, and control' : ctr === 'heart' ? 'identity, image, and worth' : 'security, certainty, and preparation';
      const missing = ctr === 'gut' ? 'heart or head' : ctr === 'heart' ? 'gut or head' : 'gut or heart';
      insights.push({ icon: '◆', label: `Single Center: All ${ctr.charAt(0).toUpperCase() + ctr.slice(1)}`, desc: `All members operate from the ${ctr} center, focused on ${concern}. No ${missing} perspective is represented — the group may have collective blind spots around those domains.`, color: '#e88050' });
    } else if (activeCenters.length === 3) {
      insights.push({ icon: '◆', label: 'Balanced Center Spread', desc: 'Gut, heart, and head centers are all represented. The group has access to the full range of instinctual perspectives: action and autonomy, identity and connection, and analysis and planning. The challenge is translation — each center speaks a different emotional language.', color: '#50c878' });
    } else {
      const sorted = activeCenters.sort((a, b) => b[1] - a[1]);
      const dom = sorted[0];
      // Only flag dominance when one center is clearly ahead — not on a tie
      if (dom[1] > sorted[1][1]) {
        const others = sorted.slice(1).map(c => c[0]).join(' and ');
        insights.push({ icon: '◆', label: `${dom[0].charAt(0).toUpperCase() + dom[0].slice(1)}-Dominant Group`, desc: `The ${dom[0]} center is overrepresented, with ${others} less present. The group's emotional vocabulary skews toward ${dom[0] === 'gut' ? 'action and autonomy' : dom[0] === 'heart' ? 'identity and connection' : 'analysis and planning'}.`, color: G.gold });
      }
    }

    const hc = { competency: 0, reactive: 0, positive: 0 };
    ep.forEach(p => { hc[ENN_HARMONIC[p.ennType]]++; });
    const activeH = Object.entries(hc).filter(([, v]) => v > 0);
    if (activeH.length === 1) {
      const [h] = activeH[0];
      const hDesc = h === 'competency' ? 'set feelings aside and problem-solve' : h === 'reactive' ? 'express feelings intensely and expect a response' : 'reframe difficulties positively and avoid pain';
      insights.push({ icon: '⟷', label: `Uniform Conflict Style: ${h.charAt(0).toUpperCase() + h.slice(1)}`, desc: `All members use the ${h} harmonic strategy — they all tend to ${hDesc} when stressed. Uniform conflict style reduces friction but creates shared blind spots.`, color: '#e88050' });
    } else if (activeH.length === 3) {
      insights.push({ icon: '⟷', label: 'All Three Conflict Styles Present', desc: 'Competency, Reactive, and Positive harmonic groups are all represented. The group will handle stress in very different ways — expect friction around conflict style before the actual content of conflicts.', color: '#4a88d8' });
    }

    const stressLinks = [];
    ep.forEach((pA, i) => ep.forEach((pB, j) => { if (i !== j && ENN_ARROWS[pA.ennType].stress === pB.ennType) stressLinks.push(`${pA.label} → ${pB.label}`); }));
    if (stressLinks.length > 0) insights.push({ icon: '↘', label: 'Stress Arrow Web', desc: `Stress arrow connections exist between members: ${stressLinks.join(', ')}. Under pressure, one person's regression may trigger another's.`, color: '#e88050' });

    const growthLinks = [];
    ep.forEach((pA, i) => ep.forEach((pB, j) => { if (i !== j && ENN_ARROWS[pA.ennType].growth === pB.ennType) growthLinks.push(`${pA.label} → ${pB.label}`); }));
    if (growthLinks.length > 0) insights.push({ icon: '↗', label: 'Growth Arrow Web', desc: `Growth connections between members: ${growthLinks.join(', ')}. At their best, these members naturally model each other's growth direction.`, color: '#50c878' });

    if (ep.every(p => p.ennType === ep[0].ennType)) insights.push({ icon: '✦', label: `All Type ${ep[0].ennType} — Mirror Group`, desc: `Every member shares the same core type. Instant mutual legibility — but collective blind spots and defense mechanisms are amplified with no internal counterbalance.`, color: G.gold });

    if (ep.every(p => p.instinctStack?.length > 0)) {
      const ic = { sp: 0, sx: 0, so: 0 };
      ep.forEach(p => { const dom = p.instinctStack[0]; if (dom) ic[dom] = (ic[dom] || 0) + 1; });
      const activeI = Object.entries(ic).filter(([, v]) => v > 0);
      if (activeI.length === 1) {
        const [inst] = activeI[0];
        const iDesc = inst === 'sp' ? 'security, resources, and self-preservation' : inst === 'sx' ? 'intensity, chemistry, and deep one-on-one connection' : 'social belonging, roles, and group contribution';
        insights.push({ icon: '◆', label: `All ${inst.toUpperCase()} Instinct`, desc: `Every member shares the ${inst.toUpperCase()} instinctual variant, all focused on ${iDesc}. Deep shared priorities — but the group may be blind to what the other instincts provide.`, color: '#e88050' });
      }
    }
  }

  if (mp.length >= 2) {
    const ei = { E: 0, I: 0 };
    mp.forEach(p => ei[p.mbti[0]]++);
    if (ei.E === 0) insights.push({ icon: '▸', label: 'All Introverts', desc: 'No extraverts. Processing will be slow and deliberate — everyone prefers to think before speaking. Risk: ideas stay internal, decisions stall, nobody naturally drives external engagement.', color: '#4a88d8' });
    else if (ei.I === 0) insights.push({ icon: '▸', label: 'All Extraverts', desc: 'No introverts. Energy will be high and dialogue fast-moving. Risk: insufficient reflection — the group may push decisions before they\'re fully considered.', color: '#4a88d8' });

    const sn = { S: 0, N: 0 };
    mp.forEach(p => sn[p.mbti[1]]++);
    if (sn.S === 0) insights.push({ icon: '♦', label: 'No Sensing Types', desc: 'All intuitives. Excels at vision and pattern-finding but may chronically under-invest in practical execution and present-moment detail. Grounding abstract ideas may be a persistent challenge.', color: '#e8a030' });
    else if (sn.N === 0) insights.push({ icon: '♦', label: 'No Intuitive Types', desc: 'All sensors. Strong on execution and practical detail — but may resist big-picture thinking and long-range possibility. Innovation and reframing may require deliberate effort.', color: '#e8a030' });

    const tf = { T: 0, F: 0 };
    mp.forEach(p => tf[p.mbti[2]]++);
    if (tf.T === 0) insights.push({ icon: '♦', label: 'No Thinking Types', desc: 'All feeling types. Relational harmony dominates decision-making. Risk: logical inconsistencies may go unchallenged. An outside T-type perspective for critical decisions is worth seeking.', color: '#b850c0' });
    else if (tf.F === 0) insights.push({ icon: '♦', label: 'No Feeling Types', desc: 'All thinking types. Logic and efficiency dominate. Risk: emotional impact and morale may be systematically underweighted until they become unavoidable problems.', color: '#b850c0' });

    const jp = { J: 0, P: 0 };
    mp.forEach(p => jp[p.mbti[3]]++);
    if (jp.J === 0) insights.push({ icon: '♦', label: 'All Perceivers', desc: 'No judgers. Flexibility is a strength but structure and closure may be chronically avoided. The group can generate enormous exploration without converging — external accountability mechanisms are likely needed.', color: '#30a888' });
    else if (jp.P === 0) insights.push({ icon: '♦', label: 'All Judgers', desc: 'No perceivers. Organization and follow-through are strengths, but the group may close on decisions too quickly and resist new information after a plan is set.', color: '#30a888' });

    const dc = {};
    mp.forEach(p => { const fn = MBTI_TYPES[p.mbti]?.stack[0]; if (fn) dc[fn] = (dc[fn] || 0) + 1; });
    const topFn = Object.entries(dc).sort((a, b) => b[1] - a[1])[0];
    if (topFn && topFn[1] > 1) insights.push({ icon: '◆', label: `${topFn[1]}× ${topFn[0]}-Dominant`, desc: `${topFn[1]} members lead with ${topFn[0]} (${COG_FUNCTIONS[topFn[0]]?.name}) — this function will heavily shape the group's default mode of engagement.`, color: G.gold });

    const allDoms = new Set(mp.map(p => MBTI_TYPES[p.mbti]?.stack[0]).filter(Boolean));
    const hasF = allDoms.has('Fe') || allDoms.has('Fi');
    const hasT = allDoms.has('Te') || allDoms.has('Ti');
    if (!hasF && hasT) insights.push({ icon: '↗', label: 'No Feeling-Dominant Members', desc: 'Nobody leads with a Feeling function. Interpersonal dynamics and values-based considerations will be handled reactively via auxiliary or lower functions rather than proactively.', color: '#b850c0' });
    if (!hasT && hasF) insights.push({ icon: '↗', label: 'No Thinking-Dominant Members', desc: 'Nobody leads with a Thinking function. Logical rigor and structural analysis are available but not primary — they\'ll require deliberate effort to bring forward.', color: '#4a88d8' });
  }

  return insights;
}
