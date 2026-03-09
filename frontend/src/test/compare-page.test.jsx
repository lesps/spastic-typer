import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import ComparePage from '../views/ComparePage.jsx';

beforeEach(() => {
  // Reset URL hash so ComparePage initializes with empty persons
  window.location.hash = '';
});

describe('ComparePage — basic rendering', () => {
  it('renders the Compare heading', () => {
    render(<ComparePage />);
    expect(screen.getByRole('heading', { name: /compare/i })).toBeInTheDocument();
  });

  it('shows Person 1 and Person 2 chips by default', () => {
    render(<ComparePage />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
  });

  it('opens the editor when a person chip is clicked', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);
    await user.click(screen.getByText('Person 1'));
    expect(screen.getByText(/editing person 1/i)).toBeInTheDocument();
  });

  it('shows three tab options in the editor', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);
    await user.click(screen.getByText('Person 1'));
    expect(screen.getByRole('button', { name: 'By URL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Backup' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manual Entry' })).toBeInTheDocument();
  });

  it('closes the editor when the same chip is clicked again', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);
    await user.click(screen.getByText('Person 1'));
    expect(screen.getByText(/editing person 1/i)).toBeInTheDocument();
    await user.click(screen.getByText('Person 1'));
    expect(screen.queryByText(/editing person 1/i)).not.toBeInTheDocument();
  });
});

describe('ComparePage — tab persistence bug fix', () => {
  it('stays on Manual Entry tab after selecting an Enneagram type', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    // Open editor for Person 1
    await user.click(screen.getByText('Person 1'));

    // Switch to Manual Entry tab
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    // Verify we're on Manual Entry (Enneagram type label visible)
    expect(screen.getByText('Enneagram Type', { selector: 'label' })).toBeInTheDocument();

    // Click Enneagram type 4 — this triggers updatePerson which previously caused remount
    const typeButtons = screen.getAllByRole('button');
    const type4 = typeButtons.find(btn => btn.textContent === '4');
    expect(type4).toBeTruthy();
    await user.click(type4);

    // CRITICAL: tab must still be on Manual Entry after the state update
    expect(screen.getByText('Enneagram Type', { selector: 'label' })).toBeInTheDocument();
    // "By URL" input should not be visible (URL tab is not active)
    expect(screen.queryByPlaceholderText(/paste share url/i)).not.toBeInTheDocument();
  });

  it('persists Manual Entry tab after selecting MBTI type', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    // Click an MBTI type button (e.g., INTJ)
    await user.click(screen.getByRole('button', { name: 'INTJ' }));

    // Tab must remain on Manual Entry
    expect(screen.getByText('Enneagram Type', { selector: 'label' })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/paste share url/i)).not.toBeInTheDocument();
  });
});

describe('ComparePage — instinct stack reorder', () => {
  // Helper: returns instinct labels in DOM order (SP/SX/SO spans)
  const getInstOrder = () =>
    screen.getAllByText(/^SP$|^SX$|^SO$/).map(el => el.textContent);

  it('starts with default SP/SX/SO order', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);
    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));
    expect(getInstOrder()).toEqual(['SP', 'SX', 'SO']);
  });

  it('reorders instinct stack when down arrow is clicked', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    // Default: SP, SX, SO
    expect(getInstOrder()[0]).toBe('SP');

    // Click the ↓ button (first one belongs to the SP/first row)
    const downButtons = screen.getAllByRole('button', { name: '↓' });
    await user.click(downButtons[0]);

    // SP moved down, SX is now first
    expect(getInstOrder()[0]).toBe('SX');
  });

  it('reorders instinct stack when up arrow is clicked', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    // Default: SP, SX, SO — click ↑ on the second row (SX)
    const upButtons = screen.getAllByRole('button', { name: '↑' });
    await user.click(upButtons[0]);

    // SX moved up, now first
    expect(getInstOrder()[0]).toBe('SX');
  });

  it('can toggle the Include checkbox to exclude instinct stack', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    const includeCheckbox = screen.getByRole('checkbox');
    expect(includeCheckbox).toBeChecked();

    await user.click(includeCheckbox);
    expect(includeCheckbox).not.toBeChecked();
    expect(screen.getByText(/will not be included/i)).toBeInTheDocument();
  });
});

describe('ComparePage — manual entry save', () => {
  it('closes editor and updates person chip after clicking Done', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByText('Person 1'));
    await user.click(screen.getByRole('button', { name: 'Manual Entry' }));

    // Select Enneagram type 7
    const typeButtons = screen.getAllByRole('button');
    const type7 = typeButtons.find(btn => btn.textContent === '7');
    await user.click(type7);

    // Also select an MBTI type so the form is complete (Done requires ennType + mbti)
    await user.click(screen.getByRole('button', { name: 'INTJ' }));

    // Click Done (now enabled because ennType + mbti are set and instinct defaults are present)
    await user.click(screen.getByRole('button', { name: /done/i }));

    // Editor should be closed
    expect(screen.queryByText(/editing person 1/i)).not.toBeInTheDocument();
    // Person chip should be updated with profile data (no longer just "Person 1")
    const chipButtons = screen.getAllByRole('button');
    const p1ChipUpdated = chipButtons.some(b =>
      b.textContent?.includes('Person 1') && b.textContent.trim().length > 'Person 1'.length
    );
    expect(p1ChipUpdated).toBe(true);
  });
});

describe('ComparePage — add and remove persons', () => {
  it('adds a third person when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Person 3')).toBeInTheDocument();
  });

  it('shows a remove button when there are more than 2 persons', async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByText('Person 3'));
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });
});
