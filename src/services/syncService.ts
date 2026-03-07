import { getUnsyncedActivities, markAsSynced } from '@/db/operations';

export interface SyncResult {
  synced: number;
  failed: number;
}

interface SyncEntry {
  date: string;
  score: number;
  timeTaken: number;
  difficulty?: number;
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function setupOnlineListener(callback: () => void): () => void {
  window.addEventListener('online', callback);
  return () => {
    window.removeEventListener('online', callback);
  };
}

export async function syncUnsyncedActivities(): Promise<SyncResult> {
  const unsyncedActivities = await getUnsyncedActivities();

  if (unsyncedActivities.length === 0) {
    return { synced: 0, failed: 0 };
  }

  const entries: SyncEntry[] = unsyncedActivities.map((activity) => ({
    date: activity.date,
    score: activity.score,
    timeTaken: activity.timeTaken,
    difficulty: activity.difficulty,
  }));

  try {
    const response = await fetch('/api/sync/daily-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      return {
        synced: 0,
        failed: unsyncedActivities.length,
      };
    }

    await markAsSynced(unsyncedActivities.map((activity) => activity.date));

    return {
      synced: unsyncedActivities.length,
      failed: 0,
    };
  } catch {
    return {
      synced: 0,
      failed: unsyncedActivities.length,
    };
  }
}

export function shouldSync(completedCount: number, batchSize: number): boolean {
  if (batchSize <= 0 || completedCount <= 0) {
    return false;
  }

  return completedCount % batchSize === 0;
}
