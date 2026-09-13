/**
 * stack.js — Content for the Stack view: how colonization progresses through the
 * eight positions, and what each position does natively versus in the fixation's
 * service. Prose is transcribed from docs/specs/stack-view.md §4–§5; do not
 * paraphrase it or add claims. Strings only — logic lives in utils/stack.js.
 *
 * One mechanism only: Critic samples Refuge → writes back to Anchor → Anchor's
 * standard drifts → Anchor's gate rejects Lead's native output in fixation-hot
 * contexts. Levels are Riso-Hudson levels (1–9); positions are stack positions
 * (1–8). They are different numbering systems and any label that shows both must
 * say which is which (see LABEL_TEMPLATES.positionLevel).
 */

export const STAGE_BANDS = ['Pre-colonization', 'Boundary', 'Maintenance', 'Reality-testing', 'Terminal'];

// Level → position captured at that level (null at level 1) and the stage band. §5.1
export const CAPTURE_ORDER = {
  1: { pos: null, band: 'Pre-colonization' },
  2: { pos: 4,    band: 'Boundary' },
  3: { pos: 5,    band: 'Boundary' },
  4: { pos: 3,    band: 'Maintenance' },
  5: { pos: 6,    band: 'Maintenance' },
  6: { pos: 2,    band: 'Reality-testing' },
  7: { pos: 7,    band: 'Reality-testing' },
  8: { pos: 1,    band: 'Terminal' },
  9: { pos: 8,    band: 'Terminal' },
};

// Augusta classification by position. §5.1
export const CLASSIFICATION = {
  1: 'Strong + Valued',   2: 'Strong + Valued',
  3: 'Weak + Valued',     4: 'Weak + Valued',
  5: 'Strong + Unvalued', 6: 'Strong + Unvalued',
  7: 'Weak + Unvalued',   8: 'Weak + Unvalued',
};

// Purpose transformation — the payload. §5.2
export const PURPOSES = {
  1: {
    native: 'Primary perception. Fluent, generative, effortless when ungated — the mode you orient through before you choose to.',
    captured: 'Perception itself is pre-filtered. Disconfirming information isn\'t argued with; it isn\'t registered. Before capture, under a corrupted Anchor, Lead is gated rather than captured: its native output fails validation in fixation-hot contexts and runs only where the gate relaxes.',
  },
  2: {
    native: 'The evaluative standard, and the validation gate Lead\'s output passes through. A competing close condition — something that can declare a thing done, good enough, or not worth pursuing.',
    captured: 'Still stabilizing, but stabilizing one thing obsessively, in the fixation\'s service. The self treats the drifted standard as sovereign because Valued means it feels like its own. The tell is asymmetry: healthy Anchor stabilizes across domains.',
  },
  3: {
    native: 'Decompression. The least curated output you produce, which is exactly what makes it the highest-quality calibration data available to Critic.',
    captured: 'Downtime turns fixation-shaped — taste and preference in unstructured time move first. This is the pivot: the calibration source is now corrupted, so write-back starts running on bad data.',
  },
  4: {
    native: 'The constitutive gap. The longing, structurally unfillable, most exposed.',
    captured: 'Not captured but identified-with: the fixation installs here as the most available answer to the gap. The longing stays intact; the fixation misdirects what it reaches toward.',
  },
  5: {
    native: 'Strong but unvalued proficiency. Fires when motivated striving is blocked, completes, and recedes.',
    captured: 'Defends the fixation\'s striving rather than the person\'s, and has no off state when it runs as identity — thought feels like it\'s always answering something, even alone.',
  },
  6: {
    native: 'The auditor, and Anchor\'s update mechanism. Precise background evaluation against a standard that isn\'t fixation-shaped.',
    captured: 'Target selection becomes fixation-shaped while the evaluations stay accurate. Unvalued means the redirect goes unnoticed. Write-back now writes fixation-shaped updates into Anchor.',
  },
  7: {
    native: 'The emergency brake. Episodic reality-check against Anchor\'s standard, dismissed even when it\'s right.',
    captured: 'The check now tests against the corrupted standard. The system becomes unfalsifiable from inside — no remaining internal mechanism can catch the fixation.',
  },
  8: {
    native: 'Involuntary override. Quiet under ordinary conditions; its triggers arrive filtered through Lead.',
    captured: 'Erupts in the fixation\'s service rather than the organism\'s. Adds eruption to a system that\'s already closed.',
  },
};

// Level narration. §5.3
export const LEVEL_NARRATION = {
  1: { title: '1',           text: 'Free operation. Every position does its own job; nothing runs in the fixation\'s service.' },
  2: { title: '2 · Hunger',  text: 'The fixation installs at the gap. This is identification, not capture: the longing is intact, but what it reaches toward is now the fixation\'s answer.' },
  3: { title: '3 · Counter', text: 'Counter begins defending the fixation\'s striving rather than the person\'s. It still fires only under threat; what counts as threat has been redefined.' },
  4: { title: '4 · Refuge',  text: 'Unstructured time turns fixation-shaped. This is the pivot: Refuge is Critic\'s calibration source, so from here the data feeding the loop is corrupted. The fixation is visible in leisure long before it\'s visible in deliberate behavior — the most reliable early read.' },
  5: { title: '5 · Critic',  text: 'Critic samples corrupted Refuge output and writes fixation-shaped updates into Anchor\'s standard. The conscience doesn\'t change sides by choice; it changes sides by doing its job correctly against bad data.' },
  6: { title: '6 · Anchor',  text: 'The standard has drifted far enough that Anchor\'s gate starts rejecting Lead\'s native output in fixation-hot contexts. The self trusts the drifted standard because it feels like its own.' },
  7: { title: '7 · Gamble',  text: 'The last reality-check now tests against the corrupted standard. Nothing internal can falsify the fixation anymore.' },
  8: { title: '8 · Lead',    text: 'Terminal onset, and structurally forced: with all three checking layers captured, nothing stands between the fixation and Lead. Perception is pre-filtered.' },
  9: { title: '9 · Flood',   text: 'Eruption added to a system that\'s already closed. Intense but episodic; level 8 is quieter and more total.' },
};

// Equilibrium caveat — persistently visible beside the scrubber. §5.4
export const EQUILIBRIUM_CAVEAT = 'The sequence is a gradient, not a schedule. Most stacks settle at an equilibrium depth rather than running to level 9. Where the fixation finds the Lead function useful, colonization extends deeper and the person presents as integrated with their fixation. Where it doesn\'t, it commonly stabilizes around Maintenance — further capture buys the fixation nothing — and the person presents as compressed, with Counter carrying the high-stakes load. Depth is set by that utility and by substrate pressure, not by elapsed time.';

// Counter threat-output forms, keyed by function. §5.5
export const COUNTER_THREAT_OUTPUT = {
  Ni: 'convergent trajectory certainty',
  Ne: 'proliferating threat scenarios',
  Fi: 'worth and authenticity verdict',
  Fe: 'relational damage assessment',
  Ti: 'logical necessity construction',
  Te: 'outcome-failure ledger',
  Si: 'precedent-based inevitability',
  Se: 'immediate-environment threat read',
};

// Structural couplings between positions. `from`/`to` are position numbers. §4
// `weight: 'spine'` marks the load-bearing pair (Refuge → Critic → Anchor).
export const EDGES = [
  { id: 'gate',      from: 2, to: 1, label: 'gate',       weight: 'normal', meaning: 'Anchor\'s standard validates Lead\'s output for execution' },
  { id: 'writeback', from: 6, to: 2, label: 'write-back', weight: 'spine',  meaning: 'Critic continuously updates Anchor\'s evaluative standard' },
  { id: 'sample',    from: 3, to: 6, label: 'sample',     weight: 'spine',  meaning: 'Refuge\'s unguarded output is Critic\'s primary calibration data' },
  { id: 'monitor',   from: 4, to: 5, label: 'monitor',    weight: 'normal', meaning: 'Counter watches Hunger\'s striving and fires when it\'s blocked' },
  { id: 'check',     from: 2, to: 7, label: 'check',      weight: 'normal', meaning: 'Gamble tests against Anchor\'s standard' },
  { id: 'trigger',   from: 1, to: 8, label: 'trigger',    weight: 'normal', meaning: 'Flood\'s triggers arrive pre-filtered through Lead' },
];

// Edges that light up at each level as the scrubber moves. §6
export const ACTIVE_EDGES = {
  1: [], 2: [], 3: ['monitor'], 4: [],
  5: ['sample', 'writeback'], 6: ['writeback', 'gate'],
  7: ['check'], 8: ['gate'], 9: ['trigger'],
};

// UI label templates. Placeholders: {fn} {fnName} {pos} {name} {level} {type}.
// These are chrome, not framework prose — they name things, they make no claims.
export const LABEL_TEMPLATES = {
  positionOnly:  'Position {pos} · {name}',
  positionLevel: 'Position {pos} · {name} · captured at Level {level}',
  fnAtPosition:  '{fnName} ({fn}) at {name}',
  hungerBadge:   'Type {type} installs here',
  capturedAt:    'Captured at Level {level}',
  bridgeNote:    'Riso-Hudson tier language for Type {type}, offered as an interpretive bridge — the two scales are not equivalent.',
};
