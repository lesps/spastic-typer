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
