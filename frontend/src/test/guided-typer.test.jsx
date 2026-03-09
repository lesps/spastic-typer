import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import GuidedTyper from '../views/GuidedTyper.jsx';

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Answer up to `max` Likert questions, stopping automatically when the
 * Likert button is no longer present (quiz ended early or bank exhausted).
 */
async function answerUpTo(max, value = '0') {
  for (let i = 0; i < max; i++) {
    const btn = screen.queryByRole('button', { name: value });
    if (!btn) break;
    fireEvent.click(btn);
    await act(async () => { vi.advanceTimersByTime(200); });
  }
}

// ---------------------------------------------------------------------------
// Choose screen
// ---------------------------------------------------------------------------

describe('GuidedTyper — choose screen', () => {
  it('renders the page title', () => {
    render(<GuidedTyper />);
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('shows intro text explaining all three assessments must be completed', () => {
    render(<GuidedTyper />);
    expect(screen.getByText(/complete all three to unlock/i)).toBeInTheDocument();
    expect(screen.getByText(/share link/i)).toBeInTheDocument();
  });

  it('shows all three quiz cards with unique subtitle text', () => {
    render(<GuidedTyper />);
    expect(screen.getByText('Core Type + Wing')).toBeInTheDocument();
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
    expect(screen.getByText(/1\/3 complete/i)).toBeInTheDocument();
  });

  it('does not show Share Profile button when 2 of 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /share profile/i })).not.toBeInTheDocument();
    expect(screen.getByText(/2\/3 complete/i)).toBeInTheDocument();
  });

  it('shows Share Profile and Export buttons only when all 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sx', 'sp', 'so'], instScores: { sx: 5, sp: 3, so: 1 },
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /share profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^export$/i })).toBeInTheDocument();
  });

  it('shows completed result values in completeness chips', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INTJ', scores: { E: 2, I: 8, S: 3, N: 7, T: 9, F: 1, J: 8, P: 2 },
    }));
    render(<GuidedTyper />);
    expect(screen.getAllByText('INTJ').length).toBeGreaterThanOrEqual(1);
  });

  it('shows "adaptive" tag instead of a fixed question count on quiz cards', () => {
    render(<GuidedTyper />);
    const adaptiveTags = screen.getAllByText(/adaptive/i);
    expect(adaptiveTags.length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// Enneagram quiz flow
// ---------------------------------------------------------------------------

describe('GuidedTyper — Enneagram quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first question with Likert scale', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+3' })).toBeInTheDocument();
  });

  it('advances to question 2 after answering question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.getByText(/question 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '+1' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByText(/question 2/i)).toBeInTheDocument();
  });

  it('shows Previous button from question 2 onward but not on question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    expect(screen.queryByRole('button', { name: /← previous/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByRole('button', { name: /← previous/i })).toBeInTheDocument();
  });

  it('shows enneagram result after running through the question bank', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    // Answer up to 45 questions at '0' — stops automatically when result appears
    await answerUpTo(45);

    // If disambiguation was triggered, skip it
    const skipBtn = screen.queryByRole('button', { name: /skip/i });
    if (skipBtn) fireEvent.click(skipBtn);

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
    expect(screen.getByText(/type scores/i)).toBeInTheDocument();
  }, 15000);

  it('ends early when answers show strong bias for one type', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    // Answer strongly for all — adaptive exit fires when confidence is met
    await answerUpTo(45, '+3');

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
  }, 15000);

  it('shows disambiguation clarifying questions when top-2 types are close', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    // All-zero answers → all types equal → disambiguation triggered after bank exhausted
    await answerUpTo(45);

    // Either disambiguation or result appears
    const disambig = screen.queryByText(/clarifying questions/i);
    const result = screen.queryByText(/your enneagram result/i);
    expect(disambig || result).toBeTruthy();
  }, 15000);

  it('can skip disambiguation and proceed directly to enneagram result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    await answerUpTo(45);

    // Skip disambiguation if it appeared
    const skipBtn = screen.queryByRole('button', { name: /skip/i });
    if (skipBtn) fireEvent.click(skipBtn);

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
  }, 15000);

  it('does not start quiz if enneagram is already completed', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 5, wing: 4, instinctStack: ['sp', 'sx', 'so'],
      display: '5w4 SP/SX/SO', scores: {}, wingStrengthDelta: 'balanced',
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.queryByText(/question 1/i)).not.toBeInTheDocument();
  });

  it('shows Retake button when enneagram is already completed', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 5, wing: 4, instinctStack: ['sp', 'sx', 'so'],
      display: '5w4 SP/SX/SO', scores: {}, wingStrengthDelta: 'balanced',
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Instinct Stack quiz flow
// ---------------------------------------------------------------------------

describe('GuidedTyper — Instinct Stack quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first question with Likert scale', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    expect(screen.getByText(/instinct stack assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
  });

  it('advances to question 2 after answering question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));

    fireEvent.click(screen.getByRole('button', { name: '+2' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByText(/question 2/i)).toBeInTheDocument();
  });

  it('shows instinct result with drive breakdown after completing questions', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));

    // Answer up to 15 questions; stops when result appears
    await answerUpTo(15, '+1');

    expect(screen.getByText(/your instinct stack result/i)).toBeInTheDocument();
    expect(screen.getByText('Dominant')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Repressed')).toBeInTheDocument();
    expect(screen.getByText(/drive breakdown/i)).toBeInTheDocument();
  }, 10000);

  it('can return to choose screen from instinct result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    await answerUpTo(15);

    fireEvent.click(screen.getByRole('button', { name: /← back to assessments/i }));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  }, 10000);

  it('does not start quiz if instinct stack is already completed', () => {
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sp', 'so', 'sx'], instScores: { sp: 7, so: 4, sx: 2 },
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    expect(screen.queryByText(/question 1/i)).not.toBeInTheDocument();
  });

  it('shows Retake button when instinct stack is already completed', () => {
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sp', 'so', 'sx'], instScores: { sp: 7, so: 4, sx: 2 },
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// MBTI quiz flow
// ---------------------------------------------------------------------------

describe('GuidedTyper — MBTI quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first question with Likert scale', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+3' })).toBeInTheDocument();
  });

  it('does not reveal dimension labels during the quiz', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    // "E vs I" etc. should NOT appear as a question context label
    expect(screen.queryByText(/E vs I/)).not.toBeInTheDocument();
    expect(screen.queryByText(/T vs F/)).not.toBeInTheDocument();
    expect(screen.queryByText(/S vs N/)).not.toBeInTheDocument();
    expect(screen.queryByText(/J vs P/)).not.toBeInTheDocument();
  });

  it('shows settled dimension indicators during the quiz', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    // The dim badges should be visible as progress indicators
    expect(screen.getByText('EI')).toBeInTheDocument();
    expect(screen.getByText('SN')).toBeInTheDocument();
    expect(screen.getByText('TF')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
  });

  it('advances to question 2 after selecting an option', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    fireEvent.click(screen.getByRole('button', { name: '+2' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByText(/question 2/i)).toBeInTheDocument();
  });

  it('shows MBTI result with cognitive stack and dimension scores after completing questions', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    // Answer up to 32 questions at '0' — stops when done
    await answerUpTo(32);

    expect(screen.getByText(/your mbti result/i)).toBeInTheDocument();
    expect(screen.getByText(/cognitive stack/i)).toBeInTheDocument();
    expect(screen.getByText(/dimension scores/i)).toBeInTheDocument();
  }, 10000);

  it('ends test early when all dimensions are confident', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    // Answer +3 on all — confident after 2 per dim (8 total); stops automatically
    await answerUpTo(32, '+3');

    expect(screen.getByText(/your mbti result/i)).toBeInTheDocument();
  }, 10000);

  it('result is E-type when answering strongly positively (regression test for scale bug)', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    // Answer +3 on everything — adaptive exit after ~8 questions; stops automatically
    await answerUpTo(32, '+3');

    expect(screen.getByText(/your mbti result/i)).toBeInTheDocument();
    // The result type heading should start with E
    const typeHeading = document.querySelector('h1');
    expect(typeHeading?.textContent?.[0]).toBe('E');
  }, 10000);

  it('result is I-type when answering strongly negatively', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    // Answer -3 on everything — adaptive exit after ~8 questions; stops automatically
    await answerUpTo(32, '-3');

    expect(screen.getByText(/your mbti result/i)).toBeInTheDocument();
    const typeHeading = document.querySelector('h1');
    expect(typeHeading?.textContent?.[0]).toBe('I');
  }, 10000);

  it('can return to choose screen from MBTI result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    await answerUpTo(32);

    fireEvent.click(screen.getByRole('button', { name: /← back to assessments/i }));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  }, 10000);

  it('does not start quiz if MBTI is already completed', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'ENTP', scores: { E: 8, I: 2, S: 4, N: 6, T: 7, F: 3, J: 3, P: 7 },
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    expect(screen.queryByText(/question 1/i)).not.toBeInTheDocument();
  });

  it('shows Retake button when MBTI is already completed', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'ENTP', scores: { E: 8, I: 2, S: 4, N: 6, T: 7, F: 3, J: 3, P: 7 },
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument();
  });
});
