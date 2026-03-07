export interface NumberMatrixPuzzle {
  grid: number[][];
  missingCell: { row: number; col: number };
  answer: number;
  difficulty: number;
  hint: string;
}

interface SeededRandom {
  next: () => number;
  nextInt: (min: number, max: number) => number;
  nextBoolean: () => boolean;
}

function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(seed);

  if (state === 0) {
    state = 0x9e3779b9;
  }

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };

  return {
    next,
    nextInt(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    nextBoolean(): boolean {
      return next() >= 0.5;
    },
  };
}

function selectMissingCell(
  grid: number[][],
  random: SeededRandom,
  skipTopLeft = false,
): { row: number; col: number } {
  const candidates: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid[row].length; col += 1) {
      if (skipTopLeft && row === 0 && col === 0) {
        continue;
      }

      candidates.push({ row, col });
    }
  }

  return candidates[random.nextInt(0, candidates.length - 1)];
}

function applyMissingCell(
  grid: number[][],
  missingCell: { row: number; col: number },
): number[][] {
  return grid.map((row, rowIndex) =>
    row.map((value, colIndex) =>
      rowIndex === missingCell.row && colIndex === missingCell.col ? -1 : value,
    ),
  );
}

function generateDifficultyOne(random: SeededRandom): {
  grid: number[][];
  hint: string;
} {
  const useRowPattern = random.nextBoolean();

  if (useRowPattern) {
    const grid = Array.from({ length: 3 }, () => {
      const first = random.nextInt(1, 9);
      const second = random.nextInt(1, 9);
      return [first, second, first + second];
    });

    return {
      grid,
      hint: 'Each row follows: first + second = third.',
    };
  }

  const topRow = Array.from({ length: 3 }, () => random.nextInt(1, 9));
  const middleRow = Array.from({ length: 3 }, () => random.nextInt(1, 9));
  const bottomRow = topRow.map((value, index) => value + middleRow[index]);

  return {
    grid: [topRow, middleRow, bottomRow],
    hint: 'Each column follows: top + middle = bottom.',
  };
}

function generateDifficultyTwo(random: SeededRandom): {
  grid: number[][];
  hint: string;
} {
  const rowFactors = Array.from({ length: 3 }, () => random.nextInt(2, 9));
  const columnFactors = Array.from({ length: 3 }, () => random.nextInt(2, 9));

  const grid = [
    [1, ...columnFactors],
    ...rowFactors.map((factor) => [
      factor,
      factor * columnFactors[0],
      factor * columnFactors[1],
      factor * columnFactors[2],
    ]),
  ];

  return {
    grid,
    hint: 'Top row and left column are factors; inside cells are products.',
  };
}

function generateDifficultyThree(random: SeededRandom): {
  grid: number[][];
  hint: string;
} {
  const grid = Array.from({ length: 4 }, () => {
    const first = random.nextInt(2, 12);
    const second = random.nextInt(2, 12);
    const third = first + second;
    const fourth = first * second + third;

    return [first, second, third, fourth];
  });

  return {
    grid,
    hint: 'Per row: third = first + second, fourth = first * second + third.',
  };
}

export function generateNumberMatrix(
  seed: string,
  difficulty: number,
): NumberMatrixPuzzle {
  const boundedDifficulty = Math.min(3, Math.max(1, Math.floor(difficulty)));
  const random = createSeededRandom(`${seed}-${boundedDifficulty}`);

  const { grid, hint } =
    boundedDifficulty === 1
      ? generateDifficultyOne(random)
      : boundedDifficulty === 2
        ? generateDifficultyTwo(random)
        : generateDifficultyThree(random);

  const missingCell = selectMissingCell(grid, random, boundedDifficulty === 2);
  const answer = grid[missingCell.row][missingCell.col];
  const maskedGrid = applyMissingCell(grid, missingCell);

  return {
    grid: maskedGrid,
    missingCell,
    answer,
    difficulty: boundedDifficulty,
    hint,
  };
}

export function validateAnswer(
  puzzle: NumberMatrixPuzzle,
  answer: number,
): boolean {
  return Number.isFinite(answer) && answer === puzzle.answer;
}
