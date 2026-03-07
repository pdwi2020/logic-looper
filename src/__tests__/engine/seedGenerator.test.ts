import CryptoJS from 'crypto-js';

import {
  generateDailySeed,
  getDailyPuzzleConfig,
  seedToNumber,
} from '@/engine/seedGenerator';

const HEX_64_REGEX = /^[0-9a-f]{64}$/i;

describe('engine/seedGenerator', () => {
  it('generateDailySeed returns HMAC SHA-256 hex output', () => {
    const date = '2026-03-06';
    const secret = 'logic-looper-test-secret';
    const expected = CryptoJS.HmacSHA256(date, secret).toString(
      CryptoJS.enc.Hex,
    );

    expect(generateDailySeed(date, secret)).toBe(expected);
    expect(expected).toMatch(HEX_64_REGEX);
  });

  it('generateDailySeed is deterministic for the same date and secret', () => {
    const date = '2026-03-06';
    const secret = 'stable-secret';

    const first = generateDailySeed(date, secret);
    const second = generateDailySeed(date, secret);

    expect(first).toBe(second);
  });

  it('generateDailySeed changes when date changes', () => {
    const secret = 'stable-secret';
    const first = generateDailySeed('2026-03-06', secret);
    const second = generateDailySeed('2026-03-07', secret);

    expect(first).not.toBe(second);
  });

  it('seedToNumber returns an integer within the provided range', () => {
    const value = seedToNumber('abcdef1234567890', 10, 25);

    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(10);
    expect(value).toBeLessThanOrEqual(25);
  });

  it('seedToNumber is deterministic for the same seed and range', () => {
    const first = seedToNumber('ff00aa11bb22cc33', 1, 100);
    const second = seedToNumber('ff00aa11bb22cc33', 1, 100);

    expect(first).toBe(second);
  });

  it('seedToNumber throws for invalid range (max < min)', () => {
    expect(() => seedToNumber('abcdef', 10, 9)).toThrow();
  });

  it('getDailyPuzzleConfig returns seed, difficulty, and puzzleType', () => {
    const config = getDailyPuzzleConfig('2026-03-06');

    expect(config.seed).toMatch(HEX_64_REGEX);
    expect([1, 2, 3]).toContain(config.difficulty);
    expect(['number-matrix', 'sequence-solver']).toContain(config.puzzleType);
  });

  it('getDailyPuzzleConfig computes difficulty from day-of-year thresholds', () => {
    expect(getDailyPuzzleConfig('2025-01-01').difficulty).toBe(1);
    expect(getDailyPuzzleConfig('2025-05-03').difficulty).toBe(2);
    expect(getDailyPuzzleConfig('2024-09-01').difficulty).toBe(3);
  });

  it('getDailyPuzzleConfig alternates puzzle type by daysSinceEpoch parity', () => {
    expect(getDailyPuzzleConfig('1970-01-01').puzzleType).toBe('number-matrix');
    expect(getDailyPuzzleConfig('1970-01-02').puzzleType).toBe(
      'sequence-solver',
    );
  });
});
