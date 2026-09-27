import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CombinedProfile from '../views/CombinedProfile.jsx';
import { growthPathFor } from '../utils/stack.js';

const seed = ({ coreType = 3, wing = 4, mbti = 'ENFP', inst = ['so', 'sx', 'sp'] } = {}) => {
  localStorage.setItem('typer_enn', JSON.stringify({ coreType, wing, instinctStack: inst, display: `${coreType}w${wing}`, scores: {} }));
  localStorage.setItem('typer_mbti', JSON.stringify({ result: mbti, scores: {} }));
  localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: inst, instScores: {} }));
};

beforeEach(() => localStorage.clear());

describe('CombinedProfile — growth path is derived at render', () => {
  it('shows the path composed for this exact type, stack and instinct', () => {
    seed();
    render(<CombinedProfile />);
    const expected = growthPathFor(3, 4, 'ENFP', 'SO/SX/SP');
    expect(expected).toBeTruthy();
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('changes with the MBTI type, because the registration channel changes', () => {
    seed({ mbti: 'ISTJ' });
    render(<CombinedProfile />);
    // ISTJ's Gamble is Fe; ENFP's is Ti.
    expect(screen.getByText(/Fe at Gamble/)).toBeInTheDocument();
    expect(screen.queryByText(/Ti at Gamble/)).toBeNull();
  });

  it('changes with the first instinct, because the substrate pressure changes', () => {
    seed({ inst: ['sp', 'so', 'sx'] });
    render(<CombinedProfile />);
    expect(screen.getByText(/with SP first/)).toBeInTheDocument();
    expect(screen.getByText(/losing the job, the money, the health, the roof/)).toBeInTheDocument();
  });

  it('separates the repressed instinct from the growth direction', () => {
    seed();
    render(<CombinedProfile />);
    expect(screen.getByText(/the domain that gets least attention/)).toBeInTheDocument();
    expect(screen.getByText(/Distinct from the growth direction above/)).toBeInTheDocument();
  });

  it('still renders when only some results are saved', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    expect(() => render(<CombinedProfile />)).not.toThrow();
  });
});
