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
        setTotalSolved(activities.filter((activity) => activity.solved).length);
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

  return (
    <div className="space-y-8">
      <GuestMode />

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
            <p className="mt-2 text-sm text-brand-dark-gray">
              No badges unlocked yet. Complete puzzles daily to unlock rewards.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  isNew={isRecentlyUnlocked(achievement)}
                />
              ))}
            </div>
          )}
        </Card>
      </motion.section>
    </div>
  );
}
