import { type ComponentType, lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
  // Day 1 = Jan 1 1970; offset to a user-friendly counter starting from ~Day 1
  const dayNumber = (daysSinceEpoch % 365) + 1;

  return (
    <div className="space-y-10">
      <motion.section
        className="rounded-3xl bg-brand-hero px-6 py-10 text-brand-white shadow-lg shadow-brand-blue/20 md:px-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-light-blue">
          Logic Looper &mdash; Day {dayNumber}
        </p>
        <h1 className="mt-3 font-sans text-3xl font-bold md:text-5xl">
          One puzzle. Every day. No retries.
        </h1>
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
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              title={feature.title}
              variant={feature.variant}
            >
              {feature.description}
            </Card>
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
