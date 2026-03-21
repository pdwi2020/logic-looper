import { motion } from 'framer-motion';

export interface EquationViewProps {
  equation: string;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function EquationView({
  equation,
  userAnswer,
  onAnswerChange,
  onKeyDown,
}: EquationViewProps) {
  // Split on '?' — each gap between parts needs a value box
  const parts = equation.split('?');

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-brand-dark-gray">
        Find the missing value that makes the equation true.
      </p>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-brand-light-steel bg-brand-light-sky/25 p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {parts.map((part, index) => (
          <span key={index} className="flex items-center">
            {part ? (
              <span className="whitespace-pre font-mono text-2xl font-bold text-brand-dark sm:text-3xl">
                {part}
              </span>
            ) : null}

            {index < parts.length - 1 ? (
              index === 0 ? (
                // First '?' — editable input
                <input
                  aria-label="Missing equation value"
                  type="text"
                  inputMode="numeric"
                  value={userAnswer}
                  onChange={(event) => onAnswerChange(event.target.value)}
                  onKeyDown={onKeyDown}
                  autoFocus
                  className="mx-1 h-12 w-20 rounded-md border-2 border-brand-blue/60 bg-brand-white px-2 text-center font-mono text-2xl font-bold text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 sm:h-14 sm:w-24 sm:text-3xl"
                  placeholder="?"
                />
              ) : (
                // Subsequent '?' (e.g. "? × ? = 36") — mirrors the input value
                <span className="mx-1 inline-flex h-12 w-20 items-center justify-center rounded-md border-2 border-brand-blue/30 bg-brand-light-lavender font-mono text-2xl font-bold text-brand-dark sm:h-14 sm:w-24 sm:text-3xl">
                  {userAnswer || '?'}
                </span>
              )
            ) : null}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
