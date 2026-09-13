import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import StackView from '../views/StackView.jsx';

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
  window.scrollTo.mockClear();
});

const typeSelect = () => screen.getByRole('combobox', { name: /mbti type/i });

describe('StackView — shell and type selection', () => {
  it('renders the Stack heading and the type selector defaulting to positions only', () => {
    render(<StackView />);
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
    expect(typeSelect()).toHaveValue('');
    expect(within(typeSelect()).getByRole('option', { name: /positions only/i })).toBeInTheDocument();
    expect(within(typeSelect()).getAllByRole('option')).toHaveLength(17);
  });

  it('defaults to the saved typer_mbti result', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    render(<StackView />);
    expect(typeSelect()).toHaveValue('ENFP');
  });

  it('degrades to positions only on malformed storage without throwing', () => {
    localStorage.setItem('typer_mbti', '{not json');
    localStorage.setItem('typer_enn', '[1,2');
    expect(() => render(<StackView />)).not.toThrow();
    expect(typeSelect()).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
  });

  it('honours a #/stack?type= deep link over the saved result', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    window.location.hash = '#/stack?type=INTJ';
    render(<StackView />);
    expect(typeSelect()).toHaveValue('INTJ');
  });

  it('ignores an invalid deep-link type', () => {
    window.location.hash = '#/stack?type=ZZZZ';
    render(<StackView />);
    expect(typeSelect()).toHaveValue('');
  });

  it('lets the user change type and switch back to positions only', () => {
    render(<StackView />);
    fireEvent.change(typeSelect(), { target: { value: 'ISTJ' } });
    expect(typeSelect()).toHaveValue('ISTJ');
    fireEvent.change(typeSelect(), { target: { value: '' } });
    expect(typeSelect()).toHaveValue('');
  });

  it('scrolls to the top on mount', () => {
    render(<StackView />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

// ---------------------------------------------------------------------------
import { captureState } from '../utils/stack.js';
import { ACTIVE_EDGES, EDGES, EQUILIBRIUM_CAVEAT, LEVEL_NARRATION } from '../data/stack.js';
import { POSITIONS } from '../data/shadow.js';

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const range = () => screen.getByRole('slider', { name: /health level/i });
const setLevel = (l) => fireEvent.change(range(), { target: { value: String(l) } });
const nodes = () => Array.from(document.querySelectorAll('[data-pos]'));
const edges = () => Array.from(document.querySelectorAll('[data-edge]'));
const node = (pos) => document.querySelector(`[data-pos="${pos}"]`);
const edge = (id) => document.querySelector(`[data-edge="${id}"]`);

describe('StackView — diagram structure', () => {
  it('renders all eight positions and all six edges with accessible names', () => {
    render(<StackView />);
    expect(nodes().map(n => Number(n.dataset.pos)).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(edges().map(e => e.dataset.edge).sort()).toEqual(EDGES.map(e => e.id).sort());
    for (const p of POSITIONS) expect(screen.getByRole('button', { name: new RegExp(`Position ${p.pos} · ${p.name}`) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /write-back.*Critic.*Anchor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gate.*Anchor.*Lead/i })).toBeInTheDocument();
  });

  it('labels each node with its capture level so the two numbering systems stay distinct', () => {
    render(<StackView />);
    expect(node(6).getAttribute('aria-label')).toMatch(/Position 6 · Critic · captured at Level 5/);
    expect(node(2).getAttribute('aria-label')).toMatch(/Position 2 · Anchor · captured at Level 6/);
  });

  it('carries the function on every node when a type is selected, and none otherwise', () => {
    render(<StackView />);
    expect(nodes().every(n => !n.hasAttribute('data-fn'))).toBe(true);
    fireEvent.change(typeSelect(), { target: { value: 'ENFP' } });
    expect(node(1).dataset.fn).toBe('Ne');
    expect(node(3).dataset.fn).toBe('Te');
    expect(node(5).dataset.fn).toBe('Ni');
    expect(node(6).dataset.fn).toBe('Fe');
    expect(node(8).dataset.fn).toBe('Se');
  });
});

describe('StackView — scrubber drives capture state', () => {
  it('is a range over levels 1–9 starting at 1', () => {
    render(<StackView />);
    expect(range()).toHaveAttribute('min', '1');
    expect(range()).toHaveAttribute('max', '9');
    expect(range()).toHaveValue('1');
  });

  it('honours a #/stack?level= deep link', () => {
    window.location.hash = '#/stack?type=ENFP&level=5';
    render(<StackView />);
    expect(range()).toHaveValue('5');
    expect(node(6).dataset.justCaptured).toBe('true');
  });

  it.each(LEVELS)('level %i tints the captured set, pulses the just-captured node, and lights the active edges', (l) => {
    render(<StackView />);
    setLevel(l);
    const expected = captureState(l);
    const captured = nodes().filter(n => n.dataset.captured === 'true').map(n => Number(n.dataset.pos)).sort((a, b) => a - b);
    expect(captured).toEqual([...expected.captured].sort((a, b) => a - b));
    const just = nodes().filter(n => n.dataset.justCaptured === 'true').map(n => Number(n.dataset.pos));
    expect(just).toEqual(expected.justCaptured == null ? [] : [expected.justCaptured]);
    const active = edges().filter(e => e.dataset.active === 'true').map(e => e.dataset.edge).sort();
    expect(active).toEqual([...ACTIVE_EDGES[l]].sort());
  });

  it('labels the scrubber with level, stage band, and the captured position with both numbers', () => {
    render(<StackView />);
    setLevel(5);
    const label = screen.getByTestId('stack-level-label').textContent;
    expect(label).toMatch(/Level 5/);
    expect(label).toMatch(/Maintenance/);
    expect(label).toMatch(/Critic/);
    expect(label).toMatch(/Position 6/);
    setLevel(1);
    expect(screen.getByTestId('stack-level-label').textContent).toMatch(/Level 1 · Pre-colonization/);
  });

  it.each(LEVELS)('keeps the equilibrium caveat visible at level %i', (l) => {
    render(<StackView />);
    setLevel(l);
    expect(screen.getByText(EQUILIBRIUM_CAVEAT)).toBeVisible();
  });

  it.each(LEVELS)('narrates level %i', (l) => {
    render(<StackView />);
    setLevel(l);
    const narration = within(screen.getByTestId('stack-narration'));
    expect(narration.getByText(LEVEL_NARRATION[l].text)).toBeInTheDocument();
    expect(narration.getByText(LEVEL_NARRATION[l].title)).toBeInTheDocument();
  });
});

describe('StackView — selection by tap and keyboard', () => {
  it('starts with Lead selected', () => {
    render(<StackView />);
    expect(node(1).dataset.selected).toBe('true');
  });

  it('selects a node on click', () => {
    render(<StackView />);
    fireEvent.click(node(6));
    expect(node(6).dataset.selected).toBe('true');
    expect(node(1).dataset.selected).toBe('false');
  });

  it('selects a node with Enter and an edge with Space', () => {
    render(<StackView />);
    fireEvent.keyDown(node(3), { key: 'Enter' });
    expect(node(3).dataset.selected).toBe('true');
    fireEvent.keyDown(edge('writeback'), { key: ' ' });
    expect(edge('writeback').dataset.selected).toBe('true');
    expect(node(3).dataset.selected).toBe('false');
  });

  it('explains a selected edge with its meaning and endpoints', () => {
    render(<StackView />);
    fireEvent.click(edge('sample'));
    const meaning = EDGES.find(e => e.id === 'sample').meaning;
    const detail = within(screen.getByTestId('stack-edge-detail'));
    expect(detail.getByText(meaning)).toBeInTheDocument();
    expect(detail.getByText(/Refuge → Critic/)).toBeInTheDocument();
  });

  it('every node and edge is focusable', () => {
    render(<StackView />);
    for (const el of [...nodes(), ...edges()]) expect(el).toHaveAttribute('tabindex', '0');
  });
});
