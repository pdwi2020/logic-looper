import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { getActivitiesInRange } from '@/db/operations';
import type { DailyActivity } from '@/db/schemas';
import { getYearDates } from '@/utils/dateUtils';
import {
  getIntensityLevel,
  type IntensityLevel,
} from '@/utils/intensityMapper';

export interface HeatmapCell {
  date: string;
  intensity: IntensityLevel;
  activity?: DailyActivity;
}

export interface MonthLabel {
  label: string;
  colIndex: number;
}

interface UseHeatmapDataResult {
  grid: HeatmapCell[][];
  monthLabels: MonthLabel[];
  isLoading: boolean;
}

export function useHeatmapData(year: number): UseHeatmapDataResult {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        const data = await getActivitiesInRange(start, end);

        if (isMounted) {
          setActivities(data);
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
  }, [year]);

  const { grid, monthLabels } = useMemo(() => {
    const yearDateSet = new Set(getYearDates(year));
    const activityByDate = new Map(
      activities.map((activity) => [activity.date, activity]),
    );

    const firstDateOfYear = dayjs(`${year}-01-01`);
    const lastDateOfYear = dayjs(`${year}-12-31`);

    const gridStartDate = firstDateOfYear.startOf('week');
    const gridEndDate = lastDateOfYear.endOf('week').startOf('day');

    const totalDays = gridEndDate.diff(gridStartDate, 'day') + 1;
    const weeks = Math.ceil(totalDays / 7);

    const computedGrid: HeatmapCell[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: weeks }, () => ({ date: '', intensity: 0 })),
    );

    for (let col = 0; col < weeks; col += 1) {
      for (let row = 0; row < 7; row += 1) {
        const offset = col * 7 + row;
        const date = gridStartDate.add(offset, 'day').format('YYYY-MM-DD');
        const activity = activityByDate.get(date);

        if (!yearDateSet.has(date)) {
          computedGrid[row][col] = {
            date,
            intensity: 0,
          };
          continue;
        }

        computedGrid[row][col] = activity
          ? {
              date,
              intensity: getIntensityLevel(activity),
              activity,
            }
          : {
              date,
              intensity: 0,
            };
      }
    }

    const computedMonthLabels: MonthLabel[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const monthStartDate = firstDateOfYear.month(monthIndex).startOf('month');
      const colIndex = Math.floor(
        monthStartDate.diff(gridStartDate, 'day') / 7,
      );

      computedMonthLabels.push({
        label: monthStartDate.format('MMM'),
        colIndex,
      });
    }

    return {
      grid: computedGrid,
      monthLabels: computedMonthLabels,
    };
  }, [activities, year]);

  return {
    grid,
    monthLabels,
    isLoading,
  };
}
