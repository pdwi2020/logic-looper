import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getIntensityLabel, getIntensityLevel } from '@/utils/intensityMapper';

// Types from @/db/schemas — will be replaced with imports when available
export interface DailyActivity {
  date: string;
  solved: boolean;
  score: number;
  timeTaken: number;
  difficulty: number;
  synced: boolean;
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface HeatmapTooltipProps {
  date: string;
  activity: DailyActivity | undefined;
  position: TooltipPosition | null;
  visible: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const formatDate = (dateString: string): string => {
  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return dateFormatter.format(parsed);
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${mins}:${secs}`;
};

const getDifficultyLabel = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    default:
      return `Level ${difficulty}`;
  }
};

export function HeatmapTooltip({
  date,
  activity,
  position,
  visible,
}: HeatmapTooltipProps) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {visible && position ? (
        <motion.div
          className="pointer-events-none absolute z-50 min-w-[180px] rounded-lg bg-brand-dark px-3 py-2 text-xs text-brand-light-gray shadow-lg shadow-brand-dark/40"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -110%)',
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <p className="font-sans text-[11px] font-semibold text-brand-light-blue">
            {formatDate(date)}
          </p>

          {activity ? (
            <div className="mt-2 space-y-1 font-body text-brand-light-gray">
              <p>
                Score:{' '}
                <span className="font-semibold text-brand-white">
                  {activity.score}
                </span>
              </p>
              <p>
                Time:{' '}
                <span className="font-semibold text-brand-white">
                  {formatDuration(activity.timeTaken)}
                </span>
              </p>
              <p>
                Difficulty:{' '}
                <span className="font-semibold text-brand-white">
                  {getDifficultyLabel(activity.difficulty)}
                </span>
              </p>
              <p>
                Intensity:{' '}
                <span className="font-semibold text-brand-white">
                  {getIntensityLabel(getIntensityLevel(activity))}
                </span>
              </p>
            </div>
          ) : (
            <p className="mt-2 font-body text-brand-light-gray">No activity</p>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
