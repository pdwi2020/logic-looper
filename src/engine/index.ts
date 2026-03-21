import { getDailyPuzzleConfig } from '@/engine/seedGenerator';
import {
  generateNumberMatrix,
  type NumberMatrixPuzzle,
  validateAnswer,
} from '@/engine/puzzles/numberMatrix';
import {
  generateSequence,
  type SequencePuzzle,
  validateSequenceAnswer,
} from '@/engine/puzzles/sequenceSolver';
import {
  generateEquation,
  type EquationPuzzle,
  validateEquationAnswer,
} from '@/engine/puzzles/equationPuzzle';

export type Puzzle = NumberMatrixPuzzle | SequencePuzzle | EquationPuzzle;
export type PuzzleType = 'number-matrix' | 'sequence-solver' | 'equation-puzzle';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function generateDailyPuzzle(date = getTodayDateString()): {
  puzzle: Puzzle;
  type: PuzzleType;
  seed: string;
} {
  const config = getDailyPuzzleConfig(date);

  const puzzle =
    config.puzzleType === 'number-matrix'
      ? generateNumberMatrix(config.seed, config.difficulty)
      : config.puzzleType === 'sequence-solver'
        ? generateSequence(config.seed, config.difficulty)
        : generateEquation(config.seed, config.difficulty);

  return {
    puzzle,
    type: config.puzzleType,
    seed: config.seed,
  };
}

export function validatePuzzleAnswer(
  puzzle: Puzzle,
  type: PuzzleType,
  answer: number,
): boolean {
  if (type === 'number-matrix') {
    return 'grid' in puzzle && validateAnswer(puzzle as NumberMatrixPuzzle, answer);
  }

  if (type === 'sequence-solver') {
    return 'sequence' in puzzle && validateSequenceAnswer(puzzle as SequencePuzzle, answer);
  }

  return 'equation' in puzzle && validateEquationAnswer(puzzle as EquationPuzzle, answer);
}
