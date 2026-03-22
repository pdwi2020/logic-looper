import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

export interface CardProps {
  title: string;
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'border border-brand-light-steel bg-brand-white shadow-sm shadow-brand-dark/5',
  elevated:
    'border border-brand-light-blue bg-brand-white shadow-lg shadow-brand-blue/20',
  outlined:
    'border-2 border-brand-purple/40 bg-brand-light-lavender shadow-sm shadow-brand-purple/10',
  glass:
    'border border-white/20 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-md',
};

const joinClasses = (...classes: Array<string | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function Card({
  title,
  children,
  variant = 'default',
  className,
}: CardProps) {
  return (
    <motion.article
      className={joinClasses(
        'rounded-2xl p-6',
        variantClasses[variant],
        className,
      )}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h3 className="font-sans text-xl font-semibold text-brand-dark">
        {title}
      </h3>
      <div className="mt-3 font-body text-sm leading-6 text-brand-dark-gray">
        {children}
      </div>
    </motion.article>
  );
}
