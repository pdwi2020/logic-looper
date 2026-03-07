import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Header } from '@/components/layout/Header';

describe('components/layout/Header', () => {
  it("renders 'Logic Looper' text", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    expect(screen.getByText('Logic Looper')).toBeInTheDocument();
  });

  it('renders Home, Profile, Leaderboard nav links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Leaderboard' }),
    ).toBeInTheDocument();
  });

  it('toggles the mobile menu and closes it when a mobile nav link is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const openMenuButton = screen.getByRole('button', {
      name: 'Open navigation menu',
    });
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('link', { name: 'Profile' })).toHaveLength(1);

    await user.click(openMenuButton);

    const closeMenuButton = screen.getByRole('button', {
      name: 'Close navigation menu',
    });
    expect(closeMenuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('link', { name: 'Profile' })).toHaveLength(2);

    const mobileProfileLink = screen.getAllByRole('link', {
      name: 'Profile',
    })[1];
    await user.click(mobileProfileLink);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Open navigation menu' }),
      ).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getAllByRole('link', { name: 'Profile' })).toHaveLength(1);
    });
  });
});
