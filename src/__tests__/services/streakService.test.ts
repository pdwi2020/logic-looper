import dayjs from 'dayjs';

import type { DailyActivity } from '@/db/schemas';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  isStreakActive,
} from '@/services/streakService';

const makeActivity = (date: string, solved = true): DailyActivity => ({
  date,
  solved,
  score: 80,
  timeTaken: 240,
  difficulty: 2,
  synced: false,
});

describe('services/streakService', () => {
  it('calculateCurrentStreak returns 0 when no activities', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('calculateCurrentStreak counts consecutive days from today', () => {
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const twoDaysAgo = dayjs().subtract(2, 'day').format('YYYY-MM-DD');

    const activities = [
      makeActivity(twoDaysAgo),
      makeActivity(today),
      makeActivity(yesterday),
    ];

    expect(calculateCurrentStreak(activities)).toBe(3);
  });

  it('streak breaks on gap day', () => {
    const today = dayjs().format('YYYY-MM-DD');
    const twoDaysAgo = dayjs().subtract(2, 'day').format('YYYY-MM-DD');

    const activities = [makeActivity(today), makeActivity(twoDaysAgo)];

    expect(calculateCurrentStreak(activities)).toBe(1);
  });

  it('calculateLongestStreak finds longest run', () => {
    const activities = [
      makeActivity('2026-01-01'),
      makeActivity('2026-01-02'),
      makeActivity('2026-01-03'),
      makeActivity('2026-01-06'),
      makeActivity('2026-01-07'),
      makeActivity('2026-01-10', false),
      makeActivity('2026-01-08'),
      makeActivity('2026-01-09'),
    ];

    expect(calculateLongestStreak(activities)).toBe(4);
  });

  it('isStreakActive returns true if solved today', () => {
    const today = dayjs().format('YYYY-MM-DD');

    expect(isStreakActive([makeActivity(today)])).toBe(true);
  });

  it('isStreakActive returns true if solved yesterday', () => {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    expect(isStreakActive([makeActivity(yesterday)])).toBe(true);
  });

  it('isStreakActive returns false if last solve was 2+ days ago', () => {
    const twoDaysAgo = dayjs().subtract(2, 'day').format('YYYY-MM-DD');

    expect(isStreakActive([makeActivity(twoDaysAgo)])).toBe(false);
  });

  it('single day streak', () => {
    const today = dayjs().format('YYYY-MM-DD');
    const activities = [makeActivity(today)];

    expect(calculateCurrentStreak(activities)).toBe(1);
    expect(calculateLongestStreak(activities)).toBe(1);
  });
});
