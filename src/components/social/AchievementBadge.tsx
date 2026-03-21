import { motion } from 'framer-motion';

import type { Achievement } from '@/db/schemas';

interface AchievementBadgeProps {
  achievement: Achievement;
  isNew: boolean;
}

const iconByType: Record<Achievement['type'], string> = {
  streak: '🔥',
  milestone: '⭐',
  perfect: '🏆',
};

const iconBackgroundByType: Record<Achievement['type'], string> = {
  streak: 'bg-brand-accent/15',
  milestone: 'bg-brand-blue/15',
  perfect: 'bg-brand-purple/15',
};

export function AchievementBadge({
  achievement,
  isNew,
}: AchievementBadgeProps) {
  return (
    <motion.article
      initial={
        isNew
          ? { opacity: 0, scale: 0.75, rotate: -8 }
          : { opacity: 1, scale: 1, rotate: 0 }
      }
      animate={
        isNew
          ? {
              opacity: 1,
              scale: [0.75, 1.14, 1],
              rotate: [-8, 4, 0],
            }
          : { opacity: 1, scale: 1, rotate: 0 }
      }
      transition={{
        duration: isNew ? 0.65 : 0.2,
        times: isNew ? [0, 0.6, 1] : undefined,
        ease: 'easeOut',
      }}
      className="flex items-start gap-3 rounded-xl border border-brand-light-periwinkle bg-brand-white p-3 shadow-sm"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${iconBackgroundByType[achievement.type]}`}
      >
        {iconByType[achievement.type]}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-sans text-sm font-semibold text-brand-dark">
            {achievement.label}
          </h3>
          {isNew ? (
            <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-white">
              New
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-brand-dark-gray">
          {achievement.description}
        </p>
      </div>
    </motion.article>
  );
}

export default AchievementBadge;
