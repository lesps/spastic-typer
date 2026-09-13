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
    for (const label of ['Typer', 'Explorer', 'Compare', 'Stack']) {
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

  it('has exactly four tabs in order Typer, Explorer, Compare, Stack', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const tabs = Array.from(nav.querySelectorAll('button[data-view]'));
    expect(tabs).toHaveLength(4);
    expect(tabs.map(b => b.dataset.view)).toEqual(['typer', 'explorer', 'compare', 'stack']);
  });

  it('switches to Stack view and marks the tab current', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(navButton('stack'));
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
    expect(navButton('stack')).toHaveAttribute('aria-current', 'page');
    expect(window.location.hash).toBe('#/stack');
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
    await user.click(navButton('compare'));
    expect(window.location.hash).toBe('#/compare');
  });

  it('boots into the view named by the hash', () => {
    window.location.hash = '#/compare';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Compare' })).toBeInTheDocument();
    expect(navButton('compare')).toHaveAttribute('aria-current', 'page');
  });

  it('boots into Stack from #/stack and follows a hashchange to it', async () => {
    window.location.hash = '#/stack';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
    expect(navButton('stack')).toHaveAttribute('aria-current', 'page');
    await act(async () => { window.location.hash = '#/typer'; });
    await waitFor(() => expect(screen.getByText('Guided Typer')).toBeInTheDocument());
    await act(async () => { window.location.hash = '#/stack?type=INTJ'; });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: /mbti type/i })).toHaveValue('INTJ');
  });

  it('boots a retired #/model link into Explorer and canonicalizes the hash', () => {
    window.location.hash = '#/model';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Explorer', level: 1 })).toBeInTheDocument();
    expect(navButton('explorer')).toHaveAttribute('aria-current', 'page');
    expect(window.location.hash).toBe('#/explorer');
  });

  it('canonicalizes a legacy #p1= share link to #/compare?p1=', () => {
    window.location.hash = '#p1=4w5%3Astrong%3Asx%2Fsp%2Fso%3AINFP&p2=8w9%3Amoderate%3Asp%2Fso%2Fsx%3AENTJ';
    render(<App />);
    expect(window.location.hash).toMatch(/^#\/compare\?p1=/);
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

  it('scrolls to the top when switching to Stack', async () => {
    const user = userEvent.setup();
    render(<App />);
    window.scrollTo.mockClear();
    await user.click(navButton('stack'));
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
