import {
  generateNumberMatrix,
  validateAnswer,
} from '@/engine/puzzles/numberMatrix';

describe('engine/puzzles/numberMatrix', () => {
  it('generateNumberMatrix returns a puzzle object', () => {
    const puzzle = generateNumberMatrix('matrix-seed-alpha', 1);

    expect(puzzle).toHaveProperty('grid');
    expect(puzzle).toHaveProperty('missingCell');
    expect(puzzle).toHaveProperty('answer');
    expect(puzzle).toHaveProperty('difficulty');
    expect(puzzle).toHaveProperty('hint');
  });

  it('difficulty 1 creates a 3x3 grid and masks the missing cell as -1', () => {
    const puzzle = generateNumberMatrix('matrix-seed-d1', 1);

    expect(puzzle.grid).toHaveLength(3);
    puzzle.grid.forEach((row) => expect(row).toHaveLength(3));
    expect(puzzle.grid[puzzle.missingCell.row][puzzle.missingCell.col]).toBe(
      -1,
    );
  });

  it('difficulty 2 creates a 4x4 grid', () => {
    const puzzle = generateNumberMatrix('matrix-seed-d2', 2);

    expect(puzzle.grid).toHaveLength(4);
    puzzle.grid.forEach((row) => expect(row).toHaveLength(4));
  });

  it('difficulty 3 creates a 4x4 grid', () => {
    const puzzle = generateNumberMatrix('matrix-seed-d3', 3);

    expect(puzzle.grid).toHaveLength(4);
    puzzle.grid.forEach((row) => expect(row).toHaveLength(4));
  });

  it('missingCell row and col are inside grid bounds', () => {
    const puzzle = generateNumberMatrix('matrix-bounds-seed', 2);
    const rowCount = puzzle.grid.length;
    const columnCount = puzzle.grid[0].length;

    expect(puzzle.missingCell.row).toBeGreaterThanOrEqual(0);
    expect(puzzle.missingCell.row).toBeLessThan(rowCount);
    expect(puzzle.missingCell.col).toBeGreaterThanOrEqual(0);
    expect(puzzle.missingCell.col).toBeLessThan(columnCount);
  });

  it('answer is a finite number', () => {
    const puzzle = generateNumberMatrix('matrix-answer-seed', 3);

    expect(Number.isFinite(puzzle.answer)).toBe(true);
  });

  it('same seed and difficulty always produce the same puzzle', () => {
    const first = generateNumberMatrix('matrix-deterministic-seed', 2);
    const second = generateNumberMatrix('matrix-deterministic-seed', 2);

    expect(first).toEqual(second);
  });

  it('different seeds produce different puzzles', () => {
    const first = generateNumberMatrix('matrix-seed-one', 2);
    const second = generateNumberMatrix('matrix-seed-two', 2);

    expect(first).not.toEqual(second);
  });

  it('validateAnswer returns true for the correct answer', () => {
    const puzzle = generateNumberMatrix('matrix-validate-correct', 2);

    expect(validateAnswer(puzzle, puzzle.answer)).toBe(true);
  });

  it('validateAnswer returns false for an incorrect answer', () => {
    const puzzle = generateNumberMatrix('matrix-validate-wrong', 2);

    expect(validateAnswer(puzzle, puzzle.answer + 1)).toBe(false);
  });

  it('validateAnswer returns false for NaN', () => {
    const puzzle = generateNumberMatrix('matrix-validate-nan', 2);

    expect(validateAnswer(puzzle, Number.NaN)).toBe(false);
  });
});
