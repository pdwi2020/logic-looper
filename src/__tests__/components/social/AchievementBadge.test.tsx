import { render, screen } from '@testing-library/react';

import type { Achievement } from '@/db/schemas';
import { AchievementBadge } from '@/components/social/AchievementBadge';

const makeAchievement = (type: Achievement['type']): Achievement => ({
  id: `achievement-${type}`,
  label: `${type} achievement`,
  description: `${type} achievement description`,
  unlockedAt: '2026-03-06T00:00:00.000Z',
  type,
});

describe('components/social/AchievementBadge', () => {
  it('renders achievement label', () => {
    const achievement = makeAchievement('streak');

    render(<AchievementBadge achievement={achievement} isNew={false} />);

    expect(screen.getByText(achievement.label)).toBeInTheDocument();
  });

  it('renders achievement description', () => {
    const achievement = makeAchievement('streak');

    render(<AchievementBadge achievement={achievement} isNew={false} />);

    expect(screen.getByText(achievement.description)).toBeInTheDocument();
  });

  it("test with type 'streak' renders fire emoji", () => {
    render(
      <AchievementBadge
        achievement={makeAchievement('streak')}
        isNew={false}
      />,
    );

    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it("test with type 'milestone' renders star emoji", () => {
    render(
      <AchievementBadge
        achievement={makeAchievement('milestone')}
        isNew={false}
      />,
    );

    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it("test with type 'perfect' renders trophy emoji", () => {
    render(
      <AchievementBadge
        achievement={makeAchievement('perfect')}
        isNew={false}
      />,
    );

    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it("renders 'New' badge when isNew=true", () => {
    render(
      <AchievementBadge achievement={makeAchievement('streak')} isNew={true} />,
    );

    expect(screen.getByText('New')).toBeInTheDocument();
  });
});
