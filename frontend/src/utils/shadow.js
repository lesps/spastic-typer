/**
 * shadow.js — Utility functions for the 8-position cognitive function model.
 */

import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { POSITIONS, CROSSING_MATRIX, SHADOW_TEMPLATES, FULL_SHADOW_PAIR_NARRATIVE } from '../data/shadow.js';

const FLIP = { e: 'i', i: 'e' };

/**
 * Flip a function's attitude: Ne→Ni, Fi→Fe, etc.
 */
export function flipAttitude(fn) {
  return fn[0] + FLIP[fn[1]];
}

/**
 * Returns shadow stack (positions 5–8) for a given MBTI type.
 * Derived by flipping each ego function's attitude.
 */
export function getShadowStack(mbtiType) {
  const stack = MBTI_TYPES[mbtiType]?.stack;
  if (!stack) return null;
  return stack.map(flipAttitude);
}

/**
 * Returns the full 8-function stack with position metadata.
 * Each entry: { fn, pos, name, arc }
 */
export function getFullStack(mbtiType) {
  const ego = MBTI_TYPES[mbtiType]?.stack;
  if (!ego) return null;
  const shadow = ego.map(flipAttitude);
  return [...ego, ...shadow].map((fn, i) => ({
    fn,
    pos: i + 1,
    name: POSITIONS[i].name,
    arc: POSITIONS[i].arc,
  }));
}

/**
 * Returns the shadow type (E↔I inversion only).
 * ENFP → INFP, INFJ → ENFJ, etc.
 */
export function getShadowType(mbtiType) {
  if (!mbtiType || !MBTI_TYPES[mbtiType]) return null;
  const first = mbtiType[0] === 'E' ? 'I' : 'E';
  const candidate = first + mbtiType.slice(1);
  return MBTI_TYPES[candidate] ? candidate : null;
}

/**
 * Returns the type whose ego stack IS this type's shadow stack.
 * ENFP → INFJ (because INFJ's ego [Ni,Fe,Ti,Se] = ENFP's shadow).
 */
export function getShadowMirror(mbtiType) {
  const shadow = getShadowStack(mbtiType);
  if (!shadow) return null;
  return Object.keys(MBTI_TYPES).find(
    code => MBTI_TYPES[code].stack.every((fn, i) => fn === shadow[i])
  ) || null;
}

/**
 * Instantiate a shadow position description template for a specific function.
 */
export function instantiateTemplate(positionNum, fn) {
  const tmpl = SHADOW_TEMPLATES[positionNum];
  if (!tmpl) return '';
  const fnName = COG_FUNCTIONS[fn]?.name || fn;
  return tmpl.replace(/\{fn\}/g, fn).replace(/\{fnName\}/g, fnName);
}

/**
 * Compute all meaningful position crossings between two MBTI types.
 * Returns { crossings, isFullShadowPair, shadowPairNarrative } or null for invalid types.
 *
 * Each crossing: { posA, posB, nameA, nameB, fnA, fnB, tier, label, description }
 * Sorted by tier (highest first).
 */
export function getPositionCrossings(typeA, typeB) {
  const fullA = getFullStack(typeA);
  const fullB = getFullStack(typeB);
  if (!fullA || !fullB) return null;

  const isFullShadowPair = getShadowMirror(typeA) === typeB;

  const crossings = [];
  const tierOrder = { highest: 0, high: 1, medium: 2 };

  for (const a of fullA) {
    for (const b of fullB) {
      if (a.fn !== b.fn) continue;

      // Build canonical key (lower position first)
      const [lowerPos, higherPos] = a.pos <= b.pos ? [a.pos, b.pos] : [b.pos, a.pos];
      const key = `${lowerPos}-${higherPos}`;
      const matrix = CROSSING_MATRIX[key];
      if (!matrix) continue;

      // Template's {typeA} = the type whose function is at the LOWER position number.
      // When a (typeA's entry) is at the higher position, swap so descriptions are correct.
      const lowerIsFromA = a.pos <= b.pos;
      const templateTypeA = lowerIsFromA ? typeA : typeB;
      const templateTypeB = lowerIsFromA ? typeB : typeA;

      const description = matrix.template
        .replace(/\{fnA\}/g, a.fn)
        .replace(/\{fnB\}/g, b.fn)
        .replace(/\{typeA\}/g, templateTypeA)
        .replace(/\{typeB\}/g, templateTypeB)
        .replace(/\{fnName\}/g, COG_FUNCTIONS[a.fn]?.name || a.fn);

      crossings.push({
        posA: a.pos,
        posB: b.pos,
        nameA: a.name,
        nameB: b.name,
        fnA: a.fn,
        fnB: b.fn,
        typeForA: templateTypeA,  // MBTI code at template's {typeA} slot (lower position)
        typeForB: templateTypeB,  // MBTI code at template's {typeB} slot (higher position)
        tier: matrix.tier,
        label: matrix.label,
        description,
      });
    }
  }

  crossings.sort((a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99));

  return {
    crossings,
    isFullShadowPair,
    shadowPairNarrative: isFullShadowPair ? FULL_SHADOW_PAIR_NARRATIVE : null,
  };
}
