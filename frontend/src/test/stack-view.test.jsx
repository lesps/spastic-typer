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
    const atOne = screen.getByTestId('stack-level-label').textContent;
    expect(atOne).toMatch(/Level 1 · Liberation/);
    expect(atOne).toMatch(/no position captured/);
  });

  it('names the capture kind and the predicted transition sharpness', () => {
    render(<StackView />);
    setLevel(3);
    expect(screen.getByTestId('stack-capture-kind')).toHaveTextContent('immediate capture · sharp transition');
    setLevel(5);
    expect(screen.getByTestId('stack-capture-kind')).toHaveTextContent('accumulation capture · slow transition');
    setLevel(1);
    expect(screen.queryByTestId('stack-capture-kind')).toBeNull();
  });

  it.each(LEVELS)('keeps the equilibrium caveat visible at level %i', (l) => {
    render(<StackView />);
    setLevel(l);
    expect(screen.getByTestId('stack-caveat')).toHaveTextContent(EQUILIBRIUM_CAVEAT.join(' '));
  });

  it.each(LEVELS)('narrates level %i', (l) => {
    render(<StackView />);
    setLevel(l);
    const narration = within(screen.getByTestId('stack-narration'));
    expect(screen.getByTestId('stack-narration')).toHaveTextContent(LEVEL_NARRATION[l].text.join(' '));
    expect(narration.getByText(LEVEL_NARRATION[l].title)).toBeInTheDocument();
  });

  it.each(LEVELS)('offers the rest of the level %i paragraph behind an expander', (l) => {
    render(<StackView />);
    setLevel(l);
    expect(screen.getByTestId('stack-narration-more')).toHaveTextContent(LEVEL_NARRATION[l].more.join(' '));
  });

  it('shows the falsifier where the source states one and omits it where it does not', () => {
    render(<StackView />);
    for (const l of [3, 7, 9]) {
      setLevel(l);
      expect(screen.getByTestId('stack-falsifier')).toHaveTextContent(LEVEL_NARRATION[l].falsifier);
    }
    for (const l of [1, 2, 4, 5, 6, 8]) {
      setLevel(l);
      expect(screen.queryByTestId('stack-falsifier')).toBeNull();
    }
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

// ---------------------------------------------------------------------------
import { PURPOSES, COUNTER_THREAT_OUTPUT } from '../data/stack.js';
import { captureLevelOf } from '../utils/stack.js';
import { LEVELS as HEALTH_LEVELS } from '../data/levels.js';

const panel = () => within(screen.getByTestId('stack-purpose'));
const capturedBlock = () => screen.getByTestId('stack-purpose-captured');

describe('StackView — purpose panel', () => {
  it('shows native and captured purposes for the selected position, Lead by default', () => {
    render(<StackView />);
    expect(screen.getByTestId('stack-purpose-native')).toHaveTextContent(PURPOSES[1].native.join(' '));
    expect(screen.getByTestId('stack-purpose-captured')).toHaveTextContent(PURPOSES[1].captured.join(' '));
  });

  it.each(LEVELS)('at level %i the captured block for Critic (captured at Level 5) is inert below 5 and active from 5', (l) => {
    render(<StackView />);
    fireEvent.click(node(6));
    setLevel(l);
    expect(capturedBlock().dataset.state).toBe(l >= captureLevelOf(6) ? 'active' : 'inert');
    // both states stay in the DOM whatever the level — the comparison is the lesson
    expect(screen.getByTestId('stack-purpose-native')).toHaveTextContent(PURPOSES[6].native.join(' '));
    expect(screen.getByTestId('stack-purpose-captured')).toHaveTextContent(PURPOSES[6].captured.join(' '));
  });

  it.each(LEVELS)('at level %i the captured block for Lead (captured at Level 8) follows its own capture level', (l) => {
    render(<StackView />);
    setLevel(l);
    expect(capturedBlock().dataset.state).toBe(l >= 8 ? 'active' : 'inert');
  });

  it('labels the panel with both numbering systems', () => {
    render(<StackView />);
    fireEvent.click(node(6));
    expect(panel().getByText(/Position 6 · Critic · captured at Level 5/)).toBeInTheDocument();
    expect(capturedBlock()).toHaveTextContent(/Captured at Level 5/);
  });

  it('names the actual function at the position when a type is selected', () => {
    render(<StackView />);
    fireEvent.change(typeSelect(), { target: { value: 'ENFP' } });
    fireEvent.click(node(3));
    expect(panel().getByText(/Extraverted Thinking \(Te\) at Refuge/)).toBeInTheDocument();
    fireEvent.click(node(5));
    expect(panel().getByText(/Introverted Intuition \(Ni\) at Counter/)).toBeInTheDocument();
  });

  it('names only the position when no type is selected', () => {
    render(<StackView />);
    fireEvent.click(node(3));
    expect(panel().queryByText(/\((Ne|Ni|Se|Si|Te|Ti|Fe|Fi)\) at/)).toBeNull();
    expect(panel().getByText(/Position 3 · Refuge/)).toBeInTheDocument();
  });

  it('shows the Counter threat-output form for the selected type', () => {
    render(<StackView />);
    expect(screen.queryByTestId('stack-counter-form')).toBeNull();
    fireEvent.change(typeSelect(), { target: { value: 'ENFP' } });
    const form = screen.getByTestId('stack-counter-form');
    expect(form).toHaveTextContent('Ni');
    expect(form).toHaveTextContent(COUNTER_THREAT_OUTPUT.Ni.texture);
    expect(form).toHaveTextContent(COUNTER_THREAT_OUTPUT.Ni.contamination);
  });
});

describe('StackView — fixation and substrate personalization', () => {
  const save = ({ mbti = 'ENFP', enn = 4, inst = null } = {}) => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: mbti, scores: {} }));
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: enn, wing: 5 }));
    if (inst) localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: inst }));
  };
  const personalize = () => fireEvent.click(screen.getByRole('button', { name: /Personalize/ }));

  it('shows the scarcity model and what Counter says will not arrive', () => {
    save({ enn: 4 });
    render(<StackView />);
    expect(screen.queryByTestId('stack-fixation')).toBeNull();
    personalize();
    const fix = screen.getByTestId('stack-fixation');
    expect(fix).toHaveTextContent(/Something essential is missing in me/);
    expect(fix).toHaveTextContent(/I am too broken to sustain ordinary commitments/);
    expect(screen.getByTestId('stack-growth')).toHaveTextContent(/consistent principled functioning available/);
  });

  it('frames the growth direction as falsification rather than as an instruction', () => {
    save({ enn: 3 });
    render(<StackView />);
    personalize();
    expect(screen.getByTestId('stack-growth')).toHaveTextContent(/performing the growth direction is the fixation operating/);
    expect(screen.getByTestId('stack-fixation')).toHaveTextContent(/revises the parameters, never the structure/);
  });

  it('shows substrate pressure for the saved first instinct', () => {
    save({ enn: 6, inst: ['sp', 'so', 'sx'] });
    render(<StackView />);
    personalize();
    const sub = screen.getByTestId('stack-substrate');
    expect(sub).toHaveTextContent(/SP/);
    expect(sub).toHaveTextContent(/losing the job, the money, the health, the roof/);
    expect(sub).toHaveTextContent(/income, housing, health, schedule/);
    expect(sub).toHaveTextContent(/it is what drives the level/);
  });

  it('omits the substrate panel when no instinct is saved but still personalizes', () => {
    save({ enn: 5 });
    render(<StackView />);
    personalize();
    expect(screen.getByTestId('stack-fixation')).toBeInTheDocument();
    expect(screen.queryByTestId('stack-substrate')).toBeNull();
  });

  it('drops both panels again when personalization is turned off', () => {
    save({ enn: 8, inst: ['sx', 'sp', 'so'] });
    render(<StackView />);
    personalize();
    expect(screen.getByTestId('stack-substrate')).toHaveTextContent(/bond rupture/);
    fireEvent.click(screen.getByRole('button', { name: /Back to the impersonal view/ }));
    expect(screen.queryByTestId('stack-fixation')).toBeNull();
    expect(screen.queryByTestId('stack-substrate')).toBeNull();
  });
});

describe('StackView — Anchor drift and the two thresholds', () => {
  it('marks each threshold crossed only once its level is reached', () => {
    render(<StackView />);
    const gate = () => screen.getByTestId('stack-threshold-gateFlip').dataset.crossed;
    const inv = () => screen.getByTestId('stack-threshold-discrepancyInversion').dataset.crossed;
    setLevel(5);
    expect([gate(), inv()]).toEqual(['false', 'false']);
    setLevel(6);
    expect([gate(), inv()]).toEqual(['true', 'false']);
    setLevel(7);
    expect([gate(), inv()]).toEqual(['true', 'true']);
  });
});

describe('StackView — Gamble\'s three properties', () => {
  it('starts the two gradients at level 4 and the discrete flip at 7', () => {
    render(<StackView />);
    const started = (id) => screen.getByTestId(`stack-gamble-${id}`).dataset.started;
    setLevel(3);
    expect([started('sensitivity'), started('lens'), started('polarity')]).toEqual(['false', 'false', 'false']);
    setLevel(4);
    expect([started('sensitivity'), started('lens'), started('polarity')]).toEqual(['true', 'true', 'false']);
    setLevel(7);
    expect([started('sensitivity'), started('lens'), started('polarity')]).toEqual(['true', 'true', 'true']);
  });

  it('says the surfacing stays accurate and that sensitivity is trainable', () => {
    render(<StackView />);
    expect(screen.getByTestId('stack-gamble-polarity')).toHaveTextContent(/still contains the accurate discrepancy/);
    expect(screen.getByTestId('stack-gamble-sensitivity')).toHaveTextContent(/trainable in both directions/);
    expect(screen.getByTestId('stack-gamble')).toHaveTextContent(/cannot be queried/);
  });
});

describe('StackView — fixation utility for Lead', () => {
  it('shows nothing until a stakes answer is picked, then the matching configuration', () => {
    render(<StackView />);
    expect(screen.queryByTestId('stack-utility-detail')).toBeNull();
    fireEvent.click(screen.getByTestId('stack-utility-low'));
    const detail = screen.getByTestId('stack-utility-detail');
    expect(detail).toHaveTextContent(/Low utility/);
    expect(detail).toHaveTextContent(/Equilibrium stabilizes at Reality-testing with Gamble intact/);
  });

  it('gives high utility the opposite presentation, not a milder version of the same one', () => {
    render(<StackView />);
    fireEvent.click(screen.getByTestId('stack-utility-high'));
    const detail = screen.getByTestId('stack-utility-detail');
    expect(detail).toHaveTextContent(/across all stakes/);
    expect(detail).toHaveTextContent(/gap is wide/);
  });

  it('toggles back off, and mixed utility predicts no lag', () => {
    render(<StackView />);
    fireEvent.click(screen.getByTestId('stack-utility-mixed'));
    expect(screen.getByTestId('stack-utility-detail')).not.toHaveTextContent(/gap is/);
    fireEvent.click(screen.getByTestId('stack-utility-mixed'));
    expect(screen.queryByTestId('stack-utility-detail')).toBeNull();
  });
});

describe('StackView — odd/even reporting signature', () => {
  it('tags shadow captures as world-referential and ego captures as self-referential', () => {
    render(<StackView />);
    for (const l of [3, 5, 7, 9]) {
      setLevel(l);
      expect(screen.getByTestId('stack-odd-even')).toHaveTextContent(/the world changing/);
    }
    for (const l of [4, 6, 8]) {
      setLevel(l);
      expect(screen.getByTestId('stack-odd-even')).toHaveTextContent(/the self changing/);
    }
  });

  it('omits the tag at level 1 and at level 2, which is identification not capture', () => {
    render(<StackView />);
    setLevel(1);
    expect(screen.queryByTestId('stack-odd-even')).toBeNull();
    setLevel(2);
    expect(screen.queryByTestId('stack-odd-even')).toBeNull();
  });
});

describe('StackView — deep links after mount', () => {
  const hashTo = (query) => {
    window.location.hash = `#/stack?${query}`;
    act(() => { window.dispatchEvent(new HashChangeEvent('hashchange')); });
  };

  it('follows a level change in the hash without remounting', () => {
    render(<StackView />);
    expect(screen.getByTestId('stack-level-label').textContent).toMatch(/Level 1/);
    hashTo('level=6');
    expect(screen.getByTestId('stack-level-label').textContent).toMatch(/Level 6/);
    expect(document.querySelector('[data-pos="2"]').dataset.captured).toBe('true');
  });

  it('follows a type change in the hash', () => {
    render(<StackView />);
    hashTo('type=ENFP&level=4');
    expect(document.querySelector('[data-pos="3"]').dataset.fn).toBe('Te');
    expect(screen.getByTestId('stack-level-label').textContent).toMatch(/Level 4/);
  });

  it('ignores a malformed hash rather than resetting the view', () => {
    render(<StackView />);
    hashTo('level=6');
    hashTo('type=NOPE&level=99');
    expect(screen.getByTestId('stack-level-label').textContent).toMatch(/Level 6/);
  });
});

describe('StackView — the two pairings', () => {
  it('names the nested and domain partner of the selected position without conflating them', () => {
    render(<StackView />);
    fireEvent.click(document.querySelector('[data-pos="3"]'));
    const pairs = screen.getByTestId('stack-pairs');
    // Refuge: nested partner Critic (3-6), domain partner Gamble (3-7).
    expect(pairs).toHaveTextContent('Nested partner: Critic (Position 6)');
    expect(pairs).toHaveTextContent('Domain partner: Gamble (Position 7)');
  });
});

describe('StackView — replay', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('walks from level 1 to 9 at 1.2s per step and can be cancelled', () => {
    render(<StackView />);
    fireEvent.click(screen.getByRole('button', { name: /replay/i }));
    act(() => { vi.advanceTimersByTime(1200); });
    expect(range()).toHaveValue('2');
    act(() => { vi.advanceTimersByTime(1200 * 2); });
    expect(range()).toHaveValue('4');
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    act(() => { vi.advanceTimersByTime(1200 * 5); });
    expect(range()).toHaveValue('4');
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument();
  });

  it('runs to level 9 and stops', () => {
    render(<StackView />);
    fireEvent.click(screen.getByRole('button', { name: /replay/i }));
    act(() => { vi.advanceTimersByTime(1200 * 12); });
    expect(range()).toHaveValue('9');
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument();
  });

  it('stops when the user moves the scrubber', () => {
    render(<StackView />);
    fireEvent.click(screen.getByRole('button', { name: /replay/i }));
    act(() => { vi.advanceTimersByTime(1200); });
    setLevel(7);
    act(() => { vi.advanceTimersByTime(1200 * 3); });
    expect(range()).toHaveValue('7');
  });

  it('jumps straight to level 9 under prefers-reduced-motion', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(q => ({ matches: /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {} }));
    try {
      render(<StackView />);
      fireEvent.click(screen.getByRole('button', { name: /replay/i }));
      expect(range()).toHaveValue('9');
    } finally {
      window.matchMedia = original;
    }
  });

  it('clears its timer on unmount', () => {
    const { unmount } = render(<StackView />);
    fireEvent.click(screen.getByRole('button', { name: /replay/i }));
    unmount();
    expect(() => act(() => { vi.advanceTimersByTime(1200 * 10); })).not.toThrow();
  });
});

describe('StackView — personalization', () => {
  const saveBoth = () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    localStorage.setItem('typer_enn', JSON.stringify({ coreType: 4, wing: 5, display: '4w5' }));
  };

  it('offers to personalize only when both results are saved and valid', () => {
    render(<StackView />);
    expect(screen.queryByRole('button', { name: /personalize/i })).toBeNull();
  });

  it('does not offer with only one result, or with malformed JSON', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP' }));
    const { unmount } = render(<StackView />);
    expect(screen.queryByRole('button', { name: /personalize/i })).toBeNull();
    unmount();
    localStorage.setItem('typer_enn', '{broken');
    expect(() => render(<StackView />)).not.toThrow();
    expect(screen.queryByRole('button', { name: /personalize/i })).toBeNull();
  });

  it('personalizes: sets the type, badges Hunger, shows the Counter form and the health-level bridge', () => {
    saveBoth();
    render(<StackView />);
    fireEvent.change(typeSelect(), { target: { value: 'ISTJ' } });
    fireEvent.click(screen.getByRole('button', { name: /personalize/i }));
    expect(typeSelect()).toHaveValue('ENFP');
    expect(node(4)).toHaveTextContent('Type 4 installs here');
    expect(screen.getByTestId('stack-counter-form')).toHaveTextContent('Ni');
    const bridge = screen.getByTestId('stack-bridge');
    expect(bridge).toHaveTextContent(HEALTH_LEVELS[4].healthy.title);
    // The two scales correspond rather than merely resemble each other, so the
    // bridge states where they diverge instead of disclaiming the mapping.
    expect(bridge).toHaveTextContent(/Riso-Hudson tier language for Type 4/);
    expect(bridge).toHaveTextContent(/Where they diverge/);
    setLevel(5);
    expect(screen.getByTestId('stack-bridge')).toHaveTextContent(HEALTH_LEVELS[4].average.title);
    setLevel(9);
    expect(screen.getByTestId('stack-bridge')).toHaveTextContent(HEALTH_LEVELS[4].unhealthy.title);
  });

  it('can be turned off again', () => {
    saveBoth();
    render(<StackView />);
    fireEvent.click(screen.getByRole('button', { name: /personalize/i }));
    fireEvent.click(screen.getByRole('button', { name: /impersonal/i }));
    expect(screen.queryByTestId('stack-bridge')).toBeNull();
    expect(node(4)).not.toHaveTextContent('installs here');
  });
});
