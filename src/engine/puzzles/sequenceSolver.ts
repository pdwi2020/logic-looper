export interface SequencePuzzle {
  sequence: (number | null)[];
  answer: number;
  rule: string;
  difficulty: number;
  hint: string;
}

interface SeededRandom {
  next: () => number;
  nextInt: (min: number, max: number) => number;
  nextBoolean: () => boolean;
}

function createSeededRandom(seed: string): SeededRandom {
  const chunks = seed.match(/.{1,8}/g) ?? [];
  let state = chunks.reduce((accumulator, chunk) => {
    const value = Number.parseInt(chunk, 16);
    return Number.isNaN(value) ? accumulator : (accumulator ^ value) >>> 0;
  }, 0);

  if (state === 0) {
    state = 0xa341316c;
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

// Randomly picks a non-boundary index (not first, not last) as the missing position
function maskAtRandomPosition(
  sequence: number[],
  random: SeededRandom,
): (number | null)[] {
  const missingIndex = random.nextInt(1, sequence.length - 2);
  return sequence.map((value, index) =>
    index === missingIndex ? null : value,
  );
}

function generateDifficultyOne(random: SeededRandom): {
  sequence: number[];
  rule: string;
  hint: string;
} {
  const length = random.nextInt(5, 7);
  const start = random.nextInt(2, 20);
  const step = random.nextInt(2, 9);
  const sequence = Array.from({ length }, (_, index) => start + step * index);

  return {
    sequence,
    rule: `Add ${step} each step.`,
    hint: 'Look for a constant difference between consecutive numbers.',
  };
}

function generateDifficultyTwo(random: SeededRandom): {
  sequence: number[];
  rule: string;
  hint: string;
} {
  const variant = random.nextInt(0, 2); // 0=geometric, 1=quadratic-diff, 2=squares/triangular
  const length = random.nextInt(5, 7);

  if (variant === 0) {
    const start = random.nextInt(2, 6);
    const ratio = random.nextInt(2, 4);
    const sequence = Array.from(
      { length },
      (_, index) => start * ratio ** index,
    );

    return {
      sequence,
      rule: `Multiply by ${ratio} each step.`,
      hint: 'Check whether each term keeps the same multiplication ratio.',
    };
  }

  if (variant === 1) {
    const start = random.nextInt(1, 12);
    const initialDifference = random.nextInt(2, 6);
    const differenceStep = random.nextInt(1, 4);
    const sequence: number[] = [start];
    let currentDifference = initialDifference;

    for (let index = 1; index < length; index += 1) {
      sequence.push(sequence[index - 1] + currentDifference);
      currentDifference += differenceStep;
    }

    return {
      sequence,
      rule: `Differences increase by ${differenceStep} each step.`,
      hint: 'Find the jump between terms first, then check how those jumps change.',
    };
  }

  // Perfect squares or triangular numbers
  const useSquares = random.nextBoolean();

  if (useSquares) {
    const startN = random.nextInt(1, 5);
    const sequence = Array.from(
      { length },
      (_, index) => (startN + index) ** 2,
    );
    return {
      sequence,
      rule: 'Each term is a perfect square.',
      hint: 'Try squaring consecutive integers starting from a small number.',
    };
  }

  // Triangular numbers: T_n = n*(n+1)/2
  const startN = random.nextInt(1, 5);
  const sequence = Array.from({ length }, (_, index) => {
    const n = startN + index;
    return (n * (n + 1)) / 2;
  });
  return {
    sequence,
    rule: 'Triangular numbers: n \u00d7 (n+1) \u00f7 2.',
    hint: 'The differences between terms increase by 1 each step.',
  };
}

function generateDifficultyThree(random: SeededRandom): {
  sequence: number[];
  rule: string;
  hint: string;
} {
  const variant = random.nextInt(0, 2); // 0=fibonacci, 1=alternating, 2=triangular
  const length = random.nextInt(6, 7);

  if (variant === 0) {
    // Fibonacci-like with overflow cap at 999
    const first = random.nextInt(1, 9);
    const second = random.nextInt(1, 9);
    const sequence: number[] = [first, second];

    for (let index = 2; index < length; index += 1) {
      sequence.push(Math.min(sequence[index - 1] + sequence[index - 2], 999));
    }

    return {
      sequence,
      rule: 'Each term equals the sum of the previous two terms.',
      hint: 'Try adding neighboring numbers to see if the next number appears.',
    };
  }

  if (variant === 1) {
    // Alternating +/× operations with overflow cap at 999
    const start = random.nextInt(4, 20);
    const addValue = random.nextInt(2, 8);
    const multiplier = random.nextInt(2, 3);
    const sequence: number[] = [start];

    for (let index = 1; index < length; index += 1) {
      const previous = sequence[index - 1];
      const nextValue =
        index % 2 === 1 ? previous + addValue : previous * multiplier;
      sequence.push(Math.min(nextValue, 999));
    }

    return {
      sequence,
      rule: `Alternate operations: +${addValue}, then \u00d7${multiplier}, then repeat.`,
      hint: 'The operation switches every step. Identify the two-step cycle.',
    };
  }

  // Triangular numbers at a higher starting point for difficulty 3
  const startN = random.nextInt(4, 10);
  const sequence = Array.from({ length }, (_, index) => {
    const n = startN + index;
    return (n * (n + 1)) / 2;
  });
  return {
    sequence,
    rule: 'Triangular numbers: n \u00d7 (n+1) \u00f7 2.',
    hint: 'The differences between consecutive terms increase by exactly 1 each step.',
  };
}

export function generateSequence(
  seed: string,
  difficulty: number,
): SequencePuzzle {
  const boundedDifficulty = Math.min(3, Math.max(1, Math.floor(difficulty)));
  const random = createSeededRandom(`${seed}-${boundedDifficulty}`);

  const { sequence, rule, hint } =
    boundedDifficulty === 1
      ? generateDifficultyOne(random)
      : boundedDifficulty === 2
        ? generateDifficultyTwo(random)
        : generateDifficultyThree(random);

  const masked = maskAtRandomPosition(sequence, random);
  const missingIndex = masked.findIndex((v) => v === null);

  return {
    sequence: masked,
    answer: sequence[missingIndex],
    rule,
    difficulty: boundedDifficulty,
    hint,
  };
}

export function validateSequenceAnswer(
  puzzle: SequencePuzzle,
  answer: number,
): boolean {
  return Number.isFinite(answer) && answer === puzzle.answer;
}
