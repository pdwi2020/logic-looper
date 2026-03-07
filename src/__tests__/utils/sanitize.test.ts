import {
  sanitizeInput,
  validateDateString,
  validateScore,
  validateTimeTaken,
} from '@/utils/sanitize';

describe('utils/sanitize', () => {
  it('sanitizeInput strips HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>Hello')).toBe(
      'alert(1)Hello',
    );
    expect(sanitizeInput('<b>Safe</b> text')).toBe('Safe text');
  });

  it('sanitizeInput trims whitespace', () => {
    expect(sanitizeInput('   hello world   ')).toBe('hello world');
  });

  it('validateDateString accepts valid dates', () => {
    expect(validateDateString('2026-03-06')).toBe(true);
    expect(validateDateString('2024-02-29')).toBe(true);
  });

  it('validateDateString rejects invalid formats', () => {
    expect(validateDateString('03-06-2026')).toBe(false);
    expect(validateDateString('2026/03/06')).toBe(false);
    expect(validateDateString('2026-3-6')).toBe(false);
    expect(validateDateString('2026-13-01')).toBe(false);
    expect(validateDateString('2026-02-30')).toBe(false);
  });

  it('validateScore accepts 0, 500, 1000', () => {
    expect(validateScore(0)).toBe(true);
    expect(validateScore(500)).toBe(true);
    expect(validateScore(1000)).toBe(true);
  });

  it('validateScore rejects negative and >1000', () => {
    expect(validateScore(-1)).toBe(false);
    expect(validateScore(1001)).toBe(false);
  });

  it('validateTimeTaken accepts valid range', () => {
    expect(validateTimeTaken(0)).toBe(true);
    expect(validateTimeTaken(60)).toBe(true);
    expect(validateTimeTaken(3600)).toBe(true);
  });
});
