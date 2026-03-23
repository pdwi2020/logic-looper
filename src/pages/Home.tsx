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

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-green-400" fill="currentColor" aria-hidden="true">
      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
    </svg>
  );
}

const features = [
  {
    title: 'Daily Logic Challenges',
    description:
      'A new puzzle drops every midnight UTC, seeded identically for all players worldwide via HMAC-SHA256. Same day, same puzzle — always.',
    variant: 'elevated' as const,
  },
  {
    title: 'Streak Tracking',
    description:
      'Visual contribution heatmaps, current and longest streak counters, and an "On Fire" indicator that kicks in after 3 consecutive days.',
    variant: 'outlined' as const,
  },
  {
    title: 'Leaderboard Ranks',
    description:
      'Climb five levels from Beginner to Grandmaster. Score is determined by accuracy, time taken, and how many hints you needed.',
    variant: 'default' as const,
  },
  {
    title: 'Three Puzzle Types',
    description:
      'Number Matrix grids, missing-term Sequence Solvers, and algebraic Equation Puzzles — the type rotates weekly so every day feels fresh.',
    variant: 'elevated' as const,
  },
  {
    title: 'Progressive Hints',
    description:
      'Three-level hint system: vague clue → structural guidance → explicit answer path. Each level costs 10 points from your final score.',
    variant: 'default' as const,
  },
  {
    title: 'Share Your Score',
    description:
      'One-tap Wordle-style emoji grid. Native Web Share API on mobile with clipboard fallback on desktop. Colorblind-safe emoji option in Settings.',
    variant: 'outlined' as const,
  },
];

const howItWorks = [
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
];

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
    <div className="space-y-12">

      {/* ── HERO ── */}
      <motion.section
        className="noise-overlay relative overflow-hidden rounded-3xl bg-brand-hero px-6 py-14 text-brand-white shadow-xl shadow-brand-blue/20 md:px-12 md:py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-purple/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-brand-blue/40 blur-3xl" />
        {/* Dot texture */}
        <div className="dot-pattern pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative z-10 grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left: text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-light-sky/30 bg-brand-white/10 px-3 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="font-sans text-xs font-semibold text-brand-light-sky">
                Day {dayNumber} · Live Now
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
              One puzzle.<br />Every day.<br />
              <span className="gradient-text">No retries.</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-brand-light-sky/80">
              Sharpen your mind with daily logic challenges — Number Matrix, Sequence Solver,
              and Equation Puzzle. Track your streak, compare scores, compete worldwide.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/puzzle')}
              >
                Play Today →
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border-brand-light-sky/40 text-brand-light-sky hover:bg-brand-white/10"
                onClick={() => navigate('/archive')}
              >
                View Archive
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 font-body text-sm text-brand-light-sky/70">
              {['Free forever', 'No login needed', 'Works offline'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckIcon />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating game card (desktop only) */}
          <div className="hidden md:flex md:justify-end">
            <div className="w-72 rounded-2xl border border-brand-white/20 bg-brand-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-brand-blue px-3 py-1 font-sans text-xs font-bold text-white">
                  {puzzleTypeLabel}
                </span>
                <span className="font-body text-xs text-brand-light-sky/70">
                  Level {todayConfig.difficulty}
                </span>
              </div>
              <p className="font-sans text-sm font-semibold text-brand-white">
                Today's Challenge
              </p>
              <p className="mt-1 font-body text-xs text-brand-light-sky/60">
                A fresh puzzle waits — same seed for every player worldwide.
              </p>
              <Button
                variant="primary"
                className="mt-5 w-full"
                onClick={() => navigate('/puzzle')}
              >
                Start Solving →
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── STATS STRIP ── */}
      <motion.section
        className="overflow-hidden rounded-3xl bg-brand-night"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
          {[
            { value: '3',    label: 'Puzzle Types',     sub: 'Matrix · Sequence · Equation' },
            { value: '3',    label: 'Difficulty Levels', sub: 'Easy → Hard weekly arc' },
            { value: '100%', label: 'Offline-First',    sub: 'No internet required' },
            { value: '∞',    label: 'Daily Streaks',    sub: 'New challenge every midnight' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="px-6 py-10 text-center"
            >
              <p className="font-display text-5xl font-black text-brand-blue">{stat.value}</p>
              <p className="mt-2 font-sans text-sm font-semibold text-brand-white">{stat.label}</p>
              <p className="mt-1 font-body text-xs text-brand-light-steel/60">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FEATURES ── */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            WHAT YOU GET
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-dark md:text-4xl">
            Everything you need to get hooked
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.38 }}
            >
              <Card title={f.title} variant={f.variant} className="h-full">
                {f.description}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ── */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            THE LOOP
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-dark md:text-4xl">
            How it works
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="pointer-events-none absolute left-[33%] right-[33%] top-7 hidden h-px bg-brand-light-steel sm:block" />

          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.38 }}
              className="relative overflow-hidden rounded-2xl border border-brand-light-steel bg-brand-white p-5 shadow-sm"
            >
              {/* Decorative large step number */}
              <span
                className="pointer-events-none absolute -right-3 -top-4 select-none font-display text-[5rem] font-black leading-none text-brand-blue/8"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <div className="relative flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-hero font-sans text-sm font-bold text-white shadow-md">
                  {item.step}
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-brand-dark">{item.title}</p>
                  <p className="mt-1 font-body text-sm text-brand-dark-gray">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── MID-PAGE CTA ── */}
      <motion.section
        className="noise-overlay rounded-3xl bg-gradient-to-r from-brand-blue to-brand-purple px-8 py-14 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-light-sky/70">
          JOIN THOUSANDS OF DAILY SOLVERS
        </p>
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          Ready to test your logic?
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body text-base text-brand-light-sky/80">
          One puzzle, every day. Build your streak — no account required.
        </p>
        <Button
          variant="accent"
          size="lg"
          className="mt-8"
          onClick={() => navigate('/puzzle')}
        >
          Start Playing — It's Free →
        </Button>
      </motion.section>

      {/* ── FAQ ── */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            FREQUENTLY ASKED
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-dark md:text-4xl">
            Got questions? We've got answers.
          </h2>
        </div>

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
              a: "Yes. All progress is saved to your browser's IndexedDB storage, which persists across sessions. Clear your browser data or private mode will reset it.",
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
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <p className="mt-2 font-body text-sm text-brand-dark-gray">{item.a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* ── PUZZLE PREVIEW (lazy) ── */}
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
            This section lazy-loads the puzzle container to keep the home page light.
          </p>
          <Suspense fallback={<PuzzlePreviewFallback />}>
            <LazyPuzzleContainer />
          </Suspense>
        </motion.section>
      ) : (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="font-body text-xs text-brand-dark-gray underline-offset-2 hover:underline"
          >
            Load Puzzle Preview
          </button>
        </div>
      )}
    </div>
  );
}
