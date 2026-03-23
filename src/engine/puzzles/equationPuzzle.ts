export interface EquationPuzzle {
  equation: string;
  answer: number;
  difficulty: number;
  hint: string;
  hints: [string, string, string];
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

function generateDifficultyOne(random: SeededRandom): {
  equation: string;
  answer: number;
  hint: string;
  hints: [string, string, string];
} {
  const useAdd = random.nextBoolean();

  if (useAdd) {
    // ? + b = c  →  answer = c - b
    const b = random.nextInt(1, 10);
    const answer = random.nextInt(1, 10);
    const c = answer + b;
    return {
      equation: `? + ${b} = ${c}`,
      answer,
      hint: `Subtract ${b} from both sides.`,
      hints: [
        'Isolate the unknown by undoing the operation on one side.',
        'Addition and subtraction are inverse operations.',
        `Subtract ${b} from ${c} to find ?.`,
      ],
    };
  }

  // a − ? = c  →  answer = a - c
  const c = random.nextInt(1, 10);
  const answer = random.nextInt(1, 10);
  const a = c + answer;
  return {
    equation: `${a} \u2212 ? = ${c}`,
    answer,
    hint: `Subtract ${c} from ${a}.`,
    hints: [
      'Rearrange the equation so the unknown is alone on one side.',
      'Think about what value added to c gives you a.',
      `${a} minus ${c} equals ?.`,
    ],
  };
}

function generateDifficultyTwo(random: SeededRandom): {
  equation: string;
  answer: number;
  hint: string;
  hints: [string, string, string];
} {
  const variant = random.nextInt(0, 2); // 0=two-step, 1=multiply, 2=divide

  if (variant === 0) {
    // (? + b) × m = result
    const b = random.nextInt(1, 8);
    const answer = random.nextInt(1, 8);
    const m = random.nextInt(2, 5);
    const result = (answer + b) * m;
    return {
      equation: `(? + ${b}) \u00d7 ${m} = ${result}`,
      answer,
      hint: `Divide ${result} by ${m} first, then subtract ${b}.`,
      hints: [
        'Work backwards from the result using inverse operations.',
        'Division undoes multiplication; subtraction undoes addition.',
        `Divide ${result} by ${m} first, then subtract ${b}.`,
      ],
    };
  }

  if (variant === 1) {
    // a × ? = c
    const a = random.nextInt(2, 9);
    const answer = random.nextInt(2, 9);
    const c = a * answer;
    return {
      equation: `${a} \u00d7 ? = ${c}`,
      answer,
      hint: `Divide ${c} by ${a}.`,
      hints: [
        'One operation links the known values to the unknown.',
        'The inverse of multiplication is division.',
        `Divide ${c} by ${a}.`,
      ],
    };
  }

  // c ÷ ? = b  →  answer = c / b
  const answer = random.nextInt(2, 8);
  const b = random.nextInt(2, 6);
  const c = answer * b;
  return {
    equation: `${c} \u00f7 ? = ${b}`,
    answer,
    hint: `Divide ${c} by ${b}.`,
    hints: [
      'Rearrange the division equation to isolate the unknown.',
      'If c divided by ? equals b, then ? times b equals c.',
      `Divide ${c} by ${b}.`,
    ],
  };
}

function generateDifficultyThree(random: SeededRandom): {
  equation: string;
  answer: number;
  hint: string;
  hints: [string, string, string];
} {
  const useSquare = random.nextBoolean();

  if (useSquare) {
    // a² + ? = b
    const a = random.nextInt(2, 9);
    const answer = random.nextInt(1, 20);
    const b = a * a + answer;
    return {
      equation: `${a}\u00b2 + ? = ${b}`,
      answer,
      hint: `${a}\u00b2 = ${a * a}. Subtract from ${b}.`,
      hints: [
        'One of the terms involves a power operation — compute it first.',
        `Calculate ${a} squared, then see what remains.`,
        `${a} squared is ${a * a}. Subtract from ${b}.`,
      ],
    };
  }

  // ? × ? = product (both unknowns are equal — find the square root)
  const root = random.nextInt(2, 9);
  const product = root * root;
  return {
    equation: `? \u00d7 ? = ${product}`,
    answer: root,
    hint: `Find the square root of ${product}. Both missing values are equal.`,
    hints: [
      'The same unknown appears twice in this equation.',
      'Think about what number multiplied by itself equals the result.',
      `Find the square root of ${product}.`,
    ],
  };
}

export function generateEquation(
  seed: string,
  difficulty: number,
): EquationPuzzle {
  const boundedDifficulty = Math.min(3, Math.max(1, Math.floor(difficulty)));
  const random = createSeededRandom(`${seed}-eq-${boundedDifficulty}`);

  const { equation, answer, hint, hints } =
    boundedDifficulty === 1
      ? generateDifficultyOne(random)
      : boundedDifficulty === 2
        ? generateDifficultyTwo(random)
        : generateDifficultyThree(random);

  return {
    equation,
    answer,
    difficulty: boundedDifficulty,
    hint,
    hints,
  };
}

export function validateEquationAnswer(
  puzzle: EquationPuzzle,
  answer: number,
): boolean {
  return Number.isFinite(answer) && answer === puzzle.answer;
}
