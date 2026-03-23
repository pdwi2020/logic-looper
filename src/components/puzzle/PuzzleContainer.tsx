import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CountUp } from '@/components/ui/CountUp';
import { HintDrawer } from '@/components/puzzle/HintDrawer';
import { HowToPlayDialog } from '@/components/puzzle/HowToPlayDialog';
import { generateShareText, generateTweetUrl } from '@/lib/share';

import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { SequenceView } from '@/components/puzzle/SequenceView';
import { EquationView } from '@/components/puzzle/EquationView';
import { Timer } from '@/components/puzzle/Timer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  getAchievements,
  getActivity,
  getAllActivities,
  saveAchievement,
  saveActivity,
} from '@/db/operations';
import { generateDailyPuzzle, validatePuzzleAnswer } from '@/engine';
import type { PuzzleType } from '@/engine';
import type { NumberMatrixPuzzle } from '@/engine/puzzles/numberMatrix';
import { puzzleCompleted } from '@/store/slices';
import type { AppDispatch } from '@/store/store';
import type { Achievement, DailyActivity } from '@/db/schemas';
import { checkAchievements } from '@/services/achievementService';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
} from '@/services/streakService';

function formatSecondsToClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function calculateScore(timeTaken: number, difficulty: number): number {
  const timeFactor =
    timeTaken < 30
      ? 100
      : timeTaken < 60
        ? 85
        : timeTaken < 90
          ? 70
          : timeTaken < 120
            ? 55
            : 40;

  const diffMultiplier =
    difficulty === 1 ? 1.0 : difficulty === 2 ? 1.5 : 2.0;

  return Math.round(timeFactor * diffMultiplier);
}

const winMessages: Record<PuzzleType, string> = {
  'number-matrix': 'Sharp eye for patterns — the grid was no match.',
  'sequence-solver': 'You cracked the rule. Clean logical thinking.',
  'equation-puzzle': 'Excellent algebraic reasoning. Textbook solve.',
};

export function PuzzleContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const dailyPuzzle = useMemo(() => generateDailyPuzzle(), []);
  const { puzzle, type } = dailyPuzzle;

  const [userAnswer, setUserAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isGivenUp, setIsGivenUp] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  // hintLevel: 0 = none, 1/2/3 = progressive hints (matrix supports 3; others support 1)
  const [hintLevel, setHintLevel] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [hintDrawerOpen, setHintDrawerOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [todayActivity, setTodayActivity] = useState<
    DailyActivity | null | undefined
  >(undefined);

  const maxHintLevel = type === 'number-matrix' ? 3 : 1;
  const hintPenalty = hintLevel * 10;
  const showHint = hintLevel > 0;
  const canGiveUp = wrongCount >= 3 && !isComplete && !isGivenUp;

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    getActivity(today).then((activity) => {
      setTodayActivity(activity ?? null);
    });
  }, [today]);

  // Auto-show "How to Play" on first visit
  useEffect(() => {
    if (!localStorage.getItem('ll-htps')) {
      setHowToPlayOpen(true);
    }
  }, []);

  useEffect(() => {
    if (newAchievements.length === 0) return;
    newAchievements.forEach((ach, i) => {
      setTimeout(() => {
        toast.success(ach.label, {
          description: ach.description,
          duration: 4500,
          action: {
            label: 'View Profile',
            onClick: (_event: React.MouseEvent<HTMLButtonElement>) => navigate('/profile'),
          },
        });
      }, i * 500);
    });
  }, [newAchievements, navigate]);

  const handleTimeUpdate = useCallback((seconds: number) => {
    setTimeTaken(seconds);
  }, []);

  const handleAnswerChange = useCallback((value: string) => {
    setUserAnswer(value);
    setShowTryAgain(false);
  }, []);

  const handleShowHint = useCallback(() => {
    setHintLevel((prev) => {
      const next = Math.min(prev + 1, maxHintLevel);
      if (next > prev) {
        setHintDrawerOpen(true);
      }
      return next;
    });
  }, [maxHintLevel]);

  const handleSubmit = useCallback(async () => {
    if (isComplete || isSaving || isGivenUp) {
      return;
    }

    const numericAnswer = Number(userAnswer.trim());
    if (!Number.isFinite(numericAnswer)) {
      setShowTryAgain(true);
      setWrongCount((c) => c + 1);
      navigator.vibrate?.([10, 50, 10]);
      return;
    }

    const isCorrect = validatePuzzleAnswer(puzzle, type, numericAnswer);

    if (!isCorrect) {
      setShowTryAgain(true);
      setWrongCount((c) => c + 1);
      navigator.vibrate?.([10, 50, 10]);
      return;
    }

    const currentHintPenalty = hintLevel * 10;
    const baseScore = calculateScore(timeTaken, puzzle.difficulty);
    const finalScore = Math.max(0, baseScore - currentHintPenalty);

    setScore(finalScore);
    setIsComplete(true);
    setShowResult(true);
    setShowConfetti(true);
    navigator.vibrate?.(80);
    setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
    setShowTryAgain(false);
    setSaveError(null);
    setIsSaving(true);

    try {
      await saveActivity({
        date: today,
        solved: true,
        score: finalScore,
        timeTaken,
        difficulty: puzzle.difficulty,
        synced: false,
      });

      dispatch(puzzleCompleted());

      const freshActivities = await getAllActivities();
      const totalSolvedCount = freshActivities.filter((a) => a.solved).length;
      const curStreak = calculateCurrentStreak(freshActivities);
      const lonStreak = calculateLongestStreak(freshActivities);
      const potentials = checkAchievements(
        curStreak,
        lonStreak,
        totalSolvedCount,
        freshActivities,
      );
      const savedAchs = await getAchievements();
      const savedIds = new Set(savedAchs.map((a) => a.id));
      const freshOnes = potentials.filter((a) => !savedIds.has(a.id));
      await Promise.all(freshOnes.map((a) => saveAchievement(a)));
      if (freshOnes.length > 0) {
        setNewAchievements(freshOnes);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to save puzzle result.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }, [
    dispatch,
    hintLevel,
    isComplete,
    isGivenUp,
    isSaving,
    puzzle,
    timeTaken,
    today,
    type,
    userAnswer,
  ]);

  const handleGiveUp = useCallback(async () => {
    setIsGivenUp(true);
    setIsComplete(true);
    setShowTryAgain(false);
    setIsSaving(true);

    try {
      await saveActivity({
        date: today,
        solved: false,
        score: 0,
        timeTaken,
        difficulty: puzzle.difficulty,
        synced: false,
      });
    } catch {
      // non-critical — don't surface save error on give-up
    } finally {
      setIsSaving(false);
    }
  }, [puzzle.difficulty, timeTaken, today]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        void handleSubmit();
      }
    },
    [handleSubmit],
  );

  // Resolve the hint text for the current hint level
  const currentHintText = useMemo(() => {
    if (!showHint) return '';
    if (type === 'number-matrix' && 'hints' in puzzle) {
      const level = Math.min(hintLevel - 1, 2);
      return (puzzle as NumberMatrixPuzzle).hints[level];
    }
    return puzzle.hint;
  }, [showHint, type, puzzle, hintLevel]);

  const submitDisabled =
    userAnswer.trim().length === 0 || isComplete || isSaving || isGivenUp;
  const hintDisabled = hintLevel >= maxHintLevel || isComplete || isGivenUp;

  const puzzleTitle =
    type === 'number-matrix'
      ? 'Number Matrix'
      : type === 'sequence-solver'
        ? 'Sequence Solver'
        : 'Equation Puzzle';

  const hintLabel =
    type === 'number-matrix' && hintLevel > 0 && hintLevel < 3
      ? `Hint ${hintLevel + 1} (-10)`
      : 'Hint (-10)';

  const sharePreviewText = useMemo(
    () =>
      generateShareText({
        wrongCount,
        solved: !isGivenUp,
        hintLevel,
        score,
        timeTaken,
        difficulty: puzzle.difficulty,
        puzzleType: type,
      }),
    [wrongCount, isGivenUp, hintLevel, score, timeTaken, puzzle.difficulty, type],
  );

  const handleShareScore = useCallback(() => {
    const text = sharePreviewText;
    const canNativeShare = typeof navigator.share === 'function';
    if (canNativeShare) {
      void navigator.share({ text }).catch(() => {
        // user cancelled or not supported — silent fail
      });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [sharePreviewText]);

  if (todayActivity === undefined) {
    return (
      <Card
        title="Daily Puzzle"
        variant="elevated"
        className="mx-auto w-full max-w-3xl"
      >
        <div className="flex h-32 items-center justify-center">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue/40 border-t-brand-blue" />
        </div>
      </Card>
    );
  }

  if (todayActivity !== null && todayActivity.solved) {
    return (
      <Card
        title="Daily Puzzle: Already Completed"
        variant="elevated"
        className="mx-auto w-full max-w-3xl"
      >
        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-brand-blue/25 bg-brand-light-sky/35 p-4">
            <p className="font-sans text-lg font-bold text-brand-blue">
              Today's puzzle is done!
            </p>
            <p className="mt-1 font-body text-sm text-brand-dark">
              Score:{' '}
              <span className="font-semibold">
                {todayActivity.score.toLocaleString()}
              </span>
            </p>
            <p className="font-body text-sm text-brand-dark">
              Time:{' '}
              <span className="font-semibold">
                {formatSecondsToClock(todayActivity.timeTaken)}
              </span>
            </p>
            <p className="mt-2 font-body text-xs text-brand-dark-gray">
              Come back tomorrow for a new challenge.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = '/profile';
            }}
          >
            View Profile
          </Button>
        </div>
      </Card>
    );
  }

  if (todayActivity !== null && !todayActivity.solved) {
    return (
      <Card
        title="Daily Puzzle: Attempted"
        variant="elevated"
        className="mx-auto w-full max-w-3xl"
      >
        <div className="rounded-xl border border-brand-dark-gray/20 bg-brand-light-gray p-4 space-y-3">
          <p className="font-sans text-base font-semibold text-brand-dark-gray">
            You already attempted today's puzzle.
          </p>
          <p className="font-body text-xs text-brand-dark-gray">
            A new puzzle resets at midnight. Check your Profile for your history.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = '/profile';
            }}
          >
            View Profile
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Daily Puzzle: ${puzzleTitle}`}
      variant="elevated"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="space-y-5">
        {showConfetti ? (
          <>
            {[...Array(16)].map((_, i) => {
              const colors = [
                '#3B82F6',
                '#7C3AED',
                '#EF4444',
                '#F59E0B',
                '#10B981',
                '#EC4899',
              ];
              const color = colors[i % colors.length];
              const xEnd = (i % 2 === 0 ? 1 : -1) * (80 + (i * 23) % 140);
              const yEnd = -120 - (i * 17) % 200;
              const rotation = (i * 47) % 720;
              return (
                <motion.div
                  key={i}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: i % 2 === 0 ? '50%' : 2,
                    backgroundColor: color,
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: xEnd,
                    y: yEnd,
                    opacity: 0,
                    scale: 0,
                    rotate: rotation,
                  }}
                  transition={{
                    duration: 0.9 + (i % 4) * 0.1,
                    ease: 'easeOut',
                  }}
                />
              );
            })}
          </>
        ) : null}
        <HowToPlayDialog
          open={howToPlayOpen}
          onClose={() => {
            setHowToPlayOpen(false);
            localStorage.setItem('ll-htps', '1');
          }}
        />

        {/* Difficulty + Timer — sticky on mobile so it stays visible while scrolling */}
        <div className="sticky top-16 z-30 flex flex-col items-start justify-between gap-3 rounded-xl bg-brand-light-blue/95 p-3 backdrop-blur-sm sm:relative sm:top-auto sm:z-auto sm:flex-row sm:items-center sm:bg-brand-light-blue/20 sm:backdrop-blur-none">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark-gray">
                Difficulty
              </p>
              <p className="font-sans text-lg font-semibold text-brand-dark">
                Level {puzzle.difficulty}
              </p>
            </div>
            <button
              type="button"
              aria-label="How to play"
              onClick={() => setHowToPlayOpen(true)}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-brand-dark-gray/30 font-sans text-xs font-bold text-brand-dark-gray transition-colors hover:border-brand-blue hover:text-brand-blue focus:outline-none"
            >
              ?
            </button>
          </div>
          <Timer isRunning={!isComplete} onTimeUpdate={handleTimeUpdate} />
        </div>

        {type === 'number-matrix' && 'grid' in puzzle ? (
          <PuzzleGrid
            grid={puzzle.grid}
            missingCell={puzzle.missingCell}
            userAnswer={userAnswer}
            onAnswerChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
          />
        ) : type === 'sequence-solver' && 'sequence' in puzzle ? (
          <div className="space-y-2">
            <p className="font-body text-sm text-brand-dark-gray">
              Rule clue:{' '}
              <span className="font-semibold text-brand-dark">
                {puzzle.rule}
              </span>
            </p>
            <SequenceView
              sequence={puzzle.sequence}
              userAnswer={userAnswer}
              onAnswerChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : type === 'equation-puzzle' && 'equation' in puzzle ? (
          <EquationView
            equation={puzzle.equation}
            userAnswer={userAnswer}
            onAnswerChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
          />
        ) : null}

        {/* Action buttons — full-width on mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="ghost"
            onClick={handleShowHint}
            disabled={hintDisabled}
            className="min-h-[2.75rem] w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              {hintLabel}
              <span className="flex items-center gap-1">
                {Array.from({ length: maxHintLevel }, (_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i < hintLevel ? 'bg-brand-purple' : 'bg-brand-light-steel'
                    }`}
                  />
                ))}
              </span>
            </span>
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={submitDisabled}
            className="min-h-[2.75rem] w-full sm:w-auto"
          >
            {isSaving ? 'Saving...' : 'Submit'}
          </Button>
          {canGiveUp ? (
            <Button
              variant="ghost"
              onClick={() => void handleGiveUp()}
              className="min-h-[2.75rem] w-full text-brand-dark-gray sm:w-auto"
            >
              Give Up
            </Button>
          ) : null}
        </div>

        {showHint ? (
          <HintDrawer
            open={hintDrawerOpen}
            onClose={() => setHintDrawerOpen(false)}
            hint={currentHintText}
            hintLabelText={
              type === 'number-matrix' && hintLevel > 1
                ? `Hint ${hintLevel} of 3`
                : 'Hint'
            }
          />
        ) : null}

        {showTryAgain ? (
          <motion.p
            className="font-sans text-sm font-semibold text-brand-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
            transition={{ duration: 0.4 }}
          >
            {wrongCount >= 3
              ? `Try again — or use "Give Up" to see the answer.`
              : 'Try again'}
          </motion.p>
        ) : null}

        {isGivenUp ? (
          <motion.div
            className="rounded-xl border border-brand-dark-gray/20 bg-brand-light-gray p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-sans text-base font-semibold text-brand-dark-gray">
              The answer was{' '}
              <span className="font-bold text-brand-dark">{puzzle.answer}</span>
            </p>
            <p className="mt-1 font-body text-xs text-brand-dark-gray">
              Better luck tomorrow — a new puzzle resets at midnight.
            </p>
          </motion.div>
        ) : null}

        {showResult ? (
          <motion.div
            className="rounded-xl border border-brand-blue/25 bg-brand-light-sky/35 p-4"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <motion.p
              className="font-sans text-lg font-bold text-brand-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Puzzle solved!
            </motion.p>
            <p className="mt-1 font-body text-sm text-brand-dark">
              Score:{' '}
              <span className="font-semibold"><CountUp value={score} /></span>
              {hintPenalty > 0 ? (
                <span className="ml-1 text-brand-dark-gray">
                  (−{hintPenalty} hint penalty)
                </span>
              ) : null}
            </p>
            <p className="font-body text-sm text-brand-dark">
              Time:{' '}
              <span className="font-semibold">
                {formatSecondsToClock(timeTaken)}
              </span>
            </p>
            <motion.p
              className="mt-2 font-body text-sm text-brand-dark-gray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {winMessages[type]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-4 rounded-xl border border-brand-light-steel bg-brand-light-gray p-3 font-mono text-sm leading-relaxed text-brand-dark whitespace-pre"
            >
              {sharePreviewText}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareScore}
              >
                {copied ? 'Copied!' : typeof navigator.share === 'function' ? 'Share' : 'Copy'}
              </Button>
              <a
                href={generateTweetUrl(sharePreviewText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2rem] items-center rounded-xl border border-brand-dark/20 bg-transparent px-3 py-1 font-sans text-sm font-medium text-brand-dark-gray transition-colors hover:border-brand-dark hover:text-brand-dark focus:outline-none"
              >
                Post to X
              </a>
            </motion.div>
          </motion.div>
        ) : null}

        {saveError ? (
          <p className="font-body text-sm text-brand-accent">
            Saved locally failed: {saveError}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export default PuzzleContainer;
