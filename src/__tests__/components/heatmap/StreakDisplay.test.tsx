import { render, screen } from '@testing-library/react';

import { StreakDisplay } from '@/components/heatmap/StreakDisplay';

describe('components/heatmap/StreakDisplay', () => {
  it('renders currentStreak number in the DOM', () => {
    render(<StreakDisplay currentStreak={7} longestStreak={30} isOnFire />);

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders longestStreak number in the DOM', () => {
    render(
      <StreakDisplay currentStreak={4} longestStreak={22} isOnFire={false} />,
    );

    expect(screen.getByText('22')).toBeInTheDocument();
  });

  it("renders 'Current Streak' label", () => {
    render(
      <StreakDisplay currentStreak={3} longestStreak={10} isOnFire={false} />,
    );

    expect(screen.getByText('Current Streak')).toBeInTheDocument();
  });

  it("renders 'Longest Streak' label", () => {
    render(
      <StreakDisplay currentStreak={3} longestStreak={10} isOnFire={false} />,
    );

    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
  });

  it('shows milestone badge text when currentStreak is 7', () => {
    render(<StreakDisplay currentStreak={7} longestStreak={15} isOnFire />);

    expect(screen.getByText('7-day milestone reached')).toBeInTheDocument();
  });

  it('does not show milestone badge when currentStreak is 5', () => {
    render(
      <StreakDisplay currentStreak={5} longestStreak={15} isOnFire={false} />,
    );

    expect(screen.queryByText(/milestone reached/i)).not.toBeInTheDocument();
  });
});
