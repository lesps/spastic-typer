import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import StackView from '../views/StackView.jsx';

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
  window.scrollTo.mockClear();
});

const typeSelect = () => screen.getByRole('combobox', { name: /mbti type/i });

describe('StackView — shell and type selection', () => {
  it('renders the Stack heading and the type selector defaulting to positions only', () => {
    render(<StackView />);
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
    expect(typeSelect()).toHaveValue('');
    expect(within(typeSelect()).getByRole('option', { name: /positions only/i })).toBeInTheDocument();
    expect(within(typeSelect()).getAllByRole('option')).toHaveLength(17);
  });

  it('defaults to the saved typer_mbti result', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    render(<StackView />);
    expect(typeSelect()).toHaveValue('ENFP');
  });

  it('degrades to positions only on malformed storage without throwing', () => {
    localStorage.setItem('typer_mbti', '{not json');
    localStorage.setItem('typer_enn', '[1,2');
    expect(() => render(<StackView />)).not.toThrow();
    expect(typeSelect()).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Stack', level: 1 })).toBeInTheDocument();
  });

  it('honours a #/stack?type= deep link over the saved result', () => {
    localStorage.setItem('typer_mbti', JSON.stringify({ result: 'ENFP', scores: {} }));
    window.location.hash = '#/stack?type=INTJ';
    render(<StackView />);
    expect(typeSelect()).toHaveValue('INTJ');
  });

  it('ignores an invalid deep-link type', () => {
    window.location.hash = '#/stack?type=ZZZZ';
    render(<StackView />);
    expect(typeSelect()).toHaveValue('');
  });

  it('lets the user change type and switch back to positions only', () => {
    render(<StackView />);
    fireEvent.change(typeSelect(), { target: { value: 'ISTJ' } });
    expect(typeSelect()).toHaveValue('ISTJ');
    fireEvent.change(typeSelect(), { target: { value: '' } });
    expect(typeSelect()).toHaveValue('');
  });

  it('scrolls to the top on mount', () => {
    render(<StackView />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
