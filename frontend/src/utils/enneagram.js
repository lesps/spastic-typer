import { ENN_TYPES, ENN_ARROWS, ENN_CENTER, ENN_HARMONIC, INSTINCT_COMPAT } from '../data/enneagram.js';
import { G } from '../styles/theme.js';

export function getInstinctKey(a, b) {
  const pair = [a, b].sort().join('-');
  return INSTINCT_COMPAT[pair] || null;
}

export function getEnnInteraction(c1, c2) {
  c1 = parseInt(c1); c2 = parseInt(c2);
  if (!c1 || !c2) return [];
  const dynamics = [];
  const sameType = c1 === c2;
  const sameCenter = ENN_CENTER[c1] === ENN_CENTER[c2];
  const h1 = ENN_HARMONIC[c1], h2 = ENN_HARMONIC[c2];
  const sameHarmonic = h1 === h2;
  const a1 = ENN_ARROWS[c1], a2 = ENN_ARROWS[c2];

  if (sameType) dynamics.push({ icon: '✦', label: 'Mirror Dynamic', desc: `Both Type ${c1}s — you share the same core fear, desire, and worldview. This creates deep understanding and immediate resonance, but also a risk of amplifying each other's blind spots and compulsions.`, color: G.gold });
  if (sameCenter && !sameType) dynamics.push({ icon: '◆', label: `Shared ${ENN_CENTER[c1].charAt(0).toUpperCase() + ENN_CENTER[c1].slice(1)} Center`, desc: `Both operate from the ${ENN_CENTER[c1]} center — sharing core concerns around ${ENN_CENTER[c1] === 'gut' ? 'anger and autonomy' : ENN_CENTER[c1] === 'heart' ? 'shame and identity' : 'fear and security'}.`, color: G.gold });
  if (a1.growth === c2 || a2.growth === c1) dynamics.push({ icon: '↗', label: 'Growth Arrow Connection', desc: `One type's growth direction points toward the other — ${a1.growth === c2 ? `Type ${c1} grows toward Type ${c2}` : ''}${a2.growth === c1 ? `Type ${c2} grows toward Type ${c1}` : ''}. At their best, one partner naturally models what the other is working toward.`, color: '#50c878' });
  if (a1.stress === c2 || a2.stress === c1) dynamics.push({ icon: '↘', label: 'Stress Arrow Connection', desc: `One type's stress direction points toward the other — ${a1.stress === c2 ? `Type ${c1} under stress takes on Type ${c2} patterns` : ''}${a2.stress === c1 ? `Type ${c2} under stress takes on Type ${c1} patterns` : ''}. One partner may trigger the other's stress behavior without meaning to.`, color: '#e88050' });
  if (!sameType && !sameCenter) dynamics.push({ icon: '↕', label: 'Cross-Center Pairing', desc: `Operating from different centers (${ENN_CENTER[c1]} vs ${ENN_CENTER[c2]}) — each brings a fundamentally different emotional orientation to the relationship.`, color: G.gold });
  if (sameHarmonic && !sameType) dynamics.push({ icon: '⟷', label: `Shared Conflict Style: ${h1.charAt(0).toUpperCase() + h1.slice(1)}`, desc: `Both use the ${h1} harmonic strategy when under stress. They'll tend to handle conflict similarly, which can create harmony — or mutual blind spots.`, color: '#4a88d8' });
  if (!sameHarmonic && !sameType) dynamics.push({ icon: '⟷', label: 'Different Conflict Styles', desc: `Different harmonic groups (${h1} vs ${h2}) — they handle stress and conflict in fundamentally different ways, which can create friction before the actual content of disagreements.`, color: '#e88050' });

  return dynamics;
}

export function getEnnTips(c1, c2) {
  c1 = parseInt(c1); c2 = parseInt(c2);
  if (!c1 || !c2) return [];
  const n1 = ENN_TYPES[c1]?.name?.replace('The ', '');
  const n2 = ENN_TYPES[c2]?.name?.replace('The ', '');
  return [
    {
      for: 'Person A', label: `Understanding the ${n2} (Type ${c2})`, items: [
        `Their core fear is "${ENN_TYPES[c2].fear.toLowerCase()}" — avoid framing that triggers it.`,
        `They need to feel ${ENN_TYPES[c2].desire.toLowerCase().replace('to ', '')}.`,
        `Under stress they move toward Type ${ENN_ARROWS[c2].stress} patterns — ${ENN_TYPES[ENN_ARROWS[c2].stress].name.replace('The ', '')}.`,
        `Their growth edge is Type ${ENN_ARROWS[c2].growth} qualities — ${ENN_TYPES[ENN_ARROWS[c2].growth].name.replace('The ', '')}.`,
      ],
    },
    {
      for: 'Person B', label: `Understanding the ${n1} (Type ${c1})`, items: [
        `Their core fear is "${ENN_TYPES[c1].fear.toLowerCase()}" — avoid framing that triggers it.`,
        `They need to feel ${ENN_TYPES[c1].desire.toLowerCase().replace('to ', '')}.`,
        `Under stress they move toward Type ${ENN_ARROWS[c1].stress} patterns — ${ENN_TYPES[ENN_ARROWS[c1].stress].name.replace('The ', '')}.`,
        `Their growth edge is Type ${ENN_ARROWS[c1].growth} qualities — ${ENN_TYPES[ENN_ARROWS[c1].growth].name.replace('The ', '')}.`,
      ],
    },
  ];
}

export function computeWingStrengthDelta(coreType, wing, scores) {
  if (!scores || !coreType || !wing) return null;
  const adj1 = coreType === 1 ? 9 : coreType - 1;
  const adj2 = coreType === 9 ? 1 : coreType + 1;
  const otherAdjacent = wing === adj1 ? adj2 : adj1;
  return (scores[wing] || 0) - (scores[otherAdjacent] || 0);
}

export function wingStrengthLabel(strength) {
  if (strength === null || strength === undefined) return null;
  if (typeof strength === 'string') return strength;
  if (strength > 4) return 'strong';
  if (strength > 1) return 'moderate';
  return 'balanced';
}

export function wingStrengthDesc(strength) {
  const lbl = wingStrengthLabel(strength);
  if (!lbl) return '';
  if (lbl === 'strong') return 'Strong — this wing significantly colors your core type expression';
  if (lbl === 'moderate') return 'Moderate — this wing has a noticeable but not dominant influence';
  return 'Balanced — both adjacent types have similar influence';
}

export function getWingDynamics(personA, personB) {
  if (!personA.ennType || !personA.ennWing || !personB.ennType || !personB.ennWing) return null;
  const notes = [];

  if (personA.ennWing === personB.ennType) notes.push(`Person A's w${personA.ennWing} wing pulls toward Type ${personB.ennType} — Person B's core type. A's wing side naturally resonates with B's fundamental mode of operating, creating a bridge between them.`);
  if (personB.ennWing === personA.ennType) notes.push(`Person B's w${personB.ennWing} wing pulls toward Type ${personA.ennType} — Person A's core type. B's wing side naturally resonates with A's fundamental mode of operating.`);
  if (personA.ennWing === personB.ennWing) notes.push(`Both carry a Type ${personA.ennWing} wing influence. Despite different core types, they share this secondary coloring — a subtle common ground in style and presentation.`);

  const labelA = wingStrengthLabel(personA.ennWingStrength);
  const labelB = wingStrengthLabel(personB.ennWingStrength);
  if (labelA === 'strong' && labelB === 'strong') notes.push(`Both have strong wing influences — they each present more as blends of their core type and wing than as pure type expressions. Account for wing coloring heavily when predicting their behavior.`);
  else if (labelA === 'balanced' && labelB === 'balanced') notes.push(`Both have balanced wings — they may draw from either adjacent type depending on context, making their presentations somewhat fluid and harder to pin to a single wing expression.`);
  else if (labelA && labelB && labelA !== labelB) {
    const stronger = labelA === 'strong' || (labelA === 'moderate' && labelB === 'balanced') ? 'Person A' : 'Person B';
    notes.push(`${stronger} has a more pronounced wing influence relative to the other — their presentation is more distinctly colored by their wing type.`);
  }

  return notes.length > 0 ? notes : null;
}
