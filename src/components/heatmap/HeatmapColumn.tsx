import { memo } from 'react';
import { HeatmapCell, type HeatmapCellData } from './HeatmapCell';

export interface HeatmapColumnProps {
  cells: HeatmapCellData[];
  weekIndex: number;
  onCellHover: (date: string, rect: DOMRect) => void;
  onCellLeave: () => void;
}

function HeatmapColumnComponent({
  cells,
  weekIndex,
  onCellHover,
  onCellLeave,
}: HeatmapColumnProps) {
  return (
    <div className="flex flex-col gap-1">
      {cells.map((cell, dayIndex) => (
        <HeatmapCell
          key={`${cell.date}-${dayIndex}`}
          date={cell.date}
          intensity={cell.intensity}
          onHover={onCellHover}
          onLeave={onCellLeave}
          animationDelay={weekIndex * 0.02 + dayIndex * 0.01}
        />
      ))}
    </div>
  );
}

export const HeatmapColumn = memo(HeatmapColumnComponent);

HeatmapColumn.displayName = 'HeatmapColumn';
