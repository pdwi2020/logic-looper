import { type CSSProperties, memo } from 'react';
import { motion } from 'framer-motion';
import { getIntensityColor, getIntensityLabel } from '@/utils/intensityMapper';

// Types from @/utils/intensityMapper — will be replaced with imports when available
export type IntensityLevel = 0 | 1 | 2 | 3 | 4;

// Types from @/db/schemas — will be replaced with imports when available
export interface DailyActivity {
  date: string;
  solved: boolean;
  score: number;
  timeTaken: number;
  difficulty: number;
  synced: boolean;
}

export interface HeatmapCellData {
  date: string;
  intensity: IntensityLevel;
  activity?: DailyActivity;
}

export interface HeatmapCellProps {
  date: string;
  intensity: IntensityLevel;
  onHover: (date: string, rect: DOMRect) => void;
  onLeave: () => void;
  animationDelay?: number;
}

interface ColorPresentation {
  className: string;
  style: CSSProperties | undefined;
}

const getColorPresentation = (value: string): ColorPresentation => {
  const looksLikeClass = /^(bg-|from-|to-|via-|text-)/.test(value);

  if (looksLikeClass) {
    return { className: value, style: undefined };
  }

  return {
    className: '',
    style: { backgroundColor: value },
  };
};

function HeatmapCellComponent({
  date,
  intensity,
  onHover,
  onLeave,
  animationDelay = 0,
}: HeatmapCellProps) {
  const { className: colorClassName, style } = getColorPresentation(
    getIntensityColor(intensity),
  );

  return (
    <motion.div
      className={[
        'h-3 w-3 rounded-sm border border-brand-light-gray/40',
        colorClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.2,
        delay: animationDelay,
        ease: 'easeOut',
      }}
      onMouseEnter={(event) => {
        onHover(date, event.currentTarget.getBoundingClientRect());
      }}
      onMouseLeave={onLeave}
      aria-label={`${date} ${getIntensityLabel(intensity)}`}
    />
  );
}

export const HeatmapCell = memo(HeatmapCellComponent);

HeatmapCell.displayName = 'HeatmapCell';
