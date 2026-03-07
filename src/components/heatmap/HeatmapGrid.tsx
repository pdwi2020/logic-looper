import { useMemo } from 'react';
import type { IntensityLevel } from './HeatmapCell';
import { HeatmapColumn } from './HeatmapColumn';
import type { HeatmapCellData } from './HeatmapCell';

export interface MonthLabel {
  label: string;
  colIndex: number;
}

export interface HeatmapGridProps {
  grid: HeatmapCellData[][];
  monthLabels: MonthLabel[];
  onCellHover: (date: string, rect: DOMRect) => void;
  onCellLeave: () => void;
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const visibleDayLabels = new Set(['Mon', 'Wed', 'Fri']);
const columnStepPx = 16;

const createFallbackCell = (
  weekIndex: number,
  dayIndex: number,
): HeatmapCellData => ({
  date: `fallback-${weekIndex}-${dayIndex}`,
  intensity: 0 as IntensityLevel,
});

export function HeatmapGrid({
  grid,
  monthLabels,
  onCellHover,
  onCellLeave,
}: HeatmapGridProps) {
  const columnCount = useMemo(
    () => grid.reduce((max, row) => Math.max(max, row.length), 0),
    [grid],
  );

  const columns = useMemo(
    () =>
      Array.from({ length: columnCount }, (_, weekIndex) =>
        dayLabels.map(
          (_, dayIndex) =>
            grid[dayIndex]?.[weekIndex] ??
            createFallbackCell(weekIndex, dayIndex),
        ),
      ),
    [columnCount, grid],
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-max flex-col gap-2">
          <div className="relative ml-8 h-5">
            {monthLabels.map((month) => (
              <span
                key={`${month.label}-${month.colIndex}`}
                className="absolute text-[10px] font-sans font-medium text-brand-dark-gray"
                style={{ left: `${month.colIndex * columnStepPx}px` }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex h-[108px] flex-col justify-between text-[10px] font-sans font-medium text-brand-dark-gray">
              {dayLabels.map((label) => (
                <span
                  key={label}
                  className={
                    visibleDayLabels.has(label) ? 'opacity-100' : 'opacity-0'
                  }
                >
                  {visibleDayLabels.has(label) ? label : '•'}
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              {columns.map((cells, weekIndex) => (
                <HeatmapColumn
                  key={`week-${weekIndex}`}
                  cells={cells}
                  weekIndex={weekIndex}
                  onCellHover={onCellHover}
                  onCellLeave={onCellLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
