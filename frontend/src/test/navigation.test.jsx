import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import BottomNav from '../components/BottomNav.jsx';
import App from '../App.jsx';

// The BottomNav only shows tab labels when that tab is active.
// Inactive tabs show just their icon character.
// Default view is 'typer' (shows ✏ Typer label), so inactive icons are ◎ ⊕ ⟷

describe('Navigation', () => {
  it('shows the Typer view by default', () => {
    render(<App />);
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('switches to Explorer view when clicking Explorer nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Explorer button shows icon '◎' when not active
    await user.click(screen.getByText('◎'));
    expect(screen.getByText('Explorer', { selector: 'h1' })).toBeInTheDocument();
  });

  it('switches to Compare view when clicking Compare nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Compare button shows icon '⟷' when not active
    await user.click(screen.getByText('⟷'));
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
  });

  it('switches back to Typer view from Compare', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('⟷'));
    // Now Compare is active; Typer shows only its icon '✏'
    await user.click(screen.getByText('✏'));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('switches to Model view when clicking Model nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Model button shows icon '⊕' when not active
    await user.click(screen.getByText('⊕'));
    // Typer heading is gone after navigation
    expect(screen.queryByText('Guided Typer')).not.toBeInTheDocument();
  });
});

describe('Progress bar navigation', () => {
  it('clicking the progress bar navigates to the typer view', async () => {
    const user = userEvent.setup();
    const setView = vi.fn();
    render(<BottomNav view="compare" setView={setView} quizProgress={{ current: 3, total: 10 }} />);
    const btn = screen.getByRole('button', { name: /return to active quiz/i });
    await user.click(btn);
    expect(setView).toHaveBeenCalledWith('typer');
  });
});
