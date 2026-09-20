import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Explorer from '../views/Explorer.jsx';

beforeEach(() => { localStorage.clear(); window.scrollTo.mockClear(); });

describe('Explorer — MBTI tab', () => {
  it('groups the sixteen types by quadrant', () => {
    render(<Explorer initialTab="mbti" />);
    for (const q of ['NF — Idealists', 'NT — Rationals', 'SF — Guardians', 'ST — Artisans']) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
    for (const code of ['INFP', 'INFJ', 'ENFP', 'ENFJ', 'INTP', 'INTJ', 'ENTP', 'ENTJ', 'ISFP', 'ISFJ', 'ESFP', 'ESFJ', 'ISTP', 'ISTJ', 'ESTP', 'ESTJ']) {
      expect(screen.getByRole('button', { name: new RegExp(`^${code}`) })).toBeInTheDocument();
    }
  });

  it('toggles the 4-step typing SOP', () => {
    render(<Explorer initialTab="mbti" />);
    expect(screen.queryByText(/step 1 — energy direction/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show 4-step typing sop/i }));
    expect(screen.getByText(/step 1 — energy direction/i)).toBeInTheDocument();
    expect(screen.getByText(/step 4 — lifestyle orientation/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /hide 4-step typing sop/i }));
    expect(screen.queryByText(/step 1 — energy direction/i)).not.toBeInTheDocument();
  });

  it('opens a type detail from the quadrant grid and returns with Back', () => {
    render(<Explorer initialTab="mbti" />);
    fireEvent.click(screen.getByRole('button', { name: /^INTJ/ }));
    expect(screen.getByRole('heading', { name: 'INTJ', level: 1 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /← back/i }));
    expect(screen.getByText('NT — Rationals')).toBeInTheDocument();
  });
});

describe('Explorer — Enneagram tab', () => {
  it('opens a type detail and returns with Back', () => {
    render(<Explorer />);
    fireEvent.click(screen.getByRole('button', { name: /The Individualist/ }));
    expect(screen.getByRole('heading', { name: 'Type 4', level: 1 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /← back/i }));
    expect(screen.getByRole('heading', { name: 'Explorer', level: 1 })).toBeInTheDocument();
  });
});

describe('Explorer — collapsible intros', () => {
  it('starts with the tab intro collapsed and expands it on click', () => {
    render(<Explorer />);
    const para = screen.getByText(/The Enneagram describes nine distinct personality structures/);
    expect(para).not.toBeVisible();
    fireEvent.click(screen.getByText(/about the enneagram/i));
    expect(para).toBeVisible();
  });

  it('keeps the type grid reachable without expanding the intro', () => {
    render(<Explorer />);
    expect(screen.getByRole('button', { name: /The Individualist/ })).toBeVisible();
  });

  it('collapses the MBTI, Instinct, and Integration intros too', () => {
    render(<Explorer initialTab="mbti" />);
    expect(screen.getByText(/The MBTI describes sixteen personality types/)).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Instinct' }));
    expect(screen.getByText(/The three Instinctual Drives/)).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Integration' }));
    expect(screen.getByText(/No single personality system captures/)).not.toBeVisible();
  });
});

describe('Explorer — growth direction as falsification', () => {
  it('states the scarcity model and what the defense predicts, not an instruction', () => {
    render(<Explorer />);
    fireEvent.click(screen.getByRole('button', { name: /The Achiever/i }));
    expect(screen.getByText(/Worth is produced only by performance/)).toBeInTheDocument();
    expect(screen.getByText(/Non-performance cascades to material and relational collapse/)).toBeInTheDocument();
    expect(screen.getByText(/support arriving without performing for it/)).toBeInTheDocument();
  });

  it('carries the caveat that the direction cannot be self-performed', () => {
    render(<Explorer />);
    fireEvent.click(screen.getByRole('button', { name: /The Achiever/i }));
    const caveat = screen.getByTestId('growth-caveat');
    expect(caveat).toHaveTextContent(/Sourcing must be external/);
    expect(caveat).toHaveTextContent(/performing the growth direction is the fixation operating/);
  });

  it('distinguishes the two stress events on an MBTI type', () => {
    render(<Explorer />);
    fireEvent.click(screen.getByRole('button', { name: /MBTI/i }));
    fireEvent.click(screen.getByRole('button', { name: /INFP/ }));
    const events = screen.getByTestId('stress-events');
    expect(events).toHaveTextContent(/Hunger Reaching/);
    expect(events).toHaveTextContent(/Flood forced-primary/);
    expect(events).toHaveTextContent(/they are submerged/);
  });
});
