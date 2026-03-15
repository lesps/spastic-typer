/**
 * Lazy-loading index for combination profiles.
 * Each wing variant loads ~250 KB on demand instead of 4.75 MB upfront.
 * 1,728 total profiles: 9 types × 2 wings × 16 MBTI × 6 instinct stacks.
 */

const WING_LOADERS = {
  '1w9': () => import('./1w9.js').then(m => m.PROFILES_1w9),
  '1w2': () => import('./1w2.js').then(m => m.PROFILES_1w2),
  '2w1': () => import('./2w1.js').then(m => m.PROFILES_2w1),
  '2w3': () => import('./2w3.js').then(m => m.PROFILES_2w3),
  '3w2': () => import('./3w2.js').then(m => m.PROFILES_3w2),
  '3w4': () => import('./3w4.js').then(m => m.PROFILES_3w4),
  '4w3': () => import('./4w3.js').then(m => m.PROFILES_4w3),
  '4w5': () => import('./4w5.js').then(m => m.PROFILES_4w5),
  '5w4': () => import('./5w4.js').then(m => m.PROFILES_5w4),
  '5w6': () => import('./5w6.js').then(m => m.PROFILES_5w6),
  '6w5': () => import('./6w5.js').then(m => m.PROFILES_6w5),
  '6w7': () => import('./6w7.js').then(m => m.PROFILES_6w7),
  '7w6': () => import('./7w6.js').then(m => m.PROFILES_7w6),
  '7w8': () => import('./7w8.js').then(m => m.PROFILES_7w8),
  '8w7': () => import('./8w7.js').then(m => m.PROFILES_8w7),
  '8w9': () => import('./8w9.js').then(m => m.PROFILES_8w9),
  '9w8': () => import('./9w8.js').then(m => m.PROFILES_9w8),
  '9w1': () => import('./9w1.js').then(m => m.PROFILES_9w1),
};

const cache = {};

/**
 * Load a combination profile asynchronously.
 * @param {number|string} ennType - Enneagram type (1-9)
 * @param {number|string} wing - Wing number
 * @param {string} mbtiType - MBTI type (e.g. 'INFP')
 * @param {string} instStack - Instinct stack (e.g. 'SX/SP/SO')
 * @returns {Promise<object|null>} Profile object or null if not found
 */
export async function getCombinationProfile(ennType, wing, mbtiType, instStack) {
  const wingKey = `${ennType}w${wing}`;
  const profileKey = `${wingKey}_${mbtiType}_${(instStack || '').replace(/\//g, '')}`;

  if (!WING_LOADERS[wingKey]) return null;

  if (!cache[wingKey]) {
    cache[wingKey] = await WING_LOADERS[wingKey]();
  }

  return cache[wingKey][profileKey] || null;
}

/**
 * Build the lookup key for a combination profile.
 * Useful for generating keys without loading the data.
 */
export function combinationKey(ennType, wing, mbtiType, instStack) {
  return `${ennType}w${wing}_${mbtiType}_${(instStack || '').replace(/\//g, '')}`;
}

/**
 * List all available wing keys.
 */
export const AVAILABLE_WINGS = Object.keys(WING_LOADERS);
