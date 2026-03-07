import type { Middleware } from '@reduxjs/toolkit';

import { SYNC_CONFIG } from '@/config/performance';
import {
  isOnline,
  shouldSync,
  syncUnsyncedActivities,
} from '@/services/syncService';
import {
  type ActivityState,
  puzzleCompleted,
  syncFailed,
  syncStarted,
  syncSucceeded,
} from '@/store/slices';

interface SyncStateShape {
  activity: ActivityState;
}

export const syncMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (!puzzleCompleted.match(action)) {
    return result;
  }

  const { completedCount, isSyncing } = (storeApi.getState() as SyncStateShape)
    .activity;
  const canSyncNow =
    !isSyncing &&
    shouldSync(completedCount, SYNC_CONFIG.batchSize) &&
    isOnline();

  if (!canSyncNow) {
    return result;
  }

  void (async () => {
    storeApi.dispatch(syncStarted());

    const syncResult = await syncUnsyncedActivities();
    if (syncResult.failed > 0) {
      const suffix = syncResult.failed === 1 ? 'entry' : 'entries';
      storeApi.dispatch(
        syncFailed(`Failed to sync ${syncResult.failed} ${suffix}.`),
      );
      return;
    }

    storeApi.dispatch(syncSucceeded());
  })().catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unexpected sync error.';
    storeApi.dispatch(syncFailed(message));
  });

  return result;
};
