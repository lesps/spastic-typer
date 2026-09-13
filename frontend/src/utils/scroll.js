import { useEffect } from 'react';

export function scrollToTop() {
  try { window.scrollTo(0, 0); } catch {}
}

// Reset scroll whenever any of the given values change (view, tab, selected item…).
export function useScrollToTop(...deps) {
  useEffect(() => { scrollToTop(); }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
