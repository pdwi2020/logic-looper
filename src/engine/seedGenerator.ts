import CryptoJS from 'crypto-js';

const DEFAULT_SECRET = 'logic-looper-daily-secret-v1';
const MS_PER_DAY = 86_400_000;

type DailyPuzzleType = 'number-matrix' | 'sequence-solver' | 'equation-puzzle';

function parseUtcDate(date: string): Date {
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD.');
  }

  return parsedDate;
}

function getDayOfYear(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const currentDate = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());

  return Math.floor((currentDate - startOfYear) / MS_PER_DAY) + 1;
}

export function generateDailySeed(
  date: string,
  secret = DEFAULT_SECRET,
): string {
  return CryptoJS.HmacSHA256(date, secret).toString(CryptoJS.enc.Hex);
}

export function seedToNumber(seed: string, min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
    throw new Error('Invalid range provided for seed conversion.');
  }

  const normalizedSeed = seed.replace(/[^a-fA-F0-9]/g, '');
  if (!normalizedSeed) {
    throw new Error('Seed must contain hexadecimal characters.');
  }

  const rangeSize = BigInt(max - min + 1);
  const usableSeed = normalizedSeed.slice(0, 16);
  const seedValue = BigInt(`0x${usableSeed}`);

  return Number(seedValue % rangeSize) + min;
}

export function getDailyPuzzleConfig(date: string): {
  seed: string;
  difficulty: number;
  puzzleType: DailyPuzzleType;
} {
  const parsedDate = parseUtcDate(date);
  const seed = generateDailySeed(date);
  const daysSinceEpoch = Math.floor(parsedDate.getTime() / MS_PER_DAY);

  const DAY_OF_WEEK_DIFFICULTY: Record<number, number> = {
    0: 2, // Sunday
    1: 1, // Monday — easiest, builds habit
    2: 1, // Tuesday
    3: 2, // Wednesday — ramps up mid-week
    4: 2, // Thursday
    5: 3, // Friday — hardest for engaged users
    6: 3, // Saturday
  };
  const difficulty = DAY_OF_WEEK_DIFFICULTY[parsedDate.getUTCDay()] ?? 2;
  const mod = daysSinceEpoch % 3;
  const puzzleType: DailyPuzzleType =
    mod === 0 ? 'number-matrix' : mod === 1 ? 'sequence-solver' : 'equation-puzzle';

  return { seed, difficulty, puzzleType };
}
