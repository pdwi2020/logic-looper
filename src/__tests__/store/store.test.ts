import { puzzleCompleted, syncFailed } from '@/store/slices/activitySlice';

describe('store/store', () => {
  const initialActivityState = {
    completedCount: 0,
    lastSyncAt: null,
    isSyncing: false,
    syncError: null,
  };

  const loadFreshStore = async () => {
    vi.resetModules();
    return import('@/store/store');
  };

  it('store initializes with activity slice in correct default state', async () => {
    const { store } = await loadFreshStore();

    expect(store.getState()).toHaveProperty('activity');
    expect(store.getState().activity).toEqual(initialActivityState);
  });

  it('store.getState().activity matches initial state', async () => {
    const { store } = await loadFreshStore();

    expect(store.getState().activity).toEqual(initialActivityState);
  });

  it('dispatching puzzleCompleted updates store state', async () => {
    const { store } = await loadFreshStore();

    store.dispatch(puzzleCompleted());

    expect(store.getState().activity.completedCount).toBe(1);
  });

  it("dispatching syncFailed('error msg') updates syncError in store", async () => {
    const { store } = await loadFreshStore();

    store.dispatch(syncFailed('error msg'));

    expect(store.getState().activity.syncError).toBe('error msg');
  });
});
