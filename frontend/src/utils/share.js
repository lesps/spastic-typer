/**
 * share.js — Profile code encode/decode utilities
 *
 * Code format: {type}{wing}{strength}{s1}{s2}{s3}-{MBTI}
 * Total: 11 characters
 * Example: 453xpo-INFP
 *
 * Segments:
 *   type     — Enneagram core type (1–9)
 *   wing     — Wing type (1–9)
 *   strength — Wing strength digit: 0=null, 1=balanced, 2=moderate, 3=strong
 *   s1s2s3   — Instinct stack order using p=sp, x=sx, o=so (dominant→repressed)
 *   MBTI     — Four-letter MBTI type (e.g. INFP)
 */

const INSTINCT_CHARS = { sp: 'p', sx: 'x', so: 'o' };
const CHAR_INSTINCT = { p: 'sp', x: 'sx', o: 'so' };

const VALID_MBTI = new Set([
  'INTJ', 'INTP', 'INFJ', 'INFP',
  'ISTJ', 'ISTP', 'ISFJ', 'ISFP',
  'ENTJ', 'ENTP', 'ENFJ', 'ENFP',
  'ESTJ', 'ESTP', 'ESFJ', 'ESFP',
]);

/** Convert a wingStrengthDelta value to a single digit character. */
function toStrengthDigit(delta) {
  if (delta === null || delta === undefined) return '0';
  const lbl = typeof delta === 'string'
    ? delta
    : delta > 4 ? 'strong' : delta > 1 ? 'moderate' : 'balanced';
  if (lbl === 'strong') return '3';
  if (lbl === 'moderate') return '2';
  return '1'; // balanced
}

/**
 * Convert a strength digit back to a wingStrengthDelta number that
 * wingStrengthLabel() in utils/enneagram.js will interpret correctly:
 *   > 4  → 'strong'
 *   > 1  → 'moderate'
 *   else → 'balanced'
 */
function fromStrengthDigit(digit) {
  if (digit === '0') return null;
  if (digit === '3') return 5;  // 5 > 4 → 'strong'
  if (digit === '2') return 3;  // 3 > 1 → 'moderate'
  return 1;                     // 1 ≤ 1 → 'balanced'
}

/**
 * Encode a complete profile into an 11-character share code.
 * Returns null if any required data is missing or malformed.
 */
export function encodeProfileCode(enn, mbti, inst) {
  if (!enn || !mbti || !inst) return null;
  const { coreType, wing, wingStrengthDelta } = enn;
  const instinctStack = inst.instinctStack || enn.instinctStack;
  if (!coreType || !wing || !instinctStack || instinctStack.length < 3 || !mbti.result) return null;

  const stackChars = instinctStack.map(i => INSTINCT_CHARS[i]);
  if (stackChars.some(c => !c) || stackChars.length !== 3) return null;

  return `${coreType}${wing}${toStrengthDigit(wingStrengthDelta)}${stackChars.join('')}-${mbti.result}`;
}

/**
 * Decode an 11-character share code into minimal profile objects.
 * Returns null if the code is invalid.
 *
 * Decoded objects match the localStorage schema but have null scores
 * (raw quiz data is not encoded in the code).
 */
export function decodeProfileCode(code) {
  if (!code || typeof code !== 'string') return null;
  const raw = code.trim();

  // Expected length: 11 (e.g. "453xpo-INFP")
  if (raw.length !== 11) return null;

  const dashIdx = raw.indexOf('-');
  if (dashIdx !== 6) return null;

  const left = raw.slice(0, 6);
  const right = raw.slice(7).toUpperCase();
  if (right.length !== 4) return null;

  const typeChar = left[0];
  const wingChar = left[1];
  const strengthChar = left[2];
  const stackChars = [left[3], left[4], left[5]].map(c => c.toLowerCase());

  const coreType = parseInt(typeChar, 10);
  const wing = parseInt(wingChar, 10);

  if (isNaN(coreType) || coreType < 1 || coreType > 9) return null;
  if (isNaN(wing) || wing < 1 || wing > 9) return null;
  if (!['0', '1', '2', '3'].includes(strengthChar)) return null;

  const instinctStack = stackChars.map(c => CHAR_INSTINCT[c]);
  if (instinctStack.some(i => !i)) return null;
  if (new Set(instinctStack).size !== 3) return null; // must use all three distinct instincts

  if (!VALID_MBTI.has(right)) return null;

  const enn = {
    coreType,
    wing,
    wingStrengthDelta: fromStrengthDigit(strengthChar),
    instinctStack,
    display: `${coreType}w${wing}`,
    scores: null,
  };
  const mbti = { result: right, scores: null };
  const inst = { instinctStack, instScores: null };

  return { enn, mbti, inst };
}
