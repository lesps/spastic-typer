import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import GuidedTyper from '../views/GuidedTyper.jsx';

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Click through N Likert questions. Must be used inside a fake-timer context. */
async function answerLikertQuestions(count, value = '0') {
  for (let i = 0; i < count; i++) {
    fireEvent.click(screen.getByRole('button', { name: value }));
    await act(async () => { vi.advanceTimersByTime(200); });
  }
}

/** Click through N binary MBTI questions (picks first option each time). */
async function answerMbtiQuestions(count) {
  const skipLabels = new Set(['-3', '-2', '-1', '0', '+1', '+2', '+3', '← Previous', 'Cancel', '← Back to Assessments']);
  for (let i = 0; i < count; i++) {
    const options = screen.getAllByRole('button').filter(b => {
      const t = b.textContent.trim();
      return t.length > 10 && !skipLabels.has(t);
    });
    fireEvent.click(options[0]);
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
});

// ---------------------------------------------------------------------------
// Enneagram quiz flow
// ---------------------------------------------------------------------------

describe('GuidedTyper — Enneagram quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first of 27 questions with Likert scale', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.getByText(/question 1 of 27/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+3' })).toBeInTheDocument();
  });

  it('advances to question 2 after answering question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.getByText(/question 1 of 27/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '+1' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByText(/question 2 of 27/i)).toBeInTheDocument();
  });

  it('shows Previous button from question 2 onward but not on question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    expect(screen.queryByRole('button', { name: /← previous/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByRole('button', { name: /← previous/i })).toBeInTheDocument();
  });

  it('proceeds directly to enneagram result after all 27 questions with no close tie', async () => {
    // All-zero answers → scores all 0, sorted[0]='1', sorted[1]='2', pairKey='1-2'
    // '1-2' is not in ENN_DISAMBIG → falls through directly to enn-result
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    await answerLikertQuestions(27);

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
  });

  it('shows disambiguation clarifying questions when top-2 types are within 3 points', async () => {
    // Type 4 questions are at indices 9–11, type 5 at 12–14 (3 each, pole=1).
    // +3 for those indices, 0 for all others → type4=9, type5=9, others=0.
    // gap=0 ≤ 3, pairKey='4-5' → ENN_DISAMBIG['4-5'] exists → disambiguation shown.
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    for (let qi = 0; qi < 27; qi++) {
      const val = (qi >= 9 && qi <= 14) ? '+3' : '0';
      fireEvent.click(screen.getByRole('button', { name: val }));
      await act(async () => { vi.advanceTimersByTime(200); });
    }

    expect(screen.getByText(/clarifying questions/i)).toBeInTheDocument();
    expect(screen.getByText(/type 4.*type 5|type 5.*type 4/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('can skip disambiguation and proceed directly to enneagram result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    for (let qi = 0; qi < 27; qi++) {
      fireEvent.click(screen.getByRole('button', { name: (qi >= 9 && qi <= 14) ? '+3' : '0' }));
      await act(async () => { vi.advanceTimersByTime(200); });
    }

    expect(screen.getByText(/clarifying questions/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
  });

  it('shows enneagram result after completing all 27 questions', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));

    await answerLikertQuestions(27); // enn phase (no disambig with all-zero)

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
    expect(screen.getByText(/type scores/i)).toBeInTheDocument();
  });

  it('does not start quiz if enneagram is already completed', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 5, wing: 4, instinctStack: ['sp', 'sx', 'so'],
      display: '5w4 SP/SX/SO', scores: {}, wingStrengthDelta: 'balanced',
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    expect(screen.queryByText(/question 1 of/i)).not.toBeInTheDocument();
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
// Instinct Stack quiz flow  (second — placed before MBTI)
// ---------------------------------------------------------------------------

describe('GuidedTyper — Instinct Stack quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first of 12 questions with Likert scale', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    expect(screen.getByText(/instinct stack assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/question 1 of 12/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
  });

  it('advances to question 2 after answering question 1', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));

    fireEvent.click(screen.getByRole('button', { name: '+2' }));
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(screen.getByText(/question 2 of 12/i)).toBeInTheDocument();
  });

  it('shows instinct result with drive breakdown after completing all 12 questions', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));

    await answerLikertQuestions(12, '+1');

    expect(screen.getByText(/your instinct stack result/i)).toBeInTheDocument();
    expect(screen.getByText('Dominant')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Repressed')).toBeInTheDocument();
    expect(screen.getByText(/drive breakdown/i)).toBeInTheDocument();
  });

  it('can return to choose screen from instinct result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    await answerLikertQuestions(12);

    fireEvent.click(screen.getByRole('button', { name: /← back to assessments/i }));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('does not start quiz if instinct stack is already completed', () => {
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sp', 'so', 'sx'], instScores: { sp: 7, so: 4, sx: 2 },
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('SP · SX · SO Drive Ordering').closest('[style]'));
    expect(screen.queryByText(/question 1 of 12/i)).not.toBeInTheDocument();
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
// MBTI quiz flow  (third)
// ---------------------------------------------------------------------------

describe('GuidedTyper — MBTI quiz flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts quiz and shows first of 20 questions', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    expect(screen.getByText(/which resonates more/i)).toBeInTheDocument();
    expect(screen.getByText(/question 1 of 20/i)).toBeInTheDocument();
  });

  it('advances to question 2 after selecting an option', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    await answerMbtiQuestions(1);

    expect(screen.getByText(/question 2 of 20/i)).toBeInTheDocument();
  });

  it('shows MBTI result with cognitive stack and dimension scores after all 20 questions', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));

    await answerMbtiQuestions(20);

    expect(screen.getByText(/your mbti result/i)).toBeInTheDocument();
    expect(screen.getByText(/cognitive stack/i)).toBeInTheDocument();
    expect(screen.getByText(/dimension scores/i)).toBeInTheDocument();
  });

  it('can return to choose screen from MBTI result', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    await answerMbtiQuestions(20);

    fireEvent.click(screen.getByRole('button', { name: /← back to assessments/i }));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('does not start quiz if MBTI is already completed', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'ENTP', scores: { E: 8, I: 2, S: 4, N: 6, T: 7, F: 3, J: 3, P: 7 },
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    expect(screen.queryByText(/which resonates more/i)).not.toBeInTheDocument();
  });

  it('shows Retake button when MBTI is already completed', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'ENTP', scores: { E: 8, I: 2, S: 4, N: 6, T: 7, F: 3, J: 3, P: 7 },
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument();
  });
});
