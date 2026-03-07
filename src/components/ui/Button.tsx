import type { MouseEventHandler, ReactNode } from 'react';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-blue text-brand-white shadow-sm shadow-brand-blue/30 hover:bg-brand-deep-purple focus-visible:ring-brand-blue active:bg-brand-purple',
  secondary:
    'bg-brand-purple text-brand-white shadow-sm shadow-brand-purple/30 hover:bg-brand-deep-purple focus-visible:ring-brand-purple active:bg-brand-blue',
  accent:
    'bg-brand-accent text-brand-dark shadow-sm shadow-brand-accent/30 hover:bg-brand-accent/90 focus-visible:ring-brand-accent active:bg-brand-accent/80',
  ghost:
    'border border-brand-blue bg-transparent text-brand-blue hover:bg-brand-light-blue focus-visible:ring-brand-blue active:bg-brand-light-periwinkle',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-lg',
};

const joinClasses = (...classes: Array<string | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={joinClasses(
        'inline-flex items-center justify-center rounded-lg font-sans font-semibold transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-light-gray',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
