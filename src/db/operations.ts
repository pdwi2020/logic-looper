import { initDB } from '@/db/indexedDB';
import type { Achievement, DailyActivity } from '@/db/schemas';

export async function saveActivity(activity: DailyActivity): Promise<void> {
  const db = await initDB();
  await db.put('dailyActivity', activity);
}

export async function getActivity(
  date: string,
): Promise<DailyActivity | undefined> {
  const db = await initDB();
  return db.get('dailyActivity', date);
}

export async function getActivitiesInRange(
  startDate: string,
  endDate: string,
): Promise<DailyActivity[]> {
  if (startDate > endDate) {
    return [];
  }

  const db = await initDB();
  return db.getAll('dailyActivity', IDBKeyRange.bound(startDate, endDate));
}

export async function getUnsyncedActivities(): Promise<DailyActivity[]> {
  const db = await initDB();
  const activities = await db.getAll('dailyActivity');
  return activities.filter((activity) => !activity.synced);
}

export async function markAsSynced(dates: string[]): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('dailyActivity', 'readwrite');

  for (const date of dates) {
    const activity = await tx.store.get(date);
    if (activity && !activity.synced) {
      await tx.store.put({
        ...activity,
        synced: true,
      });
    }
  }

  await tx.done;
}

export async function getAllActivities(): Promise<DailyActivity[]> {
  const db = await initDB();
  const activities = await db.getAll('dailyActivity');
  return activities.sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveAchievement(achievement: Achievement): Promise<void> {
  const db = await initDB();
  await db.put('achievements', achievement);
}

export async function getAchievements(): Promise<Achievement[]> {
  const db = await initDB();
  return db.getAll('achievements');
}
