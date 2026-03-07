import type { DailyActivity } from '@/db/schemas';

export type IntensityLevel = 0 | 1 | 2 | 3 | 4;

export function getIntensityLevel(
  activity: DailyActivity | undefined,
): IntensityLevel {
  if (!activity || !activity.solved) {
    return 0;
  }

  if (activity.score < 40) {
    return 1;
  }

  if (activity.score < 70) {
    return 2;
  }

  if (activity.score < 90) {
    return 3;
  }

  return 4;
}

export function getIntensityColor(level: IntensityLevel): string {
  switch (level) {
    case 0:
      return 'bg-gray-200';
    case 1:
      return 'bg-green-200';
    case 2:
      return 'bg-green-400';
    case 3:
      return 'bg-green-600';
    case 4:
      return 'bg-green-800';
    default:
      return 'bg-gray-200';
  }
}

export function getIntensityLabel(level: IntensityLevel): string {
  switch (level) {
    case 0:
      return 'Not played';
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    case 4:
      return 'Perfect';
    default:
      return 'Not played';
  }
}
