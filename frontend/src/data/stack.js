/**
 * stack.js — Content for the Stack view: the eight positions, the couplings
 * between them, and how each position's purpose changes as the fixation reaches
 * it. Strings only — logic lives in utils/stack.js.
 *
 * PROVENANCE. Every prose string here is a verbatim substring of a checked-in
 * source document (see SOURCE_DOCS). Nothing is paraphrased, summarised, or
 * repunctuated; `stack-data.test.js` asserts this mechanically, so a string that
 * reads awkwardly out of context is still not ours to smooth over. Selecting a
 * subset of sentences is allowed; editing one is not. Where the two source
 * documents disagree, ct-consolidated.md is authoritative and supersedes.
 *
 * The mechanism is adjacency corruption (MECHANISM below): a shadow position's
 * corrupted output becomes an ego position's input. Critic write-back is the
 * middle instance of that rule, not the whole of it. Levels are Riso-Hudson
 * levels (1-9); positions are stack positions (1-8). They are different
 * numbering systems and any label showing both must say which is which (see
 * LABEL_TEMPLATES.positionLevel).
 */

export const SOURCE_DOCS = ['docs/specs/ct-consolidated.md', 'docs/specs/stack-view.md'];

export const STAGE_BANDS = ['Boundary', 'Maintenance', 'Reality-testing', 'Terminal'];

// The unified mechanism. Part II §1.
export const MECHANISM = {
  statement: "a shadow position's corrupted output becomes an ego position's input, and sustained corrupted input recalibrates the receiver",
  egoToShadow: 'Each ego position corrupts its nested partner: Hunger→Counter, Refuge→Critic, Anchor→Gamble, Lead→Flood.',
  shadowToEgo: 'Each shadow position corrupts the ego position one step outward from its nested partner: Counter(5)→Refuge(3), Critic(6)→Anchor(2), Gamble(7)→Lead(1).',
  closure: "Flood's outward target would be position 0, which does not exist.",
  invisibility: 'And because shadow output is Unvalued and dismissed, every transmission step is invisible to the person: the descent is experienced as a series of unexplained arrivals.',
};

// The two pairings, kept distinct. Part I §2. Confusing them is the most common
// contamination error, so both are data rather than prose.
export const NESTED_PAIRS = [[1, 8], [2, 7], [3, 6], [4, 5]];
export const DOMAIN_PAIRS = [[1, 5], [2, 6], [3, 7], [4, 8]];

export const PAIR_NOTES = {
  domain: [
    'A domain pair is one functional territory split across two access profiles.',
    'Colonization must capture both members to seal a domain, and it reaches them separately; this positional protection is why Terminal arrives in four stages rather than two.',
  ],
  nested: [
    "Each shadow position is built to read its nested partner's output",
    'The colonization sequence runs on the nested pairs.',
  ],
};

// Position roles. Part I §1, role column.
export const ROLES = {
  1: 'Primary perception; directable input channel; the function the self most identifies with',
  2: "Evaluative standard; the gate Lead's output must pass for execution; conscious stabilizer",
  3: 'Engine: forward motion in active mode, restoration in rest mode',
  4: 'Motivational base; constitutively gap-shaped; the seat of the fixation',
  5: "Lead's attitude flipped; defends motivated striving; proficient but not identified-with",
  6: "Anchor's attitude flipped; samples Refuge's unguarded behavior and updates Anchor's standard",
  7: "Refuge's attitude flipped; discrepancy detector between Flood's background stream and awareness",
  8: "Hunger's attitude flipped; always-on background input; emergency override",
};

// Augusta classification by position. Part I §1.
export const CLASSIFICATION = {
  1: 'Strong + Valued',   2: 'Strong + Valued',
  3: 'Weak + Valued',     4: 'Weak + Valued',
  5: 'Strong + Unvalued', 6: 'Strong + Unvalued',
  7: 'Weak + Unvalued',   8: 'Weak + Unvalued',
};

// Four stages = four nested pairs. Part II §3.
export const STAGES = [
  { name: 'Boundary',        pair: 'Hunger + Counter', positions: [4, 5], levels: [2, 3], lost: 'The boundary between self and fixation' },
  { name: 'Maintenance',     pair: 'Refuge + Critic',  positions: [3, 6], levels: [4, 5], lost: 'Self-sustaining capacity: recovery and recalibration' },
  { name: 'Reality-testing', pair: 'Anchor + Gamble',  positions: [2, 7], levels: [6, 7], lost: 'Internal verification: the standard and the discrepancy detector' },
  { name: 'Terminal',        pair: 'Lead + Flood',     positions: [1, 8], levels: [8, 9], lost: 'Both reality-contact channels' },
];

/**
 * Level → what happens there. Appendix D supplies `rh` and `rhBand`; Part II §2
 * supplies `kind` (how the position is captured) and `transition` (the predicted
 * sharpness profile: sharp at 2 and 3, slow through 4 and 5, two sharp crossings
 * at 6 and 7, slow through 8 and 9). Level 1 captures nothing and has no stage —
 * it is reachable only by recovery, so it is not a band anyone starts in.
 */
export const CAPTURE_ORDER = {
  1: { pos: null, band: null,              kind: null,             transition: null,   rh: 'Liberation',                  rhBand: 'Healthy' },
  2: { pos: 4,    band: 'Boundary',        kind: 'identification', transition: 'sharp', rh: 'Psychological Capacity',     rhBand: 'Healthy' },
  3: { pos: 5,    band: 'Boundary',        kind: 'immediate',      transition: 'sharp', rh: 'Social Value',               rhBand: 'Healthy' },
  4: { pos: 3,    band: 'Maintenance',     kind: 'accumulation',   transition: 'slow',  rh: 'Imbalance / Social Role',    rhBand: 'Average' },
  5: { pos: 6,    band: 'Maintenance',     kind: 'accumulation',   transition: 'slow',  rh: 'Interpersonal Control',      rhBand: 'Average' },
  6: { pos: 2,    band: 'Reality-testing', kind: 'accumulation',   transition: 'sharp', rh: 'Overcompensation',           rhBand: 'Average' },
  7: { pos: 7,    band: 'Reality-testing', kind: 'immediate',      transition: 'sharp', rh: 'Violation',                  rhBand: 'Unhealthy' },
  8: { pos: 1,    band: 'Terminal',        kind: 'accumulation',   transition: 'slow',  rh: 'Delusion and Compulsion',    rhBand: 'Unhealthy' },
  9: { pos: 8,    band: 'Terminal',        kind: 'accumulation',   transition: 'slow',  rh: 'Pathological Destructiveness', rhBand: 'Unhealthy' },
};

// Purpose transformation — the payload. Native from Part I §1/§4/§5/§6,
// captured from the position's own capture level in Part II §4.
export const PURPOSES = {
  1: {
    native: [
      'Primary perception; directable input channel; the function the self most identifies with',
      'Lead is attended, directed, and identified-with.',
    ],
    captured: [
      'Capture is a fixation-shaped default orientation: perception pre-filtered before it reaches the self.',
      'Lead resists longest on the ego side because it is directable and externally corrected.',
    ],
  },
  2: {
    native: [
      "Evaluative standard; the gate Lead's output must pass for execution; conscious stabilizer",
    ],
    captured: [
      'The Anchor trap: colonized Anchor is not passively contaminated, it actively produces fixation-shaped stability that looks healthy, because stabilizing is its job.',
      'Healthy Anchor stabilizes across domains; colonized Anchor stabilizes one thing obsessively.',
    ],
  },
  3: {
    native: [
      'Engine: forward motion in active mode, restoration in rest mode',
      "Refuge translates Lead's perception and Anchor's evaluation into daily forward motion, and restores capacity at rest through engagement with its own function.",
    ],
    captured: [
      'Propulsion becomes fixation-shaped forward motion; recovery stops restoring.',
      'Capture is the point where rest no longer produces clean output: the person cannot decompress out of the fixation, and "off mode" looks like "on mode" at lower intensity.',
    ],
  },
  4: {
    native: [
      'Motivational base; constitutively gap-shaped; the seat of the fixation',
      'The fixation is the constitutional shape of Hunger.',
    ],
    captured: [
      'Not corruption.',
      "Awareness shifts from observing the reach to identifying with it; the fixation is now defended as the self's legitimate interest.",
    ],
  },
  5: {
    native: [
      "Lead's attitude flipped; defends motivated striving; proficient but not identified-with",
    ],
    captured: [
      "Counter defends motivated striving by monitoring Hunger's output; the first fixation-shaped signal captures it.",
      "Counter is Strong + Unvalued, so captured Counter is proficient defense of the fixation's territory applied with a real standard: the golden rule, symmetric, principled pushback.",
    ],
  },
  6: {
    native: [
      "Anchor's attitude flipped; samples Refuge's unguarded behavior and updates Anchor's standard",
      'Critic is doing its job correctly throughout.',
    ],
    captured: [
      "Once it is majority-corrupted, Critic's updates to Anchor go fixation-shaped.",
      "Surface: Critic's targets redirect from Anchor's native negative image to fixation concerns — the person audits others against what the fixation fears.",
    ],
  },
  7: {
    native: [
      "Refuge's attitude flipped; discrepancy detector between Flood's background stream and awareness",
      "Gamble is the evaluative gateway between Flood's stream and awareness.",
    ],
    captured: [
      "When the second threshold is crossed, Gamble's polarity inverts in the same step: the flash now fires on deviation from the fixation and pulls the self back.",
      'Because polarity corruption is in the comparator and not the signal, a surfacing at Level 7 or 8 still contains the accurate discrepancy.',
    ],
  },
  8: {
    native: [
      "Hunger's attitude flipped; always-on background input; emergency override",
      'Flood is not an eruption; it runs all the time.',
    ],
    captured: [
      'Capture is when Flood no longer distinguishes fixation threat from organismic threat.',
      'The inversion persists; the direction of the override flips from away-from-danger to toward-fixation',
    ],
  },
};

/**
 * Level narration. `text` is what the panel shows; `more` is the rest of the
 * paragraph behind an expander; `falsifier` is the observation that would kill
 * the claim, where the source states one. All verbatim, in source order.
 */
export const LEVEL_NARRATION = {
  1: {
    title: '1',
    text: [
      'Level 1 is no position captured.',
      "It is reachable only by recovery, which matches Riso-Hudson's Liberation as earned rather than innate.",
    ],
    more: [
      'Level 1 — no position captured — is therefore not a developmental state anyone starts in.',
    ],
    falsifier: null,
  },
  2: {
    title: '2 · Hunger',
    text: [
      'Not corruption.',
      "Awareness shifts from observing the reach to identifying with it; the fixation is now defended as the self's legitimate interest.",
    ],
    more: [
      'Discrete.',
      'Amplitude is set by substrate pressure.',
      'Riso-Hudson Level 2 is Psychological Capacity, where the basic fear first arises — the two frameworks independently locate the origin at the same level with the same content.',
    ],
    falsifier: null,
  },
  3: {
    title: '3 · Counter',
    text: [
      "Counter defends motivated striving by monitoring Hunger's output; the first fixation-shaped signal captures it.",
      "The first inter-stage edge opens: Counter's threat output is adjacent to Refuge and begins bleeding into it.",
    ],
    more: [
      "Counter is Strong + Unvalued, so captured Counter is proficient defense of the fixation's territory applied with a real standard: the golden rule, symmetric, principled pushback.",
      'Refuge is under load but not captured — downtime is repurposed toward fixation-relevant activity, output rises, restoration still works.',
      'This is Riso-Hudson Social Value decomposed into two structural facts: Counter captured gives the principled defense, Refuge encroached gives the productivity.',
    ],
    falsifier: 'the Level 3 output increase should be sourced from downtime, not from efficiency or longer deliberate hours; and Level 2 should show lower output with cleaner restoration.',
  },
  4: {
    title: '4 · Refuge',
    text: [
      "Sustained Counter threat output plus Hunger's reaching contaminate both of Refuge's modes.",
      'Propulsion becomes fixation-shaped forward motion; recovery stops restoring.',
    ],
    more: [
      'Capture is the point where rest no longer produces clean output: the person cannot decompress out of the fixation, and "off mode" looks like "on mode" at lower intensity.',
      'Riso-Hudson Social Role — the gift becomes the thing that cannot be set down — is the same event.',
    ],
    falsifier: null,
  },
  5: {
    title: '5 · Critic',
    text: [
      "Critic has been sampling Refuge's unguarded pattern all along, because that is how it calibrates Anchor; the sample is now corrupted.",
      "Once it is majority-corrupted, Critic's updates to Anchor go fixation-shaped.",
    ],
    more: [
      "Surface: Critic's targets redirect from Anchor's native negative image to fixation concerns — the person audits others against what the fixation fears.",
      'Write-back is now running corrupted updates continuously; the second inter-stage edge is open.',
      "Substrate pressure is the rate term on both captures in this stage: it amplifies the signal at Hunger, which amplifies Counter's output, which raises the bleed into Refuge, which raises the corruption fraction in Critic's sample.",
    ],
    falsifier: null,
  },
  6: {
    title: '6 · Anchor',
    text: [
      "Anchor's standard drifts continuously under corrupted updates.",
      "Capture is the first of two thresholds on that drift: the gate flip, where the fixation-shaped standard validates the majority of Lead's outputs.",
    ],
    more: [
      'The leaden rule — a real standard, asymmetrically applied — and Riso-Hudson Overcompensation name the same asymmetry.',
      'The Anchor trap: colonized Anchor is not passively contaminated, it actively produces fixation-shaped stability that looks healthy, because stabilizing is its job.',
      'Healthy Anchor stabilizes across domains; colonized Anchor stabilizes one thing obsessively.',
    ],
    falsifier: null,
  },
  7: {
    title: '7 · Gamble',
    text: [
      "Gamble is a discrepancy detector whose comparator is Anchor's standard, with no independent reference.",
      "The second threshold on Anchor's drift is discrepancy inversion: the standard is corrupt enough that Flood's clean data reads as deviant.",
    ],
    more: [
      "When the second threshold is crossed, Gamble's polarity inverts in the same step: the flash now fires on deviation from the fixation and pulls the self back.",
      'The last internal check is gone; the system is unfalsifiable from inside.',
      'Riso-Hudson Violation is the behavioral face of this epistemic fact — violation becomes available once nothing internal can flag it.',
    ],
    falsifier: 'if Gamble surprise vanishes simultaneously with leaden-rule onset in all configurations, the two thresholds are one and Level 7 is not a distinct level.',
  },
  8: {
    title: '8 · Lead',
    text: [
      "The third inter-stage edge: Gamble is the interrupt line into Lead's attention, and after Level 7 every interrupt is fixation-shaped.",
      'Capture is a fixation-shaped default orientation: perception pre-filtered before it reaches the self.',
    ],
    more: [
      'Lead resists longest on the ego side because it is directable and externally corrected.',
      'Lead — Strong, Valued, plastic — learns that fixation-relevant stimuli are the salient ones because those are the only ones it is pulled to.',
      'Terminal onset.',
      'The person becomes maximally predictable — a stable attractor, a stereotype in the precise sense.',
    ],
    falsifier: null,
  },
  9: {
    title: '9 · Flood',
    text: [
      "Flood's trigger question — does this exceed deliberate processing? — is evaluated on Lead-filtered perception, so after Level 8 the emergencies are fixation-defined.",
      'Capture is when Flood no longer distinguishes fixation threat from organismic threat.',
    ],
    more: [
      "Flood is still clean at Level 8 and still fires as self-protective inversion: the override removes the organism from perceived danger, in Hunger's domain, unfixated.",
      "The inversion persists; the direction of the override flips from away-from-danger to toward-fixation — the ENFP's Se-Flood stops being reckless sensory escape and becomes reckless sensory action in service of the image.",
      'Both input channels are sealed.',
      'Flood has no outward target.',
    ],
    falsifier: 'if Level 9 dysregulation still runs away from danger rather than toward the fixation, the Lead→Flood edge is wrong and Terminal is a two-stage event.',
  },
};

// Persistently visible beside the scrubber. The scrubber is a depth read, not a
// severity score and not a forecast.
export const EQUILIBRIUM_CAVEAT = [
  'Operating level is a state, not a trait.',
  'It shifts week to week within a range whose ceiling is set by accumulated write-back; the current read is where the person is now, the range is what recovery has to walk back.',
  'Equilibrium stabilizes at Reality-testing with Gamble intact because further colonization adds no marginal utility.',
  'Read depth from which positions are captured, not from how bad the day is.',
];

// How the two scales relate. Appendix D.
export const CORRESPONDENCE_NOTE = [
  'It yields the nine Riso-Hudson health levels as generated output rather than borrowed description',
  "Where they diverge: CT reads part of Level 3's productivity as early fixation drive; R-H reads Level 3 as the peak of health.",
];

// Counter threat output by the function at position 5. Appendix B: form is
// determined by the function, content by Hunger's scarcity model.
export const COUNTER_THREAT_OUTPUT = {
  Ni: { texture: 'Convergent trajectory: one inevitable path to the feared outcome, with felt certainty', contamination: 'Chronic anticipatory dread with a specific trajectory' },
  Ne: { texture: 'Divergent multiplication: simultaneous branching failure modes, none resolving',        contamination: 'Anxious possibility-flooding' },
  Fe: { texture: 'Present-tense relational damage assessment: connection is fracturing now',             contamination: 'Persistent relational monitoring during rest' },
  Fi: { texture: 'Authenticity alarm: felt conviction of having betrayed something essential',           contamination: 'Rest feels like self-betrayal' },
  Te: { texture: 'Evidentiary failure assessment: by measurable criteria this is failing',               contamination: 'Performance-metric monitoring during rest' },
  Ti: { texture: 'Logical necessity: given these premises, failure is certain',                          contamination: 'Internal case-building for the threat' },
  Si: { texture: 'Precedent certainty: every time this arose, it ended this way',                        contamination: 'Historical evidence activation' },
  Se: { texture: 'Immediate environmental scan: somatic vigilance for present danger cues',              contamination: 'Hypervigilance to cues during rest' },
};

/**
 * Structural couplings. `kind` distinguishes the three sorts:
 *   'nested'     — the dependency couplings; each shadow position reads its
 *                  nested partner's output (Part I §2).
 *   'corruption' — the shadow→ego edges the sequence runs on: a shadow position
 *                  corrupts the ego position one step outward (Part II §1).
 *   'structural' — the gate. Anchor validates Lead; not a corruption edge.
 * `weight: 'spine'` marks the load-bearing pair (Refuge → Critic → Anchor).
 */
export const EDGES = [
  { id: 'monitor',   from: 4, to: 5, label: 'monitor',    kind: 'nested',     weight: 'normal', meaning: "Counter watches Hunger's striving and fires when it's blocked" },
  { id: 'sample',    from: 3, to: 6, label: 'sample',     kind: 'nested',     weight: 'spine',  meaning: "Refuge's unguarded output is Critic's primary calibration data" },
  { id: 'check',     from: 2, to: 7, label: 'check',      kind: 'nested',     weight: 'normal', meaning: "Gamble tests against Anchor's standard" },
  { id: 'trigger',   from: 1, to: 8, label: 'trigger',    kind: 'nested',     weight: 'normal', meaning: "Flood's triggers arrive pre-filtered through Lead" },
  { id: 'bleed',     from: 5, to: 3, label: 'bleed',      kind: 'corruption', weight: 'normal', meaning: "Counter's threat output is adjacent to Refuge and begins bleeding into it" },
  { id: 'writeback', from: 6, to: 2, label: 'write-back', kind: 'corruption', weight: 'spine',  meaning: "Critic continuously updates Anchor's evaluative standard" },
  { id: 'interrupt', from: 7, to: 1, label: 'interrupt',  kind: 'corruption', weight: 'normal', meaning: "Gamble is the interrupt line into Lead's attention" },
  { id: 'gate',      from: 2, to: 1, label: 'gate',       kind: 'structural', weight: 'normal', meaning: "Anchor's standard validates Lead's output for execution" },
];

// Edges carrying load at each level, from the capture account in Part II §4.
export const ACTIVE_EDGES = {
  1: [],
  2: [],
  3: ['monitor', 'bleed'],
  4: ['bleed'],
  5: ['sample', 'writeback'],
  6: ['writeback', 'gate'],
  7: ['check'],
  8: ['interrupt'],
  9: ['trigger'],
};

// UI label templates. Placeholders: {fn} {fnName} {pos} {name} {level} {type}.
// Chrome, not framework prose — these name things, they make no claims, and they
// are the one export exempt from the provenance check.
export const LABEL_TEMPLATES = {
  positionOnly:  'Position {pos} · {name}',
  positionLevel: 'Position {pos} · {name} · captured at Level {level}',
  fnAtPosition:  '{fnName} ({fn}) at {name}',
  hungerBadge:   'Type {type} installs here',
  capturedAt:    'Captured at Level {level}',
  bridgeNote:    'Riso-Hudson tier language for Type {type}.',
  levelLine:     'Level {level} · {rh} · {band}',
  stageLine:     '{name} stage · {pair} · Levels {levels}',
};

/**
 * Fixation utility for Lead — the single surface modulator. Whether Lead's
 * native output serves or conflicts with the fixation's strategy determines the
 * surface presentation and the equilibrium depth, running on the same mechanism.
 *
 * `anchors` are the ONLY committed function × type cells in the source. The
 * remaining cells do not exist; do not infer them. Utility is offered as a
 * property the user reads off their own behaviour with the stakes-distribution
 * diagnostic, which is how the source says to determine it.
 */
export const UTILITY = {
  high: {
    label: 'High utility',
    stakes: 'Across all stakes',
    summary: "Lead's native output directly serves the fixation",
    detail: [
      'Lead passes the corrupted gate and is deployed in fixation service across all stakes.',
      'Integrated, ego-syntonic, recognizable as the type-fixation archetype; the fixation is visible in Lead operation.',
      'Counter operation is minimal because Lead is doing the work.',
    ],
    gap: 'in high-utility configurations the gate flips early, so the 6→7 gap is wide',
  },
  mixed: {
    label: 'Mixed utility',
    stakes: 'Moderate stakes only',
    summary: 'context-dependent operation revealing the utility seam',
    detail: ['context-dependent operation revealing the utility seam'],
    gap: null,
  },
  low: {
    label: 'Low utility',
    stakes: 'Low stakes only',
    summary: "Lead's native output structurally conflicts with the fixation",
    detail: [
      'Lead fails validation in fixation-evaluation-hot contexts and operates only where the gate relaxes — private reflection, intimate trusted contexts, leisure, specific creative outlets.',
      'Counter handles high-stakes load through its existing Strong + Unvalued proficiency.',
      'Compressed, ego-dystonic, often mistyped because Counter-dominant operation resembles another type; the person senses the gap and seeks help.',
      'Equilibrium stabilizes at Reality-testing with Gamble intact because further colonization adds no marginal utility.',
    ],
    gap: 'in low-utility configurations the gate flip already required deep drift, so the gap is narrow',
  },
};

export const UTILITY_DIAGNOSTIC = {
  question: 'where does the typed Lead actually operate natively?',
  rows: [
    { stakes: 'Across all stakes', utility: 'high' },
    { stakes: 'Moderate stakes only', utility: 'mixed' },
    { stakes: 'Low stakes only', utility: 'low' },
  ],
  nowhere: 'Nowhere observable → extreme corruption or typing error.',
};

// The only committed utility cells in the source. Everything else is unknown.
export const UTILITY_ANCHORS = [
  { fn: 'Te', position: 1, type: 3, utility: 'high' },
  { fn: 'Ni', position: 1, type: 4, utility: 'high' },
  { fn: 'Se', position: 1, type: 8, utility: 'high' },
  { fn: 'Fi', position: 1, type: 3, utility: 'low' },
  { fn: 'Se', position: 1, type: 5, utility: 'low' },
];

/**
 * The two thresholds on Anchor's drift. Anchor's standard drifts continuously
 * under corrupted write-back; these are the two discrete crossings on it, which
 * is why Levels 6 and 7 are distinct levels rather than one event.
 */
export const THRESHOLDS = [
  {
    id: 'gateFlip',
    name: 'gate flip',
    level: 6,
    detail: "the fixation-shaped standard validates the majority of Lead's outputs",
    why: "reading corrupted output as acceptable takes less drift than reading clean input as wrong",
  },
  {
    id: 'discrepancyInversion',
    name: 'discrepancy inversion',
    level: 7,
    detail: "the standard is corrupt enough that Flood's clean data reads as deviant",
    why: "It is higher than the gate flip because Lead's outputs are already partly fixation-shaped by Level 5 and are cheap to validate, whereas Flood's data is raw until Terminal and is expensive to read as wrong",
  },
];

/**
 * Gamble's three properties, and how each degrades. Only polarity is discrete;
 * sensitivity and lens are gradients that start at Level 4, which is why
 * surprise becomes rare before it becomes absent.
 */
export const GAMBLE_PROPERTIES = [
  {
    id: 'sensitivity',
    name: 'Sensitivity',
    what: 'the threshold a background signal must cross to surface',
    degrades: 'gradient',
    from: 4,
    detail: [
      'Feedback-modulated: Gamble is Unvalued, its interrupts are dismissed, and repeated dismissal raises the threshold.',
      'A gradient at Gamble from Level 4, independent of Anchor; why surprise becomes rare (5–6) before it becomes absent (7+).',
    ],
    trainable: 'sensitivity is trainable in both directions, so hit rate and credited fraction can improve even though directability cannot',
  },
  {
    id: 'lens',
    name: 'Lens',
    what: "the function Gamble evaluates through, Refuge's in opposing attitude",
    degrades: 'gradient',
    from: 4,
    detail: [
      "from Level 4 the shared function is run fixation-shaped most of the day at Refuge, and the vocabulary Gamble surfaces in leaks toward the fixation's",
      "The flash still catches what is wrong and still reads it as wrong; the frame is increasingly the captured engine's",
    ],
    trainable: null,
  },
  {
    id: 'polarity',
    name: 'Polarity',
    what: "the comparator, Anchor's standard",
    degrades: 'discrete',
    from: 7,
    detail: [
      'Because polarity corruption is in the comparator and not the signal, a surfacing at Level 7 or 8 still contains the accurate discrepancy.',
      'The person cannot read it.',
      'Someone else can.',
    ],
    trainable: null,
  },
];

export const GAMBLE_SUMMONABILITY = 'Unsummonable stands: the background channel cannot be queried.';

/**
 * Odd levels are shadow captures, whose output is Unvalued and dismissed; even
 * levels are ego captures, experienced as self. The source predicts the two are
 * narrated differently, which is a check a user can run on their own memory.
 */
export const ODD_EVEN = {
  odd: {
    arc: 'shadow',
    levels: [3, 5, 7, 9],
    reported: 'the world changing',
    example: 'people got more hostile, more careless, more dangerous',
  },
  even: {
    arc: 'ego',
    levels: [4, 6, 8],
    reported: 'the self changing',
    example: "I've been different, I can't relax the way I used to",
  },
  consequence: "only what the person can perceive as theirs is addressable, which is even-level positions and Gamble's registration",
  falsifier: 'if descent narratives are uniformly self-referential or uniformly world-referential, the alternation is an artifact of the position model.',
};

/**
 * Scarcity model, Counter's threat orientation, and the growth direction, by
 * Enneagram type. Appendix C. `growth` is the arrow target and `falsifies` is
 * the experience Counter's threat output declares will not arrive — the growth
 * direction is that falsification, not an aspirational quality or a practice.
 */
export const FIXATION = {
  1: { scarcity: 'Nothing is sufficiently correct; error is always possible and serious', threat: 'Relaxing the standard produces irreversible damage', growth: 7, falsifies: 'satisfaction in something as it is, arriving without correction' },
  2: { scarcity: 'Worth is produced by being needed; without giving I will be abandoned', threat: 'Without providing, no one will want me for what I am', growth: 4, falsifies: 'being sought for interiority rather than utility' },
  3: { scarcity: 'Worth is produced only by performance; without achievement I am nothing', threat: 'Non-performance cascades to material and relational collapse', growth: 6, falsifies: 'support arriving without performing for it; structures holding during non-performance' },
  4: { scarcity: 'Something essential is missing in me; I am too deficient to function normally', threat: 'I am too broken to sustain ordinary commitments', growth: 1, falsifies: 'consistent principled functioning available while the deficiency feeling persists' },
  5: { scarcity: 'Internal resources are insufficient; demands exceed what I can meet', threat: 'Engagement will drain me to nothing', growth: 8, falsifies: 'direct engagement generating rather than depleting energy' },
  6: { scarcity: 'The world is dangerous; support is unreliable; vigilance is the only defense', threat: 'Relaxing monitoring lets catastrophe arrive undetected', growth: 9, falsifies: 'rest with vigilance suspended; things hold without monitoring' },
  7: { scarcity: 'Slowing down traps me in pain; depth means being stuck with the unbearable', threat: 'Committing to one thing exhausts all exits', growth: 5, falsifies: 'depth that is spacious rather than trapping' },
  8: { scarcity: 'Vulnerability is exploitable; only force ensures safety', threat: 'Tenderness will be weaponized against me', growth: 2, falsifies: 'care given returning as care rather than leverage' },
  9: { scarcity: 'My presence is disruptive; assertion destroys connection', threat: 'Asserting myself damages the field beyond repair', growth: 3, falsifies: 'assertion deepening connection; mattering welcomed' },
};

/** Structure is inborn; only calibration is revisable, and calibration is what drives level. */
export const FIXATION_NOTES = {
  structure: 'Its structure — the basic fear/desire architecture — is inborn.',
  calibration: 'Its calibration — the scarcity model: how bad, how likely, how soon, in which domain — is learned.',
  revision: "Counter's threat output is constitutional structure running on learned parameters; growth work revises the parameters, never the structure.",
  invariance: 'Type does not change over a lifetime; level does.',
};

/**
 * Substrate pressure by first instinct. The first instinct's territory is where
 * IV-domain threat arises; that threat sets the amplitude of the fixation signal
 * at Hunger and is therefore the rate term on every accumulation capture.
 */
export const SUBSTRATE = {
  sp: {
    drive: 'CARE',
    territory: 'material stability for SP-first',
    register: 'what is actually stable or real; worst case is losing the job, the money, the health, the roof',
    reduction: 'stabilize material and physical ground first — income, housing, health, schedule; the fixation is reading these as the emergency',
  },
  so: {
    drive: 'PLAY',
    territory: 'group standing for SO-first',
    register: 'what happened in front of the room; worst case is public dismissal',
    reduction: "stabilize standing — a group, a role, a place at the table that does not depend on the fixation's performance",
  },
  sx: {
    drive: 'LUST',
    territory: 'dyadic intensity for SX-first',
    register: 'the specific person; worst case is bond rupture',
    reduction: "stabilize the dyad — one reliable intense connection whose continuity does not track the fixation's strategy",
  },
};

export const SUBSTRATE_ROLES = [
  'Rate term on every accumulation capture, via Hunger signal → Counter threat output → downstream.',
  'Co-condition at Lead, where it consumes deliberate direction.',
  "Exceedance-frequency driver at Flood and at Gamble's firing rate",
];

export const SUBSTRATE_NOTE = 'It is not the fixation and it is not the level; it is what drives the level.';
export const SUBSTRATE_TARGET = "In each case the target is not comfort but the removal of the specific threat the first instinct is monitoring, so that Hunger's signal amplitude drops and everything downstream runs at a lower rate.";

/**
 * Growth as falsification. Sourcing must be external and registration runs
 * through Gamble; performing the growth direction deliberately is the fixation
 * operating, which is why the app describes it rather than prescribing it.
 */
export const GROWTH_MECHANISM = [
  "The growth direction is the specific experience Counter's threat output declares will not arrive — not a better quality, not an aspirational practice, the exact outcome Counter identifies as the consequence of the fixation failing",
  "Each genuine growth-direction experience contradicts Counter's signal by delivering what it said was impossible, and revises the scarcity model's parameters — how bad, how likely, how soon — by one data point.",
  'Sourcing must be external.',
  "Counter's threat output is oriented precisely toward what the growth direction delivers, so approaching it deliberately activates the defense; performing the growth direction is the fixation operating.",
  'Registration is internal and runs through Gamble, the discrepancy detector.',
];

/**
 * The two stress events, which the app previously ran together. Both use the
 * Hunger/Flood domain pair, so they look alike from outside and are told apart
 * by direction, quality and severity rather than by content.
 */
export const STRESS_EVENTS = [
  {
    id: 'reaching',
    name: 'Hunger Reaching',
    severity: 'moderate stress',
    position: 4,
    detail: 'the inferior function attempts to operate without practiced capacity — exaggerated, unskilled, recognizable as the "inferior grip."',
  },
  {
    id: 'floodPrimary',
    name: 'Flood forced-primary',
    severity: 'extreme stress',
    position: 8,
    detail: 'the background channel becomes the only input; the person does not reach, they are submerged.',
  },
];

export const STRESS_EVENTS_NOTE = 'Same base function, opposing attitudes, distinguishable by direction, quality, and severity.';
