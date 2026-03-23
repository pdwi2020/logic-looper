import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { getAllActivities } from '@/db/operations';
import type { DailyActivity } from '@/db/schemas';

const listVariants = {
  visible: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  streak: number;
  level: string;
  isYou?: boolean;
}

const baseLeaderboard: Omit<LeaderboardEntry, 'rank'>[] = [
  { player: 'QuantWhiz',    score: 4890, streak: 71, level: 'Grandmaster' },
  { player: 'MarketSage',   score: 4725, streak: 58, level: 'Grandmaster' },
  { player: 'CandleNinja',  score: 4560, streak: 44, level: 'Expert' },
  { player: 'OptionOracle', score: 4410, streak: 37, level: 'Expert' },
  { player: 'BullSignal',   score: 4320, streak: 34, level: 'Expert' },
  { player: 'TrendScout',   score: 4185, streak: 29, level: 'Advanced' },
  { player: 'AlgoPilot',    score: 4060, streak: 25, level: 'Advanced' },
  { player: 'DeltaPulse',   score: 3950, streak: 20, level: 'Advanced' },
  { player: 'RiskRunner',   score: 3815, streak: 16, level: 'Intermediate' },
  { player: 'LogicLynx',    score: 3690, streak: 14, level: 'Intermediate' },
];

const MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_STYLES = [
  'border-2 border-yellow-400/40 bg-gradient-to-b from-yellow-50 to-white shadow-lg shadow-yellow-100/60',
  'border-2 border-gray-300/50 bg-gradient-to-b from-gray-50 to-white shadow-md shadow-gray-100/50',
  'border-2 border-amber-600/30 bg-gradient-to-b from-amber-50 to-white shadow-md shadow-amber-100/40',
];

function levelBadgeClass(level: string): string {
  if (level === 'Grandmaster') return 'bg-brand-blue/10 text-brand-blue';
  if (level === 'Expert')      return 'bg-brand-purple/10 text-brand-purple';
  if (level === 'Advanced')    return 'bg-brand-light-sky text-brand-deep-purple';
  return 'bg-brand-light-gray text-brand-dark-gray';
}

function deriveLevel(totalSolved: number): string {
  if (totalSolved >= 60) return 'Grandmaster';
  if (totalSolved >= 30) return 'Expert';
  if (totalSolved >= 14) return 'Advanced';
  if (totalSolved >= 5)  return 'Intermediate';
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
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const date of solved) {
    const d = new Date(date + 'T00:00:00Z');
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86_400_000);
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
          .map((entry, i) => ({ ...entry, rank: i + 1 }));

        setRows(combined);
      })
      .catch(() => {
        // keep static rows on error
      });
  }, []);

  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="space-y-6">

      {/* Hero */}
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
        <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          Leaderboard
        </h1>
        <p className="mt-3 max-w-2xl font-body text-sm text-brand-light-steel md:text-base">
          Track top performers by puzzle score, streak consistency, and progression level.
        </p>
      </motion.section>

      {/* Podium — top 3 */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
          TOP PERFORMERS
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {podium.map((entry, i) => (
            <motion.div
              key={entry.player}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className={`rounded-2xl p-6 text-center ${
                entry.isYou
                  ? 'glow-blue-sm ring-1 ring-brand-blue/20 bg-brand-light-lavender border-2 border-brand-blue/30'
                  : PODIUM_STYLES[i]
              }`}
            >
              <p className="text-4xl">{MEDALS[i]}</p>
              <p className={`mt-3 font-sans text-lg font-bold ${entry.isYou ? 'text-brand-blue' : 'text-brand-dark'}`}>
                {entry.isYou ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-blue" />
                    You
                  </span>
                ) : entry.player}
              </p>
              <p className="mt-1 font-display text-3xl font-black text-brand-blue">
                {userHasData || !entry.isYou ? entry.score.toLocaleString() : '—'}
              </p>
              <p className="mt-2 font-body text-xs text-brand-dark-gray">
                {entry.streak > 0 ? `${entry.streak}-day streak` : 'No streak'} · {entry.level}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Ranks 4+ card list */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
          ALL RANKINGS
        </p>
        <motion.div
          className="space-y-2"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {rest.map((entry) => (
            <motion.div
              key={entry.player}
              variants={itemVariants}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 shadow-sm ${
                entry.isYou
                  ? 'glow-blue-sm border-brand-blue/30 bg-brand-light-lavender'
                  : 'border-brand-light-steel bg-brand-white'
              }`}
            >
              <span className="w-8 shrink-0 text-right font-sans text-sm font-bold text-brand-dark-gray">
                #{entry.rank}
              </span>
              <span
                className={`flex-1 font-sans text-sm font-semibold ${
                  entry.isYou ? 'text-brand-blue' : 'text-brand-dark'
                }`}
              >
                {entry.isYou ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-blue" />
                    You
                  </span>
                ) : (
                  entry.player
                )}
              </span>
              <span className="font-mono text-sm font-bold text-brand-blue">
                {userHasData || !entry.isYou ? entry.score.toLocaleString() : '—'}
              </span>
              <span className="hidden font-body text-xs text-brand-dark-gray sm:block">
                {entry.streak > 0 ? `${entry.streak}d` : '—'}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase ${levelBadgeClass(entry.level)}`}
              >
                {entry.level}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-5 rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-4 py-3 font-body text-xs text-brand-dark-gray">
          {userHasData
            ? 'Your best score is shown. Full real-time rankings coming with authenticated accounts.'
            : 'Play your first puzzle to see yourself on the leaderboard. Rankings update after each solve.'}
        </p>
      </motion.section>
    </div>
  );
}
