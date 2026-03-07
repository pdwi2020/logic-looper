import { type ComponentType, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const LazyPuzzleContainer = lazy(async () => {
  const module = await import('@/components/puzzle/PuzzleContainer');

  return {
    default: (module.default ?? module.PuzzleContainer) as ComponentType,
  };
});

function PuzzleLoadingFallback() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-brand-light-steel bg-brand-white shadow-sm">
      <div className="flex items-center gap-3 font-sans text-sm font-medium text-brand-dark-gray">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue/40 border-t-brand-blue" />
        Loading daily puzzle...
      </div>
    </div>
  );
}

export default function Puzzle() {
  return (
    <div className="space-y-6">
      <motion.section
        className="rounded-3xl bg-brand-hero px-6 py-8 text-brand-white"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-light-blue">
          Daily Challenge
        </p>
        <h1 className="mt-3 font-sans text-3xl font-bold md:text-4xl">
          Puzzle Arena
        </h1>
        <p className="mt-3 max-w-2xl font-body text-sm text-brand-light-sky md:text-base">
          Stay consistent, solve accurately, and improve your streak one puzzle
          at a time.
        </p>
      </motion.section>

      <Suspense fallback={<PuzzleLoadingFallback />}>
        <LazyPuzzleContainer />
      </Suspense>
    </div>
  );
}
