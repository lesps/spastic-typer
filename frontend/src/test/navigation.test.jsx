import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App.jsx';

// The BottomNav only shows tab labels when that tab is active.
// Inactive tabs show just their icon character.
// Default view is 'typer' (shows ✦ Typer label), so inactive icons are ◆ ♦ ⟷

describe('Navigation', () => {
  it('shows the Typer view by default', () => {
    render(<App />);
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('switches to Explorer view when clicking Explorer nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Explorer button shows icon '◆' when not active
    await user.click(screen.getByText('◆'));
    expect(screen.getByRole('heading', { name: 'Explorer' })).toBeInTheDocument();
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
    // Now Compare is active; Typer shows only its icon '✦'
    await user.click(screen.getByText('✦'));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('switches to Model view when clicking Model nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Model button shows icon '♦' when not active
    await user.click(screen.getByText('♦'));
    // Typer heading is gone after navigation
    expect(screen.queryByText('Guided Typer')).not.toBeInTheDocument();
  });
});
