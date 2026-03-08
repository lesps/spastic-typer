import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { G } from '../styles/theme.js';

export function getMBTIInteraction(type1, type2) {
  if (!type1 || !type2 || !MBTI_TYPES[type1] || !MBTI_TYPES[type2]) return null;
  const s1 = MBTI_TYPES[type1].stack, s2 = MBTI_TYPES[type2].stack;
  const shared = s1.filter(f => s2.includes(f));
  const insights = [];

  if (s1[0] === s2[0]) insights.push({ label: 'Shared Dominant Function', desc: `Both lead with ${s1[0]} (${COG_FUNCTIONS[s1[0]].name}) — instant alignment in how they perceive and process. Communication feels natural and frictionless.`, color: '#50c878' });
  else if (s1[0][0] === s2[0][0]) insights.push({ label: `Same Axis: ${s1[0]} vs ${s2[0]}`, desc: `Both lead with the same cognitive axis (${s1[0][0] === 'N' ? 'Intuition' : 'Sensing'}) but in opposite orientations — one inward, one outward. Similar vocabulary, different processing style.`, color: G.gold });

  if (s1[0] === s2[3]) insights.push({ label: `${type1}'s Strength = ${type2}'s Growth Edge`, desc: `${type1}'s dominant function (${s1[0]}) is ${type2}'s inferior — what comes naturally to ${type1} is ${type2}'s area of growth and potential stress.`, color: '#e88050' });
  if (s2[0] === s1[3]) insights.push({ label: `${type2}'s Strength = ${type1}'s Growth Edge`, desc: `${type2}'s dominant function (${s2[0]}) is ${type1}'s inferior — what comes naturally to ${type2} is ${type1}'s area of growth and potential stress.`, color: '#e88050' });

  const temp1 = type1[1] + type1[2], temp2 = type2[1] + type2[2];
  if (temp1 === temp2) insights.push({ label: `Same Temperament: ${temp1}`, desc: 'Similar values, communication style, and life orientation. These types often feel like they speak the same language, even if their specific functions differ.', color: '#30a888' });
  else {
    if ((temp1.includes('F') && temp2.includes('T')) || (temp1.includes('T') && temp2.includes('F'))) insights.push({ label: 'Thinker–Feeler Complement', desc: 'One leads with values and impact on people, the other with logic and objective analysis. This is one of the most complementary — and friction-prone — pairings in MBTI.', color: '#c45a10' });
    if ((temp1.includes('N') && temp2.includes('S')) || (temp1.includes('S') && temp2.includes('N'))) insights.push({ label: 'Intuitive–Sensor Complement', desc: 'One sees the big picture and future possibilities, the other sees concrete present reality and practical detail. Together they form a more complete picture of any situation.', color: '#c45a10' });
  }

  if (type1[0] !== type2[0]) insights.push({ label: 'Extravert–Introvert Dynamic', desc: 'The E processes externally and energizes through interaction; the I processes internally and needs space to reflect. The E may need to slow down and wait; the I may need to share more than feels natural.', color: '#7830a0' });
  else if (type1[0] === 'I') insights.push({ label: 'Double Introvert', desc: 'Both prefer internal processing and may need explicit prompting to share what\'s going on internally. Silences are comfortable but important thoughts can go unspoken.', color: '#4a88d8' });

  if (type1[3] !== type2[3]) insights.push({ label: 'Judger–Perceiver Tension', desc: 'One wants plans, closure, and structure; the other prefers flexibility and keeping options open. This is often felt as friction around scheduling, decisions, and follow-through.', color: '#b850c0' });

  return { insights, shared, stack1: s1, stack2: s2 };
}

export function getMBTITips(type1, type2) {
  if (!type1 || !type2 || !MBTI_TYPES[type1] || !MBTI_TYPES[type2]) return [];
  const s1 = MBTI_TYPES[type1].stack, s2 = MBTI_TYPES[type2].stack;
  return [
    {
      for: 'Person A', label: `Understanding ${type2}'s Lead: ${s2[0]}`, items: [
        `${type2} leads with ${COG_FUNCTIONS[s2[0]].name} — this is how they see everything first. Lead with that lens when communicating.`,
        `To connect: ${s2[0][1] === 'e' ? 'join them in the external process — engage actively, think out loud, match their energy' : 'give them space to process — don\'t push for immediate responses, let conclusions emerge'}.`,
        `Their inferior function is ${s2[3]} (${COG_FUNCTIONS[s2[3]].name}) — avoid triggering it under stress.`,
      ],
    },
    {
      for: 'Person B', label: `Understanding ${type1}'s Lead: ${s1[0]}`, items: [
        `${type1} leads with ${COG_FUNCTIONS[s1[0]].name} — this is how they see everything first. Lead with that lens when communicating.`,
        `To connect: ${s1[0][1] === 'e' ? 'join them in the external process — engage actively, think out loud, match their energy' : 'give them space to process — don\'t push for immediate responses, let conclusions emerge'}.`,
        `Their inferior function is ${s1[3]} (${COG_FUNCTIONS[s1[3]].name}) — avoid triggering it under stress.`,
      ],
    },
  ];
}
