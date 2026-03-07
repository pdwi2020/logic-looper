import { configureStore } from '@reduxjs/toolkit';

import { syncMiddleware } from '@/store/middleware/syncMiddleware';
import { activityReducer } from '@/store/slices';

export const store = configureStore({
  reducer: {
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
