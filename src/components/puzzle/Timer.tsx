import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (seconds: number) => void;
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function Timer({ isRunning, onTimeUpdate }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    onTimeUpdate(0);
  }, [onTimeUpdate]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return;
    }

    if (intervalRef.current !== null) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSeconds((currentSeconds) => {
        const nextSeconds = currentSeconds + 1;
        onTimeUpdate(nextSeconds);
        return nextSeconds;
      });
    }, 1_000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onTimeUpdate]);

  useEffect(
    () => () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [],
  );

  const timerLabel = useMemo(() => formatTimer(seconds), [seconds]);
  const shouldPulse = seconds > 60;
  const timeColor =
    seconds > 90
      ? 'text-brand-accent'
      : seconds > 60
        ? 'text-amber-500'
        : 'text-brand-dark';

  return (
    <motion.div
      className="rounded-xl border border-brand-light-steel bg-brand-white px-4 py-2 text-right"
      animate={shouldPulse ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={
        shouldPulse
          ? { duration: 1, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }
          : { duration: 0.2 }
      }
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark-gray">
        Time
      </p>
      <p className={`font-mono text-2xl font-bold transition-colors ${timeColor}`}>
        {timerLabel}
      </p>
    </motion.div>
  );
}
