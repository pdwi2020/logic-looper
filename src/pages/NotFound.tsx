import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-night shadow-lg shadow-brand-dark/20">
          <span className="font-mono text-4xl font-bold text-brand-blue">?</span>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark-gray">
            404 — Not Found
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold text-brand-dark md:text-4xl">
            This page doesn't exist.
          </h1>
          <p className="mt-3 font-body text-base text-brand-dark-gray">
            It may have moved, or you may have followed a broken link.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link to="/puzzle">
            <Button variant="ghost">Play Today's Puzzle</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
