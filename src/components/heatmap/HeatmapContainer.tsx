import { useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useHeatmapData } from '@/hooks/useHeatmapData';
import { useStreak } from '@/hooks/useStreak';
import { HeatmapGrid } from './HeatmapGrid';
import { HeatmapLegend } from './HeatmapLegend';
import {
  type DailyActivity,
  HeatmapTooltip,
  type TooltipPosition,
} from './HeatmapTooltip';
import { StreakDisplay } from './StreakDisplay';
import { YearDropdown } from './YearDropdown';

interface TooltipState {
  date: string;
  activity: DailyActivity | undefined;
  position: TooltipPosition | null;
  visible: boolean;
}

const initialTooltipState: TooltipState = {
  date: '',
  activity: undefined,
  position: null,
  visible: false,
};

export function HeatmapContainer() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const {
    grid,
    monthLabels,
    isLoading: isHeatmapLoading,
  } = useHeatmapData(selectedYear);

  const {
    currentStreak,
    longestStreak,
    isOnFire,
    isLoading: isStreakLoading,
  } = useStreak();

  const [tooltip, setTooltip] = useState<TooltipState>(initialTooltipState);

  const activityByDate = useMemo(() => {
    const dateMap = new Map<string, DailyActivity>();

    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.activity) {
          dateMap.set(cell.date, cell.activity);
        }
      });
    });

    return dateMap;
  }, [grid]);

  const handleCellHover = useCallback(
    (date: string, rect: DOMRect) => {
      const activity = activityByDate.get(date);
      const x = rect.left + rect.width / 2 + window.scrollX;
      const y = rect.top + window.scrollY;

      setTooltip({
        date,
        activity,
        position: { x, y },
        visible: true,
      });
    },
    [activityByDate],
  );

  const handleCellLeave = useCallback(() => {
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setTooltip(initialTooltipState);
  }, []);

  const isLoading = isHeatmapLoading || isStreakLoading;

  return (
    <>
      <Card title="Activity" variant="default" className="w-full">
        <div className="mt-2 space-y-4">
          <div className="flex justify-end">
            <YearDropdown
              selectedYear={selectedYear}
              onChange={handleYearChange}
            />
          </div>

          {isLoading ? (
            <div className="mt-4 space-y-3 animate-shimmer">
              <div className="h-5 w-36 rounded bg-brand-light-blue/40" />
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 52 }).map((_, i) => (
                  <div key={i} className="h-3 rounded-sm bg-brand-light-blue/30" />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-16 rounded bg-brand-light-blue/20" />
                <div className="h-4 w-20 rounded bg-brand-light-blue/20" />
              </div>
            </div>
          ) : (
            <>
              <StreakDisplay
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                isOnFire={isOnFire}
              />

              <HeatmapGrid
                grid={grid}
                monthLabels={monthLabels}
                onCellHover={handleCellHover}
                onCellLeave={handleCellLeave}
              />

              <HeatmapLegend />
            </>
          )}
        </div>
      </Card>

      <HeatmapTooltip
        date={tooltip.date}
        activity={tooltip.activity}
        position={tooltip.position}
        visible={tooltip.visible}
      />
    </>
  );
}
