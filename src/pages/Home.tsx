import { type ComponentType, lazy, Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getDailyPuzzleConfig } from '@/engine/seedGenerator';

const LazyPuzzleContainer = lazy(async () => {
  const module = await import('@/components/puzzle/PuzzleContainer');

  return {
    default: (module.default ?? module.PuzzleContainer) as ComponentType,
  };
});

const features = [
  {
    title: '\ud83e\udde0 Daily Puzzles',
    description:
      'A fresh logic challenge drops every day so you can build consistency and sharpen your speed.',
    variant: 'elevated' as const,
  },
  {
    title: '\ud83d\udcc5 Streak Tracking',
    description:
      'Track every completion with visual heatmaps and streak milestones tied to your daily progress.',
    variant: 'default' as const,
  },
  {
    title: '\ud83c\udfc6 Compete',
    description:
      'Climb leaderboard ranks based on accuracy, timing, and sustained streak strength over time.',
    variant: 'outlined' as const,
  },
];

const MS_PER_DAY = 86_400_000;

function getDaysSinceEpoch(): number {
  return Math.floor(Date.now() / MS_PER_DAY);
}

function PuzzlePreviewFallback() {
  return (
    <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-brand-light-steel bg-brand-white">
      <div className="flex items-center gap-3 font-sans text-sm font-medium text-brand-dark-gray">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue/40 border-t-brand-blue" />
        Loading puzzle preview...
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const daysSinceEpoch = getDaysSinceEpoch();
  const dayNumber = (daysSinceEpoch % 365) + 1;

  const todayConfig = useMemo(() => {
    const now = new Date();
    const d = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return getDailyPuzzleConfig(d);
  }, []);

  const puzzleTypeLabel =
    todayConfig.puzzleType === 'number-matrix'
      ? 'Number Matrix'
      : todayConfig.puzzleType === 'sequence-solver'
        ? 'Sequence Solver'
        : 'Equation Puzzle';

  return (
    <div className="space-y-10">
      <motion.section
        className="noise-overlay rounded-3xl bg-brand-hero px-6 py-10 text-brand-white shadow-lg shadow-brand-blue/20 md:px-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-light-blue">
          Logic Looper &mdash; Day {dayNumber}
        </p>
        <h1 className="animated-gradient-text mt-3 font-display text-3xl font-bold md:text-5xl">
          One puzzle. Every day. No retries.
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-light-sky/30 bg-brand-white/10 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="font-sans text-xs font-semibold text-brand-light-sky">
            Today: {puzzleTypeLabel} · Level {todayConfig.difficulty}
          </span>
        </div>
        <p className="mt-4 max-w-2xl font-body text-base text-brand-light-sky md:text-lg">
          Solve one focused challenge each day, build your streak, and improve
          with every attempt.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="lg"
            className="focus-visible:ring-offset-brand-blue"
            onClick={() => {
              navigate('/puzzle');
            }}
          >
            Play Today
          </Button>

          <Button
            variant="ghost"
            className="border-brand-light-sky text-brand-light-sky hover:bg-brand-white/10"
            onClick={() => {
              setShowPreview((prev) => !prev);
            }}
          >
            {showPreview ? 'Hide Puzzle Preview' : 'Load Puzzle Preview'}
          </Button>
        </div>
      </motion.section>

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h2 className="font-sans text-2xl font-semibold text-brand-dark">
          Core Features
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="sm:col-span-2 md:col-span-3 md:row-span-2">
            <Card title={features[0].title} variant={features[0].variant} className="h-full">
              {features[0].description}
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card title={features[1].title} variant={features[1].variant}>
              {features[1].description}
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card title={features[2].title} variant={features[2].variant}>
              {features[2].description}
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {[
          { value: '3', label: 'Puzzle Types' },
          { value: '3', label: 'Difficulty Levels' },
          { value: '100%', label: 'Offline-First' },
          { value: 'Open', label: 'Source' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="rounded-2xl border border-brand-light-steel bg-brand-white px-4 py-5 text-center shadow-sm"
          >
            <p className="font-display text-3xl font-bold text-brand-blue">{stat.value}</p>
            <p className="mt-1 font-body text-xs text-brand-dark-gray">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h2 className="font-sans text-2xl font-semibold text-brand-dark">How It Works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'A new puzzle drops daily',
              body: 'Every day at midnight UTC, a fresh challenge is seeded deterministically — every player worldwide gets the same puzzle.',
            },
            {
              step: '2',
              title: 'Solve it fast',
              body: 'Race the clock across three puzzle types: Number Matrix, Sequence Solver, and Equation Puzzle. Time and hints both affect your final score.',
            },
            {
              step: '3',
              title: 'Share & compete',
              body: 'After solving, share your emoji result card to social media and climb the leaderboard by building your daily streak.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.38 }}
              className="flex gap-4 rounded-2xl border border-brand-light-steel bg-brand-white p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue font-sans text-sm font-bold text-white">
                {item.step}
              </span>
              <div>
                <p className="font-sans text-sm font-semibold text-brand-dark">{item.title}</p>
                <p className="mt-1 font-body text-sm text-brand-dark-gray">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h2 className="font-sans text-2xl font-semibold text-brand-dark">Frequently Asked Questions</h2>
        <div className="divide-y divide-brand-light-steel overflow-hidden rounded-2xl border border-brand-light-steel bg-brand-white">
          {[
            {
              q: 'What is Logic Looper?',
              a: 'Logic Looper is a free, offline-first daily puzzle game. One challenge drops every day — solve it, build your streak, and compare your score on the leaderboard.',
            },
            {
              q: 'Is it free? Will it always be free?',
              a: 'Yes, completely free. No ads, no paywalls, no account required to play. Your progress is stored locally in your browser.',
            },
            {
              q: 'How does the daily puzzle work? Can two players get different puzzles?',
              a: 'No — the same puzzle is seeded for everyone worldwide using an HMAC-SHA256 hash of the date. Two players on the same day always see the same puzzle.',
            },
            {
              q: 'Will my streak and stats save if I close the browser?',
              a: 'Yes. All progress is saved to your browser\'s IndexedDB storage, which persists across sessions. Clear your browser data or private mode will reset it.',
            },
            {
              q: "What's coming next?",
              a: 'User accounts for cross-device sync, a real-time global leaderboard, and more puzzle types are on the roadmap.',
            },
          ].map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-sm font-semibold text-brand-dark">
                {item.q}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0 text-brand-dark-gray transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-2 font-body text-sm text-brand-dark-gray">{item.a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {showPreview ? (
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <h2 className="font-sans text-xl font-semibold text-brand-dark">
            Puzzle Preview
          </h2>
          <p className="font-body text-sm text-brand-dark-gray">
            This section lazy-loads the puzzle container to keep the home page
            light.
          </p>
          <Suspense fallback={<PuzzlePreviewFallback />}>
            <LazyPuzzleContainer />
          </Suspense>
        </motion.section>
      ) : null}
    </div>
  );
}
