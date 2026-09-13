import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { G, alpha, hexToRgb } from '../styles/theme.js';

describe('theme helpers', () => {
  it('hexToRgb parses a 6-digit hex', () => {
    expect(hexToRgb('#50c878')).toEqual([80, 200, 120]);
    expect(hexToRgb('e85050')).toEqual([232, 80, 80]);
  });

  it('alpha builds an rgba string from a token', () => {
    expect(alpha(G.success, 0.2)).toBe('rgba(80,200,120,0.2)');
    expect(alpha('#000000', 0.8)).toBe('rgba(0,0,0,0.8)');
  });

  it('exposes semantic tokens', () => {
    for (const k of ['success', 'warn', 'danger', 'info', 'overlay']) expect(G[k], k).toBeTruthy();
  });
});

// The project rule is "always use G.* / FC.* tokens, never hardcode hex values".
// This test enforces it for every view and component source file.
describe('no hardcoded colors in views and components', () => {
  const dirs = ['views', 'components'].map(d => join(__dirname, '..', d));
  const files = dirs.flatMap(d => readdirSync(d).filter(f => f.endsWith('.jsx')).map(f => join(d, f)));
  const HEX = /#[0-9a-fA-F]{6}\b/;
  const RGBA = /rgba?\(\s*\d/;

  it.each(files.map(f => [f.split('/src/')[1], f]))('%s has no hex or rgba literals', (_name, file) => {
    const src = readFileSync(file, 'utf8');
    const offenders = src.split('\n')
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => HEX.test(line) || RGBA.test(line))
      .map(({ line, n }) => `${n}: ${line.trim().slice(0, 100)}`);
    expect(offenders).toEqual([]);
  });
});
