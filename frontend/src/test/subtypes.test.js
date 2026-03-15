/**
 * subtypes.test.js
 * Data integrity tests for subtypes.js — 27 entries (9 types × 3 instincts).
 */
import { describe, it, expect } from 'vitest';
import { SUBTYPES } from '../data/subtypes.js';

const ENN_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INSTINCTS = ['SP', 'SX', 'SO'];
const REQUIRED_FIELDS = ['name', 'description', 'keyTraits', 'blindSpot', 'growthPath'];

describe('SUBTYPES — data integrity', () => {
  it('exports an object', () => {
    expect(typeof SUBTYPES).toBe('object');
    expect(SUBTYPES).not.toBeNull();
  });

  it('has all 27 keys (9 types × 3 instincts)', () => {
    const expected = ENN_TYPES.flatMap(n => INSTINCTS.map(i => `${n}_${i}`));
    for (const key of expected) {
      expect(SUBTYPES, `missing key ${key}`).toHaveProperty(key);
    }
  });

  it('has no extra keys beyond the 27 expected', () => {
    const expected = new Set(ENN_TYPES.flatMap(n => INSTINCTS.map(i => `${n}_${i}`)));
    for (const key of Object.keys(SUBTYPES)) {
      expect(expected.has(key), `unexpected key: ${key}`).toBe(true);
    }
  });

  describe.each(ENN_TYPES.flatMap(n => INSTINCTS.map(i => ({ key: `${n}_${i}`, n, i }))))(
    'entry $key',
    ({ key }) => {
      it('has all required fields', () => {
        const entry = SUBTYPES[key];
        for (const field of REQUIRED_FIELDS) {
          expect(entry, `${key} missing field: ${field}`).toHaveProperty(field);
        }
      });

      it('name is a non-empty string', () => {
        expect(typeof SUBTYPES[key].name).toBe('string');
        expect(SUBTYPES[key].name.trim().length).toBeGreaterThan(0);
      });

      it('description is a non-empty string', () => {
        expect(typeof SUBTYPES[key].description).toBe('string');
        expect(SUBTYPES[key].description.trim().length).toBeGreaterThan(10);
      });

      it('keyTraits is a non-empty array of strings', () => {
        const { keyTraits } = SUBTYPES[key];
        expect(Array.isArray(keyTraits)).toBe(true);
        expect(keyTraits.length).toBeGreaterThan(0);
        for (const trait of keyTraits) {
          expect(typeof trait).toBe('string');
          expect(trait.trim().length).toBeGreaterThan(0);
        }
      });

      it('blindSpot is a non-empty string', () => {
        expect(typeof SUBTYPES[key].blindSpot).toBe('string');
        expect(SUBTYPES[key].blindSpot.trim().length).toBeGreaterThan(0);
      });

      it('growthPath is a non-empty string', () => {
        expect(typeof SUBTYPES[key].growthPath).toBe('string');
        expect(SUBTYPES[key].growthPath.trim().length).toBeGreaterThan(0);
      });
    }
  );
});
