import type { DailyActivity } from '@/db/schemas';
import {
  getIntensityColor,
  getIntensityLabel,
  getIntensityLevel,
} from '@/utils/intensityMapper';

const createActivity = (score: number, solved = true): DailyActivity => ({
  date: '2026-03-06',
  solved,
  score,
  timeTaken: 120,
  difficulty: 2,
  synced: false,
});

describe('utils/intensityMapper', () => {
  it('getIntensityLevel returns 0 for undefined', () => {
    expect(getIntensityLevel(undefined)).toBe(0);
  });

  it('getIntensityLevel returns 0 for unsolved activity', () => {
    expect(getIntensityLevel(createActivity(100, false))).toBe(0);
  });

  it('getIntensityLevel applies score thresholds', () => {
    expect(getIntensityLevel(createActivity(10))).toBe(1);
    expect(getIntensityLevel(createActivity(50))).toBe(2);
    expect(getIntensityLevel(createActivity(80))).toBe(3);
    expect(getIntensityLevel(createActivity(95))).toBe(4);
  });

  it('getIntensityLevel handles boundary values correctly', () => {
    expect(getIntensityLevel(createActivity(0))).toBe(1);
    expect(getIntensityLevel(createActivity(39))).toBe(1);
    expect(getIntensityLevel(createActivity(40))).toBe(2);
    expect(getIntensityLevel(createActivity(69))).toBe(2);
    expect(getIntensityLevel(createActivity(70))).toBe(3);
    expect(getIntensityLevel(createActivity(89))).toBe(3);
    expect(getIntensityLevel(createActivity(90))).toBe(4);
    expect(getIntensityLevel(createActivity(100))).toBe(4);
  });

  it('getIntensityColor returns correct Tailwind classes', () => {
    expect(getIntensityColor(0)).toBe('bg-gray-200');
    expect(getIntensityColor(1)).toBe('bg-green-200');
    expect(getIntensityColor(2)).toBe('bg-green-400');
    expect(getIntensityColor(3)).toBe('bg-green-600');
    expect(getIntensityColor(4)).toBe('bg-green-800');
  });

  it('getIntensityLabel returns correct labels', () => {
    expect(getIntensityLabel(0)).toBe('Not played');
    expect(getIntensityLabel(1)).toBe('Easy');
    expect(getIntensityLabel(2)).toBe('Medium');
    expect(getIntensityLabel(3)).toBe('Hard');
    expect(getIntensityLabel(4)).toBe('Perfect');
  });
});
