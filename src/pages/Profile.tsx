import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { GuestMode } from '@/components/auth/GuestMode';
import { HeatmapContainer } from '@/components/heatmap/HeatmapContainer';
import { AchievementBadge } from '@/components/social/AchievementBadge';
import { Card } from '@/components/ui/Card';
import { getAchievements, getAllActivities } from '@/db/operations';
import type { Achievement } from '@/db/schemas';
import { useStreak } from '@/hooks/useStreak';

const NEW_ACHIEVEMENT_WINDOW_HOURS = 24;

const isRecentlyUnlocked = (achievement: Achievement): boolean => {
  if (!achievement.unlockedAt) {
    return false;
  }

  return (
    dayjs().diff(dayjs(achievement.unlockedAt), 'hour') <=
    NEW_ACHIEVEMENT_WINDOW_HOURS
  );
};

export default function Profile() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [totalTimeMins, setTotalTimeMins] = useState<number>(0);
  const [isLoadingAchievements, setIsLoadingAchievements] =
    useState<boolean>(true);
  const {
    currentStreak,
    longestStreak,
    isOnFire,
    isLoading: isStreakLoading,
  } = useStreak();

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async (): Promise<void> => {
      setIsLoadingAchievements(true);

      try {
        const [savedAchievements, activities] = await Promise.all([
          getAchievements(),
          getAllActivities(),
        ]);

        if (!isMounted) {
          return;
        }

        setAchievements(savedAchievements);
        const solved = activities.filter((a) => a.solved);
        setTotalSolved(solved.length);
        if (solved.length > 0) {
          setBestScore(Math.max(...solved.map((a) => a.score)));
          setAvgScore(Math.round(solved.reduce((s, a) => s + a.score, 0) / solved.length));
        }
        setTotalTimeMins(Math.round(activities.reduce((s, a) => s + a.timeTaken, 0) / 60));
      } finally {
        if (isMounted) {
          setIsLoadingAchievements(false);
        }
      }
    };

    void loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedAchievements = useMemo(
    () =>
      [...achievements].sort((left, right) => {
        const leftKey = left.unlockedAt ?? '';
        const rightKey = right.unlockedAt ?? '';
        return rightKey.localeCompare(leftKey);
      }),
    [achievements],
  );

  const motivationalMessage = isStreakLoading
    ? null
    : currentStreak >= 30
      ? `🏆 Legendary! ${currentStreak}-day streak. You're unstoppable.`
      : currentStreak >= 7
        ? `🔥 You're on fire! ${currentStreak}-day streak. Keep the chain alive.`
        : currentStreak >= 3
          ? `⚡ Building momentum — ${currentStreak} days and counting!`
          : currentStreak === 1
            ? '✅ First step taken. Come back tomorrow to build your streak.'
            : '👋 No streak yet. Play today\'s puzzle to start your journey.';

  return (
    <div className="space-y-8">
      <GuestMode />

      {motivationalMessage ? (
        <motion.div
          className="rounded-2xl bg-brand-night px-5 py-4 text-brand-white"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <p className="font-sans text-base font-semibold">
            {motivationalMessage}
          </p>
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Card
          title={isOnFire ? 'Streak On Fire 🔥' : 'Streak Stats'}
          variant="elevated"
        >
          {isStreakLoading ? (
            <p className="mt-2 font-body text-sm text-brand-dark-gray">
              Loading streak stats...
            </p>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-brand-light-blue/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">
                    Current Streak
                  </p>
                  <p className="mt-2 font-sans text-4xl font-bold text-brand-blue">
                    {currentStreak}
                  </p>
                  <p className="text-xs text-brand-dark-gray">days in a row</p>
                </div>

                <div className="rounded-xl bg-brand-light-lavender p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">
                    Longest Streak
                  </p>
                  <p className="mt-2 font-sans text-4xl font-bold text-brand-purple">
                    {longestStreak}
                  </p>
                  <p className="text-xs text-brand-dark-gray">
                    best run to date
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-light-steel bg-brand-white px-4 py-3">
                <p className="text-sm text-brand-dark-gray">
                  {isOnFire
                    ? 'You are maintaining momentum. Keep solving daily.'
                    : 'Solve today to start or revive your streak.'}
                </p>
                <span className="font-sans text-lg font-semibold text-brand-dark">
                  Total Solved: {totalSolved}
                </span>
              </div>
            </>
          )}
        </Card>
      </motion.section>

      {totalSolved > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
        >
          <Card title="Stats at a Glance" variant="default">
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Puzzles Solved', value: totalSolved.toString() },
                { label: 'Best Score', value: bestScore > 0 ? bestScore.toLocaleString() : '—' },
                { label: 'Avg Score', value: avgScore > 0 ? avgScore.toLocaleString() : '—' },
                { label: 'Time Played', value: totalTimeMins > 0 ? `${totalTimeMins} min` : '—' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-brand-light-blue/30 px-3 py-3 text-center"
                >
                  <p className="font-sans text-2xl font-bold text-brand-blue">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-brand-dark-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <HeatmapContainer />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <Card title="Achievement Badges" variant="default">
          {isLoadingAchievements ? (
            <p className="mt-2 text-sm text-brand-dark-gray">
              Loading achievements...
            </p>
          ) : sortedAchievements.length === 0 ? (
            <div className="mt-2 space-y-3">
              <p className="text-sm text-brand-dark-gray">
                No badges unlocked yet. Complete puzzles daily to unlock rewards.
              </p>
              <div className="rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-3 py-2 text-xs text-brand-dark-gray">
                <span className="font-semibold text-brand-purple">Next up:</span>{' '}
                Solve your first puzzle to earn the{' '}
                <span className="font-semibold">⭐ First Solve</span> badge.
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sortedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isNew={isRecentlyUnlocked(achievement)}
                  />
                ))}
              </div>
              {currentStreak < 7 && (
                <div className="rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-3 py-2 text-xs text-brand-dark-gray">
                  <span className="font-semibold text-brand-purple">Next up:</span>{' '}
                  Solve 7 days in a row to unlock the{' '}
                  <span className="font-semibold">🔥 Week Warrior</span> badge.
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.section>
    </div>
  );
}
