import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ActivityState {
  completedCount: number;
  lastSyncAt: string | null;
  isSyncing: boolean;
  syncError: string | null;
}

const initialState: ActivityState = {
  completedCount: 0,
  lastSyncAt: null,
  isSyncing: false,
  syncError: null,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    puzzleCompleted(state) {
      state.completedCount += 1;
    },
    syncStarted(state) {
      state.isSyncing = true;
      state.syncError = null;
    },
    syncSucceeded(state) {
      state.isSyncing = false;
      state.lastSyncAt = new Date().toISOString();
      state.syncError = null;
    },
    syncFailed(state, action: PayloadAction<string>) {
      state.isSyncing = false;
      state.syncError = action.payload;
    },
    resetSyncError(state) {
      state.syncError = null;
    },
  },
});

export const {
  puzzleCompleted,
  syncStarted,
  syncSucceeded,
  syncFailed,
  resetSyncError,
} = activitySlice.actions;

export default activitySlice.reducer;
