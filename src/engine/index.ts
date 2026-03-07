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

export type Puzzle = NumberMatrixPuzzle | SequencePuzzle;
export type PuzzleType = 'number-matrix' | 'sequence-solver';

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
      : generateSequence(config.seed, config.difficulty);

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
    return 'grid' in puzzle && validateAnswer(puzzle, answer);
  }

  return 'sequence' in puzzle && validateSequenceAnswer(puzzle, answer);
}
