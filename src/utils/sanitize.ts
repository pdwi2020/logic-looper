const HTML_TAG_REGEX = /<[^>]*>/g;
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeInput(input: string): string {
  return input.replace(HTML_TAG_REGEX, '').trim();
}

export function validateDateString(date: string): boolean {
  if (!DATE_FORMAT_REGEX.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === date;
}

export function validateScore(score: number): boolean {
  return Number.isFinite(score) && score >= 0 && score <= 1000;
}

export function validateTimeTaken(time: number): boolean {
  return Number.isFinite(time) && time >= 0 && time <= 3600;
}
