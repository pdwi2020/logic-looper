import { motion } from 'framer-motion';

import { Card } from '@/components/ui/Card';

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  streak: number;
  level: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    player: 'QuantWhiz',
    score: 4890,
    streak: 71,
    level: 'Grandmaster',
  },
  {
    rank: 2,
    player: 'MarketSage',
    score: 4725,
    streak: 58,
    level: 'Grandmaster',
  },
  { rank: 3, player: 'CandleNinja', score: 4560, streak: 44, level: 'Expert' },
  { rank: 4, player: 'OptionOracle', score: 4410, streak: 37, level: 'Expert' },
  { rank: 5, player: 'BullSignal', score: 4320, streak: 34, level: 'Expert' },
  { rank: 6, player: 'TrendScout', score: 4185, streak: 29, level: 'Advanced' },
  { rank: 7, player: 'AlgoPilot', score: 4060, streak: 25, level: 'Advanced' },
  { rank: 8, player: 'DeltaPulse', score: 3950, streak: 20, level: 'Advanced' },
  {
    rank: 9,
    player: 'RiskRunner',
    score: 3815,
    streak: 16,
    level: 'Intermediate',
  },
  {
    rank: 10,
    player: 'LogicLynx',
    score: 3690,
    streak: 14,
    level: 'Intermediate',
  },
];

export default function Leaderboard() {
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
        <Card title="Top 10 Players" variant="elevated">
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-light-steel text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-brand-dark-gray">
                  <th className="px-3 py-2 font-semibold">Rank</th>
                  <th className="px-3 py-2 font-semibold">Player</th>
                  <th className="px-3 py-2 font-semibold">Score</th>
                  <th className="px-3 py-2 font-semibold">Streak</th>
                  <th className="px-3 py-2 font-semibold">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray">
                {mockLeaderboard.map((entry) => (
                  <tr key={entry.rank} className="text-sm text-brand-dark">
                    <td className="px-3 py-3 font-sans font-semibold text-brand-blue">
                      #{entry.rank}
                    </td>
                    <td className="px-3 py-3">{entry.player}</td>
                    <td className="px-3 py-3">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">{entry.streak} days</td>
                    <td className="px-3 py-3">{entry.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-4 py-3 text-xs text-brand-dark-gray">
            Coming soon for authenticated users.
          </p>
        </Card>
      </motion.section>
    </div>
  );
}
