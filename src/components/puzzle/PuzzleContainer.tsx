import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { SequenceView } from '@/components/puzzle/SequenceView';
import { EquationView } from '@/components/puzzle/EquationView';
import { Timer } from '@/components/puzzle/Timer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveActivity } from '@/db/operations';
import { generateDailyPuzzle, validatePuzzleAnswer } from '@/engine';
import type { PuzzleType } from '@/engine';
import type { NumberMatrixPuzzle } from '@/engine/puzzles/numberMatrix';
import { puzzleCompleted } from '@/store/slices';
import type { AppDispatch } from '@/store/store';

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

  const handleTimeUpdate = useCallback((seconds: number) => {
    setTimeTaken(seconds);
  }, []);

  const handleAnswerChange = useCallback((value: string) => {
    setUserAnswer(value);
    setShowTryAgain(false);
  }, []);

  const handleShowHint = useCallback(() => {
    setHintLevel((prev) => Math.min(prev + 1, maxHintLevel));
  }, [maxHintLevel]);

  const handleSubmit = useCallback(async () => {
    if (isComplete || isSaving || isGivenUp) {
      return;
    }

    const numericAnswer = Number(userAnswer.trim());
    if (!Number.isFinite(numericAnswer)) {
      setShowTryAgain(true);
      setWrongCount((c) => c + 1);
      return;
    }

    const isCorrect = validatePuzzleAnswer(puzzle, type, numericAnswer);

    if (!isCorrect) {
      setShowTryAgain(true);
      setWrongCount((c) => c + 1);
      return;
    }

    const currentHintPenalty = hintLevel * 10;
    const baseScore = calculateScore(timeTaken, puzzle.difficulty);
    const finalScore = Math.max(0, baseScore - currentHintPenalty);

    setScore(finalScore);
    setIsComplete(true);
    setShowResult(true);
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

  const handleShareScore = useCallback(() => {
    const dayNumber = (Math.floor(Date.now() / 86_400_000) % 365) + 1;
    const text = `I scored ${score} pts on Logic Looper Day ${dayNumber} (Difficulty ${puzzle.difficulty}) ⚡ https://logic-looper-ruby.vercel.app`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [score, puzzle.difficulty]);

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

  return (
    <Card
      title={`Daily Puzzle: ${puzzleTitle}`}
      variant="elevated"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="space-y-5">
        {/* Difficulty + Timer — sticky on mobile so it stays visible while scrolling */}
        <div className="sticky top-16 z-30 flex flex-col items-start justify-between gap-3 rounded-xl bg-brand-light-blue/95 p-3 backdrop-blur-sm sm:relative sm:top-auto sm:z-auto sm:flex-row sm:items-center sm:bg-brand-light-blue/20 sm:backdrop-blur-none">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark-gray">
              Difficulty
            </p>
            <p className="font-sans text-lg font-semibold text-brand-dark">
              Level {puzzle.difficulty}
            </p>
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
            {hintLabel}
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
          <motion.div
            className="rounded-lg border border-brand-accent/30 bg-brand-light-lavender px-3 py-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {type === 'number-matrix' && hintLevel > 1 ? (
              <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-brand-dark-gray">
                Hint {hintLevel} of 3
              </p>
            ) : null}
            <p className="font-body text-sm text-brand-dark">
              {currentHintText}
            </p>
          </motion.div>
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
              <span className="font-semibold">{score}</span>
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
              className="mt-3"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareScore}
              >
                {copied ? 'Copied!' : 'Share Score'}
              </Button>
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
