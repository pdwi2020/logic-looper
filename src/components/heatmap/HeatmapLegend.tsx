import type { CSSProperties } from 'react';
import { getIntensityColor } from '@/utils/intensityMapper';

// Types from @/utils/intensityMapper — will be replaced with imports when available
type IntensityLevel = 0 | 1 | 2 | 3 | 4;

interface ColorPresentation {
  className: string;
  style: CSSProperties | undefined;
}

const intensityLevels: IntensityLevel[] = [0, 1, 2, 3, 4];

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

export function HeatmapLegend() {
  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-body text-brand-dark-gray">
      <span>Less</span>
      <div className="flex items-center gap-1">
        {intensityLevels.map((level) => {
          const { className, style } = getColorPresentation(
            getIntensityColor(level),
          );

          return (
            <div
              key={level}
              className={[
                'h-3 w-3 rounded-sm border border-brand-light-gray/40',
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              style={style}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span>More</span>
    </div>
  );
}
