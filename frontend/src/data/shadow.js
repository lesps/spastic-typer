/**
 * shadow.js — Static content for the 8-position cognitive function model.
 * Positions 1–4: ego stack (Lead, Anchor, Refuge, Hunger)
 * Positions 5–8: shadow stack (Counter, Critic, Gamble, Flood)
 */

export const POSITIONS = [
  { pos: 1, name: 'Lead',    arc: 'ego',    brief: 'Your most fluent, most trusted function.' },
  { pos: 2, name: 'Anchor',  arc: 'ego',    brief: 'Supports and balances the Lead. Opposite attitude.' },
  { pos: 3, name: 'Refuge',  arc: 'ego',    brief: 'Where you retreat for comfort under pressure.' },
  { pos: 4, name: 'Hunger',  arc: 'ego',    brief: 'You want it but can\'t quite hold it. Most exposed.' },
  { pos: 5, name: 'Counter', arc: 'shadow', brief: 'Fires reactively under duress, not fluidly.' },
  { pos: 6, name: 'Critic',  arc: 'shadow', brief: 'Distorted — comes out as judgment, not skill.' },
  { pos: 7, name: 'Gamble',  arc: 'shadow', brief: 'Present but unreliable. You can\'t tell when it\'s misfiring.' },
  { pos: 8, name: 'Flood',   arc: 'shadow', brief: 'Involuntary. Surfaces only when everything else breaks.' },
];

/**
 * Shadow position description templates.
 * Use {fn} for function abbreviation and {fnName} for full function name.
 */
export const SHADOW_TEMPLATES = {
  5: 'You have real access to {fn}, but it tends to show up reactively rather than fluidly. When you use it, there\'s often a defensive or dug-in quality — it emerges most strongly when you\'re pushing back against something, not when you\'re openly exploring. You may find yourself most aware of this function when someone else uses it in a way that feels excessive or wrongheaded.',
  6: 'You use {fn}, but there\'s a harsh judge attached to it. You have a low tolerance for inauthentic or poorly executed versions of it in others — and when you deploy it in a way that feels hollow or performative, the inner critic is swift and unforgiving. This isn\'t incompetence with the function. It\'s a charged relationship with it.',
  7: '{fn} is available to you but unreliable in a specific way — you can\'t always tell when it\'s working and when it isn\'t. It fires intermittently, sometimes effectively, but your self-monitoring here is weaker than in your ego stack. The risk isn\'t absence. It\'s overconfidence in moments when the function is actually misfiring.',
  8: 'Under ordinary conditions, {fn} is largely quiet — present but not prominent. Under significant stress or breakdown, it can emerge suddenly and in an unrefined form. This isn\'t a tool you\'re wielding. It\'s more like a pressure valve — involuntary, primitive, and often baffling to people around you who don\'t share your stack.',
};

/**
 * Position-crossing severity matrix for comparing two MBTI types.
 * Keys are canonical: lower position number first.
 * Tiers: 'highest' | 'high' | 'medium'
 * Templates use {fnA}, {fnB}, {typeA}, {typeB} placeholders.
 */
export const CROSSING_MATRIX = {
  '1-1': {
    tier: 'high',
    label: 'Shared Lead',
    template: 'Both {typeA} and {typeB} lead with {fnA}. You share the same primary mode of engaging the world — the same native fluency, the same default lens. This creates immediate recognition and a kind of shorthand. The friction, when it comes, is more about style and emphasis than fundamental orientation.',
  },
  '1-2': {
    tier: 'medium',
    label: 'Lead ↔ Anchor',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Anchor ({fnB}). What one type wields as its primary strength, the other uses as a supporting balance. This creates reasonable compatibility — both are comfortable with the function — but {typeA} may find {typeB}\'s relationship with it more tempered and less central than expected.',
  },
  '1-3': {
    tier: 'medium',
    label: 'Lead ↔ Refuge',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Refuge ({fnB}). What is forward and primary for one is a private comfort zone for the other. {typeB} has genuine access to this function but tends to retreat to it rather than wield it openly — which can make interactions feel slightly mismatched in energy and directness.',
  },
  '1-4': {
    tier: 'high',
    label: 'Lead ↔ Hunger',
    template: '{typeA}\'s Lead ({fnA}) sits at {typeB}\'s Hunger position. {typeA} does fluently and naturally what {typeB} strains toward. This can be a source of either inspiration or friction: {typeB} may be drawn to {typeA}\'s ease here, or may feel quietly exposed by it. {typeA}\'s strength lands exactly where {typeB} is most vulnerable.',
  },
  '1-5': {
    tier: 'high',
    label: 'Lead ↔ Counter',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Counter. What {typeA} deploys fluidly and openly, {typeB} accesses only reactively — with a defensive or pushed-back quality. {typeB} will recognize the function, and may even defend their use of it, but there\'s a charged edge that {typeA}\'s fluid lead can inadvertently press.',
  },
  '1-6': {
    tier: 'highest',
    label: 'Lead ↔ Critic',
    template: '{typeA}\'s Lead ({fnA}) sits directly at {typeB}\'s Critic position. This is the highest-friction crossing: what {typeA} does most naturally and fluently, {typeB} has the most charged, judgmental relationship with. {typeB} can\'t encounter {typeA}\'s {fnA} without it activating their inner critic — whether directed at {typeA} or turned inward on their own use of it.',
  },
  '1-7': {
    tier: 'high',
    label: 'Lead ↔ Gamble',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Gamble. {typeB} has access to this function but can\'t reliably gauge when it\'s working. Watching {typeA} deploy it with fluency can be illuminating or disorienting — {typeB} may believe they\'re following along effectively when they\'re actually misfiring. The gap is real but often invisible to {typeB}.',
  },
  '1-8': {
    tier: 'medium',
    label: 'Lead ↔ Flood',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Flood position — the most primitive, involuntary shadow expression. Under normal conditions this creates no particular friction; {typeB}\'s {fnA} is largely dormant. But under serious stress, {typeB} may produce an unrefined, pressurized version of what {typeA} does with ease, which can feel jarring to both.',
  },
  '2-4': {
    tier: 'medium',
    label: 'Anchor ↔ Hunger',
    template: '{typeA}\'s Anchor ({fnA}) maps to {typeB}\'s Hunger. What one type uses for stable balance and support, the other strains toward. The dynamic is subtler than Lead ↔ Hunger but still present: {typeB} may perceive {typeA}\'s ease with this function as something to emulate, while {typeA} may not fully register {typeB}\'s investment in it.',
  },
  '2-7': {
    tier: 'medium',
    label: 'Anchor ↔ Gamble',
    template: '{typeA}\'s Anchor ({fnA}) maps to {typeB}\'s Gamble. {typeA} leans on this function reliably; {typeB} uses it intermittently and can\'t always tell when it\'s accurate. This creates an asymmetry in confidence that may not be visible until a specific moment of misfire.',
  },
  '3-4': {
    tier: 'medium',
    label: 'Refuge ↔ Hunger',
    template: '{typeA}\'s Refuge ({fnA}) maps to {typeB}\'s Hunger. What one retreats to for comfort under pressure, the other is perpetually reaching toward. The crossing is lower-stakes than Lead ↔ Hunger but can surface as a subtle mismatch — {typeA} pulling back into something {typeB} is still actively trying to develop.',
  },
  '4-4': {
    tier: 'medium',
    label: 'Shared Hunger',
    template: 'Both {typeA} and {typeB} carry {fnA} as their Hunger function — the function both want and can\'t quite hold. Shared vulnerability here creates recognition: neither is effortless with this function. This can be bonding (both feel the same exposure) or frustrating (neither can model what the other needs).',
  },
  '4-8': {
    tier: 'high',
    label: 'Hunger ↔ Flood',
    template: '{typeA}\'s Hunger ({fnA}) maps to {typeB}\'s Flood. What one consciously strains toward, the other expresses only under involuntary breakdown. The crossing is asymmetric: {typeA}\'s effortful reach toward {fnA} may occasionally look like {typeB}\'s stress-release of the same function, creating confusion about whether either is actually using it well.',
  },
  '5-5': {
    tier: 'medium',
    label: 'Shared Counter',
    template: 'Both {typeA} and {typeB} carry {fnA} as their Counter — reactive, defensive, not fully fluid. Neither has genuine ease with this function; both access it primarily under duress. This shared limitation can create mutual recognition, or it can mean two people pushing back with the same charged energy when the function gets activated.',
  },
};

/**
 * Narrative for types that are full shadow mirrors of each other —
 * where one type's ego stack is the exact shadow stack of the other.
 */
export const FULL_SHADOW_PAIR_NARRATIVE = 'Every ego function of one type maps to a shadow position of the other. They each operate fluently in the exact domains where the other is most reactive, most charged, or most primitive. The resonance comes from recognition — each sees their shadow modeled with skill. The friction comes from the same place — each triggers the other\'s most charged positions just by being themselves.';
