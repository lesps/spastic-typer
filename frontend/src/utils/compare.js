import { ENN_CENTER, ENN_ARROWS } from '../data/enneagram.js';
import { MBTI_TYPES } from '../data/mbti.js';

// --- Communication Style Matrix ---

const CENTER_MODALITY = {
  head: { style: 'Analytical', lead: 'questions, frameworks, and analysis', brief: 'Leads with thinking and strategy' },
  heart: { style: 'Relational', lead: 'emotions, stories, and personal connection', brief: 'Leads with feeling and identity' },
  gut: { style: 'Direct', lead: 'action, instinct, and principle', brief: 'Leads with assertion and embodied knowing' },
};

const TF_CONFLICT = {
  T: { style: 'Logic-first', approach: 'Prioritizes accuracy and consistency over comfort. May unintentionally dismiss emotional content.' },
  F: { style: 'Harmony-first', approach: 'Prioritizes relational impact and values alignment. May avoid necessary confrontation.' },
};

const JP_DECISION = {
  J: { style: 'Closure-seeking', approach: 'Wants resolution. Plans early, decides quickly. May feel impatient with open-ended processing.' },
  P: { style: 'Options-keeping', approach: 'Wants flexibility. Resists premature commitment. May frustrate J\'s need for settled plans.' },
};

const INSTINCT_PRIORITY = {
  sp: 'Asks: "What\'s the practical outcome for me?" Prioritizes security and personal comfort in conversation.',
  sx: 'Asks: "How deep can we go?" Seeks intensity, authenticity, and real connection.',
  so: 'Asks: "How does this affect the group?" Considers social implications and belonging.',
  SP: 'Asks: "What\'s the practical outcome for me?" Prioritizes security and personal comfort in conversation.',
  SX: 'Asks: "How deep can we go?" Seeks intensity, authenticity, and real connection.',
  SO: 'Asks: "How does this affect the group?" Considers social implications and belonging.',
};

export function getCommunicationMatrix(profileA, profileB) {
  const centerA = profileA.ennType ? ENN_CENTER[profileA.ennType] : null;
  const centerB = profileB.ennType ? ENN_CENTER[profileB.ennType] : null;
  const modalityA = centerA ? CENTER_MODALITY[centerA] : null;
  const modalityB = centerB ? CENTER_MODALITY[centerB] : null;
  const tfA = profileA.mbti?.[2];
  const tfB = profileB.mbti?.[2];
  const jpA = profileA.mbti?.[3];
  const jpB = profileB.mbti?.[3];
  const instA = profileA.instinctStack?.[0];
  const instB = profileB.instinctStack?.[0];

  const conflictStyle = {
    a: tfA ? TF_CONFLICT[tfA]?.style : null,
    b: tfB ? TF_CONFLICT[tfB]?.style : null,
    dynamic: tfA && tfB
      ? tfA === tfB
        ? `Both use ${TF_CONFLICT[tfA].style.toLowerCase()} conflict approach — natural alignment, but they may share each other\'s blind spots.`
        : `${TF_CONFLICT[tfA].style} meets ${TF_CONFLICT[tfB].style}: expect some friction around how facts vs. feelings are weighted in disagreements.`
      : null,
  };

  const decisionMaking = {
    a: jpA ? JP_DECISION[jpA]?.style : null,
    b: jpB ? JP_DECISION[jpB]?.style : null,
    dynamic: jpA && jpB
      ? jpA === jpB
        ? `Both are ${JP_DECISION[jpA].style.toLowerCase()} — shared pace, though they may reinforce each other\'s tendency toward ${jpA === 'J' ? 'premature closure' : 'indefinite exploration'}.`
        : `${JP_DECISION[jpA].style} meets ${JP_DECISION[jpB].style}: one prefers decisions, one prefers options — negotiate timelines explicitly.`
      : null,
  };

  const emotionalExpression = {
    a: modalityA ? `${modalityA.style} (${modalityA.brief})` : null,
    b: modalityB ? `${modalityB.style} (${modalityB.brief})` : null,
    dynamic: modalityA && modalityB
      ? centerA === centerB
        ? `Both lead with ${modalityA.style} communication — they speak the same emotional language, which creates ease but may lack complementary challenge.`
        : `${modalityA.style} meets ${modalityB.style}: one leads with ${centerA} (${modalityA.lead}), the other with ${centerB} (${modalityB.lead}). Translation is needed.`
      : null,
  };

  const energyManagement = {
    a: instA ? INSTINCT_PRIORITY[instA] : null,
    b: instB ? INSTINCT_PRIORITY[instB] : null,
    dynamic: instA && instB
      ? (instA.toLowerCase() === instB.toLowerCase())
        ? `Both prioritize ${instA.toUpperCase()} concerns in conversation — natural topic alignment, shared blind spot around the other instincts.`
        : `${instA.toUpperCase()} meets ${instB.toUpperCase()}: one focuses on ${instA.toLowerCase() === 'sp' ? 'practical outcomes' : instA.toLowerCase() === 'sx' ? 'depth and authenticity' : 'group dynamics'}, the other on ${instB.toLowerCase() === 'sp' ? 'practical outcomes' : instB.toLowerCase() === 'sx' ? 'depth and authenticity' : 'group dynamics'}.`
      : null,
  };

  const tips = [
    modalityA && modalityB && centerA !== centerB ? `${centerA.charAt(0).toUpperCase() + centerA.slice(1)}-center person: lead with ${modalityB.lead} when opening important conversations with the other person.` : null,
    tfA && tfB && tfA !== tfB ? `The ${TF_CONFLICT[tfA].style} thinker should acknowledge the emotional impact first; the ${TF_CONFLICT[tfB].style} thinker should state the logical bottom line clearly.` : null,
    jpA && jpB && jpA !== jpB ? `Set explicit timelines so the ${JP_DECISION['J'].style} person has a decision point and the ${JP_DECISION['P'].style} person knows they\'ll be heard before closure.` : null,
    instA && instB ? `Acknowledge each other\'s primary conversational priority before diving in.` : null,
  ].filter(Boolean);

  return { conflictStyle, decisionMaking, emotionalExpression, energyManagement, tips };
}

// --- Growth & Stress Interaction Map ---

const ARROW_NARRATIVES = {
  growth: {
    1: 'becoming more open, joyful, and spontaneous (toward 7)',
    2: 'becoming more authentic, emotionally honest, and self-caring (toward 4)',
    3: 'becoming more collaborative, loyal, and team-oriented (toward 6)',
    4: 'becoming more principled, disciplined, and action-oriented (toward 1)',
    5: 'becoming more bold, confident, and decisive (toward 8)',
    6: 'becoming more calm, trusting, and grounded (toward 9)',
    7: 'becoming more focused, present, and deeply engaged (toward 5)',
    8: 'becoming more open-hearted, caring, and nurturing (toward 2)',
    9: 'becoming more driven, purposeful, and self-asserting (toward 3)',
  },
  stress: {
    1: 'becoming moody, withdrawn, and self-indulgent (toward 4)',
    2: 'becoming aggressive, controlling, and entitled (toward 8)',
    3: 'becoming disengaged, apathetic, and unfocused (toward 9)',
    4: 'becoming over-dependent, clingy, and people-pleasing (toward 2)',
    5: 'becoming scattered, impulsive, and hyperactive (toward 7)',
    6: 'becoming competitive, arrogant, and dismissive (toward 3)',
    7: 'becoming critical, perfectionistic, and rigid (toward 1)',
    8: 'becoming withdrawn, secretive, and intellectualizing (toward 5)',
    9: 'becoming anxious, reactive, and catastrophizing (toward 6)',
  },
};

export function getGrowthStressInteraction(profileA, profileB) {
  const tA = profileA.ennType;
  const tB = profileB.ennType;
  if (!tA || !tB) return null;

  const arrowsA = ENN_ARROWS[tA];
  const arrowsB = ENN_ARROWS[tB];

  const aGrowthImpactOnB = arrowsA.growth === tB
    ? `When A grows toward Type ${arrowsA.growth}, they move toward ${ARROW_NARRATIVES.growth[tA]} — embodying qualities that resonate deeply with B's own core type. B may feel unusually energized by A in these moments.`
    : `A's growth direction (toward Type ${arrowsA.growth}) does not directly point toward B's type. However, A's healthier version brings ${ARROW_NARRATIVES.growth[tA]}, which may complement or challenge B's natural style.`;

  const aStressImpactOnB = arrowsA.stress === tB
    ? `When A is stressed, they move toward Type ${arrowsA.stress} — directly mimicking B's core type patterns, often in a disintegrated form. B may feel triggered or see an unflattering mirror of their own tendencies in A under pressure.`
    : `A's stress direction (toward Type ${arrowsA.stress}) doesn't point to B's type. A under stress shows ${ARROW_NARRATIVES.stress[tA]}, which B may find confusing or destabilizing.`;

  const bGrowthImpactOnA = arrowsB.growth === tA
    ? `When B grows toward Type ${arrowsB.growth}, they embody qualities associated with A's core type. A may feel a sense of recognition and deep appreciation when B is operating from their best self.`
    : `B's growth direction (toward Type ${arrowsB.growth}) does not directly point toward A. B's healthiest version brings ${ARROW_NARRATIVES.growth[tB]}, which may be a welcome complement to A.`;

  const bStressImpactOnA = arrowsB.stress === tA
    ? `When B is stressed toward Type ${arrowsB.stress}, they mimic A's type in disintegrated form. A may see a distorted version of themselves in B, creating confusion, sympathy, or friction.`
    : `B under stress moves toward ${ARROW_NARRATIVES.stress[tB]}, which A may experience as ${arrowsA.stress === arrowsB.stress ? 'a shared stress pattern that compounds' : 'an unfamiliar or destabilizing behavioral shift'}.`;

  const sharedGrowthPath = arrowsA.growth === arrowsB.growth
    ? `Both share the same growth direction (toward Type ${arrowsA.growth}). When both are growing, they move in parallel — reinforcing each other's development and recognizing the shared journey.`
    : null;

  const potentialFriction = arrowsA.stress === tB || arrowsB.stress === tA
    ? 'One person\'s stress behavior directly mimics the other\'s core type — this can create particularly charged dynamics under pressure.'
    : arrowsA.stress === arrowsB.stress
      ? 'Both share the same stress direction — when both are struggling, their disintegration patterns mirror each other and can escalate conflict.'
      : 'No direct arrow collision, but individual stress patterns may still disrupt the partnership in different ways.';

  return { aGrowthImpactOnB, aStressImpactOnB, bGrowthImpactOnA, bStressImpactOnA, sharedGrowthPath, potentialFriction };
}

// --- Cognitive Harmony Score ---

const COMPLEMENTARY_PAIRS = [['Te', 'Fi'], ['Fe', 'Ti'], ['Se', 'Ni'], ['Ne', 'Si']];

export function getCognitiveHarmony(mbtiA, mbtiB) {
  if (!mbtiA || !mbtiB) return null;
  const stackA = MBTI_TYPES[mbtiA]?.stack;
  const stackB = MBTI_TYPES[mbtiB]?.stack;
  if (!stackA || !stackB) return null;

  let score = 50;

  // Shared functions in top 4 (weighted by position — higher positions = more weight)
  const sharedFunctions = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (stackA[i] === stackB[j]) {
        const posWeight = (4 - i) * (4 - j);
        score += posWeight * 1.5;
        if (!sharedFunctions.includes(stackA[i])) sharedFunctions.push(stackA[i]);
      }
    }
  }

  // Complementary Dom↔Aux pairs bonus
  const complementaryPairs = [];
  for (const [a, b] of COMPLEMENTARY_PAIRS) {
    if ((stackA[0] === a && stackB[1] === b) || (stackA[1] === a && stackB[0] === b)) {
      score += 10;
      complementaryPairs.push({ a, b, dynamic: `${a} and ${b} are natural complements — one provides structure/grounding, the other provides the opposite orientation.` });
    }
    if ((stackA[0] === b && stackB[1] === a) || (stackA[1] === b && stackB[0] === a)) {
      score += 10;
      if (!complementaryPairs.find(p => p.a === a)) {
        complementaryPairs.push({ a: b, b: a, dynamic: `${b} and ${a} are natural complements — one provides structure/grounding, the other provides the opposite orientation.` });
      }
    }
  }

  // Same dominant penalty (both competing for same cognitive niche)
  if (stackA[0] === stackB[0]) score -= 5;

  score = Math.min(100, Math.max(0, Math.round(score)));

  // Narrative
  const blindSpots = [];
  const allFunctions = ['Fi', 'Fe', 'Ti', 'Te', 'Ni', 'Ne', 'Si', 'Se'];
  const combined = new Set([...stackA.slice(0, 4), ...stackB.slice(0, 4)]);
  allFunctions.forEach(fn => { if (!combined.has(fn)) blindSpots.push(fn); });

  const strengthsAsTeam = [];
  if (sharedFunctions.length >= 2) strengthsAsTeam.push('Strong mutual understanding — shared cognitive language reduces friction in communication');
  if (complementaryPairs.length > 0) strengthsAsTeam.push('Complementary function pairs — natural coverage of each other\'s gaps');
  if (stackA[0] !== stackB[0]) strengthsAsTeam.push('Different dominant functions — one\'s strength is not the other\'s, reducing competition');
  if (stackA[3] === stackB[0] || stackB[3] === stackA[0]) strengthsAsTeam.push('One person\'s inferior is the other\'s dominant — profound growth potential if navigated with patience');

  const narrative = score >= 75 ? 'High cognitive harmony. These two types share significant cognitive overlap and complement each other\'s strengths. Communication will generally be smooth, with natural intuitive understanding.'
    : score >= 55 ? 'Moderate cognitive harmony. There are both shared touchpoints and notable differences. The relationship requires some translation work but offers meaningful complementarity.'
    : 'Lower cognitive harmony. These types think very differently, which creates both friction and significant growth potential. With patience, the differences become a strength.';

  return { score, sharedFunctions, complementaryPairs, blindSpots, strengthsAsTeam, narrative };
}

// --- Instinct Stack Depth Analysis ---
// Uses instinctPairDynamics.js when available; falls back to derived analysis

let _instinctPairDynamics = null;
async function loadInstinctPairDynamics() {
  if (_instinctPairDynamics) return _instinctPairDynamics;
  try {
    const mod = await import('../data/instinctPairDynamics.js');
    _instinctPairDynamics = mod;
    return mod;
  } catch {
    return null;
  }
}

export function instinctPairKeySync(stackA, stackB) {
  const a = Array.isArray(stackA) ? stackA.join('/') : (stackA || '');
  const b = Array.isArray(stackB) ? stackB.join('/') : (stackB || '');
  return a <= b ? `${a}__${b}` : `${b}__${a}`;
}

const INSTINCT_DOM_DESC = {
  sp: { name: 'Self-Preservation', label: 'SP', focus: 'safety, comfort, and resource security' },
  sx: { name: 'Sexual/Intensity', label: 'SX', focus: 'passion, chemistry, and transformative connection' },
  so: { name: 'Social', label: 'SO', focus: 'belonging, group dynamics, and social contribution' },
  SP: { name: 'Self-Preservation', label: 'SP', focus: 'safety, comfort, and resource security' },
  SX: { name: 'Sexual/Intensity', label: 'SX', focus: 'passion, chemistry, and transformative connection' },
  SO: { name: 'Social', label: 'SO', focus: 'belonging, group dynamics, and social contribution' },
};

function deriveInstinctDepthAnalysis(stackA, stackB) {
  const domA = stackA[0];
  const domB = stackB[0];
  const repA = stackA[2];
  const repB = stackB[2];
  const secA = stackA[1];
  const secB = stackB[1];
  const dA = INSTINCT_DOM_DESC[domA] || { name: domA, label: domA, focus: 'their dominant drive' };
  const dB = INSTINCT_DOM_DESC[domB] || { name: domB, label: domB, focus: 'their dominant drive' };

  const sameDom = (domA || '').toLowerCase() === (domB || '').toLowerCase();
  const dominantDynamic = {
    a: dA.label,
    b: dB.label,
    narrative: sameDom
      ? `${dA.label}-meets-${dB.label}: both lead with ${dA.focus}. Immediate shared understanding of what matters most — the risk is a shared blind spot around the other instincts.`
      : `${dA.label} meets ${dB.label}: ${dA.label} prioritizes ${dA.focus} while ${dB.label} prioritizes ${dB.focus}. This difference in primary focus creates both complementarity and friction.`,
    attraction: sameDom ? 'Natural resonance — instant understanding of each other\'s core priorities.' : 'Each offers what the other values but doesn\'t lead with — complementary pulls.',
    friction: sameDom ? 'Risk of shared tunnel vision around your dominant drive. The other instincts get neglected by both.' : 'May misread each other\'s priorities as selfishness or mismatch in values.',
  };

  const sharedBlindSpot = repA && repB && (repA || '').toLowerCase() === (repB || '').toLowerCase()
    ? `Both have ${(repA || '').toUpperCase()} as their repressed instinct — this is a powerful shared blind spot. Neither person will naturally attend to ${INSTINCT_DOM_DESC[repA]?.focus || repA} concerns, and the gap may compound over time.`
    : null;

  const blindSpotAnalysis = {
    a: repA ? { repressed: (repA || '').toUpperCase(), impact: `A doesn\'t naturally attend to ${INSTINCT_DOM_DESC[repA]?.focus || repA}.` } : null,
    b: repB ? { repressed: (repB || '').toUpperCase(), impact: `B doesn\'t naturally attend to ${INSTINCT_DOM_DESC[repB]?.focus || repB}.` } : null,
    sharedBlindSpot,
  };

  const secALabel = (secA || '').toUpperCase();
  const secBLabel = (secB || '').toUpperCase();
  const secondaryBridge = secA && secB
    ? (secA || '').toLowerCase() === (secB || '').toLowerCase()
      ? `Both share ${secALabel} as their secondary drive — a strong secondary bridge that smooths over dominant differences and creates a natural meeting point.`
      : `A's secondary (${secALabel}) doesn't match B's secondary (${secBLabel}). The middle instincts mediate in different ways — watch for mismatched expectations in mid-tier priorities.`
    : 'Secondary instinct data unavailable.';

  const sameDomLower = sameDom;
  const sameRepLower = repA && repB && (repA || '').toLowerCase() === (repB || '').toLowerCase();
  const chemistry = sameDomLower && sameRepLower ? 'high' : !sameDomLower && sameRepLower ? 'medium' : sameDomLower ? 'medium' : 'variable';

  const tips = [
    sameDomLower ? `You share the same dominant instinct — actively check in on ${INSTINCT_DOM_DESC[repA]?.focus || 'your shared blind spot'}.` : 'Respect each other\'s dominant instinct — it\'s the core of what feels important to them.',
    sharedBlindSpot ? 'Deliberately schedule attention for your shared blind spot — it won\'t arise naturally for either of you.' : 'Appreciate how your different repressed instincts create complementary attention.',
  ].filter(Boolean);

  return { dominantDynamic, blindSpotAnalysis, secondaryBridge, overallChemistry: chemistry, tips };
}

export async function getInstinctDepthAnalysis(stackA, stackB) {
  if (!stackA?.length || !stackB?.length) return null;
  const normalA = stackA.map(s => (s || '').toUpperCase().replace('/', ''));
  const normalB = stackB.map(s => (s || '').toUpperCase().replace('/', ''));
  const keyA = stackA.map(s => (s || '').toUpperCase()).join('/');
  const keyB = stackB.map(s => (s || '').toUpperCase()).join('/');

  const dynMod = await loadInstinctPairDynamics();
  if (dynMod?.INSTINCT_PAIR_DYNAMICS && dynMod?.instinctPairKey) {
    const key = dynMod.instinctPairKey(keyA, keyB);
    const lookup = dynMod.INSTINCT_PAIR_DYNAMICS[key];
    if (lookup) {
      const derived = deriveInstinctDepthAnalysis(stackA, stackB);
      return { ...derived, pairData: lookup };
    }
  }

  return deriveInstinctDepthAnalysis(stackA, stackB);
}

// Synchronous version for cases where async is not needed
export function getInstinctDepthAnalysisSync(stackA, stackB) {
  if (!stackA?.length || !stackB?.length) return null;
  return deriveInstinctDepthAnalysis(stackA, stackB);
}
