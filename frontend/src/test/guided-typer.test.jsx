import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import GuidedTyper from '../views/GuidedTyper.jsx';

// Clear localStorage before each test so results don't bleed between tests
beforeEach(() => {
  localStorage.clear();
});

describe('GuidedTyper — choose screen', () => {
  it('renders the page title', () => {
    render(<GuidedTyper />);
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('shows the intro text explaining all three assessments must be completed', () => {
    render(<GuidedTyper />);
    expect(screen.getByText(/complete all three to unlock/i)).toBeInTheDocument();
    expect(screen.getByText(/share link/i)).toBeInTheDocument();
  });

  it('shows all three quiz cards', () => {
    render(<GuidedTyper />);
    // Use subtitle text which is unique to each quiz card
    expect(screen.getByText('Core Type + Wing + Instinct Stack')).toBeInTheDocument();
    expect(screen.getByText('Cognitive Function Stack')).toBeInTheDocument();
    expect(screen.getByText('SP · SX · SO Drive Ordering')).toBeInTheDocument();
  });

  it('does not show Share Profile or Export buttons before any assessment is complete', () => {
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /share profile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^export$/i })).not.toBeInTheDocument();
  });

  it('does not show Share Profile button when only 1 of 3 assessments is complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /share profile/i })).not.toBeInTheDocument();
  });

  it('does not show Share Profile button when 2 of 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 } }));
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /share profile/i })).not.toBeInTheDocument();
  });

  it('shows Share Profile and Export buttons when all 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 } }));
    localStorage.setItem('typer_inst', JSON.stringify({ instinctStack: ['sx', 'sp', 'so'], instScores: { sx: 5, sp: 3, so: 1 } }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /share profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^export$/i })).toBeInTheDocument();
  });

  it('shows completeness indicators for each saved assessment', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'INTJ', scores: { E: 2, I: 8, S: 3, N: 7, T: 9, F: 1, J: 8, P: 2 } }));
    render(<GuidedTyper />);
    // INTJ appears in completeness chip and quiz card — use getAllByText
    expect(screen.getAllByText('INTJ').length).toBeGreaterThanOrEqual(1);
  });
});

describe('GuidedTyper — Enneagram quiz flow', () => {
  it('starts Enneagram quiz when card is clicked', async () => {
    const user = userEvent.setup();
    render(<GuidedTyper />);
    // Click the Enneagram card (it's a div with onClick, not a button)
    const ennCard = screen.getByText('Core Type + Wing + Instinct Stack').closest('[style]');
    await user.click(ennCard);
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument();
  });

  it('does not start Enneagram quiz if already completed', async () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 5, wing: 4, instinctStack: ['sp', 'sx', 'so'],
      display: '5w4 SP/SX/SO', scores: {}, wingStrengthDelta: 'balanced',
    }));
    const user = userEvent.setup();
    render(<GuidedTyper />);
    // display text appears in completeness chip and quiz card
    expect(screen.getAllByText('5w4 SP/SX/SO').length).toBeGreaterThanOrEqual(1);
    // Try clicking the card — it should not navigate since onClick is undefined when saved
    const ennCard = screen.getByText('Core Type + Wing + Instinct Stack').closest('[style]');
    await user.click(ennCard);
    expect(screen.queryByText(/question 1 of/i)).not.toBeInTheDocument();
  });

  it('shows Retake button when Enneagram is already completed', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 5, wing: 4, instinctStack: ['sp', 'sx', 'so'],
      display: '5w4 SP/SX/SO', scores: {}, wingStrengthDelta: 'balanced',
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument();
  });
});

describe('GuidedTyper — MBTI quiz flow', () => {
  it('starts MBTI quiz when card is clicked', async () => {
    const user = userEvent.setup();
    render(<GuidedTyper />);
    const mbtiCard = screen.getByText('Cognitive Function Stack').closest('[style]');
    await user.click(mbtiCard);
    expect(screen.getByText(/which resonates more/i)).toBeInTheDocument();
  });
});

describe('GuidedTyper — Instinct Stack quiz flow', () => {
  it('starts Instinct Stack quiz when card is clicked', async () => {
    const user = userEvent.setup();
    render(<GuidedTyper />);
    const instCard = screen.getByText('SP · SX · SO Drive Ordering').closest('[style]');
    await user.click(instCard);
    expect(screen.getByText(/instinct stack assessment/i)).toBeInTheDocument();
  });
});
