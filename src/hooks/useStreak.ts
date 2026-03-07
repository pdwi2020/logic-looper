import { useEffect, useMemo, useState } from 'react';

import { getAllActivities } from '@/db/operations';
import type { DailyActivity } from '@/db/schemas';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
} from '@/services/streakService';

interface UseStreakResult {
  currentStreak: number;
  longestStreak: number;
  isOnFire: boolean;
  isLoading: boolean;
}

export function useStreak(): UseStreakResult {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const allActivities = await getAllActivities();

        if (isMounted) {
          setActivities(allActivities);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  const { currentStreak, longestStreak } = useMemo(
    () => ({
      currentStreak: calculateCurrentStreak(activities),
      longestStreak: calculateLongestStreak(activities),
    }),
    [activities],
  );

  return {
    currentStreak,
    longestStreak,
    isOnFire: currentStreak >= 3,
    isLoading,
  };
}
