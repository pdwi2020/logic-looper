import { generateDailyPuzzle, validatePuzzleAnswer } from '@/engine';
import { describe, expect, it, vi } from 'vitest';

describe('engine/index', () => {
  it('generateDailyPuzzle returns puzzle, type, and seed', () => {
    const dailyPuzzle = generateDailyPuzzle('2026-03-06');

    expect(dailyPuzzle).toHaveProperty('puzzle');
    expect(['number-matrix', 'sequence-solver', 'equation-puzzle']).toContain(dailyPuzzle.type);
    expect(typeof dailyPuzzle.seed).toBe('string');
    expect(dailyPuzzle.seed.length).toBeGreaterThan(0);
  });

  it('returns number-matrix puzzle with grid when date maps to number-matrix', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-01');

    expect(dailyPuzzle.type).toBe('number-matrix');
    expect('grid' in dailyPuzzle.puzzle).toBe(true);
  });

  it('returns sequence-solver puzzle with sequence when date maps to sequence-solver', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-02');

    expect(dailyPuzzle.type).toBe('sequence-solver');
    expect('sequence' in dailyPuzzle.puzzle).toBe(true);
  });

  it('generateDailyPuzzle uses today when no date is provided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-09T10:00:00.000Z'));

    try {
      const puzzleFromDefaultDate = generateDailyPuzzle();
      const puzzleFromExplicitDate = generateDailyPuzzle('2026-03-09');

      expect(puzzleFromDefaultDate).toEqual(puzzleFromExplicitDate);
    } finally {
      vi.useRealTimers();
    }
  });

  it('validatePuzzleAnswer returns true for a correct number-matrix answer', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-01');
    if (!('grid' in dailyPuzzle.puzzle)) {
      throw new Error('Expected number-matrix puzzle for 1970-01-01');
    }

    const result = validatePuzzleAnswer(
      dailyPuzzle.puzzle,
      dailyPuzzle.type,
      dailyPuzzle.puzzle.answer,
    );

    expect(result).toBe(true);
  });

  it('validatePuzzleAnswer returns false for a wrong number-matrix answer', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-01');
    if (!('grid' in dailyPuzzle.puzzle)) {
      throw new Error('Expected number-matrix puzzle for 1970-01-01');
    }

    const result = validatePuzzleAnswer(
      dailyPuzzle.puzzle,
      dailyPuzzle.type,
      dailyPuzzle.puzzle.answer + 1,
    );

    expect(result).toBe(false);
  });

  it('validatePuzzleAnswer returns true for a correct sequence-solver answer', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-02');
    if (!('sequence' in dailyPuzzle.puzzle)) {
      throw new Error('Expected sequence-solver puzzle for 1970-01-02');
    }

    const result = validatePuzzleAnswer(
      dailyPuzzle.puzzle,
      dailyPuzzle.type,
      dailyPuzzle.puzzle.answer,
    );

    expect(result).toBe(true);
  });

  it('validatePuzzleAnswer returns false for a wrong sequence-solver answer', () => {
    const dailyPuzzle = generateDailyPuzzle('1970-01-02');
    if (!('sequence' in dailyPuzzle.puzzle)) {
      throw new Error('Expected sequence-solver puzzle for 1970-01-02');
    }

    const result = validatePuzzleAnswer(
      dailyPuzzle.puzzle,
      dailyPuzzle.type,
      dailyPuzzle.puzzle.answer + 1,
    );

    expect(result).toBe(false);
  });
});
