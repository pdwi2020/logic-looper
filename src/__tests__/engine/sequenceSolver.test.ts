import {
  generateSequence,
  validateSequenceAnswer,
} from '@/engine/puzzles/sequenceSolver';

describe('engine/puzzles/sequenceSolver', () => {
  it('generateSequence returns a puzzle object', () => {
    const puzzle = generateSequence('sequence-seed-alpha', 1);

    expect(puzzle).toHaveProperty('sequence');
    expect(puzzle).toHaveProperty('answer');
    expect(puzzle).toHaveProperty('rule');
    expect(puzzle).toHaveProperty('difficulty');
    expect(puzzle).toHaveProperty('hint');
  });

  it('sequence has exactly one null entry at a non-boundary position', () => {
    const puzzle = generateSequence('sequence-null-check', 2);
    const nullIndexes = puzzle.sequence
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);

    expect(nullIndexes).toHaveLength(1);
    expect(nullIndexes[0]).toBeGreaterThan(0);
    expect(nullIndexes[0]).toBeLessThan(puzzle.sequence.length - 1);
  });

  it('difficulty 1 sequence length is 5 to 7', () => {
    const puzzle = generateSequence('sequence-length-d1', 1);

    expect(puzzle.sequence.length).toBeGreaterThanOrEqual(5);
    expect(puzzle.sequence.length).toBeLessThanOrEqual(7);
  });

  it('difficulty 2 sequence length is 5 to 7', () => {
    const puzzle = generateSequence('sequence-length-d2', 2);

    expect(puzzle.sequence.length).toBeGreaterThanOrEqual(5);
    expect(puzzle.sequence.length).toBeLessThanOrEqual(7);
  });

  it('difficulty 3 sequence length is 6 to 7', () => {
    const puzzle = generateSequence('sequence-length-d3', 3);

    expect(puzzle.sequence.length).toBeGreaterThanOrEqual(6);
    expect(puzzle.sequence.length).toBeLessThanOrEqual(7);
  });

  it('answer is a finite number', () => {
    const puzzle = generateSequence('sequence-answer-seed', 3);

    expect(Number.isFinite(puzzle.answer)).toBe(true);
  });

  it('same seed and difficulty produce the same sequence puzzle', () => {
    const first = generateSequence('sequence-deterministic-seed', 2);
    const second = generateSequence('sequence-deterministic-seed', 2);

    expect(first).toEqual(second);
  });

  it('different seeds produce different sequence puzzles', () => {
    const first = generateSequence('sequence-seed-one', 2);
    const second = generateSequence('sequence-seed-two', 2);

    expect(first).not.toEqual(second);
  });

  it('validateSequenceAnswer returns true for correct answer', () => {
    const puzzle = generateSequence('sequence-validate-correct', 2);

    expect(validateSequenceAnswer(puzzle, puzzle.answer)).toBe(true);
  });

  it('validateSequenceAnswer returns false for wrong answer', () => {
    const puzzle = generateSequence('sequence-validate-wrong', 2);

    expect(validateSequenceAnswer(puzzle, puzzle.answer + 1)).toBe(false);
  });

  it('rule and hint are non-empty strings', () => {
    const puzzle = generateSequence('sequence-rule-hint', 3);

    expect(typeof puzzle.rule).toBe('string');
    expect(puzzle.rule.trim().length).toBeGreaterThan(0);
    expect(typeof puzzle.hint).toBe('string');
    expect(puzzle.hint.trim().length).toBeGreaterThan(0);
  });

  it('difficulty is bounded to 1-3', () => {
    expect(generateSequence('sequence-low-bound', 0).difficulty).toBe(1);
    expect(generateSequence('sequence-high-bound', 99).difficulty).toBe(3);
  });
});
