import dayjs from 'dayjs';

import type { Achievement, DailyActivity } from '@/db/schemas';

type AchievementDefinition = Pick<
  Achievement,
  'id' | 'name' | 'description' | 'type'
>;

export const achievements: AchievementDefinition[] = [
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Solve puzzles 7 days in a row',
    type: 'streak',
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Solve puzzles 30 days in a row',
    type: 'streak',
  },
  {
    id: 'total-100',
    name: 'Century',
    description: 'Complete 100 puzzles',
    type: 'milestone',
  },
  {
    id: 'perfect-month',
    name: 'Perfect Month',
    description: 'Solve every day in a month',
    type: 'perfect',
  },
];

function hasPerfectMonth(activities: DailyActivity[]): boolean {
  const solvedDateSet = new Set(
    activities
      .filter((activity) => activity.solved)
      .map((activity) => dayjs(activity.date).format('YYYY-MM-DD')),
  );

  const solvedMonths = new Set(
    Array.from(solvedDateSet).map((dateString) =>
      dayjs(dateString).format('YYYY-MM'),
    ),
  );

  for (const month of solvedMonths) {
    const monthStart = dayjs(`${month}-01`).startOf('month');
    const daysInMonth = monthStart.daysInMonth();

    let fullMonthSolved = true;
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = monthStart.date(day).format('YYYY-MM-DD');
      if (!solvedDateSet.has(date)) {
        fullMonthSolved = false;
        break;
      }
    }

    if (fullMonthSolved) {
      return true;
    }
  }

  return false;
}

export function checkAchievements(
  currentStreak: number,
  longestStreak: number,
  totalSolved: number,
  activities: DailyActivity[],
): Achievement[] {
  const unlockedAt = dayjs().toISOString();
  const unlocked: Achievement[] = [];
  const bestStreak = Math.max(currentStreak, longestStreak);

  if (bestStreak >= 7) {
    const streakSeven = achievements.find(
      (achievement) => achievement.id === 'streak-7',
    );
    if (streakSeven) {
      unlocked.push({ ...streakSeven, unlockedAt });
    }
  }

  if (bestStreak >= 30) {
    const streakThirty = achievements.find(
      (achievement) => achievement.id === 'streak-30',
    );
    if (streakThirty) {
      unlocked.push({ ...streakThirty, unlockedAt });
    }
  }

  if (totalSolved >= 100) {
    const century = achievements.find(
      (achievement) => achievement.id === 'total-100',
    );
    if (century) {
      unlocked.push({ ...century, unlockedAt });
    }
  }

  if (hasPerfectMonth(activities)) {
    const perfectMonth = achievements.find(
      (achievement) => achievement.id === 'perfect-month',
    );
    if (perfectMonth) {
      unlocked.push({ ...perfectMonth, unlockedAt });
    }
  }

  return unlocked;
}
