// generatePairs.mjs — Pre-compute all pairwise personality type interaction data.
// Run: node scripts/generatePairs.mjs (from project root)
// Output: frontend/src/data/pairLookup.js

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import data and utils from frontend source (ES module chain works via relative imports inside each file)
const { ENN_TYPES, ENN_ARROWS, ENN_CENTER, ENN_HARMONIC, INSTINCT_COMPAT } =
  await import('../frontend/src/data/enneagram.js');
const { MBTI_TYPES } = await import('../frontend/src/data/mbti.js');
const { COG_FUNCTIONS } = await import('../frontend/src/data/cognitive.js');
const { getEnnInteraction, getEnnTips } = await import('../frontend/src/utils/enneagram.js');
const { getMBTIInteraction, getMBTITips } = await import('../frontend/src/utils/mbti.js');

// --- Instinct stack interaction (same logic as utils/enneagram.js getInstinctStackInteraction) ---
function getInstinctStackInteraction(stackA, stackB) {
  if (!stackA?.length || !stackB?.length) return null;
  const domA = stackA[0], domB = stackB[0];
  const repA = stackA[2], repB = stackB[2];
  const notes = [];

  const domKey = [domA, domB].sort().join('-');
  const domPair = INSTINCT_COMPAT[domKey];
  if (domPair) {
    notes.push({ label: `Dominant: ${domA.toUpperCase()} × ${domB.toUpperCase()}`, bond: domPair.bond, tension: domPair.tension, tier: 'dominant' });
  }

  const sameOrder = stackA.join('/') === stackB.join('/');
  const reversed = stackA.join('/') === [...stackB].reverse().join('/');
  if (sameOrder) {
    notes.push({ label: 'Identical Stack Order', note: 'Both share the exact same instinctual priority sequence — maximum resonance in motivational rhythm and blind spots.', tier: 'alignment' });
  } else if (reversed) {
    notes.push({ label: 'Mirror-Reversed Stack', note: `${stackA.map(i => i.toUpperCase()).join('/')} vs ${stackB.map(i => i.toUpperCase()).join('/')} — each person's dominant is the other's repressed. Maximum complementarity and maximum potential friction.`, tier: 'alignment' });
  }

  if (domA !== domB) {
    const secA = stackA[1], secB = stackB[1];
    if (secA === secB) {
      notes.push({ label: `Shared Secondary: ${secA.toUpperCase()}`, note: `Both share ${secA.toUpperCase()} as their secondary drive — a quiet common ground beneath differing dominant motivations.`, tier: 'secondary' });
    } else if (secA === domB) {
      notes.push({ label: `A's Secondary Matches B's Dominant`, note: `Person A's secondary ${secA.toUpperCase()} resonates with Person B's primary motivation — A can naturally attune to how B leads.`, tier: 'secondary' });
    } else if (secB === domA) {
      notes.push({ label: `B's Secondary Matches A's Dominant`, note: `Person B's secondary ${secB.toUpperCase()} resonates with Person A's primary motivation — B can naturally attune to how A leads.`, tier: 'secondary' });
    }
  }

  if (repA && repB && repA === repB) {
    const repLabels = { sp: 'Self-Preservation', sx: 'Sexual/One-to-One', so: 'Social' };
    notes.push({ label: `Shared Blind Spot: ${repA.toUpperCase()}`, note: `Both have ${repLabels[repA]} as their repressed instinct — neither naturally prioritises this domain. They may mutually neglect ${repA === 'sp' ? 'physical security and resource management' : repA === 'sx' ? 'one-on-one depth and intensity' : 'social context and group dynamics'}.`, tier: 'repressed' });
  }

  return notes;
}

// --- Enneagram pairs ---
const ENN_DYNAMICS = {};
const ENN_TIPS = {};
const ennTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let i = 0; i < ennTypes.length; i++) {
  for (let j = i; j < ennTypes.length; j++) {
    const c1 = ennTypes[i], c2 = ennTypes[j];
    const key = `${c1}-${c2}`;
    ENN_DYNAMICS[key] = getEnnInteraction(c1, c2);
    ENN_TIPS[key] = getEnnTips(c1, c2);
  }
}

// --- MBTI pairs ---
const MBTI_INSIGHTS = {};
const MBTI_TIPS_MAP = {};
const mbtiTypes = Object.keys(MBTI_TYPES);
for (let i = 0; i < mbtiTypes.length; i++) {
  for (let j = i; j < mbtiTypes.length; j++) {
    const t1 = mbtiTypes[i], t2 = mbtiTypes[j];
    const key = [t1, t2].sort().join('-');
    const res = getMBTIInteraction(t1, t2);
    if (res) {
      MBTI_INSIGHTS[key] = res.insights;
      MBTI_TIPS_MAP[key] = getMBTITips(t1, t2);
    }
  }
}

// --- Instinct stack pairs ---
const INSTINCT_STACKS = [
  ['sp', 'sx', 'so'],
  ['sp', 'so', 'sx'],
  ['sx', 'sp', 'so'],
  ['sx', 'so', 'sp'],
  ['so', 'sp', 'sx'],
  ['so', 'sx', 'sp'],
];

const INSTINCT_STACK_DYNAMICS = {};
for (let i = 0; i < INSTINCT_STACKS.length; i++) {
  for (let j = i; j < INSTINCT_STACKS.length; j++) {
    const sA = INSTINCT_STACKS[i], sB = INSTINCT_STACKS[j];
    const keyParts = [sA.join('/'), sB.join('/')].sort();
    const key = keyParts.join('|');
    if (!INSTINCT_STACK_DYNAMICS[key]) {
      INSTINCT_STACK_DYNAMICS[key] = getInstinctStackInteraction(sA, sB);
    }
  }
}

// --- Write output ---
const out = `// AUTO-GENERATED by scripts/generatePairs.mjs — do not edit manually.
// Re-generate: node scripts/generatePairs.mjs

export const ENN_DYNAMICS = ${JSON.stringify(ENN_DYNAMICS, null, 2)};

export const ENN_TIPS = ${JSON.stringify(ENN_TIPS, null, 2)};

export const MBTI_INSIGHTS = ${JSON.stringify(MBTI_INSIGHTS, null, 2)};

export const MBTI_TIPS = ${JSON.stringify(MBTI_TIPS_MAP, null, 2)};

export const INSTINCT_STACK_DYNAMICS = ${JSON.stringify(INSTINCT_STACK_DYNAMICS, null, 2)};
`;

const outPath = resolve(__dirname, '../frontend/src/data/pairLookup.js');
writeFileSync(outPath, out, 'utf8');
console.log(`Written: ${outPath}`);
console.log(`  ENN pairs: ${Object.keys(ENN_DYNAMICS).length}`);
console.log(`  MBTI pairs: ${Object.keys(MBTI_INSIGHTS).length}`);
console.log(`  Instinct stack pairs: ${Object.keys(INSTINCT_STACK_DYNAMICS).length}`);
