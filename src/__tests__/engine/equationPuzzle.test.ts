import {
  generateEquation,
  validateEquationAnswer,
} from '@/engine/puzzles/equationPuzzle';

describe('engine/puzzles/equationPuzzle', () => {
  it('generateEquation returns a puzzle object with required fields', () => {
    const puzzle = generateEquation('equation-seed-alpha', 1);

    expect(puzzle).toHaveProperty('equation');
    expect(puzzle).toHaveProperty('answer');
    expect(puzzle).toHaveProperty('difficulty');
    expect(puzzle).toHaveProperty('hint');
  });

  it('equation string contains a "?" placeholder', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const puzzle = generateEquation(`equation-qmark-${diff}`, diff);
      expect(puzzle.equation).toContain('?');
    }
  });

  it('answer is a finite positive integer', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const puzzle = generateEquation(`equation-answer-${diff}`, diff);
      expect(Number.isFinite(puzzle.answer)).toBe(true);
      expect(Number.isInteger(puzzle.answer)).toBe(true);
      expect(puzzle.answer).toBeGreaterThan(0);
    }
  });

  it('difficulty is bounded to 1-3', () => {
    expect(generateEquation('equation-low', 0).difficulty).toBe(1);
    expect(generateEquation('equation-high', 99).difficulty).toBe(3);
  });

  it('same seed and difficulty always produce the same puzzle', () => {
    const first = generateEquation('equation-deterministic', 2);
    const second = generateEquation('equation-deterministic', 2);

    expect(first).toEqual(second);
  });

  it('different seeds produce different puzzles', () => {
    const first = generateEquation('equation-seed-one', 2);
    const second = generateEquation('equation-seed-two', 2);

    expect(first).not.toEqual(second);
  });

  it('hint is a non-empty string', () => {
    const puzzle = generateEquation('equation-hint-check', 1);

    expect(typeof puzzle.hint).toBe('string');
    expect(puzzle.hint.trim().length).toBeGreaterThan(0);
  });

  it('validateEquationAnswer returns true for the correct answer', () => {
    const puzzle = generateEquation('equation-validate-correct', 2);

    expect(validateEquationAnswer(puzzle, puzzle.answer)).toBe(true);
  });

  it('validateEquationAnswer returns false for an incorrect answer', () => {
    const puzzle = generateEquation('equation-validate-wrong', 2);

    expect(validateEquationAnswer(puzzle, puzzle.answer + 1)).toBe(false);
  });

  it('validateEquationAnswer returns false for NaN', () => {
    const puzzle = generateEquation('equation-validate-nan', 1);

    expect(validateEquationAnswer(puzzle, Number.NaN)).toBe(false);
  });

  it('difficulty 1 produces small-number single-operation equations', () => {
    for (let i = 0; i < 5; i++) {
      const puzzle = generateEquation(`equation-d1-${i}`, 1);
      expect(puzzle.difficulty).toBe(1);
      expect(puzzle.answer).toBeGreaterThanOrEqual(1);
      expect(puzzle.answer).toBeLessThanOrEqual(20);
    }
  });

  it('difficulty 3 produces equations with exponents or repeated unknowns', () => {
    const seeds = [
      'equation-d3-a',
      'equation-d3-b',
      'equation-d3-c',
      'equation-d3-d',
    ];
    for (const seed of seeds) {
      const puzzle = generateEquation(seed, 3);
      expect(puzzle.difficulty).toBe(3);
      expect(Number.isFinite(puzzle.answer)).toBe(true);
    }
  });
});
