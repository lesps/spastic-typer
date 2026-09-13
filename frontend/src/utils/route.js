// URL-hash routing. The hash is the single source of truth for which top-level
// view is showing: `#/compare?p1=…&p2=…`. Legacy share links (`#p1=…&p2=…`,
// written before the view lived in the hash) still resolve to Compare.

export const VIEWS = ['typer', 'explorer', 'compare'];
// Views that used to exist; old links keep working.
const LEGACY_VIEWS = { model: 'explorer' };
export const DEFAULT_VIEW = 'typer';

export function parseHash(hash) {
  const raw = (hash || '').replace(/^#\/?/, '');
  if (!raw) return { view: DEFAULT_VIEW, query: '' };
  const qIdx = raw.indexOf('?');
  const head = qIdx === -1 ? raw : raw.slice(0, qIdx);
  const query = qIdx === -1 ? '' : raw.slice(qIdx + 1);
  if (VIEWS.includes(head)) return { view: head, query };
  if (LEGACY_VIEWS[head]) return { view: LEGACY_VIEWS[head], query: '' };
  if (/^p\d+=/.test(raw)) return { view: 'compare', query: raw };
  return { view: DEFAULT_VIEW, query: '' };
}

export function buildHash(view, query = '') {
  return `#/${view}${query ? `?${query}` : ''}`;
}
