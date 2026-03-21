import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { getAllActivities } from '@/db/operations';
import type { DailyActivity } from '@/db/schemas';

interface LeaderboardEntry {
  rank: number | '—';
  player: string;
  score: number;
  streak: number;
  level: string;
  isYou?: boolean;
}

const baseLeaderboard: Omit<LeaderboardEntry, 'rank'>[] = [
  { player: 'QuantWhiz', score: 4890, streak: 71, level: 'Grandmaster' },
  { player: 'MarketSage', score: 4725, streak: 58, level: 'Grandmaster' },
  { player: 'CandleNinja', score: 4560, streak: 44, level: 'Expert' },
  { player: 'OptionOracle', score: 4410, streak: 37, level: 'Expert' },
  { player: 'BullSignal', score: 4320, streak: 34, level: 'Expert' },
  { player: 'TrendScout', score: 4185, streak: 29, level: 'Advanced' },
  { player: 'AlgoPilot', score: 4060, streak: 25, level: 'Advanced' },
  { player: 'DeltaPulse', score: 3950, streak: 20, level: 'Advanced' },
  { player: 'RiskRunner', score: 3815, streak: 16, level: 'Intermediate' },
  { player: 'LogicLynx', score: 3690, streak: 14, level: 'Intermediate' },
];

function deriveLevel(totalSolved: number): string {
  if (totalSolved >= 60) return 'Grandmaster';
  if (totalSolved >= 30) return 'Expert';
  if (totalSolved >= 14) return 'Advanced';
  if (totalSolved >= 5) return 'Intermediate';
  return 'Beginner';
}

function computeCurrentStreak(activities: DailyActivity[]): number {
  if (activities.length === 0) return 0;
  const solved = activities
    .filter((a) => a.solved)
    .map((a) => a.date)
    .sort()
    .reverse();
  if (solved.length === 0) return 0;

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const date of solved) {
    const d = new Date(date + 'T00:00:00Z');
    const diff = Math.round(
      (cursor.getTime() - d.getTime()) / 86_400_000,
    );
    if (diff === streak) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[]>(() =>
    baseLeaderboard.map((e, i) => ({ ...e, rank: i + 1 })),
  );
  const [userHasData, setUserHasData] = useState(false);

  useEffect(() => {
    getAllActivities()
      .then((activities) => {
        const solved = activities.filter((a) => a.solved);
        const bestScore = solved.length > 0
          ? Math.max(...solved.map((a) => a.score))
          : 0;
        const currentStreak = computeCurrentStreak(activities);
        const totalSolved = solved.length;

        const youEntry: Omit<LeaderboardEntry, 'rank'> = {
          player: 'You',
          score: bestScore,
          streak: currentStreak,
          level: deriveLevel(totalSolved),
          isYou: true,
        };

        setUserHasData(totalSolved > 0 || currentStreak > 0);

        const combined = [...baseLeaderboard, youEntry]
          .sort((a, b) => b.score - a.score)
          .map((entry, i) => ({ ...entry, rank: i + 1 as number }));

        setRows(combined);
      })
      .catch(() => {
        // keep static rows on error
      });
  }, []);

  return (
    <div className="space-y-6">
      <motion.section
        className="rounded-3xl bg-brand-night px-6 py-8 text-brand-white"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-light-blue">
          Rankings
        </p>
        <h1 className="mt-3 font-sans text-3xl font-bold md:text-4xl">
          Leaderboard
        </h1>
        <p className="mt-3 max-w-2xl font-body text-sm text-brand-light-steel md:text-base">
          Track top performers by puzzle score, streak consistency, and
          progression level.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <Card title="Top Players" variant="elevated">
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-light-steel text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-brand-dark-gray">
                  <th className="px-3 py-2 font-semibold">Rank</th>
                  <th className="px-3 py-2 font-semibold">Player</th>
                  <th className="px-3 py-2 font-semibold">Best Score</th>
                  <th className="px-3 py-2 font-semibold">Streak</th>
                  <th className="px-3 py-2 font-semibold">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray">
                {rows.map((entry, index) =>
                  entry.isYou ? (
                    <tr
                      key="you"
                      className="bg-brand-blue/8 text-sm font-semibold text-brand-blue"
                    >
                      <td className="px-3 py-3 text-brand-blue">
                        #{entry.rank}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-2 w-2 rounded-full bg-brand-blue" />
                          You
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {userHasData
                          ? entry.score.toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-3 py-3">
                        {entry.streak > 0 ? `${entry.streak} days` : '—'}
                      </td>
                      <td className="px-3 py-3">{entry.level}</td>
                    </tr>
                  ) : (
                    <tr key={index} className="text-sm text-brand-dark">
                      <td className="px-3 py-3 font-sans font-semibold text-brand-blue">
                        #{entry.rank}
                      </td>
                      <td className="px-3 py-3">{entry.player}</td>
                      <td className="px-3 py-3">
                        {(entry.score as number).toLocaleString()}
                      </td>
                      <td className="px-3 py-3">{entry.streak} days</td>
                      <td className="px-3 py-3">{entry.level}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {!userHasData ? (
            <p className="mt-5 rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-4 py-3 text-xs text-brand-dark-gray">
              Play your first puzzle to see yourself on the leaderboard.
              Rankings update after each solve.
            </p>
          ) : (
            <p className="mt-5 rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-4 py-3 text-xs text-brand-dark-gray">
              Your best score is shown. Full real-time rankings coming with
              authenticated accounts.
            </p>
          )}
        </Card>
      </motion.section>
    </div>
  );
}
