import { afterEach, describe, expect, it, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';

import { SYNC_CONFIG } from '@/config/performance';
import {
  isOnline,
  shouldSync,
  syncUnsyncedActivities,
} from '@/services/syncService';
import { syncMiddleware } from '@/store/middleware/syncMiddleware';
import {
  type ActivityState,
  puzzleCompleted,
  syncFailed,
  syncStarted,
  syncSucceeded,
} from '@/store/slices';

vi.mock('@/services/syncService', () => ({
  isOnline: vi.fn(),
  shouldSync: vi.fn(),
  syncUnsyncedActivities: vi.fn(),
}));

const mockedIsOnline = vi.mocked(isOnline);
const mockedShouldSync = vi.mocked(shouldSync);
const mockedSyncUnsyncedActivities = vi.mocked(syncUnsyncedActivities);

interface MockState {
  activity: ActivityState;
}

function buildHarness(activityOverrides: Partial<ActivityState> = {}) {
  const state: MockState = {
    activity: {
      completedCount: SYNC_CONFIG.batchSize,
      lastSyncAt: null,
      isSyncing: false,
      syncError: null,
      ...activityOverrides,
    },
  };

  const dispatch = vi.fn();
  const getState = vi.fn(() => state);
  const nextResult = Symbol('next-result');
  const next = vi.fn(() => nextResult);

  const runMiddleware = syncMiddleware({
    dispatch,
    getState,
  } as never)(next as never);

  const invoke = (action: UnknownAction) => runMiddleware(action as never);

  return {
    dispatch,
    getState,
    invoke,
    next,
    nextResult,
  };
}

async function flushAsyncWork(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('store/middleware/syncMiddleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('does nothing for non-puzzleCompleted actions', () => {
    const { dispatch, invoke, next, nextResult } = buildHarness();
    const action = { type: 'other/action' };

    const result = invoke(action);

    expect(result).toBe(nextResult);
    expect(next).toHaveBeenCalledWith(action);
    expect(dispatch).not.toHaveBeenCalled();
    expect(mockedShouldSync).not.toHaveBeenCalled();
    expect(mockedIsOnline).not.toHaveBeenCalled();
    expect(mockedSyncUnsyncedActivities).not.toHaveBeenCalled();
  });

  it('does not sync when isSyncing=true', () => {
    const { dispatch, invoke } = buildHarness({ isSyncing: true });

    invoke(puzzleCompleted());

    expect(mockedShouldSync).not.toHaveBeenCalled();
    expect(mockedIsOnline).not.toHaveBeenCalled();
    expect(mockedSyncUnsyncedActivities).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not sync when shouldSync returns false', () => {
    const { dispatch, invoke } = buildHarness({ completedCount: 3 });
    mockedShouldSync.mockReturnValue(false);

    invoke(puzzleCompleted());

    expect(mockedShouldSync).toHaveBeenCalledWith(3, SYNC_CONFIG.batchSize);
    expect(mockedIsOnline).not.toHaveBeenCalled();
    expect(mockedSyncUnsyncedActivities).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not sync when offline', () => {
    const { dispatch, invoke } = buildHarness();
    mockedShouldSync.mockReturnValue(true);
    mockedIsOnline.mockReturnValue(false);

    invoke(puzzleCompleted());

    expect(mockedShouldSync).toHaveBeenCalledWith(
      SYNC_CONFIG.batchSize,
      SYNC_CONFIG.batchSize,
    );
    expect(mockedIsOnline).toHaveBeenCalledOnce();
    expect(mockedSyncUnsyncedActivities).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches syncStarted then syncSucceeded on success', async () => {
    const { dispatch, invoke, nextResult } = buildHarness();
    mockedShouldSync.mockReturnValue(true);
    mockedIsOnline.mockReturnValue(true);
    mockedSyncUnsyncedActivities.mockResolvedValue({ synced: 2, failed: 0 });

    const result = invoke(puzzleCompleted());
    await flushAsyncWork();

    expect(result).toBe(nextResult);
    expect(dispatch).toHaveBeenNthCalledWith(1, syncStarted());
    expect(dispatch).toHaveBeenNthCalledWith(2, syncSucceeded());
  });

  it('dispatches syncStarted then syncFailed on API failure result', async () => {
    const { dispatch, invoke } = buildHarness();
    mockedShouldSync.mockReturnValue(true);
    mockedIsOnline.mockReturnValue(true);
    mockedSyncUnsyncedActivities.mockResolvedValue({ synced: 0, failed: 2 });

    invoke(puzzleCompleted());
    await flushAsyncWork();

    expect(dispatch).toHaveBeenNthCalledWith(1, syncStarted());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      syncFailed('Failed to sync 2 entries.'),
    );
  });

  it('uses singular failure message when only one entry fails', async () => {
    const { dispatch, invoke } = buildHarness();
    mockedShouldSync.mockReturnValue(true);
    mockedIsOnline.mockReturnValue(true);
    mockedSyncUnsyncedActivities.mockResolvedValue({ synced: 0, failed: 1 });

    invoke(puzzleCompleted());
    await flushAsyncWork();

    expect(dispatch).toHaveBeenNthCalledWith(1, syncStarted());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      syncFailed('Failed to sync 1 entry.'),
    );
  });

  it('dispatches syncFailed when syncUnsyncedActivities throws', async () => {
    const { dispatch, invoke } = buildHarness();
    mockedShouldSync.mockReturnValue(true);
    mockedIsOnline.mockReturnValue(true);
    mockedSyncUnsyncedActivities.mockRejectedValue(new Error('Boom'));

    invoke(puzzleCompleted());
    await flushAsyncWork();

    expect(dispatch).toHaveBeenNthCalledWith(1, syncStarted());
    expect(dispatch).toHaveBeenNthCalledWith(2, syncFailed('Boom'));
  });
});
