/**
 * shadow.js — Static content for the 8-position cognitive function model.
 * Positions 1–4: ego stack (Lead, Anchor, Refuge, Hunger)
 * Positions 5–8: shadow stack (Counter, Critic, Gamble, Flood)
 *
 * POSITIONS carries identity only. What a position DOES lives in ROLES in
 * data/stack.js, which is sourced verbatim and provenance-tested; the `brief`
 * strings that used to live here predated the consolidated document and
 * contradicted it. Do not reintroduce a second, unsourced description here.
 */

export const POSITIONS = [
  { pos: 1, name: 'Lead',    arc: 'ego'    },
  { pos: 2, name: 'Anchor',  arc: 'ego'    },
  { pos: 3, name: 'Refuge',  arc: 'ego'    },
  { pos: 4, name: 'Hunger',  arc: 'ego'    },
  { pos: 5, name: 'Counter', arc: 'shadow' },
  { pos: 6, name: 'Critic',  arc: 'shadow' },
  { pos: 7, name: 'Gamble',  arc: 'shadow' },
  { pos: 8, name: 'Flood',   arc: 'shadow' },
];

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
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Gamble. {typeB} does have this function, but only as an involuntary discrepancy detector — it surfaces on its own schedule and cannot be summoned, and its interrupts are easy to dismiss. Watching {typeA} direct it deliberately can be illuminating or disorienting: what {typeA} steers, {typeB} can only receive, and usually discounts when it arrives.',
  },
  '1-8': {
    tier: 'medium',
    label: 'Lead ↔ Flood',
    template: '{typeA}\'s Lead ({fnA}) maps to {typeB}\'s Flood — an always-on background channel {typeB} does not attend to or claim. It runs continuously rather than lying dormant, so {typeB} is taking in the same material {typeA} works with deliberately, without registering that they are. Under serious stress it can take over, and the result looks nothing like {typeB}\'s usual self while being unmistakably familiar to {typeA}.',
  },
  '2-4': {
    tier: 'medium',
    label: 'Anchor ↔ Hunger',
    template: '{typeA}\'s Anchor ({fnA}) maps to {typeB}\'s Hunger. What one type uses for stable balance and support, the other strains toward. The dynamic is subtler than Lead ↔ Hunger but still present: {typeB} may perceive {typeA}\'s ease with this function as something to emulate, while {typeA} may not fully register {typeB}\'s investment in it.',
  },
  '2-7': {
    tier: 'medium',
    label: 'Anchor ↔ Gamble',
    template: '{typeA}\'s Anchor ({fnA}) maps to {typeB}\'s Gamble. {typeA} leans on this function as a steady standard; for {typeB} it is the lens an involuntary flash arrives through, credited or dismissed after the fact. The asymmetry is in directability, not accuracy — {typeB}\'s read can be perfectly good and still go unused.',
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
    template: '{typeA}\'s Hunger ({fnA}) maps to {typeB}\'s Flood. What one consciously strains toward, the other runs continuously in the background and disowns. The crossing is asymmetric in an odd way: {typeB} already has a rich stream of exactly what {typeA} is reaching for, and has no access to it deliberately.',
  },
  '5-5': {
    tier: 'medium',
    label: 'Shared Counter',
    template: 'Both {typeA} and {typeB} carry {fnA} as their Counter — Strong but unvalued. Each has real proficiency here and neither identifies with it; it fires when motivated striving is blocked, completes, and recedes. That shared shape can create mutual recognition, or it can mean two people pushing back with the same competent, principled force when the function gets activated.',
  },
  '2-2': {
    tier: 'medium',
    label: 'Shared Anchor',
    template: 'Both {typeA} and {typeB} use {fnA} as their Anchor — the function that supports and balances the Lead. This creates a quiet compatibility: both know how to let this function serve a stabilizing role rather than a primary one. The alignment here is less visible than a shared Lead but tends to make sustained interaction feel grounded.',
  },
  '3-3': {
    tier: 'medium',
    label: 'Shared Refuge',
    template: 'Both {typeA} and {typeB} retreat to {fnA} under pressure. When things get difficult, both reach for the same comfort function — which means they may withdraw to similar places and recognize the same instinct in each other. This can create quiet solidarity, or mutual collusion in avoidance if neither is willing to stay in harder territory.',
  },
  '2-5': {
    tier: 'medium',
    label: 'Anchor ↔ Counter',
    template: '{typeA}\'s Anchor ({fnA}) maps to {typeB}\'s Counter. What one type uses as steady support, the other fires defensively and reactively. {typeB} has real access to this function but tends to wield it with a dug-in quality — which can make {typeA}\'s relaxed, reliable version of it feel like a provocation or an implicit challenge.',
  },
  '2-6': {
    tier: 'high',
    label: 'Anchor ↔ Critic',
    template: '{typeA}\'s Anchor ({fnA}) sits at {typeB}\'s Critic position. What one type deploys as reliable background support, the other has a charged, judgmental relationship with. {typeB}\'s inner critic is attuned to exactly the function {typeA} leans on steadily — which means {typeA}\'s consistent use of it can quietly activate {typeB}\'s harshest internal judge.',
  },
  '3-6': {
    tier: 'medium',
    label: 'Refuge ↔ Critic',
    template: '{typeA}\'s Refuge ({fnA}) maps to {typeB}\'s Critic position. What one retreats into for comfort, the other has a harsh and charged relationship with. When {typeA} pulls back into this function under pressure, it may inadvertently trigger {typeB}\'s internal critic — making what feels like a safe retreat to {typeA} look like a failure of execution to {typeB}.',
  },
  '3-7': {
    tier: 'medium',
    label: 'Refuge ↔ Gamble',
    template: '{typeA}\'s Refuge ({fnA}) maps to {typeB}\'s Gamble — and this is the tightest of the shadow crossings, because Gamble evaluates through Refuge\'s function in the opposite attitude. {typeA} decompresses into the very lens {typeB}\'s flashes arrive through. When {typeA} is most unguarded, {typeB} is most likely to register something and least likely to be able to say where it came from.',
  },
};

/**
 * Narrative for types that are stack inverses of each other — one type's ego
 * stack IS the other's shadow stack. Not a "mirror": the source reserves mirror
 * for the nested partner (1-8, 2-7, 3-6, 4-5), and conflating the two pairings
 * is the most common contamination error.
 * where one type's ego stack is the exact shadow stack of the other.
 */
export const STACK_INVERSION_NARRATIVE = 'Every ego function of one type maps to a shadow position of the other. They each operate fluently in the exact domains where the other is most reactive, most charged, or most primitive. The resonance comes from recognition — each sees their shadow modeled with skill. The friction comes from the same place — each triggers the other\'s most charged positions just by being themselves.';
