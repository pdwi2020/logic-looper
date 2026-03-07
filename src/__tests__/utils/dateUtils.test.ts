import dayjs from 'dayjs';

import {
  formatDate,
  getDateRange,
  getDayOfWeek,
  getMonthLabel,
  getWeekNumber,
  getYearDates,
  isToday,
} from '@/utils/dateUtils';

describe('utils/dateUtils', () => {
  it('getYearDates returns 365 days for non-leap year (2025)', () => {
    const dates = getYearDates(2025);
    expect(dates).toHaveLength(365);
  });

  it('getYearDates returns 366 days for leap year (2024)', () => {
    const dates = getYearDates(2024);
    expect(dates).toHaveLength(366);
  });

  it('getYearDates returns correct first and last dates', () => {
    const dates2025 = getYearDates(2025);

    expect(dates2025[0]).toBe('2025-01-01');
    expect(dates2025.at(-1)).toBe('2025-12-31');
  });

  it('getDayOfWeek returns correct values', () => {
    expect(getDayOfWeek('2026-03-01')).toBe(0);
    expect(getDayOfWeek('2026-03-02')).toBe(1);
    expect(getDayOfWeek('2026-03-06')).toBe(5);
  });

  it('getMonthLabel returns correct month abbreviations', () => {
    expect(getMonthLabel('2026-01-15')).toBe('Jan');
    expect(getMonthLabel('2026-03-06')).toBe('Mar');
    expect(getMonthLabel('2026-12-25')).toBe('Dec');
  });

  it('isToday works correctly', () => {
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    expect(isToday(today)).toBe(true);
    expect(isToday(yesterday)).toBe(false);
  });

  it('getDateRange generates correct inclusive range', () => {
    expect(getDateRange('2026-03-01', '2026-03-05')).toEqual([
      '2026-03-01',
      '2026-03-02',
      '2026-03-03',
      '2026-03-04',
      '2026-03-05',
    ]);
  });

  it('getDateRange returns empty array when startDate is after endDate', () => {
    expect(getDateRange('2026-03-10', '2026-03-05')).toEqual([]);
  });

  it('getWeekNumber returns ISO week number', () => {
    expect(getWeekNumber('2026-01-01')).toBe(1);
    expect(getWeekNumber('2026-03-06')).toBe(10);
  });

  it('formatDate produces human-readable output', () => {
    expect(formatDate('2026-03-06')).toBe('March 6, 2026');
  });
});
