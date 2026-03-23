import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllActivities } from '@/db/operations';
import { getDailyPuzzleConfig } from '@/engine/seedGenerator';
import type { DailyActivity } from '@/db/schemas';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/Dialog';

const MS_PER_DAY = 86_400_000;

function dateStr(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * MS_PER_DAY);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDate(s: string): string {
  const d = new Date(`${s}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const TYPE_LABEL: Record<string, string> = {
  'number-matrix': 'Number Matrix',
  'sequence-solver': 'Sequence Solver',
  'equation-puzzle': 'Equation Puzzle',
};
const TYPE_SHORT: Record<string, string> = {
  'number-matrix': 'NM',
  'sequence-solver': 'SS',
  'equation-puzzle': 'EQ',
};
const DIFF_COLOR: Record<number, string> = {
  1: 'bg-green-400',
  2: 'bg-yellow-400',
  3: 'bg-brand-accent',
};

interface ArchiveDay {
  date: string;
  puzzleType: string;
  difficulty: number;
  activity: DailyActivity | null;
}

interface DetailState {
  day: ArchiveDay;
}

export default function Archive() {
  const navigate = useNavigate();
  const [days, setDays] = useState<ArchiveDay[]>([]);
  const [detail, setDetail] = useState<DetailState | null>(null);

  useEffect(() => {
    getAllActivities().then((activities) => {
      const actMap = new Map<string, DailyActivity>(activities.map((a) => [a.date, a]));
      const result: ArchiveDay[] = [];
      for (let i = 0; i < 30; i++) {
        const d = dateStr(i);
        const config = getDailyPuzzleConfig(d);
        result.push({
          date: d,
          puzzleType: config.puzzleType,
          difficulty: config.difficulty,
          activity: actMap.get(d) ?? null,
        });
      }
      setDays(result);
    });
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="font-display text-3xl font-bold text-brand-dark">
          Puzzle Archive
        </h1>
        <p className="mt-1 font-body text-sm text-brand-dark-gray">
          Last 30 days — tap any day to see details
        </p>
      </motion.div>

      <Card title="" variant="elevated" className="p-0">
        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 font-body text-xs text-brand-dark-gray">
          <span className="flex items-center gap-1"><span className="text-base">✅</span> Solved</span>
          <span className="flex items-center gap-1"><span className="text-base">❌</span> Attempted</span>
          <span className="flex items-center gap-1"><span className="text-base">⬜</span> Not played</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-400 inline-block" /> Lv 1
            <span className="ml-1 h-2 w-2 rounded-full bg-yellow-400 inline-block" /> Lv 2
            <span className="ml-1 h-2 w-2 rounded-full bg-brand-accent inline-block" /> Lv 3
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {days.map((day, idx) => {
            const isToday = idx === 0;
            const result = day.activity
              ? day.activity.solved
                ? '✅'
                : '❌'
              : '⬜';

            return (
              <motion.button
                key={day.date}
                type="button"
                onClick={() => setDetail({ day })}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors hover:border-brand-blue hover:bg-brand-light-blue/20 focus:outline-none ${
                  isToday
                    ? 'border-brand-blue bg-brand-light-blue/30'
                    : 'border-brand-light-steel bg-brand-light-gray'
                }`}
              >
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-brand-dark-gray">
                  {isToday ? 'Today' : new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2 py-0.5 font-sans text-[10px] font-bold text-brand-blue">
                  {TYPE_SHORT[day.puzzleType] ?? '??'}
                </span>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${DIFF_COLOR[day.difficulty] ?? 'bg-gray-300'}`} />
                  <span className="text-lg leading-none">{result}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Detail dialog */}
      <Dialog open={detail !== null} onOpenChange={(v) => { if (!v) setDetail(null); }}>
        <DialogPortal>
          <DialogOverlay />
          {detail && (
            <DialogContent>
              <div className="mb-4 flex items-center justify-between">
                <DialogTitle>{formatDate(detail.day.date)}</DialogTitle>
                <DialogClose className="rounded-lg p-1 text-brand-dark-gray transition-colors hover:bg-brand-light-gray hover:text-brand-dark focus:outline-none" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </DialogClose>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-brand-light-steel bg-brand-light-gray p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">Puzzle Type</p>
                      <p className="mt-0.5 font-sans text-base font-semibold text-brand-dark">
                        {TYPE_LABEL[detail.day.puzzleType] ?? detail.day.puzzleType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">Difficulty</p>
                      <p className="mt-0.5 font-sans text-base font-semibold text-brand-dark">Level {detail.day.difficulty}</p>
                    </div>
                  </div>
                </div>

                {detail.day.activity ? (
                  <div className="rounded-xl border border-brand-blue/20 bg-brand-light-sky/30 p-4">
                    <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">Your Result</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="font-sans text-xl font-bold text-brand-blue">{detail.day.activity.solved ? '✅' : '❌'}</p>
                        <p className="font-body text-xs text-brand-dark-gray">{detail.day.activity.solved ? 'Solved' : 'Gave up'}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xl font-bold text-brand-blue">{detail.day.activity.score}</p>
                        <p className="font-body text-xs text-brand-dark-gray">pts</p>
                      </div>
                      <div>
                        <p className="font-sans text-xl font-bold text-brand-blue">{formatTime(detail.day.activity.timeTaken)}</p>
                        <p className="font-body text-xs text-brand-dark-gray">time</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-brand-light-steel bg-brand-light-gray p-4 text-center">
                    <p className="font-body text-sm text-brand-dark-gray">You didn't play this day.</p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <DialogClose onClick={() => setDetail(null)}
                  className="rounded-xl border border-brand-light-steel px-4 py-2 font-sans text-sm font-medium text-brand-dark-gray transition-colors hover:border-brand-dark-gray focus:outline-none">
                  Close
                </DialogClose>
                <Button size="sm" onClick={() => { setDetail(null); void navigate('/puzzle'); }}>
                  Play Today
                </Button>
              </div>
            </DialogContent>
          )}
        </DialogPortal>
      </Dialog>
    </div>
  );
}
