import { describe, expect, it } from 'vitest';

import {
  activityReducer,
  puzzleCompleted as puzzleCompletedFromBarrel,
} from '@/store/slices';
import activitySliceReducer, {
  puzzleCompleted as puzzleCompletedFromSlice,
} from '@/store/slices/activitySlice';

describe('store/slices/index', () => {
  it('re-exports the activity reducer and action creators', () => {
    expect(activityReducer).toBe(activitySliceReducer);
    expect(puzzleCompletedFromBarrel).toBe(puzzleCompletedFromSlice);
  });

  it('supports dispatching puzzleCompleted via the barrel export', () => {
    const state = activityReducer(undefined, puzzleCompletedFromBarrel());

    expect(state.completedCount).toBe(1);
  });
});
