import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { SequenceView } from '@/components/puzzle/SequenceView';
import { Timer } from '@/components/puzzle/Timer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveActivity } from '@/db/operations';
import { generateDailyPuzzle, validatePuzzleAnswer } from '@/engine';
import { puzzleCompleted } from '@/store/slices';
import type { AppDispatch } from '@/store/store';

function formatSecondsToClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function PuzzleContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const dailyPuzzle = useMemo(() => generateDailyPuzzle(), []);
  const { puzzle, type } = dailyPuzzle;

  const [userAnswer, setUserAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
    setShowHint(true);
    setHintPenalty((currentPenalty) =>
      currentPenalty === 0 ? 10 : currentPenalty,
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isComplete || isSaving) {
      return;
    }

    const numericAnswer = Number(userAnswer.trim());
    if (!Number.isFinite(numericAnswer)) {
      setShowTryAgain(true);
      return;
    }

    const isCorrect = validatePuzzleAnswer(puzzle, type, numericAnswer);

    if (!isCorrect) {
      setShowTryAgain(true);
      return;
    }

    const baseScore = Math.max(10, 100 - timeTaken);
    const finalScore = Math.max(0, baseScore - hintPenalty);

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
    hintPenalty,
    isComplete,
    isSaving,
    puzzle,
    timeTaken,
    today,
    type,
    userAnswer,
  ]);

  const submitDisabled =
    userAnswer.trim().length === 0 || isComplete || isSaving;
  const puzzleTitle =
    type === 'number-matrix' ? 'Number Matrix' : 'Sequence Solver';

  return (
    <Card
      title={`Daily Puzzle: ${puzzleTitle}`}
      variant="elevated"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="space-y-5">
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-brand-light-blue/20 p-3 sm:flex-row sm:items-center">
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
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            onClick={handleShowHint}
            disabled={showHint || isComplete}
          >
            Hint (-10)
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitDisabled}>
            {isSaving ? 'Saving...' : 'Submit'}
          </Button>
        </div>

        {showHint ? (
          <motion.p
            className="rounded-lg border border-brand-accent/30 bg-brand-light-lavender px-3 py-2 font-body text-sm text-brand-dark"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hint: {puzzle.hint}
          </motion.p>
        ) : null}

        {showTryAgain ? (
          <motion.p
            className="font-sans text-sm font-semibold text-brand-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
            transition={{ duration: 0.4 }}
          >
            Try again
          </motion.p>
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
              Score: <span className="font-semibold">{score}</span>
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
              Great focus and pattern recognition.
            </motion.p>
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
