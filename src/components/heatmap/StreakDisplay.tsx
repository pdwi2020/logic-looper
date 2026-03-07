import { motion } from 'framer-motion';

export interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  isOnFire: boolean;
}

const milestoneValues = [7, 30, 100] as const;

const getMilestoneBadge = (streak: number): string | null => {
  if (!milestoneValues.includes(streak as (typeof milestoneValues)[number])) {
    return null;
  }

  return `${streak}-day milestone reached`;
};

export function StreakDisplay({
  currentStreak,
  longestStreak,
  isOnFire,
}: StreakDisplayProps) {
  const milestoneBadge = getMilestoneBadge(currentStreak);

  return (
    <div className="rounded-xl border border-brand-light-steel bg-brand-light-lavender/40 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark-gray">
            Current Streak
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-sans text-4xl font-bold leading-none text-brand-dark">
              {currentStreak}
            </p>
            <motion.span
              className={
                isOnFire ? 'text-brand-accent' : 'text-brand-dark-gray'
              }
              animate={
                isOnFire
                  ? {
                      scale: [1, 1.18, 1],
                      opacity: [1, 0.78, 1],
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                isOnFire
                  ? {
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }
                  : undefined
              }
              aria-hidden="true"
            >
              🔥
            </motion.span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark-gray">
            Longest Streak
          </p>
          <p className="mt-1 font-sans text-2xl font-semibold text-brand-dark">
            {longestStreak}
          </p>
        </div>
      </div>

      {milestoneBadge ? (
        <p className="mt-3 inline-flex rounded-full bg-brand-accent/15 px-3 py-1 font-sans text-xs font-semibold text-brand-accent">
          {milestoneBadge}
        </p>
      ) : null}
    </div>
  );
}
