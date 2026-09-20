import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import StackView from '../views/StackView.jsx';
import { DIAGNOSTIC, COACHING_BANDS, TEST_SET, CLINICAL_SEQUENCE } from '../data/stack.js';

beforeEach(() => localStorage.clear());

const openReading = () => {
  render(<StackView />);
  fireEvent.click(document.querySelector('[data-tab="reading"]'));
};
const setLevel = (l) => fireEvent.change(screen.getByLabelText('Health level'), { target: { value: String(l) } });

describe('StackView — Model and Reading tabs', () => {
  it('starts on the model and does not render the reading panel', () => {
    render(<StackView />);
    expect(document.querySelector('[data-tab="model"]').getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByTestId('reading-diagnostic')).toBeNull();
    expect(screen.getByTestId('stack-purpose')).toBeInTheDocument();
  });

  it('swaps the two halves rather than stacking them', () => {
    openReading();
    expect(screen.getByTestId('reading-diagnostic')).toBeInTheDocument();
    expect(screen.queryByTestId('stack-purpose')).toBeNull();
    fireEvent.click(document.querySelector('[data-tab="model"]'));
    expect(screen.queryByTestId('reading-diagnostic')).toBeNull();
    expect(screen.getByTestId('stack-purpose')).toBeInTheDocument();
  });
});

describe('StackReading — coaching bands', () => {
  it('renders all four bands', () => {
    openReading();
    for (const b of COACHING_BANDS) {
      expect(screen.getByTestId(`reading-band-${b.id}`)).toBeInTheDocument();
    }
  });

  it('marks Boundary current at level 1, since the scrubber starts there', () => {
    openReading();
    expect(screen.getByTestId('reading-band-boundary').dataset.current).toBe('true');
    expect(screen.getByTestId('reading-band-terminal').dataset.current).toBe('false');
  });

  it('follows the scrubber, splitting Reality-testing at level 7', () => {
    render(<StackView />);
    const current = (id) => screen.getByTestId(`reading-band-${id}`).dataset.current;
    const toReading = () => fireEvent.click(document.querySelector('[data-tab="reading"]'));

    setLevel(5); toReading();
    expect([current('maintenance'), current('realityTesting')]).toEqual(['true', 'false']);

    fireEvent.click(document.querySelector('[data-tab="model"]'));
    setLevel(6); toReading();
    // Level 6 is the Reality-testing STAGE but the Maintenance coaching BAND:
    // the bands track Lead's status, and Lead still perceives independently at 6.
    expect([current('maintenance'), current('realityTesting')]).toEqual(['true', 'false']);

    fireEvent.click(document.querySelector('[data-tab="model"]'));
    setLevel(7); toReading();
    expect([current('maintenance'), current('realityTesting')]).toEqual(['false', 'true']);

    fireEvent.click(document.querySelector('[data-tab="model"]'));
    setLevel(9); toReading();
    expect(current('terminal')).toBe('true');
  });

  it('renders contiguous level spans as ranges, not as lists', () => {
    openReading();
    expect(screen.getByTestId('reading-band-boundary')).toHaveTextContent('Levels 1–3');
    expect(screen.getByTestId('reading-band-maintenance')).toHaveTextContent('Levels 4–6');
    expect(screen.getByTestId('reading-band-terminal')).toHaveTextContent('Levels 8–9');
    // A single-level band reads "Level 7", not "Levels 7".
    expect(screen.getByTestId('reading-band-realityTesting')).toHaveTextContent('Level 7');
    expect(screen.getByTestId('reading-band-realityTesting')).not.toHaveTextContent('Levels 7');
  });

  it('says coaching stops working only at Terminal', () => {
    openReading();
    expect(screen.getByTestId('reading-band-boundary')).toHaveTextContent(/Coaching works directly/);
    expect(screen.getByTestId('reading-band-realityTesting')).toHaveTextContent(/Not yet a management problem/);
    expect(screen.getByTestId('reading-band-terminal')).toHaveTextContent(/protect the team, set hard boundaries, escalate/);
  });
});

describe('StackReading — diagnostic table', () => {
  it('renders every observation row with its inferred level', () => {
    openReading();
    const rows = screen.getAllByTestId('reading-diagnostic-row');
    expect(rows).toHaveLength(DIAGNOSTIC.length);
    expect(rows.map(r => r.dataset.level)).toEqual(DIAGNOSTIC.map(d => d.level));
  });

  it('keeps the confidence qualifier, not just the level', () => {
    openReading();
    expect(screen.getByTestId('reading-diagnostic')).toHaveTextContent(/distinguishes from 4 by restoration/);
    expect(screen.getByTestId('reading-diagnostic')).toHaveTextContent(/state, not a trait/);
  });
});

describe('StackReading — activations and typing errors', () => {
  it('names the position behind each of the three activations', () => {
    openReading();
    expect(screen.getByTestId('reading-activation-reaching')).toHaveTextContent(/Hunger \(Position 4\)/);
    expect(screen.getByTestId('reading-activation-gripping')).toHaveTextContent(/Refuge \(Position 3\)/);
    expect(screen.getByTestId('reading-activation-rejecting')).toHaveTextContent(/Counter \(Position 5\)/);
  });

  it('warns against deploying growth content into a live reach', () => {
    openReading();
    expect(screen.getByTestId('reading-activation-reaching'))
      .toHaveTextContent(/don't deploy growth-direction content/i);
  });

  it('lists the predicted typing errors with what to check instead', () => {
    openReading();
    const errors = screen.getByTestId('reading-typing-errors');
    expect(errors).toHaveTextContent(/check where native Lead operates at low stakes/);
    expect(errors).toHaveTextContent(/the claimed Lead never appears under load/);
  });
});

describe('StackReading — clinical sequence and failure modes', () => {
  it('renders the four steps in order', () => {
    openReading();
    for (const c of CLINICAL_SEQUENCE) {
      expect(screen.getByTestId(`reading-step-${c.step}`)).toHaveTextContent(c.name);
    }
    expect(screen.getByTestId('reading-clinical')).toHaveTextContent(/never self-performed/);
  });

  it('separates the two failure modes by level band and correction', () => {
    openReading();
    const sim = screen.getByTestId('reading-failure-simulation');
    const non = screen.getByTestId('reading-failure-nonRegistration');
    expect(sim).toHaveTextContent(/Levels 7\+/);
    expect(sim).toHaveTextContent(/reduce substrate pressure/);
    expect(non).toHaveTextContent(/Levels 4–6/);
    expect(non).toHaveTextContent(/re-sensitize, then try again/);
  });
});

describe('StackReading — the test set', () => {
  it('shows all fourteen falsifiers and says none of it is verified', () => {
    openReading();
    const panel = screen.getByTestId('reading-test-set');
    expect(panel.querySelectorAll('li')).toHaveLength(TEST_SET.length);
    expect(panel).toHaveTextContent(/Nothing above has been verified against observation/);
  });
});
