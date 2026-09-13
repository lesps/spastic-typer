import { describe, it, expect } from 'vitest';
import { parseHash, buildHash, VIEWS, DEFAULT_VIEW } from '../utils/route.js';

describe('parseHash', () => {
  it('defaults to the typer view for an empty hash', () => {
    expect(parseHash('')).toEqual({ view: DEFAULT_VIEW, query: '' });
    expect(parseHash('#')).toEqual({ view: DEFAULT_VIEW, query: '' });
    expect(parseHash(undefined)).toEqual({ view: DEFAULT_VIEW, query: '' });
  });

  it('parses every known view with or without a leading slash', () => {
    for (const v of VIEWS) {
      expect(parseHash(`#/${v}`)).toEqual({ view: v, query: '' });
      expect(parseHash(`#${v}`)).toEqual({ view: v, query: '' });
    }
  });

  it('splits a query string off the view', () => {
    expect(parseHash('#/compare?p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3A%3A%3AENTJ'))
      .toEqual({ view: 'compare', query: 'p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3A%3A%3AENTJ' });
  });

  it('routes legacy #p1=…&p2=… share links to compare', () => {
    expect(parseHash('#p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3A%3A%3AENTJ'))
      .toEqual({ view: 'compare', query: 'p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3A%3A%3AENTJ' });
  });

  it('resolves the retired #/model view to explorer', () => {
    expect(parseHash('#/model')).toEqual({ view: 'explorer', query: '' });
    expect(parseHash('#model')).toEqual({ view: 'explorer', query: '' });
  });

  it('knows the stack view and keeps its query', () => {
    expect(VIEWS).toContain('stack');
    expect(parseHash('#/stack')).toEqual({ view: 'stack', query: '' });
    expect(parseHash('#/stack?type=ENFP&level=5')).toEqual({ view: 'stack', query: 'type=ENFP&level=5' });
  });

  it('falls back to typer for unknown views', () => {
    expect(parseHash('#/nope')).toEqual({ view: DEFAULT_VIEW, query: '' });
    expect(parseHash('#/nope?x=1')).toEqual({ view: DEFAULT_VIEW, query: '' });
  });
});

describe('buildHash', () => {
  it('builds a view-only hash', () => {
    expect(buildHash('explorer')).toBe('#/explorer');
  });
  it('appends a query when given', () => {
    expect(buildHash('compare', 'p1=a&p2=b')).toBe('#/compare?p1=a&p2=b');
    expect(buildHash('compare', '')).toBe('#/compare');
  });
  it('builds a stack deep link', () => {
    expect(buildHash('stack', 'type=ENFP')).toBe('#/stack?type=ENFP');
  });
  it('round-trips through parseHash', () => {
    expect(parseHash(buildHash('compare', 'p1=a'))).toEqual({ view: 'compare', query: 'p1=a' });
  });
});
