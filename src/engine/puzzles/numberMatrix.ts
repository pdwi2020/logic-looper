export interface NumberMatrixPuzzle {
  grid: number[][];
  missingCell: { row: number; col: number };
  answer: number;
  difficulty: number;
  /** Primary hint — equals hints[0] for convenience */
  hint: string;
  /** Three progressive hints: vague → specific → very specific */
  hints: [string, string, string];
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
  hints: [string, string, string];
} {
  const variant = random.nextInt(0, 2); // 0=row-sum, 1=col-sum, 2=alternating

  if (variant === 0) {
    // row sum: [a, b, a+b]
    const grid = Array.from({ length: 3 }, () => {
      const first = random.nextInt(1, 9);
      const second = random.nextInt(1, 9);
      return [first, second, first + second];
    });

    return {
      grid,
      hints: [
        'Each row follows a consistent three-number pattern.',
        'Look at the relationship between the first two numbers and the third.',
        'Each row: first + second = third.',
      ],
    };
  }

  if (variant === 1) {
    // column sum: top + middle = bottom
    const topRow = Array.from({ length: 3 }, () => random.nextInt(1, 9));
    const middleRow = Array.from({ length: 3 }, () => random.nextInt(1, 9));
    const bottomRow = topRow.map((value, index) => value + middleRow[index]);

    return {
      grid: [topRow, middleRow, bottomRow],
      hints: [
        'Each column follows a consistent three-number pattern.',
        'Look at the relationship between the top, middle, and bottom values in each column.',
        'Each column: top + middle = bottom.',
      ],
    };
  }

  // Alternating rows: odd rows add, even rows subtract
  // Use first >= 5 and second < first to guarantee no negatives in even rows
  const grid = Array.from({ length: 3 }, (_, rowIndex) => {
    const first = random.nextInt(5, 9);
    const second = random.nextInt(1, first - 1);
    const third = rowIndex % 2 === 0 ? first + second : first - second;
    return [first, second, third];
  });

  return {
    grid,
    hints: [
      'Each row has a relationship between its three numbers.',
      'The operation (+ or \u2212) alternates between rows.',
      'Row 1 and 3: first + second = third. Row 2: first \u2212 second = third.',
    ],
  };
}

function generateDifficultyTwo(random: SeededRandom): {
  grid: number[][];
  hints: [string, string, string];
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
    hints: [
      'The grid follows a multiplication-based pattern.',
      'Look at the header row and left column — they contain factors.',
      'Top row and left column are factors; inside cells are their products.',
    ],
  };
}

function generateDifficultyThree(random: SeededRandom): {
  grid: number[][];
  hints: [string, string, string];
} {
  // Clamp to 2–7 to prevent overflow: max fourth = 7*7 + 14 = 63
  const grid = Array.from({ length: 4 }, () => {
    const first = random.nextInt(2, 7);
    const second = random.nextInt(2, 7);
    const third = first + second;
    const fourth = first * second + third;

    return [first, second, third, fourth];
  });

  return {
    grid,
    hints: [
      'Each row follows a two-step formula involving all four columns.',
      'Look at how column 3 relates to columns 1 and 2.',
      'Per row: col3 = col1 + col2, col4 = col1 \u00d7 col2 + col3.',
    ],
  };
}

export function generateNumberMatrix(
  seed: string,
  difficulty: number,
): NumberMatrixPuzzle {
  const boundedDifficulty = Math.min(3, Math.max(1, Math.floor(difficulty)));
  const random = createSeededRandom(`${seed}-${boundedDifficulty}`);

  const { grid, hints } =
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
    hint: hints[0],
    hints,
  };
}

export function validateAnswer(
  puzzle: NumberMatrixPuzzle,
  answer: number,
): boolean {
  return Number.isFinite(answer) && answer === puzzle.answer;
}
