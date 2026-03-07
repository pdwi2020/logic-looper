import { Fragment } from 'react';
import { motion } from 'framer-motion';

export interface SequenceViewProps {
  sequence: (number | null)[];
  userAnswer: string;
  onAnswerChange: (value: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function SequenceView({
  sequence,
  userAnswer,
  onAnswerChange,
}: SequenceViewProps) {
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-brand-dark-gray">
        Identify the rule and complete the missing term.
      </p>

      <motion.div
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-brand-light-steel bg-brand-light-sky/25 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sequence.map((value, index) => (
          <Fragment key={index}>
            <motion.div
              variants={itemVariants}
              className="flex h-12 min-w-16 items-center justify-center rounded-lg border border-brand-light-steel bg-brand-white px-3 text-base font-semibold text-brand-dark"
            >
              {value === null ? (
                <input
                  aria-label="Sequence answer"
                  type="text"
                  inputMode="numeric"
                  value={userAnswer}
                  onChange={(event) => onAnswerChange(event.target.value)}
                  className="h-9 w-16 rounded-md border border-brand-blue/40 bg-brand-white px-2 text-center font-mono text-base text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
                  placeholder="?"
                />
              ) : (
                <span className="font-mono">{value}</span>
              )}
            </motion.div>

            {index < sequence.length - 1 ? (
              <motion.span
                variants={itemVariants}
                className="text-lg text-brand-blue"
                aria-hidden
              >
                {'->'}
              </motion.span>
            ) : null}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
