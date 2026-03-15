import { ENN_CENTER, ENN_HARMONIC, ENN_ARROWS, ENN_HORNEVIAN } from '../data/enneagram.js';
import { MBTI_TYPES, MBTI_TEMPERAMENT } from '../data/mbti.js';
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
    ep.forEach((pA, i) => ep.forEach((pB, j) => { if (i !== j && ENN_ARROWS[pA.ennType].stress === pB.ennType) stressLinks.push(`${pA.label} \u2192 ${pB.label}`); }));
    if (stressLinks.length > 0) insights.push({ icon: '\u2198', label: 'Stress Arrow Web', desc: `Stress arrow connections exist between members: ${stressLinks.join(', ')}. Under pressure, one person's regression may trigger another's.`, color: '#e88050' });

    const growthLinks = [];
    ep.forEach((pA, i) => ep.forEach((pB, j) => { if (i !== j && ENN_ARROWS[pA.ennType].growth === pB.ennType) growthLinks.push(`${pA.label} \u2192 ${pB.label}`); }));
    if (growthLinks.length > 0) insights.push({ icon: '\u2197', label: 'Growth Arrow Web', desc: `Growth connections between members: ${growthLinks.join(', ')}. At their best, these members naturally model each other's growth direction.`, color: '#50c878' });

    if (ep.every(p => p.ennType === ep[0].ennType)) insights.push({ icon: '\u2726', label: `All Type ${ep[0].ennType} \u2014 Mirror Group`, desc: `Every member shares the same core type. Instant mutual legibility \u2014 but collective blind spots and defense mechanisms are amplified with no internal counterbalance.`, color: G.gold });

    if (ep.every(p => p.instinctStack?.length > 0)) {
      const ic = { sp: 0, sx: 0, so: 0 };
      ep.forEach(p => { const dom = p.instinctStack[0]; if (dom) ic[dom] = (ic[dom] || 0) + 1; });
      const activeI = Object.entries(ic).filter(([, v]) => v > 0);
      if (activeI.length === 1) {
        const [inst] = activeI[0];
        const iDesc = inst === 'sp' ? 'security, resources, and self-preservation' : inst === 'sx' ? 'intensity, chemistry, and deep one-on-one connection' : 'social belonging, roles, and group contribution';
        insights.push({ icon: '◆', label: `All ${inst.toUpperCase()} Instinct`, desc: `Every member shares the ${inst.toUpperCase()} instinctual variant, all focused on ${iDesc}. Deep shared priorities \u2014 but the group may be blind to what the other instincts provide.`, color: '#e88050' });
      }
    }
  }

  if (mp.length >= 2) {
    const ei = { E: 0, I: 0 };
    mp.forEach(p => ei[p.mbti[0]]++);
    if (ei.E === 0) insights.push({ icon: '\u25b8', label: 'All Introverts', desc: 'No extraverts. Processing will be slow and deliberate \u2014 everyone prefers to think before speaking. Risk: ideas stay internal, decisions stall, nobody naturally drives external engagement.', color: '#4a88d8' });
    else if (ei.I === 0) insights.push({ icon: '\u25b8', label: 'All Extraverts', desc: "No introverts. Energy will be high and dialogue fast-moving. Risk: insufficient reflection \u2014 the group may push decisions before they're fully considered.", color: '#4a88d8' });

    const sn = { S: 0, N: 0 };
    mp.forEach(p => sn[p.mbti[1]]++);
    if (sn.S === 0) insights.push({ icon: '\u2666', label: 'No Sensing Types', desc: 'All intuitives. Excels at vision and pattern-finding but may chronically under-invest in practical execution and present-moment detail. Grounding abstract ideas may be a persistent challenge.', color: '#e8a030' });
    else if (sn.N === 0) insights.push({ icon: '\u2666', label: 'No Intuitive Types', desc: 'All sensors. Strong on execution and practical detail \u2014 but may resist big-picture thinking and long-range possibility. Innovation and reframing may require deliberate effort.', color: '#e8a030' });

    const tf = { T: 0, F: 0 };
    mp.forEach(p => tf[p.mbti[2]]++);
    if (tf.T === 0) insights.push({ icon: '\u2666', label: 'No Thinking Types', desc: 'All feeling types. Relational harmony dominates decision-making. Risk: logical inconsistencies may go unchallenged. An outside T-type perspective for critical decisions is worth seeking.', color: '#b850c0' });
    else if (tf.F === 0) insights.push({ icon: '\u2666', label: 'No Feeling Types', desc: 'All thinking types. Logic and efficiency dominate. Risk: emotional impact and morale may be systematically underweighted until they become unavoidable problems.', color: '#b850c0' });

    const jp = { J: 0, P: 0 };
    mp.forEach(p => jp[p.mbti[3]]++);
    if (jp.J === 0) insights.push({ icon: '\u2666', label: 'All Perceivers', desc: 'No judgers. Flexibility is a strength but structure and closure may be chronically avoided. The group can generate enormous exploration without converging \u2014 external accountability mechanisms are likely needed.', color: '#30a888' });
    else if (jp.P === 0) insights.push({ icon: '\u2666', label: 'All Judgers', desc: 'No perceivers. Organization and follow-through are strengths, but the group may close on decisions too quickly and resist new information after a plan is set.', color: '#30a888' });

    const dc = {};
    mp.forEach(p => { const fn = MBTI_TYPES[p.mbti]?.stack[0]; if (fn) dc[fn] = (dc[fn] || 0) + 1; });
    const topFn = Object.entries(dc).sort((a, b) => b[1] - a[1])[0];
    if (topFn && topFn[1] > 1) insights.push({ icon: '◆', label: `${topFn[1]}\u00d7 ${topFn[0]}-Dominant`, desc: `${topFn[1]} members lead with ${topFn[0]} (${COG_FUNCTIONS[topFn[0]]?.name}) \u2014 this function will heavily shape the group's default mode of engagement.`, color: G.gold });

    const allDoms = new Set(mp.map(p => MBTI_TYPES[p.mbti]?.stack[0]).filter(Boolean));
    const hasF = allDoms.has('Fe') || allDoms.has('Fi');
    const hasT = allDoms.has('Te') || allDoms.has('Ti');
    if (!hasF && hasT) insights.push({ icon: '\u2197', label: 'No Feeling-Dominant Members', desc: "Nobody leads with a Feeling function. Interpersonal dynamics and values-based considerations will be handled reactively via auxiliary or lower functions rather than proactively.", color: '#b850c0' });
    if (!hasT && hasF) insights.push({ icon: '\u2197', label: 'No Thinking-Dominant Members', desc: "Nobody leads with a Thinking function. Logical rigor and structural analysis are available but not primary \u2014 they'll require deliberate effort to bring forward.", color: '#4a88d8' });
  }

  return insights;
}

// --- Detailed group distribution functions ---

export function getCenterDistribution(persons) {
  const ep = persons.filter(p => p.ennType);
  if (ep.length < 2) return null;
  const dist = { gut: 0, heart: 0, head: 0 };
  ep.forEach(p => { const c = ENN_CENTER[p.ennType]; if (c) dist[c]++; });
  const total = ep.length;
  const pct = k => Math.round((dist[k] / total) * 100);
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][1] > total / 2 ? sorted[0][0] : null;
  const missing = Object.keys(dist).filter(k => dist[k] === 0);
  const descriptions = {
    gut: 'Action-oriented group that leads with autonomy, instinct, and direct assertion. May struggle with deliberate reflection or emotional processing.',
    heart: 'Relationship-oriented group that leads with identity, image, and connection. May struggle with objectivity when emotionally triggered.',
    head: 'Analysis-oriented group that leads with strategy, caution, and preparation. May struggle with decisiveness and acting without full certainty.',
  };
  let analysis = dominant ? descriptions[dominant]
    : missing.length === 0 ? 'All three centers are represented \u2014 gut (action), heart (connection), and head (strategy). The challenge is translation between these three emotional languages.'
    : `The group lacks ${missing.join(' and ')} center perspectives, creating potential blind spots in those domains.`;
  const blindSpots = missing.map(c =>
    c === 'gut' ? 'Direct action and embodied instinct' : c === 'heart' ? 'Emotional attunement and relational warmth' : 'Strategic analysis and anticipating problems'
  );
  const strengths = Object.keys(dist).filter(k => dist[k] > 0).map(c =>
    c === 'gut' ? 'Bold action and decisive autonomy' : c === 'heart' ? 'Relational depth and emotional intelligence' : 'Strategic thinking and risk awareness'
  );
  return { dist, pct: { gut: pct('gut'), heart: pct('heart'), head: pct('head') }, total, dominant, missing, analysis, blindSpots, strengths };
}

export function getHarmonicDistribution(persons) {
  const ep = persons.filter(p => p.ennType);
  if (ep.length < 2) return null;
  const dist = { competency: 0, reactive: 0, positive: 0 };
  ep.forEach(p => { const h = ENN_HARMONIC[p.ennType]; if (h) dist[h]++; });
  const total = ep.length;
  const dominant = Object.entries(dist).sort((a, b) => b[1] - a[1])[0];
  const descriptions = {
    competency: 'Sets feelings aside and problem-solves \u2014 may dismiss emotional processing as inefficient.',
    reactive: 'Expresses emotions directly and expects authentic response \u2014 may find indirect communication frustrating.',
    positive: 'Reframes difficulties and emphasizes the bright side \u2014 may avoid addressing problems head-on.',
  };
  const labels = { competency: 'Competency (1, 3, 5)', reactive: 'Reactive (4, 6, 8)', positive: 'Positive Outlook (2, 7, 9)' };
  const dominated = dominant[1] > total / 2;
  const analysis = dominated
    ? `${dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1)}-dominant group: members tend to ${descriptions[dominant[0]]}. Stress will expose this shared pattern.`
    : 'Mixed harmonic strategies \u2014 expect friction when conflict arises, as members will want very different things from the conversation.';
  return { dist, labels, total, dominant: dominant[0], dominated, analysis };
}

export function getHornevianDistribution(persons) {
  const ep = persons.filter(p => p.ennType);
  if (ep.length < 2) return null;
  const dist = { assertive: 0, compliant: 0, withdrawn: 0 };
  ep.forEach(p => { const h = ENN_HORNEVIAN[p.ennType]; if (h) dist[h]++; });
  const total = ep.length;
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][1] > total / 2 ? sorted[0][0] : null;
  const missing = Object.keys(dist).filter(k => dist[k] === 0);
  const descriptions = {
    assertive: 'Moves toward what they want \u2014 assertive, action-oriented, direct. Types 3, 7, 8.',
    compliant: "Moves toward others' expectations \u2014 seeks approval, follows structure. Types 1, 2, 6.",
    withdrawn: 'Moves away to internal world \u2014 thoughtful, private, independent. Types 4, 5, 9.',
  };
  const implications = {
    assertive: 'High-energy, decisive group. Risk: bulldozing quieter members. Withdrawn types may feel steamrolled.',
    compliant: 'Cooperative, structured group. Risk: difficulty initiating without external direction. May over-defer.',
    withdrawn: 'Reflective, independent group. Risk: slow to engage, avoids direct conflict. May seem passive.',
  };
  const analysis = dominant ? implications[dominant] : `Mixed movement styles \u2014 the group has ${Object.keys(dist).filter(k => dist[k] > 0).join(', ')} orientations. Expect different rhythms of engagement.`;
  return { dist, total, dominant, missing, descriptions, analysis };
}

export function getTemperamentDistribution(persons) {
  const mp = persons.filter(p => p.mbti);
  if (mp.length < 2) return null;
  const dist = { NT: 0, NF: 0, SJ: 0, SP: 0 };
  mp.forEach(p => { const t = MBTI_TEMPERAMENT[p.mbti]; if (t) dist[t]++; });
  const total = mp.length;
  const missing = Object.keys(dist).filter(k => dist[k] === 0);
  const labels = { NT: 'NT Rationals (INTJ, INTP, ENTJ, ENTP)', NF: 'NF Idealists (INFJ, INFP, ENFJ, ENFP)', SJ: 'SJ Guardians (ISTJ, ISFJ, ESTJ, ESFJ)', SP: 'SP Artisans (ISTP, ISFP, ESTP, ESFP)' };
  const strengths = { NT: 'Strategic systems thinking and long-range planning', NF: 'Visionary leadership and deep human insight', SJ: 'Reliability, process adherence, and institutional knowledge', SP: 'Hands-on problem solving and real-time adaptability' };
  const gaps = missing.map(t => {
    const g = { NT: 'analytical and strategic thinking', NF: 'visionary purpose and empathetic communication', SJ: 'process reliability and institutional memory', SP: 'practical hands-on adaptability' };
    return `No ${t} perspective: ${g[t]}`;
  });
  const analysis = missing.length === 4 ? 'No MBTI data available.'
    : missing.length > 0 ? `Missing ${missing.join(', ')} perspectives: ${gaps.join('; ')}.`
    : 'All four Keirsey temperaments are represented \u2014 strong diversity of cognitive styles.';
  return { dist, total, missing, labels, strengths, gaps, analysis };
}

export function getCognitiveCoverage(persons) {
  const mp = persons.filter(p => p.mbti);
  if (mp.length < 2) return null;
  const fnCounts = {};
  mp.forEach(p => {
    const stack = MBTI_TYPES[p.mbti]?.stack;
    if (!stack) return;
    stack.slice(0, 2).forEach(fn => { fnCounts[fn] = (fnCounts[fn] || 0) + 1; });
  });
  const all8 = ['Fi', 'Fe', 'Ti', 'Te', 'Ni', 'Ne', 'Si', 'Se'];
  const wellCovered = all8.filter(fn => (fnCounts[fn] || 0) >= 2);
  const represented = all8.filter(fn => fnCounts[fn] === 1);
  const underrepresented = all8.filter(fn => !fnCounts[fn]);
  const fnDesc = { Fi: 'personal values', Fe: 'social harmony', Ti: 'internal logic', Te: 'external organization', Ni: 'pattern synthesis', Ne: 'possibility exploration', Si: 'detailed memory', Se: 'present-moment action' };
  const analysis = underrepresented.length === 0
    ? 'Remarkable coverage \u2014 all 8 cognitive functions are represented in someone\u2019s top two stack positions.'
    : underrepresented.length <= 2 ? `Strong coverage. The group lacks only ${underrepresented.join(' and ')} (${underrepresented.map(f => fnDesc[f]).join(', ')}) in dominant/auxiliary positions.`
    : `The group has notable gaps: ${underrepresented.slice(0, 4).join(', ')} are absent from anyone\u2019s top two functions.`;
  const recommendation = underrepresented.length > 0
    ? `Consider bringing in types that lead with ${underrepresented[0]} for ${fnDesc[underrepresented[0]]}.`
    : 'No specific gaps to address.';
  return { wellCovered, represented, underrepresented, fnDesc, analysis, recommendation };
}

export function getInstinctGroupChemistry(persons) {
  const ip = persons.filter(p => p.instinctStack?.length > 0);
  if (ip.length < 2) return null;
  const dist = { SP: 0, SX: 0, SO: 0 };
  ip.forEach(p => { const dom = (p.instinctStack[0] || '').toUpperCase(); if (dom in dist) dist[dom]++; });
  const total = ip.length;
  const pct = k => Math.round(((dist[k] || 0) / total) * 100);
  const dominated = Object.entries(dist).find(([, v]) => v === total);
  const cohesionScore = dominated ? 35 : Object.values(dist).filter(v => v > 0).length === 3 ? 78 : 62;
  const energyDesc = { SP: 'grounded and pragmatic \u2014 focused on stability and resource security', SX: 'intense and chemistry-driven \u2014 relationships are the central arena', SO: 'socially engaged \u2014 group dynamics and belonging take priority' };
  const dominant = Object.entries(dist).sort((a, b) => b[1] - a[1])[0];
  const groupEnergy = dominated
    ? `Strongly ${dominant[0]}-oriented: ${energyDesc[dominant[0]]}. The shared repressed instinct creates a collective blind spot.`
    : `Mixed instinct energies \u2014 ${Object.entries(dist).filter(([, v]) => v > 0).map(([k, v]) => `${v}\u00d7 ${k}`).join(', ')}. Diversity in priorities creates both richness and friction.`;
  const repressed = Object.entries(dist).filter(([, v]) => v === 0).map(([k]) => k);
  const conflictRisk = repressed.length > 0
    ? `${repressed.join(' and ')}-blind: nobody naturally attends to ${repressed.map(r => r === 'SP' ? 'practical self-care' : r === 'SX' ? 'deep 1-on-1 connection' : 'community belonging').join(' or ')}.`
    : 'Balanced instinct coverage reduces major blind spots.';
  return { dist, pct: { SP: pct('SP'), SX: pct('SX'), SO: pct('SO') }, total, groupEnergy, conflictRisk, cohesionScore, repressed };
}

export function getTeamArchetype(persons) {
  const centerDist = getCenterDistribution(persons);
  const hornevianDist = getHornevianDistribution(persons);
  const instinctDist = getInstinctGroupChemistry(persons);
  if (!centerDist && !instinctDist) return null;
  const cd = centerDist?.dist || { gut: 0, heart: 0, head: 0 };
  const hd = hornevianDist?.dist || { assertive: 0, compliant: 0, withdrawn: 0 };
  const id = instinctDist?.dist || { SP: 0, SX: 0, SO: 0 };
  const total = centerDist?.total || instinctDist?.total || 1;
  const cPct = k => (cd[k] || 0) / total;
  const hPct = k => (hd[k] || 0) / total;
  const iPct = k => (id[k] || 0) / total;
  if (cPct('gut') > 0.5 && hPct('assertive') > 0.5) return { name: 'The War Council', description: 'Action-oriented, decisive, and direct. This group moves fast and asserts boldly. Risk: bulldozing nuance and dismissing softer perspectives. Needs intentional space for reflection and emotional processing.' };
  if (cPct('heart') > 0.5) return { name: 'The Dream Team', description: 'Deep empathy and strong vision. This group creates meaningful connections and inspires purpose. Risk: avoiding difficult truths and conflict in favor of harmony. Needs principled structure to execute.' };
  if (cPct('head') > 0.5 && hPct('withdrawn') > 0.4) return { name: 'The Think Tank', description: 'Analytical powerhouse with extraordinary strategic depth. Risk: over-deliberating and avoiding action. Needs a bias toward implementation and emotional check-ins.' };
  if (iPct('SP') > 0.6) return { name: 'The Fortress', description: 'Security-focused, practical, and self-sustaining. Excellent at resource management and stability. Risk: resisting change and missing opportunities that require social engagement or emotional risk.' };
  if (iPct('SX') > 0.6) return { name: 'The Crucible', description: 'Intense, transformative, and chemistry-driven. Creates powerful bonds and passionate work. Risk: burning through energy and relationships with excessive intensity. Needs grounding in practical concerns.' };
  if (iPct('SO') > 0.6) return { name: 'The Assembly', description: 'Community-oriented, socially engaged, and group-conscious. Excellent at building belonging. Risk: avoiding individual accountability in favor of collective identity. Needs mechanisms for personal ownership.' };
  if (hPct('assertive') > 0.7) return { name: 'The Engine Room', description: 'Highly assertive, driven, and self-directed. Gets things done with remarkable autonomy. Risk: poor listening and leaving quieter members behind. Needs structured input from all voices.' };
  if (hPct('compliant') > 0.7) return { name: 'The Community Garden', description: 'Cooperative, rule-respecting, and other-oriented. Excellent at collaboration. Risk: difficulty initiating or pushing back on authority. Needs an advocate for bold action.' };
  if (hPct('withdrawn') > 0.7) return { name: 'The Council of Elders', description: 'Reflective, independent, and depth-seeking. Creates profound insights. Risk: slow engagement and avoidance of direct conflict. Needs structured venues for sharing and decision-making.' };
  const hasAll3Centers = cd.gut > 0 && cd.heart > 0 && cd.head > 0;
  const hasAll3Instincts = id.SP > 0 && id.SX > 0 && id.SO > 0;
  if (hasAll3Centers && hasAll3Instincts) return { name: 'The Round Table', description: 'Well-balanced across centers and instincts. This group has the full palette of human motivation available to it. The challenge is finding a unified voice \u2014 diversity of perspective requires strong facilitation to channel effectively.' };
  if (hasAll3Centers) return { name: 'The Round Table', description: 'All three Enneagram centers are present. Well-rounded but may struggle to find a unified voice without deliberate coordination.' };
  return { name: 'The Ensemble', description: 'A unique combination of perspectives without a single dominant pattern. This group\u2019s dynamics are shaped by the specific individuals rather than a clear collective archetype.' };
}
