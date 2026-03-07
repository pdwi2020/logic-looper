import type { DailyActivity } from '@/db/schemas';
import { checkAchievements } from '@/services/achievementService';

function makeActivity(
  date: string,
  overrides: Partial<DailyActivity> = {},
): DailyActivity {
  return {
    date,
    solved: true,
    score: 100,
    timeTaken: 180,
    difficulty: 2,
    synced: false,
    ...overrides,
  };
}

function makeSolvedMonthActivities(
  year: number,
  month: number,
  dayCount: number,
): DailyActivity[] {
  return Array.from({ length: dayCount }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    const monthString = String(month).padStart(2, '0');
    return makeActivity(`${year}-${monthString}-${day}`);
  });
}

function expectISOUnlockedAt(achievement: { unlockedAt: string | null }): void {
  expect(typeof achievement.unlockedAt).toBe('string');
  expect(Number.isNaN(Date.parse(achievement.unlockedAt ?? ''))).toBe(false);
}

describe('services/achievementService', () => {
  it('checkAchievements(7, 7, 7, []) unlocks streak-7', () => {
    const unlocked = checkAchievements(7, 7, 7, []);

    expect(unlocked).toHaveLength(1);
    expect(unlocked[0]).toMatchObject({
      id: 'streak-7',
      name: '7-Day Streak',
      type: 'streak',
    });
    expectISOUnlockedAt(unlocked[0]);
  });

  it('checkAchievements(30, 30, 30, []) unlocks streak-7 and streak-30', () => {
    const unlocked = checkAchievements(30, 30, 30, []);
    const unlockedIds = unlocked.map((achievement) => achievement.id).sort();

    expect(unlocked).toHaveLength(2);
    expect(unlockedIds).toEqual(['streak-30', 'streak-7']);
    unlocked.forEach(expectISOUnlockedAt);
  });

  it('checkAchievements(0, 0, 100, []) unlocks total-100', () => {
    const unlocked = checkAchievements(0, 0, 100, []);

    expect(unlocked).toHaveLength(1);
    expect(unlocked[0].id).toBe('total-100');
    expectISOUnlockedAt(unlocked[0]);
  });

  it('checkAchievements(0, 0, 0, []) returns no achievements', () => {
    const unlocked = checkAchievements(0, 0, 0, []);

    expect(unlocked).toEqual([]);
  });

  it('perfect month unlocks perfect-month for fully solved Feb 2025', () => {
    const activities = makeSolvedMonthActivities(2025, 2, 28);
    const unlocked = checkAchievements(0, 0, 28, activities);
    const perfectMonth = unlocked.find(
      (achievement) => achievement.id === 'perfect-month',
    );

    expect(perfectMonth).toBeDefined();
    expect(unlocked).toHaveLength(1);
    if (perfectMonth) {
      expectISOUnlockedAt(perfectMonth);
    }
  });
});
