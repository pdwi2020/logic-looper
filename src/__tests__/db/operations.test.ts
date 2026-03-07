import {
  getAchievements,
  getActivitiesInRange,
  getActivity,
  getAllActivities,
  getUnsyncedActivities,
  markAsSynced,
  saveAchievement,
  saveActivity,
} from '@/db/operations';
import type { Achievement, DailyActivity } from '@/db/schemas';

const createMockActivity = (
  overrides: Partial<DailyActivity> = {},
): DailyActivity => ({
  date: '2026-03-06',
  solved: true,
  score: 88,
  timeTaken: 300,
  difficulty: 2,
  synced: false,
  ...overrides,
});

const createMockAchievement = (
  overrides: Partial<Achievement> = {},
): Achievement => ({
  id: 'streak-7',
  name: '7 Day Streak',
  description: 'Complete one puzzle for seven consecutive days.',
  unlockedAt: '2026-03-06T09:00:00.000Z',
  type: 'streak',
  ...overrides,
});

async function clearDatabase(): Promise<void> {
  const { initDB } = await import('@/db/indexedDB');
  const db = await initDB();
  const tx = db.transaction(['dailyActivity', 'achievements'], 'readwrite');
  await tx.objectStore('dailyActivity').clear();
  await tx.objectStore('achievements').clear();
  await tx.done;
}

describe('db/operations', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('saveActivity and getActivity round-trip', async () => {
    const activity = createMockActivity({
      date: '2026-03-01',
      score: 95,
      synced: false,
    });

    await saveActivity(activity);
    const stored = await getActivity('2026-03-01');

    expect(stored).toEqual(activity);
  });

  it('getActivitiesInRange returns correct subset', async () => {
    const activities = [
      createMockActivity({ date: '2026-03-01', score: 10 }),
      createMockActivity({ date: '2026-03-02', score: 20 }),
      createMockActivity({ date: '2026-03-03', score: 30 }),
      createMockActivity({ date: '2026-03-04', score: 40 }),
      createMockActivity({ date: '2026-03-05', score: 50 }),
    ];

    await Promise.all(activities.map(saveActivity));

    const inRange = await getActivitiesInRange('2026-03-02', '2026-03-04');

    expect(inRange).toHaveLength(3);
    expect(inRange.map((item) => item.date)).toEqual([
      '2026-03-02',
      '2026-03-03',
      '2026-03-04',
    ]);
  });

  it('getActivitiesInRange returns empty array when startDate is after endDate', async () => {
    await saveActivity(createMockActivity({ date: '2026-03-03', score: 30 }));

    const inRange = await getActivitiesInRange('2026-03-05', '2026-03-01');

    expect(inRange).toEqual([]);
  });

  it('getUnsyncedActivities filters correctly', async () => {
    await saveActivity(
      createMockActivity({ date: '2026-03-01', synced: false }),
    );
    await saveActivity(
      createMockActivity({ date: '2026-03-02', synced: true }),
    );
    await saveActivity(
      createMockActivity({ date: '2026-03-03', synced: false }),
    );

    const unsynced = await getUnsyncedActivities();

    expect(unsynced).toHaveLength(2);
    expect(unsynced.map((item) => item.date).sort()).toEqual([
      '2026-03-01',
      '2026-03-03',
    ]);
    expect(unsynced.every((item) => item.synced === false)).toBe(true);
  });

  it('markAsSynced updates synced flag', async () => {
    await saveActivity(
      createMockActivity({ date: '2026-03-01', synced: false }),
    );
    await saveActivity(
      createMockActivity({ date: '2026-03-02', synced: false }),
    );
    await saveActivity(
      createMockActivity({ date: '2026-03-03', synced: true }),
    );

    await markAsSynced(['2026-03-01', '2026-03-03', '2026-03-99']);

    const activity1 = await getActivity('2026-03-01');
    const activity2 = await getActivity('2026-03-02');
    const activity3 = await getActivity('2026-03-03');

    expect(activity1?.synced).toBe(true);
    expect(activity2?.synced).toBe(false);
    expect(activity3?.synced).toBe(true);
  });

  it('getAllActivities returns all records', async () => {
    const activity1 = createMockActivity({ date: '2026-03-05', score: 5 });
    const activity2 = createMockActivity({ date: '2026-03-02', score: 2 });
    const activity3 = createMockActivity({ date: '2026-03-04', score: 4 });

    await saveActivity(activity1);
    await saveActivity(activity2);
    await saveActivity(activity3);

    const all = await getAllActivities();

    expect(all).toHaveLength(3);
    expect(all.map((item) => item.date)).toEqual([
      '2026-03-02',
      '2026-03-04',
      '2026-03-05',
    ]);
  });

  it('getActivity for non-existent date returns undefined', async () => {
    const activity = await getActivity('1999-12-31');
    expect(activity).toBeUndefined();
  });

  it('empty database returns empty arrays', async () => {
    const inRange = await getActivitiesInRange('2026-01-01', '2026-12-31');
    const unsynced = await getUnsyncedActivities();
    const all = await getAllActivities();

    expect(inRange).toEqual([]);
    expect(unsynced).toEqual([]);
    expect(all).toEqual([]);
  });

  it('saveAchievement and getAchievements round-trip', async () => {
    const firstAchievement = createMockAchievement();
    const secondAchievement = createMockAchievement({
      id: 'milestone-50',
      name: 'Fifty Solved',
      description: 'Solve fifty puzzles total.',
      unlockedAt: null,
      type: 'milestone',
    });

    await saveAchievement(firstAchievement);
    await saveAchievement(secondAchievement);

    const achievements = await getAchievements();

    expect(achievements).toHaveLength(2);
    expect(achievements).toEqual(
      expect.arrayContaining([firstAchievement, secondAchievement]),
    );
  });
});
