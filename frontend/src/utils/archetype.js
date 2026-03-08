// Archetype naming — combines all three personality systems into a single descriptive title.
// Each combination of Enneagram core type, MBTI, and dominant instinct gets a unique 3-word name.

const ENN_QUALITY = {
  1: 'Principled',
  2: 'Nurturing',
  3: 'Ambitious',
  4: 'Introspective',
  5: 'Contemplative',
  6: 'Vigilant',
  7: 'Adventurous',
  8: 'Commanding',
  9: 'Harmonizing',
};

const MBTI_LENS = {
  INTJ: 'Strategic',
  INTP: 'Analytical',
  ENTJ: 'Executive',
  ENTP: 'Inventive',
  INFJ: 'Prophetic',
  INFP: 'Lyrical',
  ENFJ: 'Diplomatic',
  ENFP: 'Spirited',
  ISTJ: 'Methodical',
  ISFJ: 'Devoted',
  ESTJ: 'Structural',
  ESFJ: 'Sociable',
  ISTP: 'Technical',
  ISFP: 'Aesthetic',
  ESTP: 'Bold',
  ESFP: 'Vivacious',
};

const INST_ROLE = {
  sp: 'Guardian',
  sx: 'Seeker',
  so: 'Advocate',
};

// Returns a unique archetype name, e.g. "Spirited Nurturing Advocate"
// Returns null if any component is missing.
export function computeArchetypeName(coreType, mbtiType, dominantInstinct) {
  if (!coreType || !mbtiType || !dominantInstinct) return null;
  const quality = ENN_QUALITY[coreType];
  const lens = MBTI_LENS[mbtiType];
  const role = INST_ROLE[dominantInstinct];
  if (!quality || !lens || !role) return null;
  return `${lens} ${quality} ${role}`;
}
