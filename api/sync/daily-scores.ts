// import { PrismaClient } from '@prisma/client';
// Prisma import commented out until auth is implemented.
// Uncomment and use: import { PrismaClient } from '@prisma/client/index.js';

interface DailyScoreEntry {
  date: string;
  score: number;
  timeTaken: number;
  difficulty?: number;
}

interface SyncRequestBody {
  entries: DailyScoreEntry[];
}

interface ApiResponseBody {
  success: boolean;
  message: string;
  accepted?: number;
  errors?: string[];
}

interface VercelRequestLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface VercelResponseLike {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): VercelResponseLike;
  json(body: ApiResponseBody): void;
  end(): void;
}

// const prisma = new PrismaClient();

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://logic-looper-ruby.vercel.app',
]);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function setCorsHeaders(req: VercelRequestLike, res: VercelResponseLike): void {
  const originHeader = req.headers.origin;
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function toRequestBody(value: unknown): SyncRequestBody | null {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return toRequestBody(parsed);
    } catch {
      return null;
    }
  }

  if (typeof value !== 'object' || value === null) {
    return null;
  }

  if (!('entries' in value)) {
    return null;
  }

  const maybeEntries = (value as { entries?: unknown }).entries;
  if (!Array.isArray(maybeEntries)) {
    return null;
  }

  return { entries: maybeEntries as DailyScoreEntry[] };
}

function isValidDate(date: string): boolean {
  if (!DATE_PATTERN.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === date;
}

function isValidEntry(entry: DailyScoreEntry): boolean {
  const validScore =
    Number.isInteger(entry.score) && entry.score >= 0 && entry.score <= 1000;
  const validTimeTaken =
    Number.isInteger(entry.timeTaken) &&
    entry.timeTaken >= 0 &&
    entry.timeTaken <= 3600;
  const validDifficulty =
    entry.difficulty === undefined ||
    (Number.isInteger(entry.difficulty) && entry.difficulty > 0);

  return isValidDate(entry.date) && validScore && validTimeTaken && validDifficulty;
}

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
): Promise<void> {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({
      success: false,
      message: 'Method not allowed.',
    });
    return;
  }

  const body = toRequestBody(req.body);
  if (!body) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON body. Expected { entries: [...] }.',
    });
    return;
  }

  const errors: string[] = [];
  body.entries.forEach((entry, index) => {
    if (!isValidEntry(entry)) {
      errors.push(
        `Entry ${index} is invalid. date must be YYYY-MM-DD, score 0-1000, timeTaken 0-3600.`,
      );
    }
  });

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
    return;
  }

  // TODO: Add request-level rate limiting before enabling persistent DB writes.
  // DB persistence is intentionally disabled until auth is implemented and userId is trusted.
  // This keeps the endpoint validation-only for now.
  /*
  // Uncomment when auth is implemented:
  // const prisma = new PrismaClient();
  const userId = session.user.id;
  await Promise.all(
    body.entries.map((entry) =>
      prisma.dailyScore.upsert({
        where: {
          userId_date: {
            userId,
            date: entry.date,
          },
        },
        create: {
          userId,
          date: entry.date,
          score: entry.score,
          timeTaken: entry.timeTaken,
          difficulty: entry.difficulty ?? 1,
        },
        update: {
          score: entry.score,
          timeTaken: entry.timeTaken,
          difficulty: entry.difficulty ?? 1,
        },
      }),
    ),
  );
  */

  res.status(200).json({
    success: true,
    message: 'Entries validated successfully.',
    accepted: body.entries.length,
  });
}
