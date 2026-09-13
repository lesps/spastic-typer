import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App.jsx';

const navButton = (name) => screen.getByRole('navigation', { name: /primary/i })
  .querySelector(`button[data-view="${name}"]`);

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
  window.scrollTo.mockClear();
});

describe('Navigation — tabs', () => {
  it('shows the Typer view by default', () => {
    render(<App />);
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });

  it('renders a primary navigation landmark with a visible label on every tab', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /primary/i });
    for (const label of ['Typer', 'Explorer', 'Model', 'Compare']) {
      const btn = Array.from(nav.querySelectorAll('button')).find(b => b.textContent.trim() === label);
      expect(btn, `nav button "${label}"`).toBeTruthy();
      expect(btn).toBeVisible();
    }
  });

  it('marks the active tab with aria-current', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(navButton('typer')).toHaveAttribute('aria-current', 'page');
    expect(navButton('explorer')).not.toHaveAttribute('aria-current');
    await user.click(navButton('explorer'));
    expect(navButton('explorer')).toHaveAttribute('aria-current', 'page');
    expect(navButton('typer')).not.toHaveAttribute('aria-current');
  });

  it('switches to Explorer view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('explorer'));
    expect(screen.getByRole('heading', { name: 'Explorer', level: 1 })).toBeInTheDocument();
  });

  it('switches to Compare view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('compare'));
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
  });

  it('switches to Model view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('model'));
    expect(screen.getByRole('heading', { name: 'Mental Model' })).toBeInTheDocument();
  });

  it('switches back to Typer from Compare', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('compare'));
    await user.click(navButton('typer'));
    expect(screen.getByText('Guided Typer')).toBeInTheDocument();
  });
});

describe('Navigation — URL hash routing', () => {
  it('writes the view into the hash when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('model'));
    expect(window.location.hash).toBe('#/model');
  });

  it('boots into the view named by the hash', () => {
    window.location.hash = '#/compare';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
    expect(navButton('compare')).toHaveAttribute('aria-current', 'page');
  });

  it('boots a legacy #p1=…&p2=… share link straight into Compare with the people loaded', () => {
    window.location.hash = '#p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3Amoderate%3Asp%2Fso%2Fsx%3AENTJ';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
    expect(screen.getByText(/pairwise analysis/i)).toBeInTheDocument();
  });

  it('boots a #/compare?p1=… share link into Compare with the people loaded', () => {
    window.location.hash = '#/compare?p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3Amoderate%3Asp%2Fso%2Fsx%3AENTJ';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
    expect(screen.getByText(/pairwise analysis/i)).toBeInTheDocument();
  });

  it('follows external hash changes (browser back/forward)', async () => {
    render(<App />);
    await act(async () => { window.location.hash = '#/explorer'; });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Explorer', level: 1 })).toBeInTheDocument());
    await act(async () => { window.location.hash = '#/typer'; });
    await waitFor(() => expect(screen.getByText('Guided Typer')).toBeInTheDocument());
  });
});

describe('Navigation — scroll reset', () => {
  it('scrolls to the top when the view changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    window.scrollTo.mockClear();
    await user.click(navButton('explorer'));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to the top when a detail page opens inside Explorer', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('explorer'));
    window.scrollTo.mockClear();
    await user.click(screen.getByRole('button', { name: /The Individualist/ }));
    expect(screen.getByRole('heading', { name: 'Type 4' })).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
