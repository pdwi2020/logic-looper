import dayjs from 'dayjs';

import type { DailyActivity } from '@/db/schemas';

function getSolvedDateSet(activities: DailyActivity[]): Set<string> {
  return new Set(
    activities
      .filter((activity) => activity.solved)
      .map((activity) => dayjs(activity.date).format('YYYY-MM-DD')),
  );
}

export function calculateCurrentStreak(activities: DailyActivity[]): number {
  const solvedDates = getSolvedDateSet(activities);
  let streak = 0;
  let cursor = dayjs().startOf('day');

  while (solvedDates.has(cursor.format('YYYY-MM-DD'))) {
    streak += 1;
    cursor = cursor.subtract(1, 'day');
  }

  return streak;
}

export function calculateLongestStreak(activities: DailyActivity[]): number {
  const solvedDates = Array.from(getSolvedDateSet(activities)).sort((a, b) =>
    a.localeCompare(b),
  );

  if (solvedDates.length === 0) {
    return 0;
  }

  let currentStreak = 1;
  let longestStreak = 1;

  for (let index = 1; index < solvedDates.length; index += 1) {
    const previousDate = dayjs(solvedDates[index - 1]);
    const currentDate = dayjs(solvedDates[index]);

    if (currentDate.diff(previousDate, 'day') === 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  return longestStreak;
}

export function isStreakActive(activities: DailyActivity[]): boolean {
  const solvedDates = getSolvedDateSet(activities);
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  return solvedDates.has(today) || solvedDates.has(yesterday);
}
