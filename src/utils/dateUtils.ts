import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export function getYearDates(year: number): string[] {
  const start = dayjs(`${year}-01-01`);
  const end = dayjs(`${year}-12-31`);
  const totalDays = end.diff(start, 'day') + 1;

  return Array.from({ length: totalDays }, (_, index) =>
    start.add(index, 'day').format('YYYY-MM-DD'),
  );
}

export function getDayOfWeek(date: string): number {
  return dayjs(date).day();
}

export function getWeekNumber(date: string): number {
  return dayjs(date).isoWeek();
}

export function getMonthLabel(date: string): string {
  return dayjs(date).format('MMM');
}

export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

export function formatDate(date: string): string {
  return dayjs(date).format('MMMM D, YYYY');
}

export function getDateRange(startDate: string, endDate: string): string[] {
  if (startDate > endDate) {
    return [];
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const totalDays = end.diff(start, 'day') + 1;

  return Array.from({ length: totalDays }, (_, index) =>
    start.add(index, 'day').format('YYYY-MM-DD'),
  );
}
