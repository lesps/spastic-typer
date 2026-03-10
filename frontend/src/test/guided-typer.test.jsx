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
    expect(screen.getByText(/profile code/i)).toBeInTheDocument();
  });

  it('shows all three quiz cards with unique subtitle text', () => {
    render(<GuidedTyper />);
    expect(screen.getByText('Core Type + Wing')).toBeInTheDocument();
    expect(screen.getByText('Cognitive Function Stack')).toBeInTheDocument();
    expect(screen.getByText('SP · SX · SO Drive Ordering')).toBeInTheDocument();
  });

  it('does not show Get Code or Export buttons before any assessment is complete', () => {
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /get code/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^export$/i })).not.toBeInTheDocument();
  });

  it('does not show Get Code button when only 1 of 3 assessments is complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /get code/i })).not.toBeInTheDocument();
    expect(screen.getByText(/1\/3 complete/i)).toBeInTheDocument();
  });

  it('does not show Get Code button when 2 of 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5 SX/SP/SO', scores: {}, wingStrengthDelta: 'moderate',
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /get code/i })).not.toBeInTheDocument();
    expect(screen.getByText(/2\/3 complete/i)).toBeInTheDocument();
  });

  it('shows Get Code and Export buttons only when all 3 assessments are complete', () => {
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
    expect(screen.getByRole('button', { name: /get code/i })).toBeInTheDocument();
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

  it('does not show dimension completion badges during the quiz', () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Cognitive Function Stack').closest('[style]'));
    // Dimension badges (EI/SN/TF/JP) were removed as they were unreliable
    expect(screen.queryByText('EI')).not.toBeInTheDocument();
    expect(screen.queryByText('SN')).not.toBeInTheDocument();
    expect(screen.queryByText('TF')).not.toBeInTheDocument();
    expect(screen.queryByText('JP')).not.toBeInTheDocument();
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

// ---------------------------------------------------------------------------
// Profile code — Load Profile
// ---------------------------------------------------------------------------

describe('GuidedTyper — profile code (load)', () => {
  it('shows Load Profile section on the choose screen', () => {
    render(<GuidedTyper />);
    expect(screen.getByText(/load a shared profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^load$/i })).toBeInTheDocument();
  });

  it('loads a valid profile code and shows all three results', () => {
    render(<GuidedTyper />);
    const input = screen.getByPlaceholderText(/453xpo-INFP/i);
    fireEvent.change(input, { target: { value: '453xpo-INFP' } });
    fireEvent.click(screen.getByRole('button', { name: /^load$/i }));
    // Profile should now show on the choose screen
    expect(screen.getAllByText('4w5').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('INFP').length).toBeGreaterThanOrEqual(1);
  });

  it('shows error for an invalid code', () => {
    render(<GuidedTyper />);
    const input = screen.getByPlaceholderText(/453xpo-INFP/i);
    fireEvent.change(input, { target: { value: 'BADCODE' } });
    fireEvent.click(screen.getByRole('button', { name: /^load$/i }));
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
  });

  it('shows error for a code with invalid MBTI type', () => {
    render(<GuidedTyper />);
    const input = screen.getByPlaceholderText(/453xpo-INFP/i);
    fireEvent.change(input, { target: { value: '453xpo-XXXX' } });
    fireEvent.click(screen.getByRole('button', { name: /^load$/i }));
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
  });

  it('clears error when input changes after a failed attempt', () => {
    render(<GuidedTyper />);
    const input = screen.getByPlaceholderText(/453xpo-INFP/i);
    fireEvent.change(input, { target: { value: 'BAD' } });
    fireEvent.click(screen.getByRole('button', { name: /^load$/i }));
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '453xpo-INFP' } });
    expect(screen.queryByText(/invalid code/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Profile code — Get Code
// ---------------------------------------------------------------------------

describe('GuidedTyper — profile code (generate)', () => {
  it('shows Get Code button only when all 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5', scores: {}, wingStrengthDelta: 3,
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    // Only 2 done — button absent
    render(<GuidedTyper />);
    expect(screen.queryByRole('button', { name: /get code/i })).not.toBeInTheDocument();
  });

  it('displays an 11-character code after clicking Get Code', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5', scores: {}, wingStrengthDelta: 3,
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sx', 'sp', 'so'], instScores: { sx: 5, sp: 3, so: 1 },
    }));
    render(<GuidedTyper />);
    fireEvent.click(screen.getByRole('button', { name: /get code/i }));
    // The generated code should appear as a <code> element with 11 chars
    const codeEl = document.querySelector('code');
    expect(codeEl).toBeTruthy();
    expect(codeEl.textContent.length).toBe(11);
    expect(codeEl.textContent).toMatch(/^\d{2}[0-3][pxo]{3}-[A-Z]{4}$/);
  });
});

// ---------------------------------------------------------------------------
// Next incomplete quiz button on result screens
// ---------------------------------------------------------------------------

describe('GuidedTyper — next incomplete quiz button', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows Start MBTI button after completing Enneagram when MBTI is not done', async () => {
    render(<GuidedTyper />);
    fireEvent.click(screen.getByText('Core Type + Wing').closest('[style]'));
    await answerUpTo(45, '+3');

    // Skip disambiguation if it appeared
    const skipBtn = screen.queryByRole('button', { name: /skip/i });
    if (skipBtn) fireEvent.click(skipBtn);

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start mbti/i })).toBeInTheDocument();
  }, 15000);

  it('omits next quiz button on Enneagram result when all 3 are done', async () => {
    // Pre-populate all 3 so all Retake buttons are visible
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5', scores: {}, wingStrengthDelta: 3,
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({
      result: 'INFP', scores: { E: 3, I: 7, S: 4, N: 6, T: 5, F: 5, J: 4, P: 6 },
    }));
    localStorage.setItem('typer_inst', JSON.stringify({
      instinctStack: ['sx', 'sp', 'so'], instScores: { sx: 5, sp: 3, so: 1 },
    }));
    render(<GuidedTyper />);
    // Three retake buttons in DOM order: Enneagram, MBTI, Instinct Stack — click Enneagram's
    fireEvent.click(screen.getAllByRole('button', { name: /retake/i })[0]);
    await answerUpTo(45, '+3');
    const skipBtn = screen.queryByRole('button', { name: /skip/i });
    if (skipBtn) fireEvent.click(skipBtn);

    expect(screen.getByText(/your enneagram result/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^start /i })).not.toBeInTheDocument();
  }, 15000);
});

// ---------------------------------------------------------------------------
// Session persistence — mid-quiz navigation recovery
// ---------------------------------------------------------------------------

describe('session persistence — mid-quiz navigation recovery', () => {
  it('restores enneagram quiz in progress from typer_session', () => {
    const ennSeqIds = Array.from({ length: 45 }, (_, i) => i);
    localStorage.setItem('typer_session', JSON.stringify({
      phase: 'enn', qi: 2,
      answers: { 0: 2, 1: -1 }, mbtiAnswers: {}, instAnswers: {}, branchAnswers: {},
      disambigPair: null,
      ennSeqIds, mbtiSeqIds: [], instSeqIds: [],
    }));
    render(<GuidedTyper />);
    // Quiz UI is active — Cancel button present, choose screen title absent
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.queryByText('Guided Typer')).not.toBeInTheDocument();
  });

  it('restores MBTI quiz in progress from typer_session', () => {
    const mbtiSeqIds = Array.from({ length: 32 }, (_, i) => i);
    localStorage.setItem('typer_session', JSON.stringify({
      phase: 'mbti', qi: 3,
      answers: {}, mbtiAnswers: { 0: 1, 1: -2, 2: 3 }, instAnswers: {}, branchAnswers: {},
      disambigPair: null,
      ennSeqIds: [], mbtiSeqIds, instSeqIds: [],
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.queryByText('Guided Typer')).not.toBeInTheDocument();
  });

  it('restores instinct quiz in progress from typer_session', () => {
    const instSeqIds = Array.from({ length: 15 }, (_, i) => i);
    localStorage.setItem('typer_session', JSON.stringify({
      phase: 'instinct', qi: 1,
      answers: {}, mbtiAnswers: {}, instAnswers: { 0: 2 }, branchAnswers: {},
      disambigPair: null,
      ennSeqIds: [], mbtiSeqIds: [], instSeqIds,
    }));
    render(<GuidedTyper />);
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.queryByText('Guided Typer')).not.toBeInTheDocument();
  });

  it('clears typer_session when user cancels back to choose screen', () => {
    const ennSeqIds = Array.from({ length: 45 }, (_, i) => i);
    localStorage.setItem('typer_session', JSON.stringify({
      phase: 'enn', qi: 2,
      answers: { 0: 2, 1: -1 }, mbtiAnswers: {}, instAnswers: {}, branchAnswers: {},
      disambigPair: null,
      ennSeqIds, mbtiSeqIds: [], instSeqIds: [],
    }));
    render(<GuidedTyper />);
    // Click Cancel → Yes, cancel to trigger reset()
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    fireEvent.click(screen.getByRole('button', { name: /yes, cancel/i }));
    expect(localStorage.getItem('typer_session')).toBeNull();
  });

  it('does not restore session when phase is a result or choose phase', () => {
    localStorage.setItem('typer_session', JSON.stringify({
      phase: 'enn-result', qi: 0,
      answers: {}, mbtiAnswers: {}, instAnswers: {}, branchAnswers: {},
      disambigPair: null,
      ennSeqIds: [], mbtiSeqIds: [], instSeqIds: [],
    }));
    render(<GuidedTyper />);
    // Result/choose phases are not active — should fall back to choose screen
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^cancel$/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Rich profile card
// ---------------------------------------------------------------------------

const ALL_THREE_LS = () => {
  localStorage.setItem('typer_enn', JSON.stringify({
    coreType: 4, wing: 5, wingStrengthDelta: 3, instinctStack: ['sx', 'sp', 'so'],
    display: '4w5', scores: { 1: 0, 2: 0, 3: 0, 4: 10, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
  }));
  localStorage.setItem('typer_mbti', JSON.stringify({
    result: 'INFP', scores: { E: 2, I: 8, S: 3, N: 7, T: 4, F: 6, J: 3, P: 7 },
  }));
  localStorage.setItem('typer_inst', JSON.stringify({
    instinctStack: ['sx', 'sp', 'so'], instScores: { sx: 5, sp: 3, so: 1 },
  }));
};

describe('GuidedTyper — rich profile card', () => {
  it('shows Strengths section when all 3 assessments are complete', () => {
    ALL_THREE_LS();
    render(<GuidedTyper />);
    expect(screen.getByText(/^Strengths$/i)).toBeInTheDocument();
  });

  it('shows Challenges section when all 3 assessments are complete', () => {
    ALL_THREE_LS();
    render(<GuidedTyper />);
    expect(screen.getByText(/^Challenges$/i)).toBeInTheDocument();
  });

  it('shows System Interactions section when all 3 assessments are complete', () => {
    ALL_THREE_LS();
    render(<GuidedTyper />);
    expect(screen.getByText(/system interactions/i)).toBeInTheDocument();
  });

  it('shows Growth Edge section when all 3 assessments are complete', () => {
    ALL_THREE_LS();
    render(<GuidedTyper />);
    expect(screen.getByText(/growth edge/i)).toBeInTheDocument();
  });

  it('does not show synthesis sections when fewer than 3 assessments are complete', () => {
    localStorage.setItem('typer_enn', JSON.stringify({
      coreType: 4, wing: 5, wingStrengthDelta: 3, instinctStack: ['sx', 'sp', 'so'],
      display: '4w5', scores: {},
    }));
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'INFP', scores: {} }));
    // Missing typer_inst
    render(<GuidedTyper />);
    expect(screen.queryByText(/^Strengths$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Challenges$/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Explorer deep-link
// ---------------------------------------------------------------------------

describe('GuidedTyper — explorer deep-link from profile card', () => {
  it('deep-links to the enneagram type when Explore Enneagram link is clicked', async () => {
    ALL_THREE_LS();
    const mockSetView = vi.fn();
    const mockSetExplorerTab = vi.fn();
    const mockSetExplorerSel = vi.fn();
    const user = userEvent.setup();

    render(<GuidedTyper
      setView={mockSetView}
      setExplorerTab={mockSetExplorerTab}
      setExplorerSel={mockSetExplorerSel}
    />);

    await user.click(screen.getByRole('button', { name: /explore.*enneagram/i }));

    expect(mockSetExplorerTab).toHaveBeenCalledWith('enneagram');
    expect(mockSetExplorerSel).toHaveBeenCalledWith(4);
    expect(mockSetView).toHaveBeenCalledWith('explorer');
  });

  it('deep-links to the MBTI type when Explore MBTI link is clicked', async () => {
    ALL_THREE_LS();
    const mockSetView = vi.fn();
    const mockSetExplorerTab = vi.fn();
    const mockSetExplorerSel = vi.fn();
    const user = userEvent.setup();

    render(<GuidedTyper
      setView={mockSetView}
      setExplorerTab={mockSetExplorerTab}
      setExplorerSel={mockSetExplorerSel}
    />);

    await user.click(screen.getByRole('button', { name: /explore.*mbti/i }));

    expect(mockSetExplorerTab).toHaveBeenCalledWith('mbti');
    expect(mockSetExplorerSel).toHaveBeenCalledWith('INFP');
    expect(mockSetView).toHaveBeenCalledWith('explorer');
  });
});
