import reducer, {
  puzzleCompleted,
  resetSyncError,
  syncFailed,
  syncStarted,
  syncSucceeded,
} from '@/store/slices/activitySlice';

describe('store/slices/activitySlice', () => {
  const initialState = {
    completedCount: 0,
    lastSyncAt: null,
    isSyncing: false,
    syncError: null,
  };

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('puzzleCompleted increments completedCount by 1', () => {
    const state = reducer(undefined, puzzleCompleted());

    expect(state.completedCount).toBe(1);
    expect(state.lastSyncAt).toBeNull();
    expect(state.isSyncing).toBe(false);
    expect(state.syncError).toBeNull();
  });

  it('multiple puzzleCompleted dispatches increment correctly', () => {
    let state = reducer(undefined, puzzleCompleted());
    state = reducer(state, puzzleCompleted());
    state = reducer(state, puzzleCompleted());

    expect(state.completedCount).toBe(3);
  });

  it('syncStarted sets isSyncing=true and clears syncError', () => {
    const withError = {
      ...initialState,
      syncError: 'previous error',
    };

    const state = reducer(withError, syncStarted());

    expect(state.isSyncing).toBe(true);
    expect(state.syncError).toBeNull();
  });

  it('syncSucceeded sets isSyncing=false, sets lastSyncAt, and clears syncError', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:34:56.000Z'));

    const syncingState = {
      ...initialState,
      isSyncing: true,
      syncError: 'previous error',
    };

    const state = reducer(syncingState, syncSucceeded());

    expect(state.isSyncing).toBe(false);
    expect(state.lastSyncAt).toBe('2026-03-06T12:34:56.000Z');
    expect(state.syncError).toBeNull();

    vi.useRealTimers();
  });

  it('syncFailed sets isSyncing=false and sets syncError to payload', () => {
    const syncingState = {
      ...initialState,
      isSyncing: true,
    };

    const state = reducer(syncingState, syncFailed('error msg'));

    expect(state.isSyncing).toBe(false);
    expect(state.syncError).toBe('error msg');
  });

  it("resetSyncError clears syncError and doesn't affect other state", () => {
    const stateWithError = {
      completedCount: 2,
      lastSyncAt: '2026-03-05T11:22:33.000Z',
      isSyncing: false,
      syncError: 'network failed',
    };

    const state = reducer(stateWithError, resetSyncError());

    expect(state).toEqual({
      completedCount: 2,
      lastSyncAt: '2026-03-05T11:22:33.000Z',
      isSyncing: false,
      syncError: null,
    });
  });
});
