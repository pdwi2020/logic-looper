import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Home from '@/pages/Home';

vi.mock('@/components/puzzle/PuzzleContainer', () => ({
  default: undefined,
  PuzzleContainer: () => <div>Mock Puzzle Container</div>,
}));

describe('pages/Home', () => {
  it("renders heading with 'Daily Puzzle' or 'Logic Game' text", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Daily Puzzle|Logic Game/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders 'Play Today' link/button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('button', { name: 'Play Today' }),
    ).toBeInTheDocument();
  });

  it("clicking 'Play Today' navigates to /puzzle", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/');

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Play Today' }));

    expect(window.location.pathname).toBe('/puzzle');
  });

  it('renders all three core feature cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Core Features' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Daily Puzzles' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Streak Tracking' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Compete' }),
    ).toBeInTheDocument();
  });

  it('toggles the puzzle preview section', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    const loadPreviewButton = screen.getByRole('button', {
      name: 'Load Puzzle Preview',
    });
    expect(loadPreviewButton).toBeInTheDocument();
    expect(screen.queryByText('Mock Puzzle Container')).not.toBeInTheDocument();

    await user.click(loadPreviewButton);

    expect(
      await screen.findByRole('button', { name: 'Hide Puzzle Preview' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Mock Puzzle Container'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Hide Puzzle Preview' }),
    );

    expect(
      screen.getByRole('button', { name: 'Load Puzzle Preview' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Mock Puzzle Container')).not.toBeInTheDocument();
  });
});
